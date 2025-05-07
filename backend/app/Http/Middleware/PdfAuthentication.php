<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class PdfAuthentication
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the route is for viewing or downloading PDFs
        if ($request->is('api/exams/*/view') || $request->is('api/exams/*/download')) {
            // If user is already authenticated through Sanctum, proceed
            if (Auth::check()) {
                return $next($request);
            }
            
            // Otherwise check for token as query parameter
            if ($request->filled('token')) {
                $token = $request->query('token');
                
                // Try to find and validate the token manually
                $accessToken = PersonalAccessToken::findToken($token);
                
                if ($accessToken) {
                    // Set the authenticated user
                    $user = $accessToken->tokenable;
                    Auth::login($user);
                    return $next($request);
                }
            }
            
            // If we reach here, authentication failed
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return $next($request);
    }
}