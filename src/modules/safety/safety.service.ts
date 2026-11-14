import crypto from 'node:crypto';
import { db } from '../../database/in-memory-db.ts';
import { BadRequestError, NotFoundError } from '../../common/errors/problem-details.ts';
import type {
  BlockUserRequest,
  ReportUserRequest,
  ReportUserResponse,
} from './safety.types.ts';

export class SafetyService {
  /**
   * Instantly blocks a user bidirectionally (FR-27).
   */
  static blockUser(blockerUserId: string, req: BlockUserRequest): { success: boolean } {
    if (blockerUserId === req.targetUserId) {
      throw new BadRequestError('Cannot block yourself');
    }

    const targetUser = db.users.get(req.targetUserId);
    if (!targetUser) {
      throw new NotFoundError('Target user not found');
    }

    const alreadyBlocked = db.userBlocks.some(
      (b) => b.blockerUserId === blockerUserId && b.blockedUserId === req.targetUserId
    );

    if (!alreadyBlocked) {
      db.userBlocks.push({
        id: crypto.randomUUID(),
        blockerUserId,
        blockedUserId: req.targetUserId,
        reason: req.reason,
        createdAt: new Date(),
      });
    }

    // Terminate any active conversation
    const conv = db.conversations.find(
      (c) =>
        (c.user1Id === blockerUserId && c.user2Id === req.targetUserId) ||
        (c.user2Id === blockerUserId && c.user1Id === req.targetUserId)
    );
    if (conv) {
      conv.status = 'TERMINATED';
    }

    return { success: true };
  }

  /**
   * Unblocks a user.
   */
  static unblockUser(blockerUserId: string, targetUserId: string): { success: boolean } {
    const index = db.userBlocks.findIndex(
      (b) => b.blockerUserId === blockerUserId && b.blockedUserId === targetUserId
    );
    if (index === -1) {
      throw new NotFoundError('Block record not found');
    }

    db.userBlocks.splice(index, 1);
    return { success: true };
  }

  /**
   * Reports user for abuse/harassment with auto-quarantine trigger (FR-28).
   * Threshold: >= 2 reports in 24 hours OR >= 3 total reports.
   */
  static reportUser(reporterUserId: string, req: ReportUserRequest): ReportUserResponse {
    if (reporterUserId === req.targetUserId) {
      throw new BadRequestError('Cannot report yourself');
    }

    const targetUser = db.users.get(req.targetUserId);
    if (!targetUser) {
      throw new NotFoundError('Target user not found');
    }

    if (!req.details || req.details.trim().length < 10) {
      throw new BadRequestError('Report details must be at least 10 characters describing the incident');
    }

    const validCategories = [
      'HARASSMENT_OR_ABUSE',
      'SPAM_OR_COMMERCIAL_BROKER',
      'FAKE_PROFILE_IMPERSONATION',
      'MORAL_POLICING_OR_DISCRIMINATION',
    ];
    if (!validCategories.includes(req.category)) {
      throw new BadRequestError(`Invalid report category: ${req.category}`);
    }

    const reportId = crypto.randomUUID();
    const now = new Date();

    db.userReports.push({
      id: reportId,
      reporterUserId,
      reportedUserId: req.targetUserId,
      category: req.category,
      details: req.details.trim(),
      status: 'PENDING_REVIEW',
      createdAt: now,
    });

    // Auto-Quarantine logic
    const reportsForTarget = db.userReports.filter((r) => r.reportedUserId === req.targetUserId);
    const oneDayAgo = new Date(now.getTime() - 24 * 3600 * 1000);
    const recentReports = reportsForTarget.filter((r) => r.createdAt >= oneDayAgo);

    let status: 'PENDING_REVIEW' | 'ACTIONED_QUARANTINE' = 'PENDING_REVIEW';
    let message = 'Report submitted. Thank you for keeping our community safe.';

    if (recentReports.length >= 2 || reportsForTarget.length >= 3) {
      targetUser.status = 'QUARANTINED';
      status = 'ACTIONED_QUARANTINE';
      message = 'User has been automatically quarantined pending administrator review.';

      for (const r of reportsForTarget) {
        if (r.status === 'PENDING_REVIEW') {
          r.status = 'ACTIONED_QUARANTINE';
          r.actionedAt = now;
        }
      }
    }

    return {
      reportId,
      status,
      message,
    };
  }
}
