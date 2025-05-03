<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>استمارة التسجيل</title>
    <style>
        body {
            font-family: xbriyaz, Arial, sans-serif;
            font-size: 14pt;
            line-height: 1.5;
            color: #333;
            direction: rtl;
            text-align: right;
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
        
        /* Set page margin - you can also use CSS @page */
        @page {
            margin: 2cm;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-title">استمارة التسجيل</div>
        <div class="sub-title">السنة الدراسية {{ $school_year }}</div>
        <div class="date">تاريخ التسجيل: {{ $date }}</div>
    </div>

    <h2>معلومات الطالب</h2>
    <table class="info-table">
        <tr>
            <td class="label">الإسم الكامل:</td>
            <td class="value">{{ $registration->full_name }}</td>
        </tr>
        <tr>
            <td class="label">المستوى الدراسي:</td>
            <td class="value">{{ $grade_applying_for_text }}</td>
        </tr>
        <tr>
            <td class="label">رقم هاتف التلميذ:</td>
            <td class="value">{{ $registration->student_phone }}</td>
        </tr>
        <tr>
            <td class="label">المدرسة السابقة:</td>
            <td class="value">{{ $registration->previous_school ?: 'غير محدد' }}</td>
        </tr>
    </table>

    <h2>معلومات ولي الأمر</h2>
    <table class="info-table">
        <tr>
            <td class="label">اسم ولي الأمر:</td>
            <td class="value">{{ $registration->parent_name }}</td>
        </tr>
        <tr>
            <td class="label">المهنة:</td>
            <td class="value">{{ $registration->parent_occupation }}</td>
        </tr>
        <tr>
            <td class="label">رقم هاتف الأب:</td>
            <td class="value">{{ $registration->father_phone }}</td>
        </tr>
        @if($registration->mother_phone)
        <tr>
            <td class="label">رقم هاتف الأم:</td>
            <td class="value">{{ $registration->mother_phone }}</td>
        </tr>
        @endif
    </table>

    <h2>العنوان والمعلومات الإضافية</h2>
    <table class="info-table">
        <tr>
            <td class="label">عنوان السكن:</td>
            <td class="value">{{ $registration->address }}</td>
        </tr>
        <tr>
            <td class="label">الحالة العائلية:</td>
            <td class="value">{{ $family_status_text }}</td>
        </tr>
        @if($registration->family_status == 'orphaned' && isset($registration->orphan_date))
        <tr>
            <td class="label">تاريخ وفاة الأب:</td>
            <td class="value">{{ $registration->orphan_date }}</td>
        </tr>
        @endif
        @if($registration->additional_notes)
        <tr>
            <td class="label">ملاحظات إضافية:</td>
            <td class="value">{{ $registration->additional_notes }}</td>
        </tr>
        @endif
    </table>

    <table class="signature-table">
        <tr>
            <td class="signature-cell">توقيع ولي الأمر</td>
            <td></td>
            <td class="signature-cell">توقيع الإدارة</td>
        </tr>
    </table>

    <div class="footer">
        <p>رقم التسجيل: {{ $registration->id }} | تم إنشاء هذا التسجيل بتاريخ {{ $date }}</p>
    </div>
</body>
</html>