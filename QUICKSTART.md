# Quick Start Guide

This guide will help you get the Agraani Welfare Foundation application running locally in minutes.

## Prerequisites

- Node.js 18+ installed
- Docker Desktop running
- Git

## Setup Steps

### 1. Start Docker

Make sure Docker Desktop is running on your system.

**Windows/Mac**: Start Docker Desktop application

**Linux**:

```bash
sudo systemctl start docker
```

### 2. Run Setup Script

Run the automated setup script that will:

- Start PostgreSQL database
- Generate Prisma client
- Create database tables
- Seed sample data

```bash
./setup.sh
```

### 3. Configure Google OAuth (Optional for now)

To enable admin login, you need Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env`:

```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at:

- **Public Website**: http://localhost:3000
- **Admin CMS**: http://localhost:3000/admin

## First-Time Admin Setup

1. Sign in with Google at http://localhost:3000/login
2. Your user will be created with VIEWER role
3. Update your role to SUPER_ADMIN:

```bash
# Access the database
docker-compose exec postgres psql -U agraani -d agraani_foundation

# Update your role (replace with your email)
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-email@gmail.com';
\q
```

## Useful Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database
npm run prisma:studio

# Seed database again
npm run prisma:seed

# View database logs
docker-compose logs -f postgres
```

## Troubleshooting

### Docker not running

```
Error: Cannot connect to Docker daemon
```

**Solution**: Start Docker Desktop

### Port 5432 already in use

```
Error: port is already allocated
```

**Solution**: Stop any existing PostgreSQL service or change the port in docker-compose.yml

### Database connection error

```
Error: P1001: Can't reach database server
```

**Solution**: Wait a few seconds for database to fully start, or restart: `docker-compose restart`

## Next Steps

1. Explore the public website at http://localhost:3000
2. Check out the admin dashboard at http://localhost:3000/admin (after OAuth setup)
3. Review the [README.md](README.md) for full documentation
4. Start customizing content through the database or CMS

## Getting Help

For issues or questions, contact: agraaniwelfarefoundation@gmail.com
