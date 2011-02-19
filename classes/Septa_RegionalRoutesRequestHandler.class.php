<?php

class Septa_RegionalRoutesRequestHandler extends RecordsRequestHandler
{
	// RecordRequestHandler configuration
	static public $recordClass = 'Septa_RegionalRoute';
	static public $accountLevelRead = false;
	static public $accountLevelBrowse = false;
	static public $accountLevelWrite = 'Staff';
	static public $browseOrder = array('RouteLongName');
	
	
	
}

