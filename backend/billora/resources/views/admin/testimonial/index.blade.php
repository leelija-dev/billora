@extends('admin.main-layout')
@section('title', 'Testimonials')
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

        <!-- Main Content -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b rounded border-gray-200 p-5 ">
                <div class="px-3 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Plans Purchase History</h1>

                        </div>

                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->
                            <div class="relative">
                                <form method="GET" action="#">
                                    <input type="text" name="search" value="{{ request('search') }}"
                                        placeholder="Search plans..."
                                        class="pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-56">
                                    <i data-feather="search" class="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400"></i>

                                    <!-- Clear search if exists -->
                                    @if (request('search'))
                                        <button type="button" onclick="clearSearch()"
                                            class="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600">
                                            <i data-feather="x" class="w-3.5 h-3.5"></i>
                                        </button>
                                    @endif
                                </form>
                            </div>

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
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-blue-600"><strong>Total Plan Purchases History</strong></p>
                                <p class="text-2xl font-bold text-blue-600">{{ $totalplanHistory ?? 0 }}</p>

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
                                <p class="text-2xl font-bold text-green-600">{{ $successPayment ?? 0 }}</p>
                            </div>

                            <div class="p-3 bg-green-100 rounded-full">
                                <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-yellow-600"> <strong> Pending Plans Purchase </strong></p>
                                <p class="text-2xl font-bold text-yellow-600">{{ $planExpire ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-orange-100 rounded-full">
                                <i data-feather="pause-circle" class="w-6 h-6 text-orange-600"></i>
                            </div>
                        </div>
                    </div>


                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">

                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-red-600"><strong> Cancelled Payment</strong></p>
                                <p class="text-2xl font-bold text-red-600">{{ $cancelledPayment ?? '0' }}</p>
                            </div>
                            <div class="p-3 bg-red-100 rounded-full">
                                <!-- Cancel icon as a red X using Tailwind -->
                                <div
                                    class="w-10 h-10 flex items-center justify-center text-red-600 text-4xl font-bold cursor-pointer">
                                    ×
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Plans Table -->
            <div class="px-6 pb-6">
                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">

                        <!-- Left Side -->
                        <h2 class="text-lg font-semibold text-gray-800">
                            All Testimonials
                        </h2>

                        <!-- Right Side -->
                        <a href="{{route('admin.testimonial.create')}}"><button type="button"
                            class="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-full shadow hover:bg-blue-700 transition duration-200">
                            + Add
                        </button></a>


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
                                        Image</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name</th>
                                    
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company Name</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Message</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Shop Type</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date</th>
                                    <th
                                        class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">

                                @forelse ($testimonials as $testimonial)
                                    <tr class="hover:bg-gray-50 transition duration-150">
                                        <td class="px-5 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {{ $loop->iteration + ($testimonials->currentPage() - 1) * $testimonials->perPage() }}
                                        </td>
                                         <td class="px-6 py-4 whitespace-nowrap">
                                            <img src="{{ $testimonial->image ? asset($testimonial->image) : '' }}"
                                                alt="{{ $testimonial->name }}" class="w-16 h-10 rounded-full object-cover">
                                         </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-left">

                                                <div class="">
                                                    <div class="text-sm font-medium text-gray-900">{{ $testimonial->name ?? '' }}
                                                    </div>
                                                    <div class="text-sm text-gray-500">{{ $testimonial->role ?? ' ' }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {{ \Illuminate\Support\Str::limit($testimonial->company, 20) ?? '' }}
                                        </td>
                                    
                                        <td class="px-6 py-4 whitespace-nowrap">
                                                {{ \Illuminate\Support\Str::limit($testimonial->message, 20) }}
                                        </td>
                                        
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            @for ($i = 1; $i <= 5; $i++)
                                                @if ($i <= $testimonial->rating)
                                                    <span style="color:#fbbf24;">★</span> {{-- gold --}}
                                                @else
                                                    <span style="color:#e5e7eb;">★</span> {{-- gray --}}
                                                @endif
                                            @endfor
                                        </td>
                                         <td class="px-6 py-4 whitespace-nowrap">
                                            {{ $testimonial->shop_type ?? '' }}
                                         </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-sm font-semibold text-gray-900">
                                                @if ($testimonial->is_active)
                                                    <span
                                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                @else
                                                    <span
                                                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                        Inactive
                                                    </span>
                                                @endif
                                            </span>
                                        </td>
                                
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ $testimonial->created_at->format('d-m-Y h:i A') }}
                                        </td>
                                        <td class="text-center">

                                            <a href="{{route('admin.testimonial.edit', $testimonial->id)}}"><button class="hover:text-red-900">
                                                    <i data-feather="edit-2" class="w-4 h-4"></i>
                                                </button></a>
                                                <button type="button" 
                                                    class="text-red-600 hover:text-red-900 ms-2 delete-btn"
                                                    data-id="{{ $testimonial->id }}">
                                                    
                                                    <i data-feather="trash-2" class="w-4 h-4"></i>
                                                </button>

                                                <form id="delete-form-{{ $testimonial->id }}" 
                                                    action="{{ route('admin.testimonial.delete', $testimonial->id) }}" 
                                                    method="POST" 
                                                    style="display: none;">
                                                    @csrf
                                                    @method('DELETE')
                                                </form>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="11" class="px-6 py-12 text-center">
                                            <div class="text-center">
                                                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                <h3 class="mt-2 text-sm font-medium text-gray-900">No testimonials found!
                                                </h3>

                                            </div>
                                        </td>
                                    </tr>
                                @endforelse

                            </tbody>
                        </table>
                    </div>
                    <div class="p-4">
                        {{ $testimonials->links('pagination::tailwind') }}
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
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {

        let id = this.getAttribute('data-id');

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
    });
});
</script>
@endsection
