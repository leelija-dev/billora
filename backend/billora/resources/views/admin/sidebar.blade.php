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

                <a href="{{ route('admin.plans.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plans.index', 'admin.plans.create', 'admin.plans.edit', 'admin.plans.deleted') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="shopping-bag"></i>
                    <span class="ml-3">Plans</span>
                </a>

                <a href="{{ route('admin.plan-permission.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.plan-permission.index') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                    <i data-feather="shopping-cart"></i>
                    <span class="ml-3">Plans Permission</span>
                </a>

                <a href="{{ route('admin.mail-history') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.mail-history','admin.mail-history.view') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }}">
                    <i data-feather="mail"></i>
                    <span class="ml-3">Mail History</span>
                </a>

                <a href="{{ route('admin.admin-users.index') }}"
                    class="flex items-center px-4 py-3 {{ request()->routeIs('admin.admin-users.index') ? 'bg-blue-100 text-blue-600 font-semibold' : 'hover:bg-blue-100' }} hover:bg-blue-100">
                    <i data-feather="user"></i>
                    <span class="ml-3">Admin User</span>
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
