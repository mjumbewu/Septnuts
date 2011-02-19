<?php

MICS::$MysqlHost = 'localhost';
MICS::$MysqlUsername = 'MICS';
MICS::$MysqlPassword = '4edRqudN6VaGWehe';

MICS::$SiteName = 'septa.mics.me'; 

MICS::$CoreFeatures[] = 'DebugLog';
MICS::$ConfPath = dirname($_SERVER['DOCUMENT_ROOT']) . '/include/conf';

if($_SERVER['HTTP_HOST'] == 'septa.mics.me') // set to enable dev site
{
	MICS::$DebugMode = true;
	MICS::$ClassPath = '../classes';
	//MICS::$TemplatePath = '../templates-dev';
	MICS::$ClassDumping = !empty($_GET['_classDumping']);
}
