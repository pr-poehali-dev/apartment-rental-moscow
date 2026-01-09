-- Создание таблицы properties для личного кабинета
CREATE TABLE IF NOT EXISTS t_p27119953_apartment_rental_mos.properties (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('hotel', 'apartment', 'sauna', 'conference')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'archived', 'draft')),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address VARCHAR(300) NOT NULL,
    metro VARCHAR(100),
    price NUMERIC(10,2),
    rating NUMERIC(3,2),
    
    -- Контакты собственника
    owner_name VARCHAR(100) NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    owner_telegram VARCHAR(50),
    
    -- Медиа
    main_photo TEXT,
    
    -- Удобства (массив id удобств)
    amenities TEXT[],
    
    -- Метаданные
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_properties_type ON t_p27119953_apartment_rental_mos.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON t_p27119953_apartment_rental_mos.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_name ON t_p27119953_apartment_rental_mos.properties(name);
