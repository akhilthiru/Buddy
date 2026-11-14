import type { TrivandrumSuburb } from '../matching/matching.types.ts';

export interface CreateRoomListingRequest {
  roomType: 'PRIVATE_ROOM' | 'SHARED_ROOM';
  sharingCount?: number;
  bathroomType: 'ATTACHED_PRIVATE' | 'SHARED';
  monthlyRent: number;
  securityDeposit: number;
  availableFrom: string; // YYYY-MM-DD
  locationSuburb: TrivandrumSuburb;
  amenities: string[];
}

export interface RoomPhotoItem {
  id: string;
  photoUrl: string;
  orderIndex: number;
}

export interface RoomListingResponse {
  id: string;
  userId: string;
  roomType: 'PRIVATE_ROOM' | 'SHARED_ROOM';
  sharingCount?: number;
  bathroomType: 'ATTACHED_PRIVATE' | 'SHARED';
  monthlyRent: number;
  securityDeposit: number;
  availableFrom: string;
  locationSuburb: TrivandrumSuburb;
  amenities: string[];
  photos: RoomPhotoItem[];
  createdAt: string;
  updatedAt: string;
}
