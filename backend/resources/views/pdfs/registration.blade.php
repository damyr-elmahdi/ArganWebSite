<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استمارة التسجيل</title>
    <style>
        /* Reset and base styles */
        * {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            box-sizing: border-box;
        }
        body {
            margin: 0;
            padding: 20px;
            font-size: 12pt;
            color: #333;
            direction: rtl;
            text-align: right;
        }
        h1 {
            font-size: 20pt;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 14pt;
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
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .sub-title {
            font-size: 14pt;
            margin-bottom: 5px;
        }
        .date {
            font-size: 12pt;
            margin-bottom: 20px;
        }
        .registration-id {
            font-size: 10pt;
            color: #555;
            margin-top: 5px;
        }
        
        /* Content layout */
        .section {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            min-width: 150px;
            padding-left: 10px;
        }
        .info-value {
            flex: 1;
        }
        
        /* Additional styling */
        .divider {
            border-top: 1px solid #eee;
            margin: 20px 0;
        }
        .footer {
            margin-top: 50px;
            font-size: 10pt;
            color: #666;
            text-align: center;
        }
        .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            border-top: 1px solid #333;
            width: 200px;
            padding-top: 5px;
            text-align: center;
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
    <div class="section">
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

    <h2>معلومات ولي الأمر</h2>
    <div class="section">
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

    <h2>العنوان والمعلومات الإضافية</h2>
    <div class="section">
        <div class="info-row">
            <div class="info-label">عنوان السكن:</div>
            <div class="info-value">{{ $registration->address }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">الحالة العائلية:</div>
            <div class="info-value">{{ $family_status_text }}</div>
        </div>
        @if($registration->family_status == 'orphaned' && $registration->orphan_date)
        <div class="info-row">
            <div class="info-label">تاريخ وفاة الأب:</div>
            <div class="info-value">{{ $registration->orphan_date->format('Y-m-d') }}</div>
        </div>
        @endif
        @if($registration->additional_notes)
        <div class="info-row">
            <div class="info-label">ملاحظات إضافية:</div>
            <div class="info-value">{{ $registration->additional_notes }}</div>
        </div>
        @endif
    </div>

    <div class="divider"></div>

    <div class="signature-section">
        <div class="signature-box">
            <div>توقيع ولي الأمر</div>
        </div>
        <div class="signature-box">
            <div>توقيع الإدارة</div>
        </div>
    </div>

    <div class="footer">
        <p>رقم التسجيل: {{ $registration->id }} | تم إنشاء هذا التسجيل بتاريخ {{ $date }}</p>
    </div>
</body>
</html>