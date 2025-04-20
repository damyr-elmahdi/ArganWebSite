<?php


namespace App\Console\Scheduling;

use Illuminate\Console\Scheduling\Schedule;

class PublishScheduledNewsTask
{
    public function __invoke(Schedule $schedule): void
    {
        $schedule->command('news:publish-scheduled')
            ->everyMinute()
            ->name('publish_scheduled_news')
            ->withoutOverlapping();
    }
}