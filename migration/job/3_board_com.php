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
    $comm_no = '11';
/*
    $sql = "SELECT idx, cate, id, name, head, subject, content, rep_idx, hit, recom, notice, supp, img_ok, mode, bbs_TB, bbs_idx,
                CASE WHEN wdate IS NULL THEN NULL WHEN LEN(wdate) < 21 THEN wdate ELSE convert(varchar(19), convert(datetime,  left(wdate,charindex(' ',wdate,1)-1)+ ' '+ right(wdate,charindex(' ',reverse(wdate),1)-1)+ case when charindex('오전',wdate,1) > 0 then 'AM' else 'PM' end), 120) END AS wdate
            FROM dbo.ange_com_board
            -- 01
            --WHERE cate = '01' AND idx between 537108 and 539000
            -- 08
            --WHERE cate = '08' AND idx between 537170 and 539000
            -- 09
            --WHERE cate = '09' AND idx between 537175 and 539000
            -- 10
            --WHERE cate = '10' AND idx between 537177 and 539000
            -- 11
            --WHERE cate = '11' AND idx between 537946 and 539000
            -- 25
            --WHERE cate = '25' AND idx between 537178 and 539000
            -- 30
            WHERE cate = '30' AND idx between 537179 and 539000
            ORDER BY idx
            ";
*/
    $sql = "SELECT idx, cate, id, name, subject, content, rep_idx, hit, notice, img_ok,
                CASE WHEN wdate IS NULL THEN NULL WHEN LEN(wdate) < 21 THEN wdate ELSE convert(varchar(19), convert(datetime,  left(wdate,charindex(' ',wdate,1)-1)+ ' '+ right(wdate,charindex(' ',reverse(wdate),1)-1)+ case when charindex('오전',wdate,1) > 0 then 'AM' else 'PM' end), 120) END AS wdate
            FROM dbo.ange_anony_board
            WHERE idx between 2176 and 2200
            ORDER BY idx
            ";

//    $result = $_a->sql_query($sql,true);
    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;

//        MtUtil::_c($i."> [idx] ".$row['idx'].", [cate] ".$row['cate'].", [id] ".$row['id'].", [name] ".$row['name'].", [head] ".$row['head'].", [subject] ".$row['subject'].", [content] ".$row['content'].", [rep_idx] ".$row['rep_idx'].", [hit] ".$row['hit'].", [recom] ".$row['recom'].", [wdate] ".$row['wdate'].", [notice] ".$row['notice'].", [supp] ".$row['supp'].", [img_ok] ".$row['img_ok']);

//        $_t->sql_query("INSERT INTO MIG_BOARD_INFO (USER_ID, MIG_NO, MIG_DT, MIG_ST) VALUES ('".$row['id']."', '".$row['idx']."', SYSDATE(), '0')");
//        $no = $_t->mysql_insert_id;

//        $_t->sql_beginTransaction();

        $content = str_replace("'", "\\'",$row['content']);
        $content = str_replace("src=\"/UserFiles", "src=\"http://www.ange.co.kr/UserFiles",$content);
/*
        $sql = "INSERT INTO COM_BOARD
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
                    ,NICK_NM
                    ,REG_DT
                    ,NOTICE_FL
                    ,HIT_CNT
                    ,BOARD_NO
                    ,MODE_GB
                    ,MIG_NO
                    ,MIG_COMM_NO
                    ,MIG_TBL
                ) VALUES (
                    '".$row['idx']."'
                    ,'".$row['supp']."'
                    ,'8'
                    ,'".$row['head']."'
                    ,'".str_replace("'", "\\'",$row['subject'])."'
                    , '".$content."'
                    , 'BOARD'
                    , 'ANGE'
                    , '".$row['id']."'
                    , '".$row['name']."'
                    , '".$row['wdate']."'
                    , '".$row['notice']."'
                    , '".$row['hit']."'
                    , ".(1171+$i)."
                    , '".$row['mode']."'
                    , '".$row['idx']."'
                    , '".$row['cate']."'
                    , 'ange_anony_board'
                )";

        // BOARD_NO 01 : 286684, 08: 47282, 09 : 65891, 10 : 49233 11 : 906 25 :3894
*/

        $content = str_replace("'", "\\'",$row['content']);
        $content = str_replace("src=\"/UserFiles", "src=\"http://www.ange.co.kr/UserFiles",$content);

        $sql = "INSERT INTO COM_BOARD
                (
                    NO
                    ,PARENT_NO
                    ,COMM_NO
                    ,SUBJECT
                    ,BODY
                    ,BOARD_GB
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
                    '".(540000+$row['idx'])."'
                    ,'0'
                    ,'8'
                    ,'".str_replace("'", "\\'",$row['subject'])."'
                    , '".$content."'
                    , 'BOARD'
                    , 'ANGE'
                    , '".$row['id']."'
                    , '".$row['name']."'
                    , '".$row['wdate']."'
                    , '".$row['notice']."'
                    , '".$row['hit']."'
                    , ".(1171+$i)."
                    , '".$row['idx']."'
                    , '40'
                    , 'ange_anony_board'
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