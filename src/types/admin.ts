export const API_URL = 'https://functions.poehali.dev/1961571b-26cd-4f80-9709-45455d336430';

export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PropertyType = 'hotel' | 'apartment' | 'sauna' | 'conference';
export type PropertyStatus = 'active' | 'archived' | 'draft';

export interface PropertyOwner {
  name: string;
  phone: string;
  telegram?: string;
}

export interface PropertyAmenity {
  id: string;
  label: string;
  icon?: string;
}

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  area?: number;
  amenities: string[];
  photos: string[];
  description?: string;
  isPublished: boolean;
  isArchived: boolean;
}

export interface Property {
  id: string;
  type: PropertyType;
  status: PropertyStatus;
  name: string;
  description: string;
  address: string;
  metro?: string;
  owner: PropertyOwner;
  mainPhoto: string;
  photos: string[];
  amenities: string[];
  rooms: Room[];
  price?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ImageUpload {
  file: File;
  preview: string;
}

export const AMENITIES: PropertyAmenity[] = [
  { id: 'wifi', label: 'Wi-Fi', icon: 'Wifi' },
  { id: 'parking', label: 'Парковка', icon: 'Car' },
  { id: 'pool', label: 'Бассейн', icon: 'Waves' },
  { id: 'gym', label: 'Тренажерный зал', icon: 'Dumbbell' },
  { id: 'restaurant', label: 'Ресторан', icon: 'UtensilsCrossed' },
  { id: 'spa', label: 'СПА', icon: 'Sparkles' },
  { id: 'ac', label: 'Кондиционер', icon: 'Wind' },
  { id: 'tv', label: 'Телевизор', icon: 'Tv' },
  { id: 'kitchen', label: 'Кухня', icon: 'CookingPot' },
  { id: 'washer', label: 'Стиральная машина', icon: 'WashingMachine' },
  { id: 'pets', label: 'Можно с питомцами', icon: 'PawPrint' },
  { id: 'breakfast', label: 'Завтрак включен', icon: 'Coffee' },
];
