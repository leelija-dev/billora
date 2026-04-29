@extends('admin.main-layout')
    @section('title', 'Edit blog')
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

    {{-- @include('admin.sidebar') --}}
    <!-- Main Content - Full Width -->
    <div class="main-content">

        <!-- Page Header -->
        <div class="page-header">
            <div class="header-left">
                <h1>Edit blog</h1>

            </div>
            <a href="{{route('admin.blogs.index')}}" class="back-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Blogs
            </a>
        </div>

        <!-- Form Container - Full Width -->
        <div class="form-container">
            <form id="planForm" action="{{ route('admin.blogs.update', $blog->id) }}" method="POST" enctype="multipart/form-data"
                novalidate>
                @csrf

                <!-- Plan Details -->
                <div class="form-title">Plan Details</div>

                <div class="form-grid">
                    <!-- Plan Name -->
                    <div class="form-group">
                        <label class="form-label">
                            Title <span>*</span>
                        </label>
                        <div class="input-wrapper">
                            <span class="input-icon">
                                <svg viewBox="0 0 24 24">
                                    <path
                                        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                                </svg>
                            </span>
                            <input type="text" name="title" class="form-input with-icon"
                                placeholder="Enter title.." value="{{$blog->title ?? old('title') }}"
                                required>
                            @error('title')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                           Slug<span>*</span>
                        </label>

                       <input type="text" name="slug" class="form-input with-icon"
                                placeholder="Enter slug.." value="{{$blog->slug ?? old('slug') }}"
                                required>
                            @error('slug')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror

                    </div>
                    
                     <div class="form-group">
                        <label class="form-label">
                             Category<span>*</span>
                        </label>
                        <div >
                            
                            <select name="category_id[]" class="form-select" multiple id="category">
                                @php
                                    $selectedCategories = old('category_id', $blog->categories->pluck('id')->toArray());
                                @endphp
                                @foreach ($categories as $category)
                                    <option value="{{ $category->id }}"
                                        {{ in_array($category->id, $selectedCategories) ? 'selected' : '' }}>
                                        {{ $category->name }}
                                    </option>
                                @endforeach
                            </select>
                            @error('category_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror

                        </div>
                     </div>
                       <div class="form-group">
                        <label class="form-label">
                             Tags<span>*</span>
                        </label>
                       <div>
                            <select name="tags_id[]" class="form-select" multiple required id="tags">
                                
                                @php
                                    $selectedTags = old('tags_id', $blog->tags->pluck('id')->toArray());
                                @endphp

                                @foreach ($tags as $tag)
                                    <option value="{{ $tag->id }}"
                                        {{ in_array($tag->id, $selectedTags) ? 'selected' : '' }}>
                                        {{ $tag->name }}
                                    </option>
                                @endforeach

                            </select>

                            @error('tags_id')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
</div>
                     </div>
                     <!-- Price and Currency -->
                    <div class="form-group">
                        <label class="form-label">
                             Excerpt
                        </label>
                       
                           
                            <textarea name="excerpt" class="form-input currency-input" rows="3"
                                placeholder="Enter plan excerpt" required>{{ $blog->excerpt ?? old('excerpt') }}</textarea>
                            @error('excerpt')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror


                    </div>
                     <div class="form-group">
                        <label class="form-label">
                           Feature Image Alt
                        </label>
                        <div >
                            
                            <input type="text" name="feature_image_alt" class="form-input currency-input"
                                placeholder="Enter feature image alt" value="{{ $blog->feature_image_alt ?? old('feature_image_alt') }}"
                                required>
                            @error('feature_image_alt')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror

                        </div>
                     </div>
                     <div class="form-group">
                        <label class="form-label">
                            Feature Image<span>*</span>
                        </label>

                        <div>
                            <input type="file" name="feature_image" class="form-input"
                                accept="image/*" required>

                            @error('feature_image')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                     <div class="form-group">
                        <label class="form-label">
                           Meta Title<span>*</span>
                        </label>
                        <div >
                            
                            <input type="text" name="meta_title" class="form-input currency-input"
                                placeholder="Enter meta title" value="{{ $blog->meta_title ?? old('meta_title') }}"
                                required>
                            @error('meta_title')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror

                        </div>
                     </div>

                   <div class="form-group">
                        <label class="form-label">
                             Keywords<span>*</span>
                        </label>
                       
                           
                            <input type="text" name="keywords" class="form-input currency-input"
                                placeholder="Enter keywords" value="{{ $blog->keywords ?? old('keywords') }}"
                                required>
                            @error('keywords')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror


                    </div>
                    <!-- Description FULL WIDTH -->
                    <div class="form-group">
                        <label class="form-label">Meta Description</label>
                        <textarea name="meta_description" id="meta_description" class="form-textarea"
                            placeholder="Enter meta description..">{{ $blog->meta_description ?? old('meta_description') }}</textarea>

                        @error('meta_description')
                            <span class="text-danger" style="color: red">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label class="form-label">Schema</label>
                        <textarea name="schema" id="schema" class="form-textarea"
                            placeholder="Enter schema..">{{ $blog->schema ?? old('schema') }}</textarea>

                        @error('schema')
                            <span class="text-danger" style="color: red">{{ $message }}</span>
                        @enderror
                    </div>

                </div>
                <div class="form-group">
                        <label class="form-label">Content</label>
                        <textarea name="content" id="description" class="form-textarea"
                            placeholder="Enter content..">{{ $blog->content ?? old('content') }}</textarea>

                        @error('content')
                            <span class="text-danger" style="color: red">{{ $message }}</span>
                        @enderror
                    </div>
                <!-- Status Toggle -->
                <div class="form-group mt-2">
                    <div class="toggle-group">
                        <div>
                            <div class="toggle-label">Active Status</div>
                            <div class="toggle-desc">Make this plan available for customers</div>
                        </div>
                        <label class="switch">
                            <input type="hidden" name="status" value="0">
                            <input type="checkbox" name="status" value="1" {{ $blog->status ? 'checked' : '' }}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    @error('status')
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
                        Update blog
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
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script>
        function addFeature() {
            const container = document.getElementById('features-container');
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <div class="feature-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                </div>
                <input type="text" name="features[]" class="feature-input" placeholder="Enter a feature">
                <button type="button" class="remove-feature" onclick="removeFeature(this)">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            `;
            container.appendChild(featureItem);
        }

        function removeFeature(button) {
            const featureItem = button.closest('.feature-item');
            const container = document.getElementById('features-container');

            if (container.children.length > 1) {
                featureItem.remove();
            } else {
                alert('You need at least one feature');
            }
        }
    </script>
    <script>
        $(document).ready(function() {
            $('#description').summernote({
                height: 300,
            });

        });
    </script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {

            document.getElementById('planForm').addEventListener('submit', function(e) {

                let isValid = true;

                let name = document.querySelector('input[name="name"]');
                let price = document.querySelector('input[name="price"]');
                let duration = document.querySelector('input[name="duration_days"]');
                let features = document.querySelectorAll('input[name="features[]"]');

                // Summernote content
                // let description = $('#description').summernote('code');

                // Remove old errors
                document.querySelectorAll('.js-error').forEach(el => el.remove());

                function showError(input, message) {
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.style.color = 'red';
                    error.style.fontSize = '12px';
                    error.innerText = message;

                    let parent = input.closest('.form-group') || input.closest('.feature-item');
                    parent.appendChild(error);

                    isValid = false;
                }

                // Name
                if (!name.value.trim()) {
                    showError(name, "Plan name cannot be blank!");
                }

                // Price
                if (!price.value || price.value <= 0) {
                    showError(price, "Enter valid price!");
                }

                // Duration
                if (!duration.value || duration.value <= 0) {
                    showError(duration, "Enter valid duration!");
                }

                // Features
                let validFeature = false;
                features.forEach(f => {
                    if (f.value.trim() !== "") validFeature = true;
                });

                // if (!validFeature) {
                //     showError(features[0], "At least one feature is required");
                // }

                // Description (optional but better)
                // if (description.trim() === "" || description === "<p><br></p>") {
                //     showError(document.getElementById('description'), "Description is required");
                // }

                // Stop submit
                if (!isValid) {
                    e.preventDefault();
                }

            });

        });
    </script>
    <script>
    $(document).ready(function() {
        $('#category').select2({
            placeholder: "Select Category ",
            allowClear: true
        });
    });
</script>
<script>
    $(document).ready(function() {
        $('#tags').select2({
            placeholder: "Select Tags ",
            allowClear: true
        });
    });
</script>
<script>
    $(document).ready(function () {

        let isSlugEdited = false;

        // Detect manual slug edit
        $('input[name="slug"]').on('input', function () {
            isSlugEdited = true;
        });

        // Auto generate slug from title
        $('input[name="title"]').on('input', function () {

            // Stop auto-update if slug manually edited
            if (isSlugEdited) {
                return;
            }

            let slug = $(this).val()
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '') // remove special chars
                .replace(/\s+/g, '-')         // spaces to hyphen
                .replace(/-+/g, '-');         // remove duplicate hyphen

            $('input[name="slug"]').val(slug);
        });

    });
</script>
@endsection