"""API для управления объектами недвижимости в личном кабинете"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        if method == 'GET':
            return get_properties(event)
        elif method == 'POST':
            return create_property(event)
        elif method == 'PUT':
            return update_property(event)
        elif method == 'DELETE':
            return delete_property(event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def get_properties(event: dict) -> dict:
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    query_params = event.get('queryStringParameters') or {}
    property_id = query_params.get('id')
    
    if property_id:
        cur.execute('''
            SELECT p.*, 
                   array_agg(DISTINCT ph.photo_url) FILTER (WHERE ph.photo_url IS NOT NULL) as photos
            FROM t_p27119953_apartment_rental_mos.properties p
            LEFT JOIN t_p27119953_apartment_rental_mos.property_photos ph ON p.id = ph.property_id
            WHERE p.id = %s
            GROUP BY p.id
        ''', (property_id,))
        property_data = cur.fetchone()
        
        if property_data:
            cur.execute('''
                SELECT pr.*, 
                       array_agg(prp.photo_url) FILTER (WHERE prp.photo_url IS NOT NULL) as photos
                FROM t_p27119953_apartment_rental_mos.property_rooms pr
                LEFT JOIN t_p27119953_apartment_rental_mos.property_room_photos prp ON pr.id = prp.room_id
                WHERE pr.property_id = %s
                GROUP BY pr.id
            ''', (property_id,))
            rooms = cur.fetchall()
            property_data['rooms'] = [dict(r) for r in rooms]
    else:
        cur.execute('''
            SELECT p.*,
                   array_agg(DISTINCT ph.photo_url) FILTER (WHERE ph.photo_url IS NOT NULL) as photos,
                   COUNT(DISTINCT pr.id) as room_count
            FROM t_p27119953_apartment_rental_mos.properties p
            LEFT JOIN t_p27119953_apartment_rental_mos.property_photos ph ON p.id = ph.property_id
            LEFT JOIN t_p27119953_apartment_rental_mos.property_rooms pr ON p.id = pr.property_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        ''')
        properties = cur.fetchall()
        property_data = [dict(p) for p in properties]
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(property_data, default=str),
        'isBase64Encoded': False
    }

def create_property(event: dict) -> dict:
    data = json.loads(event.get('body', '{}'))
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        INSERT INTO t_p27119953_apartment_rental_mos.properties 
        (type, status, name, description, address, metro, price, owner_name, owner_phone, 
         owner_telegram, main_photo, amenities, created_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (
        data.get('type'),
        data.get('status', 'draft'),
        data.get('name'),
        data.get('description'),
        data.get('address'),
        data.get('metro'),
        data.get('price'),
        data['owner']['name'],
        data['owner']['phone'],
        data['owner'].get('telegram'),
        data.get('mainPhoto'),
        data.get('amenities', []),
        data.get('createdBy', 'admin')
    ))
    
    property_id = cur.fetchone()[0]
    
    if data.get('photos'):
        for photo_url in data['photos']:
            cur.execute('''
                INSERT INTO t_p27119953_apartment_rental_mos.property_photos 
                (property_id, photo_url) VALUES (%s, %s)
            ''', (property_id, photo_url))
    
    if data.get('rooms'):
        for room in data['rooms']:
            cur.execute('''
                INSERT INTO t_p27119953_apartment_rental_mos.property_rooms
                (property_id, name, type, price, capacity, area, description, amenities, 
                 is_published, is_archived)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                property_id, room['name'], room['type'], room['price'], room['capacity'],
                room.get('area'), room.get('description'), room.get('amenities', []),
                room.get('isPublished', False), room.get('isArchived', False)
            ))
            
            room_id = cur.fetchone()[0]
            
            if room.get('photos'):
                for photo_url in room['photos']:
                    cur.execute('''
                        INSERT INTO t_p27119953_apartment_rental_mos.property_room_photos
                        (room_id, photo_url) VALUES (%s, %s)
                    ''', (room_id, photo_url))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'id': property_id, 'message': 'Property created'}),
        'isBase64Encoded': False
    }

def update_property(event: dict) -> dict:
    data = json.loads(event.get('body', '{}'))
    property_id = data.get('id')
    
    if not property_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Property ID required'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('''
        UPDATE t_p27119953_apartment_rental_mos.properties
        SET type = %s, status = %s, name = %s, description = %s, address = %s,
            metro = %s, price = %s, owner_name = %s, owner_phone = %s,
            owner_telegram = %s, main_photo = %s, amenities = %s,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
    ''', (
        data.get('type'), data.get('status'), data.get('name'),
        data.get('description'), data.get('address'), data.get('metro'),
        data.get('price'), data['owner']['name'], data['owner']['phone'],
        data['owner'].get('telegram'), data.get('mainPhoto'),
        data.get('amenities', []), property_id
    ))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Property updated'}),
        'isBase64Encoded': False
    }

def delete_property(event: dict) -> dict:
    query_params = event.get('queryStringParameters') or {}
    property_id = query_params.get('id')
    
    if not property_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Property ID required'}),
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute('UPDATE t_p27119953_apartment_rental_mos.properties SET status = %s WHERE id = %s', ('archived', property_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Property archived'}),
        'isBase64Encoded': False
    }
