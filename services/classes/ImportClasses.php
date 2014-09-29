<?php
    ini_set("session.cache_expire", 3600);
    ini_set("session.gc_maxlifetime", 3600);

    include_once($_SERVER['DOCUMENT_ROOT']."/ange/classes/Ange.class.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/ange/classes/AngeData.class.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/ange/classes/AngeJson.class.php");
    include_once($_SERVER['DOCUMENT_ROOT']."/ange/classes/AngeUtil.class.php");

?>