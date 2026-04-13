@extends('admin.main-layout')
@section('title', 'All Contact Messages')
@section('content')

    <head>

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            body {
                background: #f8fafc;
                min-height: 100vh;
                display: flex;
            }



            .nav-menu {
                list-style: none;
                padding: 0 16px;
            }

            .nav-item {
                margin-bottom: 8px;
            }

            .nav-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: #64748b;
                text-decoration: none;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .nav-link svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }

            .nav-link:hover {
                background: #f1f5f9;
                color: #2563EB;
            }

            .nav-link.active {
                background: #2563EB;
                color: white;
            }

            .nav-link.logout {
                margin-top: 32px;
                color: #ef4444;
            }

            .nav-link.logout:hover {
                background: #fee2e2;
            }

            /* Main Content */
            .main-content {
                flex: 1;
                margin-left: auto;
                padding: 32px;
                background: #f8fafc;
                min-height: 100vh;
            }

            /* Page Header */
            .page-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 32px;
                flex-wrap: wrap;
                gap: 16px;
            }

            .header-left h1 {
                font-size: 28px;
                font-weight: 700;
                color: #111827;
                letter-spacing: -0.5px;
                margin-bottom: 8px;
            }

            .header-left p {
                color: #64748b;
                font-size: 15px;
            }

            .header-left span {
                color: #2563EB;
                font-weight: 600;
                background: #e6f0ff;
                padding: 4px 12px;
                border-radius: 30px;
                margin-left: 12px;
                font-size: 14px;
            }

            .header-right {
                display: flex;
                gap: 16px;
                align-items: center;
            }

            .search-box {
                position: relative;
                width: 320px;
            }

            .search-box svg {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                width: 18px;
                height: 18px;
                fill: #94a3b8;
            }

            .search-box input {
                width: 100%;
                padding: 12px 16px 12px 48px;
                border: 1px solid #e2e8f0;
                border-radius: 30px;
                font-size: 14px;
                background: white;
                transition: all 0.2s ease;
                outline: none;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
            }

            .search-box input:focus {
                border-color: #2563EB;
                box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
            }

            .search-box input::placeholder {
                color: #94a3b8;
            }

            .add-btn {
                background: #2563EB;
                color: white;
                border: none;
                border-radius: 30px;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s ease;
                box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
            }

            .add-btn:hover {
                background: #1D4ED8;
                transform: translateY(-2px);
                box-shadow: 0 6px 12px rgba(37, 99, 235, 0.25);
            }

            .add-btn svg {
                width: 18px;
                height: 18px;
                fill: white;
            }

            /* Stats Cards */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 24px;
                margin-bottom: 32px;
            }

            .stat-card {
                background: white;
                padding: 24px;
                border-radius: 20px;
                border: 1px solid #eef2f6;
                display: flex;
                align-items: center;
                justify-content: space-between;
                transition: all 0.2s ease;
            }

            .stat-card:hover {
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.02);
                border-color: #2563EB;
            }

            .stat-info h3 {
                color: #64748b;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .stat-number {
                font-size: 32px;
                font-weight: 700;
                color: #111827;
            }

            .stat-icon {
                width: 56px;
                height: 56px;
                background: #e6f0ff;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .stat-icon svg {
                width: 28px;
                height: 28px;
                fill: #2563EB;
            }

            /* Tabs */
            .tabs-section {
                background: white;
                border-radius: 16px;
                padding: 8px;
                margin-bottom: 32px;
                border: 1px solid #eef2f6;
                display: inline-flex;
                gap: 4px;
            }

            .tab-btn {
                padding: 10px 24px;
                border: none;
                background: transparent;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                color: #64748b;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .tab-btn:hover {
                color: #2563EB;
                background: #f8fafc;
            }

            .tab-btn.active {
                background: #2563EB;
                color: white;
            }

            /* Table Container */
            .table-container {
                background: white;
                border-radius: 24px;
                border: 1px solid #eef2f6;
                overflow: auto;
                margin-bottom: 32px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
            }

            .customers-table {
                width: 100%;
                border-collapse: collapse;
                min-width: 1000px;
            }

            .customers-table th {
                background: #f8fafc;
                padding: 20px 24px;
                text-align: center;
                font-size: 13px;
                font-weight: 600;
                color: #475569;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                border-bottom: 1px solid #eef2f6;
            }

            .customers-table td {
                padding: 20px 24px;
                border-bottom: 1px solid #f1f5f9;
                font-size: 14px;
                color: #334155;
            }

            .customers-table tr:hover td {
                background: #fafcff;
            }

            .customers-table tr:last-child td {
                border-bottom: none;
            }

            /* Customer Info */
            .customer-info {
                display: flex;
                align-items: center;
                gap: 14px;
            }

            .customer-avatar {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 18px;
            }

            .customer-details {
                display: flex;
                flex-direction: column;
            }

            .customer-name {
                font-weight: 600;
                color: #111827;
                margin-bottom: 4px;
                font-size: 15px;
            }

            .customer-email {
                font-size: 13px;
                color: #94a3b8;
            }

            /* Status Badge */
            .status-badge {
                display: inline-flex;
                align-items: center;
                padding: 6px 16px;
                border-radius: 30px;
                font-size: 12px;
                font-weight: 600;
                width: fit-content;
            }

            .status-active {
                background: #e0f2e9;
                color: #0b5e42;
            }

            .status-inactive {
                background: #fee9e7;
                color: #b34033;
            }

            .status-pending {
                background: #fff4e0;
                color: #b45b0a;
            }

            /* Plan Badge */
            .plan-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 14px;
                background: #f1f5f9;
                border-radius: 30px;
                font-size: 12px;
                font-weight: 600;
                color: #334155;
            }

            .plan-badge.premium {
                background: #fef3c7;
                color: #92400e;
            }

            .plan-badge.enterprise {
                background: #e6f0ff;
                color: #2563EB;
            }

            .plan-badge svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            /* Action Buttons */
            .action-buttons {
                display: flex;
                gap: 8px;
            }

            .action-btn {
                padding: 8px;
                border: none;
                background: #f1f5f9;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .action-btn svg {
                width: 18px;
                height: 18px;
                fill: #64748b;
                transition: fill 0.2s ease;
            }

            .action-btn:hover {
                background: #2563EB;
            }

            .action-btn:hover svg {
                fill: white;
            }

            .action-btn.delete:hover {
                background: #ef4444;
            }

            /* Pagination */
            .pagination {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: white;
                padding: 16px 24px;
                border-radius: 16px;
                border: 1px solid #eef2f6;
                flex-wrap: wrap;
                gap: 16px;
            }

            .pagination-info {
                color: #64748b;
                font-size: 14px;
            }

            .pagination-info strong {
                color: #2563EB;
                font-weight: 600;
            }

            .pagination-controls {
                display: flex;
                gap: 6px;
            }

            .page-btn {
                min-width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                background: white;
                color: #475569;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                padding: 0 8px;
            }

            .page-btn:hover:not(.active):not(.disabled) {
                border-color: #2563EB;
                color: #2563EB;
                background: #f8fafc;
            }

            .page-btn.active {
                background: #2563EB;
                border-color: #2563EB;
                color: white;
            }

            .page-btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .page-btn.next,
            .page-btn.prev {
                gap: 6px;
                padding: 0 16px;
            }

            .page-btn.next svg,
            .page-btn.prev svg {
                width: 18px;
                height: 18px;
                fill: currentColor;
            }

            @media (max-width: 1024px) {
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (max-width: 768px) {
                .sidebar {
                    display: none;
                }

                .main-content {
                    margin-left: 0;
                    padding: 20px;
                }

                .page-header {
                    flex-direction: column;
                    align-items: stretch;
                }

                .header-right {
                    flex-direction: column;
                    align-items: stretch;
                }

                .search-box {
                    width: 100%;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                }

                .tabs-section {
                    width: 100%;
                    overflow-x: auto;
                    justify-content: space-between;
                }

                .tab-btn {
                    flex: 1;
                    text-align: center;
                }
            }
        </style>

        <div class="card" style="bg:white;">
            <div class="main-content">
                <!-- Customers Table -->
                <div class="table-container">
                    <div class="flex items-center justify-between m-4">

                        <!-- Left: Title -->
                        <h2 class="text-xl font-semibold">Contact Us</h2>

                        <!-- Center: Buttons -->
                        <div class="flex items-center gap-2 ">
                            <button onclick="clearSelection()" class="px-3 py-2 bg-red-500 text-white rounded text-sm">
                                Clear all checked
                            </button>
                            {{-- 
                        <a href="{{route('admin.customers.customer-mail')}}"><button class="px-3 py-2 bg-blue-500 text-white rounded text-sm">
                            Send Mail
                        </button></a> --}}

                            <button onclick="handleSendMail()"
                                class="relative px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2">

                                <!-- Mail Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 12H8m0 0l-4-4m4 4l-4 4m8-8l4-4m-4 4l4 4" />
                                </svg>

                                <span>Send Mail</span>

                                <!-- Red Badge -->
                                <span id="selectedCount"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    0
                                </span>


                            </button>
                            <form action="{{ route('admin.customers.index') }}" method="GET">

                                <select name="status" onchange="this.form.submit()"
                                    class="px-3 py-2 border rounded text-sm">

                                    <option value="">All Customers</option>

                                    <option value="1" {{ request('status') == '1' ? 'selected' : '' }}>
                                        Active Customers
                                    </option>

                                    <option value="0" {{ request('status') == '0' ? 'selected' : '' }}>
                                        Inactive Customers
                                    </option>

                                </select>

                            </form>
                        </div>

                        <!-- Right: Search -->
                        <div class="flex items-center border rounded px-2">
                            <svg viewBox="0 0 24 24" class="w-5 h-5 text-gray-500">
                                <path
                                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                            <form action="{{ route('admin.customers.index') }}" method="GET">
                                <input type="text" name="search" placeholder="Search customers..."
                                    value="{{ request('search') }}" {{-- id="searchInput" --}}
                                    class="outline-none px-8 py-3 text-sm">
                            </form>
                        </div>

                    </div>

                    <table class="customers-table">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="select_all"> Check All
                                </th>
                                <th class="text-start">Customer</th>
                                <th class="text-center">subject</th>
                                <th class="text-center">Message</th>
                                <th class="text-center">Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @if (isset($contacts) && count($contacts) > 0)
                                @foreach ($contacts as $contact)
                                    <tr
                                        class="{{ $contact['view_status'] == 0 ? 'bg-blue-50 border-l-4 border-blue-500' : '' }}">

                                        <!-- Checkbox -->
                                        <td>
                                            <div class="flex items-center gap-2">

                                                <input type="checkbox" name="select_contact[]" value="{{ $contact['id'] }}"
                                                    class="contact_checkbox">
                                                @if ($contact['view_status'] == 0)
                                                    <span class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                                        NEW
                                                    </span>
                                                @endif
                                            </div>
                                        </td>

                                        <!-- Customer Info -->
                                        <td>
                                            <div class="customer-info flex items-center gap-2">



                                                <div class="customer-details">

                                                    <span
                                                        class="customer-name {{ $contact['view_status'] == 0 ? 'font-semibold' : '' }}">
                                                        {{ $contact['name'] }}
                                                    </span>


                                                    <span class="customer-email text-gray-500 text-sm">
                                                        {{ $contact['email'] }}
                                                    </span>

                                                </div>
                                            </div>
                                        </td>

                                        <td class="text-center">
                                            {{ substr($contact['subject'], 0, 20) . '...' ?? $contact['subject'] }}</td>
                                        <td class="text-center">
                                            {{ substr($contact['message'], 0, 20) . '...' ?? $contact['message'] }}</td>

                                        <td class="text-center">{{ $contact['created_at']->format('d M Y h:i A') }}</td>


                                        <td class="text-center">
                                            <div class="action-buttons">
                                                <a href="{{ route('admin.contacts.view', $contact->id) }}">
                                                <button class="action-btn" 
                                                    title="View">
                                                    <svg viewBox="0 0 24 24">
                                                        <path
                                                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                                    </svg>
                                                </button>
                                                </a>
                                                {{-- <button class="action-btn" onclick="editCustomer({{ $contact['id'] }})"
                                                title="Edit">
                                                <svg viewBox="0 0 24 24">
                                                    <path
                                                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z" />
                                                </svg>
                                            </button> --}}
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="6" style="text-align: center; padding: 48px; color: #94a3b8;">
                                        No Contacts found!
                                    </td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                    <div class="pagination flex justify-end mt-4">
                        {{ $contacts->links('pagination::tailwind') }}
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

        <script>
            /* =========================
                       GLOBAL STATE
                    ========================= */
            let selectedCustomers = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
            let isAllSelected = localStorage.getItem('isAllSelected') === 'true';

            /* =========================
               UPDATE COUNT
            ========================= */
            function updateSelectedCount() {
                let count = isAllSelected ?
                    {{ $contacts->total() }} :
                    selectedCustomers.length;

                document.getElementById('selectedCount').innerText = count;
            }

            /* =========================
               PAGE LOAD
            ========================= */
            document.addEventListener("DOMContentLoaded", function() {

                let checkboxes = document.querySelectorAll('.customer_checkbox');
                let selectAll = document.getElementById('select_all');

                // Restore checkbox state
                checkboxes.forEach(cb => {
                    if (isAllSelected || selectedCustomers.includes(cb.value)) {
                        cb.checked = true;
                    }

                    cb.addEventListener('change', function() {

                        if (isAllSelected) {
                            // switch to manual mode
                            isAllSelected = false;
                            localStorage.setItem('isAllSelected', 'false');
                            selectedCustomers = [];
                        }

                        if (this.checked) {
                            if (!selectedCustomers.includes(this.value)) {
                                selectedCustomers.push(this.value);
                            }
                        } else {
                            selectedCustomers = selectedCustomers.filter(id => id !== this.value);
                        }

                        localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));
                        updateSelectedCount();
                    });
                });

                // Select All toggle
                selectAll.addEventListener('change', function() {

                    if (this.checked) {
                        isAllSelected = true;
                        localStorage.setItem('isAllSelected', 'true');
                        localStorage.removeItem('selectedCustomers');

                        checkboxes.forEach(cb => cb.checked = true);

                    } else {
                        isAllSelected = false;
                        localStorage.setItem('isAllSelected', 'false');

                        selectedCustomers = [];
                        localStorage.setItem('selectedCustomers', JSON.stringify(selectedCustomers));

                        checkboxes.forEach(cb => cb.checked = false);
                    }

                    updateSelectedCount();
                });

                updateSelectedCount();



            });

            /* =========================
               CLEAR SELECTION
            ========================= */
            function clearSelection() {
                localStorage.removeItem('selectedCustomers');
                localStorage.removeItem('isAllSelected');
                location.reload();
            }

            /* =========================
               SEND MAIL
            ========================= */
            function handleSendMail() {

                let selected = JSON.parse(localStorage.getItem('selectedCustomers')) || [];
                let isAll = localStorage.getItem('isAllSelected') === 'true';

                if (!isAll && selected.length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'No Customer Selected',
                        text: 'Please select at least one customer!',
                    });
                    return;
                }

                let url = "{{ route('admin.customers.customer-mail') }}";

                //  GET search from URL (BEST METHOD)
                let params = new URLSearchParams(window.location.search);
                let search = params.get('search');
                let status = params.get('status');
                if (isAll) {
                    url += "?all=true";

                    if (search) {
                        url += "&search=" + encodeURIComponent(search);
                    } else if (status) {
                        url += "&status=" + encodeURIComponent(status);
                    }

                } else {
                    url += "?ids=" + selected.join(',');
                }

                window.location.href = url;
            }
        </script>

    @endsection
