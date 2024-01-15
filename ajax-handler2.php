<?php


$data = json_decode(file_get_contents('php://input'), true);


$data["errors"] = implode("-",$data["errors"]);

$email_data = <<<EOT
name: {$data["name"]}
tea: {$data["tea"]}
coffee: {$data["coffee"]}
EOT;

$res = mail($mail, "Menu Order", $email_data);
echo json_encode(array('success' => $res));