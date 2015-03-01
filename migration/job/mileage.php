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

    $prefix = "";

    if ($_a->connect_db == "") {
        MtUtil::_c("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    $sql = "SELECT p_idx, p_category, p_kind, p_tb, p_dist, p_subject, p_content, p_point, p_numb, p_times, p_conf
            FROM point_admin_list;
            ";

    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        MtUtil::_c($i."> [p_idx] ".$row['p_idx'].", [p_category] ".$row['p_category'].", [p_kind] ".$row['p_kind'].", [p_tb] ".$row['p_tb'].", [p_dist] ".$row['p_dist'].", [p_subject] ".$row['p_subject'].", [p_content] ".$row['p_content'].", [p_point] ".$row['p_point'].", [p_numb] ".$row['p_numb'].", [p_times] ".$row['p_times'].", [p_conf] ".$row['p_conf']);

        $_t->sql_beginTransaction();
        $sql = "UPDATE ".$prefix."ANGE_MILEAGE
                SET
                    MILEAGE_GB = '".$row['p_kind']."'
                WHERE
                    NO = ".$row['p_idx']."
                ";
/*
        $sql = "INSERT INTO ".$prefix."ANGE_MILEAGE
                (
                    NO,
                    MILEAGE_GB,
                    POINT,
                    SUBJECT,
                    REASON,
                    COMM_GB,
                    LIMIT_CNT,
                    LIMIT_DAY,
                    POINT_ST,
                    MIG_CATEGORY,
                    MIG_DIST
                ) VALUES (
                     ".$row['p_idx']."
                    , '".$row['p_kind']."'
                    , '".$row['p_point']."'
                    , '".$row['p_subject']."'
                    , '".$row['p_content']."'
                    , '".$row['p_dist']."'
                    , '".$row['p_numb']."'
                    , '".$row['p_times']."'
                    , '".$row['p_conf']."'
                    , '".$row['p_category']."'
                    , '".$row['p_dist']."'
                )";
*/

        $_t->sql_query($sql);
        $no = $_t->mysql_insert_id;

        if($_t->mysql_errno > 0) {
            MtUtil::_c($i."> [ERROR] ".$_d->mysql_error);
            $_t->sql_rollback();
        } else {
            MtUtil::_c($i."> [SUCCESS] ");
            $_t->sql_commit();
        }
    }

    MtUtil::_c("### [END]");
?>