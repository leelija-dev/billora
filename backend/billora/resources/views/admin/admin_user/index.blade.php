@extends('admin.main-layout')
@section('title', 'Admin Users')
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
                            <h1 class="text-2xl font-bold text-gray-800">User Management</h1>
                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->

                            <a href="#"><button
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                    <i data-feather="trash" class="w-4 h-4 mr-2"></i>
                                    Trashed User
                                </button></a>
                            <!-- Add Plan Button -->
                            <a href="{{ route('admin.admin-users.create') }}"><button
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                    <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                    Add User
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
                                <p class="text-sm text-blue-600"><strong>Total Users</strong></p>
                                <p class="text-2xl font-bold text-blue-600">{{ $totalUser ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i data-feather="layers" class="w-6 h-6 text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-green-600"><strong>Active Users</strong></p>
                                <p class="text-2xl font-bold text-green-600">{{ $totalUser ?? 0 }}</p>
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
                                    <p class="text-sm text-red-600"><strong> Deleted Users</strong></p>
                                    <p class="text-2xl font-bold text-red-600">0</p>
                                </div>
                                <div class="p-3 bg-red-100 rounded-full">
                                    <i data-feather="trash-2" class="w-6 h-6 text-red-600"></i>
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
                        <h2 class="text-lg font-semibold text-gray-800">All Users</h2>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    </th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Name</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last login</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">

                                @forelse ($users as $user)
                                    <tr class="hover:bg-gray-50 transition duration-150">
                                        <td class="px-10 py-10 whitespace-nowrap text-center">
                                            <img src="{{ $user->image ? asset($user->image) : asset('uploads/default.png') }}"
                                                alt="User Image" class="w-14 h-14 rounded-full object-cover mx-auto border">
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="flex items-center">

                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ $user->username }}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-center">
                                            <div class="text-sm text-gray-900">{{ $user->email }}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                             {{ $user->fname ?? '' }} {{ $user->lname ?? '' }}
                                        </td>
                                        <td class="px-6 py-4">
                                            @foreach ($user->roles as $role)
                                                {{ $role->name }}@if (!$loop->last)
                                                    ,
                                                @endif
                                            @endforeach
                                        </td>
                                        <td class="px-6 py-4">
                                            {{ $user->last_login_at ? $user->last_login_at->format('d-m-Y h:i A') : '' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $user->created_at->format('d-m-Y h:i A') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                             <button class="text-blue-600 hover:text-blue-900 mr-3">
                                                    <i data-feather="edit" class="w-4 h-4"></i>
                                                </button>
                                            <a href="{{ route('admin.admin-users.edit', $user->id) }}">
                                                <button class="text-blue-600 hover:text-blue-900 mr-3">
                                                    <i data-feather="eye" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                            <a href="#">
                                                <button class="text-red-600 hover:text-red-900">
                                                    <i data-feather="trash-2" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                        </td>
                                    </tr>
                                    @empty
                                        <tr>
                                            <td colspan="7" class="px-6 py-12 text-center">
                                                <div class="text-center">
                                                    <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                    <h3 class="mt-2 text-sm font-medium text-gray-900">No admin user found</h3>

                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse

                                </tbody>
                            </table>
                        </div>
                        <div class="p-4">
                            {{ $users->links('pagination::tailwind') }}
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
            function openAddPlanModal() {
                // Open add plan modal
                alert('Add Plan Modal - To be implemented');
            }

            // function editPlan(id) {
            //     // Edit plan functionality
            //     alert('Edit Plan ID: ' + id);
            // }

            // function deletePlan(id) {
            //     if (confirm('Are you sure you want to delete this plan?')) {
            //         // Delete plan functionality
            //         alert('Delete Plan ID: ' + id);
            //     }
            // }
        </script>
        <script>
            function deletePlan(id) {

                Swal.fire({
                    title: 'Are you sure?',
                    text: "This plan will be deleted!",
                    id,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#dc2626',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {

                    if (result.isConfirmed) {

                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = `{{ route('admin.plans.delete', ':id') }}`.replace(':id', id);

                        // CSRF
                        const csrf = document.createElement('input');
                        csrf.type = 'hidden';
                        csrf.name = '_token';
                        csrf.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

                        // DELETE method
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
