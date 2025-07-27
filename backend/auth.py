from datetime import datetime, timedelta
from typing import Optional
import os
import hashlib
import secrets
from models import AdminSession
from database import get_database

# Simple admin credentials (in production, use proper password hashing)
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'pranay2024')

def hash_password(password: str) -> str:
    """Simple password hashing (in production, use bcrypt)"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == hashed

async def authenticate_admin(username: str, password: str) -> Optional[str]:
    """Authenticate admin and return session ID"""
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        # Create session
        session_id = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hour session
        
        db = get_database()
        session = await db.create_admin_session({
            "session_id": session_id,
            "expires_at": expires_at
        })
        
        return session_id
    return None

async def verify_admin_session(session_id: str) -> bool:
    """Verify if admin session is valid"""
    if not session_id:
        return False
    
    db = get_database()
    session = await db.get_admin_session(session_id)
    return session is not None

async def logout_admin(session_id: str) -> bool:
    """Logout admin by deleting session"""
    if not session_id:
        return False
    
    db = get_database()
    return await db.delete_admin_session(session_id)

class AdminRequired:
    """Dependency for admin-only endpoints"""
    def __init__(self, session_id: Optional[str] = None):
        self.session_id = session_id
    
    async def __call__(self, session_id: Optional[str] = None) -> bool:
        return await verify_admin_session(session_id)