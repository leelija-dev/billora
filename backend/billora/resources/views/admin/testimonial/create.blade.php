@extends('admin.main-layout')
@section('title', 'Create New Testimonial')
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

    @media (max-width: 768px) {
        .main-content {
            padding: 16px 20px;
        }
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

    /* Back Button */
    .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 20px;
        background: #f1f5f9;
        color: #475569;
        border: none;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
    }

    .back-btn:hover {
        background: #e2e8f0;
        color: #1e293b;
        transform: translateX(-2px);
    }

    /* Form Container */
    .form-container {
        padding: 28px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }

    .form-group {
        margin-bottom: 0;
    }

    .form-group.full-width {
        grid-column: span 2;
    }

    .form-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 8px;
    }

    .form-label span {
        color: #ef4444;
        margin-left: 4px;
    }

    .form-input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        color: #1e293b;
        background: #f8fafc;
        transition: all 0.2s;
        outline: none;
    }

    .form-input:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input::placeholder {
        color: #94a3b8;
    }

    /* Textarea */
    .form-textarea {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        font-size: 14px;
        color: #1e293b;
        background: #f8fafc;
        transition: all 0.2s;
        outline: none;
        resize: vertical;
        min-height: 120px;
    }

    .form-textarea:focus {
        border-color: #2563eb;
        background: white;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    /* File Input */
    input[type="file"] {
        padding: 8px 10px;
        background: #f8fafc;
        cursor: pointer;
    }

    /* Toggle Switch */
    .toggle-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f8fafc;
        padding: 12px 16px;
        border-radius: 10px;
        border: 1px solid #e2e8f0;
    }

    .toggle-label {
        font-size: 14px;
        font-weight: 600;
        color: #1e293b;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
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
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    input:checked+.slider {
        background-color: #2563eb;
    }

    input:checked+.slider:before {
        transform: translateX(24px);
    }

    /* Rating Stars */
    .star-container {
        display: flex;
        gap: 8px;
        padding: 8px 0;
    }

    .star-container span {
        font-size: 28px;
        cursor: pointer;
        color: #e5e7eb;
        transition: 0.2s;
    }

    .star-container span.active,
    .star-container span:hover {
        color: #fbbf24;
        transform: scale(1.1);
    }

    /* Form Actions - FIXED BUTTON SECTION */
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #eef2f6;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 28px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        text-decoration: none;
        min-width: 140px;
    }

    .btn-primary {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-primary:active {
        transform: translateY(0);
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

    .btn svg {
        width: 18px;
        height: 18px;
    }

    /* Error Message */
    .text-danger {
        color: #ef4444;
        font-size: 12px;
        margin-top: 6px;
        display: block;
    }

    .js-error {
        color: #ef4444;
        font-size: 12px;
        margin-top: 6px;
        display: block;
    }

    /* Image Preview */
    .image-preview {
        margin-top: 12px;
        display: none;
    }

    .image-preview img {
        max-width: 120px;
        max-height: 120px;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        padding: 4px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        .form-group.full-width {
            grid-column: span 1;
        }
    }

    @media (max-width: 768px) {
        .card-header {
            flex-direction: column;
            align-items: stretch;
        }
        .form-container {
            padding: 20px;
        }
        .form-actions {
            flex-direction: column-reverse;
            gap: 12px;
        }
        .btn {
            width: 100%;
            justify-content: center;
            padding: 12px 20px;
        }
        .star-container span {
            font-size: 24px;
        }
        .back-btn {
            justify-content: center;
        }
    }

    /* Small phones */
    @media (max-width: 480px) {
        .form-container {
            padding: 16px;
        }
        .form-grid {
            gap: 16px;
        }
        .btn {
            min-width: auto;
        }
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Create New Testimonial</h1>
                <p>Add customer feedback, reviews, and ratings</p>
            </div>
            <a href="{{ route('admin.testimonial.index') }}" class="back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Testimonials
            </a>
        </div>

        <!-- Form Container -->
        <div class="form-container">
            <form id="testimonialForm" action="{{ route('admin.testimonial.store') }}" method="POST" enctype="multipart/form-data" novalidate>
                @csrf

                <div class="form-grid">
                    <!-- Left Column -->
                    <div>
                        <!-- Name -->
                        <div class="form-group">
                            <label class="form-label">Name <span>*</span></label>
                            <input type="text" name="name" class="form-input" placeholder="Enter customer name" value="{{ old('name') }}">
                            @error('name')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Role -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="form-label">Role <span>*</span></label>
                            <input type="text" name="role" class="form-input" placeholder="Enter role (e.g., CEO, Manager)" value="{{ old('role') }}">
                            @error('role')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Company -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="form-label">Company Name</label>
                            <input type="text" name="company" class="form-input" placeholder="Enter company name" value="{{ old('company') }}">
                            @error('company')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Shop/Business Type -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="form-label">Business Type</label>
                            <input type="text" name="shop_type" class="form-input" placeholder="Enter business type" value="{{ old('shop_type') }}">
                            @error('shop_type')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div>
                        <!-- Image -->
                        <div class="form-group">
                            <label class="form-label">Image</label>
                            <input type="file" name="image" class="form-input" id="imageInput" accept="image/*">
                            <div class="image-preview" id="imagePreview">
                                <img src="" alt="Preview">
                            </div>
                            @error('image')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Rating -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="form-label">Rating <span>*</span></label>
                            <div id="starRating" class="star-container">
                                <span data-value="1">☆</span>
                                <span data-value="2">☆</span>
                                <span data-value="3">☆</span>
                                <span data-value="4">☆</span>
                                <span data-value="5">☆</span>
                            </div>
                            <input type="hidden" name="rating" id="ratingValue">
                            @error('rating')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>

                        <!-- Status Toggle -->
                        <div class="form-group" style="margin-top: 20px;">
                            <label class="form-label">Status</label>
                            <div class="toggle-group">
                                <span class="toggle-label">Active</span>
                                <label class="switch">
                                    <input type="hidden" name="is_active" value="0">
                                    <input type="checkbox" name="is_active" value="1" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            @error('is_active')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Message - Full Width -->
                <div class="form-group full-width" style="margin-top: 20px;">
                    <label class="form-label">Testimonial Message <span>*</span></label>
                    <textarea name="message" class="form-textarea" placeholder="Write customer testimonial here...">{{ old('message') }}</textarea>
                    @error('message')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Form Actions - FIXED BUTTONS -->
                <div class="form-actions">
                    <a href="{{ route('admin.testimonial.index') }}" class="btn btn-secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                        Cancel
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                        </svg>
                        Create Testimonial
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Star Rating Functionality
    document.addEventListener("DOMContentLoaded", function() {
        const stars = document.querySelectorAll('#starRating span');
        const ratingInput = document.getElementById('ratingValue');

        stars.forEach((star, index) => {
            // Click event
            star.addEventListener('click', function() {
                let value = this.getAttribute('data-value');
                ratingInput.value = value;

                stars.forEach((s, i) => {
                    if (i < value) {
                        s.textContent = '★';
                        s.classList.add('active');
                    } else {
                        s.textContent = '☆';
                        s.classList.remove('active');
                    }
                });
            });

            // Hover effect
            star.addEventListener('mouseover', function() {
                stars.forEach((s, i) => {
                    s.textContent = i <= index ? '★' : '☆';
                    s.style.color = i <= index ? '#fbbf24' : '#e5e7eb';
                });
            });

            // Reset after hover
            star.addEventListener('mouseout', function() {
                let selected = ratingInput.value;

                stars.forEach((s, i) => {
                    if (i < selected) {
                        s.textContent = '★';
                        s.style.color = '#fbbf24';
                    } else {
                        s.textContent = '☆';
                        s.style.color = '#e5e7eb';
                    }
                });
            });
        });

        // Image Preview
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = imagePreview.querySelector('img');

        if (imageInput) {
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        previewImg.src = event.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    imagePreview.style.display = 'none';
                    previewImg.src = '';
                }
            });
        }
    });

    // Form Validation
    document.addEventListener("DOMContentLoaded", function() {
        const form = document.getElementById('testimonialForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                let name = document.querySelector('input[name="name"]');
                let role = document.querySelector('input[name="role"]');
                let message = document.querySelector('textarea[name="message"]');
                let rating = document.querySelector('input[name="rating"]');

                document.querySelectorAll('.js-error').forEach(el => el.remove());

                function showError(input, msg) {
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.innerText = msg;
                    input.parentNode.appendChild(error);
                    isValid = false;
                }

                if (!name.value.trim()) showError(name, "Customer name is required");
                if (!role.value.trim()) showError(role, "Role is required");
                if (!message.value.trim()) showError(message, "Testimonial message is required");
                if (!rating.value.trim()) showError(document.getElementById('starRating'), "Please select a rating");

                if (!isValid) e.preventDefault();
            });
        }
    });
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection