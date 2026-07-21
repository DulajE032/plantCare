import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "plantcare.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN reset_token VARCHAR")
    cursor.execute("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME")
    cursor.execute("CREATE INDEX ix_users_reset_token ON users (reset_token)")
    conn.commit()
    print("Columns added successfully")
except Exception as e:
    print(f"Error: {e}")

conn.close()
