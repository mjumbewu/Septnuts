<?php

class Septa_RoutesRequestHandler extends RecordsRequestHandler
{
	// RecordRequestHandler configuration
	static public $recordClass = 'Septa_Route';
	static public $accountLevelRead = false;
	static public $accountLevelBrowse = false;
	static public $accountLevelWrite = 'Staff';
	static public $browseOrder = 'IF(RouteShortName REGEXP "[[:digit:]]+", 0, 1), CAST(RouteShortName AS unsigned integer)';
	static public $browseConditions = array('RouteType' => 3);
	
	
	
}

