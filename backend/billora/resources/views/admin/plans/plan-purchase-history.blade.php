@extends('admin.main-layout')
@section('title','Plans Purchase History')
@section('content')
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    /* Full Width Fix */
    .main-content {
        margin-left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
    }

    .fade-in {
        animation: fadeIn 0.4s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Modern Header */
    .modern-header {
        background: white;
        border-bottom: 1px solid #eef2f6;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        position: sticky;
        top: 0;
        z-index: 50;
    }

    /* Stats Grid */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 24px;
        margin-bottom: 28px;
    }

    .stat-card {
        background: white;
        border-radius: 24px;
        padding: 22px 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid #eef2f6;
        position: relative;
        overflow: hidden;
    }

    .stat-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .stat-card:hover::after {
        transform: scaleX(1);
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.12);
    }

    /* Table Styles */
    .purchase-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 12px;
    }

    .purchase-table thead th {
        padding: 16px 20px;
        text-align: left;
        font-size: 11px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: #f8fafc;
        /* border-radius: 14px; */
    }

    .purchase-table tbody tr {
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

    .purchase-table tbody td {
        padding: 18px 20px;
        background: white;
        border-bottom: 1px solid #f0f2f5;
        font-size: 14px;
        color: #334155;
    }

    .purchase-table tbody tr:hover td {
        background: #fafcff;
        transform: scale(1.01);
        /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); */
    }

    /* Badges */
    .badge-success {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 600;
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        color: #065f46;
    }

    .badge-pending {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 600;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        color: #92400e;
    }

    .badge-active {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 600;
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        color: #065f46;
    }

    .badge-expired {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 30px;
        font-size: 11px;
        font-weight: 600;
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #991b1b;
    }

    /* Transaction ID */
    .transaction-id {
        font-family: 'Monaco', 'Menlo', monospace;
        font-size: 11px;
        background: #f1f5f9;
        padding: 4px 8px;
        border-radius: 8px;
        display: inline-block;
        letter-spacing: 0.5px;
    }

    /* Action Button */
    .action-btn {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .action-btn:hover {
        background: #ef4444;
    }

    .action-btn:hover svg {
        stroke: white;
    }

    /* Search Bar */
    .search-wrapper {
        display: flex;
        align-items: center;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 40px;
        padding: 8px 20px;
        gap: 8px;
        transition: all 0.2s;
    }

    .search-wrapper:focus-within {
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .search-wrapper input {
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        width: 220px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
        }
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        .purchase-table thead {
            display: none;
        }
        
        .purchase-table tbody td {
            display: block;
            padding: 12px 16px;
        }
        
        .purchase-table tbody td:before {
            content: attr(data-label);
            font-weight: 600;
            display: inline-block;
            width: 130px;
        }
        
        .search-wrapper input {
            width: 100%;
        }
    }
</style>


<div class="main-content overflow-auto">
    <!-- Modern Header -->
    <header class="modern-header">
        <div style="padding: 20px 28px;">
            <div class="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                        📜 Plans Purchase History
                    </h1>
                    <p class="text-sm text-gray-500 mt-1">Track all plan purchases and payment transactions</p>
                </div>
                
                <div class="search-wrapper">
                    <span>🔍</span>
                    <form method="GET" action="#">
                        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by plan name or transaction ID...">
                    </form>
                    @if(request('search'))
                        <button type="button" onclick="clearSearch()" style="background: none; border: none; cursor: pointer;">✕</button>
                    @endif
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div style="padding: 24px 28px 40px;">
        <!-- Success Message -->
        @if(session('success'))
            <div class="bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-3 rounded-xl mb-6 flex items-center justify-between fade-in">
                <div class="flex items-center gap-2">
                    <span>✅</span>
                    <span>{{ session('success') }}</span>
                </div>
                <button onclick="this.parentElement.remove()" class="text-green-700 hover:text-green-900">✕</button>
            </div>
        @endif

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Purchases</p>
                        <p class="text-3xl font-bold text-blue-600 mt-2">{{ $totalplanHistory ?? 0 }}</p>
                        <p class="text-xs text-gray-400 mt-1">All time records</p>
                    </div>
                    <div class="p-3 bg-blue-100 rounded-xl">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Successful Payments</p>
                        <p class="text-3xl font-bold text-green-600 mt-2">{{ $successPayment ?? 0 }}</p>
                        <p class="text-xs text-gray-400 mt-1">Completed transactions</p>
                    </div>
                    <div class="p-3 bg-green-100 rounded-xl">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending / Expired</p>
                        <p class="text-3xl font-bold text-orange-600 mt-2">{{ $planExpire ?? 0 }}</p>
                        <p class="text-xs text-gray-400 mt-1">Awaiting completion</p>
                    </div>
                    <div class="p-3 bg-orange-100 rounded-xl">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="stat-card">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Cancelled Payments</p>
                        <p class="text-3xl font-bold text-red-600 mt-2">{{ $cancelledPayment ?? '0' }}</p>
                        <p class="text-xs text-gray-400 mt-1">Failed/Refunded</p>
                    </div>
                    <div class="p-3 bg-red-100 rounded-xl">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Purchase History Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span>📋</span> Purchase History
                </h2>
            </div>
            
            <div class="overflow-x-auto">
                <table class="purchase-table">
                    <thead>
                        <tr>
                            <th>Invoice No.</th>
                            <th>Plan Name</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Payment Method</th>
                            <th>Payment Status</th>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($planPurchaseHistory as $index => $plans)
                            <tr style="animation-delay: {{ $index * 0.05 }}s">
                                <td data-label="Sl. No">
                                    <span class="font-medium text-gray-500">
                                        {{ $plans->id ?? 'N/A' }}
                                        {{-- {{ $loop->iteration + ($planPurchaseHistory->currentPage() - 1) * $planPurchaseHistory->perPage() }} --}}
                                    </span>
                                </td>
                                <td data-label="Plan Name">
                                    <div>
                                        <div class="font-semibold text-gray-900">{{ $plans->plan->name ?? 'N/A' }}</div>
                                        <div class="text-xs text-gray-500 mt-0.5">{{ Str::limit($plans->plan->description ?? '', 40) }}</div>
                                    </div>
                                </td>
                                <td data-label="Status">
                                    @if($plans->status == 'active')
                                        <span class="badge-active">
                                            <span class="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                            Active
                                        </span>
                                    @else
                                        <span class="badge-expired">
                                            <span class="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                                            {{ ucfirst($plans->status) }}
                                        </span>
                                    @endif
                                </td>
                                <td data-label="Price">
                                    <span class="font-bold text-gray-900">{{ config('app.app_currency') }}{{ number_format($plans->price, 2) }}</span>
                                </td>
                                <td data-label="Payment Method">
                                    <span class="text-sm text-gray-600">{{ $plans->payment_method ?? 'N/A' }}</span>
                                </td>
                                <td data-label="Payment Status">
                                    @if($plans->payment_status == 'success')
                                        <span class="badge-success">
                                            ✅ Success
                                        </span>
                                    @else
                                        <span class="badge-pending">
                                            ⏳ Pending
                                        </span>
                                    @endif
                                </td>
                                <td data-label="Transaction ID">
                                    <code class="transaction-id">{{ $plans->payment_id ?? 'N/A' }}</code>
                                </td>
                                <td data-label="Date">
                                    <div class="text-sm text-gray-700">{{ $plans->created_at->format('d-m-Y') }}</div>
                                    <div class="text-xs text-gray-400">{{ $plans->created_at->format('h:i A') }}</div>
                                </td>
                                <td data-label="Actions">
                                    <button onclick="deletePlan({{ $plans->id }})" class="action-btn" title="Delete Record">
                                        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="9">
                                    <div class="text-center py-16">
                                        <div class="text-6xl mb-4">📭</div>
                                        <h3 class="text-lg font-semibold text-gray-900 mb-2">No purchase history found</h3>
                                        <p class="text-sm text-gray-500">No plan purchases recorded yet.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($planPurchaseHistory->hasPages())
                <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    {{ $planPurchaseHistory->links('pagination::tailwind') }}
                </div>
            @endif
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    feather.replace();

    function clearSearch() {
        const url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.location.href = url.toString();
    }

    function deletePlan(id) {
        Swal.fire({
            title: 'Delete Record?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = `{{ route('admin.plans.delete', ':id') }}`.replace(':id', id);
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