<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\SendPlanExpiryReminderJob;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new SendPlanExpiryReminderJob(true))->dailyAt('10:15');
// JSON notifications every 30 minutes
Schedule::job(new SendPlanExpiryReminderJob(false))
        ->everyThirtyMinutes();

//plan expire daily check
Schedule::command('app:expire-plans')->daily();  