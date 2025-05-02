<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use PDF;
use Carbon\Carbon;

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
            'date_of_birth' => 'nullable|date',
            'address' => 'required|string',
            'previous_school' => 'nullable|string|max:255',
            'parent_name' => 'required|string|max:255',
            'parent_occupation' => 'required|string|max:255',
            'father_phone' => 'required|string|max:20',
            'mother_phone' => 'nullable|string|max:20',
            'student_phone' => 'required|string|max:20',
            'family_status' => 'required|string|in:with_parents,divorced,orphaned',
            'orphan_date' => 'nullable|date|required_if:family_status,orphaned',
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
    
    /**
     * Generate a PDF for the registration
     */
    public function generatePDF(Registration $registration)
    {
        // Map family status to Arabic text
        $familyStatusText = [
            'with_parents' => 'يعيش مع الوالدين',
            'divorced' => 'الوالدين منفصلين',
            'orphaned' => 'يتيم'
        ];

        // Format the current date in Arabic
        $today = Carbon::now()->locale('ar')->translatedFormat('d F Y');
        
        // Create a data array for the view
        $data = [
            'registration' => $registration,
            'familyStatusText' => $familyStatusText[$registration->family_status] ?? $registration->family_status,
            'today' => $today
        ];
        
        // Generate PDF using the Laravel PDF package
        $pdf = PDF::loadView('pdfs.registration', $data);
        
        // Set RTL direction for Arabic
        $pdf->setOption('enable-local-file-access', true);
        $pdf->setOption('orientation', 'portrait');
        $pdf->setOption('page-size', 'A4');
        $pdf->setOption('margin-top', '10mm');
        $pdf->setOption('margin-right', '10mm');
        $pdf->setOption('margin-bottom', '10mm');
        $pdf->setOption('margin-left', '10mm');
        $pdf->setOption('encoding', 'UTF-8');
        $pdf->setOption('isRemoteEnabled', true);
        $pdf->setOption('isPhpEnabled', true);
        
        // Download the PDF with a custom filename
        return $pdf->download('registration_' . $registration->id . '.pdf');
    }
}