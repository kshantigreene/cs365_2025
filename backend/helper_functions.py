from datetime import datetime

def get_current_date_str() -> str:
    """Returns the current date as a string in 'YYYY-MM-DD' format."""
    return datetime.now().strftime('%Y-%m-%d')