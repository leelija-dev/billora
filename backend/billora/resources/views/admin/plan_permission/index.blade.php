@extends('admin.main-layout')
@section('title', 'Plan Permissions')
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
            display: flex;
        }


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
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <!-- Total Permissions -->
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-blue-600"><strong>Total Permissions</strong></p>
                    <p class="text-2xl font-bold text-blue-600">{{ $totalPermissions ?? '0' }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full">
                    <!-- File / Document icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Active Permissions -->
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500 ">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-green-600"><strong>Active Permissions</strong></p>
                    <p class="text-2xl font-bold text-green-600">{{ $activePermissions ?? '0' }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-full">
                    <!-- Check / Active icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Inactive Permissions -->
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500 ">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-yellow-600"><strong>Inactive Permissions</strong></p>
                    <p class="text-2xl font-bold text-yellow-600">{{ $inactivePermissions ?? '0' }}</p>
                </div>
                <div class="p-3 bg-yellow-100 rounded-full">
                    <!-- X / Inactive icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-yellow-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
        </div>


    </div>

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
            <h2 class="table-title text-xl font-semibold">Plan Permission</h2>
            <a href="{{route('admin.plan-permission.create')}}" >
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                Add Permission  
            </button></a>
            <!-- Right: Search -->
            {{-- <div class="search-box flex items-center  rounded px-2">
                        <svg viewBox="0 0 24 24" class="w-5 h-5 text-gray-500">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>

                        <input type="text" placeholder="Search customers..." id="searchInput"
                            class="outline-none px-2 py-1">
                    </div> --}}

        </div>

        <table class="customers-table">
            <thead>
                <tr>
                    <th>Sl. No</th>
                    <th>Permission Name</th>
                    <th>Permission Slug</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>creaeted</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @if (isset($planPermission) && count($planPermission) > 0)
                    @foreach ($planPermission as $permission)
                        <tr>
                            <td class="text-center">
                                {{ $loop->iteration + ($planPermission->currentPage() - 1) * $planPermission->perPage() }}
                            </td>
                            <td>
                                <div class="customer-info">

                                    <div class="customer-details">
                                        <span class="customer-name">{{ $permission->permission_name }}</span>

                                    </div>
                                </div>
                            </td>
                            <td class="text-center">{{ $permission->slug  ?? ''}}</td>
                            <td class="text-center">{{ $permission->description }}</td>
                            <td class="text-center">
                                <span class="px-2 py-1 text-xs font-semibold rounded-full 
                                    {{ $permission->is_active == 1 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700' }}">
                                        
                                    {{ $permission->is_active == 1 ? 'Active' : 'Inactive' }}

                                </span>
                            </td>
                            <td class="text-center">
                                {{ $permission->created_at->format('M d, Y h:i A') }}
                            </td>
                            <td class="text-center">
                                <div class="action-buttons">
                                    
                                    <a href="{{route('admin.plan-permission.edit', $permission->id)}}">
                                        <button class="action-btn" 
                                            title="Edit">
                                            <svg viewBox="0 0 24 24">
                                                <path
                                                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                                            </svg>
                                        </button></a>
                                </div>
                            </td>
                        </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 48px; color: #94a3b8;">
                            No Plan Permissions found.
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>
        <div class="pagination flex justify-end mt-4">
            {{ $planPermission->links('pagination::tailwind') }}
        </div>
    </div>
    </div>
    </div>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
</script>

{{-- SUCCESS --}}
@if(session('success'))
<script>
    Toast.fire({
        icon: 'success',
        title: "{{ session('success') }}"
    });
</script>
@endif

{{-- ERROR --}}
@if(session('error'))
<script>
    Toast.fire({
        icon: 'error',
        title: "{{ session('error') }}"
    });
</script>
@endif

{{-- VALIDATION ERROR --}}
@if ($errors->any())
<script>
    Toast.fire({
        icon: 'error',
        title: `{!! implode('<br>', $errors->all()) !!}`
    });
</script>
@endif

@endsection
