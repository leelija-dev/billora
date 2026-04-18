@extends('admin.main-layout')
@section('title', 'All Customers')
@section('content')

<<<<<<< HEAD
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
        background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
        min-height: 100vh;
    }

    /* Main Content */
    .main-content {
        padding: 24px 32px;
        width: 100%;
    }

    @media (max-width: 768px) {
        .main-content {
            padding: 16px 20px;
=======
<head>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
            min-height: 100vh;
        }

        /* MAIN CONTENT WIDTH FIX - FULL WIDTH */
        .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
        }
        
        /* Container to maximize width */
        .width-container {
            width: 100%;
            max-width: 100%;
            padding: 0 1.5rem;
        }
        
        /* Modern Card Design - FULL WIDTH */
        .modern-card {
            background: white;
            border-radius: 28px;
            box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02);
            overflow: hidden;
            margin: 20px 0;
            backdrop-filter: blur(0px);
            transition: all 0.3s ease;
            width: 100%;
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
        }
    }

<<<<<<< HEAD
    /* Card */
    .card {
        background: white;
        border-radius: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
        overflow: hidden;
        border: 1px solid #eef2f6;
    }

    /* Header */
    .card-header {
        padding: 24px 28px;
        border-bottom: 1px solid #eef2f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .card-header h1 {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        letter-spacing: -0.3px;
    }

    .card-header p {
        font-size: 13px;
        color: #64748b;
        margin-top: 4px;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        padding: 24px 28px;
        background: #ffffff;
        border-bottom: 1px solid #eef2f6;
    }

    .stat-card {
        background: #f8fafc;
        padding: 20px;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
    }

    .stat-card:hover {
        background: #f1f5f9;
    }

    .stat-info h3 {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .stat-number {
        font-size: 28px;
        font-weight: 800;
        color: #1e293b;
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .stat-icon svg {
        width: 24px;
        height: 24px;
        fill: #2563eb;
    }

    /* Toolbar */
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        padding: 20px 28px;
        background: white;
        border-bottom: 1px solid #eef2f6;
    }

    .action-group {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
    }

    /* Buttons */
    .btn {
        padding: 8px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        text-decoration: none;
    }

    .btn-primary {
        background: #2563eb;
        color: white;
    }

    .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
    }

    .btn-danger {
        background: #ef4444;
        color: white;
    }

    .btn-danger:hover {
        background: #dc2626;
        transform: translateY(-1px);
    }

    /* Search Box */
    .search-wrapper {
        position: relative;
        width: 320px;
    }

    .search-wrapper svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        fill: #94a3b8;
    }

    .search-wrapper input {
        width: 100%;
        padding: 8px 12px 8px 38px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 13px;
        transition: all 0.2s;
        outline: none;
        background: #f8fafc;
    }

    .search-wrapper input:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    /* Filter Select */
    .filter-select {
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 13px;
        background: #f8fafc;
        cursor: pointer;
        outline: none;
        transition: all 0.2s;
    }

    .filter-select:focus {
        border-color: #2563eb;
        background: white;
    }

    /* Table Container */
    .table-container {
        overflow-x: auto;
        padding: 0 28px 24px 28px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        text-align: left;
        padding: 14px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: transparent;
        border-bottom: 1px solid #eef2f6;
    }

    td {
        padding: 16px 12px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #334155;
    }

    tr:hover td {
        background: #fafcff;
    }

    /* Customer Info */
    .customer-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .customer-avatar {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 16px;
    }

    /* Status Badges */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
    }

    .badge-active {
        background: #d1fae5;
        color: #065f46;
    }

    .badge-inactive {
        background: #fee2e2;
        color: #991b1b;
    }

    /* Action Buttons */
    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        padding: 6px;
        background: #f1f5f9;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
    }

    .action-btn svg {
        width: 16px;
        height: 16px;
        fill: #64748b;
    }

    .action-btn:hover {
        background: #2563eb;
    }

    .action-btn:hover svg {
        fill: white;
    }

    /* Checkbox */
    .checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: #2563eb;
    }

    /* Selected Count Badge */
    .selected-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        font-size: 11px;
        font-weight: bold;
        padding: 2px 7px;
        border-radius: 30px;
        border: 2px solid white;
    }

    /* Pagination */
    .pagination {
        display: flex;
        justify-content: flex-end;
        padding: 16px 28px;
        border-top: 1px solid #eef2f6;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 60px 20px;
    }

    .empty-state svg {
        opacity: 0.5;
        margin-bottom: 16px;
        color: #94a3b8;
    }

    .empty-state p {
        color: #64748b;
        font-size: 14px;
    }

    @media (max-width: 1024px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .toolbar {
=======
        /* Header Section */
        .header-section {
            padding: 28px 32px;
            background: white;
            border-bottom: 1px solid #eef2f6;
        }

        .header-title h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 6px;
        }

        .header-title p {
            color: #64748b;
            font-size: 14px;
        }

        /* Stats Grid - Responsive */
        .stats-grid-modern {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            padding: 32px;
            background: #f8fafc;
            border-bottom: 1px solid #eef2f6;
        }

        .stat-card-modern {
            background: white;
            padding: 24px;
            border-radius: 20px;
            border: 1px solid #eef2f6;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        /* Blue line always visible */
        .stat-card-modern::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            transform: scaleX(1);
        }

        .stat-card-modern:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.15);
            border-color: #2563eb20;
        }

        .stat-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .stat-header h3 {
            color: #64748b;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-icon-modern {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #e6f0ff 0%, #f0e6ff 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stat-icon-modern svg {
            width: 24px;
            height: 24px;
            fill: #2563eb;
        }

        .stat-number-modern {
            font-size: 32px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .stat-trend {
            font-size: 12px;
            color: #10b981;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Toolbar - Responsive */
        .toolbar-modern {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
            padding: 24px 32px;
            background: white;
            border-bottom: 1px solid #eef2f6;
        }

        .action-group {
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .btn-modern {
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        .btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
        }

        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }

        .search-wrapper {
            position: relative;
            width: 360px;
        }

        .search-wrapper svg {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            fill: #94a3b8;
        }

        .search-wrapper input {
            width: 100%;
            padding: 10px 16px 10px 44px;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            font-size: 14px;
            transition: all 0.2s ease;
            outline: none;
        }

        .search-wrapper input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filter-select {
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            font-size: 14px;
            background: white;
            cursor: pointer;
            outline: none;
            transition: all 0.2s ease;
        }

        .filter-select:focus {
            border-color: #2563eb;
        }

        /* Table Container - Responsive */
        .table-container-modern {
            overflow-x: auto;
            padding: 0 32px 32px 32px;
            background: white;
            width: 100%;
        }

        .customers-table-modern {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
            min-width: 800px;
        }

        .customers-table-modern thead th {
            padding: 16px 20px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: #f8fafc;
            border-radius: 12px;
        }

        .customers-table-modern tbody tr {
            transition: all 0.2s ease;
        }

        .customers-table-modern tbody td {
            padding: 18px 20px;
            background: white;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            color: #334155;
        }

        .customers-table-modern tbody tr:hover td {
            background: #fafcff;
        }

        /* Customer Info */
        .customer-info-modern {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .customer-avatar-modern {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
        }

        .customer-details-modern {
            display: flex;
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
            flex-direction: column;
            align-items: stretch;
        }
<<<<<<< HEAD
        .search-wrapper {
            width: 100%;
        }
        .action-group {
            justify-content: space-between;
        }
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }
        .table-container {
            padding: 0 16px 16px 16px;
        }
        th, td {
            padding: 12px 8px;
            font-size: 12px;
        }
        .action-buttons {
            flex-direction: column;
            gap: 6px;
=======

        .customer-name-modern {
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
            font-size: 15px;
        }

        .customer-email-modern {
            font-size: 12px;
            color: #94a3b8;
        }

        /* Status Badges */
        .badge-modern {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            gap: 6px;
            width: fit-content;
        }

        .badge-active {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
        }

        .badge-inactive {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            color: #991b1b;
        }

        /* Action Buttons Modern */
        .action-buttons-modern {
            display: flex;
            gap: 8px;
        }

        .action-btn-modern {
            padding: 8px;
            border: none;
            background: #f1f5f9;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .action-btn-modern svg {
            width: 18px;
            height: 18px;
            fill: #64748b;
            transition: all 0.2s ease;
        }

        .action-btn-modern:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }

        .action-btn-modern:hover svg {
            fill: white;
        }

        /* Checkbox Modern */
        .checkbox-modern {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #2563eb;
        }

        /* Pagination Modern */
        .pagination-modern {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 20px 32px;
            background: white;
            border-top: 1px solid #eef2f6;
            flex-wrap: wrap;
            gap: 16px;
        }
        
        /* Fix for sidebar */
        .flex.h-screen {
            display: flex;
        }
        
        .main-content {
            flex: 1;
            overflow: auto;
            width: 100%;
        }
        
        .content-wrapper {
            padding: 0 20px;
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
        }
    }
</style>

<<<<<<< HEAD
<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
=======
        /* ============================================ */
        /* RESPONSIVE BREAKPOINTS */
        /* ============================================ */

        /* Tablet Landscape (1024px - 1280px) */
        @media (max-width: 1280px) {
            .stats-grid-modern {
                gap: 20px;
                padding: 24px;
            }
            
            .stat-number-modern {
                font-size: 28px;
            }
            
            .stat-icon-modern {
                width: 44px;
                height: 44px;
            }
        }

        /* Tablet (768px - 1024px) */
        @media (max-width: 1024px) {
            .stats-grid-modern {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
                padding: 24px;
            }
            
            .toolbar-modern {
                flex-direction: column;
                align-items: stretch;
                padding: 20px;
            }
            
            .search-wrapper {
                width: 100%;
            }
            
            .action-group {
                justify-content: space-between;
            }
            
            .table-container-modern {
                padding: 0 20px 20px 20px;
            }
            
            .header-section {
                padding: 24px;
            }
            
            .header-title h1 {
                font-size: 24px;
            }
        }

        /* Mobile Landscape (480px - 768px) */
        @media (max-width: 768px) {
            .stats-grid-modern {
                grid-template-columns: 1fr;
                gap: 16px;
                padding: 20px;
            }
            
            .header-section {
                padding: 20px;
            }
            
            .header-title h1 {
                font-size: 22px;
            }
            
            .header-title p {
                font-size: 13px;
            }
            
            .table-container-modern {
                padding: 0 16px 16px 16px;
            }
            
            .content-wrapper {
                padding: 0 12px;
            }
            
            .toolbar-modern {
                padding: 16px;
            }
            
            .action-group {
                flex-direction: column;
                width: 100%;
            }
            
            .action-group .btn-modern {
                width: 100%;
                justify-content: center;
            }
            
            .pagination-modern {
                justify-content: center;
            }
            
            /* Make table horizontally scrollable on mobile */
            .table-container-modern {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .customers-table-modern {
                min-width: 700px;
            }
        }

        /* Mobile Portrait (320px - 480px) */
        @media (max-width: 480px) {
            .stats-grid-modern {
                gap: 12px;
                padding: 16px;
            }
            
            .stat-card-modern {
                padding: 16px;
            }
            
            .stat-number-modern {
                font-size: 24px;
            }
            
            .stat-icon-modern {
                width: 40px;
                height: 40px;
            }
            
            .stat-icon-modern svg {
                width: 20px;
                height: 20px;
            }
            
            .stat-header h3 {
                font-size: 11px;
            }
            
            .header-section {
                padding: 16px;
            }
            
            .header-title h1 {
                font-size: 20px;
            }
            
            .btn-modern {
                padding: 8px 16px;
                font-size: 13px;
            }
            
            .filter-select {
                padding: 8px 12px;
                font-size: 13px;
            }
            
            .search-wrapper input {
                padding: 8px 16px 8px 40px;
                font-size: 13px;
            }
            
            .customers-table-modern {
                min-width: 600px;
            }
            
            .customer-avatar-modern {
                width: 36px;
                height: 36px;
                font-size: 14px;
            }
            
            .customer-name-modern {
                font-size: 13px;
            }
            
            .customer-email-modern {
                font-size: 11px;
            }
            
            .badge-modern {
                padding: 4px 10px;
                font-size: 11px;
            }
        }

        /* Small Mobile (below 360px) */
        @media (max-width: 360px) {
            .stats-grid-modern {
                gap: 10px;
                padding: 12px;
            }
            
            .header-title h1 {
                font-size: 18px;
            }
            
            .customers-table-modern {
                min-width: 550px;
            }
            
            .table-container-modern {
                padding: 0 12px 12px 12px;
            }
        }
    </style>
</head>

<div class="content-wrapper">
    <div class="modern-card">
        <div class="header-section">
            <div class="header-title">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                <h1>Customer Management</h1>
                <p>Manage and monitor all your customers in one place</p>
            </div>
        </div>

        <!-- Stats Cards -->
<<<<<<< HEAD
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Customers</h3>
                    <div class="stat-number">{{ $customers->total() }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 6v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active Customers</h3>
                    <div class="stat-number">{{ $customers->where('is_active', 1)->count() }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <div class="stat-number">₹24.5L</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3l4-4-4-4v3h-.5C7.56 17 5 14.44 5 11.5S7.56 6 11.5 6 18 8.56 18 11.5c0 1.58-.66 3-1.73 4.05l1.42 1.42A6.96 6.96 0 0 0 20 11.5 8.5 8.5 0 0 0 11.5 2z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>New This Month</h3>
                    <div class="stat-number">42</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    </svg>
=======
        <div class="stats-grid-modern">
            <div class="stat-card-modern">
                <div class="stat-header">
                    <h3>Total Customers</h3>
                    <div class="stat-icon-modern">
                        <svg viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 6v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-number-modern">{{ $customers->total() }}</div>
                <div class="stat-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                    <span>+12% this month</span>
                </div>
            </div>
            
            <div class="stat-card-modern">
                <div class="stat-header">
                    <h3>Active Customers</h3>
                    <div class="stat-icon-modern">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-number-modern">{{ $customers->where('is_active', 1)->count() }}</div>
                <div class="stat-trend" style="color: #10b981;">✓ Active now</div>
            </div>
            
            <div class="stat-card-modern">
                <div class="stat-header">
                    <h3>Total Revenue</h3>
                    <div class="stat-icon-modern">
                        <svg viewBox="0 0 24 24">
                            <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3l4-4-4-4v3h-.5C7.56 17 5 14.44 5 11.5S7.56 6 11.5 6 18 8.56 18 11.5c0 1.58-.66 3-1.73 4.05l1.42 1.42A6.96 6.96 0 0 0 20 11.5 8.5 8.5 0 0 0 11.5 2z"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-number-modern">₹24.5L</div>
                <div class="stat-trend" style="color: #10b981;">↑ +18.5%</div>
            </div>
            
            <div class="stat-card-modern">
                <div class="stat-header">
                    <h3>New This Month</h3>
                    <div class="stat-icon-modern">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                        </svg>
                    </div>
                </div>
                <div class="stat-number-modern">42</div>
                <div class="stat-trend" style="color: #10b981;">↑ +8 new</div>
            </div>
        </div>

        <!-- Toolbar -->
        <div class="toolbar-modern">
            <div class="action-group">
                <button onclick="clearSelection()" class="btn-modern btn-danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    Clear Selection
                </button>
                
                <button onclick="handleSendMail()" class="btn-modern btn-primary" style="position: relative;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Send Mail
                    <span id="selectedCount" style="position: absolute; top: -8px; right: -8px; background: #ef4444; color: white; font-size: 11px; font-weight: bold; padding: 2px 7px; border-radius: 30px; border: 2px solid white;">
                        0
                    </span>
                </button>
            </div>
            
            <div class="action-group">
                <form action="{{ route('admin.customers.index') }}" method="GET" style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <select name="status" onchange="this.form.submit()" class="filter-select">
                        <option value="">All Customers</option>
                        <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Active Customers</option>
                        <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Inactive Customers</option>
                    </select>
                </form>
                
                <div class="search-wrapper">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <form action="{{ route('admin.customers.index') }}" method="GET">
                        <input type="text" name="search" placeholder="Search by name or email..." value="{{ request('search') }}">
                    </form>
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                </div>
            </div>
        </div>

<<<<<<< HEAD
        <!-- Toolbar -->
        <div class="toolbar">
            <div class="action-group">
                <button onclick="clearSelection()" class="btn btn-danger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Clear Selection
                </button>
                <button onclick="handleSendMail()" class="btn btn-primary" style="position: relative;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                    Send Mail
                    <span id="selectedCount" class="selected-count">0</span>
                </button>
            </div>
            <div class="action-group">
                <form action="{{ route('admin.customers.index') }}" method="GET" style="display: flex; gap: 12px;">
                    <select name="status" onchange="this.form.submit()" class="filter-select">
                        <option value="">All Customers</option>
                        <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>Active Customers</option>
                        <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>Inactive Customers</option>
                    </select>
                </form>
                <div class="search-wrapper">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <form action="{{ route('admin.customers.index') }}" method="GET">
                        <input type="text" name="search" placeholder="Search by name or email..." value="{{ request('search') }}">
                    </form>
                </div>
            </div>
        </div>

        <!-- Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 40px;">
                            <input type="checkbox" id="select_all" class="checkbox">
                        </th>
                        <th style="width: 50px;">#</th>
=======
        <!-- Table -->
        <div class="table-container-modern">
            <table class="customers-table-modern">
                <thead>
                    <tr>
                        <th style="width: 50px;">
                            <input type="checkbox" id="select_all" class="checkbox-modern">
                        </th>
                        <th>#</th>
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                        <th>Customer Information</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Plans</th>
<<<<<<< HEAD
                        <th style="width: 100px;">Actions</th>
=======
                        <th>Actions</th>
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                    </tr>
                </thead>
                <tbody>
                    @if (isset($customers) && count($customers) > 0)
                        @foreach ($customers as $customer)
                            <tr>
                                <td>
<<<<<<< HEAD
                                    <input type="checkbox" name="select_customer[]" value="{{ $customer['id'] }}" class="customer_checkbox checkbox">
=======
                                    <input type="checkbox" name="select_customer[]" value="{{ $customer['id'] }}"
                                        class="customer_checkbox checkbox-modern">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                </td>
                                <td style="font-weight: 600; color: #64748b;">
                                    {{ $loop->iteration + ($customers->currentPage() - 1) * $customers->perPage() }}
                                </td>
                                <td>
<<<<<<< HEAD
                                    <div class="customer-info">
                                        <div class="customer-avatar">
                                            {{ substr($customer['name'], 0, 1) }}
                                        </div>
                                        <div>
                                            <div style="font-weight: 700; color: #1e293b;">{{ $customer['name'] }}</div>
                                            <div style="font-size: 12px; color: #94a3b8;">{{ $customer['email'] }}</div>
=======
                                    <div class="customer-info-modern">
                                        <div class="customer-avatar-modern">
                                            {{ substr($customer['name'], 0, 1) }}
                                        </div>
                                        <div class="customer-details-modern">
                                            <span class="customer-name-modern">{{ $customer['name'] }}</span>
                                            <span class="customer-email-modern">{{ $customer['email'] }}</span>
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    @if ($customer->is_active)
<<<<<<< HEAD
                                        <span class="badge badge-active">Active</span>
                                    @else
                                        <span class="badge badge-inactive">Inactive</span>
                                    @endif
                                </td>
                                <td>
=======
                                        <span class="badge-modern badge-active">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                            </svg>
                                            Active
                                        </span>
                                    @else
                                        <span class="badge-modern badge-inactive">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                            </svg>
                                            Inactive
                                        </span>
                                    @endif
                                </td>
                                <td style="color: #475569;">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                    {{ $customer['created_at']->format('d M Y') }}
                                    <div style="font-size: 11px; color: #94a3b8;">{{ $customer['created_at']->format('h:i A') }}</div>
                                </td>
                                <td>
                                    <a href="{{ route('admin.customers.plans', $customer->id) }}">
<<<<<<< HEAD
                                        <button class="action-btn" title="View Plans">
=======
                                        <button class="action-btn-modern" title="View Plans">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                            </svg>
                                        </button>
                                    </a>
                                </td>
                                <td>
<<<<<<< HEAD
                                    <div class="action-buttons">
                                        <button class="action-btn" onclick="viewCustomer({{ $customer['id'] }})" title="View Details">
=======
                                    <div class="action-buttons-modern">
                                        <button class="action-btn-modern" onclick="viewCustomer({{ $customer['id'] }})" title="View Details">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
<<<<<<< HEAD
                                        <button class="action-btn" onclick="editCustomer({{ $customer['id'] }})" title="Edit Customer">
=======
                                        <button class="action-btn-modern" onclick="editCustomer({{ $customer['id'] }})" title="Edit Customer">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                                            <svg viewBox="0 0 24 24">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
<<<<<<< HEAD
                            <td colspan="7" class="empty-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 6v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                                <p>No customers found</p>
                                <p style="font-size: 12px; margin-top: 4px;">Try adjusting your search or filter</p>
=======
                            <td colspan="7" style="text-align: center; padding: 60px; color: #94a3b8;">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 16px; opacity: 0.5;">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 6v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                                <p style="font-size: 16px; font-weight: 500;">No customers found</p>
                                <p style="font-size: 13px; margin-top: 4px;">Try adjusting your search or filter</p>
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                            </td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
<<<<<<< HEAD
        <div class="pagination">
=======
        <div class="pagination-modern">
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
            {{ $customers->links('pagination::tailwind') }}
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<<<<<<< HEAD
<script>
    // Global State
    let selectedCustomers = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
    let isAllSelected = localStorage.getItem('isAllSelected') === 'true';

    function updateSelectedCount() {
        let count = isAllSelected ? {{ $customers->total() }} : selectedCustomers.length;
        document.getElementById('selectedCount').innerText = count;
    }

    document.addEventListener("DOMContentLoaded", function() {
        let checkboxes = document.querySelectorAll('.customer_checkbox');
        let selectAll = document.getElementById('select_all');

=======

<script>
    /* =========================
           GLOBAL STATE
        ========================= */
    let selectedCustomers = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
    let isAllSelected = localStorage.getItem('isAllSelected') === 'true';

    /* =========================
       UPDATE COUNT
    ========================= */
    function updateSelectedCount() {
        let count = isAllSelected ?
            {{ $customers->total() }} :
            selectedCustomers.length;

        document.getElementById('selectedCount').innerText = count;
    }

    /* =========================
       PAGE LOAD
    ========================= */
    document.addEventListener("DOMContentLoaded", function() {

        let checkboxes = document.querySelectorAll('.customer_checkbox');
        let selectAll = document.getElementById('select_all');

        // Restore checkbox state
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
        checkboxes.forEach(cb => {
            if (isAllSelected || selectedCustomers.includes(cb.value)) {
                cb.checked = true;
            }
<<<<<<< HEAD
            cb.addEventListener('change', function() {
                if (isAllSelected) {
=======

            cb.addEventListener('change', function() {

                if (isAllSelected) {
                    // switch to manual mode
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                    isAllSelected = false;
                    localStorage.setItem('isAllSelected', 'false');
                    selectedCustomers = [];
                }
<<<<<<< HEAD
=======

>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                if (this.checked) {
                    if (!selectedCustomers.includes(this.value)) {
                        selectedCustomers.push(this.value);
                    }
                } else {
                    selectedCustomers = selectedCustomers.filter(id => id !== this.value);
                }
<<<<<<< HEAD
=======

>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
                localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));
                updateSelectedCount();
            });
        });

<<<<<<< HEAD
        selectAll.addEventListener('change', function() {
=======
        // Select All toggle
        selectAll.addEventListener('change', function() {

>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
            if (this.checked) {
                isAllSelected = true;
                localStorage.setItem('isAllSelected', 'true');
                localStorage.removeItem('selectedCustomers');
<<<<<<< HEAD
                checkboxes.forEach(cb => cb.checked = true);
            } else {
                isAllSelected = false;
                localStorage.setItem('isAllSelected', 'false');
                selectedCustomers = [];
                localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));
                checkboxes.forEach(cb => cb.checked = false);
            }
            updateSelectedCount();
=======

                checkboxes.forEach(cb => cb.checked = true);

            } else {
                isAllSelected = false;
                localStorage.setItem('isAllSelected', 'false');

                selectedCustomers = [];
                localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));

                checkboxes.forEach(cb => cb.checked = false);
            }

            updateSelectedCount();
        });

        updateSelectedCount(); 

    });

    /* =========================
       CLEAR SELECTION
    ========================= */
    function clearSelection() {
        localStorage.removeItem('selectedCustomers');
        localStorage.removeItem('isAllSelected');
        location.reload();
    }

    /* =========================
       SEND MAIL
    ========================= */
   function handleSendMail() {

    let selected = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
    let isAll = localStorage.getItem('isAllSelected') === 'true';

    if (!isAll && selected.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'No Customer Selected',
            text: 'Please select at least one customer!',
>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
        });

        updateSelectedCount();
    });

    function clearSelection() {
        localStorage.removeItem('selectedCustomers');
        localStorage.removeItem('isAllSelected');
        location.reload();
    }

    function handleSendMail() {
        let selected = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
        let isAll = localStorage.getItem('isAllSelected') === 'true';

        if (!isAll && selected.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Customer Selected',
                text: 'Please select at least one customer!',
            });
            return;
        }

        let url = "{{ route('admin.customers.customer-mail') }}";
        let params = new URLSearchParams(window.location.search);
        let search = params.get('search');
        let status = params.get('status');
        
        if (isAll) {
            url += "?all=true";
            if (search) {
                url += "&search=" + encodeURIComponent(search);
            } else if (status) {
                url += "&status=" + encodeURIComponent(status);
            }
        } else {
            url += "?ids=" + selected.join(',');
        }
        window.location.href = url;
    }

<<<<<<< HEAD
    function viewCustomer(id) {
        console.log('View customer:', id);
    }

    function editCustomer(id) {
        console.log('Edit customer:', id);
    }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

=======
    window.location.href = url;
}
</script>

>>>>>>> fe5af27f631640dedfe6a23929b74c0b8b90a482
@endsection