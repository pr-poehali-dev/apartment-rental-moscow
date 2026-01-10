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
    action = query.get('action')
    
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
        
        # PUT ?entity=hotels&id=123&action=publish - опубликовать/снять с публикации
        elif method == 'PUT' and entity == 'hotels' and entity_id and action == 'publish':
            body = json.loads(event.get('body', '{}'))
            return toggle_hotel_publish(conn, entity_id, body.get('is_published'))
        
        # PUT ?entity=hotels&id=123&action=archive - архивировать/разархивировать
        elif method == 'PUT' and entity == 'hotels' and entity_id and action == 'archive':
            body = json.loads(event.get('body', '{}'))
            return toggle_hotel_archive(conn, entity_id, body.get('is_archived'))
        
        # GET ?entity=rooms&id=123 - получить номер по ID
        elif method == 'GET' and entity == 'rooms' and entity_id:
            return get_room(conn, entity_id)
        
        # POST ?entity=rooms - создать номер
        elif method == 'POST' and entity == 'rooms':
            body = json.loads(event.get('body', '{}'))
            return create_room(conn, body)
        
        # PUT ?entity=rooms&id=123 - обновить номер
        elif method == 'PUT' and entity == 'rooms' and entity_id:
            body = json.loads(event.get('body', '{}'))
            return update_room(conn, entity_id, body)
        
        # PUT ?entity=rooms&id=123&action=publish - опубликовать/снять с публикации
        elif method == 'PUT' and entity == 'rooms' and entity_id and action == 'publish':
            body = json.loads(event.get('body', '{}'))
            return toggle_room_publish(conn, entity_id, body.get('is_published'))
        
        # PUT ?entity=rooms&id=123&action=archive - архивировать/разархивировать
        elif method == 'PUT' and entity == 'rooms' and entity_id and action == 'archive':
            body = json.loads(event.get('body', '{}'))
            return toggle_room_archive(conn, entity_id, body.get('is_archived'))
        
        # DELETE ?entity=rooms&id=123 - удалить номер
        elif method == 'DELETE' and entity == 'rooms' and entity_id:
            return delete_room(conn, entity_id)
        
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
            SELECT p.*,
                   array_agg(DISTINCT ph.photo_url) FILTER (WHERE ph.photo_url IS NOT NULL) as images
            FROM t_p27119953_apartment_rental_mos.properties p
            LEFT JOIN t_p27119953_apartment_rental_mos.property_photos ph ON p.id = ph.property_id
            WHERE p.type = 'hotel' AND p.status = 'active'
            GROUP BY p.id
            ORDER BY p.created_at DESC
        ''')
        hotels = cur.fetchall()
        
        for hotel in hotels:
            cur.execute('''
                SELECT pr.id, pr.name, pr.type, pr.price, pr.capacity, pr.area, 
                       pr.description, pr.amenities, pr.is_published, pr.is_archived,
                       array_agg(prp.photo_url) FILTER (WHERE prp.photo_url IS NOT NULL) as images
                FROM t_p27119953_apartment_rental_mos.property_rooms pr
                LEFT JOIN t_p27119953_apartment_rental_mos.property_room_photos prp ON pr.id = prp.room_id
                WHERE pr.property_id = %s AND pr.is_published = true AND pr.is_archived = false
                GROUP BY pr.id
                ORDER BY pr.price
            ''', (hotel['id'],))
            hotel['rooms'] = cur.fetchall()
            
            if not hotel['images']:
                hotel['images'] = []
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(h) for h in hotels], default=str),
            'isBase64Encoded': False
        }

def get_hotel(conn, hotel_id):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            SELECT p.*,
                   array_agg(DISTINCT ph.photo_url) FILTER (WHERE ph.photo_url IS NOT NULL) as images
            FROM t_p27119953_apartment_rental_mos.properties p
            LEFT JOIN t_p27119953_apartment_rental_mos.property_photos ph ON p.id = ph.property_id
            WHERE p.id = %s AND p.type = 'hotel'
            GROUP BY p.id
        ''', (hotel_id,))
        hotel = cur.fetchone()
        
        if not hotel:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Hotel not found'}),
                'isBase64Encoded': False
            }
        
        cur.execute('''
            SELECT pr.id, pr.name, pr.type, pr.price, pr.capacity, pr.area, 
                   pr.description, pr.amenities, pr.is_published, pr.is_archived,
                   array_agg(prp.photo_url) FILTER (WHERE prp.photo_url IS NOT NULL) as images
            FROM t_p27119953_apartment_rental_mos.property_rooms pr
            LEFT JOIN t_p27119953_apartment_rental_mos.property_room_photos prp ON pr.id = prp.room_id
            WHERE pr.property_id = %s
            GROUP BY pr.id
            ORDER BY pr.price
        ''', (hotel_id,))
        rooms = cur.fetchall()
        
        if not hotel['images']:
            hotel['images'] = []
        
        hotel['rooms'] = [dict(r) for r in rooms]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(hotel), default=str),
            'isBase64Encoded': False
        }

