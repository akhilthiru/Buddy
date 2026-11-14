/**
 * Flatmate Platform – Micro-Market Geolocation & Centroid Coarsening Service
 * 
 * DPDP Act 2023 Section 8 Compliance & Anti-Stalking Geofence Hardening (TH-I-02, TC-SEC-13).
 * Prohibits high-precision GPS coordinate capture or exposure.
 * Enforces coarsening to predefined Trivandrum micro-market centroids with +/- 1.5km to 2.5km fuzzing.
 */

export interface MicroMarketCentroid {
  suburb: string;
  latitude: number;
  longitude: number;
  fuzzRadiusKm: number;
  zone: string;
}

export const TRIVANDRUM_CENTROIDS: Record<string, MicroMarketCentroid> = {
  KAZHAKKOOTTAM: {
    suburb: 'KAZHAKKOOTTAM',
    latitude: 8.5686,
    longitude: 76.8731,
    fuzzRadiusKm: 2.5,
    zone: 'North Tech Corridor',
  },
  KARIAVATTOM: {
    suburb: 'KARIAVATTOM',
    latitude: 8.5583,
    longitude: 76.8833,
    fuzzRadiusKm: 2.0,
    zone: 'North Tech Corridor',
  },
  SREEKARYAM: {
    suburb: 'SREEKARYAM',
    latitude: 8.5472,
    longitude: 76.9167,
    fuzzRadiusKm: 2.0,
    zone: 'Central Academic Zone',
  },
  ULLOOR: {
    suburb: 'ULLOOR',
    latitude: 8.5333,
    longitude: 76.9250,
    fuzzRadiusKm: 2.0,
    zone: 'Central Academic Zone',
  },
  PATTOM: {
    suburb: 'PATTOM',
    latitude: 8.5250,
    longitude: 76.9400,
    fuzzRadiusKm: 1.5,
    zone: 'East Residential Corridor',
  },
  KOWDIAR: {
    suburb: 'KOWDIAR',
    latitude: 8.5240,
    longitude: 76.9600,
    fuzzRadiusKm: 1.5,
    zone: 'East Residential Corridor',
  },
  MANACAUD: {
    suburb: 'MANACAUD',
    latitude: 8.4720,
    longitude: 76.9500,
    fuzzRadiusKm: 2.0,
    zone: 'South Central Hub',
  },
};

export class CentroidGeocodingService {
  /**
   * Retrieves coarse centroid coordinates for a given Trivandrum suburb.
   * If suburb is unrecognized, defaults to central Trivandrum anchor.
   */
  static getCentroid(suburb: string): MicroMarketCentroid {
    const key = (suburb || '').trim().toUpperCase();
    if (TRIVANDRUM_CENTROIDS[key]) {
      return TRIVANDRUM_CENTROIDS[key];
    }

    // Default fallback anchor: Trivandrum Central
    return {
      suburb: key || 'TRIVANDRUM_CENTRAL',
      latitude: 8.5241,
      longitude: 76.9366,
      fuzzRadiusKm: 3.0,
      zone: 'Greater Trivandrum Zone',
    };
  }

  /**
   * Validates whether a given lat/long corresponds to a static coarsened centroid
   * rather than a precision street-level GPS coordinate.
   */
  static isCentroidCompliant(suburb: string, lat: number, lng: number): boolean {
    const centroid = this.getCentroid(suburb);
    const latDiff = Math.abs(lat - centroid.latitude);
    const lngDiff = Math.abs(lng - centroid.longitude);
    // Lat/Lng precision within 0.0001 degrees of the designated centroid
    return latDiff < 0.0001 && lngDiff < 0.0001;
  }

  /**
   * Calculates approximate distance in kilometers between two centroids (Haversine formula).
   */
  static getCoarseDistanceKm(suburbA: string, suburbB: string): number {
    const cA = this.getCentroid(suburbA);
    const cB = this.getCentroid(suburbB);

    const R = 6371; // Earth radius in km
    const dLat = ((cB.latitude - cA.latitude) * Math.PI) / 180;
    const dLon = ((cB.longitude - cA.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((cA.latitude * Math.PI) / 180) *
        Math.cos((cB.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }
}
