# BookMe - E-Ticketing Platform

Full-stack booking platform for flights, hotels, and events with RBAC authentication.

## Quick Start

### Option 1: With Docker (Recommended)

```bash
# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:8686
# Backend:  http://localhost:8585/api
# Admin:    http://localhost:8585/admin
```

### Option 2: Without Docker

#### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py makemigrations
python manage.py migrate

# Seed data
python seed_auth.py
python init_db.py

# Run server
python manage.py runserver 8585
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
PORT=8686 npm start
```

## Test Credentials

- **Customer**: `testuser` / `password123`
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

## Available Scripts

### Frontend (npm)
```bash
PORT=8686 npm start  # Start dev server (port 8686)
npm run build  # Build for production
npm test       # Run tests
```

### Backend (Python)
```bash
python manage.py runserver 8585   # Start server (port 8585)
python manage.py makemigrations   # Create migrations
python manage.py migrate          # Apply migrations
python manage.py createsuperuser  # Create admin user
```

## API Endpoints

- `POST /api/auth/register/` - Register
- `POST /api/auth/login/` - Login
- `GET /api/auth/me/` - Current user
- `GET /api/flights/` - List flights
- `GET /api/hotels/` - List hotels
- `GET /api/events/` - List events
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/` - List bookings
- `POST /api/bookings/{id}/cancel/` - Cancel booking
- `GET /api/dashboard-stats/` - Dashboard stats

## Tech Stack

- **Backend**: Django 4.2 + DRF + JWT
- **Frontend**: React 18 + React Router
- **Database**: SQLite (dev) / PostgreSQL (prod)

## Project Structure

```
├── backend/          # Django API
│   ├── api/         # Main app
│   ├── bookme/      # Settings
│   └── manage.py
├── frontend/         # React app
│   └── src/
└── docker-compose.yml
```
