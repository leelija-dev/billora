@extends('admin.main-layout')
@section('title','Customer Plan Details')
@section('content')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: #f8fafc;
            min-height: 100vh;
        }

        /* Main Content */
        .main-content {
            padding: 32px;
            background: #f8fafc;
            min-height: 100vh;
            width: 100%;
        }

        /* Breadcrumb */
        .breadcrumb {
            margin-bottom: 24px;
        }

        .breadcrumb a {
            color: #64748b;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s ease;
        }

        .breadcrumb a:hover {
            color: #2563EB;
        }

        .breadcrumb span {
            color: #94a3b8;
            margin: 0 8px;
        }

        .breadcrumb .current {
            color: #2563EB;
            font-weight: 500;
        }

        /* Customer Header Card */
        .customer-header {
            background: white;
            border-radius: 24px;
            padding: 28px 32px;
            margin-bottom: 28px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            border: 1px solid #eef2f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .customer-info-left {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .customer-avatar-large {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border-radius: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .customer-avatar-large svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .customer-details h2 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .customer-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 8px;
        }

        .customer-meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #64748b;
            font-size: 14px;
        }

        .customer-meta-item svg {
            width: 16px;
            height: 16px;
            fill: #94a3b8;
        }

        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: #f1f5f9;
            border-radius: 40px;
            color: #475569;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .back-button:hover {
            background: #e2e8f0;
            color: #2563EB;
            transform: translateX(-4px);
        }

        .back-button svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        /* Stats Row */
        .stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-item {
            background: white;
            border-radius: 20px;
            padding: 24px;
            border: 1px solid #eef2f6;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .stat-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
            border-color: #2563EB20;
        }

        .stat-item::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563EB, #60a5fa);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }

        .stat-item:hover::after {
            transform: scaleX(1);
        }

        .stat-icon {
            width: 52px;
            height: 52px;
            background: #e6f0ff;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
        }

        .stat-icon svg {
            width: 26px;
            height: 26px;
            fill: #2563EB;
        }

        .stat-value {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 4px;
        }

        .stat-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
        }

        .stat-trend {
            font-size: 12px;
            color: #10b981;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Section Title */
        .section-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }

        .section-title svg {
            width: 24px;
            height: 24px;
            fill: #2563EB;
        }

        .section-title h3 {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
        }

        .section-title span {
            background: #e6f0ff;
            color: #2563EB;
            padding: 4px 12px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 8px;
        }

        /* Table Container */
        .table-wrapper {
            background: white;
            border-radius: 24px;
            border: 1px solid #eef2f6;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .plans-table {
            width: 100%;
            border-collapse: collapse;
        }

        .plans-table thead {
            background: #f8fafc;
        }

        .plans-table thead th {
            padding: 18px 20px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eef2f6;
        }

        .plans-table tbody tr {
            transition: background 0.2s ease;
            border-bottom: 1px solid #f1f5f9;
        }

        .plans-table tbody tr:hover {
            background: #fafcff;
        }

        .plans-table tbody td {
            padding: 18px 20px;
            font-size: 14px;
            color: #334155;
        }

        /* Plan Cell */
        .plan-cell {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .plan-badge-icon {
            width: 40px;
            height: 40px;
            background: #e6f0ff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .plan-badge-icon svg {
            width: 20px;
            height: 20px;
            fill: #2563EB;
        }

        .plan-name-text {
            font-weight: 700;
            color: #111827;
        }

        /* Status Badges */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-active {
            background: #d1fae5;
            color: #065f46;
        }

        .status-expired {
            background: #fef3c7;
            color: #92400e;
        }

        .status-cancelled {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Payment Status */
        .payment-success {
            background: #d1fae5;
            color: #065f46;
        }

        .payment-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .payment-failed {
            background: #fee2e2;
            color: #991b1b;
        }

        /* Price Cell */
        .price-cell {
            font-weight: 700;
            color: #111827;
        }

        /* Payment Method */
        .payment-method-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            background: #f1f5f9;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            color: #475569;
        }

        .payment-method-badge svg {
            width: 14px;
            height: 14px;
            fill: #64748b;
        }

        /* Date Cell */
        .date-cell {
            font-size: 13px;
        }

        .date-cell small {
            font-size: 11px;
            color: #94a3b8;
            display: block;
            margin-top: 2px;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 60px;
        }

        .empty-state svg {
            width: 80px;
            height: 80px;
            fill: #cbd5e1;
            margin-bottom: 16px;
        }

        .empty-state h4 {
            font-size: 18px;
            font-weight: 600;
            color: #475569;
            margin-bottom: 8px;
        }

        .empty-state p {
            color: #94a3b8;
            font-size: 14px;
        }

        /* Pagination */
        .pagination-wrapper {
            display: flex;
            justify-content: flex-end;
            padding: 20px 24px;
            background: white;
            border-top: 1px solid #eef2f6;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .stats-row {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
            }

            .customer-header {
                flex-direction: column;
                align-items: flex-start;
                padding: 20px;
            }

            .customer-info-left {
                flex-direction: column;
                text-align: center;
                width: 100%;
            }

            .customer-meta {
                justify-content: center;
            }

            .stats-row {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .plans-table {
                min-width: 800px;
            }

            .pagination-wrapper {
                justify-content: center;
            }
        }

        /* Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .customer-header, .stat-item, .table-wrapper {
            animation: fadeIn 0.4s ease forwards;
        }

        .stat-item:nth-child(1) { animation-delay: 0.05s; }
        .stat-item:nth-child(2) { animation-delay: 0.1s; }
        .stat-item:nth-child(3) { animation-delay: 0.15s; }
        .table-wrapper { animation-delay: 0.2s; }
    </style>

    <div class="main-content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
            <a href="{{ route('admin.dashboard') }}">Dashboard</a>
            <span>/</span>
            <a href="{{ route('admin.customers.index') }}">Customers</a>
            <span>/</span>
            <span class="current">Plan Details</span>
        </div>

        <!-- Customer Header -->
        <div class="customer-header">
            <div class="customer-info-left">
                <div class="customer-avatar-large">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
                <div class="customer-details">
                    <h2>{{ $customer->name ?? '' }}</h2>
                    <div class="customer-meta">
                        <div class="customer-meta-item">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                            {{ $customer->email ?? '' }}
                        </div>
                        <div class="customer-meta-item">
                            <svg viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                            </svg>
                            {{ $customer->phone ?? '' }}
                        </div>
                    </div>
                </div>
            </div>
            <a href="{{ url()->previous() }}" class="back-button">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
                Back to Customers
            </a>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
            <div class="stat-item">
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    </svg>
                </div>
                <div class="stat-value">{{ count($plans) }}</div>
                <div class="stat-label">Total Plans</div>
                <div class="stat-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                    All subscriptions
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <div class="stat-value">{{ $plans->where('status', 'active')->count() }}</div>
                <div class="stat-label">Active Plans</div>
                <div class="stat-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    Currently active
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3l4-4-4-4v3h-.5C7.56 17 5 14.44 5 11.5S7.56 6 11.5 6 18 8.56 18 11.5c0 1.58-.66 3-1.73 4.05l1.42 1.42A6.96 6.96 0 0 0 20 11.5 8.5 8.5 0 0 0 11.5 2z"/>
                    </svg>
                </div>
                <div class="stat-value">{{ $plans->where('payment_status', 'pending')->count() }}</div>
                <div class="stat-label">Pending Payments</div>
                <div class="stat-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    Awaiting payment
                </div>
            </div>
        </div>

        <!-- Plans Table Section -->
        <div class="section-title">
            <svg viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
            </svg>
            <h3>Plan History</h3>
            <span>{{ count($plans) }} Records</span>
        </div>

        <div class="table-wrapper">
            <div style="overflow-x: auto;">
                <table class="plans-table">
                    <thead>
                        <tr>
                            <th>Plan ID</th>
                            <th>Plan Name</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Payment Method</th>
                            <th>Payment Status</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (isset($plans) && count($plans) > 0)
                            @foreach ($plans as $plan)
                                <tr>
                                    <td style="font-weight: 600; color: #64748b;">{{ $plan->plan_id ?? ''}}</td>
                                    <td>
                                        <div class="plan-cell">
                                            
                                            <span class="plan-name-text">{{ ucfirst($plan->plan?->name ?? '') }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        @php
                                            $planStatus = strtolower(trim($plan->status ?? ''));
                                        @endphp
                                        <span class="status-badge 
                                            @if($planStatus == 'expired') status-expired
                                            @elseif($planStatus == 'active') status-active
                                            @elseif($planStatus == 'cancelled') status-cancelled
                                            @endif">
                                            @if($planStatus == 'expired') Expired
                                            @elseif($planStatus == 'active') Active
                                            @elseif($planStatus == 'cancelled') Cancelled
                                            @else {{ ucfirst($planStatus) }}
                                            @endif
                                        </span>
                                    </td>
                                    <td class="price-cell">
                                        {{ config('app.app_currency') }}{{ number_format($plan->price ?? 0, 2) }}
                                    </td>
                                    <td>
                                        <div class="payment-method-badge">
                                            
                                            {{ $plan->payment_method ?? 'N/A' }}
                                        </div>
                                    </td>
                                    <td>
                                        @php
                                            $status = strtolower(trim($plan->payment_status ?? ''));
                                        @endphp
                                        <span class="status-badge 
                                            @if($status == 'pending') payment-pending
                                            @elseif($status == 'success') payment-success
                                            @elseif($status == 'failed') payment-failed
                                            @endif">
                                            @if($status == 'pending')Pending
                                            @elseif($status == 'success')Success
                                            @elseif($status == 'failed') Failed
                                            @else {{ ucfirst($status) }}
                                            @endif
                                        </span>
                                    </td>
                                    <td class="date-cell">
                                        {{ $plan->start_date ? $plan->start_date->format('d M Y') : 'N/A' }}
                                    </td>
                                    <td class="date-cell">
                                        {{ $plan->end_date ? $plan->end_date->format('d M Y') : 'N/A' }}
                                    </td>
                                    <td class="date-cell">
                                        {{ $plan->created_at ? $plan->created_at->format('d M Y') : 'N/A' }}
                                        <small>{{ $plan->created_at ? $plan->created_at->format('h:i A') : '' }}</small>
                                    </td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="9">
                                    <div class="empty-state"> 
                                        {{-- <svg viewBox="0 0 24 24">
                                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                                        </svg> --}}
                                        <h4>No Plans Found</h4>
                                        <p>This customer hasn't subscribed to any plans yet.</p>
                                    </div>
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>

            @if(isset($plans) && count($plans) > 0)
                <div class="pagination-wrapper">
                    {{ $plans->links('pagination::tailwind') }}
                </div>
            @endif
        </div>
    </div>
@endsection