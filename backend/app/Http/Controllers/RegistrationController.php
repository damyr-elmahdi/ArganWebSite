<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class RegistrationController extends Controller
{
    /**
     * Display a listing of registrations.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Check if user is authorized (administrators only)
        return response()->json([
            'registrations' => Registration::orderBy('created_at', 'desc')->get()
        ]);
    }

    /**
     * Store a newly created registration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'grade_applying_for' => 'required|string|max:50',
            'parent_name' => 'required|string|max:255',
            'parent_occupation' => 'required|string|max:255',
            'father_phone' => 'required|string|max:20',
            'mother_phone' => 'nullable|string|max:20',
            'student_phone' => 'required|string|max:20',
            'address' => 'required|string',
            'family_status' => 'required|string|in:with_parents,divorced,orphaned',
            'orphan_date' => 'nullable|date|required_if:family_status,orphaned',
            'previous_school' => 'nullable|string|max:255',
            'additional_notes' => 'nullable|string',
            'info_packet' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Handle file upload if included
            $filePath = null;
            if ($request->hasFile('info_packet') && $request->file('info_packet')->isValid()) {
                $file = $request->file('info_packet');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                
                // Store the file in a private directory
                $filePath = $file->storeAs('registrations/packets', $filename, 'private');
            }

            // Create registration record
            $registration = Registration::create([
                'full_name' => $request->input('full_name'),
                'date_of_birth' => $request->input('date_of_birth'),
                'grade_applying_for' => $request->input('grade_applying_for'),
                'parent_name' => $request->input('parent_name'),
                'parent_occupation' => $request->input('parent_occupation'),
                'father_phone' => $request->input('father_phone'),
                'mother_phone' => $request->input('mother_phone'),
                'student_phone' => $request->input('student_phone'),
                'address' => $request->input('address'),
                'previous_school' => $request->input('previous_school'),
                'family_status' => $request->input('family_status'),
                'orphan_date' => $request->input('orphan_date'),
                'additional_notes' => $request->input('additional_notes'),
                'info_packet_path' => $filePath,
            ]);

            return response()->json([
                'message' => 'Inscription soumise avec succès',
                'registration' => $registration,
            ], 201);

        } catch (\Exception $e) {
            // Log the error
            \Log::error('Registration submission failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Échec de soumission de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified registration.
     *
     * @param  \App\Models\Registration  $registration
     * @return \Illuminate\Http\Response
     */
    public function show(Registration $registration)
    {
        return response()->json(['registration' => $registration]);
    }

    /**
     * Mark a registration as processed.
     *
     * @param  \App\Models\Registration  $registration
     * @return \Illuminate\Http\Response
     */
    public function markProcessed(Registration $registration)
    {
        $registration->processed = true;
        $registration->save();
        
        return response()->json([
            'message' => 'Inscription marquée comme traitée',
            'registration' => $registration
        ]);
    }

    /**
     * Download the information packet for a registration.
     *
     * @param  \App\Models\Registration  $registration
     * @return \Illuminate\Http\Response
     */
    public function downloadInfoPacket(Registration $registration)
    {
        if (!$registration->info_packet_path || !Storage::disk('private')->exists($registration->info_packet_path)) {
            return response()->json(['message' => 'Dossier d\'information non trouvé'], 404);
        }
        
        return Storage::disk('private')->download(
            $registration->info_packet_path, 
            'dossier_inscription_' . $registration->id . '.' . pathinfo($registration->info_packet_path, PATHINFO_EXTENSION)
        );
    }

    /**
     * Generate PDF for a registration using standard Laravel PDF generation
     *
     * @param  \App\Models\Registration  $registration
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Registration $registration)
    {
        // Format the date
        $date = Carbon::now()->format('d-m-Y');
        
        // Get the school year
        $school_year = "2025-2026";
        
        // Map grade level codes to human-readable French text
        $gradeMap = [
            "TC-S" => "Tronc Commun - Sciences",
            "TC-LSH" => "Tronc Commun - Lettres et Sciences Humaines",
            "1BAC-SE" => "1ère Année Bac - Sciences Expérimentales",
            "1BAC-LSH" => "1ère Année Bac - Lettres et Sciences Humaines",
            "2BAC-PC" => "2ème Année Bac - Physique-Chimie",
            "2BAC-SVT" => "2ème Année Bac - Sciences de la Vie et de la Terre",
            "2BAC-SH" => "2ème Année Bac - Sciences Humaines",
            "2BAC-L" => "2ème Année Bac - Lettres",
        ];
        
        // Get the grade level text
        $grade_applying_for_text = $gradeMap[$registration->grade_applying_for] ?? $registration->grade_applying_for;
        
        // Map family status codes to human-readable French text
        $familyStatusMap = [
            "with_parents" => "Vit avec les parents",
            "divorced" => "Parents divorcés",
            "orphaned" => "Orphelin",
        ];
        
        // Get the family status text
        $family_status_text = $familyStatusMap[$registration->family_status] ?? $registration->family_status;

        // Create the PDF
        $pdf = PDF::loadView('pdfs.registration', compact(
            'registration',
            'date',
            'school_year',
            'grade_applying_for_text',
            'family_status_text'
        ));
        
        return $pdf->download('inscription_' . $registration->id . '.pdf');
    }

    /**
     * Generate PDF for a registration using mPDF
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function generatePdfWithMpdf($id)
    {
        try {
            // Find the registration by ID
            $registration = Registration::findOrFail($id);
            
            // Format the date
            $date = Carbon::now()->format('d-m-Y');
            
            // Get the school year
            $school_year = "2025-2026";
            
            // Map grade level codes to human-readable French text
            $gradeMap = [
                "TC-S" => "Tronc Commun - Sciences",
                "TC-LSH" => "Tronc Commun - Lettres et Sciences Humaines",
                "1BAC-SE" => "1ère Année Bac - Sciences Expérimentales",
                "1BAC-LSH" => "1ère Année Bac - Lettres et Sciences Humaines",
                "2BAC-PC" => "2ème Année Bac - Physique-Chimie",
                "2BAC-SVT" => "2ème Année Bac - Sciences de la Vie et de la Terre",
                "2BAC-SH" => "2ème Année Bac - Sciences Humaines",
                "2BAC-L" => "2ème Année Bac - Lettres",
            ];
            
            // Get the grade level text
            $grade_applying_for_text = $gradeMap[$registration->grade_applying_for] ?? $registration->grade_applying_for;
            
            // Map family status codes to human-readable French text
            $familyStatusMap = [
                "with_parents" => "Vit avec les parents",
                "divorced" => "Parents divorcés",
                "orphaned" => "Orphelin",
            ];
            
            // Get the family status text
            $family_status_text = $familyStatusMap[$registration->family_status] ?? $registration->family_status;
        
            // First, make sure we have a temp directory for mPDF with proper permissions
            $tempDir = storage_path('app/mpdf');
            if (!file_exists($tempDir)) {
                mkdir($tempDir, 0755, true);
            }

            // Check if required fonts directory exists, if not create it
            $fontDir = storage_path('fonts');
            if (!file_exists($fontDir)) {
                mkdir($fontDir, 0755, true);
            }
            
            // Define config for mPDF with simpler configuration
            $config = [
                'mode' => 'utf-8',
                'format' => 'A4',
                'default_font' => 'dejavu sans', // Using a font that's typically included with mPDF
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 16,
                'margin_bottom' => 16,
                'margin_header' => 9,
                'margin_footer' => 9,
                'tempDir' => $tempDir,
                'orientation' => 'P'
            ];
            
            // Initialize mPDF with the config
            $mpdf = new \Mpdf\Mpdf($config);
            
            // Get the HTML content (using the blade view)
            $html = view('pdfs.registration', compact(
                'registration',
                'date',
                'school_year',
                'grade_applying_for_text',
                'family_status_text'
            ))->render();
            
            // Write the HTML to the PDF
            $mpdf->WriteHTML($html);
            
            // Output the PDF as a downloadable file
            $fileName = 'inscription_' . $registration->id . '.pdf';
            return response($mpdf->Output($fileName, 'S'))
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');
                
        } catch (\Exception $e) {
            // Log the detailed error for debugging
            Log::error('PDF generation failed: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return a clearer error message
            return response()->json([
                'message' => 'Échec de génération du PDF: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }
    
    /**
     * Format grade level for display
     * 
     * @param string $gradeCode
     * @return string
     */
    private function formatGradeLevel($gradeCode)
    {
        $grades = [
            'TC-S' => 'Tronc Commun - Sciences',
            'TC-LSH' => 'Tronc Commun - Lettres et Sciences Humaines',
            '1BAC-SE' => '1ère Année Bac - Sciences Expérimentales',
            '1BAC-LSH' => '1ère Année Bac - Lettres et Sciences Humaines',
            '2BAC-PC' => '2ème Année Bac - Physique-Chimie',
            '2BAC-SVT' => '2ème Année Bac - Sciences de la Vie et de la Terre',
            '2BAC-SH' => '2ème Année Bac - Sciences Humaines',
            '2BAC-L' => '2ème Année Bac - Lettres',
        ];
        
        return $grades[$gradeCode] ?? $gradeCode;
    }
}