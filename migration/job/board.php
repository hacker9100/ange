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

    $sql = "SELECT top 500 idx, cate, id, name, head, subject, content, rep_idx, hit, recom, wdate, notice, supp, img_ok, mode, bbs_TB, bbs_idx
            FROM dbo.ange_com_board
            WHERE cate = '01'
            ";

    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        MtUtil::_d($i."> [idx] ".$row['idx'].", [cate] ".$row['cate'].", [id] ".$row['id'].", [name] ".$row['name'].", [head] ".$row['head'].", [subject] ".$row['subject'].", [content] ".$row['content'].", [rep_idx] ".$row['rep_idx'].", [hit] ".$row['hit'].", [recom] ".$row['recom'].", [wdate] ".$row['wdate'].", [notice] ".$row['notice'].", [supp] ".$row['supp'].", [img_ok] ".$row['img_ok']);

        $_t->sql_beginTransaction();

        $sql = "INSERT INTO MIG_COM_BOARD
                (
                    NO
                    ,PARENT_NO
                    ,COMM_NO
                    ,HEAD
                    ,SUBJECT
                    ,BODY
                    ,BOARD_GB
                    ,SYSTEM_GB
                    ,REG_UID
                    ,REG_NM
                    ,NICK_NM
                    ,REG_DT
                    ,NOTICE_FL
#                    ,ETC1
#                    ,ETC2
#                    ,ETC3
#                    ,ETC4
#                    ,ETC5
#                    ,PASSWORD
                    ,BOARD_NO
                    ,CATEGORY_NO
                ) VALUES (
                    '".$row['idx']."'
                    ,'".$row['supp']."'
                    ,'".$row['cate']."'
                    ,'".$row['head']."'
                    ,'".str_replace("'", "\\'",$row['subject'])."'
                    , '".str_replace("'", "\\'",$row['content'])."'
                    , 'BOARD'
                    , 'ANGE'
                    , '".$row['id']."'
                    , '".$row['name']."'
                    , '".$row['name']."'
                    , '".$row['wdate']."'
                    , '".$row['notice']."'
#                    , '".$row['ETC1']."'
#                    , '".$row['ETC2']."'
#                    , '".$row['ETC3']."'
#                    , '".$row['ETC4']."'
#                    , '".$row['ETC5']."'
#                    , '".$row['PASSWORD']."'
                    , $i
                    , '".$row['CATEGORY_NO']."'
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