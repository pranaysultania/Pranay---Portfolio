from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid


class ReflectionCategory(str, Enum):
    BLOG = "blog"
    JOURNAL = "journal"
    ARTWORK = "artwork"


class ContactReason(str, Enum):
    YOGA = "yoga"
    INVESTMENT = "investment"
    COLLABORATION = "collaboration"
    OTHER = "other"


class ContactStatus(str, Enum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"


# Reflection Models
class ReflectionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    excerpt: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    category: ReflectionCategory
    tags: List[str] = Field(default_factory=list)
    published: bool = Field(default=True)


class ReflectionCreate(ReflectionBase):
    pass


class ReflectionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    excerpt: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = Field(None, min_length=1)
    category: Optional[ReflectionCategory] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None


class Reflection(ReflectionBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=datetime.utcnow)
    read_time: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def calculate_read_time(self) -> str:
        """Calculate estimated reading time based on content length"""
        words = len(self.content.split())
        minutes = max(1, round(words / 200))  # Average reading speed: 200 words/minute
        return f"{minutes} min read"

    def dict_for_db(self):
        """Convert to dictionary for MongoDB insertion"""
        data = self.dict()
        data['_id'] = data.pop('id')
        return data

    @classmethod
    def from_db(cls, data: dict):
        """Create instance from MongoDB document"""
        if '_id' in data:
            data['id'] = data.pop('_id')
        return cls(**data)


# Contact Models
class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    reason: ContactReason
    message: str = Field(..., min_length=1, max_length=2000)


class ContactSubmission(ContactSubmissionCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    status: ContactStatus = Field(default=ContactStatus.NEW)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

    def dict_for_db(self):
        """Convert to dictionary for MongoDB insertion"""
        data = self.dict()
        data['_id'] = data.pop('id')
        return data

    @classmethod
    def from_db(cls, data: dict):
        """Create instance from MongoDB document"""
        if '_id' in data:
            data['id'] = data.pop('_id')
        return cls(**data)


# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str


class AdminSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

    def dict_for_db(self):
        """Convert to dictionary for MongoDB insertion"""
        data = self.dict()
        data['_id'] = data.pop('id')
        return data

    @classmethod
    def from_db(cls, data: dict):
        """Create instance from MongoDB document"""
        if '_id' in data:
            data['id'] = data.pop('_id')
        return cls(**data)


# Response Models
class ReflectionsResponse(BaseModel):
    reflections: List[Reflection]
    total: int
    categories: List[str]


class ContactResponse(BaseModel):
    success: bool
    message: str


class AdminLoginResponse(BaseModel):
    success: bool
    session_id: Optional[str] = None
    message: str


class AdminVerifyResponse(BaseModel):
    valid: bool
    message: str