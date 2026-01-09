-- Add My loft Войковская hotel
INSERT INTO t_p27119953_apartment_rental_mos.properties 
(type, status, name, description, address, metro, price, owner_name, owner_phone, owner_telegram, amenities, created_at, updated_at, created_by) 
VALUES 
('hotel', 'active', 'My loft Войковская', 'Современные апартаменты в стиле лофт рядом с метро Войковская', 'Москва, ул. Войковская, 10', 'Войковская', 4500.00, 'Мария Петрова', '+7 915 555 12 34', '@maria_loft', ARRAY['wifi', 'parking', 'ac', 'tv', 'kitchen'], NOW(), NOW(), 'hab-agent@mail.ru');

-- Add rooms for My loft Войковская
INSERT INTO t_p27119953_apartment_rental_mos.property_rooms 
(property_id, name, type, price, capacity, area, amenities, description, is_published, is_archived)
SELECT id, 'Студия Comfort', 'Студия', 3000, 2, 28, ARRAY['wifi', 'ac', 'tv', 'kitchen'], 'Уютная студия с современным ремонтом', true, false
FROM t_p27119953_apartment_rental_mos.properties WHERE name = 'My loft Войковская';

INSERT INTO t_p27119953_apartment_rental_mos.property_rooms 
(property_id, name, type, price, capacity, area, amenities, description, is_published, is_archived)
SELECT id, 'Лофт Премиум', 'Лофт', 5500, 4, 45, ARRAY['wifi', 'ac', 'tv', 'kitchen', 'washer'], 'Просторный лофт с высокими потолками', true, false
FROM t_p27119953_apartment_rental_mos.properties WHERE name = 'My loft Войковская';