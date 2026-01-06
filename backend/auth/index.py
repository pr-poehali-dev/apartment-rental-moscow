"""API для авторизации собственников в личном кабинете"""
import json
import os
import psycopg2
import hashlib
import secrets
from datetime import datetime, timedelta

def hash_password(password: str) -> str:
    """Хеширование пароля с солью"""
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    """Генерация токена сессии"""
    return secrets.token_urlsafe(32)

def handler(event: dict, context) -> dict:
    """API для авторизации и управления сессиями собственников"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Username and password required'})
            }
        
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Проверка учетных данных
        password_hash = hash_password(password)
        cursor.execute("""
            SELECT id, full_name, is_active 
            FROM owners 
            WHERE username = %s AND password_hash = %s
        """, (username, password_hash))
        
        result = cursor.fetchone()
        
        if not result:
            cursor.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid credentials'})
            }
        
        owner_id, full_name, is_active = result
        
        if not is_active:
            cursor.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Account is disabled'})
            }
        
        # Генерация токена
        token = generate_token()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'token': token,
                'owner_id': owner_id,
                'full_name': full_name
            })
        }
        
    except Exception as e:
        print(f'Error in auth: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Internal server error'})
        }
