@extends('admin.main-layout')
@section('title', 'Dashboard')
@section('content')

    <style>
        :root {
            --bg-primary: #eef2f5;
            --bg-secondary: #f5f7fb;
            --glass-bg: rgba(255, 255, 255, 0.42);
            --glass-bg-strong: rgba(255, 255, 255, 0.58);
            --glass-border: rgba(255, 255, 255, 0.7);
            --glass-border-light: rgba(255, 255, 255, 0.4);
            --nm-shadow-sm: 5px 5px 12px rgba(166, 180, 200, 0.4), -5px -5px 12px rgba(255, 255, 255, 0.8);
            --nm-shadow-md: 8px 8px 20px rgba(166, 180, 200, 0.35), -8px -8px 20px rgba(255, 255, 255, 0.85);
            --nm-shadow-lg: 12px 12px 28px rgba(166, 180, 200, 0.3), -12px -12px 28px rgba(255, 255, 255, 0.9);
            --nm-shadow-xl: 18px 18px 36px rgba(166, 180, 200, 0.25), -18px -18px 36px rgba(255, 255, 255, 0.95);
            --nm-inset-sm: inset 3px 3px 8px rgba(166, 180, 200, 0.3), inset -3px -3px 8px rgba(255, 255, 255, 0.7);
            --glass-blur: blur(12px);
            --glass-blur-strong: blur(16px);
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-sidebar: linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%);
            --accent-blue: #4f46e5;
            --accent-blue-light: #818cf8;
            --accent-indigo: #6366f1;
            --accent-purple: #a855f7;
            --accent-success: #10b981;
            --accent-warning: #f59e0b;
            --accent-danger: #ef4444;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', sans-serif;
        }

        body {
            background: var(--bg-primary);
            display: flex;
            min-height: 100vh;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: -50%;
            right: -20%;
            width: 80%;
            height: 80%;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        body::after {
            content: '';
            position: fixed;
            bottom: -30%;
            left: -10%;
            width: 60%;
            height: 60%;
            background: radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background: var(--gradient-sidebar);
            backdrop-filter: var(--glass-blur);
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            box-shadow: var(--nm-shadow-xl);
            z-index: 100;
            border-right: 1px solid rgba(255, 255, 255, 0.08);
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
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
            width: 42px;
            height: 42px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
        }

        .logo-icon svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        .logo-text {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #fff, #94a3b8);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
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
            border-radius: 14px;
            color: #94a3b8;
            transition: all 0.3s;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
        }

        .nav-item:hover {
            background: rgba(79, 70, 229, 0.2);
            color: white;
            transform: translateX(4px);
        }

        .nav-item.active {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
            color: white;
            box-shadow: 0 6px 14px rgba(79, 70, 229, 0.35);
        }

        /* Main Content */
        .dashboard {
            flex: 1;
            margin-left: auto;
            width: calc(100% - 280px);
            min-height: 100vh;
            background: var(--bg-primary);
            position: relative;
            z-index: 1;
        }

        /* Top Navigation - Glass Floating */
        .top-nav {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur-strong);
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: var(--nm-shadow-sm);
            border-bottom: 1px solid var(--glass-border);
            position: sticky;
            top: 0;
            z-index: 50;
            margin: 16px 24px 0 24px;
            border-radius: 24px;
            width: calc(100% - 48px);
        }

        .page-title {
            font-weight: 700;
            font-size: 20px;
            background: linear-gradient(135deg, var(--text-primary), var(--accent-blue));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
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
            border-radius: 12px;
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
        }

        .badge {
            position: absolute;
            top: -2px;
            right: -2px;
            background: linear-gradient(135deg, var(--accent-danger), #dc2626);
            color: white;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 20px;
            animation: pulse 2s infinite;
        }

        .admin-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 6px 12px 6px 6px;
            border-radius: 50px;
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
            cursor: pointer;
            border: 1px solid var(--glass-border);
        }

        .avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 16px;
        }

        /* Content Wrapper */
        .content-wrapper {
            padding: 32px 40px;
            flex: 1;
            background: transparent;
        }

        .dashboard-container {
            max-width: 1600px;
            margin: 0 auto;
            width: 100%;
        }

        /* Header with Welcome - User Profile Card in right corner */
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 20px;
        }

        .welcome h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, var(--text-primary), var(--accent-blue));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .welcome h1 span {
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .welcome p {
            color: var(--text-secondary);
            margin-top: 4px;
            font-size: 14px;
        }

        /* User Profile Card - In Header Right Corner */
        .header-user-card {
            background: var(--glass-bg-strong);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            padding: 12px 20px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--nm-shadow-md);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .header-user-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--nm-shadow-lg);
            background: var(--glass-bg-strong);
        }

        .header-avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 20px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .header-user-info {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-primary);
            /* text-transform: uppercase; */
        }

        .header-user-info div {
            margin: 3px 0;
        }

        .header-user-info .user-email {
            color: var(--text-secondary);
            font-weight: 500;
            text-transform: lowercase;
            font-size: 10px;
        }

        .header-user-info .last-login {
            color: var(--accent-blue-light);
            font-size: 10px;
        }

        /* Stats Grid - 3 Cards IN ROW on all devices */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-bottom: 50px;
        }

        /* Stat Cards */
        .stat-card {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            padding: 20px;
            border-radius: 24px;
            box-shadow: var(--nm-shadow-md);
            transition: all 0.4s;
            border: 1px solid var(--glass-border);
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
        }

        .stat-card:hover::before {
            left: 100%;
        }

        .stat-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--nm-shadow-xl);
            background: var(--glass-bg-strong);
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .stat-title {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-icon {
            width: 42px;
            height: 42px;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(129, 140, 248, 0.1));
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .stat-number {
            font-size: 28px;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: 4px;
        }

        .stat-sub {
            font-size: 12px;
            color: var(--text-secondary);
        }

        /* Charts - Glass */
        .charts-container {
            display: grid;
            grid-template-columns: 1.8fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }

        .chart-box {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            padding: 25px;
            border-radius: 28px;
            box-shadow: var(--nm-shadow-md);
            transition: all 0.4s;
            border: 1px solid var(--glass-border);
        }

        .chart-box:hover {
            transform: translateY(-5px);
            box-shadow: var(--nm-shadow-xl);
            background: var(--glass-bg-strong);
        }

        .chart-title {
            text-align: center;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            color: var(--text-secondary);
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .chart-canvas-wrapper {
            height: 320px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #donutChart {
            max-width: 280px !important;
            max-height: 300px !important;
            margin: 0 auto;
            display: block;
        }

        .chart-header-with-filter {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .chart-filter-controls {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .filter-pill {
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
            border: 1px solid var(--glass-border);
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-secondary);
            box-shadow: var(--nm-shadow-sm);
            cursor: pointer;
            transition: all 0.2s;
        }

        .filter-pill:hover {
            transform: translateY(-2px);
            box-shadow: var(--nm-shadow-md);
            color: var(--accent-blue);
        }

        .filter-pill.active {
            box-shadow: var(--nm-inset-sm);
            color: var(--accent-blue);
            background: var(--glass-bg-strong);
        }

        .filter-pill.custom-date {
            /* background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo)); */
            color: white;
            border-color: transparent;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }

        .modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-container {
            background: var(--glass-bg-strong);
            backdrop-filter: blur(16px);
            border-radius: 28px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--nm-shadow-xl);
            width: 450px;
            max-width: 90%;
            padding: 28px;
            transform: scale(0.9);
            transition: transform 0.3s;
        }

        .modal-overlay.active .modal-container {
            transform: scale(1);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--glass-border-light);
        }

        .modal-header h3 {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .modal-close:hover {
            color: var(--accent-danger);
            transform: scale(1.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
        }

        .form-group input {
            width: 100%;
            padding: 12px 16px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 16px;
            font-size: 14px;
            color: var(--text-primary);
            outline: none;
        }

        .form-group input:focus {
            border-color: var(--accent-blue);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .modal-search-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .modal-search-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--nm-shadow-md);
        }

        /* Custom Legend */
        .custom-donut-legend {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid var(--glass-border-light);
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 500;
            color: var(--text-secondary);
        }

        .legend-color {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        /* Info Cards - Glass */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin-bottom: 40px;
        }

        .info-card {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border-radius: 28px;
            padding: 20px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--nm-shadow-md);
            transition: all 0.4s;
        }

        .info-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--nm-shadow-xl);
            background: var(--glass-bg-strong);
        }

        .card-header-custom {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .card-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(129, 140, 248, 0.1));
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        .card-header-custom span:last-child {
            font-weight: 700;
            font-size: 14px;
            color: var(--text-primary);
        }

        .item-list {
            /* display: flex; */
            flex-direction: column;
            gap: 12px;
            max-height: 280px;
            overflow-y: auto;
        }

        .list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--glass-border-light);
        }

        .list-item:last-child {
            border-bottom: none;
        }

        .item-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .item-detail {
            font-size: 10px;
            color: var(--text-secondary);
            margin-top: 2px;
        }

        .item-status {
            font-size: 10px;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 600;
        }

        .status-active {
            background: rgba(16, 185, 129, 0.15);
            color: var(--accent-success);
        }

        .status-inactive {
            background: rgba(245, 158, 11, 0.15);
            color: var(--accent-warning);
        }

        .status-pending {
            background: rgba(245, 158, 11, 0.15);
            color: var(--accent-warning);
        }

        .status-premium {
            background: rgba(79, 70, 229, 0.15);
            color: var(--accent-blue);
        }

        .status-completed {
            background: rgba(16, 185, 129, 0.15);
            color: var(--accent-success);
        }

        .status-processing {
            background: rgba(245, 158, 11, 0.15);
            color: var(--accent-warning);
        }

        .see-all-btn {
            width: 100%;
            margin-top: 16px;
            padding: 10px;
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
            border: 1px solid var(--glass-border);
            border-radius: 40px;
            font-size: 12px;
            font-weight: 600;
            color: var(--accent-blue);
            cursor: pointer;
            transition: all 0.3s;
        }

        .see-all-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--nm-shadow-md);
            background: var(--glass-bg-strong);
        }

        .hidden-item {
            display: none;
        }

        .footer-note {
            margin-top: 20px;
            text-align: center;
            font-size: 13px;
            color: var(--text-secondary);
            border-top: 1px solid var(--glass-border-light);
            padding-top: 24px;
        }

        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.1);
            }
        }

        .chart-canvas-wrapper canvas {
            animation: fadeInUp 0.5s ease-out;
        }

        #barChart {
            transition: all 0.3s ease;
        }

        .fade-in-up {
            animation: fadeInUp 0.5s ease forwards;
        }

        /* ========== COMPREHENSIVE RESPONSIVE BREAKPOINTS ========== */

        /* Critical: 320px - Smallest common width (Old iPhones, very small devices) */
        @media (max-width: 340px) {
            .content-wrapper {
                padding: 10px 12px;
            }

            .welcome h1 {
                font-size: 18px;
            }

            .welcome p {
                font-size: 10px;
            }

            .stats-grid {
                gap: 6px;
            }

            .stat-card {
                padding: 8px 4px;
            }

            .stat-number {
                font-size: 14px;
            }

            .stat-title {
                font-size: 8px;
            }

            .stat-icon {
                width: 22px;
                height: 22px;
                font-size: 10px;
            }

            .stat-sub {
                font-size: 7px;
            }

            .header-avatar {
                width: 32px;
                height: 32px;
                font-size: 14px;
            }

            .header-user-info {
                font-size: 8px;
            }

            .filter-pill {
                font-size: 8px;
                padding: 4px 8px;
            }

            .chart-title {
                font-size: 10px;
            }

            .legend-item {
                font-size: 7px;
            }

            .card-header-custom span:last-child {
                font-size: 11px;
            }

            .card-icon {
                width: 28px;
                height: 28px;
                font-size: 12px;
            }

            .item-name {
                font-size: 10px;
            }

            .item-status {
                font-size: 8px;
                padding: 2px 6px;
            }

            .see-all-btn {
                font-size: 9px;
                padding: 6px;
            }
        }

        /* Width: 341-360px - Budget Android devices, S20, S21, Flip5 */
        @media (min-width: 341px) and (max-width: 360px) {
            .content-wrapper {
                padding: 12px 14px;
            }

            .welcome h1 {
                font-size: 20px;
            }

            .stats-grid {
                gap: 8px;
            }

            .stat-card {
                padding: 10px 6px;
            }

            .stat-number {
                font-size: 16px;
            }

            .stat-title {
                font-size: 9px;
            }

            .stat-icon {
                width: 26px;
                height: 26px;
                font-size: 12px;
            }

            .stat-sub {
                font-size: 8px;
            }
        }

        /* Width: 361-375px - iPhone SE, iPhone 8, iPhone X */
        @media (min-width: 361px) and (max-width: 375px) {
            .content-wrapper {
                padding: 14px 16px;
            }

            .welcome h1 {
                font-size: 22px;
            }

            .stats-grid {
                gap: 10px;
            }

            .stat-card {
                padding: 12px 8px;
            }

            .stat-number {
                font-size: 18px;
            }

            .stat-title {
                font-size: 10px;
            }

            .stat-icon {
                width: 30px;
                height: 30px;
                font-size: 14px;
            }

            .stat-sub {
                font-size: 9px;
            }
        }

        /* Width: 376-390px - iPhone 13, iPhone 14, Pixel 5 */
        @media (min-width: 376px) and (max-width: 390px) {
            .stats-grid {
                gap: 12px;
            }

            .stat-card {
                padding: 14px 10px;
            }

            .stat-number {
                font-size: 20px;
            }

            .stat-title {
                font-size: 11px;
            }

            .stat-icon {
                width: 32px;
                height: 32px;
                font-size: 16px;
            }
        }

        /* Width: 391-410px - Pixel 7, Pixel 8, S24 */
        @media (min-width: 391px) and (max-width: 410px) {
            .stats-grid {
                gap: 14px;
            }

            .stat-card {
                padding: 16px 12px;
            }

            .stat-number {
                font-size: 22px;
            }

            .stat-title {
                font-size: 11px;
            }

            .stat-icon {
                width: 34px;
                height: 34px;
                font-size: 16px;
            }
        }

        /* Width: 411-420px - Pixel 7 Pro, Pixel 8 Pro, S24+ */
        @media (min-width: 411px) and (max-width: 420px) {
            .stats-grid {
                gap: 15px;
            }

            .stat-card {
                padding: 16px 12px;
            }

            .stat-number {
                font-size: 24px;
            }

            .stat-icon {
                width: 36px;
                height: 36px;
                font-size: 18px;
            }
        }

        /* Width: 421-430px - iPhone Pro Max series, S24 Ultra */
        @media (min-width: 421px) and (max-width: 430px) {
            .stats-grid {
                gap: 16px;
            }

            .stat-card {
                padding: 18px 14px;
            }

            .stat-number {
                font-size: 26px;
            }

            .stat-icon {
                width: 38px;
                height: 38px;
                font-size: 18px;
            }
        }

        /* Width: 431-480px - Phablets, Foldables unfolded */
        @media (min-width: 431px) and (max-width: 480px) {
            .stats-grid {
                gap: 18px;
            }

            .stat-card {
                padding: 20px 16px;
            }

            .stat-number {
                font-size: 28px;
            }

            .stat-icon {
                width: 40px;
                height: 40px;
                font-size: 20px;
            }
        }

        /* All mobile devices - keep 3 columns in row */
        @media (max-width: 768px) {
            .dashboard-header {
                flex-direction: column;
                align-items: stretch;
                margin-bottom: 20px;
            }

            .header-user-card {
                width: 100%;
                justify-content: center;
            }

            .stats-grid {
                grid-template-columns: repeat(3, 1fr);
                margin-bottom: 30px;
            }

            .charts-container {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .chart-canvas-wrapper {
                height: 260px;
            }

            #donutChart {
                max-width: 220px !important;
                max-height: 220px !important;
            }

            .chart-header-with-filter {
                flex-direction: column;
                align-items: flex-start;
            }

            .chart-filter-controls {
                width: 100%;
                justify-content: flex-start;
            }

            .info-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .top-nav {
                margin: 12px 16px 0 16px;
                width: calc(100% - 32px);
            }

            .custom-donut-legend {
                gap: 12px;
            }
        }

        /* Landscape orientation for mobile */
        @media (max-width: 896px) and (orientation: landscape) {
            .stats-grid {
                gap: 12px;
            }

            .stat-card {
                padding: 10px 8px;
            }

            .stat-number {
                font-size: 18px;
            }

            .stat-title {
                font-size: 9px;
            }

            .stat-icon {
                width: 28px;
                height: 28px;
                font-size: 14px;
            }

            .chart-canvas-wrapper {
                height: 200px;
            }

            .info-grid {
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
            }

            .info-card {
                padding: 12px;
            }

            .item-list {
                max-height: auto;
            }

            .content-wrapper {
                padding: 12px 16px;
            }
        }

        /* Tablets - Keep 3 columns in row */
        @media (min-width: 769px) and (max-width: 1024px) {
            .content-wrapper {
                padding: 24px 30px;
            }

            .stats-grid {
                gap: 20px;
            }

            .charts-container {
                grid-template-columns: 1fr;
                gap: 25px;
            }

            .info-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            .chart-canvas-wrapper {
                height: 300px;
            }
        }

        /* Foldable devices (Z Fold) */
        @media (min-width: 720px) and (max-width: 960px) {
            .info-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .charts-container {
                grid-template-columns: 1.5fr 1fr;
            }
        }

        /* Desktop */
        @media (min-width: 1025px) {
            .sidebar {
                width: 280px;
            }

            .dashboard {
                margin-left: 280px;
                width: calc(100% - 280px);
            }
        }

        /* Large Desktop */
        @media (min-width: 1920px) {
            .dashboard-container {
                max-width: 1800px;
            }

            .content-wrapper {
                padding: 40px 60px;
            }

            .stats-grid {
                gap: 30px;
            }

            .charts-container {
                gap: 35px;
            }

            .chart-canvas-wrapper {
                height: 380px;
            }

            .info-grid {
                gap: 30px;
            }
        }

        /* Sidebar collapse for tablets */
        @media (max-width: 1024px) {
            .sidebar {
                width: 80px;
            }

            .sidebar .logo-text,
            .sidebar .nav-item span {
                display: none;
            }

            .dashboard {
                margin-left: 80px;
                width: calc(100% - 80px);
            }
        }

        ::-webkit-scrollbar {
            width: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: var(--accent-blue-light);
            border-radius: 10px;
        }

        @media (max-width: 768px) {
            ::-webkit-scrollbar {
                width: 3px;
            }
        }

        /* Modern CSS styling */
        .item-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            max-height: 400px;
            overflow-y: auto;
        }

        .list-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
        }

        .list-item.unread {
            background: linear-gradient(135deg, #eef4ff 0%, #e8f0fe 100%);
            border-left: 3px solid #154eb8;
        }

        .list-item.read {
            background: #ffffff;
            border: 1px solid #e5e7eb;
        }

        .list-item:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Badge styling */
        .item-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            flex-shrink: 0;
        }

        .item-badge-new {
            background: #154eb8;
            color: #ffffff;
            box-shadow: 0 1px 2px rgba(21, 78, 184, 0.2);
        }

        /* Content styling */
        .item-content {
            flex: 1;
            min-width: 0;
        }

        .item-email {
            font-size: 0.875rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.375rem;
            word-break: break-word;
        }

        .item-details {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.813rem;
            color: #6b7280;
        }

        .item-subject {
            font-weight: 500;
        }

        .item-separator {
            color: #d1d5db;
        }

        .item-date {
            font-size: 0.75rem;
        }

        /* Empty state */
        .list-item-empty {
            padding: 2rem;
            text-align: center;
            color: #9ca3af;
            font-size: 0.875rem;
            background: #f9fafb;
            border-radius: 0.5rem;
        }

        /* Responsive design */
        @media (max-width: 640px) {
            .list-item {
                padding: 0.75rem;
            }

            .item-details {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25rem;
            }

            .item-separator {
                display: none;
            }
        }
    </style>

    <div class="content-wrapper fade-in-up">
        <div class="dashboard-container">
            <!-- Header with Welcome + User Profile Card in Right Corner -->
            <div class="dashboard-header">
                <div class="welcome">
                    <h1>Hi, <span>{{ ucfirst($user->username) }}</span></h1>

                </div>

                <!-- User Profile Card - In Header Right Corner -->
                <div class="header-user-card">
                    <div class="header-avatar">{{ ucfirst(substr($user->username, 0, 1)) }}</div>
                    <div class="header-user-info">
                        <div>{{ $user->username ? $user->username : '' }}</div>
                        <div class="user-email">{{ $user->email ? $user->email : '' }}</div>
                        <div class="last-login">Last login:
                            {{ $user->last_login_at ? $user->last_login_at->format('d M Y h:i A') : date('d M Y h:i A') }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Grid - 3 Cards IN ROW on ALL devices -->
            <div class="stats-grid">
                <!-- Card 1: Total Users -->
                <a href="{{ route('admin.customers.index') }}">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Total Users</span>
                            <div class="stat-icon">👥</div>
                        </div>
                        <div class="stat-number">{{ $totalUsers ? $totalUsers->count() : 0 }}</div>
                        <div class="stat-sub">Active: {{ $totalUsers ? $totalUsers->where('is_active', true)->count() : 0 }}
                        </div>
                    </div>
                </a>


                <!-- Card 3: Mail Sent -->
                <a href="{{ route('admin.plans.index') }}">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Total Plan</span>
                            <div class="stat-icon">📧</div>
                        </div>
                        <div class="stat-number">{{ $toalPlan ? $toalPlan->count() : 0 }}</div>
                        <div class="stat-sub">Active Plan: {{ $toalPlan->where('is_active', true)->count() }}</div>
                    </div>
                </a>
                <a href="{{ route('admin.plans.purchase-history') }}">
                    <div class="stat-card">
                        <div class="stat-header">
                            <span class="stat-title">Total Plan Purchase</span>
                            <div class="stat-icon">📦</div>
                        </div>
                        <div class="stat-number">{{ $totalPlanPurchase ? $totalPlanPurchase->count() : 0 }}</div>
                        <div class="stat-sub">Active:
                            {{ $totalPlanPurchase ? $totalPlanPurchase->where('status', 'active')->count() : 0 }}</div>
                    </div>
                </a>
            </div>

            <!-- Charts Section -->
            <div class="charts-container">
                <div class="chart-box">
                    <div class="chart-header-with-filter">
                        <div class="chart-title">HEADCOUNT METRICS</div>
                        <div class="chart-filter-controls">
                            <button class="filter-pill" data-range="today">Today</button>
                            <button class="filter-pill " data-range="month">Last Month</button>
                            <button class="filter-pill " id="customDateBtn">
                                <i class="fa-regular fa-calendar"></i> Custom
                            </button>
                        </div>
                    </div>
                    <div class="chart-canvas-wrapper">
                        <canvas id="barChart"></canvas>
                    </div>
                </div>
                <div class="chart-box">
                    <div class="chart-title">WORKFORCE COMPOSITION</div>
                    <div class="chart-canvas-wrapper">
                        <canvas id="donutChart"></canvas>
                    </div>
                    <div class="custom-donut-legend" id="donutLegend"></div>
                </div>

            </div>

            <!-- Info Cards -->
            <div class="info-grid">
                <div class="info-card">
                    <div class="card-header-custom">
                        <div class="card-icon">👥</div>
                        <span>Recent Users</span>
                    </div>
                    <div class="item-list" id="customersList">
                        @php
                            $count = 0;
                        @endphp
                        @foreach ($totalUsers as $user)
                            <a href="{{ route('admin.customers.plans', $user->id) }}">
                                <div class="list-item">
                                    <div>
                                        <div class="item-name">{{ $user->name ? $user->name : '' }}</div>
                                        <div class="item-detail">{{ $user->email ? $user->email : '' }}</div>
                                    </div>
                                    @if ($user->is_active)
                                        <span class="item-status status-active">Active</span>
                                    @else
                                        <span class="item-status status-inactive">Inactive</span>
                                    @endif
                                </div>
                            </a>
                            @php $count++ @endphp
                            @if ($count == 5)
                                @break
                            @endif
                        @endforeach
                        @if ($count === 0)
                            <div class="list-item-empty">
                                No Users found
                            </div>
                        @endif


                    </div>
                    <a href="{{ route('admin.customers.index') }}"><button class="see-all-btn">See All
                            Customers</button></a>
                </div>
                 <div class="info-card">
                    <div class="card-header-custom">
                        <div class="card-icon">🔄</div>
                        <span>Recent Contacts</span>
                    </div>
                    <div class="item-list" id="ordersList">
                        @php
                            $contactCount = 0;
                            $displayLimit = 5;
                        @endphp

                        @foreach ($contactUs as $contact)
                            @if ($contactCount >= $displayLimit)
                                @break
                            @endif

                            <div class="list-item {{ $contact->view_status == 0 ? 'unread' : 'read' }}">
                                @if ($contact->view_status == 0)
                                    <div class="item-badge item-badge-new">
                                        New
                                    </div>
                                @endif
                                <a href="{{ route('admin.contacts.view', $contact->id) }}">
                                    <div class="item-content">
                                        <div class="item-email">
                                            {{ $contact->email ?: 'No email provided' }}
                                        </div>
                                        <div class="item-details">
                                            <span class="item-subject">
                                                {{ ucfirst(Str::limit($contact->subject, 28)) }}
                                            </span>
                                            <span class="item-separator">•</span>
                                            <span class="item-date">
                                                {{ $contact->created_at->format('d M Y h:i A') }}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            @php $contactCount++ @endphp
                        @endforeach

                        @if ($contactCount === 0)
                            <div class="list-item-empty">
                                No contact found
                            </div>
                        @endif
                    </div>
                    <a href="{{ route('admin.contacts.index') }}"><button class="see-all-btn">See All
                            Contacts</button></a>
                </div>

                <div class="info-card">
                    <div class="card-header-custom">
                        <div class="card-icon">🔄</div>
                        <span>Recent Plan Purchases</span>
                    </div>
                    <div class="item-list" id="ordersList">

                        @php $orderCount = 0; @endphp
                        @foreach ($totalPlanPurchase as $order)
                            <div class="list-item">
                                <div>
                                    <div class="item-name">#{{ $order->id }} - {{ $order?->plan?->name ? $order?->plan?->name :'' }} - ( {{(($order->plan_mode == 'paid') ? 'Paid' : 'Free Trial')}} )</div>
                                    <div class="item-detail">{{ $order->user->email ? $order->user->email : '' }}</div>
                                </div>
                                <span
                                    class="item-status status-completed">{{ $order->payment_status ? ucfirst($order->payment_status) : '' }}</span>
                            </div>
                            @php $orderCount++ @endphp
                            @if ($orderCount == 5)
                                @break
                            @endif
                        @endforeach
                        @if ($orderCount === 0)
                            <div class="list-item-empty">
                                No Orders found
                            </div>
                        @endif

                    </div>
                    <a href="{{ route('admin.plans.purchase-history') }}"><button class="see-all-btn">See All
                            Orders</button></a>
                </div>
                <div class="info-card">
                    <div class="card-header-custom">
                        <div class="card-icon">💳</div>
                        <span>Plans</span>
                    </div>
                    <div class="item-list" id="plansList">
                        @php
                            $planCount = 0;
                        @endphp
                        @foreach ($toalPlan as $plan)
                            <a href="{{ route('admin.plans.edit', $plan->id) }}">
                                <div class="list-item">
                                    <div>
                                        <div class="item-name">{{ $plan->name ? ucfirst($plan->name) : '' }}</div>
                                        <div class="item-detail">{!! $plan->description ? ucfirst(Str::limit($plan->description, 28)) : '' !!}</div>
                                    </div>
                                    @if ($plan->is_active)
                                        <span class="item-status status-active">Active</span>
                                    @else
                                        <span class="item-status status-inactive">Inactive</span>
                                    @endif
                                </div>
                            </a>
                            @php $planCount++ @endphp
                            @if ($planCount == 5)
                                @break
                            @endif
                        @endforeach
                        @if ($planCount === 0)
                            <div class="list-item-empty">
                                No Plans found
                            </div>
                        @endif

                    </div>
                    <a href="{{ route('admin.plans.index') }}"><button class="see-all-btn">See All Plans</button></a>
                </div>
               
            </div>

            <div class="footer-note">
                <span>© 2026 Billora — Super Admin Dashboard. All metrics are not real-time for now.</span>
            </div>
        </div>
    </div>

    <!-- Custom Date Modal -->
    <div id="dateModal" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <h3><i class="fa-regular fa-calendar-range"></i> Custom Date Range</h3>
                <button class="modal-close" id="closeModalBtn">&times;</button>
            </div>
            <div class="form-group">
                <label><i class="fa-regular fa-calendar"></i> Start Date</label>
                <input type="date" id="startDate">
            </div>
            <div class="form-group">
                <label><i class="fa-regular fa-calendar"></i> End Date</label>
                <input type="date" id="endDate">
            </div>
            <button class="modal-search-btn" id="applyDateBtn">
                <i class="fa-solid fa-magnifying-glass"></i> Search
            </button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Toggle functions
        let customersExpanded = false,
            plansExpanded = false,
            ordersExpanded = false;

        function toggleCustomersList() {
            const hiddenItems = document.querySelectorAll('#customersList .hidden-item');
            const btn = document.getElementById('customersBtn');
            if (customersExpanded) {
                hiddenItems.forEach(item => item.style.display = 'none');
                btn.textContent = 'See All Customers';
                customersExpanded = false;
            } else {
                hiddenItems.forEach(item => item.style.display = 'flex');
                btn.textContent = 'Show Less Customers';
                customersExpanded = true;
            }
        }

        function togglePlansList() {
            const hiddenItems = document.querySelectorAll('#plansList .hidden-item');
            const btn = document.getElementById('plansBtn');
            if (plansExpanded) {
                hiddenItems.forEach(item => item.style.display = 'none');
                btn.textContent = 'See All Plans';
                plansExpanded = false;
            } else {
                hiddenItems.forEach(item => item.style.display = 'flex');
                btn.textContent = 'Show Less Plans';
                plansExpanded = true;
            }
        }

        function toggleOrdersList() {
            const hiddenItems = document.querySelectorAll('#ordersList .hidden-item');
            const btn = document.getElementById('ordersBtn');
            if (ordersExpanded) {
                hiddenItems.forEach(item => item.style.display = 'none');
                btn.textContent = 'See All Orders';
                ordersExpanded = false;
            } else {
                hiddenItems.forEach(item => item.style.display = 'flex');
                btn.textContent = 'Show Less Orders';
                ordersExpanded = true;
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('#customersList .hidden-item').forEach(item => item.style.display = 'none');
            document.querySelectorAll('#plansList .hidden-item').forEach(item => item.style.display = 'none');
            document.querySelectorAll('#ordersList .hidden-item').forEach(item => item.style.display = 'none');
        });

        // Modal
        const modal = document.getElementById('dateModal');
        const customDateBtn = document.getElementById('customDateBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const applyDateBtn = document.getElementById('applyDateBtn');

        customDateBtn?.addEventListener('click', () => modal.classList.add('active'));
        closeModalBtn?.addEventListener('click', () => modal.classList.remove('active'));
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
        applyDateBtn?.addEventListener('click', async () => {
    document.querySelectorAll('.filter-pill')
        .forEach(b => b.classList.remove('active'));

    customDateBtn.classList.add('active');

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both dates');
        return;
    }
    
    // REMOVE THIS LINE: "remo" is a typo that's causing an error
    // remo
    
    try {
        const response = await fetch(
            `?type=custom&start_date=${startDate}&end_date=${endDate}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );

        const result = await response.json();

        if (result.status) {
            const newData = result.data;

            // BAR CHART
            barChart.data.datasets[0].data = newData;
            barChart.update();

            // DONUT CHART
            donutChart.data.datasets[0].data = newData;
            donutChart.update();

            // UPDATE LEGEND
            updateDonutLegend(newData);
            
            // Close modal after successful update
            modal.classList.remove('active');
        } else {
            alert(result.message || 'Error fetching data');
        }
        
    } catch (error) {
        console.error('Custom date fetch error:', error);
        alert('Error fetching data. Please try again.');
    }
});

        // Chart Data
        const donutColors = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
        const dataLabels = ['Customers', 'Plan Purchases', 'Contacts'];
        const baseData = [
            {{ $customerCount }},
            {{ $planPurchaseCount }},
            {{ $contactCount }}
        ];
        const total = baseData.reduce((a, b) => a + b, 0);
        // const filterData = {
        //     start: [8, 18, 28, 12, 4],
        //     end: [15, 30, 45, 22, 9],
        //     today: [5, 12, 18, 8, 3],
        //     month: [12, 25, 38, 18, 7]
        // };

        // Donut Chart
        const donutCtx = document.getElementById('donutChart').getContext('2d');
        const donutChart = new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: dataLabels,
                datasets: [{
                    data: baseData,
                    backgroundColor: donutColors,
                    borderWidth: 0,
                    cutout: '75%',
                    hoverOffset: 8,
                    borderRadius: 4,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        callbacks: {
                            label: (ctx) => {

                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);

                                return `${ctx.label}: ${ctx.raw} (${((ctx.raw / total) * 100).toFixed(1)}%)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutCubic',
                    animateRotate: true,
                    animateScale: true
                }
            }
        });

        function updateDonutLegend(chartData = baseData) {
            const legendContainer = document.getElementById('donutLegend');
            if (!legendContainer) return;
            legendContainer.innerHTML = '';
            dataLabels.forEach((label, i) => {
                const val = chartData[i];
                legendContainer.innerHTML +=
                    `<div class="legend-item"><div class="legend-color" style="background: ${donutColors[i]}"></div><span>${label}: ${val} (${((val / chartData.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)</span></div>`;
            });
        }
        updateDonutLegend();

        // Bar Chart
        const barCtx = document.getElementById('barChart').getContext('2d');

        const barGlowPlugin = {
            id: 'barGlowPlugin',
            beforeDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.save();
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'rgba(79, 70, 229, 0.3)';
            },
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                ctx.restore();
            }
        };

        const barGradientColors = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

        let barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: dataLabels,
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const {
                            ctx,
                            chartArea
                        } = chart;
                        if (!chartArea) return barGradientColors[context.dataIndex];
                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea
                            .bottom);
                        gradient.addColorStop(0, barGradientColors[context.dataIndex]);
                        gradient.addColorStop(1, barGradientColors[context.dataIndex] + 'aa');
                        return gradient;
                    },
                    borderRadius: 12,
                    barPercentage: 0.65,
                    categoryPercentage: 0.8,
                    borderWidth: 0,
                    hoverBackgroundColor: barGradientColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1f2937'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 50,
                        grid: {
                            color: '#e2e8f0',
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 10,
                            font: {
                                size: 11
                            },
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#6b7280'
                        }
                    }
                },
                animation: {
                    duration: 1800,
                    easing: 'easeOutCubic',
                    delay: (context) => context.dataIndex * 200
                }
            },
            plugins: [barGlowPlugin],

        });


        setTimeout(() => {
            barChart.data.datasets[0].data = baseData;
            barChart.update();
        }, 300);

        // Filter Controls
        document.querySelectorAll('.filter-pill:not(#customDateBtn)').forEach(btn => {

            btn.addEventListener('click', async function() {

                document.querySelectorAll('.filter-pill')
                    .forEach(b => b.classList.remove('active'));

                this.classList.add('active');

                const range = this.dataset.range;

                try {

                    const response = await fetch(
                        `?type=${range}`, {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }
                    );

                    const result = await response.json();

                    if (result.status) {

                        const newData = result.data;

                        // BAR CHART
                        barChart.data.datasets[0].data = newData;
                        barChart.update();

                        // DONUT CHART
                        donutChart.data.datasets[0].data = newData;
                        donutChart.update();

                        // LINE CHART
                        lineChart.data.labels = result.trend_labels;
                        lineChart.data.datasets[0].data = result.trend_data;
                        lineChart.update();

                        // UPDATE LEGEND
                        updateDonutLegend(newData);

                        modal.classList.remove('active');
                    }

                } catch (error) {

                    console.error('Filter fetch error:', error);
                }
            });
        });
    </script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection
