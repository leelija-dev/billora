@extends('admin.main-layout')
@section('title', 'Business Types')
@section('content')
    <style>
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

        /* Fix sidebar overlap */
        .main-content {
            margin-left: 1rem;
            /* 256px */
        }

        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
        }
    </style>



    <div class="flex h-screen">
        <!-- Include Sidebar -->


        <!-- Main Content -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b rounded border-gray-200 p-5 ">
                <div class="px-3 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Business Types</h1>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->

                            <a href="#"><button
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                    <i data-feather="trash" class="w-4 h-4 mr-2"></i>
                                    Trashed Business Types
                                </button></a>
                            <!-- Add Plan Button -->
                            <a href="{{ route('admin.business-types.create') }}"><button
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                    <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                    Add Business Types
                                </button></a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Success Messages -->
            @if (session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded-lg fade-in">
                    {{ session('success') }}
                </div>
            @endif

            <!-- Stats Cards -->
            <div class="px-6 py-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-blue-600"><strong>Total Business Types</strong></p>
                                <p class="text-2xl font-bold text-blue-600">{{$total_business_types ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i data-feather="layers" class="w-6 h-6 text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-green-600"><strong>Active Business Types</strong></p>
                                <p class="text-2xl font-bold text-green-600">{{$active_business_types ?? 0}}</p>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                        </div>
                    </div>


                    <a href="#">
                        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-red-600"><strong> Inactive Business Types</strong></p>
                                    <p class="text-2xl font-bold text-red-600">{{$inactive_business_types ?? 0 }}</p>
                                </div>
                                <div class="p-3 bg-red-100 rounded-full">
                                    <i data-feather="pause-circle" class="w-6 h-6 text-red-600"></i>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <!-- Plans Table -->
            <div class="px-6 pb-6">
                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-800">All Business Types</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sl. No</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name</th>
                                         <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Slug</th>
                                         <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status</th>
                                        
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created at</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">

                                @forelse ($business_types as $business)
                                    <tr class="hover:bg-gray-50 transition duration-150">

                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="flex items-center">

                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ $loop->iteration }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="text-sm text-gray-900">{{ $business->name ?? '' }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="text-sm text-gray-900">{{ $business->slug ?? '' }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="text-sm text-gray-900">{{ $business->is_active ? 'Active' : 'Inactive' }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {{ $business->created_at->format('d-m-Y h:i A') ?? '' }}
                                        </td>

                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="{{ route('admin.business-types.edit', $business->id) }}">
                                                <button class="text-blue-600 hover:text-blue-900 mr-3">
                                                    <i data-feather="edit-2" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                            <button onclick="confirmDelete({{ $business->id }})"
                                                class="text-red-600 hover:text-red-900">
                                                <i data-feather="trash-2" class="w-4 h-4"></i>
                                            </button>

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
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div class="text-center">
                                                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                <h3 class="mt-2 text-sm font-medium text-gray-900">No business types found!
                                                </h3>

                                            </div>
                                        </td>
                                    </tr>
                                @endforelse

                            </tbody>
                        </table>
                    </div>
                    <div class="p-4">
                        {{ $business_types->links('pagination::tailwind') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Permanent Delete Confirmation Modal -->
    <div id="permanentDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">

        <div class="bg-white p-6 rounded-lg w-96">
            <h2 class="text-lg font-semibold mb-4">Delete Plan</h2>

            <p class="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this plan?
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
        function confirmDelete(id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2563EB',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.getElementById('delete-form-' + id).submit();
                }
            });
        }
    </script>
@endsection
