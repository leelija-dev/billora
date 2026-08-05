@extends('admin.main-layout')
@section('title','All Plans')
@section('content')
    <style>
        /* Remove sidebar margin for full width */
        .main-content {
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
        }
        
        /* Full width container */
        .full-width-container {
            width: 100%;
            max-width: 100%;
            padding: 0 24px;
        }
        
        /* No margin on body */
        body {
            overflow-x: hidden;
        }
        
        /* Enhanced Animations */
        .fade-in {
            animation: fadeIn 0.4s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Card Hover Animation */
        .stat-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s ease;
        }
        
        .stat-card:hover::before {
            left: 100%;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
        }
        
        /* Table Row Animation */
        .table-row {
            transition: all 0.25s ease;
            animation: slideIn 0.3s ease-out;
            animation-fill-mode: both;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .table-row:hover {
            background: linear-gradient(90deg, #f8fafc, #ffffff);
            transform: scale(1.01);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        /* Button Pulse Animation */
        .btn-pulse {
            position: relative;
        }
        
        .btn-pulse::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.4s, height 0.4s;
        }
        
        .btn-pulse:active::after {
            width: 100%;
            height: 100%;
        }
        
        /* Badge Glow Animation */
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 2px #10b981; }
            50% { box-shadow: 0 0 8px #10b981; }
        }
        
        .badge-active-glow {
            animation: glow 2s ease-in-out infinite;
        }
        
        /* Icon Hover Animation */
        .action-icon {
            transition: all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: inline-block;
        }
        
        .action-icon:hover {
            transform: scale(1.2) rotate(5deg);
        }
        
        /* Feature Tag Animation */
        .feature-tag {
            transition: all 0.2s ease;
            display: inline-block;
        }
        
        .feature-tag:hover {
            transform: translateY(-2px) scale(1.05);
            background: #2563eb !important;
            color: white !important;
        }
        
        /* Search Input Focus Animation */
        .search-input {
            transition: all 0.3s ease;
        }
        
        .search-input:focus {
            transform: scale(1.02);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        /* Button Hover Effects */
        .btn-hover-effect {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .btn-hover-effect::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.4s, height 0.4s;
        }
        
        .btn-hover-effect:hover::after {
            width: 200%;
            height: 200%;
        }
        
        /* Success Message Animation */
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .success-message {
            animation: slideDown 0.4s ease-out;
        }
        
        /* Stats Number Animation */
        @keyframes countUp {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        .stat-number {
            animation: countUp 0.5s ease-out;
        }
        
        /* Full width table */
        .full-width-table {
            width: 100%;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .full-width-container {
                padding: 0 16px;
            }
        }
    </style>

    <div class="flex h-screen">
        <!-- Include Sidebar -->
        {{-- @include('admin.sidebar') --}}
        
        <!-- Main Content - FULL WIDTH -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Top Header - Full Width -->
            <header class="bg-white shadow-sm border-b border-gray-200 w-full">
                <div class="full-width-container py-5">
                    <div class="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                                Features Management
                            </h1>
                            <p class="text-sm text-gray-600 mt-1">Manage features</p>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center space-x-3 flex-wrap gap-3">
                            <!-- Search -->
                            <div class="relative">
                                <form method="GET" action="{{ route('admin.features.index') }}">
                                    <input type="text" 
                                        name="search"
                                        value="{{ request('search') }}"
                                        placeholder="Search features..." 
                                        class="search-input pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-64 transition-all duration-300">
                                    <i data-feather="search" class="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400"></i>
                                    
                                    @if(request('search'))
                                        <button type="button" 
                                                onclick="clearSearch()" 
                                                class="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                                            <i data-feather="x" class="w-3.5 h-3.5"></i>
                                        </button>
                                    @endif
                                </form>
                            </div>
                             <a href="{{route('admin.features.create')}}">
                                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-hover-effect">
                                    <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                    Add Feature
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Success Messages -->
            @if(session('success'))
                <div class="full-width-container mt-4">
                    <div class="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg success-message flex items-center">
                        <i data-feather="check-circle" class="w-5 h-5 mr-2 text-green-500"></i>
                        {{ session('success') }}
                    </div>
                </div>
            @endif

            <!-- Plans Table - Full Width -->
            <div class="full-width-container pb-6 mt-6">
                <div class="bg-white rounded-lg shadow overflow-hidden w-full">
                    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                            <i data-feather="grid" class="w-5 h-5 mr-2 text-blue-500"></i>
                            All Features
                        </h2>
                    </div>
                    
                    <div class="overflow-x-auto w-full">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sl No.</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                @forelse ($features as  $feature)
                                
                                    <tr class="table-row hover:bg-gray-50 transition duration-150" >
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center text-center justify-center">
                                                {{ $loop->iteration + ($features->currentPage() - 1) * $features->perPage() ?? 0 }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <span class="text-sm font-bold text-gray-900">
                                                {{$feature->name ?? ''}}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="flex items-center">
                                                
                                                <div class="ml-4">
                                                    @if($feature->description)
                                                        <div class="text-sm text-gray-500">{!! Str::limit($feature->description, 40) !!}</div>
                                                    @endif
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 transition-all duration-300 hover:scale-105">
                                               {{ $feature->created_at->format('M d, Y h:i A') }}
                                            </span>
                                        </td>
                                        
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <a href="{{ route('admin.features.edit', $feature->id) }}" class="inline-block">
                                                <button class="action-icon text-blue-600 hover:text-blue-900 mr-3 transition-all duration-200">
                                                    <i data-feather="edit-2" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                            <button onclick="deleteFeature({{ $feature->id }})" class="action-icon text-red-600 hover:text-red-900 transition-all duration-200">
                                                <i data-feather="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div class="text-center">
                                                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400 animate-bounce"></i>
                                                <h3 class="mt-2 text-sm font-medium text-gray-900">No features found</h3>
                                                <p class="mt-1 text-sm text-gray-500">Get started by creating a new features.</p>
                                                <div class="mt-6">
                                                    <a href="{{ route('admin.features.create') }}">
                                                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                                                            <i data-feather="plus" class="w-4 h-4 mr-2 inline"></i>
                                                            Add Feature
                                                        </button>
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    <div class="p-4 bg-gray-50">
                        {{ $features->links('pagination::tailwind') }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Permanent Delete Confirmation Modal -->
    <div id="permanentDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50">
        <div class="bg-white p-6 rounded-lg w-96 transform transition-all duration-300">
            <div class="flex items-center justify-center mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                    <i data-feather="alert-triangle" class="w-6 h-6 text-red-600"></i>
                </div>
            </div>
            <h2 class="text-lg font-semibold text-center mb-4">Delete Plan</h2>
            <p class="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete this plan?
            </p>
            <div class="flex justify-end gap-3">
                <button onclick="closePermanentDeleteModal()" 
                    class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200">
                    Cancel
                </button>
                <button id="confirmPermanentDeleteBtn" 
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105">
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

    <script>
        function openAddPlanModal() {
            alert('Add Plan Modal - To be implemented');
        }
        
        function deleteFeature (id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "This feature will be deleted!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc2626',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = `{{ route('admin.features.delete', ':id') }}`.replace(':id', id);
                    
                    const csrf = document.createElement('input');
                    csrf.type = 'hidden';
                    csrf.name = '_token';
                    csrf.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                    
                    const method = document.createElement('input');
                    method.type = 'hidden';
                    method.name = '_method';
                    method.value = 'DELETE';
                    
                    form.appendChild(csrf);
                    form.appendChild(method);
                    document.body.appendChild(form);
                    form.submit();
                }
            });
        }
    </script>
@endsection