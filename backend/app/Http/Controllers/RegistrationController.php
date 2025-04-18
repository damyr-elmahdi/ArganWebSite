<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class RegistrationController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Registration::class);
        
        $registrations = Registration::orderBy('created_at', 'desc')->get();
        return response()->json($registrations);
    }

    public function show(Registration $registration)
    {
        $this->authorize('view', $registration);
        
        return response()->json($registration);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'date_of_birth' => 'required|date',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'previous_school' => 'nullable|string|max:255',
            'grade_applying_for' => 'required|string|max:50',
            'additional_notes' => 'nullable|string',
            'info_packet' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ]);
        
        $registrationData = $request->except('info_packet');
        $registrationData['processed'] = false;
        
        // Handle file upload if present
        if ($request->hasFile('info_packet') && $request->file('info_packet')->isValid()) {
            $path = $request->file('info_packet')->store('registration_documents', 'public');
            $registrationData['info_packet_path'] = $path;
        }
        
        $registration = Registration::create($registrationData);
        
        return response()->json([
            'message' => 'Registration submitted successfully',
            'registration' => $registration
        ], 201);
    }

    public function markProcessed(Registration $registration)
    {
        $this->authorize('update', $registration);
        
        $registration->processed = true;
        $registration->save();
        
        return response()->json([
            'message' => 'Registration marked as processed',
            'registration' => $registration
        ]);
    }

    public function downloadInfoPacket(Registration $registration)
    {
        if (!$registration->info_packet_path) {
            return response()->json(['message' => 'No information packet found'], 404);
        }
        
        if (!Storage::disk('public')->exists($registration->info_packet_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }
        
        $file = Storage::disk('public')->get($registration->info_packet_path);
        $type = Storage::disk('public')->mimeType($registration->info_packet_path);
        $filename = basename($registration->info_packet_path);
        
        return Response::make($file, 200, [
            'Content-Type' => $type,
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ]);
    }
}