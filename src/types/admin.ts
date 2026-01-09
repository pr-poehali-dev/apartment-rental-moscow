export const API_URL = 'https://functions.poehali.dev/1961571b-26cd-4f80-9709-45455d336430';

export interface Owner {
  id: number;
  name: string;
  phone?: string;
  telegram?: string;
}

export interface Room {
  id: number;
  name: string;
  price: number;
  area: number;
  description?: string;
  min_hours?: number;
  is_published: boolean;
  is_archived: boolean;
  images?: string[];
}

export interface Hotel {
  id: number;
  name: string;
  address: string;
  metro: string;
  description?: string;
  phone?: string;
  telegram?: string;
  owner_id?: number;
  owner_name?: string;
  category?: string;
  is_published: boolean;
  is_archived: boolean;
  rooms: Room[];
}

export interface ImageUpload {
  file: File;
  preview: string;
}
