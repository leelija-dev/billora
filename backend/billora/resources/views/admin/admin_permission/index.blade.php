@extends('admin.main-layout')
@section('title','All Permissions')
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

        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }

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

        /* Main Content */
        .main-content {
            padding: 0px 0px;
            width: 100%;
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 16px 20px;
            }
        }

        /* Header */
        header {
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
            border: 1px solid #eef2f6;
            border-radius: 0;
        }

        header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            letter-spacing: -0.3px;
        }

        /* Buttons */
        button, a button {
            padding: 8px 20px;
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

        .bg-red-600 {
            background: #ef4444;
            color: white;
        }

        .bg-red-600:hover {
            background: #dc2626;
            transform: translateY(-1px);
        }

        .bg-blue-600 {
            background: #2563eb;
            color: white;
        }

        .bg-blue-600:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }

        /* Search Input */
        .search-input {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            transition: all 0.2s;
        }

        .search-input:focus-within {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .search-input input {
            border: none;
            outline: none;
            font-size: 14px;
            padding: 8px 0;
            flex: 1;
        }

        .search-input i {
            color: #94a3b8;
            width: 16px;
            height: 16px;
        }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
            border-left: 4px solid;
        }

        .stat-card:hover {
            background: #f1f5f9;
        }

        .stat-card.border-blue-500 {
            border-left-color: #2563eb;
        }

        .stat-card.border-green-500 {
            border-left-color: #16a34a;
        }

        .stat-card.border-yellow-500 {
            border-left-color: #eab308;
        }

        .stat-card.border-red-500 {
            border-left-color: #dc2626;
        }

        .stat-info p:first-child {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .stat-info p:last-child {
            font-size: 28px;
            font-weight: 800;
        }

        .stat-info p.text-blue-600 {
            color: #2563eb;
        }

        .stat-info p.text-green-600 {
            color: #16a34a;
        }

        .stat-info p.text-yellow-600 {
            color: #ca8a04;
        }

        .stat-info p.text-red-600 {
            color: #dc2626;
        }

        /* Table Container */
        .table-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
            border: 1px solid #eef2f6;
            margin: 24px 28px;
            overflow: hidden;
        }

        .table-header {
            padding: 24px 28px;
            border-bottom: 1px solid #eef2f6;
        }

        .table-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: #1e293b;
            margin: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: #f8fafc;
            border-bottom: 1px solid #eef2f6;
        }

        th {
            text-align: left;
            padding: 14px 20px;
            font-size: 12px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 16px 20px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
            color: #334155;
        }

        tbody tr:hover td {
            background: #fafcff;
        }

        /* Action Buttons */
        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .action-buttons button {
            padding: 6px 10px;
            background: #f1f5f9;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: none;
        }

        .action-buttons button i {
            width: 16px;
            height: 16px;
            color: #64748b;
        }

        .action-buttons button:hover {
            background: #2563eb;
        }

        .action-buttons button:hover i {
            color: white;
        }

        .action-buttons button.delete-btn {
            background: #fef2f2;
        }

        .action-buttons button.delete-btn i {
            color: #ef4444;
        }

        .action-buttons button.delete-btn:hover {
            background: #ef4444;
        }

        .action-buttons button.delete-btn:hover i {
            color: white;
        }

        /* Success Message */
        .success-message {
            background: #d1fae5;
            border: 1px solid #a7f3d0;
            color: #065f46;
            border-radius: 12px;
            padding: 12px 20px;
            margin: 20px 28px 0 28px;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 60px 20px;
        }

        .empty-state i {
            color: #cbd5e1;
            margin-bottom: 16px;
        }

        .empty-state h3 {
            color: #1e293b;
            font-size: 14px;
            margin-top: 12px;
        }

        /* Pagination */
        .pagination-container {
            display: flex;
            justify-content: flex-end;
            padding: 16px 28px;
            border-top: 1px solid #eef2f6;
        }

        /* Modal */
        #permanentDeleteModal {
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }

        #permanentDeleteModal > div {
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 1024px) {
            .stats-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .table-container,
            .table-header {
                margin: 16px;
            }

            th, td {
                padding: 12px;
                font-size: 12px;
            }

            .action-buttons {
                flex-direction: column;
            }

            header {
                padding: 12px 16px;
            }

            header h1 {
                font-size: 20px;
            }
        }
    </style>

    <div class="main-content">
        <!-- Top Header -->
        <header>
            <div class="px-6 py-5">
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1>Permission Management</h1>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <!-- Search -->
                        <div class="search-input">
                            <form method="GET" action="{{ route('admin.permissions.index') }}" style="display: flex; align-items: center; width: 100%; gap: 8px;">
                                <i data-feather="search"></i>
                                <input type="text" name="search" value="{{ request('search') }}" placeholder="Search permissions...">
                                @if(request('search'))
                                    <button type="button" onclick="clearSearch()" style="background: none; border: none; cursor: pointer; padding: 0;">
                                        <i data-feather="x"></i>
                                    </button>
                                @endif
                            </form>
                        </div>

                        <a href="#"><button class="bg-red-600">
                                <i data-feather="trash"></i>
                                Trashed
                            </button></a>
                        <!-- Add Permission Button -->
                        <a href="{{ route('admin.permissions.create') }}"><button class="bg-blue-600">
                                <i data-feather="plus"></i>
                                Add Permission
                            </button></a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Success Messages -->
        @if(session('success'))
            <div class="success-message fade-in">
                {{ session('success') }}
            </div>
        @endif

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card border-blue-500">
                <div class="stat-info">
                    <p class="text-blue-600"><strong>Total Permissions</strong></p>
                    <p class="text-blue-600">{{ $totalPermissions ?? 0 }}</p>
                </div>
                <div class="p-3 rounded-full" style="background: #dbeafe;">
                    <i data-feather="layers"></i>
                </div>
            </div>

            <div class="stat-card border-green-500">
                <div class="stat-info">
                    <p class="text-green-600"><strong>Active Permissions</strong></p>
                    <p class="text-green-600">{{ $activePermissions ?? 0 }}</p>
                </div>
                <div class="p-3 rounded-full" style="background: #dcfce7;">
                    <i data-feather="check-circle"></i>
                </div>
            </div>

            <div class="stat-card border-yellow-500">
                <div class="stat-info">
                    <p class="text-yellow-600"><strong>Inactive Permissions</strong></p>
                    <p class="text-yellow-600">{{ $inactivePermissions ?? 0 }}</p>
                </div>
                <div class="p-3 rounded-full" style="background: #fef08a;">
                    <i data-feather="pause-circle"></i>
                </div>
            </div>

            <a href="#">
                <div class="stat-card border-red-500">
                    <div class="stat-info">
                        <p class="text-red-600"><strong>Deleted Permissions</strong></p>
                        <p class="text-red-600">{{ $deletedPlans ?? 0 }}</p>
                    </div>
                    <div class="p-3 rounded-full" style="background: #fee2e2;">
                        <i data-feather="trash-2"></i>
                    </div>
                </div>
            </a>
        </div>

        <!-- Permissions Table -->
        <div class="table-container">
            <div class="table-header">
                <h2>All Permissions</h2>
            </div>

            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th>Permission Name</th>
                            <th>Created At</th>
                            <th style="width: 100px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($permissions as $permission)
                            <tr>
                                <td>
                                    {{ $loop->iteration + ($permissions->currentPage() - 1) * $permissions->perPage() }}
                                </td>
                                <td>
                                    {{ $permission->name ?? '' }}
                                </td>
                                <td>
                                    {{ $permission->created_at->format('M d, Y h:i A') }}
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <a href="{{ route('admin.permissions.edit', $permission->id) }}">
                                            <button>
                                                <i data-feather="edit-2"></i>
                                            </button>
                                        </a>
                                        <button class="delete-btn" onclick="deletePermission({{ $permission->id }})">
                                            <i data-feather="trash-2"></i>
                                        </button>
                                    </div>
                                    <!-- Delete Form -->
                                    <form id="delete-form-{{ $permission->id }}" method="POST" action="{{ route('admin.permissions.destroy', $permission->id) }}" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" style="padding: 40px 20px;">
                                    <div class="empty-state">
                                        <i data-feather="inbox"></i>
                                        <h3>No permissions found</h3>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="pagination-container">
                {{ $permissions->links('pagination::tailwind') }}
            </div>
        </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div id="permanentDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-lg font-semibold mb-4">Delete Permission</h2>
            <p class="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this permission?
            </p>
            <div class="flex justify-end gap-3">
                <button onclick="closePermanentDeleteModal()" class="px-4 py-2 bg-gray-200 rounded">
                    Cancel
                </button>
                <button id="confirmPermanentDeleteBtn" class="px-4 py-2 bg-red-600 text-white rounded">
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Initialize Feather Icons -->
    <script>
        feather.replace();
    </script>

    <!-- JavaScript for Actions -->
    <script>
        function deletePermission(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "This permission will be deleted!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form-' + id).submit();
                }
            });
        }

        function clearSearch() {
            window.location.href = "{{ route('admin.permissions.index') }}";
        }
    </script>
@endsection