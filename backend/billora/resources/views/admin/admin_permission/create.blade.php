@extends('admin.main-layout')
@section('title', 'Create New Permission')
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
        display: flex;
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

    .form-group {
        margin-bottom: 24px;
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

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 12px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .input-icon svg {
        width: 18px;
        height: 18px;
        fill: #94a3b8;
    }

    .form-input {
        width: 100%;
        padding: 10px 14px 10px 42px;
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

    /* Form Actions */
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 28px;
        padding-top: 24px;
        border-top: 1px solid #eef2f6;
    }

    .btn {
        padding: 10px 24px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
        text-decoration: none;
    }

    .btn-primary {
        background: #2563eb;
        color: white;
    }

    .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
    }

    .btn-secondary {
        background: #f1f5f9;
        color: #475569;
    }

    .btn-secondary:hover {
        background: #e2e8f0;
        transform: translateY(-1px);
    }

    /* Error Message */
    .text-danger {
        color: #ef4444;
        font-size: 12px;
        margin-top: 6px;
        display: block;
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
            flex-direction: column;
        }
        .btn {
            width: 100%;
            justify-content: center;
        }
    }
</style>

<div class="main-content">
    <div class="card">
        <!-- Header -->
        <div class="card-header">
            <div>
                <h1>Create New Permission</h1>
                <p>Add a new system permission</p>
            </div>
            <a href="{{ route('admin.permissions.index') }}" class="back-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Permissions
            </a>
        </div>

        <!-- Form Container -->
        <div class="form-container">
            <form action="{{ route('admin.permissions.store') }}" method="POST">
                @csrf

                <!-- Permission Name -->
                <div class="form-group">
                    <label class="form-label">Permission Name <span>*</span></label>
                    <div class="input-wrapper">
                        <span class="input-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </span>
                        <input type="text" name="name" class="form-input" placeholder="Enter permission name" value="{{ old('name') }}" required>
                    </div>
                    @error('name')
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
                            <input type="checkbox" name="is_active" value="1" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    @error('is_active')
                        <span class="text-danger">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Form Actions -->
                <div class="form-actions">
                    <a href="{{ route('admin.permissions.index') }}" class="btn btn-secondary">Cancel</a>
                    <button type="submit" class="btn btn-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                        </svg>
                        Create Permission
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    // Form validation
    document.addEventListener("DOMContentLoaded", function() {
        document.querySelector('form').addEventListener('submit', function(e) {
            let isValid = true;
            let name = document.querySelector('input[name="name"]');
            
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
            
            if (!name.value.trim()) {
                showError(name, "Permission name is required");
            }
            
            if (!isValid) e.preventDefault();
        });
    });
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

@endsection