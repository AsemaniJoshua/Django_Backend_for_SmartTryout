import jwt
from datetime import datetime, timedelta

# function to generate a JWT token
def generate_jwt(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, 'secret', algorithm='HS256')
    return token


def verify_jwt(token):
    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return "Token has expired"
    except jwt.InvalidTokenError:
        return "Invalid token"
    
    


