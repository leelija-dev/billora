@extends('admin.main-layout')
@section('title', 'All Customers')
@section('content')

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
        }
    }

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
            flex-direction: column;
            align-items: stretch;
        }
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
        }
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Customer Management</h1>
                <p>Manage and monitor all your customers in one place</p>
            </div>
        </div>

        <!-- Stats Cards -->
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
                </div>
            </div>
        </div>

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
                        <th>Customer Information</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Plans</th>
                        <th style="width: 100px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @if (isset($customers) && count($customers) > 0)
                        @foreach ($customers as $customer)
                            <tr>
                                <td>
                                    <input type="checkbox" name="select_customer[]" value="{{ $customer['id'] }}" class="customer_checkbox checkbox">
                                </td>
                                <td style="font-weight: 600; color: #64748b;">
                                    {{ $loop->iteration + ($customers->currentPage() - 1) * $customers->perPage() }}
                                </td>
                                <td>
                                    <div class="customer-info">
                                        <div class="customer-avatar">
                                            {{ substr($customer['name'], 0, 1) }}
                                        </div>
                                        <div>
                                            <div style="font-weight: 700; color: #1e293b;">{{ $customer['name'] }}</div>
                                            <div style="font-size: 12px; color: #94a3b8;">{{ $customer['email'] }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    @if ($customer->is_active)
                                        <span class="badge badge-active">Active</span>
                                    @else
                                        <span class="badge badge-inactive">Inactive</span>
                                    @endif
                                </td>
                                <td>
                                    {{ $customer['created_at']->format('d M Y') }}
                                    <div style="font-size: 11px; color: #94a3b8;">{{ $customer['created_at']->format('h:i A') }}</div>
                                </td>
                                <td>
                                    <a href="{{ route('admin.customers.plans', $customer->id) }}">
                                        <button class="action-btn" title="View Plans">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                                            </svg>
                                        </button>
                                    </a>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn" onclick="viewCustomer({{ $customer['id'] }})" title="View Details">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            </svg>
                                        </button>
                                        <button class="action-btn" onclick="editCustomer({{ $customer['id'] }})" title="Edit Customer">
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
                            <td colspan="7" class="empty-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm8 6v2c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1h2c.55 0 1 .45 1 1zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V17c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-.5c0-2.33-4.67-3.5-7-3.5z"/>
                                </svg>
                                <p>No customers found</p>
                                <p style="font-size: 12px; margin-top: 4px;">Try adjusting your search or filter</p>
                            </td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
            {{ $customers->links('pagination::tailwind') }}
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
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

        checkboxes.forEach(cb => {
            if (isAllSelected || selectedCustomers.includes(cb.value)) {
                cb.checked = true;
            }
            cb.addEventListener('change', function() {
                if (isAllSelected) {
                    isAllSelected = false;
                    localStorage.setItem('isAllSelected', 'false');
                    selectedCustomers = [];
                }
                if (this.checked) {
                    if (!selectedCustomers.includes(this.value)) {
                        selectedCustomers.push(this.value);
                    }
                } else {
                    selectedCustomers = selectedCustomers.filter(id => id !== this.value);
                }
                localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));
                updateSelectedCount();
            });
        });

        selectAll.addEventListener('change', function() {
            if (this.checked) {
                isAllSelected = true;
                localStorage.setItem('isAllSelected', 'true');
                localStorage.removeItem('selectedCustomers');
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

    function viewCustomer(id) {
        console.log('View customer:', id);
    }

    function editCustomer(id) {
        console.log('Edit customer:', id);
    }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection