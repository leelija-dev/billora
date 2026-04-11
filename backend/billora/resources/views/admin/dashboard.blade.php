@extends('admin.main-layout')
@section('title','Dashboard')
@section('content')
    
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
        background: #f8fafc;
        display: flex;
        min-height: 100vh;
    }

    /* ===== SIDEBAR MODERN ===== */
    .sidebar {
        width: 280px;
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
        color: #e2e8f0;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 100;
    }

    .sidebar-header {
        padding: 28px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .logo-area {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .logo-icon {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
    }

    .logo-icon svg {
        width: 24px;
        height: 24px;
        fill: white;
    }

    .logo-text {
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.5px;
        background: linear-gradient(135deg, #fff, #94a3b8);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
    }

    .logo-text span {
        color: #3b82f6;
        background: none;
        -webkit-background-clip: unset;
        background-clip: unset;
    }

    .sidebar-nav {
        flex: 1;
        padding: 24px 16px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 18px;
        border-radius: 12px;
        color: #94a3b8;
        transition: all 0.2s;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
    }

    .nav-item svg {
        width: 20px;
        height: 20px;
        stroke: #64748b;
        stroke-width: 1.5;
        fill: none;
    }

    .nav-item:hover {
        background: rgba(59, 130, 246, 0.1);
        color: #f1f5f9;
    }

    .nav-item:hover svg {
        stroke: #3b82f6;
    }

    .nav-item.active {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .nav-item.active svg {
        stroke: white;
    }

    .nav-divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.06);
        margin: 16px 0;
    }

    /* main content */
    .dashboard {
        flex: 1;
        margin-left: auto;
        width: calc(100% - 280px);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    /* top navigation */
    .top-nav {
        background: white;
        padding: 16px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        border-bottom: 1px solid #e2e8f0;
        position: sticky;
        top: 0;
        z-index: 50;
        backdrop-filter: blur(10px);
    }

    .page-title {
        font-weight: 700;
        font-size: 20px;
        color: #0f172a;
        letter-spacing: -0.3px;
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: 24px;
    }

    .notification-badge {
        position: relative;
        cursor: pointer;
        padding: 8px;
        border-radius: 10px;
        transition: background 0.2s;
    }

    .notification-badge:hover {
        background: #f1f5f9;
    }

    .notification-badge svg {
        width: 22px;
        height: 22px;
        stroke: #475569;
        stroke-width: 1.5;
        fill: none;
    }

    .badge {
        position: absolute;
        top: 2px;
        right: 2px;
        background: #ef4444;
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 20px;
        min-width: 18px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
    }

    .admin-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 12px 6px 6px;
        border-radius: 40px;
        background: #f8fafc;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid #e2e8f0;
    }

    .admin-profile:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
    }

    .avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 16px;
    }

    .admin-details {
        line-height: 1.4;
    }

    .admin-name {
        font-weight: 700;
        font-size: 14px;
        color: #0f172a;
    }

    .admin-email {
        font-size: 11px;
        color: #64748b;
    }

    .dropdown-icon svg {
        width: 16px;
        height: 16px;
        stroke: #64748b;
    }

    /* content wrapper */
    .content-wrapper {
        padding: 32px;
        flex: 1;
    }

    /* welcome card - modern redesign */
    .welcome-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 32px;
        padding: 40px 48px;
        box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
        border: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 40px;
        justify-content: space-between;
        margin-bottom: 32px;
    }

    .welcome-left h1 {
        font-size: 36px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -1px;
        line-height: 1.2;
        margin-bottom: 16px;
    }

    .welcome-left h1 span {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        font-size: 36px;
    }

    .greeting-text {
        font-size: 16px;
        color: #475569;
        max-width: 500px;
        margin-bottom: 28px;
        line-height: 1.6;
    }

    .date-chip {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        background: #f1f5f9;
        border-radius: 50px;
        padding: 10px 20px;
        font-weight: 500;
        color: #334155;
        font-size: 14px;
    }

    .date-chip svg {
        width: 18px;
        height: 18px;
        stroke: #3b82f6;
        stroke-width: 1.5;
        fill: none;
    }

    .date-chip .date {
        font-weight: 700;
        color: #1d4ed8;
    }

    .welcome-right {
        background: linear-gradient(135deg, #eff6ff, #dbeafe);
        border-radius: 28px;
        padding: 28px 32px;
        min-width: 260px;
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
        width: 56px;
        height: 56px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    }

    .stat-icon svg {
        width: 28px;
        height: 28px;
        stroke: #3b82f6;
        stroke-width: 1.5;
        fill: none;
    }

    .stat-numbers h3 {
        font-size: 28px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.2;
    }

    .stat-numbers p {
        color: #475569;
        font-size: 13px;
        font-weight: 500;
    }

    /* quick actions */
    .action-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 32px;
    }

    .action-btn {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 14px 28px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        color: #1e293b;
        transition: all 0.2s;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }

    .action-btn svg {
        width: 20px;
        height: 20px;
        stroke: #3b82f6;
        stroke-width: 1.5;
        fill: none;
    }

    .action-btn:hover {
        border-color: #3b82f6;
        background: #f0f9ff;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px -10px rgba(59, 130, 246, 0.3);
    }

    /* stats grid */
    .insight-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
    }

    .insight-card {
        background: white;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        border: 1px solid #e2e8f0;
        transition: all 0.2s;
    }

    .insight-card:hover {
        border-color: #cbd5e1;
        box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .card-title {
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .card-title svg {
        width: 18px;
        height: 18px;
        stroke: #3b82f6;
    }

    .card-value {
        font-size: 36px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -1px;
        margin-bottom: 8px;
    }

    .card-footer {
        color: #10b981;
        font-size: 13px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 6px;
        border-top: 1px solid #e2e8f0;
        padding-top: 16px;
        margin-top: 8px;
    }

    .trend-down {
        color: #ef4444;
    }

    /* footer */
    .footer-note {
        margin-top: 48px;
        text-align: center;
        font-size: 13px;
        color: #94a3b8;
        border-top: 1px solid #e2e8f0;
        padding-top: 24px;
    }

    /* animations */
    .fade-in-up {
        animation: fadeInUp 0.5s ease forwards;
    }
    
    @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    /* pulse animation for notifications */
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .badge {
        animation: pulse 2s infinite;
    }

    /* responsive */
    @media (max-width: 1024px) {
        .sidebar {
            width: 80px;
        }
        .sidebar .logo-text, 
        .sidebar .nav-item span:not(.active) {
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
            margin-left: 80px;
            width: calc(100% - 80px);
        }
        .welcome-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px;
        }
        .welcome-left h1 {
            font-size: 28px;
        }
    }

    @media (max-width: 768px) {
        .top-nav {
            padding: 12px 20px;
        }
        .content-wrapper {
            padding: 20px;
        }
        .welcome-card {
            padding: 24px;
        }
        .admin-details {
            display: none;
        }
        .insight-grid {
            grid-template-columns: 1fr;
        }
        .action-row {
            flex-direction: column;
        }
        .action-btn {
            justify-content: center;
        }
    }

    /* scrollbar styling */
    ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f5f9;
    }
    
    ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
