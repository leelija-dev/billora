@extends('admin.main-layout')
@section('title', 'Create Features')
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

        .main-content {
            padding: 30px;
            background: #f8fafc;
            min-height: 100vh;
            width: 100%;
        }

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
            gap: 25px;
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

        .form-input:focus {
            border-color: #2563EB;
            background: white;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-input::placeholder {
            color: #94a3b8;
            font-size: 14px;
        }

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
            flex-shrink: 0;
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
            background: #f8fafc;
        }

        .feature-input:focus {
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            background: white;
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
            flex-shrink: 0;
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

        .text-danger {
            color: #ef4444 !important;
            font-size: 12px;
            margin-top: 6px;
            display: block;
        }

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

            .form-actions {
                flex-direction: column;
            }

            .btn {
                width: 100%;
                justify-content: center;
            }
        }
    </style>

    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-left">
                <h1>Create Features</h1>
                <p>Add multiple features for your customers</p>
            </div>
            <a href="{{ route('admin.features.index') }}" class="back-btn">
                <svg viewBox="0 0 24 24">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back to Features
            </a>
        </div>

        <!-- Form Container -->
        <div class="form-container">
            <form id="featureForm" action="{{ route('admin.features.store') }}" method="POST" novalidate>
                @csrf

                <div class="form-grid">
                    <!-- Features Array Section -->
                    <div class="form-group full-width">
                        <div class="form-title" style="margin-top: 0;">Features List</div>
                        <div class="features-section">
                            <div class="features-header">
                                <h3>Add Multiple Features</h3>
                                <button type="button" class="add-feature-btn" onclick="addFeature()">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    Add Feature
                                </button>
                            </div>

                            <div id="features-container">
                                <!-- Default feature row -->
                                <div class="feature-item">
                                    <div class="feature-icon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                        </svg>
                                    </div>
                                    <input type="text" name="features[]" class="feature-input"
                                        placeholder="Enter feature name" value="{{ old('features.0') }}">
                                    <button type="button" class="remove-feature" onclick="removeFeature(this)">
                                        <svg viewBox="0 0 24 24">
                                            <path
                                                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            @error('features')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                            @error('features.*')
                                <span class="text-danger">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                    <a href="{{ route('admin.features.index') }}">
                        <button type="button" class="btn btn-secondary"
                            style="color:white;background-color:#ef4444;">Cancel</button>
                    </a>
                    <button type="submit" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: white;">
                            <path
                                d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-10H5V5h11v4z" />
                        </svg>
                        Save Features
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

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
            <input type="text" name="features[]" class="feature-input" placeholder="Enter feature name">
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
                Swal.fire({
                    icon: "warning",
                    title: "Cannot Remove",
                    text: "You need at least one feature!",
                });
            }
        }

        // Form validation
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('featureForm').addEventListener('submit', function(e) {
                let isValid = true;

                // Validate feature name
                const name = document.querySelector('input[name="name"]');
                if (!name.value.trim()) {
                    showError(name, "Feature name cannot be blank!");
                    isValid = false;
                }

                // Validate business types
                const businessTypes = document.querySelector('select[name="business_types[]"]');
                if (businessTypes.selectedOptions.length === 0) {
                    showError(businessTypes, "Please select at least one business type!");
                    isValid = false;
                }

                // Validate features array
                const features = document.querySelectorAll('input[name="features[]"]');
                let hasValidFeature = false;
                features.forEach(f => {
                    if (f.value.trim() !== "") {
                        hasValidFeature = true;
                    }
                });

                if (!hasValidFeature) {
                    const firstFeature = features[0];
                    if (firstFeature) {
                        showError(firstFeature, "At least one feature is required!");
                    }
                    isValid = false;
                }

                // Remove any duplicate empty errors
                if (!isValid) {
                    e.preventDefault();
                }
            });

            function showError(input, message) {
                // Remove existing error for this input
                const parent = input.closest('.form-group') || input.closest('.feature-item');
                const existingError = parent.querySelector('.text-danger');
                if (existingError) {
                    existingError.remove();
                }

                const error = document.createElement('span');
                error.className = 'text-danger';
                error.style.marginTop = '6px';
                error.style.display = 'block';
                error.textContent = message;
                parent.appendChild(error);

                // Highlight input
                input.style.borderColor = '#ef4444';
                input.addEventListener('focus', function() {
                    this.style.borderColor = '#e2e8f0';
                    const err = this.closest('.form-group')?.querySelector('.text-danger') ||
                        this.closest('.feature-item')?.querySelector('.text-danger');
                    if (err) err.remove();
                }, {
                    once: true
                });
            }
        });
    </script>

@endsection
