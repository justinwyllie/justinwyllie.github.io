<?php


$data = json_decode(file_get_contents('php://input'), true);

if ($data['direct'] == "bc")
{
    $mail = "**************";
}
else
{
    $mail = "**************";
}

$data["errors"] = implode("-",$data["errors"]);

$email_data = <<<EOT
score: {$data["score"]}
slug: {$data["slug"]}
name: {$data["name"]}
email: {$data["email"]}
errors: {$data["errors"]}
EOT;

$res = mail($mail, "Result of Online Exercise", $email_data);
echo json_encode(array('success' => $res));




?>