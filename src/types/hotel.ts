export interface RoomFeature {
  icon: string;
  label: string;
}

export interface Room {
  id: number;
  name: string;
  images: string[];
  price: number;
  area: number;
  description: string;
  features: RoomFeature[];
  amenities: string[];
  telegram: string;
  phone?: string;
  minHours: number;
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  metro: string;
  description: string;
  phone?: string;
  rooms: Room[];
}