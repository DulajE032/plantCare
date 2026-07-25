import asyncio
import sys
import uuid
import getpass
from pathlib import Path

# Add backend directory to sys.path to allow importing app module
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.database import AsyncSessionLocal
from app.db_models import User
from app.services.auth_utils import get_password_hash

async def create_admin():
    print("=========================================")
    print("🌿 PlantCare - Create Admin Bootstrapper")
    print("=========================================")

    full_name = input("Enter Full Name: ").strip()
    if not full_name:
        print("Error: Name cannot be empty.")
        return

    email = input("Enter Email Address: ").strip().lower()
    if not email or "@" not in email:
        print("Error: Invalid email address.")
        return

    password = getpass.getpass("Enter Password: ").strip()
    if len(password) < 6:
        print("Error: Password must be at least 6 characters.")
        return

    confirm_password = getpass.getpass("Confirm Password: ").strip()
    if password != confirm_password:
        print("Error: Passwords do not match.")
        return

    async with AsyncSessionLocal() as db:
        from sqlalchemy.future import select
        # Check if email is already taken
        result = await db.execute(select(User).where(User.email == email))
        existing_user = result.scalars().first()
        if existing_user:
            print(f"Error: A user with email '{email}' already exists.")
            return

        db_user = User(
            id=f"user-{uuid.uuid4().hex[:12]}",
            email=email,
            full_name=full_name,
            hashed_password=get_password_hash(password),
            role="admin",
        )
        db.add(db_user)
        await db.commit()
        print(f"\n🎉 Admin user '{full_name}' ({email}) successfully created!")

if __name__ == "__main__":
    asyncio.run(create_admin())
