@extends('admin.main-layout')
@section('title', 'Testimonials')
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

    /* Main Content */
    .main-content {
        padding: 0px 0px;
        width: 100%;
    }

    /* Card */
    .card {
        background: white;
        border-radius: 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02), 0 1px 2px rgba(0, 0, 0, 0.03);
        overflow: hidden;
        border: 1px solid #eef2f6;
    }

    /* Header */
    .card-header {
        padding: 24px 28px;
        border-bottom: 1px solid #eef2f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .card-header h1 {
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        margin: 0;
        letter-spacing: -0.3px;
    }

    .card-header p {
        font-size: 13px;
        color: #64748b;
        margin-top: 4px;
    }

    /* Buttons - Touch Friendly */
    .btn {
        padding: 10px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        text-decoration: none;
        min-height: 44px;
    }

    .btn-primary {
        background: #2563eb;
        color: white;
    }

    .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
    }

    /* Stats Grid - 4 cards in row on desktop */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        padding: 24px 28px;
        background: #ffffff;
        border-bottom: 1px solid #eef2f6;
    }

    .stat-card {
        background: #f8fafc;
        padding: 20px;
        border-radius: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.2s;
    }

    .stat-card:hover {
        background: #f1f5f9;
        transform: translateY(-2px);
    }

    .stat-info h3 {
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }

    .stat-number {
        font-size: 28px;
        font-weight: 800;
        color: #1e293b;
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        background: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
    }

    .stat-icon svg {
        width: 24px;
        height: 24px;
        fill: #2563eb;
    }
    .stat-icon-deleted svg{
        width: 24px;
        height: 24px;
        fill: #dc2626;
    }

    /* Toolbar */
    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        padding: 20px 28px;
        background: white;
        border-bottom: 1px solid #eef2f6;
    }

    /* Search Box */
    .search-wrapper {
        position: relative;
        width: 320px;
    }

    .search-wrapper svg {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        fill: #94a3b8;
    }

    .search-wrapper input {
        width: 100%;
        padding: 10px 12px 10px 38px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        font-size: 14px;
        transition: all 0.2s;
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
        right: 10px;
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

    /* ============================================ */
    /* TABLE STYLES - FOR DESKTOP */
    /* ============================================ */
    .table-container {
        overflow-x: auto;
        padding: 0 28px 24px 28px;
        -webkit-overflow-scrolling: touch;
    }

    .testimonials-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 1000px;
    }

    .testimonials-table th {
        text-align: left;
        padding: 14px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: #f8fafc;
        border-bottom: 1px solid #eef2f6;
    }

    .testimonials-table td {
        padding: 16px 12px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #334155;
        vertical-align: middle;
    }

    .testimonials-table tbody tr:hover td {
        background: #fafcff;
    }

    /* Image */
    .testimonial-image {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
    }

    /* Rating Stars */
    .rating-stars {
        color: #fbbf24;
        font-size: 14px;
        letter-spacing: 2px;
        white-space: nowrap;
    }
    .rating-stars .empty {
        color: #e5e7eb;
    }

    /* Status Badges */
    .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
    }

    .badge-active {
        background: #d1fae5;
        color: #065f46;
    }

    .badge-inactive {
        background: #fee2e2;
        color: #991b1b;
    }

    /* Action Buttons - Touch Friendly */
    .action-buttons {
        display: flex;
        gap: 8px;
    }

    .action-btn {
        padding: 8px;
        background: #f1f5f9;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        min-width: 36px;
        min-height: 36px;
    }

    .action-btn svg {
        width: 16px;
        height: 16px;
        fill: #64748b;
    }

    .action-btn:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }

    .action-btn:hover svg {
        fill: white;
    }

    .delete-btn {
        background: #fef2f2;
    }

    .delete-btn svg {
        fill: #ef4444;
    }

    .delete-btn:hover {
        background: #ef4444;
    }

    .delete-btn:hover svg {
        fill: white;
    }

    /* ============================================ */
    /* CARD STYLES - FOR MOBILE (HIDDEN ON DESKTOP) */
    /* ============================================ */
    .testimonials-cards {
        display: none;
        padding: 20px 24px;
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .testimonial-card {
        background: white;
        border-radius: 20px;
        border: 1px solid #eef2f6;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
    }

    .testimonial-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px -12px rgba(0, 0, 0, 0.15);
    }

    .card-header-content {
        padding: 20px 20px 0 20px;
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .testimonial-avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        object-fit: cover;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 20px;
        flex-shrink: 0;
    }

    .testimonial-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    }

    .testimonial-info-card {
        flex: 1;
    }

    .testimonial-name-card {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
    }

    .testimonial-role-card {
        font-size: 12px;
        color: #64748b;
    }

    .testimonial-company-card {
        font-size: 11px;
        color: #2563eb;
        font-weight: 500;
    }

    .card-body-content {
        padding: 16px 20px;
    }

    .testimonial-message-card {
        font-size: 13px;
        color: #475569;
        line-height: 1.5;
    }

    .card-footer-content {
        padding: 12px 20px 20px 20px;
        border-top: 1px solid #f1f5f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
    }

    .serial-badge-card {
        position: absolute;
        top: 12px;
        right: 12px;
        background: #f1f5f9;
        color: #64748b;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 20px;
    }

    /* Pagination */
    .pagination {
        display: flex;
        justify-content: flex-end;
        padding: 16px 28px;
        border-top: 1px solid #eef2f6;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 60px 20px;
    }

    .empty-state svg {
        opacity: 0.5;
        margin-bottom: 16px;
        color: #94a3b8;
    }

    .empty-state p {
        color: #64748b;
        font-size: 14px;
    }

    /* ============================================ */
    /* RESPONSIVE BREAKPOINTS */
    /* ============================================ */

    /* Show cards on mobile, hide table */
    @media (max-width: 768px) {
        .table-container {
            display: none;
        }
        .testimonials-cards {
            display: grid;
        }
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }
        .btn {
            width: 100%;
            justify-content: center;
        }
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 16px 20px;
            gap: 12px;
        }
        .pagination {
            justify-content: center;
        }
    }

    /* Show table on desktop, hide cards */
    @media (min-width: 769px) {
        .table-container {
            display: block;
        }
        .testimonials-cards {
            display: none;
        }
    }

    @media (max-width: 1024px) and (min-width: 769px) {
        .stats-grid {
            gap: 16px;
        }
        .stat-number {
            font-size: 24px;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        .testimonials-cards {
            padding: 16px;
        }
        .card-header-content {
            flex-direction: column;
            text-align: center;
        }
        .card-footer-content {
            flex-direction: column;
            align-items: stretch;
        }
        .action-buttons {
            justify-content: center;
        }
    }

    /* Large Desktop */
    @media (min-width: 1920px) {
        .card {
            max-width: 1600px;
            margin: 0 auto;
        }
    }

    .text-center {
        text-align: center;
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Testimonials Management</h1>
                <p>Manage customer feedback, reviews, and ratings</p>
            </div>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <a href="{{ route('admin.testimonial.create') }}" class="btn btn-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Add Testimonial
                </a>
                <div class="search-wrapper">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <!-- FIXED: Search form action - changed from "#" to correct route -->
                    <form method="GET" action="{{ route('admin.testimonial.index') }}" style="flex: 1;">
                        <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by name, company...">
                    </form>
                    @if(request('search'))
                        <button type="button" class="clear-search-btn" onclick="clearSearch()">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#94a3b8">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    @endif
                </div>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Testimonials</h3>
                    <div class="stat-number">{{ $totalTestimonials ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2c0 .55.45 1 1 1h.59c.26 0 .52-.11.71-.29L14.59 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Active</h3>
                    <div class="stat-number">{{ $activeTestimonials ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Inactive</h3>
                    <div class="stat-number">{{ $inactiveTestimonials ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Deleted</h3>
                    <div class="stat-number">{{ $deletedTestimonials ?? '0' }}</div>
                </div>
                <div class="stat-icon-deleted">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- ============================================ -->
        <!-- TABLE VIEW - FOR DESKTOP -->
        <!-- ============================================ -->
        <div class="table-container">
            <table class="testimonials-table">
                <thead>
                    <tr>
                        <th>Sl. No</th>
                        <th>Image</th>
                        <th>Customer</th>
                        <th>Company</th>
                        <th>Message</th>
                        <th>Rating</th>
                        <th>Shop Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($testimonials as $testimonial)
                        <tr>
                            <td>{{ $loop->iteration + ($testimonials->currentPage() - 1) * $testimonials->perPage() }}</td>
                            <td>
                                <img src="{{ $testimonial->image ? asset($testimonial->image) : '' }}"
                                    alt="{{ $testimonial->name }}" class="testimonial-image">
                            </td>
                            <td>
                                <div style="font-weight: 700; color: #1e293b;">{{ $testimonial->name ?? '' }}</div>
                                <div style="font-size: 12px; color: #94a3b8;">{{ $testimonial->role ?? '' }}</div>
                            </td>
                            <td>{{ \Illuminate\Support\Str::limit($testimonial->company, 20) ?? '' }}</td>
                            <td>{{ \Illuminate\Support\Str::limit($testimonial->message, 35) }}</td>
                            <td class="rating-stars">
                                @for ($i = 1; $i <= 5; $i++)
                                    @if ($i <= $testimonial->rating)
                                        ★
                                    @else
                                        <span class="empty">★</span>
                                    @endif
                                @endfor
                            </td>
                            <td>{{ $testimonial->shop_type ?? '' }}</td>
                            <td>
                                @if ($testimonial->is_active)
                                    <span class="badge badge-active">Active</span>
                                @else
                                    <span class="badge badge-inactive">Inactive</span>
                                @endif
                            </td>
                            <td>
                                {{ $testimonial->created_at->format('d-m-Y') }}
                                <div style="font-size: 11px; color: #94a3b8;">{{ $testimonial->created_at->format('h:i A') }}</div>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <a href="{{ route('admin.testimonial.edit', $testimonial->id) }}">
                                        <button class="action-btn" title="Edit">
                                            <svg viewBox="0 0 24 24">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/>
                                            </svg>
                                        </button>
                                    </a>
                                    <button type="button" class="action-btn delete-btn" title="Delete"
                                        onclick="confirmDelete({{ $testimonial->id }})">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                        </svg>
                                    </button>
                                    <form id="delete-form-{{ $testimonial->id }}" 
                                        action="{{ route('admin.testimonial.delete', $testimonial->id) }}" 
                                        method="POST" style="display: none;">
                                        @csrf
                                        @method('DELETE')
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="10" class="empty-state">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2c0 .55.45 1 1 1h.59c.26 0 .52-.11.71-.29L14.59 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                                </svg>
                                <p>No testimonials found</p>
                                <p style="font-size: 12px; margin-top: 4px;">Get started by adding your first testimonial</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- ============================================ -->
        <!-- CARD VIEW - FOR MOBILE (HIDDEN ON DESKTOP) -->
        <!-- ============================================ -->
        <div class="testimonials-cards">
            @forelse ($testimonials as $testimonial)
                <div class="testimonial-card">
                    <span class="serial-badge-card">#{{ $loop->iteration + ($testimonials->currentPage() - 1) * $testimonials->perPage() }}</span>
                    
                    <div class="card-header-content">
                        <div class="testimonial-avatar">
                            @if($testimonial->image)
                                <img src="{{ asset($testimonial->image) }}" alt="{{ $testimonial->name }}">
                            @else
                                {{ strtoupper(substr($testimonial->name, 0, 1)) }}
                            @endif
                        </div>
                        <div class="testimonial-info-card">
                            <div class="testimonial-name-card">{{ $testimonial->name ?? '' }}</div>
                            <div class="testimonial-role-card">{{ $testimonial->role ?? '' }}</div>
                            <div class="testimonial-company-card">{{ $testimonial->company ?? '' }}</div>
                        </div>
                    </div>

                    <div class="card-body-content">
                        <div class="testimonial-message-card">{{ \Illuminate\Support\Str::limit($testimonial->message, 100) }}</div>
                    </div>

                    <div class="card-footer-content">
                        <div class="rating-stars">
                            @for ($i = 1; $i <= 5; $i++)
                                @if ($i <= $testimonial->rating)
                                    ★
                                @else
                                    <span class="empty">★</span>
                                @endif
                            @endfor
                        </div>
                        <div>
                            @if ($testimonial->is_active)
                                <span class="badge badge-active">Active</span>
                            @else
                                <span class="badge badge-inactive">Inactive</span>
                            @endif
                        </div>
                        <div class="action-buttons">
                            <a href="{{ route('admin.testimonial.edit', $testimonial->id) }}">
                                <button class="action-btn" title="Edit">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41z"/>
                                    </svg>
                                </button>
                            </a>
                            <button type="button" class="action-btn delete-btn" title="Delete"
                                onclick="confirmDelete({{ $testimonial->id }})">
                                <svg viewBox="0 0 24 24">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            @empty
                <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2c0 .55.45 1 1 1h.59c.26 0 .52-.11.71-.29L14.59 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                    </svg>
                    <p>No testimonials found</p>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        @if($testimonials->hasPages())
        <div class="pagination">
            {{ $testimonials->links('pagination::tailwind') }}
        </div>
        @endif
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- FIXED: Added Feather Icons CDN -->
<script src="https://unpkg.com/feather-icons"></script>
<script>
    // FIXED: Added feather.replace() to initialize icons
    feather.replace();
    
    function clearSearch() {
        const form = document.querySelector('.search-wrapper form');
        if (form) {
            const input = form.querySelector('input[name="search"]');
            if (input) input.value = '';
            form.submit();
        }
    }

    function confirmDelete(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: 'white',
            backdrop: true
        }).then((result) => {
            if (result.isConfirmed) {
                document.getElementById('delete-form-' + id).submit();
            }
        });
    }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection