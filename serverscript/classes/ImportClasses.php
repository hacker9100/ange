<?php
    ini_set("session.cache_expire", 3600);
    ini_set("session.gc_maxlifetime", 3600);

    include_once($_SERVER['DOCUMENT_ROOT'].'/serverscript/libs/PHPMailer/class.phpmailer.php');
    include_once($_SERVER['DOCUMENT_ROOT'].'/serverscript/libs/PHPMailer/class.smtp.php');
    include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/Mt.class.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/MtData.class.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/MtJson.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/MtUtil.class.php");
?>