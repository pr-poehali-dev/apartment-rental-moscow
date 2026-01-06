"""API для получения данных собственника: объекты, статистика, акции"""
import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """Получение данных для личного кабинета собственника"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Получаем owner_id из query параметров
        query_params = event.get('queryStringParameters', {}) or {}
        owner_id = query_params.get('owner_id')
        
        if not owner_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'owner_id required'})
            }
        
        # Подключение к БД
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # Получаем информацию о собственнике
        cursor.execute("""
            SELECT id, username, full_name, phone, telegram, created_at
            FROM owners
            WHERE id = %s AND is_active = true
        """, (owner_id,))
        
        owner_row = cursor.fetchone()
        
        if not owner_row:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Owner not found'})
            }
        
        owner_info = {
            'id': owner_row[0],
            'username': owner_row[1],
            'full_name': owner_row[2],
            'phone': owner_row[3],
            'telegram': owner_row[4],
            'created_at': owner_row[5].isoformat() if owner_row[5] else None
        }
        
        # Получаем объекты собственника с статистикой
        cursor.execute("""
            SELECT 
                o.id, o.category, o.name, o.address, o.metro,
                o.area, o.rooms, o.price_per_hour, o.min_hours,
                o.lat, o.lon, o.image_url, o.telegram_contact,
                o.is_published, o.created_at,
                COALESCE(s.views_count, 0) as views,
                COALESCE(s.telegram_clicks_count, 0) as telegram_clicks,
                s.last_view_at, s.last_click_at
            FROM objects o
            LEFT JOIN object_stats s ON o.id = s.object_id
            WHERE o.owner_id = %s
            ORDER BY o.created_at DESC
        """, (owner_id,))
        
        objects_rows = cursor.fetchall()
        objects = []
        
        for row in objects_rows:
            objects.append({
                'id': row[0],
                'category': row[1],
                'name': row[2],
                'address': row[3],
                'metro': row[4],
                'area': float(row[5]) if row[5] else None,
                'rooms': row[6],
                'price_per_hour': float(row[7]) if row[7] else None,
                'min_hours': row[8],
                'lat': float(row[9]) if row[9] else None,
                'lon': float(row[10]) if row[10] else None,
                'image_url': row[11],
                'telegram_contact': row[12],
                'is_published': row[13],
                'created_at': row[14].isoformat() if row[14] else None,
                'stats': {
                    'views': row[15],
                    'telegram_clicks': row[16],
                    'last_view_at': row[17].isoformat() if row[17] else None,
                    'last_click_at': row[18].isoformat() if row[18] else None
                }
            })
        
        # Получаем активные акции
        cursor.execute("""
            SELECT id, title, description, valid_from, valid_until
            FROM promotions
            WHERE is_active = true
            AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
            ORDER BY created_at DESC
        """)
        
        promotions_rows = cursor.fetchall()
        promotions = []
        
        for row in promotions_rows:
            promotions.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'valid_from': row[3].isoformat() if row[3] else None,
                'valid_until': row[4].isoformat() if row[4] else None
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'owner': owner_info,
                'objects': objects,
                'promotions': promotions
            })
        }
        
    except Exception as e:
        print(f'Error in owner-dashboard: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Internal server error'})
        }
