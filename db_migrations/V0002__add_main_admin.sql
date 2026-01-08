-- Добавление главного администратора платформы 120 минут
-- Логин: hab-agent@mail.ru
-- Пароль: 3Dyzaape29938172
-- SHA256 хеш: d01853dd3362db9dda672eef94675cae29782ef3d744fc88d889e99afe35c6ff

-- Создаём нового администратора (или обновляем если уже существует)
INSERT INTO owners (username, password_hash, full_name, phone, telegram, is_active)
VALUES (
    'hab-agent@mail.ru',
    'd01853dd3362db9dda672eef94675cae29782ef3d744fc88d889e99afe35c6ff',
    'Главный администратор',
    '+7 (999) 000-00-00',
    '@admin_120',
    true
) ON CONFLICT (username) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    is_active = true;