<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        
        if (empty($roles)) {
            return $next($request);
        }
        
        foreach ($roles as $role) {
            $method = 'is' . ucfirst($role);
            if (method_exists($request->user(), $method) && $request->user()->$method()) {
                return $next($request);
            }
        }
        
        return response()->json(['message' => 'Access denied.'], 403);
    }
}