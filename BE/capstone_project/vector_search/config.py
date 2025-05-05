import os

# --- API Keys Configuration ---
PRIMARY_GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCN_flhR6pXNOvQWjZSMAwe_t1DnI_O8IM")
GEMINI_API_KEYS = [
    PRIMARY_GOOGLE_API_KEY,
# API keys
]
GEMINI_API_KEYS = [key for key in GEMINI_API_KEYS if key]  # Loại bỏ key rỗng

# --- ChromaDB and Embedding Configuration ---
CHROMA_PERSIST_PATH = "F:\\missing_people(NCHCCCL)\\test_gemini_emb_new\\chroma_db_store"
CHROMA_COLLECTION_NAME = "missing_people_profiles"
EMBEDDING_MODEL_NAME = "models/text-embedding-004"
DETAIL_COLUMN_NAME = "Chi tiet_merged"

# --- LLM Configuration ---
BATCH_SIZE_LLM = 20
MAX_CONCURRENT_REQUESTS_LLM = len(GEMINI_API_KEYS)
MAX_RETRIES_LLM = 5
INITIAL_RETRY_DELAY_LLM = 5  # Giây
BATCH_GROUP_DELAY_LLM = 2  # Có thể giảm delay này vì đang dùng nhiều key

# --- Django Integration ---
# Setup Django environment if running as a standalone script
import sys
import django

# Add project path to sys.path
sys.path.append("F:\\Capstone-Project\\BE\\capstone_project")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "capstone_project.settings")

# Initialize Django
try:
    django.setup()
except Exception as e:
    print(f"Warning: Could not initialize Django: {e}")