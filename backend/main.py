from database.database import create_db_and_tables

if __name__ == "__main__":
    print("Attempting to create database tables in Supabase...")
    create_db_and_tables()
    print("Tables created/verified. You can now start the FastAPI server.")