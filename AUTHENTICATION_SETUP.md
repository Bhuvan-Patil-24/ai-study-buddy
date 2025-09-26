# GATE Study Buddy - Authentication & Role System

## Overview
This document outlines the authentication system and role-based access control implemented in the GATE Study Buddy platform.

## Features Implemented

### 1. User Authentication
- **Registration**: Users can register with name, email, password, and role (student/admin)
- **Login**: Secure login with JWT token authentication
- **Logout**: Proper session cleanup and token removal
- **Token Management**: Automatic token handling with axios interceptors

### 2. Role-Based Access Control
- **Student Role**: Default role for regular users
- **Admin Role**: Administrative privileges for platform management
- **Protected Routes**: Role-based route protection
- **UI Differentiation**: Different interfaces based on user role

### 3. Backend Changes
- **User Model**: Added `role` field with enum validation (student/admin)
- **Auth Service**: Updated to handle role-based authentication
- **Auth DTO**: Enhanced to validate role selection
- **JWT Tokens**: Include role information in token payload

### 4. Frontend Changes
- **Auth Context**: Complete rewrite with proper state management
- **Protected Routes**: Component for route protection
- **Role-Based Navigation**: Different sidebar menus for students/admins
- **Dashboard**: Role-specific content and features
- **User Management**: Admin-only user management page

## User Roles & Privileges

### Student Role
- Access to study materials and quizzes
- Personal dashboard with progress tracking
- Study sessions and document management
- Team collaboration features
- Leaderboard participation

### Admin Role
- All student privileges
- User management and monitoring
- Platform statistics and analytics
- Quiz and content management
- System administration features

## Testing the System

### 1. Start the Backend
```bash
cd ai-study-buddy/backend
npm install
npm start
```

### 2. Start the Frontend
```bash
cd ai-study-buddy/frontend
npm install
npm run dev
```

### 3. Test Registration
1. Navigate to `/signup`
2. Fill in the registration form
3. Select either "Student" or "Admin" role
4. Submit the form

### 4. Test Login
1. Navigate to `/login`
2. Enter your credentials
3. You should be redirected to the dashboard
4. Check the sidebar and header for role-specific content

### 5. Test Role-Based Access
- **As Student**: You should see student-specific navigation and dashboard
- **As Admin**: You should see admin-specific navigation including "Manage Users"

### 6. Test Protected Routes
- Try accessing `/users` as a student - you should be redirected to unauthorized page
- Access `/users` as an admin - you should see the user management interface

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/verify` - Token verification
- `GET /api/v1/auth/users` - Get all users (admin only)

### Request/Response Format
```json
// Registration Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}

// Login Response
{
  "status": "success",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- Automatic token expiration handling
- Secure session management

## Environment Variables
Make sure to set the following environment variables:
- `SECRET_KEY`: JWT secret key for token signing
- `VITE_API_URL`: Frontend API base URL (defaults to http://localhost:5000/api)

## Next Steps
1. Add email verification for registration
2. Implement password reset functionality
3. Add more granular permissions within roles
4. Implement audit logging for admin actions
5. Add user profile management
6. Implement session timeout handling