def create_hotel(conn, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO hotels (owner_id, name, address, metro, description, phone, telegram, latitude, longitude, category, is_published, is_archived)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
            data.get('is_published', False),
            data.get('is_archived', False)
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
                category = %s, updated_at = CURRENT_TIMESTAMP
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

def toggle_hotel_publish(conn, hotel_id, is_published):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE hotels 
            SET is_published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (is_published, hotel_id))
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

def toggle_hotel_archive(conn, hotel_id, is_archived):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE hotels 
            SET is_archived = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (is_archived, hotel_id))
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

def get_room(conn, room_id):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT * FROM rooms WHERE id = %s', (room_id,))
        room = cur.fetchone()
        
        if not room:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Room not found'}),
                'isBase64Encoded': False
            }
        
        cur.execute('SELECT * FROM room_features WHERE room_id = %s', (room_id,))
        room['features'] = cur.fetchall()
        
        cur.execute('SELECT amenity FROM room_amenities WHERE room_id = %s', (room_id,))
        room['amenities'] = [r['amenity'] for r in cur.fetchall()]
        
        cur.execute('SELECT image_url FROM room_images WHERE room_id = %s ORDER BY sort_order', (room_id,))
        room['images'] = [r['image_url'] for r in cur.fetchall()]
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def create_room(conn, data):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            INSERT INTO rooms (hotel_id, name, price, area, description, min_hours, telegram, phone, is_published, is_archived)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        ''', (
            data['hotel_id'],
            data['name'],
            data['price'],
            data['area'],
            data.get('description'),
            data.get('min_hours'),
            data.get('telegram'),
            data.get('phone'),
            data.get('is_published', False),
            data.get('is_archived', False)
        ))
        room = cur.fetchone()
        room_id = room['id']
        
        if 'amenities' in data:
            for amenity in data['amenities']:
                cur.execute('INSERT INTO room_amenities (room_id, amenity) VALUES (%s, %s)', (room_id, amenity))
        
        if 'images' in data:
            for idx, image_url in enumerate(data['images']):
                cur.execute('INSERT INTO room_images (room_id, image_url, sort_order) VALUES (%s, %s, %s)', (room_id, image_url, idx))
        
        if 'features' in data:
            for feature in data['features']:
                cur.execute('INSERT INTO room_features (room_id, feature_name, feature_value) VALUES (%s, %s, %s)', 
                          (room_id, feature.get('feature_name'), feature.get('feature_value')))
        
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
                min_hours = %s, telegram = %s, phone = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (
            data['name'],
            data['price'],
            data['area'],
            data.get('description'),
            data.get('min_hours'),
            data.get('telegram'),
            data.get('phone'),
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
        
        if 'amenities' in data:
            cur.execute('DELETE FROM room_amenities WHERE room_id = %s', (room_id,))
            for amenity in data['amenities']:
                cur.execute('INSERT INTO room_amenities (room_id, amenity) VALUES (%s, %s)', (room_id, amenity))
        
        if 'images' in data:
            cur.execute('DELETE FROM room_images WHERE room_id = %s', (room_id,))
            for idx, image_url in enumerate(data['images']):
                cur.execute('INSERT INTO room_images (room_id, image_url, sort_order) VALUES (%s, %s, %s)', (room_id, image_url, idx))
        
        if 'features' in data:
            cur.execute('DELETE FROM room_features WHERE room_id = %s', (room_id,))
            for feature in data['features']:
                cur.execute('INSERT INTO room_features (room_id, feature_name, feature_value) VALUES (%s, %s, %s)', 
                          (room_id, feature.get('feature_name'), feature.get('feature_value')))
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def toggle_room_publish(conn, room_id, is_published):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE rooms 
            SET is_published = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (is_published, room_id))
        room = cur.fetchone()
        conn.commit()
        
        if not room:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Room not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def toggle_room_archive(conn, room_id, is_archived):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('''
            UPDATE rooms 
            SET is_archived = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING *
        ''', (is_archived, room_id))
        room = cur.fetchone()
        conn.commit()
        
        if not room:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Room not found'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(room, default=str),
            'isBase64Encoded': False
        }

def delete_room(conn, room_id):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('DELETE FROM room_amenities WHERE room_id = %s', (room_id,))
        cur.execute('DELETE FROM room_images WHERE room_id = %s', (room_id,))
        cur.execute('DELETE FROM room_features WHERE room_id = %s', (room_id,))
        cur.execute('DELETE FROM rooms WHERE id = %s RETURNING *', (room_id,))
        room = cur.fetchone()
        
        if not room:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Room not found'}),
                'isBase64Encoded': False
            }
        
        conn.commit()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'message': 'Room deleted successfully'}),
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
            INSERT INTO owners (name, phone, telegram)
            VALUES (%s, %s, %s)
            RETURNING *
        ''', (
            data['name'],
            data.get('phone'),
            data.get('telegram')
        ))
        owner = cur.fetchone()
        conn.commit()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(owner, default=str),
            'isBase64Encoded': False
        }