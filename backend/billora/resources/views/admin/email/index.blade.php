@extends('admin.main-layout')
@section('title', 'Mail History')
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
        gap: 16px;
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

    /* Stats Grid - 3 cards in row on ALL devices */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
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
        padding: 8px 12px 8px 38px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 13px;
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

    /* Table Container - Horizontal Scroll on Mobile */
    .table-container {
        overflow-x: auto;
        padding: 0 28px 24px 28px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
    }

    th {
        text-align: left;
        padding: 14px 12px;
        font-size: 12px;
        font-weight: 600;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: transparent;
        border-bottom: 1px solid #eef2f6;
    }

    td {
        padding: 16px 12px;
        border-bottom: 1px solid #f1f5f9;
        font-size: 14px;
        color: #334155;
    }

    tr:hover td {
        background: #fafcff;
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

    .badge-sent {
        background: #d1fae5;
        color: #065f46;
    }

    .badge-queued {
        background: #fef3c7;
        color: #92400e;
    }

    .badge-failed {
        background: #fee2e2;
        color: #991b1b;
    }

    /* Action Buttons - Touch Friendly */
    .action-btn {
        padding: 8px;
        background: #f1f5f9;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        min-width: 32px;
        min-height: 32px;
    }

    .action-btn svg {
        width: 16px;
        height: 16px;
        fill: #64748b;
    }

    .action-btn:hover {
        background: #2563eb;
    }

    .action-btn:hover svg {
        fill: white;
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

    .empty-state h3 {
        font-size: 16px;
        font-weight: 500;
        color: #64748b;
        margin-bottom: 4px;
    }

    .empty-state p {
        font-size: 13px;
        color: #94a3b8;
    }

    /* Success Message */
    .success-message {
        background: #d1fae5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        border-radius: 12px;
        padding: 12px 20px;
        margin: 20px 28px;
    }

    /* ============================================ */
    /* COMPREHENSIVE RESPONSIVE BREAKPOINTS */
    /* Covering ALL specified device ratios */
    /* ============================================ */

    /* Width: 320-340px - Old iPhones, very small devices */
    @media (max-width: 340px) {
        .card-header {
            padding: 16px;
        }
        .card-header h1 {
            font-size: 18px;
        }
        .card-header p {
            font-size: 11px;
        }
        .stats-grid {
            padding: 16px;
            gap: 8px;
        }
        .stat-card {
            padding: 12px 8px;
        }
        .stat-number {
            font-size: 18px;
        }
        .stat-info h3 {
            font-size: 9px;
        }
        .stat-icon {
            width: 32px;
            height: 32px;
        }
        .stat-icon svg {
            width: 16px;
            height: 16px;
        }
        .table-container {
            padding: 0 12px 16px 12px;
        }
        th, td {
            padding: 10px 6px;
            font-size: 11px;
        }
        .badge {
            padding: 2px 8px;
            font-size: 9px;
        }
        .action-btn {
            padding: 6px;
            min-width: 28px;
            min-height: 28px;
        }
        .success-message {
            margin: 12px;
            padding: 8px 12px;
            font-size: 12px;
        }
    }

    /* Width: 341-360px - Budget Android devices (S20, S21, Flip5) */
    @media (min-width: 341px) and (max-width: 360px) {
        .card-header {
            padding: 18px;
        }
        .card-header h1 {
            font-size: 20px;
        }
        .stats-grid {
            padding: 18px;
            gap: 10px;
        }
        .stat-card {
            padding: 14px 10px;
        }
        .stat-number {
            font-size: 20px;
        }
        .table-container {
            padding: 0 14px 18px 14px;
        }
    }

    /* Width: 361-375px - iPhone SE, iPhone 8, iPhone X */
    @media (min-width: 361px) and (max-width: 375px) {
        .card-header {
            padding: 20px;
        }
        .stats-grid {
            padding: 20px;
            gap: 12px;
        }
        .stat-number {
            font-size: 22px;
        }
    }

    /* Width: 376-390px - iPhone 13, iPhone 14, Pixel 5 */
    @media (min-width: 376px) and (max-width: 390px) {
        .stats-grid {
            gap: 14px;
        }
        .stat-number {
            font-size: 24px;
        }
    }

    /* Width: 391-410px - Pixel 7, Pixel 8, S24 */
    @media (min-width: 391px) and (max-width: 410px) {
        .stats-grid {
            gap: 16px;
        }
        .stat-number {
            font-size: 26px;
        }
    }

    /* Width: 411-420px - Pixel 7 Pro, Pixel 8 Pro, S24+ */
    @media (min-width: 411px) and (max-width: 420px) {
        .stats-grid {
            gap: 18px;
        }
    }

    /* Width: 421-430px - iPhone Pro Max series, S24 Ultra */
    @media (min-width: 421px) and (max-width: 430px) {
        .stats-grid {
            gap: 20px;
        }
    }

    /* Width: 431-480px - Phablets, Foldables unfolded */
    @media (min-width: 431px) and (max-width: 480px) {
        .stats-grid {
            gap: 22px;
        }
        .stat-card {
            padding: 20px 16px;
        }
        .stat-number {
            font-size: 28px;
        }
    }

    /* ALL Mobile Devices - Keep 3 columns in row */
    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }
        .search-wrapper {
            width: 100%;
        }
        .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        table {
            min-width: 550px;
        }
        .pagination {
            justify-content: center;
            padding: 16px;
        }
    }

    /* Tablet View (769px - 1024px) */
    @media (min-width: 769px) and (max-width: 1024px) {
        .stats-grid {
            gap: 16px;
            padding: 20px 24px;
        }
        .stat-card {
            padding: 16px;
        }
        .stat-number {
            font-size: 24px;
        }
        .card-header {
            padding: 20px 24px;
        }
        .table-container {
            padding: 0 20px 20px 20px;
        }
    }

    /* Landscape orientation for mobile */
    @media (max-width: 896px) and (orientation: landscape) {
        .stats-grid {
            gap: 12px;
        }
        .stat-card {
            padding: 12px 10px;
        }
        .stat-number {
            font-size: 20px;
        }
        .stat-icon {
            width: 36px;
            height: 36px;
        }
        .stat-icon svg {
            width: 18px;
            height: 18px;
        }
        .card-header {
            padding: 12px 20px;
        }
        .table-container {
            padding: 0 16px 16px 16px;
        }
        td, th {
            padding: 8px 10px;
        }
    }

    /* Desktop & Large Screens */
    @media (min-width: 1025px) and (max-width: 1366px) {
        .stats-grid {
            gap: 20px;
        }
    }

    /* Large Desktop (1920x1080) */
    @media (min-width: 1920px) {
        .card {
            max-width: 1600px;
            margin: 0 auto;
        }
        .stats-grid {
            gap: 28px;
            padding: 28px 32px;
        }
        .stat-number {
            font-size: 32px;
        }
        .card-header {
            padding: 28px 32px;
        }
        .card-header h1 {
            font-size: 28px;
        }
        .table-container {
            padding: 0 32px 28px 32px;
        }
    }

    /* Touch-friendly adjustments for all mobile */
    @media (max-width: 768px) {
        .action-btn {
            padding: 10px;
            min-width: 40px;
            min-height: 40px;
        }
        .action-btn svg {
            width: 18px;
            height: 18px;
        }
        .badge {
            padding: 4px 10px;
            font-size: 10px;
        }
    }

    /* Z Fold 5 specific (720x960) */
    @media (min-width: 700px) and (max-width: 740px) and (min-height: 940px) and (max-height: 980px) {
        .stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }
        table {
            min-width: 650px;
        }
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Mail History</h1>
                <p>Track and manage all email communications</p>
            </div>
            <div class="search-wrapper">
                <svg viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <form action="{{ route('admin.mail-history') }}" method="GET" style="flex: 1;">
                    <input type="text" name="search" placeholder="Search by recipient, subject..." value="{{ request('search') }}">
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

        <!-- Stats Cards - 3 in row on ALL devices -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Total Mails</h3>
                    <div class="stat-number">{{ $totalMails ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Sent Successfully</h3>
                    <div class="stat-number">{{ $mailSent ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <h3>Failed Mails</h3>
                    <div class="stat-number">{{ $mailFailed ?? 0 }}</div>
                </div>
                <div class="stat-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Success Message -->
        @if(session('success'))
            <div class="success-message">
                {{ session('success') }}
            </div>
        @endif

        <!-- Table with horizontal scroll on mobile -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Sent On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($mailHistory as $mail)
                        <tr>
                            <td>
                                <div>
                                    <div class="text-sm font-medium" style="color: #1e293b;">{{ $mail->customer->name ?? 'N/A' }}</div>
                                    <div class="text-xs" style="color: #94a3b8;">{{ $mail->customer->email ?? 'N/A' }}</div>
                                </div>
                            </td>
                            <td>
                                <span class="text-sm font-semibold" style="color: #1e293b;">{{ \Illuminate\Support\Str::limit($mail->subject ?? 'N/A', 30, '...') }}</span>
                            </td>
                            <td>
                                <span class="text-sm" style="color: #64748b;">{!! \Illuminate\Support\Str::limit($mail->message ?? 'N/A', 40, '...') !!}</span>
                            </td>
                            <td>
                                @if($mail->status == 'sent')
                                    <span class="badge badge-sent">Sent</span>
                                @elseif($mail->status == 'queued')
                                    <span class="badge badge-queued">Queued</span>
                                @elseif($mail->status == 'failed')
                                    <span class="badge badge-failed">Failed</span>
                                @else
                                    <span class="badge" style="background: #f1f5f9; color: #64748b;">{{ ucfirst($mail->status ?? 'Unknown') }}</span>
                                @endif
                            </td>
                            <td>
                                <span class="text-sm" style="color: #64748b;">{{ $mail->created_at->format('d M Y h:i A') }}</span>
                            </td>
                            <td>
                                <a href="{{ route('admin.mail-history.view', $mail->id) }}">
                                    <button class="action-btn" title="View Details">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    </button>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="empty-state">
                                <!-- <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                                </svg> -->
                                <h3>No mails found</h3>
                                <p>No email records available</p>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        @if($mailHistory->hasPages())
        <div class="pagination">
            {{ $mailHistory->links('pagination::tailwind') }}
        </div>
        @endif
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    function clearSearch() {
        const form = document.querySelector('.search-wrapper form');
        if (form) {
            const input = form.querySelector('input[name="search"]');
            if (input) input.value = '';
            form.submit();
        }
    }
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection