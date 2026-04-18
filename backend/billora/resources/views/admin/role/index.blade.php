@extends('admin.main-layout')
@section('title', 'All Roles')
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
        padding: 0px 0px;
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

    .delete-btn {
        background: #fef2f2;
    }

    .delete-btn svg {
        fill: #ef4444;
    }

    .delete-btn:hover {
        background: #ef4444;
    }

    .delete-btn:hover svg {
        fill: white;
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

    /* Success Message */
    .success-message {
        background: #d1fae5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        border-radius: 12px;
        padding: 12px 20px;
        margin: 20px 28px;
    }

    @media (max-width: 1024px) {
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }
        .search-wrapper {
            width: 100%;
        }
    }

    @media (max-width: 768px) {
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
        .success-message {
            margin: 16px;
        }
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Role Management</h1>
                <p>Manage user roles and permissions</p>
            </div>
            <div style="display: flex; gap: 12px;">
                <div class="search-wrapper">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <form method="GET" action="#" style="flex: 1;">
                        <input type="text" name="search" placeholder="Search roles..." value="{{ request('search') }}">
                    </form>
                    @if(request('search'))
                        <button type="button" onclick="clearSearch()" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#94a3b8">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    @endif
                </div>
                <a href="{{ route('admin.roles.create') }}" class="btn btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add Role
                </a>
            </div>
        </div>

        <!-- Success Message -->
        @if(session('success'))
            <div class="success-message">
                {{ session('success') }}
            </div>
        @endif

        <!-- Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px;">Sl. No</th>
                        <th>Role Name</th>
                        <th>Created At</th>
                        <th style="width: 100px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($roles as $role)
                        <tr>
                            <td>{{ $loop->iteration + ($roles->currentPage() - 1) * $roles->perPage() }}</td>
                            <td><span style="font-weight: 600; color: #1e293b;">{{ $role->name ?? '' }}</span></td>
                            <td>{{ $role->created_at->format('M d, Y h:i A') }}</td>
                            <td>
                                <div class="action-buttons">
                                    <a href="{{ route('admin.roles.edit', $role->id) }}">
                                        <button class="action-btn" title="Edit Role">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/>
                                            </svg>
                                        </button>
                                    </a>
                                    <button class="action-btn delete-btn" title="Delete Role" onclick="deleteRole({{ $role->id }})">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        </svg>
                                    </button>
                                    <form id="delete-form-{{ $role->id }}" action="#" method="POST" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="empty-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                                </svg>
                                <p>No roles found</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($roles->hasPages())
        <div class="pagination">
            {{ $roles->links('pagination::tailwind') }}
        </div>
        @endif
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    function clearSearch() {
        const form = document.querySelector('.search-wrapper form');
        if (form) {
            const input = form.querySelector('input[name="search"]');
            if (input) input.value = '';
            form.submit();
        }
    }

    function deleteRole(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "This role will be deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: 'white',
            backdrop: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Add your delete route here
                alert('Delete functionality - Add route in web.php');
            }
        });
    }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection