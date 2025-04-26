<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\CommentController;
use App\Http\Controllers\EventCommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\ForgotPasswordController;

use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\TeacherAbsenceController;


// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/registrations/{registration}/download-packet', [RegistrationController::class, 'downloadInfoPacket']);

// Password reset routes
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');


// Public library routes
Route::get('/library', [LibraryController::class, 'index']);
Route::get('/library/categories', [LibraryController::class, 'categories']); 
Route::get('/library/{libraryItem}', [LibraryController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Library Items Routes (protected ones that require authentication)
    Route::post('/library', [LibraryController::class, 'store']);
    Route::put('/library/{libraryItem}', [LibraryController::class, 'update']);
    Route::delete('/library/{libraryItem}', [LibraryController::class, 'destroy']);

    // Librarian Routes

    // News Comments Routes
    Route::post('/news/{news}/comments', [CommentController::class, 'store']);
    Route::put('/news/{news}/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/news/{news}/comments/{comment}', [CommentController::class, 'destroy']);
    
    // Event Comments Routes
    Route::post('/events/{event}/comments', [EventCommentController::class, 'store']);
    Route::put('/events/{event}/comments/{comment}', [EventCommentController::class, 'update']);
    Route::delete('/events/{event}/comments/{comment}', [EventCommentController::class, 'destroy']);

    // Add recovery email update route
    Route::post('/update-recovery-email', [AuthController::class, 'updateRecoveryEmail']);

    // Admin routes
    Route::middleware('role:administrator')->group(function () {
        // Existing admin routes...
        Route::get('/registrations', [RegistrationController::class, 'index']);
        Route::get('/registrations/{registration}', [RegistrationController::class, 'show']);
        Route::patch('/registrations/{registration}/mark-processed', [RegistrationController::class, 'markProcessed']);

        // Teacher absence management
        Route::get('/teachers', [TeacherAbsenceController::class, 'getTeachers']);
        Route::get('/absences', [TeacherAbsenceController::class, 'index']);
        Route::post('/absences', [TeacherAbsenceController::class, 'store']);
        Route::put('/absences/{absence}', [TeacherAbsenceController::class, 'update']);
        Route::delete('/absences/{absence}', [TeacherAbsenceController::class, 'destroy']);
    });

    // Student routes
    Route::middleware('role:student')->group(function () {
        // Absence notifications for students
        Route::get('/absence-notifications', [TeacherAbsenceController::class, 'getStudentNotifications']);
        Route::patch('/absence-notifications/{notification}/read', [TeacherAbsenceController::class, 'markAsRead']);
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

// Public event routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/events/{event}/comments', [EventCommentController::class, 'index']);

// Protected routes for content management
Route::middleware('auth:sanctum')->group(function () {
    // News routes for authenticated users
    Route::post('/news', [NewsController::class, 'store']);
    Route::put('/news/{news}', [NewsController::class, 'update']);
    Route::delete('/news/{news}', [NewsController::class, 'destroy']);
    Route::patch('/news/{news}/publish', [NewsController::class, 'publish']);
    Route::patch('/news/{news}/archive', [NewsController::class, 'archive']);

    // Protected event routes
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
});