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

            <div class="p-4 text-2xl font-bold border-b border-white text-center" style="color:rgb(61, 64, 219);">
                Billora
            </div>

            <nav class="mt-4 space-y-2">
                @if()
                <a href="{{ route('admin.dashboard') }}"
                    class="flex items-center px-4 py-3 
            {{ request()->routeIs('admin.dashboard') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">

                    <i data-feather="home"></i>
                    <span class="ml-3">Dashboard</span>
                </a>

                <a href="{{ route('admin.customers.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.customers.index', 'admin.customers.plans', 'admin.customers.customer-mail') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="users"></i>
                    <span class="ml-3">Customers</span>
                </a>
                <a href="{{ route('admin.business-types.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.business-types.index', 'admin.business-types.create', 'admin.business-types.edit') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="users"></i>
                    <span class="ml-3">Business Types</span>
                </a>

                <a href="{{ route('admin.plans.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.index', 'admin.plans.create', 'admin.plans.edit', 'admin.plans.deleted') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="shopping-bag"></i>
                    <span class="ml-3">Plans</span>
                </a>

                <a href="{{ route('admin.plan-permission.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plan-permission.index', 'admin.plan-permission.create') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                    <i data-feather="file-text" class="w-5 h-5"></i>
                    <span class="ml-3">Plans Permission</span>
                </a>
                <a href="{{ route('admin.plans.purchase-history') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.purchase-history') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                    <i data-feather="shopping-cart"></i>
                    <span class="ml-3">Plans Purchase History</span>
                </a>

                <a href="{{ route('admin.mail-history') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.mail-history', 'admin.mail-history.view') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="mail"></i>
                    <span class="ml-3">Mail History</span>
                </a>

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
                <a href="{{ route('admin.plans.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.index', 'admin.plans.create', 'admin.plans.edit', 'admin.plans.deleted') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">



                    <div class="flex space-x-3">

                        <!-- Avatar -->
                        <div
                            class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                            {{ strtoupper(substr(Auth::guard('admin')->user()->username, 0, 1)) }}
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
                </a>
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
