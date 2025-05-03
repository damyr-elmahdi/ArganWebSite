<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>استمارة التسجيل</title>
    <style>
        @font-face {
            font-family: 'Amiri';
            src: url('{{ public_path('fonts/Amiri-Regular.ttf') }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Amiri';
            src: url('{{ public_path('fonts/Amiri-Bold.ttf') }}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        * {
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 20px;
            font-size: 14pt;
            color: #333;
            direction: rtl;
            text-align: right;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .rtl {
            direction: rtl;
            text-align: right;
        }
        h1 {
            font-size: 24pt;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 20px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        h2 {
            font-size: 18pt;
            margin-top: 30px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header-title {
            font-size: 28pt;
            font-weight: bold;
            margin-bottom: 10px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .sub-title {
            font-size: 18pt;
            margin-bottom: 10px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .date {
            font-size: 14pt;
            margin-bottom: 20px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .registration-id {
            font-size: 12pt;
            color: #555;
            margin-top: 10px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        
        /* Content layout */
        .section {
            margin-bottom: 20px;
        }
        .info-row {
            clear: both;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .info-label {
            float: right;
            font-weight: bold;
            width: 30%;
            padding-left: 10px;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .info-value {
            float: right;
            width: 70%;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        
        /* Additional styling */
        .divider {
            border-top: 1px solid #eee;
            margin: 20px 0;
            clear: both;
        }
        .footer {
            margin-top: 50px;
            font-size: 12pt;
            color: #666;
            text-align: center;
            clear: both;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
        .signature-section {
            margin-top: 60px;
            overflow: hidden;
            clear: both;
        }
        .signature-box {
            float: right;
            border-top: 1px solid #333;
            width: 45%;
            padding-top: 10px;
            text-align: center;
            margin-right: 2.5%;
            margin-left: 2.5%;
            font-family: 'Amiri', 'DejaVu Sans', Arial, sans-serif;
        }
    </style>
</head>
<body>
    <div class="header rtl">
        <div class="header-title">استمارة التسجيل</div>
        <div class="sub-title">السنة الدراسية {{ $school_year }}</div>
        <div class="date">تاريخ التسجيل: {{ $date }}</div>
    </div>

    <h2 class="rtl">معلومات الطالب</h2>
    <div class="section rtl">
        <div class="info-row">
            <div class="info-label">الإسم الكامل:</div>
            <div class="info-value">{{ $registration->full_name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">المستوى الدراسي:</div>
            <div class="info-value">{{ $grade_applying_for_text }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم هاتف التلميذ:</div>
            <div class="info-value">{{ $registration->student_phone }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">المدرسة السابقة:</div>
            <div class="info-value">{{ $registration->previous_school ?: 'غير محدد' }}</div>
        </div>
    </div>

    <div style="clear: both;"></div>

    <h2 class="rtl">معلومات ولي الأمر</h2>
    <div class="section rtl">
        <div class="info-row">
            <div class="info-label">اسم ولي الأمر:</div>
            <div class="info-value">{{ $registration->parent_name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">المهنة:</div>
            <div class="info-value">{{ $registration->parent_occupation }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم هاتف الأب:</div>
            <div class="info-value">{{ $registration->father_phone }}</div>
        </div>
        @if($registration->mother_phone)
        <div class="info-row">
            <div class="info-label">رقم هاتف الأم:</div>
            <div class="info-value">{{ $registration->mother_phone }}</div>
        </div>
        @endif
    </div>

    <div style="clear: both;"></div>

    <h2 class="rtl">العنوان والمعلومات الإضافية</h2>
    <div class="section rtl">
        <div class="info-row">
            <div class="info-label">عنوان السكن:</div>
            <div class="info-value">{{ $registration->address }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">الحالة العائلية:</div>
            <div class="info-value">{{ $family_status_text }}</div>
        </div>
        @if($registration->family_status == 'orphaned' && isset($registration->orphan_date))
        <div class="info-row">
            <div class="info-label">تاريخ وفاة الأب:</div>
            <div class="info-value">{{ $registration->orphan_date }}</div>
        </div>
        @endif
        @if($registration->additional_notes)
        <div class="info-row">
            <div class="info-label">ملاحظات إضافية:</div>
            <div class="info-value">{{ $registration->additional_notes }}</div>
        </div>
        @endif
    </div>

    <div style="clear: both;"></div>

    <div class="divider"></div>

    <div class="signature-section rtl">
        <div class="signature-box">
            <div>توقيع ولي الأمر</div>
        </div>
        <div class="signature-box">
            <div>توقيع الإدارة</div>
        </div>
    </div>

    <div style="clear: both;"></div>

    <div class="footer rtl">
        <p>رقم التسجيل: {{ $registration->id }} | تم إنشاء هذا التسجيل بتاريخ {{ $date }}</p>
    </div>
</body>
</html>