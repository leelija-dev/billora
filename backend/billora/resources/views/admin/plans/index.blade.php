<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Billora - Plans Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <style>
        .fade-in {
            animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        /* Fix sidebar overlap */
        .main-content {
            margin-left: 1rem; /* 256px */
        }
        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
            }
        }
    </style>
</head>

<body class="bg-gray-50">
    <div class="flex h-screen">
        <!-- Include Sidebar -->
        @include('admin.sidebar')
        
        <!-- Main Content -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b rounded border-gray-200 p-5 ">
                <div class="px-3 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Plans Management</h1>
                            <p class="text-sm text-gray-600 mt-1">Manage subscription plans and pricing</p>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->
                            <div class="relative">
                                <form method="GET" action="{{ route('admin.plans.index') }}">
                                    <input type="text" 
                                        name="search"
                                        value="{{ request('search') }}"
                                        placeholder="Search plans..." 
                                        class="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-56">
                                    <i data-feather="search" class="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400"></i>
                                    
                                    <!-- Clear search if exists -->
                                    @if(request('search'))
                                        <button type="button" 
                                                onclick="clearSearch()" 
                                                class="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                                            <i data-feather="x" class="w-3.5 h-3.5"></i>
                                        </button>
                                    @endif
                                </form>
                            </div>
                            <a href="{{route('admin.plans.deleted')}}" ><button
                                    class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                <i data-feather="trash" class="w-4 h-4 mr-2"></i>
                                Trashed Plans
                            </button></a>
                            <!-- Add Plan Button -->
                           <a href="{{route('admin.plans.create')}}" ><button
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200">
                                <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                Add Plan
                            </button></a>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Success Messages -->
            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded-lg fade-in">
                    {{ session('success') }}
                </div>
            @endif

            <!-- Stats Cards -->
            <div class="px-6 py-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-blue-600"><strong>Total Plans</strong></p>
                                <p class="text-2xl font-bold text-blue-600">{{ $totalPlans ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i data-feather="layers" class="w-6 h-6 text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-green-600"><strong>Active Plans</strong></p>
                                <p class="text-2xl font-bold text-green-600">{{ $activePlans ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-yellow-600"> <strong>Inactive Plans </strong></p>
                                <p class="text-2xl font-bold text-yellow-600">{{ $inactivePlans ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-orange-100 rounded-full">
                                <i data-feather="pause-circle" class="w-6 h-6 text-orange-600"></i>
                            </div>
                        </div>
                    </div>

                    <a href="{{route('admin.plans.deleted')}}"> 
                        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                        
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm text-red-600"><strong> Deleted Plans</strong></p>
                                    <p class="text-2xl font-bold text-red-600">{{ $deletedPlans ?? '0' }}</p>
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
                        <h2 class="text-lg font-semibold text-gray-800">All Plans</h2>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                               
                                @forelse ($plans as $plan)
                                    <tr class="hover:bg-gray-50 transition duration-150">
                                       
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10">
                                                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span class="text-blue-600 font-medium">{{ substr($plan->name, 0, 1) }}</span>
                                                    </div>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ $plan->name }}</div>
                                                    <div class="text-sm text-gray-500">{!! $plan->description ?? ' ' !!}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-sm font-semibold text-gray-900">{{config('app.app_currency')}}{{ number_format($plan->price, 2) }}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {{ $plan->duration_days ?? '0' }} days
                                            </span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900">
                                                @if($plan->features)
                                                    @foreach($plan->features as $feature)
                                                        <span class="inline-block px-2 py-1 text-xs bg-gray-100 rounded mr-1 mb-1">{{ $feature }}</span>
                                                    @endforeach
                                                @else
                                                    <span class="text-gray-500">No features</span>
                                                @endif
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            @if($plan->is_active)
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            @else
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Inactive
                                                </span>
                                            @endif
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $plan->created_at->format('M d, Y') }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="{{ route('admin.plans.edit', $plan->id) }}"> 
                                                <button  class="text-blue-600 hover:text-blue-900 mr-3">
                                                    <i data-feather="edit-2" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                            <button onclick="deletePlan({{ $plan->id }})" 
                                                class="text-red-600 hover:text-red-900">
                                                <i data-feather="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div class="text-center">
                                                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                <h3 class="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
                                                <p class="mt-1 text-sm text-gray-500">Get started by creating a new plan.</p>
                                                <div class="mt-6">
                                                    <button onclick="openAddPlanModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                                                        <i data-feather="plus" class="w-4 h-4 mr-2"></i>
                                                        Add Plan
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="p-4">
                        {{ $plans->links('pagination::tailwind') }}
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
            <button onclick="closePermanentDeleteModal()" 
                class="px-4 py-2 bg-gray-200 rounded">
                Cancel
            </button>

            <button id="confirmPermanentDeleteBtn" 
                class="px-4 py-2 bg-red-600 text-white rounded">
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
        text: "This plan will be deleted!",id,
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
</body>
</html>