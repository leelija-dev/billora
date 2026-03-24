<!-- resources/views/admin/plans/deleted.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billora - Deleted Plans</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <style>
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .restore-animation {
            animation: restorePulse 0.5s ease-in-out;
        }
        @keyframes restorePulse {
            0% { background-color: #f3f4f6; }
            50% { background-color: #10b98120; }
            100% { background-color: #f3f4f6; }
        }

        /* Fix sidebar overlap */
        .main-content {
            margin-left: 3rem; /* 256px */
        }
        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* Modal animations */
        .modal-enter {
            animation: modalEnter 0.3s ease-out;
        }
        @keyframes modalEnter {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-10px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
    </style>
</head>

<body class="bg-gray-50 font-sans antialiased">
    <div class="flex h-screen overflow-hidden">
        <!-- Include Sidebar -->
        @include('admin.sidebar')
        
        <!-- Main Content -->
        <div class="main-content flex-1 flex flex-col overflow-hidden">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div class="px-6 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="flex items-center space-x-3">
                                <h1 class="text-2xl font-bold text-gray-800">Deleted Plans</h1>
                                <span class="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                    Trash
                                </span>
                            </div>
                            <p class="text-sm text-gray-600 mt-1">Manage and recover permanently deleted subscription plans</p>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->
                            <div class="relative">
                                <form method="GET" action="{{ route('admin.plans.deleted') }}">
                                    <input type="text" 
                                        name="search"
                                        value="{{ request('search') }}"
                                        placeholder="Search deleted plans..." 
                                        class="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent w-64">
                                    <i data-feather="search" class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"></i>
                                    
                                    @if(request('search'))
                                        <button type="button" 
                                                onclick="clearSearch()" 
                                                class="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                                            <i data-feather="x" class="w-4 h-4"></i>
                                        </button>
                                    @endif
                                </form>
                            </div>
                            
                            <!-- Back to Plans Button -->
                            <a href="{{ route('admin.plans.index') }}" 
                               class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200 text-sm">
                                <i data-feather="arrow-left" class="w-4 h-4 mr-2"></i>
                                Back to Plans
                            </a>
                            
                            <!-- Empty Trash Button -->
                            @if($plans->count() > 0)
                                <button onclick="confirmEmptyTrash()" 
                                        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200 text-sm">
                                    <i data-feather="trash-2" class="w-4 h-4 mr-2"></i>
                                    Empty Trash
                                </button>
                            @endif
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content Area with Scrolling -->
            <div class="flex-1 overflow-y-auto">
                <!-- Success/Error Messages -->
                @if(session('success'))
                    <div class="mx-6 mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg fade-in flex items-center justify-between">
                        <div class="flex items-center">
                            <i data-feather="check-circle" class="w-5 h-5 mr-2 text-green-700"></i>
                            <span>{{ session('success') }}</span>
                        </div>
                        <button onclick="this.parentElement.remove()" class="text-green-700 hover:text-green-900">
                            <i data-feather="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                @endif

                @if(session('error'))
                    <div class="mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg fade-in flex items-center justify-between">
                        <div class="flex items-center">
                            <i data-feather="alert-circle" class="w-5 h-5 mr-2 text-red-700"></i>
                            <span>{{ session('error') }}</span>
                        </div>
                        <button onclick="this.parentElement.remove()" class="text-red-700 hover:text-red-900">
                            <i data-feather="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                @endif

                <!-- Stats Cards -->
                <div class="px-6 py-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 hover:shadow-md transition">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-gray-600">Total Deleted</p>
                                    <p class="text-2xl font-bold text-gray-800">{{ $plans->total() ?? $plans->count() }}</p>
                                    <p class="text-xs text-gray-500 mt-1">All time</p>
                                </div>
                                <div class="p-3 bg-red-100 rounded-full">
                                    <i data-feather="trash-2" class="w-6 h-6 text-red-600"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-gray-600">This Month</p>
                                    <p class="text-2xl font-bold text-gray-800">{{ $plans->where('deleted_at', '>=', now()->subMonth())->count() }}</p>
                                    <p class="text-xs text-gray-500 mt-1">Last 30 days</p>
                                </div>
                                <div class="p-3 bg-purple-100 rounded-full">
                                    <i data-feather="calendar" class="w-6 h-6 text-purple-600"></i>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-gray-600">Recoverable</p>
                                    <p class="text-2xl font-bold text-gray-800">{{ $plans->count() }}</p>
                                    <p class="text-xs text-gray-500 mt-1">Can be restored</p>
                                </div>
                                <div class="p-3 bg-green-100 rounded-full">
                                    <i data-feather="refresh-cw" class="w-6 h-6 text-green-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Deleted Plans Table -->
                <div class="px-6 pb-6">
                    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 class="text-lg font-semibold text-gray-800">Deleted Plans List</h2>
                            <span class="text-sm text-gray-500">
                                Showing {{ $plans->firstItem() ?? 0 }} - {{ $plans->lastItem() ?? 0 }} of {{ $plans->total() ?? $plans->count() }} items
                            </span>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Details</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted By</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deleted At</th>
                                        
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    @forelse ($plans ?? [] as $plan)
                                        <tr class="hover:bg-gray-50 transition duration-150 group">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0 h-10 w-10">
                                                        <div class="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                            <span class="text-red-600 font-medium text-sm">{{ substr($plan->name, 0, 1) }}</span>
                                                        </div>
                                                    </div>
                                                    <div class="ml-4">
                                                        <div class="text-sm font-medium text-gray-900">{{ $plan->name }}</div>
                                                        <div class="text-xs text-gray-500">{{ Str::limit($plan->description ?? 'No description', 50) }}</div>
                                                        @if($plan->features)
                                                            <div class="flex mt-1 space-x-1">
                                                                @foreach(array_slice($plan->features, 0, 2) as $feature)
                                                                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                        {{ $feature }}
                                                                    </span>
                                                                @endforeach
                                                                @if(count($plan->features) > 2)
                                                                    <span class="text-xs text-gray-500">+{{ count($plan->features) - 2 }} more</span>
                                                                @endif
                                                            </div>
                                                        @endif
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="text-sm font-semibold text-gray-900 line-through text-red-500">
                                                    {{ config('app.app_currency') }}{{ number_format($plan->price, 2) }}
                                                </span>
                                                @if($plan->compare_at_price)
                                                    <span class="text-xs text-gray-500 block">Was: {{ config('app.app_currency') }}{{ number_format($plan->compare_at_price, 2) }}</span>
                                                @endif
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    {{ $plan->duration_days ?? '0' }} days
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{{ $plan->deleted_by ?? 'System' }}</div>
                                                <div class="text-xs text-gray-500">ID: {{ $plan->deleted_by_id ?? 'N/A' }}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{{ $plan->created_at->format('M d, Y') }}</div>
                                                <div class="text-xs text-gray-500">{{ $plan->created_at->format('h:i A') }}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm text-gray-900">{{ $plan->deleted_at->format('M d, Y') }}</div>
                                                <div class="text-xs text-gray-500">{{ $plan->deleted_at->format('h:i A') }}</div>
                                            </td>
                                            
                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div class="flex items-center space-x-4">
                                                    <!-- Restore Button -->
                                                    <button onclick="restorePlan({{ $plan->id }})" 
                                                            class="text-green-600 hover:text-white bg-green-50 hover:bg-green-600 p-2 rounded-lg transition duration-200 group/btn"
                                                            title="Restore Plan">
                                                        <i data-feather="refresh-cw" class="w-4 h-4 group-hover/btn:text-white"></i>
                                                    </button>
                                                    
                                                    <!-- View Details Button -->
                                                   <a href="{{route('admin.plans.show', $plan->id)}}"><button 
                                                            class="text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 p-2 rounded-lg transition duration-200 group/btn"
                                                            title="View Details">
                                                        <i data-feather="eye" class="w-4 h-4 group-hover/btn:text-white"></i>
                                                    </button>
                                                   </a>
                                                    <!-- Permanent Delete Button -->
                                                    <button onclick="confirmPermanentDelete({{ $plan->id }})" 
                                                            class="text-red-600 hover:text-white bg-red-50 hover:bg-red-600 p-2 rounded-lg transition duration-200 group/btn"
                                                            title="Delete Permanently">
                                                        <i data-feather="trash-2" class="w-4 h-4 group-hover/btn:text-white"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="7" class="px-6 py-12 text-center">
                                                <div class="flex flex-col items-center justify-center">
                                                    <div class="bg-gray-100 rounded-full p-4 mb-4">
                                                        <i data-feather="trash-2" class="h-8 w-8 text-gray-400"></i>
                                                    </div>
                                                    <h3 class="text-lg font-medium text-gray-900 mb-1">Trash is empty</h3>
                                                    <p class="text-sm text-gray-500 mb-4">No deleted plans found in the trash.</p>
                                                    <a href="{{ route('admin.plans.index') }}" 
                                                       class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition duration-200">
                                                        <i data-feather="arrow-left" class="w-4 h-4 mr-2"></i>
                                                        Back to Active Plans
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        @if($plans->hasPages())
                            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                {{ $plans->links('pagination::tailwind') }}
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Information Banner -->
                <div class="px-6 pb-6">
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <i data-feather="info" class="h-5 w-5 text-blue-400 mt-0.5"></i>
                            </div>
                            <div class="ml-3 flex-1">
                                <h3 class="text-sm font-medium text-blue-800">About Deleted Plans</h3>
                                <div class="mt-2 text-sm text-blue-700">
                                    <ul class="list-disc list-inside space-y-1">
                                        <li>Deleted plans are moved to trash and can be restored at any time</li>
                                        <li>Plans in trash do not affect active subscriptions</li>
                                        <li>Restoring a plan will make it available for new subscriptions</li>
                                        <li>Permanently deleted plans cannot be recovered</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Restore Confirmation Modal -->
    <div id="restoreModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50" style="backdrop-filter: blur(4px);">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-xl bg-white modal-enter">
            <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <i data-feather="refresh-cw" class="h-8 w-8 text-green-600"></i>
                </div>
                <h3 class="text-lg leading-6 font-semibold text-gray-900 mb-2">Restore Plan</h3>
                <div class="mt-2 px-4">
                    <p class="text-sm text-gray-500">
                        Are you sure you want to restore this plan? It will become active again and available for new subscriptions.
                    </p>
                </div>
                <div class="flex justify-center space-x-3 px-4 py-4 mt-4">
                    <button onclick="closeRestoreModal()" 
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200">
                        Cancel
                    </button>
                    <button id="confirmRestoreBtn" 
                            class="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200">
                        Restore Plan
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div id="permanentDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50" style="backdrop-filter: blur(4px);">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-xl bg-white modal-enter">
            <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <i data-feather="alert-triangle" class="h-8 w-8 text-red-600"></i>
                </div>
                <h3 class="text-lg leading-6 font-semibold text-gray-900 mb-2">Permanently Delete Plan</h3>
                <div class="mt-2 px-4">
                    <p class="text-sm text-gray-500">
                        This action cannot be undone. The plan will be permanently deleted from the system and cannot be recovered.
                    </p>
                    <p class="text-sm font-medium text-red-600 mt-2">
                        Are you absolutely sure?
                    </p>
                </div>
                <div class="flex justify-center space-x-3 px-4 py-4 mt-4">
                    <button onclick="closePermanentDeleteModal()" 
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200">
                        Cancel
                    </button>
                    <button id="confirmPermanentDeleteBtn" 
                            class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200">
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Empty Trash Confirmation Modal -->
    <div id="emptyTrashModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50" style="backdrop-filter: blur(4px);">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-2xl rounded-xl bg-white modal-enter">
            <div class="mt-3 text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <i data-feather="trash-2" class="h-8 w-8 text-red-600"></i>
                </div>
                <h3 class="text-lg leading-6 font-semibold text-gray-900 mb-2">Empty Trash</h3>
                <div class="mt-2 px-4">
                    <p class="text-sm text-gray-500">
                        Are you sure you want to permanently delete all {{ $plans->count() }} plans in trash? This action cannot be undone.
                    </p>
                </div>
                <div class="flex justify-center space-x-3 px-4 py-4 mt-4">
                    <button onclick="closeEmptyTrashModal()" 
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200">
                        Cancel
                    </button>
                    <button id="confirmEmptyTrashBtn" 
                            class="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200">
                        Empty Trash
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- View Details Modal -->
    <div id="viewDetailsModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50" style="backdrop-filter: blur(4px);">
        <div class="relative top-20 mx-auto p-5 border w-[600px] shadow-2xl rounded-xl bg-white modal-enter">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Plan Details</h3>
                <button onclick="closeViewDetailsModal()" class="text-gray-400 hover:text-gray-600">
                    <i data-feather="x" class="w-5 h-5"></i>
                </button>
            </div>
            <div id="planDetailsContent" class="space-y-4">
                <!-- Details will be loaded dynamically -->
            </div>
        </div>
    </div>

    <!-- Initialize Feather Icons -->
    <script>
        feather.replace();
    </script>

    <!-- JavaScript for Actions -->
    <script>
        // Add CSRF token meta tag if not present
        if (!document.querySelector('meta[name="csrf-token"]')) {
            const meta = document.createElement('meta');
            meta.name = 'csrf-token';
            meta.content = '{{ csrf_token() }}';
            document.head.appendChild(meta);
        }

        let currentPlanId = null;

        // Restore Plan Functions
        function restorePlan(id) {
            currentPlanId = id;
            document.getElementById('restoreModal').classList.remove('hidden');
        }

        function closeRestoreModal() {
            document.getElementById('restoreModal').classList.add('hidden');
            currentPlanId = null;
        }

        document.getElementById('confirmRestoreBtn')?.addEventListener('click', function() {
            if (currentPlanId) {
                const form = document.createElement('form');
                form.method = 'POST';
               form.action = `{{ route('admin.plans.restore', ':id') }}`.replace(':id', currentPlanId);
                
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
                
                document.body.appendChild(form);
                form.submit();
            }
            closeRestoreModal();
        });

        // Permanent Delete Functions
        function confirmPermanentDelete(id) {
            currentPlanId = id;
            document.getElementById('permanentDeleteModal').classList.remove('hidden');
        }

        function closePermanentDeleteModal() {
            document.getElementById('permanentDeleteModal').classList.add('hidden');
            currentPlanId = null;
        }

        document.getElementById('confirmPermanentDeleteBtn')?.addEventListener('click', function() {
            if (currentPlanId) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `{{ route('admin.plans.force-delete', ':id') }}`.replace(':id', currentPlanId);
                
                const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = '_token';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
                
                const methodInput = document.createElement('input');
                methodInput.type = 'hidden';
                methodInput.name = '_method';
                methodInput.value = 'DELETE';
                form.appendChild(methodInput);
                
                document.body.appendChild(form);
                form.submit();
            }
            closePermanentDeleteModal();
        });

        // Empty Trash Functions
        function confirmEmptyTrash() {
            document.getElementById('emptyTrashModal').classList.remove('hidden');
        }

        function closeEmptyTrashModal() {
            document.getElementById('emptyTrashModal').classList.add('hidden');
        }

        

        // View Details Functions
        function viewPlanDetails(id) {
            // Fetch plan details via AJAX
            fetch(`{{ url('admin/plans') }}/${id}/details`)
                .then(response => response.json())
                .then(data => {
                    const content = document.getElementById('planDetailsContent');
                    content.innerHTML = `
                        <div class="border-b border-gray-200 pb-4">
                            <h4 class="text-sm font-medium text-gray-500">Plan Name</h4>
                            <p class="text-base text-gray-900">${data.name}</p>
                        </div>
                        <div class="border-b border-gray-200 pb-4">
                            <h4 class="text-sm font-medium text-gray-500">Description</h4>
                            <p class="text-base text-gray-900">${data.description || 'No description'}</p>
                        </div>
                        <div class="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Price</h4>
                                <p class="text-base text-gray-900">{{ config('app.app_currency') }}${data.price}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Duration</h4>
                                <p class="text-base text-gray-900">${data.duration_days} days</p>
                            </div>
                        </div>
                        <div class="border-b border-gray-200 pb-4">
                            <h4 class="text-sm font-medium text-gray-500">Features</h4>
                            <div class="mt-2 flex flex-wrap gap-2">
                                ${data.features ? data.features.map(f => `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">${f}</span>`).join('') : 'No features'}
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Deleted By</h4>
                                <p class="text-base text-gray-900">${data.deleted_by || 'System'}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">Deleted At</h4>
                                <p class="text-base text-gray-900">${new Date(data.deleted_at).toLocaleString()}</p>
                            </div>
                        </div>
                    `;
                    document.getElementById('viewDetailsModal').classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error fetching plan details:', error);
                    alert('Could not load plan details');
                });
        }

        function closeViewDetailsModal() {
            document.getElementById('viewDetailsModal').classList.add('hidden');
        }

        // Clear search function
        function clearSearch() {
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            window.location.href = url.toString();
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const modals = ['restoreModal', 'permanentDeleteModal', 'emptyTrashModal', 'viewDetailsModal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (event.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }

        // Keyboard shortcut to close modals (Escape key)
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modals = ['restoreModal', 'permanentDeleteModal', 'emptyTrashModal', 'viewDetailsModal'];
                modals.forEach(modalId => {
                    document.getElementById(modalId)?.classList.add('hidden');
                });
            }
        });
    </script>
</body>
</html>