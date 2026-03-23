<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billora - Customer Management</title>
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
            display: flex;
        }

        /* Sidebar */
        /* .sidebar {
            width: 280px;
            background: white;
            border-right: 1px solid #eef2f6;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1001;
            padding: 32px 0;
        }

        .sidebar-header {
            padding: 0 24px;
            margin-bottom: 40px;
        }

        .sidebar-header h2 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
        }

        .sidebar-header span {
            color: #2563EB;
        } */

        .nav-menu {
            list-style: none;
            padding: 0 16px;
        }

        .nav-item {
            margin-bottom: 8px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: #64748b;
            text-decoration: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .nav-link svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .nav-link:hover {
            background: #f1f5f9;
            color: #2563EB;
        }

        .nav-link.active {
            background: #2563EB;
            color: white;
        }

        .nav-link.logout {
            margin-top: 32px;
            color: #ef4444;
        }

        .nav-link.logout:hover {
            background: #fee2e2;
        }

        /* Main Content */
        .main-content {
            flex: 1;
            margin-left: auto;
            padding: 32px;
            background: #f8fafc;
            min-height: 100vh;
        }

        /* Page Header */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .header-left h1 {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }

        .header-left p {
            color: #64748b;
            font-size: 15px;
        }

        .header-left span {
            color: #2563EB;
            font-weight: 600;
            background: #e6f0ff;
            padding: 4px 12px;
            border-radius: 30px;
            margin-left: 12px;
            font-size: 14px;
        }

        .header-right {
            display: flex;
            gap: 16px;
            align-items: center;
        }

        .search-box {
            position: relative;
            width: 320px;
        }

        .search-box svg {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            fill: #94a3b8;
        }

        .search-box input {
            width: 100%;
            padding: 12px 16px 12px 48px;
            border: 1px solid #e2e8f0;
            border-radius: 30px;
            font-size: 14px;
            background: white;
            transition: all 0.2s ease;
            outline: none;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .search-box input:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .search-box input::placeholder {
            color: #94a3b8;
        }

        .add-btn {
            background: #2563EB;
            color: white;
            border: none;
            border-radius: 30px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
        }

        .add-btn:hover {
            background: #1D4ED8;
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(37, 99, 235, 0.25);
        }

        .add-btn svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: white;
            padding: 24px;
            border-radius: 20px;
            border: 1px solid #eef2f6;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
        }

        .stat-card:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
            border-color: #2563EB;
        }

        .stat-info h3 {
            color: #64748b;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-number {
            font-size: 32px;
            font-weight: 700;
            color: #111827;
        }

        .stat-icon {
            width: 56px;
            height: 56px;
            background: #e6f0ff;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .stat-icon svg {
            width: 28px;
            height: 28px;
            fill: #2563EB;
        }

        /* Tabs */
        .tabs-section {
            background: white;
            border-radius: 16px;
            padding: 8px;
            margin-bottom: 32px;
            border: 1px solid #eef2f6;
            display: inline-flex;
            gap: 4px;
        }

        .tab-btn {
            padding: 10px 24px;
            border: none;
            background: transparent;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .tab-btn:hover {
            color: #2563EB;
            background: #f8fafc;
        }

        .tab-btn.active {
            background: #2563EB;
            color: white;
        }

        /* Table Container */
        .table-container {
            background: white;
            border-radius: 24px;
            border: 1px solid #eef2f6;
            overflow: auto;
            margin-bottom: 32px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .customers-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 1000px;
        }

        .customers-table th {
            background: #f8fafc;
            padding: 20px 24px;
            text-align: center;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #eef2f6;
        }

        .customers-table td {
            padding: 20px 24px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            color: #334155;
        }

        .customers-table tr:hover td {
            background: #fafcff;
        }

        .customers-table tr:last-child td {
            border-bottom: none;
        }

        /* Customer Info */
        .customer-info {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .customer-avatar {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 18px;
        }

        .customer-details {
            display: flex;
            flex-direction: column;
        }

        .customer-name {
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
            font-size: 15px;
        }

        .customer-email {
            font-size: 13px;
            color: #94a3b8;
        }

        /* Status Badge */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            width: fit-content;
        }

        .status-active {
            background: #e0f2e9;
            color: #0b5e42;
        }

        .status-inactive {
            background: #fee9e7;
            color: #b34033;
        }

        .status-pending {
            background: #fff4e0;
            color: #b45b0a;
        }

        /* Plan Badge */
        .plan-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            background: #f1f5f9;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            color: #334155;
        }

        .plan-badge.premium {
            background: #fef3c7;
            color: #92400e;
        }

        .plan-badge.enterprise {
            background: #e6f0ff;
            color: #2563EB;
        }

        .plan-badge svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        /* Action Buttons */
        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .action-btn {
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

        .action-btn svg {
            width: 18px;
            height: 18px;
            fill: #64748b;
            transition: fill 0.2s ease;
        }

        .action-btn:hover {
            background: #2563EB;
        }

        .action-btn:hover svg {
            fill: white;
        }

        .action-btn.delete:hover {
            background: #ef4444;
        }

        /* Pagination */
        .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: white;
            padding: 16px 24px;
            border-radius: 16px;
            border: 1px solid #eef2f6;
            flex-wrap: wrap;
            gap: 16px;
        }

        .pagination-info {
            color: #64748b;
            font-size: 14px;
        }

        .pagination-info strong {
            color: #2563EB;
            font-weight: 600;
        }

        .pagination-controls {
            display: flex;
            gap: 6px;
        }

        .page-btn {
            min-width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            color: #475569;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0 8px;
        }

        .page-btn:hover:not(.active):not(.disabled) {
            border-color: #2563EB;
            color: #2563EB;
            background: #f8fafc;
        }

        .page-btn.active {
            background: #2563EB;
            border-color: #2563EB;
            color: white;
        }

        .page-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .page-btn.next,
        .page-btn.prev {
            gap: 6px;
            padding: 0 16px;
        }

        .page-btn.next svg,
        .page-btn.prev svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }

            .main-content {
                margin-left: 0;
                padding: 20px;
            }

            .page-header {
                flex-direction: column;
                align-items: stretch;
            }

            .header-right {
                flex-direction: column;
                align-items: stretch;
            }

            .search-box {
                width: 100%;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .tabs-section {
                width: 100%;
                overflow-x: auto;
                justify-content: space-between;
            }

            .tab-btn {
                flex: 1;
                text-align: center;
            }
        }
    </style>
