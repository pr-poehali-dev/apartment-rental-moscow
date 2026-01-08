"""API для управления отелями и номерами"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    query = event.get('queryStringParameters') or {}
    entity = query.get('entity', 'hotels')
    entity_id = query.get('id')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        
        # GET ?entity=hotels - получить все отели
        if method == 'GET' and entity == 'hotels' and not entity_id:
            return get_hotels(conn)
        
        # GET ?entity=hotels&id=123 - получить отель по ID
        elif method == 'GET' and entity == 'hotels' and entity_id:
            return get_hotel(conn, entity_id)
        
        # POST ?entity=hotels - создать отель
        elif method == 'POST' and entity == 'hotels':
            body = json.loads(event.get('body', '{}'))
            return create_hotel(conn, body)
        
        # PUT ?entity=hotels&id=123 - обновить отель
        elif method == 'PUT' and entity == 'hotels' and entity_id:
            body = json.loads(event.get('body', '{}'))
            return update_hotel(conn, entity_id, body)
        
        # POST ?entity=rooms - создать номер
        elif method == 'POST' and entity == 'rooms':
            body = json.loads(event.get('body', '{}'))
            return create_room(conn, body)
        
        # PUT ?entity=rooms&id=123 - обновить номер
        elif method == 'PUT' and entity == 'rooms' and entity_id:
            body = json.loads(event.get('body', '{}'))
            return update_room(conn, entity_id, body)
        
        # GET ?entity=owners - получить всех владельцев
        elif method == 'GET' and entity == 'owners':
            return get_owners(conn)
        
        # POST ?entity=owners - создать владельца
        elif method == 'POST' and entity == 'owners':
            body = json.loads(event.get('body', '{}'))
            return create_owner(conn, body)
        
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not found', 'entity': entity, 'method': method}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'conn' in locals():
            conn.close()

def get_hotels(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT h.*, o.name as owner_name 
            FROM hotels h 
            LEFT JOIN owners o ON h.owner_id = o.id 
            ORDER BY h.created_at DESC
        ''')
        hotels = cur.fetchall()
        
        for hotel in hotels:
            cur.execute('SELECT * FROM rooms WHERE hotel_id = %s ORDER BY price', (hotel['id'],))
            hotel['rooms'] = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(hotels, default=str),
            'isBase64Encoded': False
        }

def get_hotel(conn, hotel_id):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT h.*, o.name as owner_name FROM hotels h LEFT JOIN owners o ON h.owner_id = o.id WHERE h.id = %s', (hotel_id,))
        hotel = cur.fetchone()
        
        if not hotel:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Hotel not found'}),
                'isBase64Encoded': False
            }
        
        cur.execute('SELECT * FROM rooms WHERE hotel_id = %s ORDER BY price', (hotel_id,))
        rooms = cur.fetchall()
        
        for room in rooms:
            cur.execute('SELECT * FROM room_features WHERE room_id = %s', (room['id'],))
            room['features'] = cur.fetchall()
            
            cur.execute('SELECT amenity FROM room_amenities WHERE room_id = %s', (room['id'],))
            room['amenities'] = [r['amenity'] for r in cur.fetchall()]
            
            cur.execute('SELECT image_url FROM room_images WHERE room_id = %s ORDER BY sort_order', (room['id'],))
            room['images'] = [r['image_url'] for r in cur.fetchall()]
        
        hotel['rooms'] = rooms
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(hotel, default=str),
            'isBase64Encoded': False
        }

def create_hotel(conn, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO hotels (owner_id, name, address, metro, description, phone, telegram, latitude, longitude, category, published)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            data.get('owner_id'),
            data['name'],
            data['address'],
            data['metro'],
            data.get('description'),
            data.get('phone'),
            data.get('telegram'),
            data.get('latitude'),
            data.get('longitude'),
            data.get('category', 'hotels'),
            data.get('published', False)
        ))
        hotel = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(hotel, default=str),
            'isBase64Encoded': False
        }

def update_hotel(conn, hotel_id, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE hotels 
            SET owner_id = %s, name = %s, address = %s, metro = %s, description = %s, 
                phone = %s, telegram = %s, latitude = %s, longitude = %s, 
                category = %s, published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (
            data.get('owner_id'),
            data['name'],
            data['address'],
            data['metro'],
            data.get('description'),
            data.get('phone'),
            data.get('telegram'),
            data.get('latitude'),
            data.get('longitude'),
            data.get('category', 'hotels'),
            data.get('published', False),
            hotel_id
        ))
        hotel = cur.fetchone()
        conn.commit()
        
        if not hotel:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Hotel not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(hotel, default=str),
            'isBase64Encoded': False
        }

def create_room(conn, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO rooms (hotel_id, name, price, area, description, min_hours, telegram, phone, published)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            data['hotel_id'],
            data['name'],
            data['price'],
            data['area'],
            data.get('description'),
            data.get('min_hours', 2),
            data.get('telegram'),
            data.get('phone'),
            data.get('published', False)
        ))
        room = cur.fetchone()
        room_id = room['id']
        
        # Добавляем особенности
        for feature in data.get('features', []):
            cur.execute(
                'INSERT INTO room_features (room_id, icon, label) VALUES (%s, %s, %s)',
                (room_id, feature['icon'], feature['label'])
            )
        
        # Добавляем удобства
        for amenity in data.get('amenities', []):
            cur.execute(
                'INSERT INTO room_amenities (room_id, amenity) VALUES (%s, %s)',
                (room_id, amenity)
            )
        
        # Добавляем изображения
        for i, image_url in enumerate(data.get('images', [])):
            cur.execute(
                'INSERT INTO room_images (room_id, image_url, sort_order) VALUES (%s, %s, %s)',
                (room_id, image_url, i)
            )
        
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def update_room(conn, room_id, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE rooms 
            SET name = %s, price = %s, area = %s, description = %s, 
                min_hours = %s, telegram = %s, phone = %s, published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (
            data['name'],
            data['price'],
            data['area'],
            data.get('description'),
            data.get('min_hours', 2),
            data.get('telegram'),
            data.get('phone'),
            data.get('published', False),
            room_id
        ))
        room = cur.fetchone()
        
        if not room:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Room not found'}),
                'isBase64Encoded': False
            }
        
        # Обновляем особенности
        if 'features' in data:
            cur.execute('DELETE FROM room_features WHERE room_id = %s', (room_id,))
            for feature in data['features']:
                cur.execute(
                    'INSERT INTO room_features (room_id, icon, label) VALUES (%s, %s, %s)',
                    (room_id, feature['icon'], feature['label'])
                )
        
        # Обновляем удобства
        if 'amenities' in data:
            cur.execute('DELETE FROM room_amenities WHERE room_id = %s', (room_id,))
            for amenity in data['amenities']:
                cur.execute(
                    'INSERT INTO room_amenities (room_id, amenity) VALUES (%s, %s)',
                    (room_id, amenity)
                )
        
        # Обновляем изображения
        if 'images' in data:
            cur.execute('DELETE FROM room_images WHERE room_id = %s', (room_id,))
            for i, image_url in enumerate(data['images']):
                cur.execute(
                    'INSERT INTO room_images (room_id, image_url, sort_order) VALUES (%s, %s, %s)',
                    (room_id, image_url, i)
                )
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def get_owners(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT * FROM owners ORDER BY name')
        owners = cur.fetchall()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(owners, default=str),
            'isBase64Encoded': False
        }

def create_owner(conn, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO owners (name, telegram, phone, email)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        ''', (
            data['name'],
            data.get('telegram'),
            data.get('phone'),
            data.get('email')
        ))
        owner = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(owner, default=str),
            'isBase64Encoded': False
        }