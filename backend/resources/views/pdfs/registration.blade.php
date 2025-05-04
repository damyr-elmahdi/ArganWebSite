<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Formulaire d'Inscription - {{ $registration->full_name }}</title>
    <style>
        @page {
            margin: 20px;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 8px;
        }
        .logo {
            max-width: 80px;
            margin-bottom: 5px;
        }
        .school-name {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin: 0;
        }
        .ministry {
            font-size: 12px;
            color: #666;
            margin-top: 2px;
        }
        .date {
            text-align: right;
            margin-bottom: 10px;
            font-size: 11px;
        }
        .section {
            margin-bottom: 10px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            margin-bottom: 8px;
            color: #1e40af;
        }
        .field {
            margin-bottom: 6px;
        }
        .field-label {
            font-weight: bold;
            display: inline-block;
            min-width: 180px;
        }
        .field-value {
            display: inline-block;
        }
        .signature-box {
            border: 1px solid #ddd;
            height: 60px;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .footer {
            margin-top: 15px;
            padding-top: 5px;
            border-top: 1px solid #ddd;
            font-size: 10px;
            text-align: center;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
            text-align: left;
            padding: 5px;
            width: 40%;
            font-size: 11px;
        }
        td {
            padding: 5px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <img class="logo" src="{{ public_path('images/argan.png') }}" alt="Logo Lycée Argan">
        <h1 class="school-name">Lycée Argan</h1>
        <p class="ministry">Ministère de l'Éducation et de l'Éducation de la Petite Enfance</p>
    </div>
    
    <div class="date">
        <p>Date: {{ now()->format('d/m/Y') }}</p>
    </div>
    
    <h2 style="text-align: center; margin: 10px 0; font-size: 16px;">FORMULAIRE D'INSCRIPTION</h2>
    
    <div class="section">
        <h3 class="section-title">Informations de l'étudiant</h3>
        <table>
            <tr>
                <th>Nom complet:</th>
                <td>{{ $registration->full_name }}</td>
            </tr>
            @if($registration->date_of_birth)
            <tr>
                <th>Date de naissance:</th>
                <td>{{ $registration->date_of_birth->format('d/m/Y') }}</td>
            </tr>
            @endif
            <tr>
                <th>Niveau académique:</th>
                <td>{{ $registration->grade_applying_for }}</td>
            </tr>
            @if($registration->previous_school)
            <tr>
                <th>École précédente:</th>
                <td>{{ $registration->previous_school }}</td>
            </tr>
            @endif
            @if($registration->student_phone)
            <tr>
                <th>Numéro de téléphone:</th>
                <td>{{ $registration->student_phone }}</td>
            </tr>
            @endif
        </table>
    </div>
    
    <div class="section">
        <h3 class="section-title">Informations du parent/tuteur</h3>
        <table>
            <tr>
                <th>Nom du père/tuteur:</th>
                <td>{{ $registration->parent_name }}</td>
            </tr>
            <tr>
                <th>Profession:</th>
                <td>{{ $registration->parent_occupation }}</td>
            </tr>
            <tr>
                <th>Téléphone du père:</th>
                <td>{{ $registration->father_phone }}</td>
            </tr>
            <tr>
                <th>Téléphone de la mère:</th>
                <td>{{ $registration->mother_phone }}</td>
            </tr>
        </table>
    </div>
    
    <div class="section">
        <h3 class="section-title">Adresse et situation familiale</h3>
        <table>
            <tr>
                <th>Adresse:</th>
                <td>{{ $registration->address }}</td>
            </tr>
            <tr>
                <th>État civil:</th>
                <td>
                    @if($registration->family_status == 'intact')
                        Les parents vivent ensemble
                    @elseif($registration->family_status == 'divorced')
                        Parents divorcés
                    @elseif($registration->family_status == 'orphan')
                        Orphelin
                    @endif
                </td>
            </tr>
            @if($registration->family_status == 'orphan' && $registration->orphan_date)
            <tr>
                <th>Date de décès du père:</th>
                <td>{{ $registration->orphan_date->format('d/m/Y') }}</td>
            </tr>
            @endif
        </table>
    </div>
    
    @if($registration->additional_notes)
    <div class="section">
        <h3 class="section-title">Notes additionnelles</h3>
        <p style="font-size: 11px;">{{ $registration->additional_notes }}</p>
    </div>
    @endif
    
    <div class="section">
        <h3 class="section-title">Signature</h3>
        <p style="margin: 0 0 2px 0; font-size: 11px;">Signature du père ou tuteur:</p>
        @if($registration->info_packet_path)
        <div class="signature">
            <img src="{{ storage_path('app/public/' . $registration->info_packet_path) }}" width="180">
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