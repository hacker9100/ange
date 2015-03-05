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
            } else if ($_type == 'list'){

                $search_where = "";
                $search_table = "";

                // 검색조건 추가
                if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                    $search_where .= "AND AUM.USER_ID = '".$_SESSION['uid']."'";
                }

                $currentYear = date('Y');

                if (isset($_search['YEAR']) && $_search['YEAR'] != "") {

                    if($currentYear != $_search['YEAR']){
                        $search_table .= "FROM ANGE_USER_MILEAGE_".$_search['YEAR']." AUM";
                    }else{
                        $search_table .= "FROM ANGE_USER_MILEAGE AUM";
                    }
                }else{
                    $search_table .= "FROM ANGE_USER_MILEAGE AUM";
                }

                $limit = "";

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                // FROM ANGE_USER_MILEAGE AUM
                $sql = "SELECT TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, REASON, POINT, EARN_GB, PLACE_GB, EARN_DT, SUBJECT
                        FROM
                        (
                            SELECT AUM.USER_ID,
                                 (SELECT SUBJECT FROM ANGE_MILEAGE WHERE NO = AUM.MILEAGE_NO) AS SUBJECT,
                                 (SELECT REASON FROM ANGE_MILEAGE WHERE NO = AUM.MILEAGE_NO) AS REASON,
                                 (SELECT POINT FROM ANGE_MILEAGE WHERE NO = AUM.MILEAGE_NO) AS POINT,
                                 AUM.EARN_GB, AUM.PLACE_GB, AUM.EARN_DT
                            ".$search_table."
                            WHERE 1=1
                             ".$search_where."
                             ORDER BY AUM.EARN_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            ".$search_table."
                            WHERE 1=1
                             ".$search_where."
                        ) CNT
                        WHERE 1 =1
                          AND POINT <> 0
                        ".$limit."

                ";

//                if (isset($_search[STATUS])) {
//                    $__trn = '';
//                    $result = $_d->sql_query($sql,true);
//                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
//
//                        $sql = "SELECT
//                                    SUM_POINT,USE_POINT,REMAIN_POINT
//                                FROM
//                                    ANGE_MILEAGE_STATUS
//                                WHERE
//                                    1=1
//                                    AND USER_ID = '".$row['USER_ID']."'
//                                ";
//
//                        $category_data = $_d->getData($sql);
//                        $row['STATUS'] = $category_data;
//
//                        $__trn->rows[$i] = $row;
//                    }
//                    $_d->sql_free_result($result);
//                    $data = $__trn->{'rows'};
//
//                    if($_d->mysql_errno > 0){
//                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                    }else{
//                        $_d->dataEnd2($data);
//                    }
//                }

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if($_type == "mymileagepoint"){

                if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                    $search_where .= "AND USER_ID = '".$_SESSION['uid']."'";
                }

                $sql = "SELECT
                        SUM_POINT,USE_POINT,REMAIN_POINT
                    FROM
                        COM_USER
                    WHERE
                        1=1
                        AND USER_ID = '".$_SESSION['uid']."'
                    ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

            } else if($_type == "check") {

                $sql = "SELECT
                            MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                        FROM
                            ANGE_MILEAGE
                        WHERE NO = ".$_key."
                        ";

                $data = $_d->sql_fetch($sql);

                if (isset($data)) {

                }
            }

            break;

        case "POST":

            if ($_type == "item") {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $where = "";

                if (isset($_model[MILEAGE_GB]) && $_model[MILEAGE_GB] != "") {
                    $where .= "AND MILEAGE_GB  = '".$_model[MILEAGE_GB]."' ";
                }

                $sql = "SELECT
                            NO, MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                        FROM
                            ANGE_MILEAGE
                        WHERE
                            POINT_ST = '0'
                            AND NO = '".$_model['MILEAGE_NO']."'
                            ".$where."
                        ";

                $data = $_d->sql_fetch($sql);

                if (isset($data) && $data['LIMIT_DAY'] != '0') {
                    $where = "";

                    if ($data['LIMIT_GB'] == 'DAY') {
                        $where = "AND EARN_DT BETWEEN DATE_SUB(DATE_FORMAT(SYSDATE(), '%Y-%m-%d'), INTERVAL ".($data['LIMIT_DAY']-1)." DAY) AND DATE_ADD(DATE_FORMAT(SYSDATE(), '%Y-%m-%d'), INTERVAL + 1 DAY)";
                    } else if ($data['LIMIT_GB'] == 'WEEK') {
                        $where = "AND EARN_DT BETWEEN DATE_SUB(DATE_ADD(DATE_FORMAT(SYSDATE(), '%Y-%m-%d'), INTERVAL 7 - WEEKDAY(SYSDATE()) DAY), INTERVAL ".$data['LIMIT_DAY']." WEEK) AND DATE_ADD(DATE_FORMAT(SYSDATE(), '%Y-%m-%d'), INTERVAL 7 - WEEKDAY(SYSDATE()) DAY)";
                    } else if ($data['LIMIT_GB'] == 'MONTH') {
                        $where = "AND EARN_DT BETWEEN DATE_SUB(DATE_FORMAT(SYSDATE(), '%Y-%m-01'), INTERVAL ".($data['LIMIT_DAY']-1)." MONTH) AND LAST_DAY(SYSDATE())";
                    } else if ($data['LIMIT_GB'] == 'YEAR') {
                        $where = "AND EARN_DT BETWEEN DATE_SUB(DATE_FORMAT(SYSDATE(), '%Y-01-01'), INTERVAL ".($data['LIMIT_DAY']-1)." YEAR) AND DATE_FORMAT(SYSDATE(),'%Y-12-31')";
                    }

                    $sql = "SELECT
                                COUNT(*) AS MILEAGE_CNT
                            FROM
                                ANGE_USER_MILEAGE
                            WHERE
                                USER_ID = '".$_SESSION['uid']."'
                                AND MILEAGE_NO = '".$_model['MILEAGE_NO']."'
                                AND EARN_GB = '".$_model['MILEAGE_GB']."'
                                ".$where."
                            ";

                    $mileage_cnt = $_d->sql_fetch($sql);

                    if ($mileage_cnt['MILEAGE_CNT'] >= $data['LIMIT_CNT']) {
                        $_d->dataEnd2(array("mileage" => $_SESSION['mileage']));
                    }
                }

                $sql = "INSERT INTO ANGE_USER_MILEAGE
                        (
                            USER_ID,
                            EARN_DT,
                            MILEAGE_NO,
                            EARN_GB,
                            PLACE_GB,
                            POINT,
                            REASON
                        ) VALUES (
                            '".$_SESSION['uid']."'
                            , SYSDATE()
                            , '".$data['NO']."'
                            , '".$data['MILEAGE_GB']."'
                            , '".$data['SUBJECT']."'
                            , '".$data['POINT']."'
                            , '".$data['REASON']."'
                        )";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "UPDATE
                            COM_USER
                        SET
                            SUM_POINT = SUM_POINT + ".$data['POINT'].",
                            REMAIN_POINT = REMAIN_POINT + ".$data['POINT']."
                        WHERE
                            USER_ID = '".$_SESSION['uid']."'";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                } else {
MtUtil::_d("### [MILEAGE ???????] ".$_SESSION['mileage']);
                    $_SESSION['mileage'] = $_SESSION['mileage'] + $data['POINT'];
MtUtil::_d("### [MILEAGE ???????] ".$_SESSION['mileage']);
                    $_d->sql_commit();
                    $_d->dataEnd2(array("mileage" => $_SESSION['mileage']));
                }
            } else if ($_type == "admin") {
                $search_where = "";

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if ($_model[CHECKED] == "C") {
                    if (isset($_model[USER_ID_LIST])) {
                        $in_str = "";
                        $in_size = sizeof($_model[USER_ID_LIST]);
                        for ($i=0; $i< $in_size; $i++) {
                            $in_str .= "'".trim($_model[USER_ID_LIST][$i])."'";
                            if ($in_size - 1 != $i) $in_str .= ",";
                        }

                        $search_where = "AND USER_ID IN (".$in_str.") ";
                    }
                } else {
                    if ((isset($_model[CONDITION]) && $_model[CONDITION] != "") && (isset($_model[KEYWORD]) && $_model[KEYWORD] != "")) {
                        if ($_model[CONDITION][value] == "USER_NM" || $_model[CONDITION][value] == "USER_ID" || $_model[CONDITION][value] == "NICK_NM") {
                            $arr_keywords = explode(",", $_model[KEYWORD]);
                            $in_condition = "";
                            for ($i=0; $i< sizeof($arr_keywords); $i++) {
                                $in_condition .= "'".trim($arr_keywords[$i])."'";
                                if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                            }

                            $search_where .= "AND ".$_model[CONDITION][value]." IN (".$in_condition.") ";
                        } else if ($_model[CONDITION][value] == "PHONE") {
                            $search_where .= "AND ( PHONE_1 LIKE '%".$_model[KEYWORD]."%' OR PHONE_2 LIKE '%".$_model[KEYWORD]."%' ) ";
                        } else {
                            $search_where .= "AND ".$_model[CONDITION][value]." LIKE '%".$_model[KEYWORD]."%' ";
                        }
                    }
                    if (isset($_model[TYPE]) && $_model[TYPE] != "") {

                        $in_type = "";
                        for ($i=0; $i< count($_model[TYPE]); $i++) {
                            $in_type .= "'".$_model[TYPE][$i]."'";
                            if (count($_model[TYPE]) - 1 != $i) $in_type .= ",";
                        }

                        $search_where .= "AND USER_GB IN (".$in_type.") ";
                    }
                    if (isset($_model[STATUS]) && $_model[STATUS] != "" && $_model[STATUS][value] != "A") {
                        $search_where .= "AND USER_ST  = '".$_model[STATUS][value]."' ";
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
                    $sql = "INSERT INTO ANGE_USER_MILEAGE
                        (
                            USER_ID,
                            EARN_DT,
                            MILEAGE_NO,
                            EARN_GB,
                            PLACE_GB,
                            POINT,
                            REASON
                        ) VALUES (
                            '".$row[USER_ID]."'
                            , SYSDATE()
                            , '999'
                            , '".$_model[EARN_GB]."'
                            , '".$_model[PLACE_GB]."'
                            , '".$_model[POINT]."'
                            , '".$_model[REASON]."'
                        )";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    // ANGE_MILEAGE_STATUS
                    $sql = "SELECT
                                SUM_POINT, REMAIN_POINT
                            FROM
                                COM_USER
                            WHERE
                                USER_ID = '".$row[USER_ID]."'";

                    $mileage_result = $_d->sql_query($sql);
                    $mileage_data = $_d->sql_fetch_array($mileage_result);

                    $sum_point = $mileage_data[SUM_POINT] + $_model[POINT];
                    $remain_point = $mileage_data[REMAIN_POINT] + $_model[POINT];

                    $sql = "UPDATE
                                COM_USER
                            SET
                                SUM_POINT = ".$sum_point."
                                ,REMAIN_POINT = ".$remain_point."
                            WHERE
                                USER_ID = '".$row[USER_ID]."'";

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

            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if($type == 'item'){
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
/*
                // ANGE_MILEAGE_STATUS
                $sql = "UPDATE COM_USER SET
                                SUM_POINT = ".$_model[SUM_POINT]."
                                ,USE_POINT = ".$_model[USE_POINT]."
                                ,REMAIN_POINT = ".$_model[REMAIN_POINT]."
                         WHERE USER_ID = '".$_SESSION['uid']."'";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;
*/
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            }else if($_type == 'mileageitemplus'){

                $sql = "UPDATE COM_USER SET
                                SUM_POINT = USE_POINT + ".$_model[REMAIN_POINT]."
                                ,REMAIN_POINT = ".$_model[REMAIN_POINT]."
                         WHERE USER_ID = '".$_SESSION['uid']."'";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            }else if($_type == 'mileageitemminus'){

                $sql = "UPDATE COM_USER SET
                                SUM_POINT = SUM_POINT - ".$_model[REMAIN_POINT]."
                                ,REMAIN_POINT = REMAIN_POINT - ".$_model[REMAIN_POINT]."
                         WHERE USER_ID = '".$_SESSION['uid']."'";

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