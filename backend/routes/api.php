<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/registrations/{registration}/download-packet', [RegistrationController::class, 'downloadInfoPacket']);

// Password reset routes
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/news/{news}/comments', [CommentController::class, 'store']);
    Route::put('/news/{news}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/news/{news}/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Add recovery email update route
    Route::post('/update-recovery-email', [AuthController::class, 'updateRecoveryEmail']);

    // Admin routes
    Route::middleware('role:administrator')->group(function () {
        Route::get('/registrations', [RegistrationController::class, 'index']);
        Route::get('/registrations/{registration}', [RegistrationController::class, 'show']);
        Route::patch('/registrations/{registration}/mark-processed', [RegistrationController::class, 'markProcessed']);
    });

    // Student routes
    Route::middleware('role:student')->group(function () {
        // Add student-specific routes here
    });

    // Teacher routes
    Route::middleware('role:teacher')->group(function () {
        // Add teacher-specific routes here
    });
});

// News routes
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{news}', [NewsController::class, 'show']);
Route::get('/news/{news}/comments', [CommentController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    // Existing routes...

    // News routes for authenticated users
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    Route::patch('/news/{news}/publish', [NewsController::class, 'publish']);
    Route::patch('/news/{news}/archive', [NewsController::class, 'archive']);

    // Events routes
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
});