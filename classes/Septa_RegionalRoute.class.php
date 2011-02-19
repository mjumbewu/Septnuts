<?php

class Septa_RegionalRoute extends ActiveRecord
{
	// support subclassing
	static public $rootClass = __CLASS__;
	static public $defaultClass = __CLASS__;
	static public $subClasses = array(__CLASS__);


	// ActiveRecord configuration
	static public $tableName = 'regional_routes';
	static public $singularNoun = 'regionalroute';
	static public $pluralNoun = 'regionalroutes';
	
	static public $fields = array(
		'ContextClass' => null
		,'ContextID' => null
		,'RouteInitial'
		,'RouteShortName'
		,'RouteLongName'
		,'Agency'
		,'RouteColor'
		,'RouetTextColor'
		,'RouteType' => array(
			'type' => 'integer'
			,'unsigned' => true
		)
		,'RouteURL'
	);
	
	public function validate()
	{
		// call parent
		parent::validate();	
		
		// save results
		return $this->finishValidation();
	}
	
	public function save()
	{
		// call parent
		parent::save();
	}
}
