@extends('admin.main-layout')
@section('title', 'Edit Testimonial')
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
        padding: 0px 0px;
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
        transform: translateX(-2px);
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
        min-height: 120px;
    }

    .form-textarea:focus {
        border-color: #2563EB;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        background: white;
    }

    /* Toggle Switch */
    .toggle-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #f8fafc;
        padding: 12px 16px;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
    }

    .toggle-label {
        font-size: 14px;
        font-weight: 600;
        color: #334155;
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

    /* Form Actions - FIXED BUTTONS */
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 30px;
        padding-top: 24px;
        border-top: 1px solid #eef2f6;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 28px;
        border-radius: 40px;
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

    .btn-danger {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
    }

    .btn-danger:hover {
        background: #fee2e2;
        color: #b91c1c;
        transform: translateY(-2px);
    }

    .btn svg {
        width: 18px;
        height: 18px;
    }

    /* Error Messages */
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
    .current-image {
        margin-top: 10px;
        padding: 10px;
        background: #f8fafc;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .current-image img {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        object-fit: cover;
    }

    .current-image span {
        font-size: 13px;
        color: #64748b;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .main-content {
            padding: 15px;
        }
        .page-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
        }
        .back-btn {
            justify-content: center;
        }
        .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
        }
        .form-group.full-width {
            grid-column: span 1;
        }
        .form-actions {
            flex-direction: column-reverse;
            gap: 12px;
        }
        .btn {
            width: 100%;
            justify-content: center;
        }
        .star-container span {
            font-size: 24px;
        }
    }

    @media (max-width: 480px) {
        .form-container {
            padding: 16px;
        }
        .page-header {
            padding: 16px;
        }
        .header-left h1 {
            font-size: 22px;
        }
    }

    .mt-2 {
        margin-top: 20px;
    }
</style>

<div class="main-content">
    <!-- Page Header -->
    <div class="page-header">
        <div class="header-left">
            <h1>Edit Testimonial</h1>
            <p>Update customer feedback, reviews, and ratings</p>
        </div>
        <a href="{{ route('admin.testimonial.index') }}" class="back-btn">
            <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Testimonials
        </a>
    </div>

    <!-- Form Container - Full Width -->
    <div class="form-container">
        <form id="testimonialForm" action="{{ route('admin.testimonial.update', $testimonial->id) }}" method="POST" enctype="multipart/form-data" novalidate>
            @csrf
            

            <div class="form-grid">
                <!-- Name -->
                <div class="form-group">
                    <label class="form-label">Name <span>*</span></label>
                    <input type="text" name="name" class="form-input" value="{{ old('name', $testimonial->name ?? '') }}" placeholder="Enter customer name">
                    @error('name')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Image -->
                <div class="form-group">
                    <label class="form-label">Image</label>
                    <input type="file" name="image" class="form-input" accept="image/*">
                    @if($testimonial->image)
                        <div class="current-image">
                            <img src="{{ asset($testimonial->image) }}" alt="Current image">
                            <span>Current image</span>
                        </div>
                    @endif
                    @error('image')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Role -->
                <div class="form-group">
                    <label class="form-label">Role <span>*</span></label>
                    <input type="text" name="role" value="{{ old('role', $testimonial->role ?? '') }}" class="form-input" placeholder="Enter role (e.g., CEO, Manager)">
                    @error('role')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Company -->
                <div class="form-group">
                    <label class="form-label">Company Name</label>
                    <input type="text" name="company" value="{{ old('company', $testimonial->company ?? '') }}" class="form-input" placeholder="Enter company name">
                    @error('company')
                        <span class="text-danger">{{ $message }}</span>  
                    @enderror
                </div>

                <!-- Business Type -->
                <div class="form-group">
                    <label class="form-label">Business Type</label>
                    <input type="text" name="shop_type" value="{{ old('shop_type', $testimonial->shop_type ?? '') }}" class="form-input" placeholder="Enter business type">
                    @error('shop_type')  
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Rating -->
                <div class="form-group">
                    <label class="form-label">Rating <span>*</span></label>
                    <div id="starRating" class="star-container" data-rating="{{ old('rating', $testimonial->rating ?? 0) }}">
                        <span data-value="1">☆</span>
                        <span data-value="2">☆</span>
                        <span data-value="3">☆</span>
                        <span data-value="4">☆</span>
                        <span data-value="5">☆</span>
                    </div>
                    <input type="hidden" name="rating" id="ratingValue" value="{{ old('rating', $testimonial->rating ?? '') }}">
                    @error('rating')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Status Toggle -->
                <div class="form-group">
                    <label class="form-label">Status</label>
                    <div class="toggle-group">
                        <span class="toggle-label">Active</span>
                        <label class="switch">
                            <input type="hidden" name="is_active" value="0">
                            <input type="checkbox" name="is_active" value="1" 
                                {{ old('is_active', $testimonial->is_active ?? 0) ? 'checked' : '' }}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    @error('is_active')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>
            </div>

            <!-- Message - Full Width -->
            <div class="form-group full-width mt-2">
                <label class="form-label">Testimonial Message <span>*</span></label>
                <textarea name="message" class="form-textarea" placeholder="Write customer testimonial here...">{{ old('message', $testimonial->message ?? '') }}</textarea>
                @error('message')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>
            
            <!-- Form Actions - FIXED BUTTONS -->
            <div class="form-actions">
                <a href="{{ route('admin.testimonial.index') }}" class="btn btn-secondary" style="color:white; background-color:red;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                    </svg>
                    Update Testimonial
                </button>
            </div>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Star Rating Functionality
    const stars = document.querySelectorAll('#starRating span');
    const ratingInput = document.getElementById('ratingValue');
    const ratingContainer = document.getElementById('starRating');

    // Set existing rating (EDIT MODE)
    let initialRating = ratingContainer.dataset.rating;

    if (initialRating && initialRating > 0) {
        ratingInput.value = initialRating;
        stars.forEach((s, i) => {
            if (i < initialRating) {
                s.textContent = '★';
                s.classList.add('active');
            }
        });
    }

    // Click event
    stars.forEach((star, index) => {
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

        // Hover
        star.addEventListener('mouseover', function() {
            stars.forEach((s, i) => {
                s.textContent = i <= index ? '★' : '☆';
                s.style.color = i <= index ? '#fbbf24' : '#e5e7eb';
            });
        });

        // Mouse out
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

    // Form Validation
    const form = document.getElementById('testimonialForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            let name = document.querySelector('input[name="name"]');
            let role = document.querySelector('input[name="role"]');
            let message = document.querySelector('textarea[name="message"]');
            let rating = document.querySelector('input[name="rating"]');

            // Remove old errors
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