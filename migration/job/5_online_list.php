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

    $sql = "SELECT kind, idx, title, content, from_date, to_date, text1, text2, text3
            FROM dbo.ange_online_list
            where idx between 112 and 119
            ";

//    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;

//        MtUtil::_c($i."> [idx] ".$row['idx'].", [cate] ".$row['cate'].", [id] ".$row['id'].", [name] ".$row['name'].", [head] ".$row['head'].", [subject] ".$row['subject'].", [content] ".$row['content'].", [rep_idx] ".$row['rep_idx'].", [hit] ".$row['hit'].", [recom] ".$row['recom'].", [wdate] ".$row['wdate'].", [notice] ".$row['notice'].", [supp] ".$row['supp'].", [img_ok] ".$row['img_ok']);

        $sql = "INSERT INTO COM_BOARD
                (
                    NO
                    ,COMM_NO
                    ,SUBJECT
                    ,BODY
                    ,BOARD_ST
                    ,BOARD_GB
                    ,SYSTEM_GB
                    ,BOARD_NO
                    ,ETC1
                    ,ETC2
                    ,ETC3
                    ,ETC4
                    ,ETC5
                    ,MIG_NO
                    ,MIG_COMM_NO
                    ,MIG_TBL
                ) VALUES (
                    '".(610000+$row['idx'])."'
                    ,'61'
                    ,'".str_replace("'", "\\'",$row['title'])."'
                    , '".str_replace("'", "\\'",$row['content'])."'
                    , '".$row['kind']."'
                    , 'TALK'
                    , 'ANGE'
                    , ".(105+$i)."
                    , '".$row['from_date']."'
                    , '".$row['to_date']."'
                    , '".$row['text1']."'
                    , '".$row['text2']."'
                    , '".$row['text3']."'
                    , '".$row['idx']."'
                    , 'QUESTION'
                    , 'online_list'
                )";

        $_t->sql_query($sql);
        $no = $_t->mysql_insert_id;

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