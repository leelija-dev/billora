<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard · Vista</title>
    <!-- Google Font Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: #f0f2f5;
            display: flex;
            min-height: 100vh;
        }

        /* ===== SIDEBAR (properly integrated) ===== */
        .sidebar {
            width: 280px;
            background: linear-gradient(180deg, #0b1221 0%, #121b2f 100%);
            color: #e0e7ff;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease;
            z-index: 100;
        }

        .sidebar-header {
            padding: 28px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            background: #3b82f6;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
        }

        .logo-icon svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        .logo-text {
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: white;
        }

        .logo-text span {
            color: #60a5fa;
            font-weight: 400;
        }

        .sidebar-nav {
            flex: 1;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px 18px;
            border-radius: 12px;
            color: #9fb1d5;
            transition: all 0.2s;
            font-weight: 500;
            font-size: 15px;
        }

        .nav-item svg {
            width: 22px;
            height: 22px;
            fill: #7186b0;
            transition: fill 0.2s;
        }

        .nav-item:hover {
            background: rgba(255, 255, 255, 0.06);
            color: white;
        }

        .nav-item:hover svg {
            fill: #60a5fa;
        }

        .nav-item.active {
            background: #2563eb;
            color: white;
            box-shadow: 0 8px 16px -6px #1e3a8a;
        }

        .nav-item.active svg {
            fill: white;
        }

        .nav-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin: 16px 0;
        }

        /* main content — push to the right of fixed sidebar */
        .dashboard {
            flex: 1;
            margin-left: auto;
            width: calc(100% - 280px);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* top navigation (inside main area) */
        .top-nav {
            background: white;
            padding: 12px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            border-bottom: 1px solid #edf2f7;
        }

        .page-title {
            font-weight: 600;
            font-size: 18px;
            color: #1e293b;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 24px;
        }

        .notification-badge {
            position: relative;
            cursor: pointer;
        }

        .notification-badge svg {
            width: 22px;
            height: 22px;
            fill: #5f6b7a;
            transition: fill 0.2s;
        }

        .notification-badge:hover svg {
            fill: #2563eb;
        }

        .badge {
            position: absolute;
            top: -6px;
            right: -7px;
            background: #ef4444;
            color: white;
            font-size: 10px;
            font-weight: 600;
            padding: 2px 5px;
            border-radius: 30px;
            min-width: 18px;
            text-align: center;
            box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .admin-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 5px 10px 5px 5px;
            border-radius: 40px;
            background: #f8fafd;
            cursor: pointer;
            transition: background 0.2s;
        }

        .admin-profile:hover {
            background: #eef2f6;
        }

        .avatar {
            width: 38px;
            height: 38px;
            background: linear-gradient(145deg, #2563eb, #1e40af);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 15px;
        }

        .admin-details {
            line-height: 1.4;
        }

        .admin-name {
            font-weight: 600;
            font-size: 14px;
            color: #0f1825;
        }

        .admin-email {
            font-size: 12px;
            color: #617388;
        }

        .dropdown-icon svg {
            width: 18px;
            height: 18px;
            fill: #7e8b9e;
        }

        /* main content area */
        .content-wrapper {
            padding: 32px;
            flex: 1;
        }

        /* welcome card */
        .welcome-card {
            background: white;
            border-radius: 28px;
            padding: 40px 48px;
            box-shadow: 0 20px 40px -12px rgba(0, 27, 58, 0.12);
            border: 1px solid #ffffff50;
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 40px;
            justify-content: space-between;
        }

        .welcome-left h1 {
            font-size: 40px;
            font-weight: 700;
            color: #0a1929;
            letter-spacing: -1px;
            line-height: 1.2;
            margin-bottom: 16px;
        }

        .welcome-left h1 span {
            color: #2563eb;
            background: #e6edff;
            padding: 6px 14px;
            border-radius: 60px;
            font-size: 28px;
            margin-left: 8px;
        }

        .greeting-text {
            font-size: 18px;
            color: #445566;
            max-width: 500px;
            margin-bottom: 28px;
            line-height: 1.5;
        }

        .date-chip {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #f1f5f9;
            border-radius: 40px;
            padding: 12px 24px;
            font-weight: 500;
            color: #1f2a41;
        }

        .date-chip svg {
            width: 20px;
            height: 20px;
            fill: #2563eb;
        }

        .date-chip .date {
            font-weight: 700;
            color: #1e3a8a;
        }

        .welcome-right {
            background: #f0f6ff;
            border-radius: 40px;
            padding: 32px;
            min-width: 240px;
        }

        .stat-summary {
            display: flex;
            flex-direction: column;
            gap: 24px;
        }

        .stat-summary-item {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .stat-icon {
            background: white;
            width: 52px;
            height: 52px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 18px -8px #bbd4ff;
        }

        .stat-icon svg {
            width: 26px;
            height: 26px;
            fill: #2563eb;
        }

        .stat-numbers h3 {
            font-size: 26px;
            font-weight: 700;
            color: #0a1e42;
            line-height: 1.2;
        }

        .stat-numbers p {
            color: #52637a;
            font-size: 14px;
            font-weight: 500;
        }

        /* quick actions row */
        .action-row {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin: 32px 0 24px;
        }

        .action-btn {
            background: white;
            border: 1px solid #e8edf3;
            border-radius: 18px;
            padding: 16px 28px;
            display: flex;
            align-items: center;
            gap: 14px;
            font-weight: 600;
            color: #1e2a44;
            transition: 0.15s;
            cursor: default;
            box-shadow: 0 4px 8px #00000004;
        }

        .action-btn svg {
            width: 22px;
            height: 22px;
            fill: #3b6ab0;
        }

        .action-btn:hover {
            border-color: #b9d1fd;
            background: #f6faff;
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -14px #2563eb60;
        }

        /* stats grid */
        .insight-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 22px;
            margin-top: 32px;
        }

        .insight-card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 8px 24px #00000008;
            border: 1px solid #ffffff;
            transition: all 0.2s;
        }

        .insight-card:hover {
            border-color: #d9e6ff;
            box-shadow: 0 20px 30px -12px #afcbff;
        }

        .card-title {
            color: #6f7d95;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .card-value {
            font-size: 34px;
            font-weight: 700;
            color: #0a1f44;
            letter-spacing: -1px;
        }

        .card-footer {
            margin-top: 18px;
            color: #42a85f;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
            border-top: 1px dashed #dee6f0;
            padding-top: 14px;
        }

        .trend-down {
            color: #c2414a;
        }

        /* footer */
        .footer-note {
            margin-top: 48px;
            text-align: center;
            font-size: 14px;
            color: #7e8c9f;
            border-top: 1px solid #e6ecf4;
            padding-top: 24px;
        }

        /* mobile/tablet responsiveness */
        @media (max-width: 1000px) {
            .sidebar {
                width: 90px;
                overflow: hidden;
            }
            .sidebar .logo-text, .sidebar .nav-item span:not(.active) {
                display: none;
            }
            .sidebar-header {
                padding: 24px 0;
                text-align: center;
            }
            .logo-area {
                justify-content: center;
            }
            .dashboard {
                margin-left: 90px;
                width: calc(100% - 90px);
            }
            .welcome-card {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        @media (max-width: 600px) {
            .top-nav {
                padding: 12px 16px;
            }
            .content-wrapper {
                padding: 16px;
            }
            .welcome-left h1 {
                font-size: 32px;
            }
            .admin-details {
                display: none;
            }
        }

        /* animation */
        .fade-in-up {
            animation: fadeInUp 0.5s ease forwards;
        }
        @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(14px); }
            100% { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
     @include('admin.sidebar')

    <!-- MAIN DASHBOARD (with top nav) -->
    <main class="dashboard">
       
        <!-- content area -->
        <div class="content-wrapper fade-in-up">
            <!-- welcome card (blends sidebar + admin info) -->
            <div class="welcome-card">
                <div class="welcome-left">
                    <h1>Welcome back, <span>Lakshman</span></h1>
                    <p class="greeting-text">You have full administrative access. All critical metrics are performing well.</p>
                    <div class="date-chip">
                        <svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h4v4H7v-4z"/></svg>
                        <span>Today is <span class="date" id="currentDate"></span></span>
                    </div>
                </div>
                <div class="welcome-right">
                    <div class="stat-summary">
                        <div class="stat-summary-item">
                            <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V17h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
                            <div class="stat-numbers">
                                <h3>2,418</h3>
                                <p>active users</p>
                            </div>
                        </div>
                        <div class="stat-summary-item">
                            <div class="stat-icon"><svg viewBox="0 0 24 24"><path d="M21 6h-2v3h-2V6h-2V4h2V2h2v2h2v2zm-6-4v2h-2V2h2zm0 8h-2v2h2v-2zm-2-2h2V6h-2v2zm0 8h2v-2h-2v2zM9 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm4-5V8c0-2.21-1.79-4-4-4s-4 1.79-4 4v9H2v2h20v-2h-4z"/></svg></div>
                            <div class="stat-numbers">
                                <h3>12</h3>
                                <p>pending alerts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- action buttons (quick admin tasks) -->
            <div class="action-row">
                <div class="action-btn">
                    <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                    New content
                </div>
                <div class="action-btn">
                    <svg viewBox="0 0 24 24"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                    Quick audit
                </div>
                <div class="action-btn">
                    <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    Invite admin
                </div>
            </div>

            <!-- insight cards (mini stats) -->
            <div class="insight-grid">
                <div class="insight-card">
                    <div class="card-title"><svg viewBox="0 0 24 24" width="18" height="18" fill="#3b82f6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg> System health</div>
                    <div class="card-value">98.6%</div>
                    <div class="card-footer">↑ 2.1% vs last week</div>
                </div>
                <div class="insight-card">
                    <div class="card-title"><svg viewBox="0 0 24 24" width="18" height="18" fill="#3b82f6"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> Storage</div>
                    <div class="card-value">64%</div>
                    <div class="card-footer">used 128/200 GB</div>
                </div>
                <div class="insight-card">
                    <div class="card-title"><svg viewBox="0 0 24 24" width="18" height="18" fill="#3b82f6"><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg> Tasks</div>
                    <div class="card-value">14</div>
                    <div class="card-footer">3 require attention</div>
                </div>
                <div class="insight-card">
                    <div class="card-title"><svg viewBox="0 0 24 24" width="18" height="18" fill="#3b82f6"><path d="M21 6h-2v3h-2V6h-2V4h2V2h2v2h2v2zm-6-4v2h-2V2h2zm0 8h-2v2h2v-2zm-2-2h2V6h-2v2zm0 8h2v-2h-2v2zM7 6h4v2H7V6zm0 10h4v2H7v-2zm0-4h4v2H7v-2zm-4 8h.01L5 20h14v2H3v-2zM3 4h4v2H3V4z"/></svg> Reports</div>
                    <div class="card-value">9</div>
                    <div class="card-footer trend-down">2 pending review</div>
                </div>
            </div>

            <!-- footer note -->
            <div class="footer-note">
                <span>© 2025 VistaCMS — Administrative area. All metrics are live.</span>
            </div>
        </div>
    </main>

    <script>
        (function() {
            // display current date in the chip
            const dateSpan = document.getElementById('currentDate');
            if (dateSpan) {
                const today = new Date();
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                dateSpan.textContent = today.toLocaleDateString('en-US', options);
            }

            // subtle interactivity (optional for demo)
            const profile = document.querySelector('.admin-profile');
            if (profile) {
                profile.addEventListener('click', () => console.log('👤 profile menu'));
            }
            const notification = document.querySelector('.notification-badge');
            if (notification) {
                notification.addEventListener('click', () => console.log('🔔 notifications'));
            }

            // simulate keyboard shortcut (Ctrl+D) as a small easter egg
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    alert('🔍 Dashboard search shortcut (simulated)');
                }
            });
        })();
    </script>
</body>
</html>