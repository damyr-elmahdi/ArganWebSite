<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Services\PDFService;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'previous_school',
        'date_of_birth',
        'info_packet_path',
        'processed',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'processed' => 'boolean',
    ];
    
    public function submit()
    {
        // Implementation for submission processing
        return true;
    }
    
    public function generateInfoPacket()
    {
        $pdfService = new PDFService();
        $pdfPath = $pdfService->generateInfoPacket($this);
        
        $this->info_packet_path = $pdfPath;
        $this->save();
        
        return $pdfPath;
    }
}
