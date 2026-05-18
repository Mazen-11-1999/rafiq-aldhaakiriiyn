
export interface LocationCoords {
  lat: number;
  lng: number;
  city?: string;
}

export class LocationService {
  private static STORAGE_KEY = 'rafeeq_user_coords';

  static async getCurrentLocation(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.saveLocation(coords);
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }

  static saveLocation(coords: LocationCoords) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coords));
  }

  static getSavedLocation(): LocationCoords | null {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
