@extends('admin.main-layout')
@section('title', 'Edit Admin User')
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
        margin-top: 4px;
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
        padding: 28px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        width: 100%;
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

    /* Password Toggle */
    .input-wrapper {
        position: relative;
    }

    .toggle-password {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border-radius: 8px;
        transition: all 0.2s;
    }

    .toggle-password:hover {
        background: #e2e8f0;
    }

    .toggle-password svg {
        width: 18px;
        height: 18px;
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

    /* Roles Grid */
    .roles-section {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid #eef2f6;
    }

    .roles-section-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .roles-section-title svg {
        width: 20px;
        height: 20px;
        fill: #2563eb;
    }

    .roles-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .role-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 12px 16px;
        border-radius: 12px;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .role-card:hover {
        border-color: #2563EB;
        background: #eff6ff;
    }

    .role-card input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #2563EB;
        cursor: pointer;
    }

    .role-card label {
        font-size: 14px;
        font-weight: 500;
        color: #1e293b;
        cursor: pointer;
        flex: 1;
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

    /* Image Preview */
    .image-preview {
        margin-top: 12px;
        display: none;
    }

    .image-preview img {
        width: 80px;
        height: 80px;
        border-radius: 12px;
        object-fit: cover;
        border: 2px solid #e2e8f0;
        padding: 2px;
    }

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
        .form-container {
            padding: 20px;
        }
        .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
        }
        .roles-grid {
            grid-template-columns: 1fr;
        }
        .form-actions {
            flex-direction: column-reverse;
            gap: 12px;
        }
        .btn {
            width: 100%;
            justify-content: center;
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
</style>

<div class="main-content">
    <!-- Page Header -->
    <div class="page-header">
        <div class="header-left">
            <h1>Edit Admin User</h1>
            <p>Update admin user information and role assignments</p>
        </div>
        <a href="{{ route('admin.admin-users.index') }}" class="back-btn">
            <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Admin Users
        </a>
    </div>

    <!-- Form Container -->
    <div class="form-container">
        <form id="adminUserForm" action="{{ route('admin.admin-users.update', $user->id ?? '') }}" method="POST" enctype="multipart/form-data" novalidate>
            @csrf
          

            <div class="form-grid">
                <!-- LEFT COLUMN -->
                <div>
                    <!-- User Name (Readonly) -->
                    <div class="form-group">
                        <label class="form-label">Username <span>*</span></label>
                        <input type="text" name="name" class="form-input" value="{{ $user->username ?? old('name') }}" placeholder="Enter username" readonly>
                        @error('name')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Email (Readonly) -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="form-label">Email <span>*</span></label>
                        <input type="email" name="email" value="{{ $user->email ?? old('email') }}" class="form-input" placeholder="Enter email" readonly>
                        @error('email')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Image -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="form-label">Profile Image</label>
                        <input type="file" name="image" class="form-input" accept="image/*" id="imageInput">
                        @if($user->image ?? false)
                            <div class="current-image">
                                <img src="{{ asset($user->image) }}" alt="Current image">
                                <span>Current profile image</span>
                            </div>
                        @endif
                        <div class="image-preview" id="imagePreview">
                            <img src="" alt="Preview">
                        </div>
                        @error('image')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>
                </div>

                <!-- RIGHT COLUMN -->
                <div>
                    <!-- First Name -->
                    <div class="form-group">
                        <label class="form-label">First Name <span>*</span></label>
                        <input type="text" name="fname" value="{{ $user->fname ?? old('fname') }}" class="form-input" placeholder="Enter first name">
                        @error('fname')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Last Name -->
                    <div class="form-group" style="margin-top: 20px;">
                        <label class="form-label">Last Name <span>*</span></label>
                        <input type="text" name="lname" value="{{ $user->lname ?? old('lname') }}" class="form-input" placeholder="Enter last name">
                        @error('lname')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Password -->
                    {{-- <div class="form-group" style="margin-top: 20px;">
                        <label class="form-label">Password</label>
                        <div class="input-wrapper">
                            <input type="password" id="password" name="password" class="form-input" placeholder="Enter new password">
                            <span class="toggle-password" onclick="togglePassword(this)">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                    <circle cx="12" cy="12" r="3"/>
                                </svg>
                            </span>
                        </div>
                        @error('password')
                            <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div> --}}
                </div>
            </div>

            <!-- Description - Full Width -->
            <div class="form-group full-width" style="margin-top: 20px;">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" name="description" placeholder="Enter description about the admin user...">{{ $user->description ?? '' }}</textarea>
                @error('description')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <!-- Roles Section -->
            <div class="roles-section">
                <div class="roles-section-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Assign Roles <span>*</span>
                </div>
                <div class="roles-grid">
                    @foreach ($assignRoles as $role)
                        <div class="role-card" onclick="toggleCheckbox(this)">
                            <input type="checkbox" name="roles[]" class="role-checkbox" value="{{ $role->name }}" id="role_{{ $role->id }}" 
                                {{ in_array($role->id, $userRoles ?? []) ? 'checked' : '' }}>
                            <label for="role_{{ $role->id }}">{{ ucwords(str_replace('_', ' ', $role->name)) }}</label>
                        </div>
                    @endforeach
                </div>
                @error('roles')
                    <span class="text-danger">{{ $message }}</span>
                @enderror
            </div>

            <!-- Form Actions - FIXED BUTTONS -->
            <div class="form-actions">
                <a href="{{ route('admin.admin-users.index') }}" class="btn btn-secondary" style="color:white; background-color:red;">
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
                    Update Admin User
                </button>
            </div>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Toggle password visibility
    function togglePassword(element) {
        let input = document.getElementById("password");
        let svg = element.querySelector('svg');

        if (input.type === "password") {
            input.type = "text";
            svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
        } else {
            input.type = "password";
            svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
        }
    }

    // Image preview
    document.addEventListener("DOMContentLoaded", function() {
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

    // Toggle checkbox when clicking on role card
    function toggleCheckbox(card) {
        const checkbox = card.querySelector('.role-checkbox');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
        }
    }

    // Form validation
    document.addEventListener("DOMContentLoaded", function() {
        const form = document.getElementById('adminUserForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                let fname = document.querySelector('input[name="fname"]');
                let lname = document.querySelector('input[name="lname"]');
                let roles = document.querySelectorAll('input[name="roles[]"]:checked');

                // Remove old errors
                document.querySelectorAll('.js-error').forEach(el => el.remove());

                function showError(input, msg) {
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.style.color = '#ef4444';
                    error.style.fontSize = '12px';
                    error.style.marginTop = '6px';
                    error.style.display = 'block';
                    error.innerText = msg;
                    input.parentNode.appendChild(error);
                    isValid = false;
                }

                if (!fname.value.trim()) showError(fname, "First name is required");
                if (!lname.value.trim()) showError(lname, "Last name is required");
                if (roles.length === 0) {
                    let roleSection = document.querySelector('.roles-section');
                    let error = document.createElement('span');
                    error.className = 'js-error';
                    error.style.color = '#ef4444';
                    error.style.fontSize = '12px';
                    error.style.marginTop = '8px';
                    error.style.display = 'block';
                    error.innerText = "Please select at least one role";
                    roleSection.appendChild(error);
                    isValid = false;
                }

                if (!isValid) e.preventDefault();
            });
        }
    });
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection