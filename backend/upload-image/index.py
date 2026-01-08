"""API для загрузки изображений в S3"""
import json
import os
import boto3
import base64
import uuid
from datetime import datetime

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        file_data = body.get('file')
        file_name = body.get('fileName', 'image.jpg')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No file data provided'}),
                'isBase64Encoded': False
            }
        
        # Декодируем base64
        if ',' in file_data:
            file_data = file_data.split(',')[1]
        
        file_bytes = base64.b64decode(file_data)
        
        # Определяем тип файла
        content_type = 'image/jpeg'
        ext = file_name.split('.')[-1].lower()
        if ext == 'png':
            content_type = 'image/png'
        elif ext == 'gif':
            content_type = 'image/gif'
        elif ext == 'webp':
            content_type = 'image/webp'
        
        # Генерируем уникальное имя файла
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        safe_name = f"hotel-{timestamp}-{unique_id}.{ext}"
        
        # Загружаем в S3
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        s3.put_object(
            Bucket='files',
            Key=safe_name,
            Body=file_bytes,
            ContentType=content_type
        )
        
        # Формируем CDN URL
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{safe_name}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'url': cdn_url, 'fileName': safe_name}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
