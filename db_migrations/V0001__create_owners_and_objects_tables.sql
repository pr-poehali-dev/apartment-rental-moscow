-- Таблица собственников (владельцев объектов)
CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    telegram VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Таблица объектов недвижимости
CREATE TABLE objects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES owners(id),
    category VARCHAR(20) NOT NULL CHECK (category IN ('hotel', 'apartment', 'sauna', 'conference')),
    name VARCHAR(200) NOT NULL,
    address VARCHAR(300) NOT NULL,
    metro VARCHAR(100),
    area DECIMAL(10, 2),
    rooms INTEGER,
    price_per_hour DECIMAL(10, 2),
    min_hours INTEGER DEFAULT 1,
    lat DECIMAL(10, 7),
    lon DECIMAL(10, 7),
    image_url TEXT,
    telegram_contact VARCHAR(50),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статистики просмотров и кликов
CREATE TABLE object_stats (
    id SERIAL PRIMARY KEY,
    object_id INTEGER NOT NULL REFERENCES objects(id),
    views_count INTEGER DEFAULT 0,
    telegram_clicks_count INTEGER DEFAULT 0,
    last_view_at TIMESTAMP,
    last_click_at TIMESTAMP
);

-- Таблица акций и предложений для собственников
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_objects_owner_id ON objects(owner_id);
CREATE INDEX idx_objects_category ON objects(category);
CREATE INDEX idx_objects_published ON objects(is_published);
CREATE INDEX idx_object_stats_object_id ON object_stats(object_id);

COMMENT ON TABLE owners IS 'Собственники объектов недвижимости';
COMMENT ON TABLE objects IS 'Объекты недвижимости (отели, апартаменты, сауны, конференц-залы)';
COMMENT ON TABLE object_stats IS 'Статистика просмотров и кликов по объектам';
COMMENT ON TABLE promotions IS 'Акции и специальные предложения для собственников';