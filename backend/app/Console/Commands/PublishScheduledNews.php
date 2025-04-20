<?php
// Create a new command: php artisan make:command PublishScheduledNews

namespace App\Console\Commands;

use App\Models\News;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

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
    protected $description = 'Publish news items that have reached their scheduled publication time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = now();
        
        // Find all news that should be published now
        $scheduledNews = News::where('is_published', false)
            ->whereNotNull('scheduled_publication')
            ->where('scheduled_publication', '<=', $now)
            ->get();
            
        $count = $scheduledNews->count();
        
        foreach ($scheduledNews as $news) {
            $news->is_published = true;
            $news->published_at = $now;
            $news->save();
            
            Log::info("Published scheduled news: {$news->id} - {$news->title}");
        }
        
        $this->info("Published {$count} scheduled news items.");
    }
}