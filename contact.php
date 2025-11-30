<?php
    if (isset($_POST["submit"])) {
        $name = htmlspecialchars($_POST['name']); 
        $email = $_POST['email'];
        $subject = $_POST['subject'];
        $message = $_POST['message'];


        $to = 'tamalhossain908@gmail.com'; 

        $body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email\n\nSubject: $subject\n\nMessage:\n$message";
        $headers = "From: Contact Form <no-reply@yourdomain.com>" . "\r\n";
        $headers .= "Reply-To: $email" . "\r\n";
        $headers .= "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/plain;charset=UTF-8" . "\r\n";
        if(mail($to, $subject, $body, $headers)){
            header("location: thank-you.html");
            exit();
        } else {
            echo "Message could not be sent.";
        }
    }
?>