# Authentication Debug Guide

## Current Status
- Next.js App: http://localhost:4000 (working, authenticated)
- React Admin: http://localhost:3000 (not working, shows "go to login")
- Backend API: http://localhost:8000/api

## Step-by-Step Debug Process

### 1. Verify Backend Environment Variables

Run this command in your backend directory:
```bash
cd backend/billora
php artisan env:list | grep AUTH
```

You should see:
```
AUTH_COOKIE_DOMAIN=localhost
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
ADMIN_APP_URL=http://localhost:3000
FRONTEND_LOGIN_URL=http://localhost:4000
```

### 2. Check Laravel Configuration

Run this command:
```bash
php artisan config:cache --force
```

### 3. Test Authentication Endpoint Directly

Open browser and navigate to:
```
http://localhost:8000/api/auth/session/check
```

Expected response (if authenticated):
```json
{
  "status": true,
  "message": "Authenticated",
  "user": {...},
  "token": "..."
}
```

Expected response (if not authenticated):
```json
{
  "status": false,
  "message": "No auth token found"
}
```

### 4. Check Browser Cookies

1. Open browser dev tools (F12)
2. Go to Application tab
3. Storage -> Cookies -> http://localhost
4. Look for these cookies:
   - `client_auth_token`
   - `client_id`
   - `client_email`
   - `client_name`

**Important:** The Domain should be `localhost` (not `localhost:4000` or `localhost:3000`)

### 5. Test Cross-Domain Cookie Access

1. Login to Next.js app (http://localhost:4000)
2. Check cookies are set in browser
3. Open React Admin app (http://localhost:3000)
4. Check if same cookies are visible

### 6. Manual Cookie Test

In React Admin app console, run:
```javascript
// Check if cookies are accessible
document.cookie.split(';').forEach(cookie => {
  console.log(cookie.trim());
});

// Try to access auth token specifically
const cookies = {};
document.cookie.split(';').forEach(cookie => {
  const [name, value] = cookie.trim().split('=');
  if (name.startsWith('client_')) {
    cookies[name] = value;
  }
});
console.log('Auth cookies:', cookies);
```

### 7. Test API Call from React Admin

In React Admin console, run:
```javascript
fetch('http://localhost:8000/api/auth/session/check', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log('Auth check result:', data))
.catch(error => console.error('Auth check error:', error));
```

## Common Issues & Solutions

### Issue 1: Backend Environment Not Loaded
**Solution:**
```bash
php artisan config:clear
php artisan cache:clear
php artisan serve
```

### Issue 2: Cookies Not Shared Between Ports
**Solution:**
- Ensure `AUTH_COOKIE_DOMAIN=localhost` is set
- Clear all browser cookies for localhost
- Restart Laravel server

### Issue 3: CORS Issues
**Solution:**
- Check `config/cors.php` includes both ports 3000 and 4000
- Ensure `supports_credentials: true`

### Issue 4: Sanctum Token Issues
**Solution:**
```bash
php artisan migrate:fresh --seed
php artisan passport:install
```

## Quick Fix Checklist

1. [ ] Backend .env has shared auth config
2. [ ] Laravel server restarted after .env changes
3. [ ] CORS config includes both ports
4. [ ] Browser cookies show domain `localhost`
5. [ ] Auth endpoint returns correct response
6. [ ] Cross-domain cookie access works

## Final Test Sequence

1. Clear all browser cookies for localhost
2. Restart Laravel server
3. Login to Next.js app
4. Verify cookies are set with domain `localhost`
5. Open React Admin app
6. Should auto-authenticate

If still not working, run the debug commands above and share the output.
