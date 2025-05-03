<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;
use PDF;
use Mpdf\Mpdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RegistrationController extends Controller
{
    /**
     * Display a listing of the registrations.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registrations = Registration::latest()->paginate(10);
        return response()->json($registrations);
    }

    /**
     * Store a newly created registration in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'studentName' => 'required|string|max:255',
            'academicLevel' => 'required|string|max:50',
            'parentName' => 'required|string|max:255',
            'parentProfession' => 'required|string|max:255',
            'fatherPhone' => 'required|string|max:20',
            'motherPhone' => 'required|string|max:20',
            'studentPhone' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'civilStatus' => 'required|string|in:together,divorced,orphan',
            'deathDate' => 'nullable|date|required_if:civilStatus,orphan',
            'signature' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        // Si la signature est une chaîne base64, stockez-la dans un fichier
        $signaturePath = null;
        if ($request->has('signature') && $request->signature !== null) {
            // Extrait les données base64 (en enlevant l'en-tête)
            $signatureData = explode(',', $request->signature);
            $base64Data = end($signatureData);
            
            // Décode les données base64
            $decodedData = base64_decode($base64Data);
            
            // Génère un nom de fichier unique
            $filename = 'signature_' . time() . '.png';
            
            // Stocke l'image dans le système de fichiers
            Storage::disk('public')->put('signatures/' . $filename, $decodedData);
            
            // Sauvegarde le chemin du fichier
            $signaturePath = 'signatures/' . $filename;
        }

        // Map frontend field names to database field names
        $registration = Registration::create([
            'full_name' => $request->studentName,
            'grade_applying_for' => $request->academicLevel,
            'parent_name' => $request->parentName,
            'parent_occupation' => $request->parentProfession,
            'father_phone' => $request->fatherPhone,
            'mother_phone' => $request->motherPhone,
            'student_phone' => $request->studentPhone,
            'address' => $request->address,
            'family_status' => $this->mapCivilStatus($request->civilStatus),
            'orphan_date' => $request->deathDate,
            'info_packet_path' => $signaturePath, // Use this field for signature path
            'processed' => false,
        ]);

        return response()->json([
            'message' => 'Inscription enregistrée avec succès',
            'id' => $registration->id
        ], 201);
    }

    /**
     * Map frontend civil status to database values
     */
    private function mapCivilStatus($status)
    {
        switch ($status) {
            case 'together':
                return 'intact';
            case 'divorced':
                return 'divorced';
            case 'orphan':
                return 'orphan';
            default:
                return 'intact';
        }
    }

    /**
     * Display the specified registration.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $registration = Registration::findOrFail($id);
        return response()->json($registration);
    }

    /**
     * Mark a registration as processed.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function markProcessed(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);
        $registration->update(['processed' => true]);
        
        return response()->json([
            'message' => 'Inscription marquée comme traitée',
            'registration' => $registration
        ]);
    }

    /**
     * Generate a PDF for the registration and download it.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function downloadInfoPacket($id)
    {
        $registration = Registration::findOrFail($id);
        
        // Génère le PDF avec Laravel-PDF
        $pdf = PDF::loadView('pdfs.registration', [
            'registration' => $registration,
            'date' => date('d/m/Y'),
        ]);
        
        $filename = 'inscription_' . str_replace(' ', '_', $registration->full_name) . '.pdf';
        
        return $pdf->download($filename);
    }

    /**
     * Generate a PDF with mPDF library for better control over styling.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePdfWithMpdf($id)
    {
        $registration = Registration::findOrFail($id);
        
        // Configuration de mPDF
        $mpdf = new Mpdf([
            'mode' => 'utf-8', 
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 15,
            'margin_bottom' => 15
        ]);
        
        // Ajout d'en-tête ou de pied de page
        $mpdf->SetHTMLHeader('<div style="text-align: center; font-weight: bold;">
            <img src="' . public_path('images/school-logo.png') . '" width="100" style="display: block; margin: 0 auto;">
            <h2>Argan High School</h2>
        </div>');
        
        // Récupération de la signature
        $signatureHtml = '';
        if ($registration->info_packet_path) {
            $signatureUrl = Storage::disk('public')->url($registration->info_packet_path);
            $signatureHtml = '<div><img src="' . $signatureUrl . '" width="200"></div>';
        }
        
        // Statut civil avec traduction
        $civilStatus = 'Parents ensemble';
        if ($registration->family_status === 'divorced') {
            $civilStatus = 'Parents divorcés';
        } elseif ($registration->family_status === 'orphan') {
            $civilStatus = 'Orphelin';
        }
        
        // Création du contenu HTML
        $html = '
        <style>
            body { font-family: sans-serif; }
            h1 { text-align: center; color: #333; margin-bottom: 20px; }
            .date { text-align: right; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table, th, td { border: 1px solid #ccc; }
            th { background-color: #f2f2f2; text-align: left; padding: 10px; }
            td { padding: 10px; }
            .signature-section { margin-top: 30px; }
        </style>
        
        <h1>Formulaire d\'Inscription</h1>
        <div class="date">Date: ' . date('d/m/Y') . '</div>
        
        <table>
            <tr>
                <th>Nom complet de l\'étudiant</th>
                <td>' . $registration->full_name . '</td>
            </tr>
            <tr>
                <th>Niveau académique</th>
                <td>' . $registration->grade_applying_for . '</td>
            </tr>
            <tr>
                <th>Nom complet du père ou du tuteur</th>
                <td>' . $registration->parent_name . '</td>
            </tr>
            <tr>
                <th>Profession du père ou du tuteur</th>
                <td>' . $registration->parent_occupation . '</td>
            </tr>
            <tr>
                <th>Numéro de téléphone du père</th>
                <td>' . $registration->father_phone . '</td>
            </tr>
            <tr>
                <th>Numéro de téléphone de la mère</th>
                <td>' . $registration->mother_phone . '</td>
            </tr>';
            
        // Ajout du téléphone étudiant si disponible
        if ($registration->student_phone) {
            $html .= '
            <tr>
                <th>Numéro de téléphone de l\'étudiant</th>
                <td>' . $registration->student_phone . '</td>
            </tr>';
        }
            
        $html .= '
            <tr>
                <th>Adresse de résidence</th>
                <td>' . $registration->address . '</td>
            </tr>
            <tr>
                <th>État civil</th>
                <td>' . $civilStatus . '</td>
            </tr>';
            
        // Ajout de la date de décès si orphelin
        if ($registration->family_status === 'orphan' && $registration->orphan_date) {
            $html .= '
            <tr>
                <th>Date de décès du père</th>
                <td>' . date('d/m/Y', strtotime($registration->orphan_date)) . '</td>
            </tr>';
        }
            
        $html .= '
        </table>
        
        <div class="signature-section">
            <h3>Signature du père ou du tuteur</h3>
            ' . $signatureHtml . '
        </div>';
        
        $mpdf->WriteHTML($html);
        
        $filename = 'inscription_' . str_replace(' ', '_', $registration->full_name) . '.pdf';
        
        // Output
        return $mpdf->Output($filename, 'D');
    }

    /**
     * Generate a PDF with Laravel's built-in PDF generator.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generatePDF($id)
    {
        $registration = Registration::findOrFail($id);
        
        $data = [
            'registration' => $registration,
            'date' => date('d/m/Y'),
            'civilStatus' => $registration->family_status === 'intact' ? 'Parents ensemble' : 
                           ($registration->family_status === 'divorced' ? 'Parents divorcés' : 'Orphelin')
        ];
        
        $pdf = PDF::loadView('pdfs.registration', $data);
        
        $filename = 'inscription_' . str_replace(' ', '_', $registration->full_name) . '.pdf';
        
        return $pdf->download($filename);
    }
}