@extends('admin.main-layout')
@section('title', 'Business Types')
@section('content')
    <style>
        /* Modern fade-in animation */
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

        /* Fix sidebar overlap - INCREASED WIDTH */
        .main-content {
            margin-left: 0;
            width: 100%;
            max-width: 100%;
        }
        
        /* Container for better width control */
        .content-container {
            max-width: 100%;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        /* Make tables use full width */
        .full-width-table {
            width: 100%;
            min-width: 100%;
        }
        
        /* Stats cards - better distribution */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
        }
        
        /* Modern card hover effects */
        .stat-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        }

        /* Table row hover enhancement */
        .data-table tbody tr {
            transition: background-color 0.2s ease;
        }

        /* Status badge styling */
        .status-badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            line-height: 1.25;
        }

        /* Action buttons container */
        .action-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        /* Modern scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
        
        /* Remove any margin constraints */
        body {
            overflow-x: hidden;
        }
        
        /* Make header full width */
        .full-width-header {
            width: 100%;
        }
        
        /* Table container for better scrolling */
        .table-wrapper {
            overflow-x: auto;
            width: 100%;
        }
        
        /* Responsive adjustments */
        @media (min-width: 1280px) {
            .content-container {
                padding-left: 2rem;
                padding-right: 2rem;
            }
        }
        
        @media (min-width: 1536px) {
            .content-container {
                padding-left: 2.5rem;
                padding-right: 2.5rem;
            }
        }
        
        /* Larger table cells for better readability */
        .data-table th,
        .data-table td {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
        }
        
        /* Compact but readable text */
        .text-compact {
            font-size: 0.875rem;
        }
        
        /* Hide avatar completely - for any avatar elements */
        .avatar-hidden {
            display: none !important;
        }
        
        /* Hide any avatar/profile images in header/top bar */
        .user-avatar,
        .profile-image,
        .avatar-circle,
        [class*="UserAvatar"],
        [class*="user-avatar"],
        img[alt*="avatar"],
        img[alt*="profile"],
        .rounded-full.w-8,
        .w-8.h-8.rounded-full,
        .flex.items-center .w-8.h-8 {
            display: none !important;
        }
        
        /* Hide the small blue box (initials icon) in table */
        .business-initials-box {
            display: none !important;
        }
        
        /* Red trash button styling */
        .trash-button {
            background-color: #dc2626 !important;
            color: white !important;
        }
        
        .trash-button:hover {
            background-color: #b91c1c !important;
        }
        
        /* White header styling */
        .white-header {
            background: white !important;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
        }
        
        .white-header h1 {
            color: #1f2937 !important;
        }
        
        .white-header p {
            color: #6b7280 !important;
        }
        
        /* Remove the blue initials box from table completely */
        .initials-box {
            display: none;
        }
        
        /* Adjust name column to remove left padding from hidden box */
        .business-name {
            margin-left: 0 !important;
        }
    </style>

    <div class="flex h-screen bg-gray-50">
        <!-- Include Sidebar -->

        <!-- Main Content - FULL WIDTH -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Modern Header with WHITE background - NO GRADIENT -->
            <header class="white-header bg-white shadow-sm border-b border-gray-200 w-full">
                <div class="content-container py-5">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Business Types</h1>
                            <p class="text-gray-500 text-sm mt-1">Manage and organize your business categories</p>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Trashed Link - RED BUTTON -->
                            <a href="#">
                                <button
                                    class="trash-button bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center transition duration-200 shadow-sm">
                                    <i data-feather="trash" class="w-4 h-4 mr-2"></i>
                                    Trashed Business Types
                                </button>
                            </a>
                            <!-- Add Business Type Button -->
                            <a href="{{ route('admin.business-types.create') }}">
                                <button
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl flex items-center transition duration-200 shadow-md font-medium">
                                    <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                    Add Business Type
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Success Messages with modern styling -->
            @if (session('success'))
                <div class="content-container mt-6">
                    <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-sm fade-in flex items-center">
                        <i data-feather="check-circle" class="w-5 h-5 mr-2 text-green-500"></i>
                        {{ session('success') }}
                    </div>
                </div>
            @endif

            <!-- Stats Cards Grid - FULL WIDTH -->
            <div class="content-container pt-6">
                <div class="stats-grid">
                    <!-- Total Business Types -->
                    <div class="stat-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Business Types</p>
                                    <p class="text-3xl font-bold text-gray-800 mt-2">{{ $total_business_types ?? 0 }}</p>
                                </div>
                                <div class="p-3 bg-blue-100 rounded-xl">
                                    <i data-feather="layers" class="w-6 h-6 text-blue-600"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="w-full bg-gray-200 rounded-full h-1.5">
                                    <div class="bg-blue-500 h-1.5 rounded-full" style="width: 100%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Active Business Types -->
                    <div class="stat-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Business Types</p>
                                    <p class="text-3xl font-bold text-green-600 mt-2">{{ $active_business_types ?? 0 }}</p>
                                </div>
                                <div class="p-3 bg-green-100 rounded-xl">
                                    <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
                                </div>
                            </div>
                            <div class="mt-4">
                                <div class="w-full bg-gray-200 rounded-full h-1.5">
                                    <div class="bg-green-500 h-1.5 rounded-full" style="width: {{ $total_business_types > 0 ? ($active_business_types / $total_business_types) * 100 : 0 }}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Inactive Business Types (Clickable) -->
                    <a href="#" class="block">
                        <div class="stat-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-red-200 transition-all">
                            <div class="p-6">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Inactive Business Types</p>
                                        <p class="text-3xl font-bold text-red-600 mt-2">{{ $inactive_business_types ?? 0 }}</p>
                                    </div>
                                    <div class="p-3 bg-red-100 rounded-xl">
                                        <i data-feather="pause-circle" class="w-6 h-6 text-red-600"></i>
                                    </div>
                                </div>
                                <div class="mt-4">
                                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                                        <div class="bg-red-500 h-1.5 rounded-full" style="width: {{ $total_business_types > 0 ? ($inactive_business_types / $total_business_types) * 100 : 0 }}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Business Types Table - FULL WIDTH -->
            <div class="content-container pb-6 mt-6">
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div class="flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-800">All Business Types</h2>
                            <div class="text-sm text-gray-500">
                                Total: <span class="font-medium text-gray-700">{{ $business_types->total() ?? 0 }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="data-table w-full">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-100">
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Sl. No
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Slug
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-100">
                                @forelse ($business_types as $business)
                                    <tr class="hover:bg-gray-50/50 transition duration-150 ease-out">
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-sm font-medium text-gray-500">{{ $loop->iteration }}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <!-- Removed the blue initials box completely -->
                                            <span class="text-sm font-medium text-gray-900">{{ $business->name ?? '' }}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <code class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{{ $business->slug ?? '' }}</code>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            @if($business->is_active)
                                                <span class="status-badge bg-green-100 text-green-700">
                                                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                    Active
                                                </span>
                                            @else
                                                <span class="status-badge bg-red-100 text-red-700">
                                                    <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                                                    Inactive
                                                </span>
                                            @endif
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="text-sm text-gray-500">
                                                {{ $business->created_at->format('d-m-Y') ?? '' }}
                                            </div>
                                            <div class="text-xs text-gray-400">
                                                {{ $business->created_at->format('h:i A') ?? '' }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="action-buttons">
                                                <a href="{{ route('admin.business-types.edit', $business->id) }}" 
                                                   class="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded hover:bg-blue-50">
                                                    <i data-feather="edit-2" class="w-4 h-4"></i>
                                                </a>
                                                <button onclick="confirmDelete({{ $business->id }})"
                                                    class="text-gray-500 hover:text-red-600 transition-colors duration-200 p-1 rounded hover:bg-red-50">
                                                    <i data-feather="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </div>

                                            <form id="delete-form-{{ $business->id }}"
                                                action="{{ route('admin.business-types.delete', $business->id) }}"
                                                method="POST" style="display:none;">
                                                @csrf
                                                @method('DELETE')
                                            </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="6" class="px-6 py-12 text-center">
                                            <div class="flex flex-col items-center justify-center">
                                                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <i data-feather="inbox" class="w-8 h-8 text-gray-400"></i>
                                                </div>
                                                <h3 class="text-lg font-medium text-gray-900">No business types found</h3>
                                                <p class="text-sm text-gray-500 mt-1">Get started by creating your first business type.</p>
                                                <a href="{{ route('admin.business-types.create') }}" class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                                                    <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                                    Add Business Type
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination with modern styling -->
                    @if($business_types->hasPages())
                        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                            {{ $business_types->links('pagination::tailwind') }}
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div id="permanentDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div class="bg-white rounded-xl shadow-xl w-96 transform transition-all">
            <div class="p-6">
                <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <i data-feather="alert-triangle" class="w-6 h-6 text-red-600"></i>
                </div>
                <h2 class="text-lg font-semibold text-center text-gray-900 mb-2">Delete Plan</h2>
                <p class="text-sm text-gray-500 text-center mb-6">
                    Are you sure you want to delete this plan? This action cannot be undone.
                </p>
                <div class="flex justify-end gap-3">
                    <button onclick="closePermanentDeleteModal()" 
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200">
                        Cancel
                    </button>
                    <button id="confirmPermanentDeleteBtn" 
                            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200">
                        Yes, Delete
                    </button>
                </div>
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
        function confirmDelete(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2563EB',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                background: '#fff',
                backdrop: true,
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form-' + id).submit();
                }
            });
        }

        function closePermanentDeleteModal() {
            document.getElementById('permanentDeleteModal').classList.add('hidden');
        }
    </script>
@endsection