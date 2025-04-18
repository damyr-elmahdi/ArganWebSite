<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use App\Services\PDFService;
use Illuminate\Support\Facades\Storage; // Add this import

class RegistrationController extends Controller
{
    protected $pdfService;
    
    public function __construct(PDFService $pdfService)
    {
        $this->pdfService = $pdfService;
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|unique:registrations,email',
            'phone_number' => 'required|string|max:20',
            'previous_school' => 'nullable|string|max:255',
            'date_of_birth' => 'required|date',
        ]);
        
        $registration = Registration::create($validated);
        
        // Generate info packet
        $pdfPath = $this->pdfService->generateInfoPacket($registration);
        $registration->info_packet_path = $pdfPath;
        $registration->save();
        
        return response()->json([
            'registration' => $registration,
            'download_url' => url("api/registrations/{$registration->id}/download-packet"),
        ], 201);
    }
    
    public function downloadInfoPacket(Registration $registration)
    {
        if (!$registration->info_packet_path || !Storage::exists($registration->info_packet_path)) {
            return response()->json(['message' => 'Info packet not found'], 404);
        }
        
        return Storage::download($registration->info_packet_path, 'School_Information_Packet.pdf');
    }
    
    // Admin methods (with auth middleware)
    public function index(Request $request)
    {
        $this->authorize('viewAny', Registration::class);
        
        $registrations = Registration::orderBy('created_at', 'desc')->paginate(15);
        
        return response()->json($registrations);
    }
    
    public function show(Registration $registration)
    {
        $this->authorize('view', $registration);
        
        return response()->json($registration);
    }
    
    public function markProcessed(Request $request, Registration $registration)
    {
        $this->authorize('update', $registration);
        
        $registration->processed = true;
        $registration->save();
        
        return response()->json($registration);
    }
}