<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

Route::get('/test-email', function () {
   $data = [
       'name' => 'Test User',
       'email' => 'test@example.com',
       'subject' => 'Test Subject',
       'message' => 'Test message content',
   ];
   
   try {
       Mail::to(config('school.email'))->send(new App\Mail\ContactFormMail($data));
       return 'Email sent successfully!';
   } catch (\Exception $e) {
       return 'Email error: ' . $e->getMessage();
   }
});
