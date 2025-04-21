<?php

namespace App\Console\Commands;

use App\Models\News;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Console\Scheduling\Schedule;

class PublishScheduledNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'news:publish-scheduled';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publishes news items that are scheduled for publication';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Checking for scheduled news items...');
        
        $scheduledNews = News::where('is_published', false)
            ->whereNotNull('scheduled_publication')
            ->where('scheduled_publication', '<=', Carbon::now())
            ->get();
        
        $count = $scheduledNews->count();
        
        if ($count === 0) {
            $this->info('No scheduled news items to publish.');
            return 0;
        }
        
        $this->info("Found {$count} scheduled news items to publish.");
        
        foreach ($scheduledNews as $news) {
            $this->info("Publishing news item: {$news->id} - {$news->title}");
            $news->publish();
        }
        
        $this->info('Finished publishing scheduled news items.');
        
        return 0;
    }


public function schedule(Schedule $schedule): void
{
    $schedule->command(static::class)
             ->everyMinute()
             ->timezone('Africa/Casablanca');
}

}
