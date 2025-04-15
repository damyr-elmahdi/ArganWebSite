<?php
// app/Services/PDFService.php
namespace App\Services;

use App\Models\Registration;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFService
{
    public function generateInfoPacket(Registration $registration)
    {
        // Create PDF content
        $pdf = PDF::loadView('pdfs.info_packet', [
            'registration' => $registration,
            'schoolInfo' => $this->getSchoolInfo(),
        ]);
        
        // Save PDF to storage
        $path = 'information_packets/' . uniqid() . '.pdf';
        Storage::put($path, $pdf->output());
        
        return $path;
    }
    
    private function getSchoolInfo()
    {
        // This could be fetched from database or config
        return [
            'name' => 'School Name',
            'address' => '123 Education St, Learning City',
            'phone' => '(555) 123-4567',
            'email' => 'info@schoolwebsite.edu',
            'website' => 'https://schoolwebsite.edu',
            'programs' => [
                'Academic Programs',
                'Extracurricular Activities',
                'Student Support Services',
            ],
            'admissionRequirements' => [
                'Academic Records',
                'Application Form',
                'Interview Process',
            ],
            'facilities' => [
                'Library',
                'Computer Labs',
                'Sports Complex',
                'Arts Center',
            ],
        ];
    }
}