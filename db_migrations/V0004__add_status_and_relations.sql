-- Добавляем статусы для публикации и архивации
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES owners(id);

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_hotels_published ON hotels(is_published) WHERE NOT is_archived;
CREATE INDEX IF NOT EXISTS idx_hotels_owner ON hotels(owner_id);
CREATE INDEX IF NOT EXISTS idx_rooms_published ON rooms(is_published) WHERE NOT is_archived;