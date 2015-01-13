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
            if($_type == 'item'){
                $sql = "SELECT NO,PARENT_NO,HEAD,SUBJECT,BODY,REG_UID,REG_NM,REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG,
                        REPLY_BODY , IFNULL(REPLY_BODY,'N')AS REPLY_YN, SCRAP_FL, REPLY_FL, ETC1, ETC2, ETC3, REPLY_COUNT ,BOARD_GB
                        FROM (
                            SELECT
                              B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.BODY, B.REG_UID, B.REG_NM, DATE_FORMAT(B.REG_DT, '%Y-%m-%d') AS REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.NOTICE_FL, B.WARNING_FL, B.BEST_FL, B.TAG,
                              (SELECT BODY FROM COM_BOARD WHERE PARENT_NO = B.NO) AS REPLY_BODY, B.SCRAP_FL, B.REPLY_FL, B.ETC1, B.ETC2, B.ETC3, (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = B.NO) AS REPLY_COUNT, B.BOARD_GB
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

                // 검색조건 추가
                if (isset($_search[REG_UID]) && $_search[REG_UID] != "") {
                    $search_where .= "AND AMS.USER_ID = '".$_SESSION['uid']."'";
                }

                $limit = "";

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = " SELECT TOTAL_COUNT, @RNUM := @RNUM+1 AS RNUM, REASON, POINT, USER_ID, SUM_POINT, USE_POINT, REMAIN_POINT
                    FROM
                    (
                        SELECT AM.REASON, AM.POINT, AMS.USER_ID, AMS.SUM_POINT, AMS.USE_POINT, AMS.REMAIN_POINT
                        FROM ANGE_MILEAGE AM, ANGE_MILEAGE_STATUS AMS
                        WHERE 1=1
                         ".$search_where."
                         ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) AS TOTAL_COUNT
                        FROM ANGE_MILEAGE AM, ANGE_MILEAGE_STATUS AMS
                        WHERE 1=1
                         ".$search_where."
                    ) CNT

                ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }

            break;

        case "POST":
            $sql = "INSERT INTO ANGE_MILEAGE
                        (
                            MILEAGE_GB,
                            POINT,
                            REASON,
                            COMM_GB,
                            LIMIT_CNT,
                            LIMIT_DAY,
                            POINT_ST
                        ) VALUES (
                             ".$_model[MILEAGE_GB]."
                            , ".$_model[POINT]."
                            , '".$_model[REASON]."'
                            , '".$_model[COMM_GB]."'
                            , ".$_model[LIMIT_CNT]."
                            , '".$_model[LIMIT_DAY]."'
                            , '".$_model[POINT_ST]."'
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

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));


            $sql = "UPDATE ANGE_MILEAGE SET
                            POINT = ".$_model[TARGET_GB]."
                            , REASON = '".$_model[REASON]."'
                            , COMM_GB = '".$_model[COMM_GB]."'
                            , LIMIT_CNT = ".$_model[LIMIT_CNT]."
                            , LIMIT_DAY = '".$_model[LIMIT_DAY]."'
                            , POINT_ST = ".$_model[POINT_ST]."
                     WHERE NO = '".$_key."'
                        ";

            $_d->sql_query($sql);

            $sql = "UPDATE ANGE_MILEAGE_STATUS SET
                            SUM_POINT = ".$_model[SUM_POINT]."
                            ,USE_POINT = ".$_model[USE_POINT]."
                            ,REMAIN_POINT = ".$_model[REMAIN_POINT]."
                     WHERE USER_ID = '".$_SESSION['uid']."'";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM ANGE_MILEAGE WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;
    }