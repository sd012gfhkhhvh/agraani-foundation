# Agraani Welfare Foundation - Next.js Web Application

A complete production-grade web application for Agraani Welfare Foundation, an NGO based in West Bengal, India, focused on women and child education, skill training, and community development.

## 🎯 Features

### Public Website

- **Homepage**: Hero carousel, programs showcase, impact statistics, and CTAs
- **About Us**: Organization information and strategic objectives
- **Programs**: Detailed program listings with descriptions
- **Team**: Team members showcase
- **Gallery**: Media gallery with images and videos
- **Blog**: News and updates with rich content
- **Contact**: Contact form with email integration
- **Donate**: Donation information and tax benefits
- **Legal**: Legal registrations and compliance documents

### CMS Admin Dashboard

- **Role-based Access Control**: Super Admin, Content Admin, Editor, Viewer
- **Content Management**:
  - Hero banners
  - About content
  - Programs and activities
  - Strategic objectives
  - Team members
  - Gallery items
  - Blog posts
  - Legal documents
- **User Management**: Manage admin users (Super Admin only)
- **Contact Submissions**: View and manage contact form submissions
- **Image Upload**: Local file storage with upload functionality

### Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Google OAuth
- **SEO**: Dynamic metadata, sitemap, robots.txt, Schema.org
- **Subdomain Routing**: admin.domain.com for CMS access

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd agraani-foundation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agraani_foundation?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-a-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_SUBDOMAIN="admin"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 5. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env`

### 6. Run Development Server

```bash
npm run dev
```

The application will be available at:

- Public website: http://localhost:3000
- Admin CMS: http://localhost:3000/admin (in development, subdomain routing requires additional setup)

### 7. Create First Admin User

1. Sign in with Google at http://localhost:3000/login
2. Your user will be created with VIEWER role by default
3. Connect to your database and manually update your role to SUPER_ADMIN:

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-email@gmail.com';
```

## 🛠️ Development

### Project Structure

```
agraani-foundation/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── about/
│   │   ├── programs/
│   │   ├── contact/
│   │   └── ...
│   ├── admin/             # Admin CMS pages
│   │   ├── dashboard/
│   │   ├── hero-banners/
│   │   ├── blog/
│   │   └── ...
│   ├── api/               # API routes
│   │   ├── auth/
│   │   ├── admin/
│   │   └── contact/
│   ├── globals.css
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── public/            # Public website components
│   └── admin/             # Admin-specific components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── auth-utils.ts      # Auth helper functions
│   ├── prisma.ts          # Prisma client
│   ├── seo.ts             # SEO utilities
│   └── utils.ts           # General utilities
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/
│   └── uploads/           # Uploaded images
├── middleware.ts          # Subdomain routing & auth
└── tailwind.config.ts
```

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Add PostgreSQL database (Vercel Postgres, Supabase, or Neon)
5. Configure custom domain and subdomain:
   - Main domain: `yourdomain.com`
   - Admin subdomain: `admin.yourdomain.com`

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (generate a secure secret)
- `NEXTAUTH_URL` (your production URL)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_ADMIN_SUBDOMAIN`

Update Google OAuth authorized redirect URIs to include your production domain.

## 🔐 Security

- All admin routes are protected with NextAuth
- Role-based access control for different admin actions
- API routes validate user permissions
- Environment variables for sensitive data
- CSRF protection via NextAuth

## 📝 License

This project is built for Agraani Welfare Foundation.

## 👥 Support

For issues or questions, contact: agraaniwelfarefoundation@gmail.com
