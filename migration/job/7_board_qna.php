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

    $sql = "SELECT idx, rep_idx, head, cate, id, name, subject, content, q_hit, scrChk, notice,
                CASE WHEN q_date IS NULL THEN NULL WHEN LEN(q_date) < 21 THEN q_date ELSE convert(varchar(19), convert(datetime,  left(q_date,charindex(' ',q_date,1)-1)+ ' '+ right(q_date,charindex(' ',reverse(q_date),1)-1)+ case when charindex('오전',q_date,1) > 0 then 'AM' else 'PM' end), 120) END AS q_date
            FROM ange_qna
            -- 07
            WHERE cate = '07' AND idx between 23933 and 25000
            -- 08
            --WHERE cate = '08' AND idx between 24035 and 25000
            -- 09
            --WHERE cate = '09' AND idx between 24024 and 25000
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
                    ,PASSWORD
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
                    ,MIG_NO
                    ,MIG_COMM_NO
                    ,MIG_TBL
                ) VALUES (
                    '".(580000+$row['idx'])."'
                    ,'".($row['rep_idx'] == 0 ? 0 : 580000+$row['rep_idx'])."'
                    ,'24'
                    ,'".$row['scrChk']."'
                    ,'".$row['head']."'
                    ,'".($row['rep_idx'] == '0' ? '' : '[RE]').str_replace("'", "\\'",$row['subject'])."'
                    , '".str_replace("'", "\\'",$row['content'])."'
                    , 'CLINIC'
                    , 'ANGE'
                    , '".$row['id']."'
                    , '".$row['name']."'
                    , '".$row['q_date']."'
                    , '".($row['notice'] == '1' ? 'Y' : 'N')."'
                    , '".$row['q_hit']."'
                    , ".(938+$i)."
                    , '".$row['idx']."'
                    , '".$row['cate']."'
                    , 'living_fp'
                )";
                // 07(24) : 938, 08(23) : 831, 09(22) : 730,
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