import crypto from 'node:crypto';
import { db, type DbRoomListing } from '../../database/in-memory-db.ts';
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from '../../common/errors/problem-details.ts';
import type {
  CreateRoomListingRequest,
  RoomListingResponse,
  RoomPhotoItem,
} from './listings.types.ts';

export class ListingsService {
  static getListing(userId: string): RoomListingResponse {
    const listing = db.roomListings.get(userId);
    if (!listing) {
      throw new NotFoundError('No room listing found for this user');
    }

    return {
      id: listing.id,
      userId: listing.userId,
      roomType: listing.roomType,
      sharingCount: listing.sharingCount,
      bathroomType: listing.bathroomType,
      monthlyRent: listing.monthlyRent,
      securityDeposit: listing.securityDeposit,
      availableFrom: listing.availableFrom,
      locationSuburb: listing.locationSuburb,
      amenities: listing.amenities,
      photos: listing.photos,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    };
  }

  static getListingById(listingId: string): RoomListingResponse {
    const listing = Array.from(db.roomListings.values()).find((l) => l.id === listingId);
    if (!listing) {
      throw new NotFoundError('Room listing not found');
    }

    return {
      id: listing.id,
      userId: listing.userId,
      roomType: listing.roomType,
      sharingCount: listing.sharingCount,
      bathroomType: listing.bathroomType,
      monthlyRent: listing.monthlyRent,
      securityDeposit: listing.securityDeposit,
      availableFrom: listing.availableFrom,
      locationSuburb: listing.locationSuburb,
      amenities: listing.amenities,
      photos: listing.photos,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    };
  }

  static createOrUpdateListing(
    userId: string,
    req: CreateRoomListingRequest
  ): RoomListingResponse {
    const profile = db.userProfiles.get(userId);
    if (!profile) {
      throw new BadRequestError('User profile required before creating a room listing');
    }

    if (profile.modality !== 'MODALITY_1' && profile.modality !== 'MODALITY_3') {
      throw new ForbiddenError(
        'Room listings can only be created by users in Modality 1 (Has room) or Modality 3 (Relocating)'
      );
    }

    if (req.monthlyRent <= 0) {
      throw new BadRequestError('Monthly rent must be greater than 0');
    }

    if (req.securityDeposit < 0) {
      throw new BadRequestError('Security deposit cannot be negative');
    }

    if (req.roomType === 'SHARED_ROOM' && (!req.sharingCount || req.sharingCount < 2)) {
      throw new BadRequestError('Shared room requires sharingCount of at least 2');
    }

    const now = new Date();
    let listing = db.roomListings.get(userId);

    if (!listing) {
      listing = {
        id: crypto.randomUUID(),
        userId,
        roomType: req.roomType,
        sharingCount: req.sharingCount,
        bathroomType: req.bathroomType,
        monthlyRent: req.monthlyRent,
        securityDeposit: req.securityDeposit,
        availableFrom: req.availableFrom,
        locationSuburb: req.locationSuburb,
        amenities: req.amenities || [],
        photos: [],
        createdAt: now,
        updatedAt: now,
      };
      db.roomListings.set(userId, listing);
    } else {
      listing.roomType = req.roomType;
      listing.sharingCount = req.sharingCount;
      listing.bathroomType = req.bathroomType;
      listing.monthlyRent = req.monthlyRent;
      listing.securityDeposit = req.securityDeposit;
      listing.availableFrom = req.availableFrom;
      listing.locationSuburb = req.locationSuburb;
      listing.amenities = req.amenities || [];
      listing.updatedAt = now;
    }

    return this.getListing(userId);
  }

  static deleteListing(userId: string): void {
    const listing = db.roomListings.get(userId);
    if (!listing) {
      throw new NotFoundError('No room listing found to delete');
    }
    db.roomListings.delete(userId);
  }

  static addPhoto(userId: string, photoUrl: string, orderIndex: number): RoomPhotoItem {
    const listing = db.roomListings.get(userId);
    if (!listing) {
      throw new NotFoundError('Please create a room listing before uploading photos');
    }

    if (listing.photos.length >= 4) {
      throw new BadRequestError('Maximum 4 room photos allowed per listing');
    }

    const photo: RoomPhotoItem = {
      id: crypto.randomUUID(),
      photoUrl,
      orderIndex,
    };

    listing.photos.push(photo);
    listing.photos.sort((a, b) => a.orderIndex - b.orderIndex);
    return photo;
  }
}
