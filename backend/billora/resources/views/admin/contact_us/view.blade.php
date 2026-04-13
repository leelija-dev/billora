@extends('admin.main-layout')

@section('title', 'Mail Detail')

@section('content')

    <div class="min-h-screen bg-gray-100 flex  p-4">

        <div class="w-full  bg-white rounded-2xl shadow-lg overflow-hidden">

            <!-- Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b bg-white">

                <div class="flex items-center gap-3">

                    <a href="{{ route('admin.contacts.index') }}"
                        class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100">
                        ← Back
                    </a>

                    <form action="#" method="GET">
                        {{-- <input type="hidden" name="ids" value="{{ $contacts->id }}"> --}}

                        <button type="submit"
                            class="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-full text-sm hover:bg-blue-700 shadow">

                            <i class="fab fa-telegram-plane"></i>
                            Send Mail

                        </button>
                    </form>

                </div>

                <div class="text-sm text-gray-500">
                    📩 Single message view
                </div>
            </div>

            <!-- Subject -->
            <div class="px-6 py-5 border-b">
                <h2 class="text-2xl font-semibold text-gray-800">
                    {{ $contacts->subject ?? 'No Subject' }}
                </h2>
            </div>

            <!-- Customer Info -->
            <div class="flex justify-between items-center px-6 py-4 bg-gray-50 border-b flex-wrap gap-3">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {{ $contacts->name ? strtoupper(substr($contacts->name, 0, 1)) : 'N/A' }}
                    </div>

                    <div>
                        <div class="text-sm font-semibold text-gray-800">
                            {{ $contacts->email ?? 'N/A' }}
                        </div>
                        <div class="text-xs text-gray-500">
                            {{ $contacts->name ?? 'N/A' }}
                        </div>
                    </div>

                </div>

                <div class="text-sm text-gray-500">
                    {{ $contacts->created_at ? $contacts->created_at->format('M d, Y h:i A') : 'N/A' }}
                </div>
            </div>

            <!-- Message -->
            <div class="px-6 py-5">

                <div class="text-xs font-semibold text-indigo-600 uppercase mb-2">
                    Message Content
                </div>

                <div class="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 leading-relaxed">
                    {!! $contacts->message !!}
                </div>

            </div>

            

        </div>

    </div>

@endsection
