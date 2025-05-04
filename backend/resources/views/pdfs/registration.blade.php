<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Formulaire d'Inscription - {{ $registration->full_name }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 10px;
        }
        .logo {
            max-width: 120px;
            margin-bottom: 10px;
        }
        .school-name {
            font-size: 22px;
            font-weight: bold;
            color: #1e40af;
            margin: 0;
        }
        .ministry {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .date {
            text-align: right;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #1e40af;
        }
        .field {
            margin-bottom: 12px;
        }
        .field-label {
            font-weight: bold;
            display: inline-block;
            min-width: 200px;
        }
        .field-value {
            display: inline-block;
        }
        .signature-box {
            border: 1px solid #ddd;
            height: 80px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <img class="logo" src="{{ public_path('../argan.png') }}" alt="Logo Lycée Argan">
        <h1 class="school-name">Lycée Argan</h1>
        <p class="ministry">Ministère de l'Éducation et de l'Éducation de la Petite Enfance</p>
        <img class="logo" src="{{ public_path('../Ministry.png') }}" alt="Logo Ministère de l'Éducation et de l'Éducation de la Petite Enfance">

    </div>
    
    <div class="date">
        <p>Date: {{ now()->format('d/m/Y') }}</p>
    </div>
    
    <h2 style="text-align: center; margin-bottom: 20px;">FORMULAIRE D'INSCRIPTION</h2>
    
    <div class="section">
        <h3 class="section-title">Informations de l'étudiant</h3>
        <div class="field">
            <span class="field-label">Nom complet:</span>
            <span class="field-value">{{ $registration->full_name }}</span>
        </div>
        @if($registration->date_of_birth)
        <div class="field">
            <span class="field-label">Date de naissance:</span>
            <span class="field-value">{{ $registration->date_of_birth->format('d/m/Y') }}</span>
        </div>
        @endif
        <div class="field">
            <span class="field-label">Niveau académique:</span>
            <span class="field-value">{{ $registration->grade_applying_for }}</span>
        </div>
        @if($registration->previous_school)
        <div class="field">
            <span class="field-label">École précédente:</span>
            <span class="field-value">{{ $registration->previous_school }}</span>
        </div>
        @endif
        <div class="field">
            <span class="field-label">Numéro de téléphone:</span>
            <span class="field-value">{{ $registration->student_phone }}</span>
        </div>
    </div>
    
    <div class="section">
        <h3 class="section-title">Informations du parent/tuteur</h3>
        <div class="field">
            <span class="field-label">Nom du père/tuteur:</span>
            <span class="field-value">{{ $registration->parent_name }}</span>
        </div>
        <div class="field">
            <span class="field-label">Profession:</span>
            <span class="field-value">{{ $registration->parent_occupation }}</span>
        </div>
        <div class="field">
            <span class="field-label">Téléphone du père:</span>
            <span class="field-value">{{ $registration->father_phone }}</span>
        </div>
        @if($registration->mother_phone)
        <div class="field">
            <span class="field-label">Téléphone de la mère:</span>
            <span class="field-value">{{ $registration->mother_phone }}</span>
        </div>
        @endif
    </div>
    
    <div class="section">
        <h3 class="section-title">Adresse et situation familiale</h3>
        <div class="field">
            <span class="field-label">Adresse:</span>
            <span class="field-value">{{ $registration->address }}</span>
        </div>
        <div class="field">
            <span class="field-label">État civil:</span>
            <span class="field-value">
                @if($registration->family_status == 'intact')
                    Les parents vivent ensemble
                @elseif($registration->family_status == 'divorced')
                    Parents divorcés
                @elseif($registration->family_status == 'orphan')
                    Orphelin
                @endif
            </span>
        </div>
        @if($registration->family_status == 'orphan' && $registration->orphan_date)
        <div class="field">
            <span class="field-label">Date de décès du père:</span>
            <span class="field-value">{{ $registration->orphan_date->format('d/m/Y') }}</span>
        </div>
        @endif
    </div>
    
    @if($registration->additional_notes)
    <div class="section">
        <h3 class="section-title">Notes additionnelles</h3>
        <p>{{ $registration->additional_notes }}</p>
    </div>
    @endif
    
    <div class="section">
        <h3 class="section-title">Signature</h3>
        <p>Signature du père ou tuteur:</p>
        @if($registration->info_packet_path)
        <div class="signature">
            <img src="{{ storage_path('app/public/' . $registration->info_packet_path) }}" width="200">
        </div>
        @else
        <div class="signature-box"></div>
        @endif
    </div>
    
    <div class="footer">
        <p>Lycée Argan - Tiznit, Maroc - Tél: (555) 123-4567 - Email: info@arganhighschool.edu</p>
    </div>
</body>
</html>