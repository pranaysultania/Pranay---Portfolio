from fastapi import FastAPI, APIRouter, HTTPException, Depends, Cookie
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime

# Import our modules
from models import (
    Reflection, ReflectionCreate, ReflectionUpdate,
    ContactSubmissionCreate, ContactSubmission,
    AdminLogin, AdminLoginResponse, AdminVerifyResponse,
    ReflectionsResponse, ContactResponse
)
from database import init_database, get_database
from auth import authenticate_admin, verify_admin_session, logout_admin

ROOT_DIR = Path(__file__).parent
from dotenv import load_dotenv
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db_name = os.environ.get('DB_NAME', 'pranay_portfolio')

# Initialize database
db = init_database(client, db_name)

# Create the main app
app = FastAPI(title="Pranay Portfolio API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "Pranay Portfolio API is running", "timestamp": datetime.utcnow()}

# ============================================================================
# REFLECTIONS ENDPOINTS
# ============================================================================

@api_router.get("/reflections", response_model=ReflectionsResponse)
async def get_reflections(category: Optional[str] = None):
    """Get all published reflections, optionally filtered by category"""
    try:
        reflections = await db.get_reflections(category=category, published_only=True)
        categories = await db.get_reflection_categories()
        
        return ReflectionsResponse(
            reflections=reflections,
            total=len(reflections),
            categories=categories
        )
    except Exception as e:
        logger.error(f"Error getting reflections: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve reflections")

@api_router.get("/reflections/{reflection_id}", response_model=Reflection)
async def get_reflection(reflection_id: str):
    """Get a single reflection by ID"""
    try:
        reflection = await db.get_reflection_by_id(reflection_id)
        if not reflection:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        if not reflection.published:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        return reflection
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting reflection {reflection_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve reflection")

@api_router.post("/reflections", response_model=Reflection)
async def create_reflection(
    reflection: ReflectionCreate,
    session_id: Optional[str] = Cookie(None)
):
    """Create a new reflection (admin only)"""
    if not await verify_admin_session(session_id):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    
    try:
        new_reflection = await db.create_reflection(reflection.dict())
        logger.info(f"Created reflection: {new_reflection.title}")
        return new_reflection
    except Exception as e:
        logger.error(f"Error creating reflection: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create reflection")

@api_router.put("/reflections/{reflection_id}", response_model=Reflection)
async def update_reflection(
    reflection_id: str,
    reflection_update: ReflectionUpdate,
    session_id: Optional[str] = Cookie(None)
):
    """Update a reflection (admin only)"""
    if not await verify_admin_session(session_id):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    
    try:
        # Filter out None values
        update_data = {k: v for k, v in reflection_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No update data provided")
        
        updated_reflection = await db.update_reflection(reflection_id, update_data)
        if not updated_reflection:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        logger.info(f"Updated reflection: {reflection_id}")
        return updated_reflection
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating reflection {reflection_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update reflection")

@api_router.delete("/reflections/{reflection_id}")
async def delete_reflection(
    reflection_id: str,
    session_id: Optional[str] = Cookie(None)
):
    """Delete a reflection (admin only)"""
    if not await verify_admin_session(session_id):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    
    try:
        success = await db.delete_reflection(reflection_id)
        if not success:
            raise HTTPException(status_code=404, detail="Reflection not found")
        
        logger.info(f"Deleted reflection: {reflection_id}")
        return {"message": "Reflection deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting reflection {reflection_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete reflection")

@api_router.get("/reflections-admin", response_model=ReflectionsResponse)
async def get_all_reflections_admin(session_id: Optional[str] = Cookie(None)):
    """Get all reflections including unpublished (admin only)"""
    if not await verify_admin_session(session_id):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    
    try:
        reflections = await db.get_reflections(published_only=False)
        categories = await db.get_reflection_categories()
        
        return ReflectionsResponse(
            reflections=reflections,
            total=len(reflections),
            categories=categories
        )
    except Exception as e:
        logger.error(f"Error getting admin reflections: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve reflections")

# ============================================================================
# CONTACT ENDPOINTS
# ============================================================================

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(contact: ContactSubmissionCreate):
    """Submit a contact form"""
    try:
        submission = await db.create_contact_submission(contact.dict())
        logger.info(f"Contact form submitted by: {contact.email}")
        
        return ContactResponse(
            success=True,
            message="Thank you for reaching out! I'll get back to you soon."
        )
    except Exception as e:
        logger.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@api_router.get("/contact-submissions", response_model=List[ContactSubmission])
async def get_contact_submissions(session_id: Optional[str] = Cookie(None)):
    """Get all contact submissions (admin only)"""
    if not await verify_admin_session(session_id):
        raise HTTPException(status_code=401, detail="Admin authentication required")
    
    try:
        submissions = await db.get_contact_submissions()
        return submissions
    except Exception as e:
        logger.error(f"Error getting contact submissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve contact submissions")

# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

@api_router.post("/admin/login", response_model=AdminLoginResponse)
async def admin_login(credentials: AdminLogin):
    """Admin login"""
    try:
        session_id = await authenticate_admin(credentials.username, credentials.password)
        
        if session_id:
            response = JSONResponse(
                content={
                    "success": True,
                    "session_id": session_id,
                    "message": "Login successful"
                }
            )
            # Set secure httpOnly cookie
            response.set_cookie(
                key="session_id",
                value=session_id,
                httponly=True,
                secure=False,  # Set to True in production with HTTPS
                samesite="lax",
                max_age=86400  # 24 hours
            )
            return response
        else:
            return AdminLoginResponse(
                success=False,
                message="Invalid credentials"
            )
    except Exception as e:
        logger.error(f"Error during admin login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

@api_router.get("/admin/verify", response_model=AdminVerifyResponse)
async def verify_admin(session_id: Optional[str] = Cookie(None)):
    """Verify admin session"""
    try:
        is_valid = await verify_admin_session(session_id)
        return AdminVerifyResponse(
            valid=is_valid,
            message="Session valid" if is_valid else "Session invalid"
        )
    except Exception as e:
        logger.error(f"Error verifying admin session: {str(e)}")
        return AdminVerifyResponse(valid=False, message="Verification failed")

@api_router.post("/admin/logout")
async def admin_logout(session_id: Optional[str] = Cookie(None)):
    """Admin logout"""
    try:
        if session_id:
            await logout_admin(session_id)
        
        response = JSONResponse(content={"message": "Logged out successfully"})
        response.delete_cookie(key="session_id")
        return response
    except Exception as e:
        logger.error(f"Error during admin logout: {str(e)}")
        raise HTTPException(status_code=500, detail="Logout failed")

# Include the router in the main app
app.include_router(api_router)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and seed data on startup"""
    try:
        # Clean up expired sessions
        await db.cleanup_expired_sessions()
        
        # Seed initial data
        await db.seed_initial_data()
        
        logger.info("Application startup completed successfully")
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_db_client():
    """Close database connection on shutdown"""
    client.close()
    logger.info("Database connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)