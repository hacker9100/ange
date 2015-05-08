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

MtUtil::_d("### ['START']");
MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC['processApi'] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC['processApi'] category.cnt : ".count($category));
    }
*/
$_d = new MtJson(null);

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
        if($_type == 'item'){
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "SELECT  NO, TO_ID, (SELECT NICK_NM FROM COM_USER WHERE USER_ID = TO_ID) AS TO_NM, FROM_ID, (SELECT NICK_NM FROM COM_USER WHERE USER_ID = FROM_ID) AS FROM_NM, BODY, REG_DT, CHECK_FL
                     FROM (
                                SELECT NO, TO_ID, TO_NM, FROM_ID, FROM_NM, BODY, REG_DT, CHECK_FL
                                FROM ANGE_MESSAGE
                                WHERE NO = ".$_key."
                     )  A";

            $data = $_d->sql_query($sql);
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);
                $_d->dataEnd2($data);
            }
        } else if($_type == 'list') {

            // 검색조건 추가
            /*               if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                               $search_where .= "AND AMS.USER_ID = '".$_SESSION['uid']."'";
                           }*/
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $limit = "";

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
            }

            $sql = " SELECT STATUS, TO_CNT, FROM_CNT, NO, TO_ID, (SELECT NICK_NM FROM COM_USER WHERE USER_ID = TO_ID) AS TO_NM, FROM_ID, (SELECT NICK_NM FROM COM_USER WHERE USER_ID = FROM_ID) AS FROM_NM, BODY, CHECK_FL,
                         REG_DT, TO_CNT+FROM_CNT AS TOTAL_CNT
                        FROM
                        (
                           SELECT NO, TO_ID, TO_NM, FROM_ID, FROM_NM, BODY, REG_DT, CHECK_FL,'RECIEVE' AS STATUS
                           FROM ANGE_MESSAGE
                           WHERE 1=1
                              AND TO_ID = '".$_SESSION['uid']."'
                            UNION
                            SELECT NO, TO_ID, TO_NM, FROM_ID, FROM_NM, BODY, REG_DT, CHECK_FL,'SEND' AS STATUS
                           FROM ANGE_MESSAGE
                           WHERE
                              1=1
                              AND FROM_ID = '".$_SESSION['uid']."'
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TO_CNT
                            FROM
                                ANGE_MESSAGE B
                            WHERE
                                1=1
                                AND TO_ID = '".$_SESSION['uid']."'
                        ) TO_CNT,
                        (
                            SELECT
                                COUNT(*) AS FROM_CNT
                            FROM
                                ANGE_MESSAGE B
                            WHERE
                                1=1
                                AND FROM_ID = '".$_SESSION['uid']."'
                        ) FROM_CNT
                        ORDER BY NO DESC
                        ".$limit."
                ";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if($_type == 'searchuserlist'){

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $search_where = "";

            // 검색조건 추가(닉네임)
            if (isset($_search['NICK_NM']) && $_search['NICK_NM'] != "") {
                $search_where .= "AND CU.NICK_NM LIKE '%".$_search['NICK_NM']."%'";
            }

            // 팝업에서 닉네임 검색
