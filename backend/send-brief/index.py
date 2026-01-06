import json
import os
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    '''API для отправки заявок собственников в Telegram'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        data = json.loads(event.get('body', '{}'))
        
        bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        
        print(f'Bot token exists: {bool(bot_token)}')
        print(f'Chat ID: {chat_id}')
        print(f'Request data: {data}')
        
        if not bot_token or not chat_id:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Telegram credentials not configured'})
            }
        
        category_labels = {
            'hotel': 'Отель',
            'apartment': 'Апартамент',
            'sauna': 'Сауна',
            'conference': 'Конференц-зал'
        }
        
        message_parts = [
            '🏢 Новая заявка на размещение\n',
            f'📋 Категория: {category_labels.get(data.get("category", ""), data.get("category", ""))}',
            f'🏠 Наименование: {data.get("name", "")}',
            f'📍 Адрес: {data.get("address", "")}'
        ]
        
        if data.get('metro'):
            message_parts.append(f'🚇 Метро: {data.get("metro")}')
        
        message_parts.append(f'🔢 Количество объектов: {data.get("objectsCount", "")}')
        
        if data.get('website'):
            message_parts.append(f'🌐 Сайт: {data.get("website")}')
        
        message_parts.append(f'📞 Телефон: {data.get("phone", "")}')
        
        if data.get('telegram'):
            message_parts.append(f'💬 Telegram: {data.get("telegram")}')
        
        message_parts.append(f'👤 Имя собственника: {data.get("ownerName", "")}')
        
        message = '\n'.join(message_parts)
        
        telegram_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
        payload = {
            'chat_id': chat_id,
            'text': message
        }
        
        req = urllib.request.Request(
            telegram_url,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        print(f'Sending to Telegram: {telegram_url}')
        print(f'Payload: {payload}')
        print(f'Message: {message}')
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
            print(f'Telegram response: {result}')
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f'Telegram HTTP Error: {e.code} - {error_body}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Telegram API error: {error_body}'})
            }
        
        if result.get('ok'):
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        else:
            print(f'Telegram error: {result}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Failed to send Telegram message', 'details': result})
            }
    
    except Exception as e:
        print(f'Exception: {str(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }