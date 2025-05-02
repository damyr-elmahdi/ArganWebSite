<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استمارة تسجيل</title>
    <style>
        body {
            font-family: "Helvetica", "Arial", sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            direction: rtl;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #f97316;
            padding-bottom: 10px;
        }
        .logo {
            max-width: 120px;
            margin-bottom: 15px;
        }
        h1 {
            font-size: 24px;
            color: #f97316;
            margin: 0;
        }
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-top: 5px;
        }
        .registration-date {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 15px;
            color: #f97316;
        }
        .info-row {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            width: 30%;
            vertical-align: top;
        }
        .value {
            display: inline-block;
            width: 65%;
        }
        .page-break {
            page-break-after: always;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 12px;
            color: #666;
            padding: 10px;
            border-top: 1px solid #ddd;
        }
        .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
        }
        .signature-box {
            width: 45%;
            border-top: 1px solid #000;
            padding-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>استمارة تسجيل طالب</h1>
        <p class="subtitle">العام الدراسي 2025-2026</p>
        <p class="registration-date">تاريخ التسجيل: {{ $today }}</p>
    </div>

    <div class="section">
        <h2 class="section-title">معلومات الطالب</h2>
        <div class="info-row">
            <span class="label">الاسم الكامل:</span>
            <span class="value">{{ $registration->full_name }}</span>
        </div>
        <div class="info-row">
            <span class="label">تاريخ الميلاد:</span>
            <span class="value">{{ $registration->date_of_birth ? $registration->date_of_birth->format('d/m/Y') : 'غير محدد' }}</span>
        </div>
        <div class="info-row">
            <span class="label">رقم هاتف الطالب:</span>
            <span class="value">{{ $registration->student_phone }}</span>
        </div>
        <div class="info-row">
            <span class="label">المدرسة السابقة:</span>
            <span class="value">{{ $registration->previous_school ?: 'غير محدد' }}</span>
        </div>
        <div class="info-row">
            <span class="label">عنوان السكن:</span>
            <span class="value">{{ $registration->address }}</span>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">معلومات ولي الأمر</h2>
        <div class="info-row">
            <span class="label">اسم ولي الأمر:</span>
            <span class="value">{{ $registration->parent_name }}</span>
        </div>
        <div class="info-row">
            <span class="label">المهنة:</span>
            <span class="value">{{ $registration->parent_occupation }}</span>
        </div>
        <div class="info-row">
            <span class="label">رقم هاتف الأب:</span>
            <span class="value">{{ $registration->father_phone }}</span>
        </div>
        <div class="info-row">
            <span class="label">رقم هاتف الأم:</span>
            <span class="value">{{ $registration->mother_phone ?: 'غير متوفر' }}</span>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">الحالة العائلية</h2>
        <div class="info-row">
            <span class="label">الحالة العائلية:</span>
            <span class="value">{{ $familyStatusText }}</span>
        </div>
        @if($registration->family_status == 'orphaned' && $registration->orphan_date)
        <div class="info-row">
            <span class="label">تاريخ وفاة الأب:</span>
            <span class="value">{{ $registration->orphan_date->format('d/m/Y') }}</span>
        </div>
        @endif
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <p>توقيع ولي الأمر</p>
        </div>
        <div class="signature-box">
            <p>توقيع إدارة المدرسة</p>
        </div>
    </div>

    <div class="footer">
        رقم التسجيل: {{ $registration->id }} | تم إنشاء هذا المستند بتاريخ {{ $today }}
    </div>
</body>
</html>