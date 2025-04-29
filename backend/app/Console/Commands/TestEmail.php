<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class TestEmail extends Command
{
    protected $signature = 'test:email';
    protected $description = 'Test email configuration';

    public function handle()
    {
        $this->info('Testing email configuration...');
        
        try {
            $data = [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'subject' => 'Test Email',
                'message' => 'This is a test message to verify the email configuration works.'
            ];
            
            $recipient = config('school.email');
            $this->info("Sending test email to: {$recipient}");
            
            Mail::to($recipient)->send(new ContactFormMail($data));
            
            $this->info('Test email sent successfully!');
        } catch (\Exception $e) {
            $this->error('Failed to send test email:');
            $this->error($e->getMessage());
            return 1;
        }
        
        return 0;
    }
}