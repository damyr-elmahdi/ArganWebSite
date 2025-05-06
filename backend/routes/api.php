<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\EventCommentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\LibraryController;
use App\Http\Controllers\ResourceController;

use App\Http\Controllers\NewsController;
use App\Http\Controllers\RegistrationController;

use App\Http\Controllers\QuizAttemptController;
use App\Http\Controllers\QuizController;

use App\Http\Controllers\ResultsController;
use App\Http\Controllers\TeacherAbsenceController;
use App\Http\Controllers\UserManagementController;

use App\Http\Controllers\ClubController;
use App\Http\Controllers\ClubMemberController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\OutstandingStudentController;
use App\Http\Controllers\SubjectController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']);

// Public routes
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/registrations/{registration}/download-packet', [RegistrationController::class, 'downloadInfoPacket']);
Route::get('/registrations/{registration}/generate-pdf', [RegistrationController::class, 'generatePDF']);
Route::get('/registrations/{id}/generate-pdf-with-mpdf', [RegistrationController::class, 'generatePdfWithMpdf']);


Route::post('/contact', [ContactController::class, 'submitContactForm']);

// Public library routes
Route::get('/library', [LibraryController::class, 'index']);
Route::get('/library/categories', [LibraryController::class, 'categories']);
Route::get('/library/book-requests', [LibraryController::class, 'getBookRequests']);
Route::get('/library/{libraryItem}', [LibraryController::class, 'show']);

// Outstanding Students routes
Route::get('/outstanding-students', [OutstandingStudentController::class, 'index']);
Route::post('/outstanding-students', [OutstandingStudentController::class, 'store'])->middleware(['auth:sanctum', 'admin']);
Route::get('/outstanding-students/{id}', [OutstandingStudentController::class, 'show']);
Route::put('/outstanding-students/{id}', [OutstandingStudentController::class, 'update'])->middleware(['auth:sanctum', 'admin']);
Route::delete('/outstanding-students/{id}', [OutstandingStudentController::class, 'destroy'])->middleware(['auth:sanctum', 'admin']);

// Club routes
Route::get('/clubs', [ClubController::class, 'index']);
Route::get('/clubs/{club}', [ClubController::class, 'show']);
Route::get('/clubs/{club}/members', [ClubController::class, 'members']);


// Public exam routes
Route::get('/exams', [ExamController::class, 'index']);
Route::get('/exams/{exam}', [ExamController::class, 'show']);
Route::get('/exams/classes/list', [ExamController::class, 'getClasses']);
Route::get('/exams/class/{class}', [ExamController::class, 'getExamsByClass']);

// Public subject routes
Route::get('/subjects', [SubjectController::class, 'index']);
Route::get('/subjects/{subject}', [SubjectController::class, 'show']);

// Protected exam routes (for administrators and teachers)
Route::middleware(['auth:sanctum', 'role:administrator,teacher'])->group(function () {
    Route::post('/exams', [ExamController::class, 'store']);
    Route::put('/exams/{exam}', [ExamController::class, 'update']);
    Route::delete('/exams/{exam}', [ExamController::class, 'destroy']);

    Route::post('/subjects', [SubjectController::class, 'store']);
    Route::put('/subjects/{subject}', [SubjectController::class, 'update']);
    Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Club management routes (admin only)
    Route::middleware('role:administrator')->group(function () {
        Route::post('/clubs', [ClubController::class, 'store']);
        Route::put('/clubs/{club}', [ClubController::class, 'update']);
        Route::delete('/clubs/{club}', [ClubController::class, 'destroy']);
        
        // Club member management
        Route::post('/clubs/{club}/members', [ClubMemberController::class, 'store']);
        Route::put('/clubs/{club}/members/{member}', [ClubMemberController::class, 'update']);
        Route::delete('/clubs/{club}/members/{member}', [ClubMemberController::class, 'destroy']);
    });
});


// Public resource routes
Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{resource}', [ResourceController::class, 'show']);
Route::get('/resources/{resource}/download', [ResourceController::class, 'download'])->name('resources.download');
Route::get('/resources/{resource}/view', [ResourceController::class, 'view'])->name('resources.view');


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Resource management routes
    Route::post('/resources/upload', [ResourceController::class, 'upload']);
    Route::delete('/resources/{resource}', [ResourceController::class, 'destroy']);

    // Route::get('/library/book-requests', [LibraryController::class, 'getBookRequests']);
    Route::get('/library/book-stats', [LibraryController::class, 'bookStats']);

    // Other library-related routes...
    Route::post('/library', [LibraryController::class, 'store']);
    Route::put('/library/{libraryItem}', [LibraryController::class, 'update']);
    Route::delete('/library/{libraryItem}', [LibraryController::class, 'destroy']);
    Route::post('/library/{libraryItem}/return', [LibraryController::class, 'markBookReturned']);
    Route::post('/library/{libraryItem}/borrow', [LibraryController::class, 'borrowBook']);

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

    // Student routes
    Route::middleware(['role:student'])->group(function () {
        Route::post('/quizzes/{quiz}/start', [QuizAttemptController::class, 'start']);
        Route::post('/attempts/{attempt}/answer', [QuizAttemptController::class, 'submitAnswer']);
        Route::post('/attempts/{attempt}/complete', [QuizAttemptController::class, 'complete']);
        Route::get('/attempts/{attempt}/results', [QuizAttemptController::class, 'results']);
        Route::get('/user/quiz-attempts', [QuizAttemptController::class, 'userAttempts']);
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

Route::middleware(['auth:sanctum'])->group(function () {
    // Common routes
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{quiz}', [QuizController::class, 'show']);

    // Student routes
    Route::middleware(['role:student'])->group(function () {
        Route::post('/quizzes/{quiz}/start', [QuizAttemptController::class, 'start']);
        Route::post('/attempts/{attempt}/answer', [QuizAttemptController::class, 'submitAnswer']);
        Route::post('/attempts/{attempt}/complete', [QuizAttemptController::class, 'complete']);
        Route::get('/attempts/{attempt}/results', [QuizAttemptController::class, 'results']);
    });

    // Teacher routes
    Route::middleware(['role:teacher'])->group(function () {
        Route::post('/quizzes', [QuizController::class, 'store']);
        Route::put('/quizzes/{quiz}', [QuizController::class, 'update']); 
        Route::get('/results', [ResultsController::class, 'index']);
        Route::get('/results/{attempt}', [ResultsController::class, 'show']);
        
        Route::get('/teacher/quizzes', [QuizController::class, 'teacherQuizzes']);
    });

    // Admin user management routes
    Route::middleware('role:administrator')->group(function () {
        // User management
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::get('/users/{user}', [UserManagementController::class, 'show']);
        Route::put('/users/{user}', [UserManagementController::class, 'update']);
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy']);
        Route::post('/users/{user}/reset-password', [UserManagementController::class, 'resetPassword']);
    });
});