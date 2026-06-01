<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
     <meta name="csrf-token" content="{{ csrf_token() }}"> 
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .login-card {
            background: white;
            border-radius: 24px;
            box-shadow: 
                0 10px 40px rgba(0, 0, 0, 0.08),
                0 0 0 1px rgba(0, 0, 0, 0.02);
            width: 100%;
            max-width: 440px;
            padding: 48px;
        }

        .brand {
            text-align: left;
            margin-bottom: 40px;
        }

        .brand h1 {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }

        .brand p {
            color: #6B7280;
            font-size: 15px;
            line-height: 1.5;
        }

        .brand span {
            color: #2563EB;
            font-weight: 600;
        }

        .admin-center {
            display: inline-block;
            background: #EEF2FF;
            color: #2563EB;
            font-size: 12px;
            font-weight: 600;
            padding: 4px 10px;
            border-radius: 20px;
            margin-top: 8px;
            letter-spacing: 0.3px;
        }

        .form-group {
            margin-bottom: 24px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .input-container {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-icon {
            position: absolute;
            left: 16px;
            color: #9CA3AF;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        }

        .input-icon svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .password-toggle {
            position: absolute;
            right: 16px;
            color: #9CA3AF;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1;
            background: transparent;
            border: none;
            padding: 0;
        }

        .password-toggle svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
            transition: color 0.2s ease;
        }

        .password-toggle:hover svg {
            color: #2563EB;
        }

        input {
            width: 100%;
            padding: 14px 48px 14px 48px;
            border: 1.5px solid #E5E7EB;
            border-radius: 12px;
            font-size: 15px;
            color: #1F2937;
            background: #F9FAFB;
            transition: all 0.2s ease;
            outline: none;
        }

        input:hover {
            border-color: #D1D5DB;
            background: white;
        }

        input:focus {
            border-color: #2563EB;
            background: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        input::placeholder {
            color: #9CA3AF;
            font-size: 14px;
        }

        .password-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .forgot-link {
            color: #2563EB;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .forgot-link:hover {
            color: #1D4ED8;
            text-decoration: underline;
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 20px 0 28px;
        }

        .checkbox-group input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #2563EB;
            border-radius: 4px;
            cursor: pointer;
        }

        .checkbox-group label {
            color: #4B5563;
            font-size: 14px;
            font-weight: 500;
            text-transform: none;
            letter-spacing: normal;
            margin: 0;
            cursor: pointer;
        }

        .login-btn {
            width: 100%;
            padding: 15px;
            background: #2563EB;
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .login-btn:hover {
            background: #1D4ED8;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        .login-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
        }

        .login-btn svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #F3F4F6;
        }

        .footer-links a {
            color: #6B7280;
            font-size: 13px;
            text-decoration: none;
            transition: color 0.2s ease;
        }

        .footer-links a:hover {
            color: #2563EB;
        }

        @media (max-width: 480px) {
            .login-card {
                padding: 32px 24px;
            }
            
            .brand h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="brand">
            <h1 class="text-2xl font-bold" style="color:rgb(131, 133, 233);">Welcome Admin</h1>
            <p>Welcome back! Please enter your credentials to access the dashboard.</p>
        </div>

        <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label for="email">Email</label>
                <div class="input-container">
                    <span class="input-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    </span>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        required
                        autocomplete="email"
                    >
                </div>
            </div>

            <div class="form-group">
                <div class="password-header">
                    <label for="password">Password</label>
                    <a href="#" class="forgot-link">Forgot password?</a>
                </div>
                <div class="input-container">
                    <span class="input-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                    </span>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter your password" 
                        required
                        autocomplete="current-password"
                    >
                    <button type="button" class="password-toggle" id="togglePassword" onclick="togglePasswordVisibility()">
                        <svg id="eyeIcon" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="checkbox-group">
                <input type="checkbox" id="remember">
                <label for="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" class="login-btn">
                Sign in 
                <svg viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
            </button>
        </form>

        <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact Support</a>
        </div>
    </div>

    <script>
        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z M3.53 2.47L2.47 3.53 20.47 21.53 21.53 20.47 3.53 2.47z"/>';
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            }
        }

       function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.login-btn');
    const originalBtnText = btn.innerHTML;
    btn.innerHTML = 'Signing in... <span class="loading-spinner"></span>';
    btn.disabled = true;
    
    // Send login request
    fetch('/admin/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            remember: remember
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Success - redirect to dashboard
            window.location.href = data.redirect;
        } else {
            // Error - show message
            showError(data.message);
            btn.innerHTML = originalBtnText;
            btn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
        btn.innerHTML = originalBtnText;
        btn.disabled = false;
    });
}
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #FEE2E2;
        color: #DC2626;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 14px;
        border: 1px solid #FCA5A5;
    `;
    errorDiv.textContent = message;
    
    // Insert before form
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

        // Add loading state to button
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const btn = document.querySelector('.login-btn');
            btn.innerHTML = 'Signing in... <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
            btn.style.opacity = '0.8';
            btn.disabled = true;
            
            // Re-enable after 2 seconds (for demo)
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.disabled = false;
                btn.innerHTML = 'Sign in <svg viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
            }, 2000);
        });

        // Allow Enter key to submit form
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin(e);
            }
        });
    </script>
</body>
</html>