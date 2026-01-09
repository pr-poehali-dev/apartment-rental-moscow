-- Создание таблицы property_rooms для номеров/апартаментов
CREATE TABLE IF NOT EXISTS t_p27119953_apartment_rental_mos.property_rooms (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES t_p27119953_apartment_rental_mos.properties(id),
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100),
    price NUMERIC(10,2) NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 1,
    area NUMERIC(10,2),
    description TEXT,
    amenities TEXT[],
    is_published BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы property_photos для фотографий объектов
CREATE TABLE IF NOT EXISTS t_p27119953_apartment_rental_mos.property_photos (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES t_p27119953_apartment_rental_mos.properties(id),
    photo_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы property_room_photos для фотографий номеров
CREATE TABLE IF NOT EXISTS t_p27119953_apartment_rental_mos.property_room_photos (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES t_p27119953_apartment_rental_mos.property_rooms(id),
    photo_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_property_rooms_property_id ON t_p27119953_apartment_rental_mos.property_rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_property_id ON t_p27119953_apartment_rental_mos.property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_property_room_photos_room_id ON t_p27119953_apartment_rental_mos.property_room_photos(room_id);