</style>

<div class="content-wrapper fade-in-up">
    <!-- welcome card -->
    <div class="welcome-card">
        <div class="welcome-left">
            <h1>Welcome back, <span>Lakshman</span></h1>
            <p class="greeting-text">Your admin dashboard is ready. Monitor all key metrics and manage your business efficiently.</p>
            <div class="date-chip">
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                </svg>
                <span>Today is <span class="date" id="currentDate"></span></span>
            </div>
        </div>
        <div class="welcome-right">
            <div class="stat-summary">
                <div class="stat-summary-item">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <div class="stat-numbers">
                        <h3>2,418</h3>
                        <p>Active Customers</p>
                    </div>
                </div>
                <div class="stat-summary-item">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-1.8 0-3.4-.9-4.3-2.3.7-1.2 2.1-2.1 4.3-2.1s3.6.9 4.3 2.1c-.9 1.4-2.5 2.3-4.3 2.3z"/>
                        </svg>
                    </div>
                    <div class="stat-numbers">
                        <h3>284</h3>
                        <p>New Orders</p>
                    </div>
                </div>
                <div class="stat-summary-item">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                    </div>
                    <div class="stat-numbers">
                        <h3>12</h3>
                        <p>Pending Alerts</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- quick action buttons -->
    <div class="action-row">
        <div class="action-btn">
            <svg viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Create New Order
        </div>
        <div class="action-btn">
            <svg viewBox="0 0 24 24">
                <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4zm6 0h4v4h-4v-4z"/>
            </svg>
            Manage Products
        </div>
        <div class="action-btn">
            <svg viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            View Reports
        </div>
        <div class="action-btn">
            <svg viewBox="0 0 24 24">
                <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
            Settings
        </div>
    </div>

    <!-- insight cards -->
    <div class="insight-grid">
        <div class="insight-card">
            <div class="card-title">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                System Health
            </div>
            <div class="card-value">98.6%</div>
            <div class="card-footer">↑ 2.1% vs last week</div>
        </div>
        <div class="insight-card">
            <div class="card-title">
                <svg viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Storage Usage
            </div>
            <div class="card-value">64%</div>
            <div class="card-footer">128/200 GB used</div>
        </div>
        <div class="insight-card">
            <div class="card-title">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
                Pending Tasks
            </div>
            <div class="card-value">14</div>
            <div class="card-footer">3 require attention</div>
        </div>
        <div class="insight-card">
            <div class="card-title">
                <svg viewBox="0 0 24 24">
                    <path d="M21 6h-2v3h-2V6h-2V4h2V2h2v2h2v2zm-6-4v2h-2V2h2zm0 8h-2v2h2v-2zm-2-2h2V6h-2v2zm0 8h2v-2h-2v2zM7 6h4v2H7V6zm0 10h4v2H7v-2zm0-4h4v2H7v-2zm-4 8h.01L5 20h14v2H3v-2zM3 4h4v2H3V4z"/>
                </svg>
                Reports Ready
            </div>
            <div class="card-value">9</div>
            <div class="card-footer trend-down">2 pending review</div>
        </div>
    </div>

    <!-- footer -->
    <div class="footer-note">
        <span>© 2025 Billora — Admin Dashboard. All metrics are real-time.</span>
    </div>
</div>

<script>
    (function() {
        // display current date
        const dateSpan = document.getElementById('currentDate');
        if (dateSpan) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateSpan.textContent = today.toLocaleDateString('en-US', options);
        }

        // profile click
        const profile = document.querySelector('.admin-profile');
        if (profile) {
            profile.addEventListener('click', () => console.log('👤 Profile menu clicked'));
        }
        
        // notification click
        const notification = document.querySelector('.notification-badge');
        if (notification) {
            notification.addEventListener('click', () => console.log('🔔 Notifications clicked'));
        }

        // action buttons click handlers
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const actions = ['Create Order', 'Manage Products', 'View Reports', 'Settings'];
                console.log(`📋 ${actions[index]} clicked`);
            });
        });

        // keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                alert('🔍 Dashboard quick search');
            }
        });
    })();
</script>
@endsection