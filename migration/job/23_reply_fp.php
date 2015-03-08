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

    // 재테크 상담
    $sql = "SELECT c_idx, c_id, c_name, comment, comm_idx, comm_tb, comm_cate, c_rep_idx, c_mode, c_step, c_group_idx,
                      CASE WHEN c_date IS NULL THEN NULL WHEN LEN(c_date) < 21 THEN c_date ELSE convert(varchar(19), convert(datetime,  left(c_date,charindex(' ',c_date,1)-1)+ ' '+ right(c_date,charindex(' ',reverse(c_date),1)-1)+ case when charindex('오전',c_date,1) > 0 then 'AM' else 'PM' end), 120) END AS c_date
            FROM dbo.comm_comment
            WHERE c_idx between 6529002 and 6510002
            AND comm_tb = 'living_fp'
            ";

//    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
//        MtUtil::_c($i."> [c_idx] ".$row['c_idx'].", [c_id] ".$row['c_id'].", [c_name] ".$row['c_name'].", [comment] ".$row['comment'].", [c_date] ".$row['c_date'].", [comm_idx] ".$row['comm_idx'].", [comm_tb] ".$row['comm_tb'].", [comm_cate] ".$row['comm_cate'].", [c_rep_idx] ".$row['c_rep_idx'].", [c_step] ".$row['c_step'].", [c_group_idx] ".$row['c_group_idx']);

        $sql = "INSERT INTO COM_REPLY
                (
                    NO,
                    PARENT_NO,
                    LEVEL,
                    COMMENT,
                    REG_UID,
                    NICK_NM,
                    REG_DT,
                    LIKE_CNT,
                    TARGET_NO,
                    TARGET_GB,
                    BLIND_FL,
                    MODE_GB,
                    MIG_NO,
                    MIG_REPLY_NO,
                    MIG_COMM_NO,
                    MIG_TBL
                ) VALUES (
                    ".$row['c_idx'].",
                    ".$row['c_rep_idx'].",
                    '".$row['c_step']."',
                    '".str_replace("'", "\\'",$row['comment'])."',
                    '".$row['c_id']."',
                    '".$row['c_name']."',
                    '".$row['c_date']."',
                    '0',
                    '".(580000+$row['comm_idx'])."',
                    'CLINIC',
                    'N',
                    '".$row['c_mode']."',
                    '".$row['c_idx']."',
                    '".$row['comm_idx']."',
                    '10',
                    'living_fp'
                )";

        $_t->sql_query($sql);

        if($_t->mysql_errno > 0) {
            MtUtil::_c($i."> [ERROR] ".$_d->mysql_error);
        } else {
//            MtUtil::_c($i."> [SUCCESS] ");
        }
    }

    MtUtil::_c("### [END]");
?>