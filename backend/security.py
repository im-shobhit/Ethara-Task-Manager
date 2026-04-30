# backend/security.py
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext

# Secret key to sign the JWT tokens. 
# (In a real enterprise app, this goes in a .env file, but we will hardcode it here to save deployment time!)
SECRET_KEY = "ethara-assessment-super-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Tokens expire in 1 hour

# This tells Passlib to use the standard 'bcrypt' algorithm to hash passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    """Checks if a typed password matches the scrambled database password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Scrambles a password before saving it to the database"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates the JWT ID Badge for the user"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt