<?php

// 로컬 DB 서버
//define("__ANGE_ADD__" , "localhost");
//define("__ANGE_USR__" , "ange");
//define("__ANGE_PWD__" , "ange");
//define("__ANGE_DBF__" , "ange");

// MAIL 서버(SMTP)
//define("__SMTP_HOST__" , "smtp.gmail.com");
//define("__SMTP_PORT__" , 465);
//define("__SMTP_USR__" , "hacker9100@gmail.com");
//define("__SMTP_PWD__" , "rlatjdghks9100");

// 앙쥬 DB 서버(개발)
define("__ANGE_ADD__" , "14.63.219.171");
define("__ANGE_USR__" , "admin_default");
define("__ANGE_PWD__" , "XT1GuAa3qz");
define("__ANGE_DBF__" , "admin_default");
//define("__ANGE_ADD__" , "14.63.219.171");
//define("__ANGE_USR__" , "ange");
//define("__ANGE_PWD__" , "ange#123");
//define("__ANGE_DBF__" , "ange");

// 광고센터 DB 서버(개발)
define("__AD_ANGE_ADD__" , "14.63.219.171");
define("__AD_ANGE_USR__" , "ange");
define("__AD_ANGE_PWD__" , "ange#123");
define("__AD_ANGE_DBF__" , "ange");

// MAIL 서버(SMTP)
define("__SMTP_HOST__" , "mail.ange.co.kr");
define("__SMTP_PORT__" , 25);
define("__SMTP_USR__" , "angeweb@ange.co.kr");
define("__SMTP_PWD__" , "mailange33302");

define("DEBUG", true);
define("SESSION_TIMEOUT", 1800);
// define("BASE_URL", "http://14.63.219.171");
define("BASE_URL", "http://ange.marveltree.com");

class Mt {

    var $mysql_host     = __ANGE_ADD__;
    var $mysql_user     = __ANGE_USR__;
    var $mysql_password = __ANGE_PWD__;
    var $mysql_db       = __ANGE_DBF__;

    var $ad_mysql_host     = __AD_ANGE_ADD__;
    var $ad_mysql_user     = __AD_ANGE_USR__;
    var $ad_mysql_password = __AD_ANGE_PWD__;
    var $ad_mysql_db       = __AD_ANGE_DBF__;

    public function __get($propName) {

		return $this->$propName;

	}
}
?>