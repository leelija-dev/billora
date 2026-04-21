# Shared Authentication (SSO) Setup Guide

This guide explains how to set up Single Sign-On (SSO) between your Next.js MyVyapar app and React Admin app.

## Architecture Overview

```
Next.js App (Port 3000)     Laravel API (Port 8000)     React Admin App (Port 3001)
       MyVyapar  <------------------------->           Admin Dashboard
```

## 1. Backend Configuration

### Update Laravel .env file
Add these variables to your `backend/billora/.env`:

```env
# Shared Authentication Configuration
AUTH_COOKIE_DOMAIN=localhost
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
ADMIN_APP_URL=http://localhost:3001
FRONTEND_LOGIN_URL=http://localhost:3000
```

### CORS Configuration
The CORS config is already updated to include both applications:
- `http://localhost:3000` (Next.js)
- `http://localhost:3001` (React Admin)

## 2. Frontend Configuration

### Next.js App (MyVyapar)
Update `client/my-vyapar/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_URL=http://localhost:3000
```

### React Admin App
Update `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MAIN_APP_URL=http://localhost:3000
VITE_ADMIN_APP_URL=http://localhost:3001
```

## 3. Implementation Details

### Shared Authentication Service
Location: `shared/auth-service.js`

This service handles:
- Cross-domain cookie management
- Authentication status checking
- Login/logout operations
- App redirection

### Authentication Flow

#### Login Process:
1. User logs into Next.js app (MyVyapar)
2. Backend sets authentication cookies with domain `localhost`
3. Cookies are accessible by both applications

#### Admin Access:
1. User clicks "Admin Panel" in Next.js app
2. Opens React Admin app in new tab
3. React Admin app checks authentication status
4. If authenticated, shows admin dashboard
5. If not authenticated, redirects to Next.js login

#### Logout Process:
1. User logs out from either app
2. Backend clears authentication cookies
3. Both apps detect logout and redirect to login

## 4. File Structure

```
Projects/Bill/
|
+-- shared/
|   +-- auth-service.js              # Shared authentication logic
|
+-- client/my-vyapar/
|   +-- contexts/SharedAuthContext.jsx
|   +-- components/SharedNavigation.jsx
|   +-- app/layout.jsx                # Wrapped with SharedAuthProvider
|
+-- admin/
|   +-- src/contexts/SharedAuthContext.jsx
|   +-- src/components/AuthGuard.jsx
|   +-- src/App.jsx                   # Wrapped with SharedAuthProvider & AuthGuard
|
+-- backend/billora/
|   +-- config/cors.php               # Updated for cross-domain
|   +-- .env                          # Shared auth configuration
```

## 5. Key Features

### Cross-Domain Cookies
- Domain: `localhost`
- Secure: `false` (for development)
- SameSite: `lax`
- Duration: 30 days

### Authentication Checking
- Periodic checks every 5 minutes
- Tab visibility change detection
- Storage event synchronization

### Security Features
- Sanctum token authentication
- CSRF protection
- Automatic logout on token expiration
- Cross-tab synchronization

## 6. Usage Examples

### In Next.js App:
```jsx
import { useSharedAuth } from '../contexts/SharedAuthContext';

function MyComponent() {
  const { user, isAuthenticated, redirectToAdmin, logout } = useSharedAuth();
  
  return (
    <div>
      {isAuthenticated && (
        <button onClick={redirectToAdmin}>
          Go to Admin
        </button>
      )}
    </div>
  );
}
```

### In React Admin App:
```jsx
import { useSharedAuth } from '../contexts/SharedAuthContext';

function AdminComponent() {
  const { user, logout, redirectToMainApp } = useSharedAuth();
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
      <button onClick={redirectToMainApp}>
        Back to Main App
      </button>
    </div>
  );
}
```

## 7. Testing the Setup

### Step-by-Step Testing:

1. **Start all applications:**
   ```bash
   # Backend
   cd backend/billora
   php artisan serve
   
   # Next.js App
   cd client/my-vyapar
   npm run dev
   
   # React Admin App
   cd admin
   npm run dev
   ```

2. **Test Login Flow:**
   - Go to `http://localhost:3000`
   - Login with valid credentials
   - Check that authentication cookies are set

3. **Test Admin Access:**
   - Click "Admin Panel" button
   - Verify React Admin app opens with user authenticated
   - Check user data is displayed correctly

4. **Test Logout:**
   - Logout from either application
   - Verify both apps redirect to login
   - Check cookies are cleared

5. **Test Cross-Tab Sync:**
   - Open both apps in different tabs
   - Login in one tab
   - Verify other tab detects authentication
   - Logout in one tab
   - Verify other tab detects logout

## 8. Troubleshooting

### Common Issues:

#### CORS Errors
- Verify backend CORS configuration
- Check both origins are listed in `config/cors.php`
- Ensure `supports_credentials: true`

#### Cookie Issues
- Verify domain is set to `localhost`
- Check `SameSite` is `lax`
- Ensure cookies are not being blocked by browser

#### Authentication Not Detected
- Check API endpoints are accessible
- Verify cookie names match between apps
- Ensure credentials are included in fetch requests

#### Admin App Not Loading
- Check React Admin app is running on port 3001
- Verify SharedAuthProvider is properly configured
- Check browser console for errors

## 9. Production Deployment

For production, update these settings:

### Backend .env:
```env
AUTH_COOKIE_DOMAIN=.yourdomain.com
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAMESITE=strict
```

### Frontend .env:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
NEXT_PUBLIC_MAIN_URL=https://app.yourdomain.com
```

### React Admin .env:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_MAIN_APP_URL=https://app.yourdomain.com
VITE_ADMIN_APP_URL=https://admin.yourdomain.com
```

## 10. Security Considerations

- Always use HTTPS in production
- Set secure cookie flags
- Implement proper CSRF protection
- Regular security audits
- Monitor authentication logs
- Implement rate limiting on auth endpoints

This setup provides seamless SSO experience between your Next.js and React applications while maintaining security and best practices.
