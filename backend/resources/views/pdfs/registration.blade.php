<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Formulaire d'Inscription</title>
    <style>
        body {
            font-family: dejavusans, sans-serif; /* Specifically using dejavusans for better Arabic support */
            font-size: 14pt;
            line-height: 1.5;
            color: #333;
            direction: ltr; /* Using LTR as base direction */
        }
        h1 {
            font-size: 24pt;
            text-align: center;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 18pt;
            margin-top: 30px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header-title {
            font-size: 28pt;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .sub-title {
            font-size: 18pt;
            margin-bottom: 10px;
        }
        .date {
            font-size: 14pt;
            margin-bottom: 20px;
        }
        
        /* Tables for layout */
        table.info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table.info-table td.label {
            width: 30%;
            font-weight: bold;
            padding: 5px;
            vertical-align: top;
        }
        table.info-table td.value {
            width: 70%;
            padding: 5px;
            vertical-align: top;
        }
        
        /* Adding RTL elements for Arabic text */
        .rtl {
            direction: rtl;
            text-align: right;
            unicode-bidi: embed;
        }
        
        /* Signatures */
        .signature-table {
            width: 100%;
            margin-top: 60px;
        }
        .signature-cell {
            width: 45%;
            text-align: center;
            padding-top: 10px;
            border-top: 1px solid #333;
        }
        
        /* Footer */
        .footer {
            margin-top: 50px;
            font-size: 12pt;
            color: #666;
            text-align: center;
        }
        
        /* Set page margin */
        @page {
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">Formulaire d'Inscription</div>
        <div class="sub-title">Année Scolaire {{ $school_year }}</div>
        <div class="date">Date d'inscription: {{ $date }}</div>
    </div>

    <h2>Informations de l'Élève</h2>
    <table class="info-table">
        <tr>
            <td class="label">Nom complet:</td>
            <td class="value rtl">{{ $registration->full_name }}</td>
        </tr>
        <tr>
            <td class="label">Niveau scolaire:</td>
            <td class="value">{{ $grade_applying_for_text }}</td>
        </tr>
        <tr>
            <td class="label">Téléphone de l'élève:</td>
            <td class="value">{{ $registration->student_phone }}</td>
        </tr>
        <tr>
            <td class="label">École précédente:</td>
            <td class="value rtl">{{ $registration->previous_school ?: 'Non spécifié' }}</td>
        </tr>
    </table>

    <h2>Informations du Parent/Tuteur</h2>
    <table class="info-table">
        <tr>
            <td class="label">Nom du parent:</td>
            <td class="value rtl">{{ $registration->parent_name }}</td>
        </tr>
        <tr>
            <td class="label">Profession:</td>
            <td class="value rtl">{{ $registration->parent_occupation }}</td>
        </tr>
        <tr>
            <td class="label">Téléphone du père:</td>
            <td class="value">{{ $registration->father_phone }}</td>
        </tr>
        @if($registration->mother_phone)
        <tr>
            <td class="label">Téléphone de la mère:</td>
            <td class="value">{{ $registration->mother_phone }}</td>
        </tr>
        @endif
    </table>

    <h2>Adresse et Informations Complémentaires</h2>
    <table class="info-table">
        <tr>
            <td class="label">Adresse:</td>
            <td class="value rtl">{{ $registration->address }}</td>
        </tr>
        <tr>
            <td class="label">Situation familiale:</td>
            <td class="value">{{ $family_status_text }}</td>
        </tr>
        @if($registration->family_status == 'orphaned' && isset($registration->orphan_date))
        <tr>
            <td class="label">Date de décès du père:</td>
            <td class="value">{{ $registration->orphan_date }}</td>
        </tr>
        @endif
        @if($registration->additional_notes)
        <tr>
            <td class="label">Notes complémentaires:</td>
            <td class="value rtl">{{ $registration->additional_notes }}</td>
        </tr>
        @endif
    </table>

    <table class="signature-table">
        <tr>
            <td class="signature-cell">Signature du Parent/Tuteur</td>
            <td></td>
            <td class="signature-cell">Signature de l'Administration</td>
        </tr>
    </table>

    <div class="footer">
        <p>N° d'inscription: {{ $registration->id }} | Ce document a été généré le {{ $date }}</p>
    </div>
</body>
</html>