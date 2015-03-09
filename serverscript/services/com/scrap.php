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

MtUtil::_d("### [START]");
MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC[processApi] category.cnt : ".count($category));
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

                $sql = "SELECT NO,PARENT_NO,HEAD,SUBJECT,BODY,REG_UID,REG_NM,REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG,
                        REPLY_BODY , IFNULL(REPLY_BODY,'N')AS REPLY_YN, SCRAP_FL, REPLY_FL, ETC1, ETC2, ETC3, REPLY_COUNT ,BOARD_GB,
                        (SELECT SHORT_NM FROM ANGE_COMM WHERE NO = COMM_NO) AS SHORT_NM, COMM_NO
                        FROM (
                            SELECT
                              B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.BODY, B.REG_UID, B.REG_NM, DATE_FORMAT(B.REG_DT, '%Y-%m-%d') AS REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.NOTICE_FL, B.WARNING_FL, B.BEST_FL, B.TAG,
                              (SELECT BODY FROM COM_BOARD WHERE PARENT_NO = B.NO) AS REPLY_BODY, B.SCRAP_FL, B.REPLY_FL, B.ETC1, B.ETC2, B.ETC3, (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = B.NO) AS REPLY_COUNT, B.BOARD_GB, B.COMM_NO
                            FROM
                              COM_BOARD B
                            WHERE
                              B.NO = ".$_key."
                            )  A";

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if($_type == 'list'){

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $limit = "";
                $search_where = "";

                // 검색조건 추가
                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND CB.".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%'";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = " SELECT TOTAL_COUNT, @RNUM := @RNUM+1 AS RNUM, CONTENT_NO, CONTENT_SUBJECT, NO,
                            TARGET_NO, BOARD_NO, BOARD_SUBJECT, TARGET_GB, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, (SELECT SHORT_NM FROM ANGE_COMM WHERE NO = COMM_NO) AS SHORT_NM, COMM_NO
                    FROM
                    (
                        SELECT CS.TARGET_NO, CS.TARGET_GB, NO,
                               (SELECT SUBJECT FROM COM_BOARD WHERE NO = CS.TARGET_NO) AS BOARD_SUBJECT,
                               (SELECT NO FROM COM_BOARD WHERE NO = CS.TARGET_NO) AS BOARD_NO,
                               (SELECT COMM_NO FROM COM_BOARD WHERE NO = CS.TARGET_NO) AS COMM_NO,
                               (SELECT SUBJECT FROM CMS_TASK WHERE NO = CS.TARGET_NO) AS CONTENT_SUBJECT,
                               (SELECT NO FROM CMS_TASK WHERE NO = CS.TARGET_NO) AS CONTENT_NO,
                               CS.REG_DT
                        FROM COM_SCRAP CS
                        WHERE 1=1
                         AND CS.REG_UID = '".$_SESSION['uid']."'
                         ".$search_where."
                         ORDER BY REG_DT DESC
                         ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) AS TOTAL_COUNT
                        FROM COM_SCRAP CS
                        WHERE 1=1
                         AND CS.REG_UID = '".$_SESSION['uid']."'
                         ".$search_where."
                    ) CNT
                ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }  else if ($_type == "check") {

                $sql = "SELECT COUNT(*) AS SCRAP_CNT
                        FROM COM_SCRAP
                        WHERE TARGET_NO = ".$_search[TARGET_NO]."
                          AND REG_UID = '".$_SESSION['uid']."'";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

            }
            break;

        case "POST":
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "INSERT INTO COM_SCRAP
                        (
                            TARGET_NO,
                            TARGET_GB,
                            REG_UID,
                            NICK_NM,
                            REG_NM,
                            REG_DT
                        ) VALUES (
                             ".$_model[TARGET_NO]."
                            , '".$_model[TARGET_GB]."'
                            , '".$_SESSION['uid']."'
                            , '".$_SESSION['nick']."'
                            , '".$_SESSION['name']."'
                            , SYSDATE()
                        )";

            /*".$_model[SORT_IDX]."*/

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "PUT":

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));


                $sql = "UPDATE COM_SCRAP SET
                            TARGET_GB = '".$_model[TARGET_GB]."'
                            , TARGET_NO = '".$_model[TARGET_NO]."'
                     WHERE NO = '".$_key."'
                        ";
            // ,SEASON_NM = '".$_model[SEASON_NM]."'


            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }



            $sql = "DELETE FROM COM_SCRAP WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;
    }