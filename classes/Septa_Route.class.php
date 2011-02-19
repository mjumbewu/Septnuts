<?php

class Septa_Route extends ActiveRecord
{
	// support subclassing
	static public $rootClass = __CLASS__;
	static public $defaultClass = __CLASS__;
	static public $subClasses = array(__CLASS__);


	// ActiveRecord configuration
	static public $tableName = 'routes';
	static public $singularNoun = 'route';
	static public $pluralNoun = 'routes';
	
	static public $fields = array(
		'ContextClass' => null
		,'ContextID' => null
		,'RouteID' => array(
			'type' => 'integer'
			,'unsigned' => true
		)
		,'RouteShortName'
		,'RouteLongName'
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
