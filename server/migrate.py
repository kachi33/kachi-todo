"""
Database migration script to handle schema changes
"""
import sqlite3
import os
from main import engine, Base

def migrate_database():
    """Migrate existing database to new schema"""
    db_path = 'todos.db'

    if not os.path.exists(db_path):
        print("No existing database found, creating new schema...")
        Base.metadata.create_all(bind=engine)
        return

    # Connect to existing database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if we need to migrate
        cursor.execute("PRAGMA table_info(todos)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'list_id' not in columns:
            print("Migrating database schema...")

            # Create todo_lists table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS todo_lists (
                    id INTEGER PRIMARY KEY,
                    session_id VARCHAR(36) NOT NULL,
                    name VARCHAR(100) NOT NULL,
                    color VARCHAR(20) DEFAULT 'blue',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Create index on session_id
            cursor.execute("CREATE INDEX IF NOT EXISTS ix_todo_lists_session_id ON todo_lists (session_id)")

            # Get all unique session_ids from todos
            cursor.execute("SELECT DISTINCT session_id FROM todos")
            session_ids = cursor.fetchall()

            # Create default list for each user
            for (session_id,) in session_ids:
                cursor.execute("""
                    INSERT INTO todo_lists (session_id, name, color)
                    VALUES (?, 'Personal', 'blue')
                """, (session_id,))

            # Add list_id column to todos table
            cursor.execute("ALTER TABLE todos ADD COLUMN list_id INTEGER")

            # Update all existing todos to belong to their user's default list
            cursor.execute("""
                UPDATE todos
                SET list_id = (
                    SELECT id FROM todo_lists
                    WHERE todo_lists.session_id = todos.session_id
                    LIMIT 1
                )
            """)

            conn.commit()
            print("Migration completed successfully!")
        else:
            print("Database already migrated.")

    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()