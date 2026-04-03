@extends('admin.main-layout')
@section('title','Mail Detail')
@section('content')    
    <style>
       body {
    background: #f1f5f9;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 2rem 1rem;
}

/* main container */
.mail-detail-card {
    max-width: 900px;
    width: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    overflow: hidden;
}

/* header */
.mail-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
    position: sticky;
    top: 0;
    z-index: 10;
}

/* back button */
.back-button {
    background: #eef2ff;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #3730a3;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
}

.back-button:hover {
    background: #e0e7ff;
}

/* subject */
.mail-subject {
    font-size: 1.6rem;
    font-weight: 600;
    padding: 1.5rem;
    color: #111827;
    border-bottom: 1px solid #f1f5f9;
}

/* customer card */
.customer-meta-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
}

.avatar-circle {
    width: 42px;
    height: 42px;
    background: #6366f1;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.customer-text {
    margin-left: 10px;
}

.customer-email {
    font-weight: 600;
    font-size: 0.95rem;
    color: #111827;
}

.customer-name {
    font-size: 0.8rem;
    color: #6b7280;
}

.date-chip {
    font-size: 0.8rem;
    color: #475569;
}

/* message */
.message-panel {
    padding: 1.5rem;
}

.message-label {
    font-size: 0.75rem;
    color: #6366f1;
    font-weight: 600;
    margin-bottom: 0.8rem;
    text-transform: uppercase;
}

.message-body {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 10px;
    line-height: 1.7;
    color: #1f2937;
    font-size: 0.95rem;
}

/* footer */
.footer-meta {
    padding: 1rem 1.5rem;
    font-size: 0.75rem;
    color: #9ca3af;
    border-top: 1px solid #e5e7eb;
}

/* mobile */
@media (max-width: 640px) {
    .mail-subject {
        font-size: 1.3rem;
    }

    .customer-meta-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
}
.send-mail-btn {
    background: #2563eb; /* primary blue */
    color: #fff;
    border: none;
    padding: 0.6rem 1.4rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.send-mail-btn:hover {
    background: #1d4ed8;
    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
    transform: translateY(-1px);
}

.send-mail-btn i {
    font-size: 1rem;
}

.mail-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* LEFT BUTTON GROUP */
.header-left {
    display: flex;
    align-items: center;
    gap: 12px; /* spacing between buttons */
}

/* fix anchor button look */
.back-button {
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}
    </style>

    <div style="display:flex; width:100%;">

</div>
    <div class="mail-detail-card">

    <!-- Header -->
   <div class="mail-header-bar">

    <!-- LEFT SIDE -->
    <div class="header-left">

        <a href="{{ route('admin.mail-history') }}" class="back-button">
            <i class="fas fa-arrow-left"></i> Back
        </a>

        <form action="{{ route('admin.customers.customer-mail') }}" method="GET">
            <input type="hidden" name="ids" value="{{ $mailHistory->customer_id }}">

            <button type="submit" class="send-mail-btn">
                <i class="fab fa-telegram-plane"></i> Send Mail
            </button>
        </form>

    </div>

    <!-- RIGHT SIDE -->
    <div class="badge-single">
        <i class="fas fa-envelope-open-text"></i> Single message view
    </div>

</div>

    <!-- Subject -->
    <div class="mail-subject">
        {{ $mailHistory->subject ?? 'No Subject' }}
    </div>

    <!-- Customer Info -->
    <div class="customer-meta-card">
        <div style="display:flex; align-items:center; gap:12px;">
            <div class="avatar-circle">
                {{ strtoupper(optional($mailHistory->customer)->name[0] ?? strtoupper(optional($mailHistory->customer)->email[0])) }}
            </div>

            <div>
                <div class="customer-email">
                    {{ optional($mailHistory->customer)->email ?? 'N/A' }}
                </div>
                <div class="customer-name">
                    {{ optional($mailHistory->customer)->name ?? 'N/A' }}
                </div>
            </div>
        </div>

        <div class="date-chip">
            {{ $mailHistory->created_at ? $mailHistory->created_at->format('M d, Y h:i A') : 'N/A' }}
        </div>
    </div>

    <!-- Message -->
    <div class="message-panel">
        <div class="message-label">
            Message Content
        </div>

        <div class="message-body">
    

    <p>
        {!! ($mailHistory->message) !!}
    </p>
</div>
    </div>

    <!-- Footer -->
    <div class="footer-meta">
        Message ID: {{ $mailHistory->id ?? 'N/A' }}
    </div>

</div>
@endsection
