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
        background: #e0e5ec;
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

    /* main content - FULL WIDTH */
    .dashboard {
        flex: 1;
        margin-left: 280px;
        width: calc(100% - 280px);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: #e0e5ec;
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

    /* content wrapper - FULL WIDTH with proper padding */
    .content-wrapper {
        padding: 32px 40px;
        flex: 1;
        width: 100%;
    }

    /* Dashboard Inner Container - Centered with max-width for readability */
    .dashboard-container {
        max-width: 1600px;
        margin: 0 auto;
        width: 100%;
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

    /* Content Area - Full width */
    .content-area {
        width: 100%;
    }

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
        gap: 24px;
        margin-bottom: 35px;
    }

    .card {
        background: rgba(255, 255, 255, 0.45);
        backdrop-filter: blur(10px);
        padding: 28px 20px;
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
    .charts-section {
        margin-top: 35px;
    }

    .charts-grid {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 30px;
    }

    .chart-wrapper {
        background: transparent;
        padding: 20px;
    }

    .chart-container {
        position: relative;
        height: 340px;
        width: 100%;
    }

    .chart-title {
        font-size: 16px;
        text-align: center;
        margin-bottom: 20px;
        letter-spacing: 0.5px;
        font-weight: 600;
        color: #2c2e3a;
    }

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
    @media (max-width: 1200px) {
        .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
    }

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
        .charts-grid {
            grid-template-columns: 1fr;
            gap: 40px;
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

        <div class="content-area">
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

            <!-- Charts Section -->
            <section class="charts-section">
                <div class="charts-grid">
                    <div class="chart-wrapper">
                        <div class="chart-title">WORKFORCE COMPOSITION</div>
                        <div class="chart-container">
                            <canvas id="pieChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-wrapper">
                        <div class="chart-title">HEADCOUNT METRICS</div>
                        <div class="chart-container">
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="footer-note">
            <span>© 2025 Billora — Admin Dashboard. All metrics are real-time.</span>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

    // Chart.js Initialization
    const dataLabels = ['Entry', 'Junior', 'Mid-Weight', 'Senior', 'Director'];
    const dataValues = [12, 25, 38, 18, 7];
    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#fb7185', '#fbbf24'];

    // Donut Chart
    new Chart(document.getElementById('pieChart'), {
        type: 'doughnut',
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderWidth: 0,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: '#5a5e73', padding: 20, font: { size: 11, weight: '500' } }
                }
            }
        }
    });

    // Bar Chart
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: dataLabels,
            datasets: [{
                data: dataValues,
                backgroundColor: colors,
                borderRadius: 8,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { 
                    grid: { color: '#d1d9e6' }, 
                    ticks: { color: '#5a5e73', stepSize: 10 } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { color: '#5a5e73', font: { size: 11, weight: '500' } } 
                }
            }
        }
    });
</script>

<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

@endsection