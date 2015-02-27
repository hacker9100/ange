<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");
    Header("Content-type: text/html;Charset:UTF-8");

    @session_start();

    @extract($_GET);
    @extract($_POST);
    @extract($_SERVER);

    date_default_timezone_set('Asia/Seoul');

	include_once("D:/xampp/htdocs/ange/migration/classes/ImportClasses.php");

    MtUtil::_c("### [START]");

    $_a = new MtMssqlData();
    $_t = new MtMysqlData();

    if ($_a->connect_db == "") {
        MtUtil::_c("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    // 속풀이방
    $sql = "SELECT B.NO AS BOARD_NO, B.MIG_NO, R.NO AS REPLY_NO
            FROM MIG_COM_REPLY R
            LEFT OUTER JOIN MIG_COM_BOARD B ON B.MIG_NO = R.MIG_REPLY_NO
            WHERE R.MIG_COMM_NO = '40'
            ";

//    $result = $_t->sql_query($sql,true);
    for ($i=0; $row=$_t->sql_fetch_array($result); $i++) {
//        MtUtil::_c($i."> [c_idx] ".$row['c_idx'].", [c_id] ".$row['c_id'].", [c_name] ".$row['c_name'].", [comment] ".$row['comment'].", [c_date] ".$row['c_date'].", [comm_idx] ".$row['comm_idx'].", [comm_tb] ".$row['comm_tb'].", [comm_cate] ".$row['comm_cate'].", [c_rep_idx] ".$row['c_rep_idx'].", [c_step] ".$row['c_step'].", [c_group_idx] ".$row['c_group_idx']);

        $sql = "UPDATE MIG_COM_REPLY
                SET
                    TARGET_NO = '".$row['BOARD_NO']."'
                WHERE
                    NO = '".$row['REPLY_NO']."'
                ";

        $_t->sql_query($sql);

        if($_t->mysql_errno > 0) {
            MtUtil::_c($i."> [ERROR] ".$_t->mysql_error);
        } else {
//            MtUtil::_c($i."> [SUCCESS] ");
        }
    }

    MtUtil::_c("### [END]");
?>