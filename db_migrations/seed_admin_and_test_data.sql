-- Создание администратора и тестовых данных для платформы 120 минут
-- Этот скрипт НЕ является миграцией, запускайте его вручную через SQL клиент

-- 1. Создание администратора
-- Логин: admin
-- Пароль: admin123 (хеш SHA256)
INSERT INTO owners (username, password_hash, full_name, phone, telegram, is_active)
VALUES (
    'admin',
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- admin123
    'Администратор',
    '+7 (999) 999-99-99',
    '@admin120',
    true
) ON CONFLICT (username) DO NOTHING;

-- 2. Создание тестовых собственников
INSERT INTO owners (username, password_hash, full_name, phone, telegram, is_active)
VALUES 
(
    'ivanov',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- password: admin
    'Иванов Иван Иванович',
    '+7 (911) 123-45-67',
    '@ivanov_hotel',
    true
),
(
    'petrov',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- password: admin
    'Петров Пётр Петрович',
    '+7 (921) 234-56-78',
    '@petrov_aparts',
    true
),
(
    'sidorov',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', -- password: admin
    'Сидоров Сергей Сергеевич',
    '+7 (931) 345-67-89',
    '@sidorov_sauna',
    true
)
ON CONFLICT (username) DO NOTHING;

-- 3. Создание тестовых объектов для собственников
-- Получаем ID собственников
DO $$
DECLARE
    ivanov_id INTEGER;
    petrov_id INTEGER;
    sidorov_id INTEGER;
    obj1_id INTEGER;
    obj2_id INTEGER;
    obj3_id INTEGER;
    obj4_id INTEGER;
    obj5_id INTEGER;
    obj6_id INTEGER;
BEGIN
    -- Получаем ID собственников
    SELECT id INTO ivanov_id FROM owners WHERE username = 'ivanov';
    SELECT id INTO petrov_id FROM owners WHERE username = 'petrov';
    SELECT id INTO sidorov_id FROM owners WHERE username = 'sidorov';

    -- Отели Иванова
    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        ivanov_id,
        'hotel',
        'Бутик-отель "Уют"',
        'Арбат, 15',
        'Арбатская',
        25.0,
        1,
        4500.0,
        2,
        55.752023,
        37.593760,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
        '@hotel_uyut',
        true
    ) RETURNING id INTO obj1_id;

    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        ivanov_id,
        'hotel',
        'Отель "Центральный"',
        'Тверская, 10',
        'Тверская',
        30.0,
        1,
        5000.0,
        2,
        55.764828,
        37.605074,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
        '@hotel_central',
        true
    ) RETURNING id INTO obj2_id;

    -- Апартаменты Петрова
    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        petrov_id,
        'apartment',
        'Студия с видом на реку',
        'Остоженка, 12',
        'Парк Культуры',
        32.0,
        1,
        3500.0,
        1,
        55.740700,
        37.597700,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
        '@apart_ostog',
        true
    ) RETURNING id INTO obj3_id;

    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        petrov_id,
        'apartment',
        'Лофт в арт-кластере',
        'Болотная наб., 3',
        'Кропоткинская',
        85.0,
        3,
        7800.0,
        1,
        55.742200,
        37.609700,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
        '@apart_loft',
        true
    ) RETURNING id INTO obj4_id;

    -- Сауны Сидорова
    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        sidorov_id,
        'sauna',
        'Сауна "Релакс"',
        'Ленинградский пр., 45',
        'Сокол',
        50.0,
        2,
        6000.0,
        2,
        55.805563,
        37.514996,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
        '@sauna_relax',
        true
    ) RETURNING id INTO obj5_id;

    INSERT INTO objects (
        owner_id, category, name, address, metro, area, rooms,
        price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
    ) VALUES (
        sidorov_id,
        'conference',
        'Конференц-зал "Бизнес"',
        'Земляной вал, 27',
        'Курская',
        80.0,
        2,
        10000.0,
        2,
        55.758389,
        37.660644,
        'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
        '@conf_business',
        true
    ) RETURNING id INTO obj6_id;

    -- 4. Создание статистики для объектов
    INSERT INTO object_stats (object_id, views_count, telegram_clicks_count, last_view_at, last_click_at)
    VALUES 
    (obj1_id, 245, 32, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '3 hours'),
    (obj2_id, 189, 28, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '2 hours'),
    (obj3_id, 312, 45, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '45 minutes'),
    (obj4_id, 421, 67, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '20 minutes'),
    (obj5_id, 156, 23, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '4 hours'),
    (obj6_id, 98, 12, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '6 hours');

END $$;

-- 5. Создание тестовых акций
INSERT INTO promotions (title, description, valid_from, valid_until, is_active)
VALUES 
(
    '3 месяца бесплатно!',
    'Разместите свой объект на платформе 120 минут и получите 3 месяца бесплатного размещения с еженедельным поднятием в топ-10!',
    NOW(),
    NOW() + INTERVAL '30 days',
    true
),
(
    'Скидка 50% на второй объект',
    'При размещении второго объекта получите скидку 50% на его ежемесячное обслуживание в течение первых 3 месяцев.',
    NOW(),
    NOW() + INTERVAL '60 days',
    true
),
(
    'VIP размещение',
    'Закажите VIP размещение и ваш объект всегда будет в топ-3 результатов поиска! Действует специальная цена: 5000₽/мес вместо 8000₽/мес.',
    NOW(),
    NOW() + INTERVAL '90 days',
    true
),
(
    'Летняя акция завершена',
    'Летняя акция на размещение завершилась 31 августа. Следите за новыми предложениями!',
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '30 days',
    false
);

-- Информация о созданных учётных записях
SELECT 
    'Учётные записи созданы:' as info,
    '' as username,
    '' as password,
    '' as role
UNION ALL
SELECT 
    '',
    'admin',
    'admin123',
    'Администратор'
UNION ALL
SELECT 
    '',
    'ivanov',
    'admin',
    'Собственник (2 объекта)'
UNION ALL
SELECT 
    '',
    'petrov',
    'admin',
    'Собственник (2 объекта)'
UNION ALL
SELECT 
    '',
    'sidorov',
    'admin',
    'Собственник (2 объекта)';
