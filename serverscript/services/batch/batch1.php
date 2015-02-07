<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");

    @session_start();

    @extract($_SERVER);

    date_default_timezone_set('Asia/Seoul');

	include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");

    MtUtil::_b("### [START] batch1");

    $_d = new MtJson(null);

    if ($_d->connect_db == "") {
        $_d->failEnd("DB 연결 실패. 관리자에게 문의하세요.");
    }

    $err = 0;
    $msg = "";

    $_d->sql_beginTransaction();

    $sql = "INSERT INTO CMS_TASK_DEL
            (
                SUBJECT
            ) VALUES (
                'TEST'
            )
            ";

    $_d->sql_query($sql);

    if ($_d->mysql_errno > 0) {
        $err++;
        $msg = $_d->mysql_error;
    }

    if ($err > 0) {
        $_d->sql_rollback();
//        $_d->failEnd("수정실패입니다:".$msg);
    } else {
//        $sql = "INSERT INTO CMS_HISTORY
//        (
//            WORK_ID
//            ,WORK_GB
//            ,WORK_DT
//            ,WORKER_ID
//            ,OBJECT_ID
//            ,OBJECT_GB
//            ,ACTION_GB
//            ,IP
//            ,ACTION_PLACE
//            ,ETC
//        ) VALUES (
//            '".$_key."'
//            ,'UPDATE'
//            ,SYSDATE()
//            ,'".$_SESSION['uid']."'
//            ,'".$_key."'
//            ,'TASK'
//            ,'UPDATE'
//            ,'".$ip."'
//            ,'/task'
//            ,'".$_model[SUBJECT]."'
//        )";
//
//        $_d->sql_query($sql);

        $_d->sql_commit();
//        $_d->succEnd($no);
    }

    MtUtil::_b("### [END] batch1");

?>