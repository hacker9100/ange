<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");

@session_start();

@extract($_GET);
@extract($_POST);
@extract($_SERVER);

date_default_timezone_set('Asia/Seoul');

include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");

MtUtil::_c("### [START]");
MtUtil::_c(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC[processApi] category.cnt : ".count($category));
    }
*/
$_d = new MtJson();

if ($_d->connect_db == "") {
    $_d->failEnd("DB 연결 실패. 관리자에게 문의하세요.");
}

if (!isset($_type) || $_type == "") {
    $_d->failEnd("서버에 문제가 발생했습니다. 작업 유형이 없습니다.");
}

$ip = "";

if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}

    switch ($_method) {
        case "GET":
            if ($_type == "item") {
                $search_where = "";

//                if (isset($_search[COMM_GB]) && $_search[COMM_GB] != "") {
//                    $search_where .= "AND COMM_GB = '".$_search[COMM_GB]."' ";
//                }

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            NO, SUBJECT, START_YMD, END_YMD, PRESENT, QUERY_CNT, POLL_ST, REG_DT
                            , (SELECT COUNT(DISTINCT USER_UID) AS POLL_ANSWER_CNT FROM ANGE_POLL_ANSWEAR WHERE BOARD_NO = ".$_key.") AS POLL_ANSWER_CNT
                        FROM
                            ANGE_POLL
                        WHERE
                            NO = ".$_key."
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT QUERY_NO, QUERY_SORT, BOARD_NO, QUERY_GB, QUERY
                    FROM
                      ANGE_POLL_QUERY
                        WHERE
                          BOARD_NO = ".$data[NO]."
                        ORDER BY QUERY_SORT
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT QUERY_NO, QUERY_SORT, SELECT_SORT, BOARD_NO, NOTE
                        FROM ANGE_POLL_SELECT
                            WHERE
                                BOARD_NO = ".$row[BOARD_NO]."
                                AND QUERY_NO = ".$row[QUERY_NO]."
                            ORDER BY SELECT_SORT
                            ";

                    $file_data = $_d->getData($sql);
                    $row['SELECT'] = $file_data;

                    $__trn->rows[$i] = $row;
                }

                $_d->sql_free_result($result);
                $data['QUERY'] = $__trn->{'rows'};
/*
                $sql = "SELECT
                            NO, PARENT_NO, REPLY_NO, REPLY_GB, SYSTEM_GB, COMMENT, REG_ID, REG_NM, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, SCORE
                        FROM
                            COM_REPLY
                        WHERE
                            TARGET_NO = ".$_key."
                        ";

                $reply_data = $_d->getData($sql);
                $data['REPLY'] = $reply_data;
*/

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$msg);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if ($_type == "list") {
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search[POLL_ST]) && $_search[POLL_ST] != "") {
                    $search_where .= "AND POLL_ST = '".$_search[POLL_ST]."' ";
                }

                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SUBJECT, START_YMD, END_YMD, PRESENT, QUERY_CNT, POLL_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                        (
                            SELECT
                                NO, SUBJECT, START_YMD, END_YMD, PRESENT, QUERY_CNT, POLL_ST, REG_DT
                            FROM
                                ANGE_POLL
                            WHERE
                                1 = 1
                                ".$search_where."
                            ".$sort_order."
                            ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_POLL
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) CNT
                        ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == "check") {

                $sql = "SELECT COUNT(DISTINCT USER_UID) AS POLL_ANSWER_CNT
                        FROM ANGE_POLL_ANSWEAR
                        WHERE POLL_NO = ".$_search[BOARD_NO]."
                          AND USER_UID = '".$_search[USER_UID]."'";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

            if ($_type == "item") {
                $err = 0;
                $msg = "";

/*                if( trim($_model[SUBJECT]) == "" ){
                    $_d->failEnd("제목을 작성 하세요");
                }*/

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_POLL
                        (
                            SUBJECT,
                            START_YMD,
                            END_YMD,
                            PRESENT,
                            QUERY_CNT,
                            POLL_ST,
                            REG_DT
                        ) VALUES (
                            '".$_model[SUBJECT]."',
                            '".$_model[START_YMD]."',
                            '".$_model[END_YMD]."',
                            '".$_model[PRESENT]."',
                            '".$_model[QUERY_CNT]."',
                            '".$_model[POLL_ST]."',
                            SYSDATE()
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $i = 0;
                foreach ($_model[QUERY] as $e) {
                    if (isset($e[QUERY]) && $e[QUERY] != "") {
                        $sql = "INSERT INTO ANGE_POLL_QUERY
                                (
                                    POLL_NO
                                    ,QUERY_NO
                                    ,QUERY_ORD
                                    ,QUERY_GB
                                    ,QUERY
                                ) VALUES (
                                    '".$no."'
                                    ,'".$i++."'
                                    ,'".$e[BABY_SEX_GB]."'
                                    ,'".$e[QUERY_GB]."'
                                    ,'".$e[QUERY]."'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }

                        $j = 0;
                        foreach ($e[SELECT] as $s) {
                            if (isset($s[NOTE]) && $s[NOTE] != "") {
                                $sql = "INSERT INTO ANGE_POLL_SELECT
                                        (
                                            POLL_NO
                                            ,QUERY_NO
                                            ,SELECT_ORD
                                            ,NOTE
                                        ) VALUES (
                                            '".$no."'
                                            ,'".$i++."'
                                            ,'".$j."'
                                            ,'".$s[NOTE]."'
                                        )";

                                $_d->sql_query($sql);

                                if($_d->mysql_errno > 0) {
                                    $err++;
                                    $msg = $_d->mysql_error;
                                }
                            }
                        }
                    }
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "answear") {

               /* ".$_SESSION['uid']."*/
                $j = 0;
                foreach ($_model as $s) {
//                    if (isset($s[NOTE]) && $s[NOTE] != "") {
//
//                    }
                    $sql = "INSERT INTO ANGE_POLL_ANSWEAR
                                (
                                    QUERY_NO
                                    ,QUERY_SORT
                                    ,USER_UID
                                    ,POLL_NO
                                    ,NICK_NM
                                    ,SELECT_ANSWEAR
                                    ,NOTE
                                    ,REG_DT
                                ) VALUES (
                                    '".$s[SELECT_ANSWER][QUERY_NO]."'
                                    ,'".$s[SELECT_ANSWER][QUERY_SORT]."'
                                    ,'hong'
                                    ,'".$s[SELECT_ANSWER][BOARD_NO]."'
                                    , '므에에롱'
                                    ,'".$s[SELECT_ANSWER][SELECT_SORT]."'
                                    ,'".$s[SELECT_ANSWER][NOTE]."'
                                    ,SYSDATE()
                                )";

                    $_d->sql_query($sql);
                    $no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                }


                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd("0");
                }


        }
            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if( trim($_model[SUBJECT]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_POLL
                    SET
                        SUBJECT = '".$_model[SUBJECT]."',
                        START_YMD = '".$_model[START_YMD]."',
                        END_YMD = '".$_model[END_YMD]."',
                        PRESENT = '".$_model[PRESENT]."',
                        QUERY_CNT = '".$_model[QUERY_CNT]."',
                        POLL_ST = '".$_model[POLL_ST]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            $sql = "DELETE FROM ANGE_POLL_QUERY WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_SELECT WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $i = 0;
            foreach ($_model[QUERY] as $e) {
                if (isset($e[QUERY]) && $e[QUERY] != "") {
                    $sql = "INSERT INTO ANGE_POLL_QUERY
                            (
                                POLL_NO
                                ,QUERY_NO
                                ,QUERY_ORD
                                ,QUERY_GB
                                ,QUERY
                            ) VALUES (
                                '".$no."'
                                ,'".$i++."'
                                ,'".$e[BABY_SEX_GB]."'
                                ,'".$e[QUERY_GB]."'
                                ,'".$e[QUERY]."'
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $j = 0;
                    foreach ($e[SELECT] as $s) {
                        if (isset($s[NOTE]) && $s[NOTE] != "") {
                            $sql = "INSERT INTO ANGE_POLL_SELECT
                                    (
                                        POLL_NO
                                        ,QUERY_NO
                                        ,SELECT_ORD
                                        ,NOTE
                                    ) VALUES (
                                        '".$no."'
                                        ,'".$i++."'
                                        ,'".$j."'
                                        ,'".$s[NOTE]."'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }
            }

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_POLL WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_QUERY WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_SELECT WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>