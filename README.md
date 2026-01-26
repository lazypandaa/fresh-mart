# FreshMart E-Commerce Platform

A modern full-stack e-commerce platform for fresh groceries with React frontend and FastAPI backend.

## Project Structure

```
freshmart_q/
├── frontend/          # React + Vite + Tailwind CSS
└── backend/           # FastAPI + MongoDB
└── microservices/     # Email Service
```

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Router
- Lucide Icons

### Backend
- FastAPI
- MongoDB (Motor async driver)
- JWT Authentication
- Bcrypt password hashing

### Microservices
- Node.js
- Express.js
- Bun (js runtime)
- Nodemailer


## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
./start.sh
# Or manually: uvicorn app.main:app --reload --port 8000
```

5. API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. App will be available at: http://localhost:5174

### Microservice Setup

1. Navigate to microservices directory:
```bash
cd microservices
```

2. Navigate to email and install dependencies:
```bash
cd email && npm install
```

3. Start Email Service
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products?department=produce` - Filter by department
- `GET /api/products/{id}` - Get single product
- `GET /api/departments` - Get all departments
- `GET /api/aisles` - Get all aisles

## Database Structure

### Collections
- **products** - Product catalog (11 items)
  - product_id (int)
  - name (str)
  - price (float)
  - department (str)
  - aisle (str)
  - image_url (str)

- **users** - User accounts
  - name (str)
  - email (str)
  - phone (str)
  - password (hashed)
  - created_at (datetime)

## Features

### Frontend
✅ Modern black & white UI design
✅ Responsive layout
✅ Product catalog with categories
✅ User authentication (Login/Signup)
✅ Shopping cart indicator
✅ Search functionality
✅ Newsletter subscription
✅ Mobile-friendly navigation

### Backend
✅ RESTful API
✅ JWT authentication
✅ Password hashing with bcrypt
✅ MongoDB integration
✅ CORS enabled
✅ API documentation (Swagger)
✅ Async operations

## Development

### Test Backend API
```bash
cd backend
source venv/bin/activate
python test_api.py
```

### Check Database
```bash
cd backend
source venv/bin/activate
python check_db.py
```

## Environment Variables

Backend uses hardcoded MongoDB connection for simplicity. For production:
1. Create `.env` file
2. Move sensitive data to environment variables
3. Update `app/core/database.py` to use env vars

## License

MIT
