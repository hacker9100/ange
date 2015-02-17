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

	include_once($_SERVER['DOCUMENT_ROOT']."/migration/classes/ImportClasses.php");

    MtUtil::_d("### [START]");

    $_a = new MtMssqlData();
    $_t = new MtMysqlData();

    if ($_a->connect_db == "") {
        MtUtil::_d("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_d("TO-BE DB 연결 실패.");
    }

    $sql = "SELECT top 500 c_idx, c_id, c_name, comment, c_date, comm_idx, comm_tb, comm_cate, c_rep_idx, c_mode, c_step, c_group_idx 
            FROM dbo.comm_comment
            ";

    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        MtUtil::_d($i."> [c_idx] ".$row['c_idx'].", [c_id] ".$row['c_id'].", [c_name] ".$row['c_name'].", [comment] ".$row['comment'].", [c_date] ".$row['c_date'].", [comm_idx] ".$row['comm_idx'].", [comm_tb] ".$row['comm_tb'].", [comm_cate] ".$row['comm_cate'].", [c_rep_idx] ".$row['c_rep_idx'].", [c_step] ".$row['c_step'].", [c_group_idx] ".$row['c_group_idx']);

        $_t->sql_beginTransaction();

        $sql = "INSERT INTO MIG_COM_REPLY
                (
                    NO,
                    PARENT_NO,
#                    REPLY_NO,
#                    REPLY_GB,
                    LEVEL,
                    COMMENT,
                    REG_UID,
                    NICK_NM,
                    REG_NM,
                    REG_DT,
                    LIKE_CNT,
                    TARGET_NO,
                    TARGET_GB,
                    BLIND_FL
                ) VALUES (
                    ".$row['c_idx'].",
                    ".$row['c_rep_idx'].",
#                    '".$row['c_idx']."',
#                    '".$row['c_idx']."',
                    '".$row['c_step']."',
                    '".str_replace("'", "\\'",$row['comment'])."',
                    '".$row['c_id']."',
                    '".$row['c_name']."',
                    '".$row['c_name']."',
                    '".$row['c_date']."',
                    '0',
                    '".$row['comm_idx']."',
                    'BOARD',
                    'N'
                )";

        $_t->sql_query($sql);
        $no = $_t->mysql_insert_id;

        if($_t->mysql_errno > 0) {
            MtUtil::_d($i."> [ERROR] ".$_d->mysql_error);
            $_t->sql_rollback();
        } else {
            MtUtil::_d($i."> [SUCCESS] ");
            $_t->sql_commit();
        }
    }

    MtUtil::_d("### [END]");
?>