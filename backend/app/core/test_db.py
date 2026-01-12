import psycopg2
from psycopg2 import OperationalError

# Replace these values with yours
db_name = "clinic_project_db"
db_user = "postgres"         # your username
db_password = "3444"  # your PostgreSQL password
db_host = "localhost"
db_port = "5432"

try:
    conn = psycopg2.connect(
        database=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    print("✅ Connection successful!")
except OperationalError as e:
    print("❌ Connection failed")
    print(e)
finally:
    if 'conn' in locals():
        conn.close()
