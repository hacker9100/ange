<?php

// AS-IS DB 서버(MS-SQL)
define("__AS_IS_ADD__" , "210.116.103.14");
define("__AS_IS_USR__" , "newange");
define("__AS_IS_PWD__" , "dbrdkvhxjf4650");
define("__AS_IS_DBF__" , "newange");

// TO-BE DB 서버(MY-SQL)
define("__TO_BE_ADD__" , "14.63.219.171");
define("__TO_BE_USR__" , "ange");
define("__TO_BE_PWD__" , "ange#123");
define("__TO_BE_DBF__" , "ange");

//define("__TO_BE_ADD__" , "14.63.219.171");
//define("__TO_BE_USR__" , "admin_default");
//define("__TO_BE_PWD__" , "XT1GuAa3qz");
//define("__TO_BE_DBF__" , "admin_default");

//define("__TO_BE_ADD__" , "14.49.37.254");
//define("__TO_BE_USR__" , "admin_ange");
//define("__TO_BE_PWD__" , "VQfHMPtExV");
//define("__TO_BE_DBF__" , "admin_ange");

define("DEBUG", true);
define("SESSION_TIMEOUT", 1800);
// define("BASE_URL", "http://14.63.219.171");
define("BASE_URL", "http://localhost");

class Mt {

    var $sqlsrv_host     = __AS_IS_ADD__;
    var $sqlsrv_user     = __AS_IS_USR__;
    var $sqlsrv_password = __AS_IS_PWD__;
    var $sqlsrv_db       = __AS_IS_DBF__;

    var $mysql_host     = __TO_BE_ADD__;
    var $mysql_user     = __TO_BE_USR__;
    var $mysql_password = __TO_BE_PWD__;
    var $mysql_db       = __TO_BE_DBF__;

    public function __get($propName) {
		return $this->$propName;
	}
}
?>