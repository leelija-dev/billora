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
            background: #f8fafc;
            min-height: 100vh;
        }

        /* Main Content - Full Width */
        .main-content {
            padding: 30px;
            background: #f8fafc;
            min-height: 100vh;
            width: 100%;
        }

        /* Page Header */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            background: white;
            padding: 20px 25px;
            border-radius: 16px;
            border: 1px solid #eef2f6;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }

        .header-left h1 {
            font-size: 26px;
            font-weight: 700;
            color: #111827;
            letter-spacing: -0.5px;
            margin-bottom: 5px;
        }

        .header-left p {
            color: #64748b;
            font-size: 14px;
        }

        .back-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 18px;
            background: #f1f5f9;
            color: #475569;
            border: none;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .back-btn:hover {
            background: #e2e8f0;
            color: #1e293b;
        }

        .back-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        /* Form Container - Full Width */
        .form-container {
            background: white;
            border-radius: 20px;
            border: 1px solid #eef2f6;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
            width: 100%;
        }

        .form-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eef2f6;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            align-items: start;
        }

        .form-group {
            margin-bottom: 0;
        }

        .form-group.full-width {
            grid-column: span 2;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
        }

        .form-label span {
            color: #ef4444;
            margin-left: 4px;
        }

        .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .input-icon svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-size: 14px;
            color: #1e293b;
            background: #f8fafc;
            transition: all 0.2s ease;
            outline: none;
        }

        .form-input.with-icon {
            padding-left: 44px;
        }

        .form-input:hover {
            border-color: #cbd5e1;
            background: white;
        }

        .form-input:focus {
            border-color: #2563EB;
            background: white;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input::placeholder {
            color: #94a3b8;
            font-size: 14px;
        }

        .form-input[readonly] {
            background: #f1f5f9;
            border-color: #e2e8f0;
            color: #64748b;
            cursor: not-allowed;
        }

        /* Currency Group */
        .currency-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .currency-select {
            padding: 12px 18px;
            background: #2563EB;
            color: white;
            border: 1px solid #2563EB;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            appearance: none;
            min-width: 100px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
        }

        .currency-select option {
            background: white;
            color: #1e293b;
        }

        .currency-input {
            flex: 1;
        }

        /* Select Input */
        .form-select {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-size: 14px;
            color: #1e293b;
            background: #f8fafc;
            transition: all 0.2s ease;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 14px center;
            background-size: 16px;
        }

        /* Textarea */
        .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-size: 14px;
            color: #1e293b;
            background: #f8fafc;
            transition: all 0.2s ease;
            outline: none;
            resize: vertical;
            min-height: 100px;
        }

        .form-textarea:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            background: white;
        }

        /* Features Section */
        .features-section {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin: 20px 0;
            border: 1px solid #eef2f6;
        }

        .features-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
        }

        .features-header h3 {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
        }

        .add-feature-btn {
            background: #2563EB;
            color: white;
            border: none;
            border-radius: 30px;
            padding: 8px 18px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .add-feature-btn:hover {
            background: #1D4ED8;
        }

        .add-feature-btn svg {
            width: 16px;
            height: 16px;
            fill: white;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            background: white;
            padding: 12px 16px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }

        .feature-icon {
            width: 32px;
            height: 32px;
            background: #e6f0ff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .feature-icon svg {
            width: 16px;
            height: 16px;
            fill: #2563EB;
        }

        .feature-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
        }

        .feature-input:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .remove-feature {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .remove-feature:hover {
            background: #fee2e2;
        }

        .remove-feature svg {
            width: 18px;
            height: 18px;
            fill: #94a3b8;
        }

        .remove-feature:hover svg {
            fill: #ef4444;
        }

        /* Toggle Switch */
        .toggle-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f8fafc;
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }

        .toggle-label {
            font-size: 15px;
            font-weight: 600;
            color: #334155;
        }

        .toggle-desc {
            font-size: 13px;
            color: #94a3b8;
            margin-top: 3px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 52px;
            height: 28px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #cbd5e1;
            transition: .3s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input:checked+.slider {
            background-color: #2563EB;
        }

        input:checked+.slider:before {
            transform: translateX(24px);
        }

        /* Form Actions */
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 15px;
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #eef2f6;
        }

        .btn {
            padding: 12px 28px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: #2563EB;
            color: white;
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.15);
        }

        .btn-primary:hover {
            background: #1D4ED8;
            transform: translateY(-1px);
            box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2);
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #475569;
        }

        .btn-secondary:hover {
            background: #e2e8f0;
            color: #1e293b;
        }

        /* Helper text */
        .helper-text {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 6px;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .helper-text svg {
            width: 14px;
            height: 14px;
            fill: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .main-content {
                padding: 15px;
            }

            .form-grid {
                grid-template-columns: 1fr;
            }

            .form-group.full-width {
                grid-column: span 1;
            }

            .currency-group {
                flex-direction: column;
                align-items: stretch;
            }

            .currency-select {
                width: 100%;
            }

            .form-actions {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }
        }

        /* Permissions Grid */
        .permissions-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            /* Left & Right */
            gap: 15px;
        }

        /* Permission Card */
        .permission-card {
            display: flex;
            align-items: center;
            gap: 10px;
            background: white;
            border: 1px solid #e2e8f0;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .permission-card:hover {
            border-color: #2563EB;
            background: #f0f7ff;
        }

        /* Checkbox */
        .permission-card input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #2563EB;
            cursor: pointer;
        }

        /* Text */
        .permission-title {
            font-size: 14px;
            font-weight: 500;
            color: #1e293b;
        }

        @media (max-width: 768px) {
            .permissions-grid {
                grid-template-columns: 1fr;
                /* Single column on mobile */
            }
        }

        .form-grid {
            gap: 25px;
        }
    </style>

    <!-- Main Content - Full Width -->
    <div class="main-content">

        <!-- Page Header -->
        <div class="page-header">
            <div class="header-left">
                <h1>Send Mail to Customer</h1>
            </div>
            <a href="{{ route('admin.customers.index') }}" class="back-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back
            </a>
        </div>
        @if (session('success'))
            <div style="background: #d1fae5; color: #065f46; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
                {{ session('success') }}
            </div>
        @endif
        <!-- Form Container - Full Width -->
        <div class="form-container">
            <form id="mailForm" action="{{ route('admin.customers.send-mail') }}" method="POST"
                enctype="multipart/form-data" novalidate>
                @csrf

                <!-- Plan Details -->
                <div class="form-title">Mail Details</div>
                {{-- <div>{{ implode(', ', $customer_ids) }} --}}
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Mail to ({{ count($customers) }} customers)
                    </label>

                    <div class="border rounded-lg p-3 bg-gray-50 max-h-40 overflow-y-auto">

                        @php $count = 0; @endphp

                        @foreach ($customers as $customer)
                            <div class="text-sm text-gray-800 py-1 border-b last:border-none">
                                {{ $customer->email }}
                            </div>

                            @php $count++; @endphp

                            @if ($count >= 5)
                                @break
                            @endif
                        @endforeach

                        @if (count($customers) > 5)
                            <div class="text-sm text-blue-500 mt-2">
                                + {{ count($customers) - 5 }} more...
                            </div>
                        @endif

                    </div>
                </div>

                <div class="form-group">
                    <!--  Customer ids -->
                    @foreach ($customer_ids as $id)
                        <input type="hidden" name="customer_ids[]" value="{{ $id }}">
                    @endforeach
                    <div class="form-group">
                        <label class="form-label">
                            Subject <span>*</span>
                        </label>
                        <div class="input-wrapper">

                            <input type="text" name="subject" class="form-input " placeholder="Enter subject... "
                                value="{{ old('subject') }}" required>
                            @error('subject')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <!-- Description FULL WIDTH -->
                    <div class="form-group mt-2">
                        <label class="form-label">Message <span>*</span></label>
                        <textarea name="message" id="message" class="form-textarea">
                            {{ old('message') }}
                        </textarea>
                    </div>
                    @error('message')
                        <span class="text-danger" style="color: red">{{ $message }}</span>
                    @enderror


                </div>


                <!-- Form Actions -->
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary">Cancel</button>
                    <button type="submit" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;">
                            <path
                                d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-10H5V5h11v4z" />
                        </svg>
                        Send Mail
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Summernote CSS -->
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css" rel="stylesheet">

    <!-- jQuery (Required) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Summernote JS -->
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js"></script>

    <script>
        $(document).ready(function() {
            $('#message').summernote({
                height: 300,
                placeholder: 'Enter message...',
            });

        });
    </script>
    <script id="validationfix">
        document.addEventListener("DOMContentLoaded", function() {

            document.getElementById('mailForm').addEventListener('submit', function(e) {

                let isValid = true;

                let subject = document.querySelector('input[name="subject"]');
                let messageContent = $('#message').summernote('code');

                // Remove old errors
                document.querySelectorAll('.js-error').forEach(el => el.remove());

                function showError(input, msg) {
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.style.color = 'red';
                    error.style.fontSize = '12px';
                    error.innerText = msg;

                    input.closest('.form-group').appendChild(error);
                    isValid = false;
                }

                // Subject validation
                if (subject.value.trim() === '') {
                    showError(subject, "Subject cannot be blank!");
                }

                // Message validation (Summernote fix)
                if (messageContent === '' || messageContent === '<p><br></p>') {
                    let messageBox = document.getElementById('message');
                    showError(messageBox, "Message cannot be blank!");
                }

                if (!isValid) {
                    e.preventDefault();
                }
            });

        });
    </script>
    @if (session('success'))
        <script>
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "{{ session('success') }}",
                confirmButtonColor: '#3085d6'
            });
        </script>
    @endif
@endsection
