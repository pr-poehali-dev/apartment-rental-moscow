"""API для админ-панели: управление собственниками, объектами и акциями"""
import json
import os
import psycopg2
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """Хеширование пароля"""
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    """API для управления всеми данными платформы (только для админа)"""
    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', '')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        # GET ?action=get_owners - список всех собственников
        if method == 'GET' and action == 'get_owners':
            cursor.execute("""
                SELECT o.id, o.username, o.full_name, o.phone, o.telegram, 
                       o.is_active, o.created_at,
                       COUNT(obj.id) as objects_count
                FROM owners o
                LEFT JOIN objects obj ON o.id = obj.owner_id
                GROUP BY o.id
                ORDER BY o.created_at DESC
            """)
            rows = cursor.fetchall()
            owners = []
            for row in rows:
                owners.append({
                    'id': row[0],
                    'username': row[1],
                    'full_name': row[2],
                    'phone': row[3],
                    'telegram': row[4],
                    'is_active': row[5],
                    'created_at': row[6].isoformat() if row[6] else None,
                    'objects_count': row[7]
                })
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'owners': owners})
            }
        
        # POST ?action=create_owner - создать собственника
        if method == 'POST' and action == 'create_owner':
            data = json.loads(event.get('body', '{}'))
            username = data.get('username', '').strip()
            password = data.get('password', '').strip()
            full_name = data.get('full_name', '').strip()
            phone = data.get('phone', '').strip()
            telegram = data.get('telegram', '').strip()
            
            if not username or not password or not full_name:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'username, password and full_name required'})
                }
            
            password_hash = hash_password(password)
            
            cursor.execute("""
                INSERT INTO owners (username, password_hash, full_name, phone, telegram)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, username, full_name, phone, telegram, is_active, created_at
            """, (username, password_hash, full_name, phone, telegram))
            
            row = cursor.fetchone()
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': row[0],
                    'username': row[1],
                    'full_name': row[2],
                    'phone': row[3],
                    'telegram': row[4],
                    'is_active': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            }
        
        # PUT ?action=update_owner&id=X - обновить собственника
        if method == 'PUT' and action == 'update_owner':
            owner_id = query_params.get('id')
            data = json.loads(event.get('body', '{}'))
            
            full_name = data.get('full_name')
            phone = data.get('phone')
            telegram = data.get('telegram')
            is_active = data.get('is_active')
            password = data.get('password')
            
            updates = []
            params = []
            
            if full_name is not None:
                updates.append('full_name = %s')
                params.append(full_name)
            if phone is not None:
                updates.append('phone = %s')
                params.append(phone)
            if telegram is not None:
                updates.append('telegram = %s')
                params.append(telegram)
            if is_active is not None:
                updates.append('is_active = %s')
                params.append(is_active)
            if password:
                updates.append('password_hash = %s')
                params.append(hash_password(password))
            
            if not updates:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            params.append(owner_id)
            query = f"UPDATE owners SET {', '.join(updates)} WHERE id = %s RETURNING id, username, full_name, phone, telegram, is_active, created_at"
            
            cursor.execute(query, params)
            row = cursor.fetchone()
            
            if not row:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Owner not found'})
                }
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': row[0],
                    'username': row[1],
                    'full_name': row[2],
                    'phone': row[3],
                    'telegram': row[4],
                    'is_active': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            }
        
        # GET ?action=get_objects - все объекты
        if method == 'GET' and action == 'get_objects':
            cursor.execute("""
                SELECT o.id, o.owner_id, o.category, o.name, o.address, o.metro,
                       o.area, o.rooms, o.price_per_hour, o.min_hours,
                       o.lat, o.lon, o.image_url, o.telegram_contact,
                       o.is_published, o.created_at,
                       ow.full_name as owner_name,
                       COALESCE(s.views_count, 0) as views,
                       COALESCE(s.telegram_clicks_count, 0) as clicks
                FROM objects o
                LEFT JOIN owners ow ON o.owner_id = ow.id
                LEFT JOIN object_stats s ON o.id = s.object_id
                ORDER BY o.created_at DESC
            """)
            rows = cursor.fetchall()
            objects = []
            for row in rows:
                objects.append({
                    'id': row[0],
                    'owner_id': row[1],
                    'category': row[2],
                    'name': row[3],
                    'address': row[4],
                    'metro': row[5],
                    'area': float(row[6]) if row[6] else None,
                    'rooms': row[7],
                    'price_per_hour': float(row[8]) if row[8] else None,
                    'min_hours': row[9],
                    'lat': float(row[10]) if row[10] else None,
                    'lon': float(row[11]) if row[11] else None,
                    'image_url': row[12],
                    'telegram_contact': row[13],
                    'is_published': row[14],
                    'created_at': row[15].isoformat() if row[15] else None,
                    'owner_name': row[16],
                    'views': row[17],
                    'clicks': row[18]
                })
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'objects': objects})
            }
        
        # POST ?action=create_object - создать объект
        if method == 'POST' and action == 'create_object':
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO objects (
                    owner_id, category, name, address, metro, area, rooms,
                    price_per_hour, min_hours, lat, lon, image_url, telegram_contact, is_published
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data.get('owner_id'),
                data.get('category'),
                data.get('name'),
                data.get('address'),
                data.get('metro'),
                data.get('area'),
                data.get('rooms'),
                data.get('price_per_hour'),
                data.get('min_hours', 1),
                data.get('lat'),
                data.get('lon'),
                data.get('image_url'),
                data.get('telegram_contact'),
                data.get('is_published', False)
            ))
            
            object_id = cursor.fetchone()[0]
            
            # Создаём запись статистики
            cursor.execute("""
                INSERT INTO object_stats (object_id, views_count, telegram_clicks_count)
                VALUES (%s, 0, 0)
            """, (object_id,))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': object_id})
            }
        
        # PUT ?action=update_object&id=X - обновить объект
        if method == 'PUT' and action == 'update_object':
            object_id = query_params.get('id')
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                UPDATE objects SET
                    category = COALESCE(%s, category),
                    name = COALESCE(%s, name),
                    address = COALESCE(%s, address),
                    metro = COALESCE(%s, metro),
                    area = COALESCE(%s, area),
                    rooms = COALESCE(%s, rooms),
                    price_per_hour = COALESCE(%s, price_per_hour),
                    min_hours = COALESCE(%s, min_hours),
                    lat = COALESCE(%s, lat),
                    lon = COALESCE(%s, lon),
                    image_url = COALESCE(%s, image_url),
                    telegram_contact = COALESCE(%s, telegram_contact),
                    is_published = COALESCE(%s, is_published),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (
                data.get('category'),
                data.get('name'),
                data.get('address'),
                data.get('metro'),
                data.get('area'),
                data.get('rooms'),
                data.get('price_per_hour'),
                data.get('min_hours'),
                data.get('lat'),
                data.get('lon'),
                data.get('image_url'),
                data.get('telegram_contact'),
                data.get('is_published'),
                object_id
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        # GET ?action=get_promotions - все акции
        if method == 'GET' and action == 'get_promotions':
            cursor.execute("""
                SELECT id, title, description, valid_from, valid_until, is_active, created_at
                FROM promotions
                ORDER BY created_at DESC
            """)
            rows = cursor.fetchall()
            promotions = []
            for row in rows:
                promotions.append({
                    'id': row[0],
                    'title': row[1],
                    'description': row[2],
                    'valid_from': row[3].isoformat() if row[3] else None,
                    'valid_until': row[4].isoformat() if row[4] else None,
                    'is_active': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'promotions': promotions})
            }
        
        # POST ?action=create_promotion - создать акцию
        if method == 'POST' and action == 'create_promotion':
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                INSERT INTO promotions (title, description, valid_from, valid_until, is_active)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (
                data.get('title'),
                data.get('description'),
                data.get('valid_from'),
                data.get('valid_until'),
                data.get('is_active', True)
            ))
            
            promo_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'id': promo_id})
            }
        
        # PUT ?action=update_promotion&id=X - обновить акцию
        if method == 'PUT' and action == 'update_promotion':
            promo_id = query_params.get('id')
            data = json.loads(event.get('body', '{}'))
            
            cursor.execute("""
                UPDATE promotions SET
                    title = COALESCE(%s, title),
                    description = COALESCE(%s, description),
                    valid_until = COALESCE(%s, valid_until),
                    is_active = COALESCE(%s, is_active)
                WHERE id = %s
            """, (
                data.get('title'),
                data.get('description'),
                data.get('valid_until'),
                data.get('is_active'),
                promo_id
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True})
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Endpoint not found'})
        }
        
    except Exception as e:
        print(f'Error in admin API: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Internal server error', 'details': str(e)})
        }