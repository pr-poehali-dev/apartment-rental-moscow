-- Изменяем колонку на простой текст
ALTER TABLE admins ALTER COLUMN password_hash TYPE VARCHAR(255);
ALTER TABLE admins RENAME COLUMN password_hash TO password;

-- Обновляем пароль для админа на простой текст (временно для разработки)
UPDATE admins SET password = 'admin123' WHERE username = 'admin';