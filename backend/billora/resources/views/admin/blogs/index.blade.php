@extends('admin.main-layout')
@section('title', 'All Blog')
@section('content')

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    body {
        background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
        min-height: 100vh;
    }

    /* MAIN CONTENT WIDTH FIX - FULL WIDTH */
    .main-content {
        margin-left: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
    }
    
    /* Modern Card Design - FULL WIDTH */
    .modern-card {
        background: white;
        border-radius: 28px;
        box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02);
        overflow: hidden;
        margin: 20px 0;
        transition: all 0.3s ease;
        width: 100%;
    }

    /* Header Section */
    .header-section {
        padding: 24px 32px;
        background: white;
        border-bottom: 1px solid #eef2f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .header-title h1 {
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0;
    }

    .header-title p {
        color: #64748b;
        font-size: 13px;
        margin-top: 4px;
    }

    /* Stats Grid */
    .stats-grid-modern {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        padding: 24px 32px;
        background: #ffffff;
        border-bottom: 1px solid #eef2f6;
    }

    .stat-card-modern {
        background: #f8fafc;
        padding: 20px;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
    }

    .stat-card-modern:hover {
        background: #f1f5f9;
        transform: translateY(-2px);
    }

    .stat-info-modern h3 {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .stat-number-modern {
        font-size: 28px;
        font-weight: 800;
        color: #1e293b;
    }

    .stat-icon-modern {
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .stat-icon-modern svg {
        width: 24px;
        height: 24px;
        fill: #2563eb;
    }

    /* Search Wrapper */
    .header-search {
        flex-shrink: 0;
    }

    .search-wrapper {
        position: relative;
        width: 320px;
    }

    .search-wrapper svg {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        fill: #94a3b8;
    }

    .search-wrapper input {
        width: 100%;
        padding: 10px 16px 10px 44px;
        border: 1px solid #e2e8f0;
        border-radius: 14px;
        font-size: 14px;
        transition: all 0.2s ease;
        outline: none;
        background: #f8fafc;
    }

    .search-wrapper input:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .clear-search-btn {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }

    .clear-search-btn:hover {
        background: #e2e8f0;
    }

    /* Tabs Section */
    .tabs-section-modern {
        padding: 16px 32px 0 32px;
        background: white;
        border-bottom: 1px solid #eef2f6;
    }

    .tabs-container {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .tab-btn-modern {
        padding: 10px 24px;
        border: none;
        background: transparent;
        border-radius: 40px;
        font-size: 14px;
        font-weight: 600;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .tab-btn-modern:hover {
        color: #2563eb;
        background: #f1f5f9;
    }

    .tab-btn-modern.active {
        background: #2563eb;
        color: white;
    }

    /* Table Container */
    .table-container-modern {
        overflow-x: auto;
        padding: 0 32px 32px 32px;
        background: white;
        width: 100%;
        -webkit-overflow-scrolling: touch;
    }

    .contacts-table-modern {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 12px;
        min-width: 900px;
    }

    .contacts-table-modern thead th {
        padding: 16px 16px;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: #f8fafc;
        {{-- border-radius: 12px; --}}
    }

    .contacts-table-modern thead th.text-center {
        text-align: center;
    }

    .contacts-table-modern tbody tr {
        transition: all 0.2s ease;
    }

    .contacts-table-modern tbody td {
        padding: 18px 16px;
        background: white;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #334155;
        vertical-align: middle;
    }

    .contacts-table-modern tbody tr:hover td {
        background: #fafcff;
    }

    /* New Message Badge */
    .new-badge-modern {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        font-size: 10px;
        font-weight: 700;
        padding: 2px 10px;
        border-radius: 30px;
        margin-left: 8px;
        display: inline-block;
        animation: pulse 1.5s infinite;
        white-space: nowrap;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(0.98); }
    }

    /* Highlight unread row */
    .bg-blue-50 {
        background: rgba(37, 99, 235, 0.05);
        border-left: 3px solid #2563eb;
    }

    /* Customer Info */
    .customer-info-modern {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .customer-avatar-modern {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 16px;
        color: white;
        flex-shrink: 0;
    }

    .customer-details-modern {
        display: flex;
        flex-direction: column;
    }

    .customer-name-modern {
        font-weight: 700;
        font-size: 14px;
        color: #1e293b;
    }

    .customer-email-modern {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 2px;
    }

    /* Checkbox Styling */
    input[type="checkbox"] {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: #2563eb;
        border-radius: 6px;
    }

    .checkbox-label {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        margin-left: 8px;
        cursor: pointer;
    }

    /* Action Buttons */
    .action-buttons-modern {
        display: flex;
        gap: 8px;
        justify-content: center;
    }

    .action-btn-modern, .mail-btn-modern, .delete-btn-modern {
        padding: 10px;
        border: none;
        background: #f1f5f9;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        min-height: 38px;
    }

    .action-btn-modern svg, .mail-btn-modern i {
        width: 18px;
        height: 18px;
        fill: #64748b;
        transition: all 0.2s ease;
    }

    .mail-btn-modern i {
        color: #64748b;
        font-size: 16px;
    }

    .action-btn-modern:hover, .mail-btn-modern:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }

    .action-btn-modern:hover svg, .mail-btn-modern:hover i {
        fill: white;
        color: white;
    }

    .delete-btn-modern {
        background: #fef2f2;
    }

    .delete-btn-modern svg {
        fill: #ef4444;
    }

    .delete-btn-modern:hover {
        background: #ef4444;
        transform: translateY(-2px);
    }

    .delete-btn-modern:hover svg {
        fill: white;
    }

    /* Selection Toolbar */
    .selection-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 32px;
        background: #f8fafc;
        border-bottom: 1px solid #eef2f6;
        flex-wrap: wrap;
        gap: 12px;
    }

    .selection-info {
        font-size: 13px;
        color: #64748b;
    }

    .selection-info strong {
        color: #2563eb;
    }

    .selection-actions {
        display: flex;
        gap: 12px;
    }

    .clear-selection-btn {
        padding: 8px 16px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 40px;
        font-size: 12px;
        font-weight: 500;
        color: #475569;
        cursor: pointer;
        transition: all 0.2s;
    }

    .clear-selection-btn:hover {
        background: #e2e8f0;
        color: #1e293b;
    }

    /* Pagination */
    .pagination-modern {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 32px;
        background: white;
        border-top: 1px solid #eef2f6;
        flex-wrap: wrap;
        gap: 16px;
    }

    .pagination-info {
        font-size: 13px;
        color: #64748b;
    }

    .pagination-info strong {
        color: #2563eb;
        font-weight: 600;
    }

    /* Empty State */
    .empty-state-modern {
        text-align: center;
        padding: 60px 20px;
    }

    .empty-state-modern svg {
        opacity: 0.5;
        margin-bottom: 16px;
    }

    .empty-state-modern h3 {
        font-size: 16px;
        font-weight: 500;
        color: #64748b;
        margin-bottom: 4px;
    }

    .empty-state-modern p {
        font-size: 13px;
        color: #94a3b8;
    }

    /* Success/Error Messages */
    .success-message {
        background: #d1fae5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        border-radius: 16px;
        padding: 12px 20px;
        margin: 20px 32px;
    }

    .error-message {
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #991b1b;
        border-radius: 16px;
        padding: 12px 20px;
        margin: 20px 32px;
    }

    /* Search Results Info */
    .search-results-info {
        padding: 0 32px 20px 32px;
        margin-top: -10px;
    }

    .search-results-badge {
        background: #eff6ff;
        padding: 10px 16px;
        border-radius: 12px;
        display: inline-block;
        font-size: 13px;
        color: #1e40af;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .stats-grid-modern {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 20px 24px;
        }
        .header-section {
            flex-direction: column;
            align-items: stretch;
        }
        .header-search {
            width: 100%;
        }
        .search-wrapper {
            width: 100%;
        }
        .table-container-modern {
            padding: 0 20px 20px 20px;
        }
        .tabs-section-modern {
            padding: 16px 24px 0 24px;
        }
        .selection-toolbar {
            padding: 12px 24px;
        }
    }
    
    @media (max-width: 768px) {
        .stats-grid-modern {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px 20px;
        }
        .stat-card-modern {
            padding: 16px;
        }
        .stat-number-modern {
            font-size: 24px;
        }
        .header-section {
            padding: 16px 20px;
        }
        .header-title h1 {
            font-size: 22px;
        }
        .table-container-modern {
            padding: 0 16px 16px 16px;
        }
        .contacts-table-modern thead th,
        .contacts-table-modern tbody td {
            padding: 12px 10px;
            font-size: 12px;
        }
        .action-buttons-modern {
            flex-direction: column;
            gap: 6px;
        }
        .success-message,
        .error-message {
            margin: 16px;
        }
        .pagination-modern {
            flex-direction: column;
            justify-content: center;
            text-align: center;
        }
        .tabs-container {
            justify-content: center;
        }
        .tab-btn-modern {
            padding: 8px 16px;
            font-size: 12px;
        }
        .selection-toolbar {
            flex-direction: column;
            align-items: stretch;
        }
        .selection-actions {
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .contacts-table-modern {
            min-width: 750px;
        }
        .action-btn-modern, .mail-btn-modern, .delete-btn-modern {
            padding: 8px;
            min-width: 34px;
            min-height: 34px;
        }
    }

    .text-center {
        text-align: center;
    }
    .add-btn-modern {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.add-btn-modern:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
}

.trash-btn-modern {
    background: #f1f5f9;
    color: #ef4444;
    border: 1px solid #fecaca;
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
}

.trash-btn-modern:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-2px);
}
</style>

