@extends('admin.main-layout')
@section('title', 'Admin Users')
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

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

        /* Avatar */
        img.avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            display: block;
            border: 1px solid #e2e8f0;
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

            img.avatar {
                width: 32px;
                height: 32px;
            }
        }
    </style>

    <div class="main-content">
        <!-- Top Header -->
        <header>
            <div class="px-6 py-5">
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1>User Management</h1>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-3">
                        <a href="#"><button class="bg-red-600">
                                <i data-feather="trash"></i>
                                Trashed User
                            </button></a>
                        <!-- Add User Button -->
                        <a href="{{ route('admin.admin-users.create') }}"><button class="bg-blue-600">
                                <i data-feather="plus"></i>
                                Add User
                            </button></a>
                    </div>
                </div>
            </div>
        </header>

        <!-- Success Messages -->
        @if (session('success'))
            <div class="success-message fade-in">
                {{ session('success') }}
            </div>
        @endif

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card border-blue-500">
                <div class="stat-info">
                    <p class="text-blue-600"><strong>Total Users</strong></p>
                    <p class="text-blue-600">{{ $totalUser ?? 0 }}</p>
                </div>
                <div class="p-3 rounded-full" style="background: #dbeafe;">
                    <i data-feather="layers"></i>
                </div>
            </div>

            <div class="stat-card border-green-500">
                <div class="stat-info">
                    <p class="text-green-600"><strong>Active Users</strong></p>
                    <p class="text-green-600">{{ $totalUser ?? 0 }}</p>
                </div>
                <div class="p-3 rounded-full" style="background: #dcfce7;">
                    <i data-feather="check-circle"></i>
                </div>
            </div>

            <a href="#">
                <div class="stat-card border-red-500">
                    <div class="stat-info">
                        <p class="text-red-600"><strong>Deleted Users</strong></p>
                        <p class="text-red-600">0</p>
                    </div>
                    <div class="p-3 rounded-full" style="background: #fee2e2;">
                        <i data-feather="trash-2"></i>
                    </div>
                </div>
            </a>
        </div>

        <!-- Users Table -->
        <div class="table-container">
            <div class="table-header">
                <h2>All Users</h2>
            </div>

            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 60px;"></th>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Last login</th>
                            <th>Created</th>
                            <th style="width: 100px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        @forelse ($users as $user)
                            <tr>
                                <td style="text-align: center;">
                                    <img src="{{ $user->image ? asset($user->image) : asset('uploads/default.png') }}"
                                        alt="User Image" class="avatar">
                                </td>
                                <td>
                                    <strong>{{ $user->username }}</strong>
                                </td>
                                <td>{{ $user->email }}</td>
                                <td>
                                     {{ $user->fname ?? '' }} {{ $user->lname ?? '' }}
                                </td>
                                <td>
                                    @foreach ($user->roles as $role)
                                        {{ $role->name }}@if (!$loop->last)
                                            ,
                                        @endif
                                    @endforeach
                                </td>
                                <td>
                                    {{ $user->last_login_at ? $user->last_login_at->format('d-m-Y h:i A') : '' }}
                                </td>
                                <td>
                                    {{ $user->created_at->format('d-m-Y h:i A') }}
                                </td>
                                <td>
                                    <div class="action-buttons">
                                         <a href="{{route('admin.admin-users.show-password', $user->id)}}"> <button>
                                                <i data-feather="edit"></i>
                                            </button>
                                         </a>
                                        <a href="{{ route('admin.admin-users.edit', $user->id) }}">
                                            <button>
                                                <i data-feather="eye"></i>
                                            </button>
                                        </a>
                                        <a href="#">
                                            <button class="delete-btn" onclick="deleteUser({{ $user->id }})">
                                                <i data-feather="trash-2"></i>
                                            </button>
                                        </a>
                                    </div>
                                    <!-- Delete Form -->
                                    <form id="delete-form-{{ $user->id }}" method="POST" action="{{ route('admin.admin-users.destroy', $user->id) }}" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" style="padding: 40px 20px;">
                                    <div class="empty-state">
                                        <i data-feather="inbox"></i>
                                        <h3>No admin user found</h3>
                                    </div>
                                </td>
                            </tr>
                        @endforelse

                        </tbody>
                    </table>
                </div>
                <div class="pagination-container">
                    {{ $users->links('pagination::tailwind') }}
                </div>
            </div>
        </div>
        <!-- Permanent Delete Confirmation Modal -->
        <div id="permanentDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">

            <div class="bg-white p-6 rounded-lg w-96">
                <h2 class="text-lg font-semibold mb-4">Delete User</h2>

                <p class="text-sm text-gray-600 mb-6">
                    Are you sure you want to delete this user?
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
            function deleteUser(id) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This user will be deleted!",
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
        </script>
    @endsection