//            if (isset($_search['TO_NICK_NM']) && $_search['TO_NICK_NM'] != "") {
//                $search_where .= "AND CU.NICK_NM LIKE '%".$_search['TO_NICK_NM']."%'";
//            }

            $limit = "";

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
            }

            $sql = " SELECT USER_ID, NICK_NM, TOTAL_COUNT
                        FROM
                        (
                           SELECT USER_ID, NICK_NM
                           FROM COM_USER CU
                           WHERE 1=1
                              ".$search_where."
                           ".$limit."
                        ) AS DATA,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM COM_USER CU
                            WHERE 1=1
                              ".$search_where."
                        ) FROM_CNT

                ";

            $__trn = '';
            $result = $_d->sql_query($sql,true);

            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_USER U, COM_FILE F
                            WHERE
                                U.NO = F.TARGET_NO
                                AND F.TARGET_GB = 'USER'
                                AND U.USER_ID = '".$row['USER_ID']."'
                                AND F.FILE_GB = 'THUMB'
                            ";

                $file_data = $_d->sql_fetch($sql);
                $row['FILE'] = $file_data;

                $__trn->rows[$i] = $row;
            }

            $_d->sql_free_result($result);
            $data = $__trn->{'rows'};

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
        } else if($_type == 'tocount') {
            $sql = " SELECT COUNT(*) AS TO_CNT FROM ANGE_MESSAGE WHERE TO_ID = '".$_SESSION['uid']."' AND CHECK_FL <> 'Y'";

            $data = $_d->sql_fetch($sql);

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
        }

        break;

    case "POST":
        if ($_type == "item") {
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "INSERT INTO ANGE_MESSAGE
                        (
                            TO_ID,
                            TO_NM,
                            FROM_ID,
                            FROM_NM,
                            BODY,
                            REG_DT,
                            CHECK_FL
                        ) VALUES (
                             '".$_model['TO_ID']."'
                            , '".$_model['TO_NM']."'
                            , '".$_SESSION['uid']."'
                            , '".$_SESSION['name']."'
                            , '".$_model['BODY']."'
                            , NOW()
                            , 'N'
                        )";

            /*".$_model['SORT_IDX']."*/

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }
        } else if ($_type == "admin") {
            $search_where = "";

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            if ($_model['CHECKED'] == "C") {
                if (isset($_model['USER_ID_LIST'])) {
                    $in_str = "";
                    $in_size = sizeof($_model['USER_ID_LIST']);
                    for ($i=0; $i< $in_size; $i++) {
                        $in_str .= "'".trim($_model['USER_ID_LIST'][$i])."'";
                        if ($in_size - 1 != $i) $in_str .= ",";
                    }

                    $search_where = "AND USER_ID IN (".$in_str.") ";
                }
            } else {
                if ((isset($_model['CONDITION']) && $_model['CONDITION'] != "") && (isset($_model['KEYWORD']) && $_model['KEYWORD'] != "")) {
                    if ($_model['CONDITION']['value'] == "USER_NM" || $_model['CONDITION']['value'] == "USER_ID" || $_model['CONDITION']['value'] == "NICK_NM") {
                        $arr_keywords = explode(",", $_model['KEYWORD']);
                        $in_condition = "";
                        for ($i=0; $i< sizeof($arr_keywords); $i++) {
                            $in_condition .= "'".trim($arr_keywords[$i])."'";
                            if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                        }

                        $search_where .= "AND ".$_model['CONDITION']['value']." IN (".$in_condition.") ";
                    } else if ($_model['CONDITION']['value'] == "PHONE") {
                        $search_where .= "AND ( PHONE_1 LIKE '%".$_model['KEYWORD']."%' OR PHONE_2 LIKE '%".$_model['KEYWORD']."%' ) ";
                    } else {
                        $search_where .= "AND ".$_model['CONDITION']['value']." LIKE '%".$_model['KEYWORD']."%' ";
                    }
                }
                if (isset($_model['TYPE']) && $_model['TYPE'] != "") {

                    $in_type = "";
                    for ($i=0; $i< count($_model['TYPE']); $i++) {
                        $in_type .= "'".$_model['TYPE'][$i]."'";
                        if (count($_model['TYPE']) - 1 != $i) $in_type .= ",";
                    }

                    $search_where .= "AND USER_GB IN (".$in_type.") ";
                }
                if (isset($_model['STATUS']) && $_model['STATUS'] != "" && $_model['STATUS']['value'] != "A") {
                    $search_where .= "AND USER_ST  = '".$_model['STATUS']['value']."' ";
                }
            }

            $sql = "SELECT USER_ID, NICK_NM
                    FROM
                        COM_USER
                    WHERE
                        1 = 1
                        ".$search_where."
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $sql = "INSERT INTO ANGE_MESSAGE
                        (
                            TO_ID,
                            TO_NM,
                            FROM_ID,
                            FROM_NM,
                            BODY,
                            REG_DT,
                            CHECK_FL
                        ) VALUES (
                             '".$row['USER_ID']."'
                            , '".$row['NICK_NM']."'
                            , '".$_SESSION['uid']."'
                            , '".$_SESSION['name']."'
                            , '".$_model['BODY']."'
                            , SYSDATE()
                            , 'N'
                        )";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        }


        break;

    case "PUT":

        MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

        if($_type == 'check'){

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "UPDATE ANGE_MESSAGE SET
                            CHECK_FL = 'Y'
                     WHERE NO = '".$_key."'
                        ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {

                $sql = "SELECT
                                COUNT(*) AS TO_CNT
                            FROM
                                ANGE_MESSAGE
                            WHERE
                                CHECK_FL = 'N'
                                AND TO_ID = '".$_SESSION['uid']."'
                            ";

                $message_data  = $_d->sql_fetch($sql);
                $_SESSION['message'] = $message_data['TO_CNT'];

                $_d->dataEnd2(array("message" => $_SESSION['message']));
            }

        } else{

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "UPDATE ANGE_MESSAGE SET
                            TO_ID = '".$_model['TO_ID']."'
                            , TO_NM = '".$_model['TO_NM']."'
                     WHERE NO = '".$_key."'
                        ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }
        }

        break;

    case "DELETE":

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        $sql = "DELETE FROM ANGE_MESSAGE WHERE NO = ".$_key;

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if ($_d->mysql_errno > 0) {
            $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
        } else {
            $_d->succEnd($no);
        }

        break;
}