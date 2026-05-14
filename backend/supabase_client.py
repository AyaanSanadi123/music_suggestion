import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
# Use Service Key for backend admin privileges
key: str = os.environ.get("SUPABASE_SERVICE_KEY") 

if not url or not key:
    raise ValueError("Supabase credentials missing! Check your .env file.")

# Initialize the client
supabase: Client = create_client(url, key)

if __name__ == "__main__":
    # Test connection
    try:
        res = supabase.table("mood_tags").select("*").limit(1).execute()
        print("✅ Connection Successful!")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")