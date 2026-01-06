<?php
// send_mail.php
// PHPMailer-based mail sender for feedback form
// Requires: composer require phpmailer/phpmailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

// Configuration (preferred: set these as environment variables on your host)
$TO_EMAIL    = getenv('MAIL_TO') ?: 'service@glashausde.com';
$SMTP_HOST   = getenv('SMTP_HOST') ?: 'smtp.zoho.eu';
$SMTP_USER   = getenv('SMTP_USER') ?: 'service@glashausde.com';
$SMTP_PASS   = getenv('SMTP_PASS') ?: ''; // set this on your host
$SMTP_PORT   = getenv('SMTP_PORT') ?: 587;
$SMTP_SECURE = getenv('SMTP_SECURE') ?: 'tls'; // 'tls' or 'ssl'

// Simple JSON responder
function json_response($success, $message = '', $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(false, 'Method not allowed', 405);
}

// Read input (support both form-data and raw JSON)
$name = '';
$email = '';
$message = '';

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== false) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (is_array($input)) {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $message = trim($input['message'] ?? '');
    }
} else {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
}

if ($name === '' || $email === '' || $message === '') {
    json_response(false, 'Пожалуйста, заполните все поля', 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, 'Неверный email', 422);
}

// Protect against header injection
foreach ([$name, $email] as $v) {
    if (preg_match("/[\r\n]/", $v)) {
        json_response(false, 'Invalid input', 400);
    }
}

// Optional: check reCAPTCHA here if you enabled it

$subject = "Feedback с сайта GlasHaus Service";
$bodyHtml = '<p><strong>Имя:</strong> ' . htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '<p><strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</p>'
    . '<p><strong>Сообщение:</strong><br>' . nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')) . '</p>';

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USER;
    $mail->Password = $SMTP_PASS;
    $mail->SMTPSecure = $SMTP_SECURE;
    $mail->Port = (int)$SMTP_PORT;

    // From should be from your domain (use the SMTP_USER or a no-reply@ address)
    $mail->setFrom($SMTP_USER, 'GlasHaus Service (website)');
    $mail->addAddress($TO_EMAIL);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $bodyHtml;
    $mail->AltBody = "Имя: $name\nEmail: $email\n\n$message";

    $mail->send();
    json_response(true, 'Сообщение отправлено');
} catch (Exception $e) {
    // Log actual error on the server (do not expose to users in production)
    error_log('Mail error: ' . $mail->ErrorInfo);
    json_response(false, 'Ошибка при отправке сообщения', 500);
}