<div class="content-wrapper">
    <div class="modern-card">
        <!-- Header Section -->
        <div class="header-section">
    <div class="header-title">
        <h1>All Blog</h1>
    </div>

    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        
        <!-- Add Blog Button -->
        <a href="{{ route('admin.blogs.create') }}">
            <button class="add-btn-modern">
                <i class="fa-solid fa-plus"></i> Add Blog
            </button>
        </a>

        <!-- Trashed Blog Button -->
        <a href="{{ route('admin.blogs.trash') }}">
            <button class="trash-btn-modern">
                <i class="fa-solid fa-trash"></i> Trashed
            </button>
        </a>

        <!-- Search -->
        <div class="header-search">
            <div class="search-wrapper">
                <svg viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
                </svg>
                <form action="{{ route('admin.contacts.index') }}" method="GET" style="flex: 1;">
                    <input type="text" name="search" placeholder="Search..." value="{{ request('search') }}">
                </form>
            </div>
        </div>

    </div>
</div>

        <!-- STATS CARDS -->
        <div class="stats-grid-modern">
            <div class="stat-card-modern">
                <div class="stat-info-modern">
                    <h3>Total Blog</h3>
                    <div class="stat-number-modern">{{ $totalContacts ?? 0 }}</div>
                </div>
                <div class="stat-icon-modern">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2c0 .55.45 1 1 1h.59c.26 0 .52-.11.71-.29L14.59 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card-modern">
                <div class="stat-info-modern">
                    <h3>Active Blog</h3>
                    <div class="stat-number-modern">{{ $unreadContacts ?? 0 }}</div>
                </div>
                <div class="stat-icon-modern">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card-modern">
                <div class="stat-info-modern">
                    <h3>Inactive Blog</h3>
                    <div class="stat-number-modern">{{ $readContacts ?? 0 }}</div>
                </div>
                <div class="stat-icon-modern">
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card-modern">
                <div class="stat-info-modern">
                    <h3>Deleted Blog</h3>
                    <div class="stat-number-modern">{{ $repliedContacts ?? 0 }}</div>
                </div>
                <div class="stat-icon-modern">
                    <svg viewBox="0 0 24 24">
                        <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                    </svg>
                </div>
            </div>
        </div>

       

        <!-- Search Results Info -->
        @if(request('search'))
            <div class="search-results-info">
                <div class="search-results-badge">
                    🔍 Showing results for: <strong>"{{ request('search') }}"</strong>
                    <a href="{{ route('admin.contacts.index') }}" style="margin-left: 12px; color: #2563eb; text-decoration: none;">Clear search</a>
                </div>
            </div>
        @endif

        <!-- Success/Error Messages -->
        @if(session('success'))
            <div class="success-message">
                {{ session('success') }}
            </div>
        @endif

        @if(session('error'))
            <div class="error-message">
                {{ session('error') }}
            </div>
        @endif

        <!-- Table -->
        <div class="table-container-modern">
            <table class="contacts-table-modern">
              <thead>
    <tr>
        <th style="width: 60px; text-align: center;">
            Sl. No
        </th>
        <th style="text-align: left;">Blog Name</th>
        <th style="text-align: left;">Slug</th>
        <th style="text-align: left;">Description</th>
        <th style="text-align: left;">Status</th>
        <th style="text-align: left; width: 120px;">Date</th>
        <th style="text-align: center; width: 100px;">Actions</th>
    </tr>
