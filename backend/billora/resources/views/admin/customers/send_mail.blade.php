@extends('admin.main-layout')
@section('title','Send Mail to Customer')
@section('content')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        /* Main Content */
        .main-content {
            padding: 40px;
            background: #f0f2f5;
            min-height: 100vh;
            width: 100%;
        }

        /* Page Header - Modern */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: white;
            padding: 24px 32px;
            border-radius: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .header-left h1 {
            font-size: 28px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
        }

        .header-left p {
            color: #64748b;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .header-left p svg {
            width: 16px;
            height: 16px;
            fill: #94a3b8;
        }

        .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            color: #475569;
            border: none;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .back-btn:hover {
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            transform: translateX(-4px);
            color: #1e293b;
        }

        .back-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            transition: transform 0.2s ease;
        }

        .back-btn:hover svg {
            transform: translateX(-4px);
        }

        /* Alert Success */
        .alert-success {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            color: #065f46;
            padding: 16px 24px;
            border-radius: 16px;
            margin-bottom: 24px;
            border-left: 4px solid #10b981;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .alert-success svg {
            width: 20px;
            height: 20px;
            fill: #10b981;
        }

        /* Form Container */
        .form-container {
            background: white;
            border-radius: 28px;
            box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .form-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 28px 32px;
            color: white;
        }

        .form-header h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-header h2 svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        .form-header p {
            font-size: 14px;
            opacity: 0.9;
        }

        .form-body {
            padding: 32px;
        }

        /* Customer Info Card */
        .customer-info-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 32px;
            border: 1px solid #e2e8f0;
        }

        .customer-info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
        }

        .customer-info-header h3 {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .customer-info-header h3 svg {
            width: 20px;
            height: 20px;
            fill: #667eea;
        }

        .customer-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
        }

        .customer-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            max-height: 150px;
            overflow-y: auto;
        }

        .customer-email-tag {
            background: white;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 13px;
            color: #334155;
            border: 1px solid #e2e8f0;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }

        .customer-email-tag:hover {
            border-color: #667eea;
            background: #f0f7ff;
            transform: translateY(-2px);
        }

        .customer-email-tag svg {
            width: 14px;
            height: 14px;
            fill: #94a3b8;
        }

        .more-count {
            background: #e2e8f0;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 13px;
            font-weight: 600;
            color: #475569;
        }

        /* Form Groups */
        .form-group {
            margin-bottom: 28px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .form-label span {
            color: #ef4444;
            margin-left: 4px;
        }

        .input-wrapper {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }

        .input-icon svg {
            width: 18px;
            height: 18px;
            fill: #94a3b8;
        }

        .form-input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            font-size: 14px;
            color: #1e293b;
            background: white;
            transition: all 0.3s ease;
            outline: none;
        }

        .form-input.with-icon {
            padding-left: 48px;
        }

        .form-input:hover {
            border-color: #cbd5e1;
        }

        .form-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        /* Summernote Wrapper */
        .note-editor {
            border-radius: 16px !important;
            overflow: hidden;
            border: 2px solid #e2e8f0 !important;
            transition: all 0.3s ease;
        }

        .note-editor:focus-within {
            border-color: #667eea !important;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .note-toolbar {
            background: #f8fafc !important;
            border-bottom: 1px solid #e2e8f0 !important;
        }

        /* Error Messages */
        .text-danger {
            color: #ef4444;
            font-size: 12px;
            margin-top: 8px;
            display: block;
            padding-left: 16px;
        }

        /* Form Actions */
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #f1f5f9;
        }

        .btn {
            padding: 12px 32px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #475569;
            border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
            color: #1e293b;
            transform: translateY(-2px);
        }

        /* Helper Text */
        .helper-text {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            padding-left: 16px;
        }

        .helper-text svg {
            width: 14px;
            height: 14px;
            fill: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .main-content {
                padding: 20px;
            }

            .page-header {
                flex-direction: column;
                gap: 15px;
                text-align: center;
                padding: 20px;
            }

            .header-left h1 {
                font-size: 24px;
            }

            .form-header {
                padding: 20px;
            }

            .form-body {
                padding: 20px;
            }

            .form-actions {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }

            .customer-info-header {
                flex-direction: column;
                gap: 10px;
                align-items: flex-start;
            }
        }

        /* Loading State */
        .btn-primary.loading {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .btn-primary.loading svg {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        /* Custom Scrollbar */
        .customer-list::-webkit-scrollbar {
            width: 6px;
        }

        .customer-list::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
        }

        .customer-list::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }

        .customer-list::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
    </style>

    <!-- Main Content -->
    <div class="main-content">

        <!-- Page Header -->
        <div class="page-header">
            <div class="header-left">
                <h1>Send Mail to Customer</h1>
                <p>
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    Compose and send emails to selected customers
                </p>
            </div>
            <a href="{{ route('admin.customers.index') }}" class="back-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Customers
            </a>
        </div>

        @if (session('success'))
            <div class="alert-success">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {{ session('success') }}
            </div>
        @endif

        <!-- Form Container -->
        <div class="form-container">
            <div class="form-header">
                <h2>
                    <svg viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Compose Email
                </h2>
                <p>Create a professional email to send to your selected customers</p>
            </div>

            <div class="form-body">
                <form id="mailForm" action="{{ route('admin.customers.send-mail') }}" method="POST"
                    enctype="multipart/form-data" novalidate>
                    @csrf

                    <!-- Customer Info Card -->
                    <div class="customer-info-card">
                        <div class="customer-info-header">
                            <h3>
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                Recipients ({{ count($customers) }} customers)
                            </h3>
                            <span class="customer-badge">Selected Customers</span>
                        </div>

                        <div class="customer-list">
                            @php $count = 0; @endphp
                            @foreach ($customers as $customer)
                                <div class="customer-email-tag">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    {{ $customer->email }}
                                </div>
                                @php $count++; @endphp
                                @if ($count >= 5)
                                    @break
                                @endif
                            @endforeach

                            @if (count($customers) > 5)
                                <div class="more-count">
                                    + {{ count($customers) - 5 }} more customers
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Hidden Customer IDs -->
                    @foreach ($customer_ids as $id)
                        <input type="hidden" name="customer_ids[]" value="{{ $id }}">
                    @endforeach

                    <!-- Subject Field -->
                    <div class="form-group">
                        <label class="form-label">
                            Subject <span>*</span>
                        </label>
                        <div class="input-wrapper">
                            <div class="input-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <input type="text" name="subject" class="form-input with-icon" placeholder="Enter email subject..." value="{{ old('subject') }}" required>
                        </div>
                        @error('subject')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Message Field -->
                    <div class="form-group">
                        <label class="form-label">
                            Message <span>*</span>
                        </label>
                        <textarea name="message" id="message" class="form-textarea" placeholder="Write your message here...">{{ old('message') }}</textarea>
                        @error('message')
                            <span class="text-danger" style="color: red">{{ $message }}</span>
                        @enderror
                        <div class="helper-text">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            Supports rich text formatting, images, and links
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="window.history.back()">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary" id="submitBtn">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                            Send Mail
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Summernote CSS -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css" rel="stylesheet">

    <!-- jQuery (Required) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Summernote JS -->
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js"></script>

    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
        $(document).ready(function() {
            $('#message').summernote({
                height: 300,
                placeholder: 'Write your message here...',
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'underline', 'clear']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture']],
                    ['view', ['fullscreen', 'codeview', 'help']]
                ],
                callbacks: {
                    onInit: function() {
                        console.log('Summernote initialized');
                    }
                }
            });
        });
    </script>

    <script id="validationfix">
        document.addEventListener("DOMContentLoaded", function() {

            const submitBtn = document.getElementById('submitBtn');
            const form = document.getElementById('mailForm');

            form.addEventListener('submit', function(e) {

                let isValid = true;
                let subject = document.querySelector('input[name="subject"]');
                let messageContent = $('#message').summernote('code');

                // Remove old errors
                document.querySelectorAll('.js-error').forEach(el => el.remove());

                function showError(input, msg) {
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.style.color = '#ef4444';
                    error.style.fontSize = '12px';
                    error.style.marginTop = '8px';
                    error.style.display = 'block';
                    error.style.paddingLeft = '16px';
                    error.innerText = msg;

                    input.closest('.form-group').appendChild(error);
                    isValid = false;
                }

                // Subject validation
                if (subject.value.trim() === '') {
                    showError(subject, "Subject cannot be blank!");
                }

                // Message validation
                if (messageContent === '' || messageContent === '<p><br></p>' || messageContent === '<p><br></p>\n') {
                    let messageBox = document.getElementById('message');
                    showError(messageBox, "Message cannot be blank!");
                }

                if (!isValid) {
                    e.preventDefault();
                    // Scroll to first error
                    const firstError = document.querySelector('.js-error');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    // Show loading state
                    submitBtn.classList.add('loading');
                    submitBtn.innerHTML = '<svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;"><path d="M12 2v4l3-3-3-3z M12 22v-4l-3 3 3 3z M4 12h4L5 9 4 12z M20 12h-4l3 3 4-3z"/></svg> Sending...';
                    submitBtn.disabled = true;
                }
            });
        });
    </script>

    @if (session('success'))
        <script>
            Swal.fire({
                icon: 'success',
                title: 'Email Sent Successfully!',
                text: "{{ session('success') }}",
                confirmButtonColor: '#667eea',
                confirmButtonText: 'OK',
                timer: 3000
            });
        </script>
    @endif
@endsection