import crypto from 'node:crypto';
import { env } from '../../config/env.ts';

export class CryptoUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 12; // 96-bit IV
  private static readonly TAG_LENGTH = 16; // 128-bit auth tag

  /**
   * Deterministic HMAC-SHA256 hash for indexed lookups (phone_hash, email_hash).
   */
  static hashDeterministic(input: string): string {
    return crypto
      .createHmac('sha256', env.HMAC_SALT)
      .update(input.trim().toLowerCase())
      .digest('hex');
  }

  /**
   * Encrypts plaintext string using AES-256-GCM (DPDP-compliant at-rest encryption).
   * Buffer format: [12-byte IV][Ciphertext][16-byte Auth Tag]
   */
  static encryptAesGcm(plaintext: string): Buffer {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, encrypted, authTag]);
  }

  /**
   * Decrypts buffer produced by encryptAesGcm.
   */
  static decryptAesGcm(data: Buffer): string {
    const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');
    const iv = data.subarray(0, this.IV_LENGTH);
    const authTag = data.subarray(data.length - this.TAG_LENGTH);
    const ciphertext = data.subarray(this.IV_LENGTH, data.length - this.TAG_LENGTH);

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  }

  /**
   * Hashes a secret (OTP or password) using scrypt (Node native) or Argon2.
   */
  static async hashSecret(secret: string): Promise<string> {
    try {
      // Dynamic import if argon2 is installed
      const argon = await import('argon2');
      return await argon.hash(secret, {
        type: argon.argon2id,
        memoryCost: 19456,
        timeCost: 2,
        parallelism: 1,
      });
    } catch {
      // Standard Node.js scrypt KDF fallback
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.scryptSync(secret, salt, 64).toString('hex');
      return `scrypt$${salt}$${hash}`;
    }
  }

  /**
   * Verifies secret against hashed string.
   */
  static async verifySecret(hashed: string, candidate: string): Promise<boolean> {
    try {
      if (hashed.startsWith('$argon2')) {
        const argon = await import('argon2');
        return await argon.verify(hashed, candidate);
      }
      if (hashed.startsWith('scrypt$')) {
        const [, salt, originalHash] = hashed.split('$');
        const candidateHash = crypto.scryptSync(candidate, salt, 64).toString('hex');
        return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(candidateHash, 'hex'));
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Mask Indian phone number for DPDP compliance: +91 ****** 1234
   */
  static maskPhone(phone: string): string {
    const clean = phone.replace(/\D/g, '');
    const last4 = clean.slice(-4);
    return `+91 ****** ${last4}`;
  }

  /**
   * Mask email for display: a***l@domain.com
   */
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return '***';
    const firstChar = local.charAt(0);
    return `${firstChar}***@${domain}`;
  }
}
