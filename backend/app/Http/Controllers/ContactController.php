<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactFormMail;

class ContactController extends Controller
{
    public function submitContactForm(Request $request)
    {
        // Validate the form data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Get the school email from env or config
        $schoolEmail = config('school.email');

        // Send email
        try {
            // Add logging
            Log::info('Attempting to send email to: ' . config('school.email'));
            Mail::to(config('school.email'))->send(new ContactFormMail($request->all()));
            
            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully!'
            ]);
        } catch (\Exception $e) {
            // Enhanced error logging
            Log::error('Failed to send email: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.',
                'error' => $e->getMessage()
            ], 500);
        }
    
    }
}
