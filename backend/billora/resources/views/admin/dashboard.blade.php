<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: #f3f4f6;
            min-height: 100vh;
        }

        /* Navigation Bar */
        .navbar {
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .nav-left {
            display: flex;
            align-items: center;
            gap: 40px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .logo svg {
            width: 28px;
            height: 28px;
            fill: #2563EB;
        }

        .logo span {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
        }

        .nav-links {
            display: flex;
            gap: 24px;
        }

        .nav-links a {
            color: #6B7280;
            text-decoration: none;
            font-size: 15px;
            font-weight: 500;
            transition: color 0.2s ease;
            padding: 8px 0;
            border-bottom: 2px solid transparent;
        }

        .nav-links a:hover {
            color: #2563EB;
        }

        .nav-links a.active {
            color: #2563EB;
            border-bottom-color: #2563EB;
        }

        .nav-right {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .notification-icon {
            position: relative;
            cursor: pointer;
        }

        .notification-icon svg {
            width: 22px;
            height: 22px;
            fill: #6B7280;
            transition: fill 0.2s ease;
        }

        .notification-icon:hover svg {
            fill: #2563EB;
        }

        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #EF4444;
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 5px;
            border-radius: 10px;
            min-width: 18px;
            text-align: center;
        }

        .admin-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 8px;
            transition: background 0.2s ease;
        }

        .admin-profile:hover {
            background: #F3F4F6;
        }

        .admin-avatar {
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 16px;
        }

        .admin-info {
            display: flex;
            flex-direction: column;
        }

        .admin-name {
            color: #111827;
            font-size: 14px;
            font-weight: 600;
        }

        .admin-role {
            color: #6B7280;
            font-size: 12px;
        }

        .dropdown-arrow svg {
            width: 18px;
            height: 18px;
            fill: #6B7280;
        }

        /* Main Content */
        .main-content {
            margin-top: 8px;
            padding: 32px;
            min-height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .welcome-container {
            text-align: center;
            max-width: 600px;
            padding: 18px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .welcome-icon {
            width: 120px;
            height: 120px;
            background: #EEF2FF;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 32px;
        }

        .welcome-icon svg {
            width: 60px;
            height: 60px;
            fill: #2563EB;
        }

        h1 {
            font-size: 42px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
        }

        .welcome-subtitle {
            color: #6B7280;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .admin-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #F3F4F6;
            padding: 12px 24px;
            border-radius: 50px;
            margin-bottom: 32px;
        }

        .admin-badge svg {
            width: 20px;
            height: 20px;
            fill: #2563EB;
        }

        .admin-badge span {
            color: #374151;
            font-size: 15px;
            font-weight: 500;
        }

        .admin-badge .date {
            color: #2563EB;
            font-weight: 600;
            margin-left: 5px;
        }

        .action-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            margin-top: 3px;
        }

        .btn {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        .btn-primary {
            background: #2563EB;
            color: white;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-primary:hover {
            background: #1D4ED8;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        .btn-secondary {
            background: #F3F4F6;
            color: #374151;
        }

        .btn-secondary:hover {
            background: #E5E7EB;
            transform: translateY(-2px);
        }

        /* Quick Stats (minimal) */
        .quick-stats {
            display: flex;
            gap: 24px;
            justify-content: center;
            margin-top: 8px;
            opacity: 0.8;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #2563EB;
        }

        .stat-label {
            color: #6B7280;
            font-size: 13px;
            margin-top: 4px;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 4px;
            color: #9CA3AF;
            font-size: 13px;
            border-top: 1px solid #E5E7EB;
            background: white;
        }

        @media (max-width: 768px) {
            .navbar {
                padding: 6px 2px;
            }

            .nav-links {
                display: none;
            }

            .admin-info {
                display: none;
            }

            .main-content {
                padding: 2px;
            }

            .welcome-container {
                padding: 2px 2px;
            }

            h1 {
                font-size: 32px;
            }

            .action-buttons {
                flex-direction: column;
            }

            .quick-stats {
                flex-direction: column;
                gap: 16px;
            }
        }
    </style>
</head>
<body>
     @include('admin.sidebar') {{-- or layouts.sidebar depending on folder --}}
    <!-- Main Content -->
    <div class="main-content">
        <div class="welcome-container">
            
            <h1>Welcome Admin!</h1>
            <p class="welcome-subtitle">You have successfully logged into the administrative dashboard. Manage your system, users, and settings from here.</p>
            
            <div class="admin-badge">
                <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
                <span>Administrator Access · <span class="date" id="currentDate"></span></span>
            </div>

        </div>
    </div>


    <script>
        // Display current date
        const dateElement = document.getElementById('currentDate');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const today = new Date().toLocaleDateString('en-US', options);
        dateElement.textContent = today;

        // Optional: Add click handlers
        document.querySelector('.admin-profile').addEventListener('click', function() {
            console.log('Profile menu clicked');
            // Add dropdown menu functionality here
        });

        document.querySelector('.notification-icon').addEventListener('click', function() {
            console.log('Notifications clicked');
            // Add notifications panel here
        });

        // Simulate loading state (optional)
        window.addEventListener('load', function() {
            console.log('Dashboard loaded successfully');
        });

        // Add keyboard shortcut (Ctrl + D) to go to dashboard
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                alert('Redirecting to dashboard...');
                // window.location.href = '/dashboard';
            }
        });
    </script>
</body>
</html>