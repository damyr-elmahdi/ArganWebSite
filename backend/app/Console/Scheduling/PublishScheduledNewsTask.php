<?php

namespace App\Console\Scheduling;

use App\Models\News;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;

class PublishScheduledNewsTask
{
    /**
     * Register the scheduled task to publish scheduled news items.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    public function __invoke(Schedule $schedule)
    {
        $schedule->call(function () {
            // Find all scheduled news items that should be published now
            $scheduledNews = News::where('is_published', false)
                ->whereNotNull('scheduled_publication')
                ->where('scheduled_publication', '<=', Carbon::now())
                ->get();
            
            foreach ($scheduledNews as $news) {
                $news->publish();
            }
        })->everyMinute();
    }
}