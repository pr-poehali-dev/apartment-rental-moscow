-- Таблица владельцев отелей
CREATE TABLE IF NOT EXISTS owners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    telegram VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отелей/объектов
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES owners(id),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    metro VARCHAR(100) NOT NULL,
    description TEXT,
    phone VARCHAR(20),
    telegram VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(50) DEFAULT 'hotels',
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий номеров
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES hotels(id),
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    area INTEGER NOT NULL,
    description TEXT,
    min_hours INTEGER DEFAULT 2,
    telegram VARCHAR(100),
    phone VARCHAR(20),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица особенностей номеров
CREATE TABLE IF NOT EXISTS room_features (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    icon VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL
);

-- Таблица удобств номеров
CREATE TABLE IF NOT EXISTS room_amenities (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    amenity VARCHAR(255) NOT NULL
);

-- Таблица изображений номеров
CREATE TABLE IF NOT EXISTS room_images (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(id),
    image_url VARCHAR(500) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_hotels_published ON hotels(published);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_published ON rooms(published);
CREATE INDEX IF NOT EXISTS idx_room_images_room ON room_images(room_id);