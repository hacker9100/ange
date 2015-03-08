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

    $sql = "SELECT idx, cate, id, name, subject, req_content, hit, res_content, chk, notice, wdate
            FROM living_fp
            WHERE idx between 3190 and 4000
            ORDER BY idx
            ";

//    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;
//        MtUtil::_c($i."> [idx] ".$row['idx'].", [cate] ".$row['cate'].", [id] ".$row['id'].", [name] ".$row['name'].", [head] ".$row['head'].", [subject] ".$row['subject'].", [content] ".$row['content'].", [rep_idx] ".$row['rep_idx'].", [hit] ".$row['hit'].", [recom] ".$row['recom'].", [wdate] ".$row['wdate'].", [notice] ".$row['notice'].", [supp] ".$row['supp'].", [img_ok] ".$row['img_ok']);

//        $_t->sql_beginTransaction();

        $sql = "INSERT INTO COM_BOARD
                (
                    NO
                    ,PARENT_NO
                    ,COMM_NO
                    ,HEAD
                    ,SUBJECT
                    ,BODY
                    ,BOARD_GB
                    ,BOARD_ST
                    ,SYSTEM_GB
                    ,REG_UID
                    ,NICK_NM
                    ,REG_DT
                    ,NOTICE_FL
                    ,HIT_CNT
                    ,BOARD_NO
                    ,MIG_NO
                    ,MIG_COMM_NO
                    ,MIG_TBL
                ) VALUES (
                    '".(580000+$row['idx'])."'
                    ,'0'
                    ,'25'
                    ,'".$row['cate']."'
                    ,'".str_replace("'", "\\'",$row['subject'])."'
                    , '".str_replace("'", "\\'",$row['req_content'])."'
                    , 'CLINIC'
                    , '".$row['chk']."'
                    , 'ANGE'
                    , '".$row['id']."'
                    , '".$row['name']."'
                    , '".($row['wdate']->format('Y-m-d H:i:s'))."'
                    , '".($row['notice'] == '1' ? 'Y' : 'N')."'
                    , '".$row['hit']."'
                    , ".(2168+$i)."
                    , '".$row['idx']."'
                    , '10'
                    , 'living_fp'
                )";

        $_t->sql_query($sql);

        if($_t->mysql_errno > 0) {
            $err++;
            $msg .= $_t->mysql_error;
        }

        $sql = "INSERT INTO MIG_COM_BOARD
                (
                    NO
                    ,PARENT_NO
                    ,COMM_NO
                    ,HEAD
                    ,SUBJECT
                    ,BODY
                    ,BOARD_GB
                    ,BOARD_ST
                    ,SYSTEM_GB
                    ,REG_UID
                    ,NICK_NM
                    ,REG_DT
                    ,NOTICE_FL
                    ,HIT_CNT
                    ,BOARD_NO
                    ,MIG_NO
                    ,MIG_COMM_NO
                    ,MIG_TBL
                ) VALUES (
                    '".(582000+$row['idx'])."'
                    ,'".(580000+$row['idx'])."'
                    ,'93'
                    ,'".$row['cate']."'
                    ,'"."[RE]".str_replace("'", "\\'",$row['subject'])."'
                    , '".str_replace("'", "\\'",$row['res_content'])."'
                    , 'CLINIC'
                    , '0'
                    , 'ANGE'
                    , 'angefp1'
                    , '서원호'
                    , '".($row['wdate']->format('Y-m-d H:i:s'))."'
                    , 'N'
                    , '0'
                    , $i
                    , '".(2000+$row['idx'])."'
                    , '10'
                    , 'living_fp'
                )";

        $_t->sql_query($sql);

        if($_t->mysql_errno > 0) {
            $err++;
            $msg .= $_t->mysql_error;
        }

        if($err > 0) {
            MtUtil::_c($i."> [ERROR] ".$_t->mysql_error);
//            $_t->sql_rollback();
//            $_t->sql_query("UPDATE MIG_BOARD_INFO SET MIG_ST = '1', MIG_MSG = '".$msg."' WHERE NO = ".$no);
        } else {
            MtUtil::_c($i."> [SUCCESS] ");
//            $_t->sql_commit();
//            $_t->sql_query("UPDATE MIG_BOARD_INFO SET MIG_ST = '2' WHERE NO = ".$no);
        }
    }

    MtUtil::_c("### [END]");
?>