</thead>
                <tbody>
                    @if (isset($blogs) && count($blogs) > 0)
                        @foreach ($blogs as $blog)
                            <tr>
                                <td>
                                    {{$loop->iteration}}
                                </td>
                                <td>
                                    {{$blog->name ? $blog->name : ''}}
                                </td>
                                <td class="text-center">
                                    {{ $blog->slug ? $blog->slug : '' }}
                                </td>
                                <td class="text-center">
                                    {{ \Illuminate\Support\Str::limit($blog->description, 35, '...') ?? $blog->description }}
                                </td>
                                <td class="text-center">
                                    {{ $blog->created_at->format('d M Y h:i A') }}
                                </td>
                                <td class="text-center">
                                    <div class="action-buttons-modern">
                                        <a href="{{ route('admin.blogs.view', $blog->id) }}">
                                            <button class="action-btn-modern" title="View Blog">
                                                <svg viewBox="0 0 24 24">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                                </svg>
                                            </button>
                                        </a>
                                        <a href="{{ route('admin.blogs.edit', $blog->id) }}">
                                            <button class="edit-btn-modern" title="Edit Blog">
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </button>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td colspan="6" class="empty-state-modern">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="margin: 0 auto 16px; opacity: 0.5; color: #94a3b8;">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2c0 .55.45 1 1 1h.59c.26 0 .52-.11.71-.29L14.59 18H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                                </svg>
                                <h3>No contacts found</h3>
                                @if(request('search'))
                                    <p>No messages found for "<strong>{{ request('search') }}</strong>"</p>
                                    <p style="font-size: 12px; margin-top: 8px;">
                                        <a href="{{ route('admin.contacts.index') }}" style="color: #2563eb;">Clear search</a>
                                    </p>
                                @else
                                    <p>No messages available</p>
                                @endif
                            </td>
                        </tr>
                    @endif
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($blogs->hasPages())
        <div class="pagination-modern">
            <div class="pagination-info">
                Showing <strong>{{ $blogs->firstItem() }}</strong> to <strong>{{ $blogs->lastItem() }}</strong> of <strong>{{ $contacts->total() }}</strong> results
            </div>
            <div>
                {{ $blogs->appends(request()->query())->links('pagination::tailwind') }}
            </div>
        </div>
        @endif
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Initialize Feather Icons
    feather.replace();

    // Clear Search Function
    function clearSearch() {
        window.location.href = "{{ route('admin.contacts.index') }}";
    }

    // Filter by Status
    function filterByStatus(status) {
        let url = new URL(window.location.href);
        if (status === 'all') {
            url.searchParams.delete('status');
        } else {
            url.searchParams.set('status', status);
        }
        window.location.href = url.toString();
    }

    // Select All functionality
    const selectAllCheckbox = document.getElementById('select_all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.contact_checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
            updateSelectionCount();
        });
    }

    // Update Selection Count
    function updateSelectionCount() {
        const checkboxes = document.querySelectorAll('.contact_checkbox:checked');
        const count = checkboxes.length;
        const toolbar = document.getElementById('selectionToolbar');
        const countSpan = document.getElementById('selectedCount');
        
        if (countSpan) countSpan.textContent = count;
        
        if (toolbar) {
            toolbar.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Clear Selection
    function clearSelection() {
        const checkboxes = document.querySelectorAll('.contact_checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
        updateSelectionCount();
    }

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function() {
        updateSelectionCount();
    });
</script>

@if(session('success'))
<script>
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: "{{ session('success') }}",
        showConfirmButton: false,
        timer: 3000,
        background: 'white',
        backdrop: false
    });
</script>
@endif

@if(session('error'))
<script>
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "{{ session('error') }}",
        showConfirmButton: false,
        timer: 3000,
        background: 'white',
        backdrop: false
    });
</script>
@endif

<!-- Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection