<?php

// initialize and configure cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://www3.septa.org/transitview/bus_route_data/'.$_REQUEST['route']);
curl_setopt($ch, CURLOPT_REFERER, 'http://www3.septa.org/transitview/'.$_REQUEST['route']);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// execute request
$response = curl_exec($ch);
curl_close($ch);

// fix invalid JSON output
$response = preg_replace('/,(}|])/', '$1', $response);

// print JSON data
header('Content-Type: application/json');
print $response;