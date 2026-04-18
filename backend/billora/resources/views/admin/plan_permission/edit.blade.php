@extends('admin.main-layout')
@section('title', 'Edit Plan Permission')
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
        padding: 28px !important;
        background: transparent;
        min-height: 100vh;
        width: 100%;
        max-width: 100%;
        margin-left: 0 !important;
    }

    /* Modern Page Header */
    .modern-page-header {
        background: white;
        border-radius: 24px;
        padding: 24px 32px;
        margin-bottom: 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        border: 1px solid #eef2f6;
    }

    .header-left h1 {
        font-size: 28px;
        font-weight: 700;
        background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 6px;
    }

    .header-left p {
        color: #64748b;
        font-size: 14px;
    }

    .back-btn-modern {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
        border-radius: 40px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .back-btn-modern:hover {
        background: #eef2ff;
        color: #2563eb;
        border-color: #2563eb;
        transform: translateX(-3px);
    }

    /* Edit Badge */
    .edit-badge {
        display: inline-block;
        background: linear-gradient(135deg, #e6f0ff 0%, #dbeafe 100%);
        padding: 4px 12px;
        border-radius: 30px;
        font-size: 12px;
        font-weight: 500;
        color: #2563eb;
        margin-left: 12px;
    }

    /* Form Container */
    .form-container-modern {
        background: white;
        border-radius: 28px;
        border: 1px solid #eef2f6;
        padding: 32px;
        box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
        width: 100%;
        transition: all 0.3s ease;
    }

    .form-container-modern:hover {
        box-shadow: 0 25px 40px -12px rgba(0, 0, 0, 0.12);
    }

    /* Section Title */
    .section-title-modern {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 24px;
        padding-bottom: 12px;
        border-bottom: 2px solid #eef2f6;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .section-title-modern .icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
    }

    /* Form Grid */
    .form-grid-modern {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
        margin-bottom: 24px;
    }

    .form-group-modern {
        margin-bottom: 0;
    }

    .form-group-full {
        grid-column: span 2;
    }

    .form-label-modern {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #334155;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .form-label-modern span {
        color: #ef4444;
        margin-left: 4px;
    }

    /* Input Wrapper */
    .input-wrapper-modern {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon-modern {
        position: absolute;
        left: 14px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .input-icon-modern svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }

    .form-input-modern {
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

    .form-input-modern.with-icon {
        padding-left: 44px;
    }

    .form-input-modern:hover {
        border-color: #cbd5e1;
        background: #fafcff;
    }

    .form-input-modern:focus {
        border-color: #2563EB;
        background: white;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    /* Textarea */
    .form-textarea-modern {
        width: 100%;
        padding: 14px 16px;
        border: 1.5px solid #e2e8f0;
        border-radius: 14px;
        font-size: 14px;
        color: #1e293b;
        background: #ffffff;
        transition: all 0.2s ease;
        outline: none;
        resize: vertical;
        min-height: 120px;
    }

    .form-textarea-modern:focus {
        border-color: #2563EB;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        background: white;
    }

    /* Permissions Section */
    .permissions-section-modern {
        background: #f8fafc;
        border-radius: 20px;
        padding: 24px;
        margin: 20px 0;
        border: 1px solid #eef2f6;
    }

    .permissions-header-modern {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
    }

    .permissions-header-modern h3 {
        font-size: 16px;
        font-weight: 600;
        color: #0f172a;
    }

    .select-all-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        padding: 6px 14px;
        background: white;
        border-radius: 30px;
        transition: all 0.2s ease;
        border: 1px solid #e2e8f0;
    }

    .select-all-wrapper:hover {
        background: #eef2ff;
        border-color: #2563eb;
    }

    .select-all-wrapper span {
        font-size: 13px;
        font-weight: 500;
        color: #2563eb;
    }

    /* Permissions Grid */
    .permissions-grid-modern {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        max-height: 320px;
        overflow-y: auto;
        padding: 4px;
    }

    /* Custom Scrollbar */
    .permissions-grid-modern::-webkit-scrollbar {
        width: 6px;
    }

    .permissions-grid-modern::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 10px;
    }

    .permissions-grid-modern::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
    }

    /* Permission Card */
    .permission-card-modern {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        border: 1.5px solid #eef2f6;
        padding: 12px 16px;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.25s ease;
    }

    .permission-card-modern:hover {
        border-color: #2563eb;
        background: #f0f7ff;
        transform: translateX(2px);
    }

    .permission-card-modern input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: #2563eb;
        cursor: pointer;
    }

    .permission-title-modern {
        font-size: 14px;
        font-weight: 500;
        color: #1e293b;
    }

    /* Toggle Switch Modern */
    .toggle-group-modern {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        padding: 20px 24px;
        border-radius: 18px;
        border: 1.5px solid #eef2f6;
        transition: all 0.2s ease;
        margin-top: 24px;
    }

    .toggle-group-modern:hover {
        border-color: #2563eb30;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
    }

    .toggle-label-modern {
        font-size: 15px;
        font-weight: 700;
        color: #0f172a;
    }

    .toggle-desc-modern {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 4px;
    }

    .switch-modern {
        position: relative;
        display: inline-block;
        width: 56px;
        height: 30px;
    }

    .switch-modern input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider-modern {
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

    .slider-modern:before {
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

    input:checked + .slider-modern {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }

    input:checked + .slider-modern:before {
        transform: translateX(26px);
    }

    /* Form Actions */
    .form-actions-modern {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 2px solid #eef2f6;
    }

    .btn-modern {
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
    }

    .btn-primary-modern {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }

    .btn-primary-modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
    }

    .btn-secondary-modern {
        background: #f1f5f9;
        color: #64748b;
        border: 1px solid #e2e8f0;
    }

    .btn-secondary-modern:hover {
        background: #fee2e2;
        color: #dc2626;
        border-color: #dc2626;
        transform: translateY(-1px);
    }

    /* Helper Text */
    .helper-text-modern {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    /* Error Text */
    .text-danger {
        color: #ef4444;
        font-size: 12px;
        margin-top: 6px;
        display: block;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .form-grid-modern {
            grid-template-columns: 1fr;
            gap: 20px;
        }
        
        .form-group-full {
            grid-column: span 1;
        }
        
        .permissions-grid-modern {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .main-content {
            padding: 16px !important;
        }
        
        .modern-page-header {
            flex-direction: column;
            align-items: flex-start;
            padding: 20px;
        }
        
        .form-container-modern {
            padding: 20px;
        }
        
        .permissions-grid-modern {
            grid-template-columns: 1fr;
        }
        
        .form-actions-modern {
            flex-direction: column;
        }
        
        .btn-modern {
            width: 100%;
            justify-content: center;
        }
        
        .toggle-group-modern {
            flex-direction: column;
            text-align: center;
            gap: 12px;
        }
    }

    /* Animation */
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

    .form-container-modern {
        animation: fadeInUp 0.4s ease-out;
    }
</style>

<!-- Main Content -->
<div class="main-content">
    <!-- Modern Page Header -->
    <div class="modern-page-header">
        <div class="header-left">
            <h1>
                ✏️ Edit Plan Permission
                <!-- <span class="edit-badge">Editing: {{ $planPermission->permission_name ?? '' }}</span> -->
            </h1>
            <p>Update permission details and manage access controls</p>
        </div>
        <a href="{{ route('admin.plan-permission.index') }}" class="back-btn-modern">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Permissions
        </a>
    </div>

    <!-- Modern Form Container -->
    <div class="form-container-modern">
        <form id="planForm" action="{{ route('admin.plan-permission.update', $planPermission->id) }}" method="POST" enctype="multipart/form-data" novalidate>
            @csrf

            <!-- Basic Information Section -->
            <div class="section-title-modern">
                <div class="icon">📋</div>
                Basic Information
            </div>

            <div class="form-grid-modern">
                <!-- Permission Name -->
                <div class="form-group-modern">
                    <label class="form-label-modern">
                        Permission Name <span>*</span>
                    </label>
                    <div class="input-wrapper-modern">
                        <span class="input-icon-modern">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                            </svg>
                        </span>
                        <input type="text" name="name" class="form-input-modern with-icon"
                            placeholder="Enter permission name (e.g., manage_users, view_reports)" 
                            value="{{ $planPermission->permission_name ?? '' }}" required>
                    </div>
                    @error('name')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                    <div class="helper-text-modern">
                        <span>💡</span> Use lowercase with underscores (e.g., manage_users)
                    </div>
                </div>

                <!-- Description - Full Width -->
                <div class="form-group-modern form-group-full">
                    <label class="form-label-modern">Permission Description</label>
                    <textarea name="description" id="description" class="form-textarea-modern"
                        placeholder="Describe what this permission allows users to do...">{{ $planPermission->description ?? '' }}</textarea>
                    @error('description')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                    <div class="helper-text-modern">
                        <span>📝</span> Provide a clear description of this permission's purpose
                    </div>
                </div>
            </div>

            <!-- Permissions Section -->
            <div class="section-title-modern" style="margin-top: 24px;">
                <div class="icon">🔐</div>
                Assigned Permissions
            </div>

            <div class="permissions-section-modern">
                <div class="permissions-header-modern">
                    <h3>Select Permissions to Assign</h3>
                    <div class="select-all-wrapper" id="selectAllWrapper">
                        <input type="checkbox" id="selectAllCheckbox" style="width: 16px; height: 16px; accent-color: #2563eb;">
                        <span>Select All Permissions</span>
                    </div>
                </div>

                <div class="permissions-grid-modern">
                    @foreach ($permissions as $permission)
                        <label class="permission-card-modern">
                            <input type="checkbox" name="permissions[]" value="{{ $permission->id }}"
                                {{ in_array($permission->id, old('permissions', $selectedPermissions ?? [])) ? 'checked' : '' }}
                                class="permission-checkbox">
                            <span class="permission-title-modern">
                                {{ $permission->name }}
                            </span>
                        </label>
                    @endforeach
                </div>
            </div>

            <!-- Status Toggle -->
            <div class="toggle-group-modern">
                <div>
                    <div class="toggle-label-modern">Active Status</div>
                    <div class="toggle-desc-modern">Make this permission available for assignment to plans</div>
                </div>
                <label class="switch-modern">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" 
                        name="is_active" 
                        value="1"
                        {{ old('is_active', $planPermission->is_active ?? 1) == 1 ? 'checked' : '' }}>
                    <span class="slider-modern"></span>
                </label>
            </div>
            @error('is_active')
                <span class="text-danger">{{ $message }}</span>
            @enderror

            <!-- Form Actions -->
            <div class="form-actions-modern">
                <a href="{{ route('admin.plan-permission.index') }}">
                    <button type="button" class="btn-modern btn-secondary-modern">
                        ❌ Cancel
                    </button>
                </a>
                <button type="submit" class="btn-modern btn-primary-modern">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-10H5V5h11v4z" />
                    </svg>
                    Save Changes
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
    // Select All functionality
    document.addEventListener('DOMContentLoaded', function() {
        const selectAllCheckbox = document.getElementById('selectAllCheckbox');
        const permissionCheckboxes = document.querySelectorAll('.permission-checkbox');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                permissionCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
            });
            
            // Update select all checkbox when individual checkboxes change
            permissionCheckboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const allChecked = Array.from(permissionCheckboxes).every(cb => cb.checked);
                    if (selectAllCheckbox) {
                        selectAllCheckbox.checked = allChecked;
                    }
                });
            });
            
            // Check if all are initially checked
            const allInitiallyChecked = Array.from(permissionCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allInitiallyChecked;
        }
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('planForm').addEventListener('submit', function(e) {
            let isValid = true;
            let name = document.querySelector('input[name="name"]');

            document.querySelectorAll('.js-error').forEach(el => el.remove());

            function showError(input, message) {
                let error = document.createElement('span');
                error.className = 'js-error';
                error.style.color = '#ef4444';
                error.style.fontSize = '12px';
                error.style.marginTop = '6px';
                error.style.display = 'block';
                error.innerText = message;

                let parent = input.closest('.form-group-modern') || input.closest('.permission-card-modern');
                if (parent) {
                    parent.appendChild(error);
                } else {
                    input.parentNode.appendChild(error);
                }
                isValid = false;
            }

            if (!name.value.trim()) {
                showError(name, "Permission name cannot be blank!");
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    });
</script>
@endsection