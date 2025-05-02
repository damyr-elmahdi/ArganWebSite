<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use PDF;

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
                'message' => 'Registration submitted successfully',
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
                'message' => 'Failed to submit registration',
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
            'message' => 'Registration marked as processed',
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
            return response()->json(['message' => 'Information packet not found'], 404);
        }
        
        return Storage::disk('private')->download(
            $registration->info_packet_path, 
            'registration_info_packet_' . $registration->id . '.' . pathinfo($registration->info_packet_path, PATHINFO_EXTENSION)
        );
    }

    /**
     * Generate a PDF for the registration.
     *
     * @param  \App\Models\Registration  $registration
     * @return \Illuminate\Http\Response
     */
    public function generatePDF(Registration $registration)
    {
        // Configure PDF options for Arabic support
        $config = [
            'margin-top'    => 20,
            'margin-right'  => 20,
            'margin-bottom' => 20,
            'margin-left'   => 20,
            'default-font' => 'dejavu sans',
            'enable-javascript' => true,
            'javascript-delay' => 5000,
            'encoding' => 'UTF-8',
            'user-style-sheet' => public_path('css/pdf.css'),
            'orientation' => 'portrait',
            'dir' => 'rtl',  // Right-to-left direction for Arabic
        ];

        // Prepare data for PDF
        $data = [
            'registration' => $registration,
            'date' => now()->format('d F Y'),
            'school_year' => '2025-2026',
            // Map family status to Arabic text
            'family_status_text' => [
                'with_parents' => 'يعيش مع الوالدين',
                'divorced' => 'الوالدين منفصلين',
                'orphaned' => 'يتيم'
            ][$registration->family_status] ?? $registration->family_status,
            // Format grade level to display more readable text
            'grade_applying_for_text' => $this->formatGradeLevel($registration->grade_applying_for)
        ];

        // Generate the PDF with Arabic support
        $pdf = PDF::loadView('pdf.registration', $data, [], $config);
        $pdf->setOption('dpi', 150);
        
        // Download the PDF with a descriptive filename
        return $pdf->download('registration_' . $registration->id . '.pdf');
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
            'TC-S' => 'الجذع المشترك - علوم',
            'TC-LSH' => 'الجذع المشترك - آداب وعلوم إنسانية',
            '1BAC-SE' => 'السنة الأولى باكالوريا - علوم تجريبية',
            '1BAC-LSH' => 'السنة الأولى باكالوريا - آداب وعلوم إنسانية',
            '2BAC-PC' => 'السنة الثانية باكالوريا - علوم فيزيائية وكيمياء',
            '2BAC-SVT' => 'السنة الثانية باكالوريا - علوم الحياة والأرض',
            '2BAC-SH' => 'السنة الثانية باكالوريا - العلوم الإنسانية',
            '2BAC-L' => 'السنة الثانية باكالوريا - آداب',
        ];
        
        return $grades[$gradeCode] ?? $gradeCode;
    }
}