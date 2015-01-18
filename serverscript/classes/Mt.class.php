<?php

// 로컬 서버
define("__ANGE_ADD__" , "localhost");
define("__ANGE_USR__" , "ange");
define("__ANGE_PWD__" , "ange");
define("__ANGE_DBF__" , "ange");


// 개발 서버
//define("__ANGE_ADD__" , "14.63.219.171");
//define("__ANGE_USR__" , "admin_default");
//define("__ANGE_PWD__" , "XT1GuAa3qz");
//define("__ANGE_DBF__" , "admin_default");

define("DEBUG", true);
define("SESSION_TIMEOUT", 1800);
// define("BASE_URL", "http://14.63.219.171");
define("BASE_URL", "http://localhost");

class Mt {

    var $mysql_host     = __ANGE_ADD__;

    var $mysql_user     = __ANGE_USR__;

    var $mysql_password = __ANGE_PWD__;

    var $mysql_db       = __ANGE_DBF__;

    public function __get($propName) {

		return $this->$propName;

	}
}
?>