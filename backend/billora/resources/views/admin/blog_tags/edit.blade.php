@extends('admin.main-layout')
@section('title', 'Create Business Type')
@section('content')
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
            min-height: 100vh;
        }

        /* Main Content - Full Width */
        .main-content {
            padding: 30px;
            background: transparent;
            min-height: 100vh;
            width: 100%;
            max-width: 100%;
        }

        /* Page Header - Modern Glass Effect */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            background: white;
            padding: 24px 32px;
            border-radius: 24px;
            border: 1px solid rgba(226, 232, 240, 0.6);
            box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(10px);
        }

        .header-left h1 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 6px;
            letter-spacing: -0.3px;
        }

        .header-left p {
            color: #64748b;
            font-size: 14px;
            font-weight: 400;
        }

        .back-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 22px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: #475569;
            border: 1px solid #e2e8f0;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
        }

        .back-btn:hover {
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            color: #2563eb;
            border-color: #2563eb;
            transform: translateX(-2px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
        }

        .back-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
            transition: transform 0.2s ease;
        }

        .back-btn:hover svg {
            transform: translateX(-2px);
        }

        /* Form Container - Premium Card */
        .form-container {
            background: white;
            border-radius: 28px;
            border: 1px solid #eef2f6;
            padding: 32px;
            box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
            width: 100%;
            transition: all 0.3s ease;
        }

        .form-container:hover {
            box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.12);
        }

        /* Two Column Layout */
        .two-column-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
        }

        /* Left & Right Column */
        .left-column, .right-column {
            background: #fafcff;
            border-radius: 20px;
            padding: 8px;
        }

        /* Section Card */
        .section-card {
            background: white;
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #eef2f6;
            transition: all 0.2s ease;
        }

        .section-card:last-child {
            margin-bottom: 0;
        }

        .section-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-bottom: 12px;
            border-bottom: 2px solid #eef2f6;
        }

        .section-title-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .section-title-icon svg {
            width: 18px;
            height: 18px;
            fill: white;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group:last-child {
            margin-bottom: 0;
        }

        .form-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
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

        .form-input, .form-textarea, .form-select {
            width: 100%;
            padding: 14px 16px;
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            font-size: 14px;
            color: #1e293b;
            background: #ffffff;
            transition: all 0.2s ease;
            outline: none;
        }

        .form-input.with-icon {
            padding-left: 44px;
        }

        .form-input:hover, .form-textarea:hover, .form-select:hover {
            border-color: #cbd5e1;
            background: #fafcff;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
            border-color: #2563EB;
            background: white;
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
            resize: vertical;
            min-height: 100px;
        }

        /* Toggle Switch */
        .toggle-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
            padding: 20px 24px;
            border-radius: 18px;
            border: 1.5px solid #eef2f6;
            transition: all 0.2s ease;
        }

        .toggle-group:hover {
            border-color: #2563eb30;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
        }

        .toggle-label {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
        }

        .toggle-desc {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 4px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 56px;
            height: 30px;
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
            transition: 0.3s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.3s;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        input:checked+.slider {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }

        input:checked+.slider:before {
            transform: translateX(26px);
        }

        /* Helper Text */
        .helper-text {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .helper-text svg {
            width: 14px;
            height: 14px;
            fill: #94a3b8;
        }

        /* Error Styling */
        .text-danger {
            color: #ef4444;
            font-size: 12px;
            margin-top: 6px;
            display: block;
            padding-left: 4px;
        }

        /* Form Actions */
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #eef2f6;
        }

        .btn {
            padding: 12px 32px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
        }

        .btn-secondary {
            background: #f1f5f9;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
            background: #fee2e2;
            color: #dc2626;
            border-color: #dc2626;
            transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .two-column-layout {
                grid-template-columns: 1fr;
                gap: 24px;
            }
        }

        @media (max-width: 768px) {
            .main-content {
                padding: 16px;
            }
            .page-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
                padding: 20px;
            }
            .form-container {
                padding: 20px;
            }
            .section-card {
                padding: 18px;
            }
            .form-actions {
                flex-direction: column;
            }
            .btn {
                width: 100%;
                justify-content: center;
            }
            .toggle-group {
                flex-direction: column;
                gap: 12px;
                text-align: center;
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-container {
            animation: fadeInUp 0.4s ease-out;
        }
    </style>

    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-left">
                <h1>Edit Blog Tag</h1>
                <p>Update the details of this blog tag</p>
            </div>
            <a href="{{ route('admin.blog-tag.index') }}" class="back-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Tags
            </a>
        </div>

        <!-- Form Container -->
        <div class="form-container">
            <form action="{{ route('admin.blog-tag.update', $tag->id) }}" method="POST" enctype="multipart/form-data">
                @csrf

                <div>
                    <!-- LEFT COLUMN -->
                    <div >
                        <!-- Basic Information -->
                        <div class="section-card">

                            <div class="form-group">
                                <label class="form-label">Tag Name <span>*</span></label>
                                <div class="input-wrapper">
                                    <span class="input-icon">
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.59 13.41L11 3.83V3H4v7h.83l9.58 9.59a2 2 0 002.83 0l3.35-3.35a2 2 0 000-2.83zM7.5 8A1.5 1.5 0 119 6.5 1.5 1.5 0 017.5 8z"/>
    </svg>
</span>
                                    <input type="text" name="name" class="form-input with-icon" 
                                        placeholder="Enter Tag Name" 
                                        value="{{ $tag->name }}" required>
                                </div>
                                @error('name')
                                    <span class="text-danger">{{ $message }}</span>
                                @enderror
                            </div>
                        </div>

                        <!-- Status Toggle -->
                        <div class="section-card">
                            <div class="section-title">
                                <div class="section-title-icon">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                                    </svg>
                                </div>
                                <span>Status</span>
                            </div>
                            <div class="toggle-group">
                                <div>
                                    <div class="toggle-label">Active Status</div>
                                    
                                </div>
                                <label class="switch">
                                    <input type="hidden" name="status" value="0">
                                    <input type="checkbox" name="status" value="1" {{ old('status', $tag->status) == '1' ? 'checked' : '' }}>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            @error('status')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                   

                <!-- Form Actions -->
                <div class="form-actions">
                    <a href="{{ route('admin.blog-tag.index') }}" class="btn btn-secondary">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                        Cancel
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-10H5V5h11v4z"/>
                        </svg>
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Auto-generate slug preview based on tag name
        const nameInput = document.querySelector('input[name="name"]');
        const slugPreview = document.getElementById('slugPreview');

        function generateSlug(value) {
            if (!value) return '';
            return value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        function updateSlug() {
            const rawName = nameInput.value.trim();
            const slug = generateSlug(rawName) || 'business-type';
            slugPreview.value = slug;
        }

        nameInput.addEventListener('input', updateSlug);
        updateSlug(); // initial load
    </script>
@endsection