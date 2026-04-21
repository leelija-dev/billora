# Backend Environment Setup for Shared Authentication

## Required Backend .env Configuration

Add these variables to your `backend/billora/.env` file:

```env
# Shared Authentication Configuration
AUTH_COOKIE_DOMAIN=localhost
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_SAMESITE=lax
ADMIN_APP_URL=http://localhost:3001
FRONTEND_LOGIN_URL=http://localhost:3000
```

## Manual Setup Steps

1. Open `backend/billora/.env` file
2. Add the above configuration at the end
3. Restart the Laravel server:
   ```bash
   cd backend/billora
   php artisan serve
   ```

## Alternative: Use PHP Artisan Commands

If you prefer, you can set these using Laravel's environment commands:

```bash
cd backend/billora

php artisan env:set AUTH_COOKIE_DOMAIN=localhost
php artisan env:set AUTH_COOKIE_SECURE=false
php artisan env:set AUTH_COOKIE_SAMESITE=lax
php artisan env:set ADMIN_APP_URL=http://localhost:3001
```

## Verify Configuration

After setting up, verify the configuration is working:

1. Clear Laravel cache:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```

2. Check the environment:
   ```bash
   php artisan env:list | grep AUTH
   ```

## Test the Authentication

1. Login to Next.js app (http://localhost:3000)
2. Check browser cookies for `client_auth_token`
3. Open React Admin app (http://localhost:3001)
4. Should auto-authenticate if cookies are shared properly

## Troubleshooting

If React Admin still shows "go to login":

1. Check browser console for CORS errors
2. Verify cookies are being set with domain `localhost`
3. Check that backend server is running with the new environment
4. Clear browser cookies and test again
