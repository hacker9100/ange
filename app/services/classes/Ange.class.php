<?php
define("__ANGE_ADD__" , "localhost");
define("__ANGE_USR__" , "ange");
define("__ANGE_PWD__" , "");
define("__ANGE_DBF__" , "test");

class Ange {

    var $mysql_host     = __ANGE_ADD__;

    var $mysql_user     = __ANGE_USR__;

    var $mysql_password = __ANGE_PWD__;

    var $mysql_db       = __ANGE_DBF__;

    public function __get($propName) {

		return $this->$propName;

	}
}
?>