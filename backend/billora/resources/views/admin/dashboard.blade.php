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

    /* ========== NEW GLASS + NEUMORPHISM DESIGN (ONLY INSIDE CONTENT) ========== */
    
    /* Override body background just for content area feel */
    .content-wrapper {
        background: #e0e5ec;
    }
    
    .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    /* Header Area */
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .welcome h1 {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -1px;
        margin: 0;
        color: #2c2e3a;
    }

    .welcome h1 span { color: #7c83ff; }
    .welcome p { color: #5a5e73; margin-top: 5px; font-weight: 500; }

    .date-chip {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(8px);
        padding: 12px 24px;
        border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
        font-weight: 600;
        font-size: 0.9rem;
    }

    /* Main Layout Grid */
    .main-layout {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 35px;
    }

    /* Sidebar Summary */
    .sidebar-summary {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: 40px;
        padding: 35px;
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
        height: fit-content;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 30px;
        padding: 15px;
        border-radius: 25px;
        transition: 0.3s;
        cursor: pointer;
    }

    .stat-item:hover { box-shadow: inset -3px -3px 7px rgba(255, 255, 255, 0.7), inset 3px 3px 7px rgba(163, 177, 198, 0.3); }

    .icon-circle {
        width: 54px;
        height: 54px;
        background: #e0e5ec;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
        color: #7c83ff;
        font-size: 1.2rem;
    }

    .stat-info h2 { font-size: 1.6rem; font-weight: 700; margin: 0; }
    .stat-info p { font-size: 0.85rem; color: #5a5e73; font-weight: 600; margin: 0; }

    /* Content Area */
    .nav-actions {
        display: flex;
        gap: 15px;
        margin-bottom: 30px;
        flex-wrap: wrap;
    }

    .btn {
        background: #e0e5ec;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        color: #2c2e3a;
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
        cursor: pointer;
        transition: 0.2s;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .btn:active { box-shadow: inset -3px -3px 7px rgba(255, 255, 255, 0.7), inset 3px 3px 7px rgba(163, 177, 198, 0.3); transform: scale(0.98); }
    .btn i { color: #7c83ff; }

    /* Metrics Cards */
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin-bottom: 35px;
    }

    .card {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(10px);
        padding: 25px;
        border-radius: 30px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
        text-align: center;
        transition: all 0.2s;
    }

    .card:hover { transform: translateY(-3px); }

    .card .label {
        font-size: 0.7rem;
        font-weight: 800;
        color: #5a5e73;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .card h2 { font-size: 2rem; margin: 10px 0; font-weight: 700; }
    
    .trend {
        font-size: 0.8rem;
        font-weight: 700;
        padding: 4px 12px;
        background: rgba(255,255,255,0.3);
        border-radius: 20px;
    }

    /* Chart Section */
    .chart-box {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(15px);
        border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        padding: 40px;
        box-shadow: -9px -9px 16px rgba(255, 255, 255, 0.8), 9px 9px 16px rgba(163, 177, 198, 0.5);
    }

    .chart-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        flex-wrap: wrap;
        gap: 15px;
    }

    .chart-header h3 { font-size: 1.3rem; font-weight: 700; display: flex; align-items: center; gap: 8px; margin: 0; }
    .chart-header h3 i { color: #7c83ff; }

    .chart-visual {
        height: 250px;
        width: 100%;
        border-radius: 20px;
        box-shadow: inset -3px -3px 7px rgba(255, 255, 255, 0.7), inset 3px 3px 7px rgba(163, 177, 198, 0.3);
        padding: 20px;
        position: relative;
    }

    .chart-svg { width: 100%; height: 100%; }

    /* footer */
    .footer-note {
        margin-top: 48px;
        text-align: center;
        font-size: 13px;
        color: #5a5e73;
        border-top: 1px solid rgba(255,255,255,0.3);
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
        .main-layout {
            grid-template-columns: 1fr;
        }
        .sidebar-summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 24px;
        }
        .stat-item {
            margin-bottom: 0;
        }
        .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .top-nav {
            padding: 12px 20px;
        }
        .content-wrapper {
            padding: 20px;
        }
        .admin-details {
            display: none;
        }
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        .sidebar-summary {
            grid-template-columns: 1fr;
        }
        .nav-actions {
            flex-direction: column;
        }
        .btn {
            justify-content: center;
        }
        .header {
            flex-direction: column;
            text-align: center;
        }
        .chart-header {
            flex-direction: column;
            align-items: flex-start;
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
    <div class="dashboard-container">
        <header class="header">
            <div class="welcome">
                <h1>Hi, <span>Lakshman</span></h1>
                <p>Your performance metrics are looking healthy today.</p>
            </div>
            <div class="date-chip" id="currentDateDisplay">
                <i class="far fa-calendar-alt"></i> &nbsp; 
            </div>
        </header>

        <div class="main-layout">
            <aside class="sidebar-summary">
                <div class="stat-item">
                    <div class="icon-circle"><i class="fas fa-users"></i></div>
                    <div class="stat-info">
                        <h2>2,418</h2>
                        <p>Customers</p>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="icon-circle"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-info">
                        <h2>284</h2>
                        <p>New Orders</p>
                    </div>
                </div>
                <div class="stat-item">
                    <div class="icon-circle"><i class="fas fa-bell"></i></div>
                    <div class="stat-info">
                        <h2>12</h2>
                        <p>Alerts</p>
                    </div>
                </div>
            </aside>

            <main class="content">
                <nav class="nav-actions">
                    <button class="btn"><i class="fas fa-plus"></i> New Order</button>
                    <button class="btn"><i class="fas fa-box"></i> Products</button>
                    <button class="btn"><i class="fas fa-file-alt"></i> Reports</button>
                    <button class="btn"><i class="fas fa-cog"></i> Settings</button>
                </nav>

                <section class="metrics-grid">
                    <div class="card">
                        <span class="label">System Health</span>
                        <h2>98.6%</h2>
                        <span class="trend" style="color: #10b981;">+2.1% ↑</span>
                    </div>
                    <div class="card">
                        <span class="label">Storage</span>
                        <h2>64%</h2>
                        <span class="trend">128 / 200 GB</span>
                    </div>
                    <div class="card">
                        <span class="label">Tasks</span>
                        <h2>14</h2>
                        <span class="trend" style="color: #7c83ff;">Attention</span>
                    </div>
                    <div class="card">
                        <span class="label">Reports</span>
                        <h2>09</h2>
                        <span class="trend" style="color: #ef4444;">Pending</span>
                    </div>
                </section>

                <section class="chart-box">
                    <div class="chart-header">
                        <h3><i class="fas fa-chart-line"></i> &nbsp; Revenue Trend</h3>
                        <span class="trend" style="color: #7c83ff;">Weekly Analysis</span>
                    </div>
                    <div class="chart-visual">
                        <svg class="chart-svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <path d="M0,180 Q150,150 300,160 T600,80 T1000,40" 
                                  fill="none" 
                                  stroke="#7c83ff" 
                                  stroke-width="4" 
                                  stroke-linecap="round"/>
                            <circle cx="0" cy="180" r="5" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="150" cy="150" r="5" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="300" cy="160" r="6" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="450" cy="120" r="5" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="600" cy="80" r="6" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="750" cy="55" r="5" fill="white" stroke="#7c83ff" stroke-width="3"/>
                            <circle cx="1000" cy="40" r="6" fill="white" stroke="#7c83ff" stroke-width="3"/>
                        </svg>
                    </div>
                </section>
            </main>
        </div>

        <div class="footer-note">
            <span>© 2025 Billora — Admin Dashboard. All metrics are real-time.</span>
        </div>
    </div>
</div>

<script>
    (function() {
        // display current date
        const dateSpan = document.getElementById('currentDateDisplay');
        if (dateSpan) {
            const today = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> &nbsp; ${today.toLocaleDateString('en-US', options)}`;
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
        const actionBtns = document.querySelectorAll('.btn');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const actions = ['New Order', 'Products', 'Reports', 'Settings'];
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

<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

@endsection