</head>

<body>
    @include('admin.sidebar')
    <div class="card" style="bg:white;">
        <div class="main-content">

            <!-- Page Header -->
            {{-- <div class="page-header">
            <div class="header-left">
                <h1>Customer Management</h1>
                <p>Manage your customers and their information <span>Total: {{ count($customers) }} customers</span></p>
            </div>
            <div class="header-right">
                <div class="search-box">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input type="text" placeholder="Search customers..." id="searchInput">
                </div>
                
            </div>
        </div> --}}

            <!-- Stats Cards -->
            {{-- <div class="stats-grid"> --}}
            {{-- @php
                $activeCount = count(array_filter($customers, function($c) { return $c['status'] === 'active'; }));
                $pendingCount = count(array_filter($customers, function($c) { return $c['status'] === 'pending'; }));
                $totalRevenue = array_sum(array_map(function($c) { 
                    return (float) str_replace(['$', ','], '', $c['revenue']); 
                }, $customers));
            @endphp --}}

            {{-- <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Customers</h3>
                    <div class="stat-number">{{ count($customers) }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active</h3>
                    <div class="stat-number"></div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Pending</h3>
                    <div class="stat-number"></div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Revenue</h3>
                    <div class="stat-number"></div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 15h-3v-2h3v2zm3-6.5c-.29.39-.71.73-1.26 1.01-.41.21-.75.47-.98.74-.22.27-.34.57-.34.95v.3h-3v-.3c0-.66.18-1.26.54-1.78.36-.52.89-.93 1.59-1.23.42-.18.73-.39.92-.62.19-.23.28-.48.28-.77 0-.3-.12-.56-.35-.78-.23-.22-.55-.33-.94-.33-.4 0-.73.12-.97.35-.24.23-.39.53-.45.9l-2.92-.37c.09-.7.4-1.3.91-1.78.51-.48 1.22-.73 2.1-.73.96 0 1.75.25 2.35.75.6.5.9 1.13.9 1.91 0 .53-.17 1-.51 1.42z"/>
                    </svg>
                </div>
            </div>
        </div> --}}

            <!-- Tabs -->
            {{-- <div class="tabs-section">
            <button class="tab-btn active">All</button>
            <button class="tab-btn">Active</button>
            <button class="tab-btn">Pending</button>
            <button class="tab-btn">Inactive</button>
        </div> --}}

            <!-- Customers Table -->
            <div class="table-container">
                <div class="flex items-center justify-between m-4">

                    <!-- Left: Title -->
                    <h2 class="table-title text-xl font-semibold">Customers</h2>

                    <!-- Right: Search -->
                    <div class="search-box flex items-center  rounded px-2">
                        <svg viewBox="0 0 24 24" class="w-5 h-5 text-gray-500">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>

                        <input type="text" placeholder="Search customers..." id="searchInput"
                            class="outline-none px-2 py-1">
                    </div>

                </div>

                <table class="customers-table">
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Revenue</th>
                            <th class="text-center">Joined</th>
                             <th>Plans</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (isset($customers) && count($customers) > 0)
                            @foreach ($customers as $customer)
                                <tr>
                                    <td class="text-center">
                                        {{ $loop->iteration + ($customers->currentPage() - 1) * $customers->perPage() }}
                                    </td>
                                    <td>
                                        <div class="customer-info">

                                            <div class="customer-details">
                                                <span class="customer-name">{{ $customer['name'] }}</span>
                                                <span class="customer-email">{{ $customer['email'] }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-center">

                                    </td>
                                    
                                    <td class="text-center"><strong></strong></td>
                                    <td class="text-center">{{ $customer['created_at']->format('d M Y h:i A') }}</td>
                                    <td class="text-center">
                                        <a href="{{route('admin.customers.plans',$customer->id)}}">
                                            <button class="action-btn" title="Notifications">
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                                </svg>
                                            </button>
                                        </a>
                                    </td>
                                    <td class="text-center">
                                        <div class="action-buttons">
                                            <button class="action-btn" onclick="viewCustomer({{ $customer['id'] }})"
                                                title="View">
                                                <svg viewBox="0 0 24 24">
                                                    <path
                                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                </svg>
                                            </button>
                                            <button class="action-btn" onclick="editCustomer({{ $customer['id'] }})"
                                                title="Edit">
                                                <svg viewBox="0 0 24 24">
                                                    <path
                                                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 48px; color: #94a3b8;">
                                    No customers found.
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
                <div class="pagination flex justify-end mt-4">
                    {{ $customers->links('pagination::tailwind') }}
                </div>
            </div>


            <!-- Pagination -->
            {{-- <div class="pagination">
            <div class="pagination-info">
                Showing <strong>1</strong> to <strong>2</strong> of <strong>{{ count($customers) }}</strong> customers
            </div>
            <div class="pagination-controls">
                <button class="page-btn prev disabled">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                    Previous
                </button>
                <button class="page-btn active">1</button>
                <button class="page-btn next disabled">
                    Next
                    <svg viewBox="0 0 24 24">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                    </svg>
                </button>
            </div>
        </div> --}}
        </div>
    </div>
    <script>
        // Simple view function
        function viewCustomer(id) {
            alert('View customer: ' + id);
        }

        function editCustomer(id) {
            alert('Edit customer: ' + id);
        }

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.customers-table tbody tr');

            rows.forEach(row => {
                if (row.cells.length > 1) {
                    const name = row.querySelector('.customer-name')?.textContent.toLowerCase() || '';
                    const email = row.querySelector('.customer-email')?.textContent.toLowerCase() || '';

                    if (name.includes(searchTerm) || email.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });

        // Tab functionality
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.textContent.toLowerCase();
                const rows = document.querySelectorAll('.customers-table tbody tr');

                rows.forEach(row => {
                    if (row.cells.length > 1) {
                        const statusCell = row.cells[1]?.querySelector('.status-badge');
                        if (statusCell) {
                            const status = statusCell.textContent.toLowerCase();
                            if (filter === 'all' || status === filter) {
                                row.style.display = '';
                            } else {
                                row.style.display = 'none';
                            }
                        }
                    }
                });
            });
        });
    </script>
</body>

</html>
