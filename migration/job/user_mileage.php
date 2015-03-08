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

//    $prefix = "MIG_";
    $prefix = "";
    $year = "LAST";
    $table = "point_list";

    if ($_a->connect_db == "") {
        MtUtil::_c("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    $sql = "select
                idx, dataID, order_seq, p_item, p_kind, p_class, p_point, p_reason, p_TB, p_idx,
                CASE WHEN p_date IS NULL THEN NULL
                    WHEN LEN(p_date) < 21 THEN p_date
                    WHEN LEN(p_date) = 23 THEN p_date
                    WHEN LEN(p_date) = 25 THEN convert(varchar(19), convert(datetime,  left(p_date,charindex(' ',p_date,1)-1)+ ' '+ left(right(p_date,charindex(' ',reverse(p_date),1)-1),charindex(' ',p_date,1)-4)+ case when charindex('오전',p_date,1) > 0 then 'AM' else 'PM' end), 120)
                    ELSE convert(varchar(19), convert(datetime,  left(p_date,charindex(' ',p_date,1)-1)+ ' '+ right(p_date,charindex(' ',reverse(p_date),1)-1)+ case when charindex('오전',p_date,1) > 0 then 'AM' else 'PM' end), 120) END AS p_date
            from ".$table."
            order by idx
            ";

    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;
//        $user_info = " [[MILEAGE_INFO]] >> [idx] ".$row['idx'].", [dataID] ".$row['dataID'].", [order_seq] ".$row['order_seq'].", [p_item] ".$row['p_item'].", [p_kind] ".$row['p_kind'].", [p_date] ".$row['p_date'].", [p_class] ".$row['p_class'].", [p_point] ".$row['p_point'].", [p_reason] ".$row['p_reason'].", [p_TB] ".$row['p_TB'].", [p_idx] ".$row['p_idx'];
//
//        MtUtil::_c($i.$user_info);

//        $_t->sql_beginTransaction();

        $sql = "INSERT INTO ".$prefix."ANGE_USER_MILEAGE"."_".$year."
                (
                    USER_ID, EARN_DT, MILEAGE_NO, EARN_GB,
                    PLACE_GB, POINT, REASON, MIG_NO, MIG_TABLE
                ) VALUES (
                    '".$row['dataID']."', '".$row['p_date']."', '".$row['p_item']."', '".$row['p_kind']."'
                    , '".$row['p_class']."', '".$row['p_point']."', '".$row['p_reason']."', '".$row['idx']."', '".$table."'
                )";

        $_t->sql_query($sql);

        if($_t->mysql_errno > 0) {
            MtUtil::_c($i."> [ERROR] ".$_t->mysql_error);
//            $_t->sql_rollback();
        } else {
            MtUtil::_c($i."> [SUCCESS] ");
//            $_t->sql_commit();
        }
    }

    MtUtil::_d("### [END]");
?>