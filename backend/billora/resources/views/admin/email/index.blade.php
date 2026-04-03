@extends('admin.main-layout')
@section('title','Mail History')
@section('content')
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

    <div class="flex h-screen">
       
        <!-- Main Content -->
        <div class="main-content flex-1 overflow-auto">
            <!-- Top Header -->
            <header class="bg-white shadow-sm border-b rounded border-gray-200 p-5 ">
                <div class="px-3 py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Mail History</h1>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center space-x-3">
                            <!-- Search -->
                            <div class="relative">
                                <form method="GET" action="#">
                                    <input type="text" 
                                        name="search"
                                        value="{{ request('search') }}"
                                        placeholder="Search mails..." 
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
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-blue-600"><strong>Total Mails</strong></p>
                                <p class="text-2xl font-bold text-blue-600">{{ $totalMails ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i data-feather="layers" class="w-6 h-6 text-blue-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-green-600"><strong>Mails Send Successfully</strong></p>
                                <p class="text-2xl font-bold text-green-600">{{ $mailSent ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <i data-feather="check-circle" class="w-6 h-6 text-green-600"></i>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-red-600"> <strong>Failed Mails </strong></p>
                                <p class="text-2xl font-bold text-red-600">{{ $mailFailed ?? 0 }}</p>
                            </div>
                            <div class="p-3 bg-red-100 rounded-full">
                                <i data-feather="pause-circle" class="w-6 h-6 text-red-600"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- mails Table -->
            <div class="px-6 pb-6">
                <div class="bg-white rounded-lg shadow">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-800">All mails</h2>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email ID</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent On</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                               
                                @forelse ($mailHistory as $mail)
                                    <tr class="hover:bg-gray-50 transition duration-150">
                                       
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900">{{ $mail->customer->name?? '' }}</div>
                                                    <div class="text-sm text-gray-500">{!! $mail->customer->email ?? ' ' !!}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="text-sm font-semibold text-gray-900">{{ \Illuminate\Support\Str::limit($mail->subject ?? 'N/A', 25, '...') }}</span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                           
                                                {!! \Illuminate\Support\Str::limit($mail->message ?? 'N/A', 25, '...') !!}
                                            
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="text-sm text-gray-900">
                                                @if($mail->status)
                                                    @if($status = 'sent')
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Sent
                                                        </span> 
                                                    @elseif($status = 'queued')
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Processing
                                                        </span>
                                                    @elseif($status = 'failed')
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Failed
                                                        </span>
                                                    @endif
                                                @endif
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            {{ $mail->created_at->format('d-m-Y h:i A') }}
                                        </td>
                                      
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href="{{ route('admin.mail-history.view', $mail->id) }}"> 
                                                <button  class="text-blue-600 hover:text-blue-900 mr-3">
                                                    <i data-feather="eye" class="w-4 h-4"></i>
                                                </button>
                                            </a>
                                            {{-- <button  onclick="deletemail({{ $mail->id }})"
                                                class="text-red-600 hover:text-red-900">
                                                <i data-feather="trash-2" class="w-4 h-4"></i>
                                            </button> --}}
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="7" class="px-6 py-12 text-center">
                                            <div class="text-center">
                                                <i data-feather="inbox" class="mx-auto h-12 w-12 text-gray-400"></i>
                                                <h3 class="mt-2 text-sm font-medium text-gray-900">No mails found</h3>
                                                                              
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="p-4">
                        {{ $mailHistory->links('pagination::tailwind') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
   
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <!-- Initialize Feather Icons -->
    <script>
        feather.replace();
    </script>

    <script>
function deletemail(id) {

    Swal.fire({
        title: 'Are you sure?',
        text: "This mail will be deleted!",id,
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
            form.action = `#`.replace(':id', id);

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