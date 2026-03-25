<?php

return [

    'mode' => env('CASHFREE_TEST_MODE', true),

    'app_id' => env('CASHFREE_TEST_APP_ID'),
    'secret_key' => env('CASHFREE_TEST_SECRET_KEY'),

    'base_url' => env('CASHFREE_TEST_MODE', true)
        ? 'https://sandbox.cashfree.com/pg'
        : 'https://api.cashfree.com/pg',

];