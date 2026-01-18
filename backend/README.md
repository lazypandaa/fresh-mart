# FreshMart Backend Setup

## Quick Start

### For macOS/Linux:
```bash
# Setup (run once)
./setup.sh

# Activate virtual environment
source venv/bin/activate

# Start server
./start.sh
```

### For Windows:
```cmd
# Setup (run once)
setup.bat

# Activate virtual environment
venv\Scripts\activate

# Start server
start.bat
```

## Manual Setup

1. **Create virtual environment:**
   ```bash
   python3 -m venv venv  # macOS/Linux
   python -m venv venv   # Windows
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate      # macOS/Linux
   venv\Scripts\activate         # Windows
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Important Notes

- **Virtual Environment**: The `(venv)` prefix should appear in your terminal when activated
- **bcrypt Issue**: Fixed with bcrypt==4.1.3 in requirements.txt
- **MongoDB**: Make sure MongoDB connection string is correct in `app/core/database.py`

## API Endpoints

- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/

## Troubleshooting

1. **bcrypt errors**: Delete `venv` folder and run setup again
2. **Import errors**: Make sure you're in the activated virtual environment
3. **MongoDB errors**: Check your MongoDB connection string