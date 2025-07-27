import os
import logging
from typing import List, Optional
from datetime import datetime, timedelta
import databases
import sqlalchemy
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, DateTime, Boolean, Text, JSON
from models import Reflection, ContactSubmission, AdminSession, ReflectionCategory

logger = logging.getLogger(__name__)

# Database connection
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# Create database instance
database = databases.Database(DATABASE_URL)
metadata = MetaData()
engine = create_engine(DATABASE_URL)

# Define tables
reflections_table = Table(
    "reflections",
    metadata,
    Column("id", String, primary_key=True),
    Column("title", String(200), nullable=False),
    Column("excerpt", String(500), nullable=False),
    Column("content", Text, nullable=False),
    Column("category", String(50), nullable=False),
    Column("tags", JSON, nullable=False, default=list),
    Column("date", DateTime, nullable=False, default=datetime.utcnow),
    Column("read_time", String(50), nullable=False, default=""),
    Column("published", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
    Column("updated_at", DateTime, nullable=False, default=datetime.utcnow),
)

contacts_table = Table(
    "contacts",
    metadata,
    Column("id", String, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("email", String(255), nullable=False),
    Column("reason", String(50), nullable=False),
    Column("message", Text, nullable=False),
    Column("status", String(20), nullable=False, default="new"),
    Column("submitted_at", DateTime, nullable=False, default=datetime.utcnow),
)

admin_sessions_table = Table(
    "admin_sessions",
    metadata,
    Column("id", String, primary_key=True),
    Column("session_id", String, nullable=False, unique=True),
    Column("expires_at", DateTime, nullable=False),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

class Database:
    def __init__(self):
        self.database = database
        
    async def connect(self):
        """Connect to database"""
        await self.database.connect()
        
    async def disconnect(self):
        """Disconnect from database"""
        await self.database.disconnect()
        
    async def create_tables(self):
        """Create all tables"""
        metadata.create_all(engine)
        logger.info("Database tables created")

    # Reflection operations
    async def create_reflection(self, reflection_data: dict) -> Reflection:
        """Create a new reflection"""
        reflection = Reflection(**reflection_data)
        reflection.read_time = reflection.calculate_read_time()
        reflection.updated_at = datetime.utcnow()
        
        query = reflections_table.insert().values(**reflection.dict())
        await self.database.execute(query)
        logger.info(f"Created reflection: {reflection.title}")
        return reflection

    async def get_reflections(self, category: Optional[str] = None, published_only: bool = True) -> List[Reflection]:
        """Get all reflections, optionally filtered by category"""
        query = reflections_table.select()
        
        if published_only:
            query = query.where(reflections_table.c.published == True)
        if category:
            query = query.where(reflections_table.c.category == category)
            
        query = query.order_by(reflections_table.c.date.desc())
        
        rows = await self.database.fetch_all(query)
        reflections = [Reflection(**dict(row)) for row in rows]
        
        logger.info(f"Retrieved {len(reflections)} reflections")
        return reflections

    async def get_reflection_by_id(self, reflection_id: str) -> Optional[Reflection]:
        """Get a single reflection by ID"""
        query = reflections_table.select().where(reflections_table.c.id == reflection_id)
        row = await self.database.fetch_one(query)
        
        if row:
            return Reflection(**dict(row))
        return None

    async def update_reflection(self, reflection_id: str, update_data: dict) -> Optional[Reflection]:
        """Update a reflection"""
        update_data["updated_at"] = datetime.utcnow()
        
        # Recalculate read time if content changed
        if "content" in update_data:
            words = len(update_data["content"].split())
            minutes = max(1, round(words / 200))
            update_data["read_time"] = f"{minutes} min read"
        
        query = reflections_table.update().where(
            reflections_table.c.id == reflection_id
        ).values(**update_data)
        
        await self.database.execute(query)
        return await self.get_reflection_by_id(reflection_id)

    async def delete_reflection(self, reflection_id: str) -> bool:
        """Delete a reflection"""
        query = reflections_table.delete().where(reflections_table.c.id == reflection_id)
        result = await self.database.execute(query)
        logger.info(f"Deleted reflection: {reflection_id}")
        return result > 0

    async def get_reflection_categories(self) -> List[str]:
        """Get all available reflection categories"""
        return [category.value for category in ReflectionCategory]

    # Contact operations
    async def create_contact_submission(self, contact_data: dict) -> ContactSubmission:
        """Create a new contact submission"""
        contact = ContactSubmission(**contact_data)
        query = contacts_table.insert().values(**contact.dict())
        await self.database.execute(query)
        logger.info(f"Created contact submission from: {contact.email}")
        return contact

    async def get_contact_submissions(self) -> List[ContactSubmission]:
        """Get all contact submissions"""
        query = contacts_table.select().order_by(contacts_table.c.submitted_at.desc())
        rows = await self.database.fetch_all(query)
        return [ContactSubmission(**dict(row)) for row in rows]

    # Admin session operations
    async def create_admin_session(self, session_data: dict) -> AdminSession:
        """Create a new admin session"""
        session = AdminSession(**session_data)
        query = admin_sessions_table.insert().values(**session.dict())
        await self.database.execute(query)
        logger.info(f"Created admin session: {session.session_id}")
        return session

    async def get_admin_session(self, session_id: str) -> Optional[AdminSession]:
        """Get admin session by session ID"""
        query = admin_sessions_table.select().where(admin_sessions_table.c.session_id == session_id)
        row = await self.database.fetch_one(query)
        
        if row:
            session = AdminSession(**dict(row))
            # Check if session is expired
            if session.expires_at > datetime.utcnow():
                return session
            else:
                # Clean up expired session
                await self.delete_admin_session(session_id)
        return None

    async def delete_admin_session(self, session_id: str) -> bool:
        """Delete an admin session"""
        query = admin_sessions_table.delete().where(admin_sessions_table.c.session_id == session_id)
        result = await self.database.execute(query)
        return result > 0

    # Database seeding
    async def seed_initial_data(self):
        """Seed the database with initial reflection data"""
        # Check if we already have data
        query = reflections_table.select()
        existing = await self.database.fetch_all(query)
        
        if len(existing) > 0:
            logger.info("Database already has reflection data, skipping seed")
            return

        # Initial reflections data
        initial_reflections = [
            {
                "title": "Finding Balance Between Capital and Consciousness",
                "excerpt": "Reflections on navigating the intersection of private equity and mindful living...",
                "content": "In the fast-paced world of private equity, finding moments of stillness becomes both a challenge and a necessity. Over the past year, I've been exploring how the principles I teach on the yoga mat can inform the decisions I make in the boardroom.\n\nThe breath-led approach that guides my yoga practice has become a cornerstone of my investment philosophy. Just as we learn to observe the breath without forcing it, I've found that the best investment opportunities often reveal themselves when we create space for listening rather than pushing.\n\nThis integration isn't always seamless. There are days when the demands of due diligence clash with the call for inner reflection. But it's in these moments of tension that I find the most growth—both personally and professionally.",
                "category": "journal",
                "tags": ["reflection", "balance", "yoga", "investing"],
                "date": datetime(2024, 12, 15)
            },
            {
                "title": "Lessons from the Mat: Presence in Leadership",
                "excerpt": "How yoga practice transforms the way we show up in professional spaces...",
                "content": "Leadership in private equity demands presence—the ability to be fully here, fully engaged, even when dealing with complex financial structures and high-stakes decisions.\n\nYoga has taught me that presence isn't about perfection; it's about showing up authentically to whatever is arising. Whether I'm guiding someone through their first sun salutation or navigating a challenging negotiation, the principles remain the same: breathe, observe, respond rather than react.\n\nI've noticed that the executives I work with are increasingly hungry for this kind of authentic leadership. They're looking for investors who bring not just capital, but consciousness to the table.",
                "category": "blog",
                "tags": ["leadership", "presence", "yoga", "business"],
                "date": datetime(2024, 11, 28)
            },
            {
                "title": "Urban Sunrise Practice",
                "excerpt": "A personal art piece capturing the stillness of early morning practice...",
                "content": "This piece emerged from my morning practice routine—those precious moments before the city awakens when movement becomes meditation.\n\nCreated using charcoal and soft pastels, it represents the intersection of strength and softness that defines both my yoga practice and my approach to life. The upward reaching lines symbolize aspiration, while the grounded base speaks to the importance of staying rooted.\n\nArt has become another form of reflection for me, a way to process the experiences and insights that emerge from both my professional and spiritual practice.",
                "category": "artwork",
                "tags": ["art", "morning practice", "meditation", "creativity"],
                "date": datetime(2024, 10, 12)
            },
            {
                "title": "Impact Investing: Beyond the Numbers",
                "excerpt": "Exploring how consciousness influences capital allocation decisions...",
                "content": "The world of impact investing is evolving rapidly, and I'm excited to be part of this transformation. At Lok Capital, we're constantly asking: How do we measure success beyond financial returns?\n\nThis question has led me to some fascinating conversations with portfolio companies about values-driven growth. When we invested in GrowXCD, it wasn't just about their innovative financial services model—it was about their commitment to financial inclusion for underserved communities.\n\nThe integration of consciousness and capital isn't just a nice-to-have anymore; it's becoming essential for sustainable, long-term value creation.",
                "category": "blog",
                "tags": ["impact investing", "values", "sustainability", "growth"],
                "date": datetime(2024, 9, 20)
            }
        ]

        # Insert reflections
        for reflection_data in initial_reflections:
            await self.create_reflection(reflection_data)

        logger.info(f"Seeded database with {len(initial_reflections)} initial reflections")

# Global database instance
db_instance = None

def get_database() -> Database:
    """Get database instance"""
    return db_instance

def init_database() -> Database:
    """Initialize database"""
    global db_instance
    db_instance = Database()
    return db_instance
