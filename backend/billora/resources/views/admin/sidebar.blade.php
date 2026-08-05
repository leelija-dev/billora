
@php
    $admin = Auth::guard('admin')->user();
@endphp

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
</head>

<body class="bg-gray-100">

    <!-- Mobile Menu Button -->
    <div class="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
        <h1 class="text-lg font-bold">Admin</h1>
        <button id="menuBtn">
            <i data-feather="menu"></i>
        </button>
    </div>

    <div class="flex">

        <!-- Sidebar -->
        <aside id="sidebar"
            class="w-64 bg-white  text-black h-screen fixed md:relative transform -translate-x-full md:translate-x-0 transition duration-300 z-50">

            @php
    $appName = config('app.name');
    $firstChar = substr($appName, 0, 1);
    $lastChar = substr($appName, -1);
    $remainingText = substr($appName, 1,);
@endphp

<style>
    @keyframes dash {
        to {
            stroke-dashoffset: -20;
        }
    }
    
    @keyframes slowBlink {
        0%, 100% { 
            opacity: 1;
            transform: scale(1);
        }
        50% { 
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    .speed-dash {
        animation: dash 0.6s linear infinite;
    }
    
    .slow-blink {
        animation: slowBlink 3s ease-in-out infinite;
        display: inline-block;
    }
</style>

<div class="p-4 border-b border-gray-200 bg-white">
    <div class="flex items-center justify-center">
        <div class="flex items-center group">
      
            <!-- Text with T hiding and visible slowly -->
            <div class="flex items-baseline">
                <span class="text-3xl font-black text-indigo-600 slow-blink">
                    {{ $firstChar }}
                </span>
                <span class="text-2xl font-bold text-gray-700">
                    {{ $remainingText }} 
                </span>
                {{-- <span class="text-3xl font-black text-indigo-600 slow-blink">
                    {{ $lastChar }}
                </span> --}}
            </div>
        </div>
    </div>
</div>

            <nav class="mt-4 space-y-2">
                @if ($admin && $admin->can('view dashboard'))
                    <a href="{{ route('admin.dashboard') }}"
                        class="flex items-center px-4 py-3 
            {{ request()->routeIs('admin.dashboard') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                        <i data-feather="home"></i>
                        <span class="ml-3">Dashboard</span>
                    </a>
                @endif
                 {{-- <a href="#"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.business-types.index', 'admin.business-types.create', 'admin.business-types.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i class="fa fa-hotel"></i>
                    <span class="ml-3">Blog</span>
                </a> --}}
                @php
                    $isBlogMenuActive =
                        request()->routeIs('admin.blogs.*') ||
                        request()->routeIs(
                            'admin.blogs.index',
                            'admin.blog-tag.index',
                            'admin.blog-tag.create',
                            'admin.category.index',
                            'admin.category.edit',
                            'admin.blog-tag.edit',
                            'admin.category.create'
                           
                        );
                @endphp
                    <div class="group">

                        <!-- Parent -->
                        <div
                            class="flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg
                        {{ $isBlogMenuActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                            <div class="flex items-center">
                              <i data-feather="clipboard" class="w-5 h-5"></i>
                                <span class="ml-3">Blog Management</span>
                            </div>

                            <span
                                class="transition-transform 
                            {{ $isBlogMenuActive ? 'rotate-180' : 'group-hover:rotate-180' }}">
                                ▾
                            </span>
                        </div>

                        <!-- Dropdown -->
                        <div
                            class="ml-8 mt-1 
                        {{ $isBlogMenuActive ? 'block' : 'hidden group-hover:block' }}">

                            <!-- Admin User -->
                            <a href="{{ route('admin.blogs.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.blogs.*') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="clipboard" class="w-5 h-5"></i>
                                <span class="ml-2">Blog</span>
                            </a>
                            <!-- Role -->
                            <a href="{{ route('admin.category.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.category.index', 'admin.category.create', 'admin.category.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="grid" class="w-5 h-5"></i>
                                <span class="ml-2">Categories</span>
                            </a>
                            <!-- Permission -->
                            <a href="{{ route('admin.blog-tag.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.blog-tag.index','admin.blog-tag.create','admin.blog-tag.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="tag" class="w-5 h-5"></i>
                                <span class="ml-2">Tags</span>
                            </a>

                        </div>
                    </div>
                
                @if ($admin && $admin->can('view customers'))
                    <a href="{{ route('admin.customers.index') }}"
                        class="flex items-center px-4 py-3 {{ request()->routeIs('admin.customers.index', 'admin.customers.plans', 'admin.customers.customer-mail') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                        <i data-feather="users"></i>
                        <span class="ml-3">Customers </span>
                    </a>
                @endif
                {{-- @if ($admin && $admin->can('view customers')) --}}
                <a href="{{ route('admin.business-types.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.business-types.index', 'admin.business-types.create', 'admin.business-types.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i class="fa fa-hotel"></i>
                    <span class="ml-3">Business Types</span>
                </a>
                 <a href="{{ route('admin.features.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.features.index', 'admin.features.create', 'admin.features.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i class="fa-solid fa-sliders"></i>
                    <span class="ml-3">Features</span>
                </a>
                {{-- @endif --}}
                @if ($admin && $admin->can('view customers'))
                    <a href="{{ route('admin.plans.index') }}"
                        class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.index', 'admin.plans.create', 'admin.plans.edit', 'admin.plans.deleted') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                        <i data-feather="shopping-bag"></i>
                        <span class="ml-3">Plans</span>
                    </a>
                @endif
                @if ($admin && $admin->can('view plan permissions'))
                    <a href="{{ route('admin.plan-permission.index') }}"
                        class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plan-permission.index', 'admin.plan-permission.create','admin.plan-permission.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                        <i data-feather="file-text" class="w-5 h-5"></i>
                        <span class="ml-3">Plans Permission</span>
                    </a>
                @endif
                @if ($admin && $admin->can('view plan purchase history'))
                    <a href="{{ route('admin.plans.purchase-history') }}"
                        class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.purchase-history') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                        <i data-feather="shopping-cart"></i>
                        <span class="ml-3">Plans Purchase History</span>
                    </a>
                @endif
                @if ($admin && $admin->can('view mail history'))
                    <a href="{{ route('admin.mail-history') }}"
                        class="flex items-center px-4 py-3 {{ request()->routeIs('admin.mail-history', 'admin.mail-history.view') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                        <i data-feather="mail"></i>
                        <span class="ml-3">Mail History</span>
                    </a>
                @endif
                
                @php
                    $isUserMenuActive =
                        request()->routeIs('admin.admin-users.*') ||
                        request()->routeIs(
                            'admin.permissions.index',
                            'admin.permissions.create',
                            'admin.roles.index',
                            'admin.roles.create',
                            'admin.roles.edit',
                        );
                @endphp
                <a href="{{ route('admin.contacts.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.contacts.index', 'admin.contacts.view', 'admin.contacts.send-mail') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i class="fa fa-comments"></i>
                    <span class="ml-3">Contact Us</span>
                </a>
                <a href="{{ route('admin.testimonial.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.testimonial.index', 'admin.testimonial.create', 'admin.testimonial.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i class="fa fa-comment"></i>
                    <span class="ml-3">Testimonial</span>
                </a>
                @if ($admin && $admin->can('view admin users'))
                    <div class="group">

                        <!-- Parent -->
                        <div
                            class="flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg
                        {{ $isUserMenuActive ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                            <div class="flex items-center">
                                <i data-feather="users" class="w-5 h-5"></i>
                                <span class="ml-3">User Management</span>
                            </div>

                            <span
                                class="transition-transform 
                            {{ $isUserMenuActive ? 'rotate-180' : 'group-hover:rotate-180' }}">
                                ▾
                            </span>
                        </div>

                        <!-- Dropdown -->
                        <div
                            class="ml-8 mt-1 
                        {{ $isUserMenuActive ? 'block' : 'hidden group-hover:block' }}">

                            <!-- Admin User -->
                            <a href="{{ route('admin.admin-users.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.admin-users.*') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="user" class="w-4 h-4"></i>
                                <span class="ml-2">Admin User</span>
                            </a>
                            <!-- Role -->
                            <a href="{{ route('admin.roles.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.roles.index', 'admin.roles.create', 'admin.roles.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="user-check" class="w-4 h-4"></i>
                                <span class="ml-2">Role</span>
                            </a>
                            <!-- Permission -->
                            <a href="{{ route('admin.permissions.index') }}"
                                class="flex items-center px-4 py-2 text-sm rounded-lg 
                            {{ request()->routeIs('admin.permissions.index', 'admin.permissions.create') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                                <i data-feather="lock" class="w-4 h-4"></i>
                                <span class="ml-2">Permission</span>
                            </a>

                        </div>
                    </div>
                @endif
                {{-- <a href="{{ route('admin.plans.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.index', 'admin.plans.create', 'admin.plans.edit', 'admin.plans.deleted') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}"> --}}



                    <div class="flex space-x-3 ml-3">

                        <!-- Avatar -->
                        @php
                            $user = Auth::guard('admin')->user();
                        @endphp

                        <div
                            class="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">

                            @if ($user && $user->image)
                                <img src="{{ asset($user->image) }}" alt="profile" class="w-full h-full object-cover">
                            @else
                                {{ strtoupper(substr($user->username ?? 'A', 0, 1)) }}
                            @endif

                        </div>

                        <!-- User Info -->
                        <div class="flex flex-col leading-tight">

                            <span class="text-xs text-gray-800">
                                {{ Auth::guard('admin')->user()->username }}
                            </span>
                            <span class="text-xs text-gray-500">
                                {{ Auth::guard('admin')->user()->email }}
                            </span>

                        </div>

                    </div>
                {{-- </a> --}}
                <!-- Logout Link with Form -->
                <div class="px-4 pb-4">
                    <form action="{{ route('admin.logout') }}" method="POST">
                        @csrf
                        <button type="submit" class="w-full flex items-center px-4 py-3 hover:bg-blue-100 text-left">
                            <i data-feather="log-out" class="text-red-500"></i>
                            <span class="ml-3" style="color: red;">Logout</span>
                        </button>
                    </form>
                </div>

            </nav>
        </aside>

        <!-- Main Content -->

        <!-- JS -->
        <script>
            feather.replace();

            const menuBtn = document.getElementById('menuBtn');
            const sidebar = document.getElementById('sidebar');

            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
            });
        </script>

</body>

</html>