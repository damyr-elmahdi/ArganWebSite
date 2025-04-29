<!-- resources/views/emails/contact-form.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form Submission</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .header {
            background-color: #FF7A00;
            color: white;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 5px 5px;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Submission</h2>
    </div>

    <div class="content">
        <p><span class="label">Name:</span> {{ $name }}</p>
        <p><span class="label">Email:</span> {{ $email }}</p>
        <p><span class="label">Subject:</span> {{ $subject }}</p>
        <p><span class="label">Message:</span></p>
        <p>{{ $messageContent }}</p>
    </div>
</body>
</html>