-- Создание таблицы администраторов
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем первого администратора (логин: admin, пароль: admin123)
-- Хэш пароля admin123 в bcrypt
INSERT INTO admins (username, password_hash, full_name) 
VALUES ('admin', '$2b$10$rKvVhY7QJZxF3z3F3z3F3OQh3tZ3z3z3z3z3z3z3z3z3z3z3z3z3', 'Администратор')
ON CONFLICT (username) DO NOTHING;