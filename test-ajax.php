<?php
header('Content-type: application/json');
$result = array("result"=>$_POST['data']) ;

//send email 

echo json_encode($result);

?>