<?php
require_once('../libs/PHPMailer/class.phpmailer.php');
require_once('../libs/PHPMailer/class.smtp.php');

function mail_utf8($to, $from_user, $from_email,
                   $subject = '(No subject)', $message = '')
{
    $from_user = "=?UTF-8?B?".base64_encode($from_user)."?=";
    $subject = "=?UTF-8?B?".base64_encode($subject)."?=";

    $headers = "From: $from_user <$from_email>\r\n".
        "MIME-Version: 1.0" . "\r\n" .
        "Content-type: text/html; charset=UTF-8" . "\r\n";

    return mail($to, $subject, $message, $headers);
}

function sendMail($EMAIL, $NAME, $mailto, $SUBJECT, $CONTENT){
    //$EMAIL : 답장받을 메일주소
    //$NAME : 보낸이
    //$mailto : 보낼 메일주소
    //$SUBJECT : 메일 제목
    //$CONTENT : 메일 내용
    $admin_email = $EMAIL;
    $admin_name = $NAME;

    $header = "Return-Path: ".$admin_email."\n";
    $header .= "From: =?EUC-KR?B?".base64_encode($admin_name)."?= <".$admin_email.">\n";
    $header .= "MIME-Version: 1.0\n";
    $header .= "X-Priority: 3\n";
    $header .= "X-MSMail-Priority: Normal\n";
    $header .= "X-Mailer: FormMailer\n";
    $header .= "Content-Transfer-Encoding: base64\n";
    $header .= "Content-Type: text/html;\n \tcharset=euc-kr\n";

    $subject = "=?EUC-KR?B?".base64_encode($SUBJECT)."?=\n";
    $contents = $CONTENT;

    $message = base64_encode($contents);
    flush();
    return mail($mailto, $subject, $message, $header);
}

/*
 * AUTHOR : YOUNGMINJUN
 *
 * $EMAIL : 보내는 사람 메일 주소
 * $NAME : 보내는 사람 이름
 * $SUBJECT : 메일 제목
 * $CONTENT : 메일 내용
 * $MAILTO : 받는 사람 메일 주소
 * $MAILTONAME : 받는 사람 이름
 */
function sendMail2($EMAIL, $NAME, $SUBJECT, $CONTENT, $MAILTO, $MAILTONAME){
    $mail             = new PHPMailer();
    $body             = $CONTENT;

    $mail->IsSMTP(); // telling the class to use SMTP
    $mail->Host       = "www.coolio.so"; // SMTP server
    $mail->SMTPDebug  = 2;                     // enables SMTP debug information (for testing)
    // 1 = errors and messages
    // 2 = messages only
    $mail->CharSet    = "utf-8";
    $mail->SMTPAuth   = true;                  // enable SMTP authentication
    $mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
    $mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
    $mail->Port       = 465;                   // set the SMTP port for the GMAIL server
    $mail->Username   = "hacker9100@gmail.com";             // GMAIL username
    $mail->Password   = "rlatjdghks9100";              // GMAIL password

    $mail->SetFrom($EMAIL, $NAME);

    $mail->AddReplyTo($EMAIL, $NAME);

    $mail->Subject    = $SUBJECT;

    $mail->MsgHTML($body);

    $address = $MAILTO;
    $mail->AddAddress($address, $MAILTONAME);

    if(!$mail->Send()) {
        echo "Mailer Error: " . $mail->ErrorInfo;
    } else {
        echo "Message sent!";
    }
}

$to = "hacker9100@gmail.com";
$from_user = "김성환";
$from_email = "hacker9100@gmail.com";
$subject = "테스트 메일";
$message = "테스트로 보냅니다.";

sendMail2($from_email, $from_user, $subject, $message, $to, $from_user);
//echo sendMail($from_email, $from_user, $to, $subject, $message);

?>