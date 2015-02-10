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
	include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/services/passwordHash.php");

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

    switch ($_method) {
        case "GET":
            if ($_type == 'session') {
                session_start();

                $session_cnt = is_array($_SESSION['uid']) ? count($_SESSION['uid']) : 0;
                MtUtil::_d("################################### [count] ".count($_SESSION['uid']));
                MtUtil::_d("################################### [count] ".count($_SESSION['count']));
                MtUtil::_d("################################### [count] ".count($_SESSION));
                MtUtil::_d("################################### [count] ".is_array($_SESSION['count']));
                MtUtil::_d("################################### [count] ".is_array($_SESSION));
                MtUtil::_d("################################### [count] ".$_SESSION['count']);
                MtUtil::_d("################################### [count] ".$_SESSION['uid']);
                $_d->dataEnd2($session_cnt);
            } else if ($_type == 'check') {
                $sql = "SELECT
                            COUNT(*) AS COUNT
                        FROM
                            COM_USER
                        WHERE
                            USER_ID = '".$_key."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'cert') {
                $sql = "SELECT
                            CERT_GB, CERT_DT, CERT_HASH
                        FROM
                            COM_USER
                        WHERE
                            USER_ID = '".$_key."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'nick') {
            $sql = "SELECT
                        COUNT(*) AS COUNT
                    FROM
                        COM_USER
                    WHERE
                        NICK_NM = '".$_key."'
                    ";

            $result = $_d->sql_query($sql);
            $data  = $_d->sql_fetch_array($result);

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
        } else if ($_type == 'item') {
                $search_where = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                $sql = "SELECT
                            U.NO, U.USER_ID, U.USER_NM, U.NICK_NM, U.LUNAR_FL, U.BIRTH, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_GB, U.USER_ST,
                            U.REG_DT, U.FINAL_LOGIN_DT, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_YMD, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_YMD,
                            U.INTRO, U.NOTE, U.MARRIED_FL, U.PREGNENT_FL, U.BABY_BIRTH_DT, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_YMD, U.CENTER_OUT_YMD,
                            U.EN_ANGE_EMAIL_FL, U.EN_ANGE_SMS_FL, U.EN_ALARM_EMAIL_FL, U.EN_ALARM_SMS_FL, U.EN_STORE_EMAIL_FL, U.EN_STORE_SMS_FL,
                            UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID AND SYSTEM_GB  = '".$_search[SYSTEM_GB]."') AS ROLE_NM
                        FROM
                            COM_USER U, USER_ROLE UR, COM_ROLE R
                        WHERE
                            U.USER_ID = UR.USER_ID
                            AND UR.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$_key."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            R.ROLE_ID, R.ROLE_NM, R.ROLE_GB
                        FROM
                            USER_ROLE U, COM_ROLE R
                        WHERE
                            U.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$_key."'
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $role_data  = $_d->sql_fetch_array($result);

                $data['ROLE'] = $role_data;

                if (isset($_search[DETAIL])) {
                    $sql = "SELECT
                                SUM_POINT, USE_POINT, REMAIN_POINT
                            FROM
                                ANGE_MILEAGE_STATUS
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $mileage_result = $_d->sql_query($sql);
                    $mileage_data  = $_d->sql_fetch_array($mileage_result);
                    $data['MILEAGE'] = $mileage_data;

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_USER U, FILE F, CONTENT_SOURCE S
                            WHERE
                                U.NO = S.TARGET_NO
                                AND F.NO = S.SOURCE_NO
                                AND S.CONTENT_GB = 'FILE'
                                AND S.TARGET_GB = 'USER'
                                AND U.USER_ID = '".$_key."'
                                AND F.FILE_GB = 'THUMB'
                            ";

                    $file_result = $_d->sql_query($sql);
                    $file_data = $_d->sql_fetch_array($file_result);
                    $data['FILE'] = $file_data;

                    $sql = "SELECT
                                BABY_NM, BABY_BIRTH, BABY_SEX_GB, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT
                            FROM
                                ANGE_USER_BABY
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $baby_data = $_d->getData($sql);
                    $data['BABY'] = $baby_data;

                    $sql = "SELECT
                                BLOG_GB, BLOG_URL, PHASE, THEME, NEIGHBOR_CNT, POST_CNT, VISIT_CNT, SNS
                            FROM
                                ANGE_USER_BLOG
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $blog_result = $_d->sql_query($sql);
                    $blog_data  = $_d->sql_fetch_array($blog_result);
                    $data['BLOG'] = $blog_data;
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_where = "";
                $sort_order = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                if ((isset($_search[CONDITION]) && $_search[CONDITION] != "") && (isset($_search[KEYWORD]) && $_search[KEYWORD] != "")) {
                    if ($_search[CONDITION][value] == "USER_NM" || $_search[CONDITION][value] == "USER_ID" || $_search[CONDITION][value] == "NICK_NM") {
                        $arr_keywords = explode(",", $_search[KEYWORD]);
                        $in_condition = "";
                        for ($i=0; $i< sizeof($arr_keywords); $i++) {
                            $in_condition .= "'".trim($arr_keywords[$i])."'";
                            if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                        }
//                        foreach ($keywords as $e) {
//                            $in_condition .= trim($e).",";
//                        }

                        $search_where .= "AND U.".$_search[CONDITION][value]." IN (".$in_condition.") ";
                    } else if ($_search[CONDITION][value] == "PHONE") {
                        $search_where .= "AND ( U.PHONE_1 LIKE '%".$_search[KEYWORD]."%' OR U.PHONE_2 LIKE '%".$_search[KEYWORD]."%' ) ";
                    } else {
                        $search_where .= "AND U.".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
                    }
                }
                if (isset($_search[TYPE]) && $_search[TYPE] != "") {

                    $in_type = "";
                    for ($i=0; $i< count($_search[TYPE]); $i++) {
                        $in_type .= "'".$_search[TYPE][$i]."'";
                        if (count($_search[TYPE]) - 1 != $i) $in_type .= ",";
                    }

                    $search_where .= "AND U.USER_GB IN (".$in_type.") ";
                }
                if (isset($_search[STATUS]) && $_search[STATUS] != "" && $_search[STATUS][value] != "A") {
                    $search_where .= "AND U.USER_ST  = '".$_search[STATUS][value]."' ";
                }

                if (isset($_search[JOIN_PATH]) && $_search[JOIN_PATH] != "") {
                    $search_where .= "AND U.JOIN_PATH  = '".$_search[JOIN_PATH]."' ";
                }
                if (isset($_search[ROLE]) && $_search[ROLE] != "") {
                    $search_where .= "AND R.ROLE_ID  = '".$_search[ROLE][ROLE_ID]."' ";
                }
                if (isset($_search[ROLE_ID]) && $_search[ROLE_ID] != "") {
                    $arr_roles = explode(",", $_search[ROLE_ID]);
                    $in_role = "";
                    for ($i=0; $i< sizeof($arr_roles); $i++) {
                        $in_role .= "'".trim($arr_roles[$i])."'";
                        if (sizeof($arr_roles) - 1 != $i) $in_role .= ",";
                    }

                    $search_where .= "AND R.ROLE_ID  IN (".$in_role.") ";
                }
                if (!isset($_search[CONDITION]) && isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND U.USER_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, INTRO, NOTE,
                            PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SMS_FL, EN_PHONE_FL,
                            ROLE_ID, ROLE_NM
                        FROM
                        (
                            SELECT
                                U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                                U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_DT, U.CENTER_OUT_DT, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SMS_FL, U.EN_PHONE_FL,
                                UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID AND SYSTEM_GB  = '".$_search[SYSTEM_GB]."') AS ROLE_NM
                            FROM
                                COM_USER U, USER_ROLE UR, COM_ROLE R
                            WHERE
                                U.USER_ID = UR.USER_ID
                                AND UR.ROLE_ID = R.ROLE_ID
                                ".$search_where."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                COM_USER U, USER_ROLE UR, COM_ROLE R
                            WHERE
                                U.USER_ID = UR.USER_ID
                                AND UR.ROLE_ID = R.ROLE_ID
                                ".$search_where."
                        ) CNT
                        $sort_order
                        ";
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'admin') {
                $search_from = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_page)) {
                    $limit = "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                if (isset($_search['SYSTEM_GB']) && $_search['SYSTEM_GB'] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search['SYSTEM_GB']."' ";
                }

                if ((isset($_search['CONDITION']) && $_search['CONDITION']['index'] < 6) && (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "")) {
                    if ($_search['CONDITION']['value'] == "USER_NM" || $_search['CONDITION']['value'] == "USER_ID" || $_search['CONDITION']['value'] == "NICK_NM") {
                        $arr_keywords = explode(",", $_search['KEYWORD']);
                        $in_condition = "";
                        for ($i=0; $i< sizeof($arr_keywords); $i++) {
                            $in_condition .= "'".trim($arr_keywords[$i])."'";
                            if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                        }

                        $search_where .= "AND U.".$_search['CONDITION']['value']." IN (".$in_condition.") ";
                    } else if ($_search['CONDITION']['value'] == "PHONE") {
                        $search_where .= "AND ( U.PHONE_1 LIKE '%".$_search['KEYWORD']."%' OR U.PHONE_2 LIKE '%".$_search['KEYWORD']."%' ) ";
                    } else {
                        $search_where .= "AND U.".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%' ";
                    }
                } else if ((isset($_search['CONDITION']) && $_search['CONDITION']['index'] >= 6) && (isset($_search['START_YMD']) && isset($_search['END_YMD']))) {
                    $search_where .= "AND DATE_FORMAT(U.".$_search['CONDITION']['value'].", '%Y-%m-%d') BETWEEN '".$_search['START_YMD']."' AND '".$_search['END_YMD']."'";
                }

                if (isset($_search['TYPE']) && $_search['TYPE'] != "") {

                    $in_type = "";
                    for ($i=0; $i< count($_search['TYPE']); $i++) {
                        $in_type .= "'".$_search['TYPE'][$i]."'";
                        if (count($_search['TYPE']) - 1 != $i) $in_type .= ",";
                    }

                    $search_where .= "AND U.USER_GB IN (".$in_type.") ";
                }
                if (isset($_search['STATUS']) && $_search['STATUS'] != "" && $_search['STATUS']['value'] != "A") {
                    $search_where .= "AND U.USER_ST  = '".$_search['STATUS']['value']."' ";
                }

                if (isset($_search['JOIN_PATH']) && $_search['JOIN_PATH'] != "") {
                    $search_where .= "AND U.JOIN_PATH  = '".$_search['JOIN_PATH']."' ";
                }
                if (isset($_search['ROLE']) && $_search['ROLE'] != "") {
                    $search_where .= "AND R.ROLE_ID  = '".$_search['ROLE']['ROLE_ID']."' ";
                }
                if (isset($_search['ROLE_ID']) && $_search['ROLE_ID'] != "") {
                    $arr_roles = explode(",", $_search['ROLE_ID']);
                    $in_role = "";
                    for ($i=0; $i< sizeof($arr_roles); $i++) {
                        $in_role .= "'".trim($arr_roles[$i])."'";
                        if (sizeof($arr_roles) - 1 != $i) $in_role .= ",";
                    }

                    $search_where .= "AND R.ROLE_ID  IN (".$in_role.") ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']['value']." ".$_search['ORDER']['value']." ";
                }

                if (isset($_search['ADMIN_SAVE_LIST']) && $_search['ADMIN_SAVE_LIST'] != "") {
                    $search_from = "INNER JOIN ADMIN_SAVE_USER SU ON U.USER_ID = SU.USER_ID AND SU.LIST_NO = ".$_search['ADMIN_SAVE_LIST']['NO'];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, INTRO, NOTE,
                            MARRIED_FL, PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SMS_FL, EN_PHONE_FL,
                            ROLE_ID, ROLE_NM, SUM_POINT, USE_POINT, REMAIN_POINT, BLOG_GB, BLOG_URL, PHASE, THEME, NEIGHBOR_CNT, POST_CNT, VISIT_CNT, SNS,
                            (SELECT COUNT(1) FROM ANGE_USER_BABY UB WHERE UB.USER_ID = DATA.USER_ID) AS BABY_CNT,
                            (SELECT COUNT(1) FROM COM_BOARD CB WHERE CB.REG_UID = DATA.USER_ID) AS BOARD_CNT,
                            (SELECT COUNT(1) FROM COM_REPLY CR WHERE CR.REG_UID = DATA.USER_ID) AS REPLY_CNT,
                            (SELECT COUNT(1) FROM ANGE_COMP AC WHERE AC.USER_ID = DATA.USER_ID AND TARGET_GB = 'EXPERIENCE') AS EXPERIENCE_COMP_CNT,
                            (SELECT COUNT(1) FROM ANGE_COMP AC WHERE AC.USER_ID = DATA.USER_ID AND TARGET_GB = 'EVENT') AS EVENT_COMP_CNT,
                            (SELECT COUNT(1) FROM ANGE_COMP_WINNER AW WHERE AW.USER_ID = DATA.USER_ID AND TARGET_GB = 'EXPERIENCE') AS EXPERIENCE_WINNER_CNT,
                            (SELECT COUNT(1) FROM ANGE_COMP_WINNER AW WHERE AW.USER_ID = DATA.USER_ID AND TARGET_GB = 'EVENT') AS EVENT_WINNER_CNT,
                            (SELECT COUNT(1) FROM ANGE_REVIEW AR WHERE AR.REG_UID = DATA.USER_ID) AS REVIEW_CNT,
                            (SELECT COUNT(1) FROM ANGE_LIKE AL WHERE AL.REG_UID = DATA.USER_ID) AS LIKE_CNT
                        FROM
                        (
                            SELECT
                                U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                                U.MARRIED_FL, U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_DT, U.CENTER_OUT_DT, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SMS_FL, U.EN_PHONE_FL,
                                UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID AND SYSTEM_GB  = '".$_search[SYSTEM_GB]."') AS ROLE_NM,
                                M.SUM_POINT, M.USE_POINT, M.REMAIN_POINT,
                                B.BLOG_GB, B.BLOG_URL, B.PHASE, B.THEME, B.NEIGHBOR_CNT, B.POST_CNT, B.VISIT_CNT, B.SNS
                            FROM
                                COM_USER U
                                INNER JOIN USER_ROLE UR ON U.USER_ID = UR.USER_ID
                                INNER JOIN COM_ROLE R ON UR.ROLE_ID = R.ROLE_ID
                                LEFT OUTER JOIN ANGE_MILEAGE_STATUS M ON U.USER_ID = M.USER_ID
                                LEFT OUTER JOIN ANGE_USER_BLOG B ON U.USER_ID = B.USER_ID
                                ".$search_from."
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
                                COM_USER U
                                INNER JOIN USER_ROLE UR ON U.USER_ID = UR.USER_ID
                                INNER JOIN COM_ROLE R ON UR.ROLE_ID = R.ROLE_ID
                                ".$search_from."
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) CNT
                        ";
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'statistics') {
                $search_where = "";
                $sort_order = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                if (isset($_search[START_DT]) && $_search[START_DT] != "") {
                    $search_where .= "AND CU.REG_DT BETWEEN '".$_search[START_DT]."-01' AND DATE_ADD('".$_search[START_DT]."-01', interval ".$_search[PERIOD]." month)  ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                $sql = "# N : NORMAL, P : POOR, D : DORMANCY, S : SECESSION, W : WAITING
                        SELECT
                            REG_YM,
                            SUM(1) AS TOTAL_CNT,
                            SUM(IF(USER_ST = 'N', 1, 0)) AS NORMAL_CNT,
                            SUM(IF(USER_ST = 'P', 1, 0)) AS POOR_CNT,
                            SUM(IF(USER_ST = 'D', 1, 0)) AS DORMANCY_CNT,
                            SUM(IF(USER_ST = 'S', 1, 0)) AS SECESSION_CNT,
                            SUM(IF(USER_ST = 'S' AND ROLE_ID = 'CLUB', 1, 0)) AS CLUB_CNT,
                            SUM(IF(USER_ST = 'W', 1, 0)) AS WAITING_CNT
                        FROM
                        (
                            SELECT
                                CU.USER_ID, CU.USER_ST, DATE_FORMAT(CU.REG_DT, '%Y-%m') AS REG_YM, DATE_FORMAT(CU.FINAL_LOGIN_DT, '%Y-%m') AS FINAL_LOGIN_YM,
                                CR.ROLE_ID
                            FROM
                                COM_USER CU, USER_ROLE UR, COM_ROLE CR
                            WHERE
                                CU.USER_ID = UR.USER_ID
                                AND UR.ROLE_ID = CR.ROLE_ID
                                AND CR.SYSTEM_GB = 'ANGE'
                                ".$search_where."
                        ) AS DATA
                        GROUP BY REG_YM
                        ORDER BY REG_YM ASC
                        $sort_order
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $sql = "# N : NORMAL, P : POOR, D : DORMANCY, S : SECESSION, W : WAITING
                            SELECT
                                SUM(1) AS TOTAL_CNT
                            FROM
                            (
                                SELECT
                                    CU.USER_ID, CU.USER_ST, DATE_FORMAT(CU.REG_DT, '%Y-%m') AS REG_YM, DATE_FORMAT(CU.FINAL_LOGIN_DT, '%Y-%m') AS FINAL_LOGIN_YM,
                                    CR.ROLE_ID
                                FROM
                                    COM_USER CU, USER_ROLE UR, COM_ROLE CR
                                WHERE
                                    CU.USER_ID = UR.USER_ID
                                  AND UR.ROLE_ID = CR.ROLE_ID
                                  AND CR.SYSTEM_GB = 'ANGE'
                                    AND CU.REG_DT <= DATE_ADD('".$row[REG_YM]."-01', interval 1 month)
                            ) AS DATA
                            ";

                    $menu_data = $_d->getData($sql);
                    $row['DETAIL'] = $menu_data;
                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ($_type == 'item') {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/user/'.$_model[USER_ID].'/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model[FILE]) > 0) {
                        $file = $_model[FILE];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        if (file_exists($upload_path.$file[name])) {
                            $uid = uniqid();
                            rename($upload_path.$file[name], $source_path.$uid);
                            $insert_path = array(path => $file_path, uid => $uid, kind => $file[kind]);
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $password = "";

                if (isset($_model[PASSWORD]) && $_model[PASSWORD] != "") {
                    $password = $_model[PASSWORD];
                } else {
                    $password = $_model[USER_ID];
                }
    //            $iterations = 1000;
    //
    //            // Generate a random IV using mcrypt_create_iv(),
    //            // openssl_random_pseudo_bytes() or another suitable source of randomness
    //            $salt = mcrypt_create_iv(16, MCRYPT_DEV_URANDOM);
    //
    //            $hash = hash_pbkdf2("sha256", $password, $salt, $iterations, 20);

                $hash = create_hash($password);

                $sql = "INSERT INTO COM_USER
                        (
                            USER_ID,
                            USER_NM,
                            NICK_NM,
                            PASSWORD,
                            LUNAR_FL,
                            BIRTH,
                            ZIP_CODE,
                            ADDR,
                            ADDR_DETAIL,
                            PHONE_1,
                            PHONE_2,
                            USER_GB,
                            USER_ST,
                            EMAIL,
                            SEX_GB,
                            INTRO,
                            NOTE,
                            MARRIED_FL,
                            PREGNENT_FL,
                            BLOG_FL,
                            JOIN_PATH,
                            CONTACT_ID,
                            CARE_CENTER,
                            CENTER_VISIT_DT,
                            CENTER_OUT_DT,
                            EN_FL,
    #                        EN_EMAIL_FL,
    #                        EN_POST_FL,
    #                        EN_SMS_FL,
    #                        EN_PHONE_FL,
                            EN_ANGE_EMAIL_FL,
                            EN_ANGE_SMS_FL,
                            EN_ALARM_EMAIL_FL,
                            EN_ALARM_SMS_FL,
                            EN_STORE_EMAIL_FL,
                            EN_STORE_SMS_FL,
                            REG_DT,
                            CERT_GB,
                            CERT_DT,
                            CERT_HASH
                        ) VALUES (
                            '".$_model[USER_ID]."',
                            '".$_model[USER_NM]."',
                            '".$_model[NICK_NM]."',
                            '".$hash."',
                            '".$_model[LUNAR_FL]."',
                            '".$_model[BIRTH]."',
                            '".$_model[ZIP_CODE]."',
                            '".$_model[ADDR]."',
                            '".$_model[ADDR_DETAIL]."',
                            '".$_model[PHONE_1]."',
                            '".$_model[PHONE_2]."',
                            '".$_model[USER_GB][value]."',
                            '".((isset($_model[CERT_GB]) && $_model[CERT_GB] == "EMAIL") ? "W" : "N")."',
                            '".$_model[EMAIL]."',
                            '".$_model[SEX_GB]."',
                            '".$_model[INTRO]."',
                            '".$_model[NOTE]."',
                            '".$_model[MARRIED_FL]."',
                            '".$_model[PREGNENT_FL]."',
                            '".$_model[BLOG_FL]."',
                            '".$_model[JOIN_PATH]."',
                            '".$_model[CONTACT_ID]."',
                            '".$_model[CARE_CENTER]."',
                            '".$_model[CENTER_VISIT_DT]."',
                            '".$_model[CENTER_OUT_DT]."',
                            '".$_model[EN_FL]."',
    #                        '".$_model[EN_EMAIL_FL]."',
    #                        '".$_model[EN_POST_FL]."',
    #                        '".$_model[EN_SMS_FL]."',
    #                        '".$_model[EN_PHONE_FL]."',
                            '".( $_model[EN_ANGE_EMAIL_FL] == "true" ? "Y" : "N" )."',
                            '".( $_model[EN_ANGE_SMS_FL] == "true" ? "Y" : "N" )."',
                            '".( $_model[EN_ALARM_EMAIL_FL] == "true" ? "Y" : "N" )."',
                            '".( $_model[EN_ALARM_SMS_FL] == "true" ? "Y" : "N" )."',
                            '".( $_model[EN_STORE_EMAIL_FL] == "true" ? "Y" : "N" )."',
                            '".( $_model[EN_STORE_SMS_FL] == "true" ? "Y" : "N" )."',
                            SYSDATE(),
                            '".$_model[CERT_GB]."',
                            ".((isset($_model[CERT_GB]) && $_model[CERT_GB] == "EMAIL") ? "null" : "SYSDATE()").",
                            'test'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (isset($_model[ROLE]) && $_model[ROLE] != "") {
                    $sql = "INSERT INTO USER_ROLE
                        (
                            ROLE_ID
                            ,USER_ID
                            ,REG_DT
                        ) VALUES (
                            '".$_model[ROLE][ROLE_ID]."'
                            ,'".$_model[USER_ID]."'
                            ,SYSDATE()
                        )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                } else {
                    $sql = "INSERT INTO USER_ROLE
                        (
                            ROLE_ID
                            ,USER_ID
                            ,REG_DT
                        ) VALUES (
                            'MEMBER'
                            ,'".$_model[USER_ID]."'
                            ,SYSDATE()
                        )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                if (isset($_model[FILE]) && $_model[FILE] != "") {
                    $file = $_model[FILE];

                    $sql = "INSERT INTO FILE
                            (
                                FILE_NM
                                ,FILE_ID
                                ,PATH
                                ,FILE_EXT
                                ,FILE_SIZE
                                ,THUMB_FL
                                ,REG_DT
                                ,FILE_ST
                                ,FILE_GB
                            ) VALUES (
                                '".$file[name]."'
                                , '".$insert_path[uid]."'
                                , '".$insert_path[path]."'
                                , '".$file[type]."'
                                , '".$file[size]."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".strtoupper($file[kind])."'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO CONTENT_SOURCE
                            (
                                TARGET_NO
                                ,SOURCE_NO
                                ,CONTENT_GB
                                ,TARGET_GB
                                ,SORT_IDX
                            ) VALUES (
                                '".$no."'
                                , '".$file_no."'
                                , 'FILE'
                                , 'USER'
                                , '0'
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                if (isset($_model[BABY]) && $_model[BABY] != "") {
                    foreach ($_model[BABY] as $e) {
                        if (isset($e[BABY_NM]) && $e[BABY_NM] != "") {
                            $sql = "INSERT INTO ANGE_USER_BABY
                                    (
                                        USER_ID
                                        ,BABY_NM
                                        ,BABY_BIRTH
                                        ,BABY_SEX_GB
                                    ) VALUES (
                                        '".$_model[USER_ID]."'
                                        ,'".$e[BABY_NM]."'
                                        ,'".$e[BABY_YEAR].(strlen($e[BABY_MONTH]) == 1 ? "0".$e[BABY_MONTH] : $e[BABY_MONTH]).(strlen($e[BABY_DAY]) == 1 ? "0".$e[BABY_DAY] : $e[BABY_DAY])."'
                                        ,'".$e[BABY_SEX_GB]."'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }

                if (isset($_model[BLOG]) && $_model[BLOG] != "") {
                    if (isset($_model[BLOG][BLOG_URL]) && $_model[BLOG][BLOG_URL] != "") {
                        $sql = "INSERT INTO ANGE_USER_BLOG
                                (
                                    USER_ID
                                    ,BLOG_GB
                                    ,BLOG_URL
                                    ,PHASE
                                    ,THEME
                                    ,NEIGHBOR_CNT
                                    ,POST_CNT
                                    ,VISIT_CNT
                                    ,SNS
                                ) VALUES (
                                    '".$_model[USER_ID]."'
                                    ,'".$_model[BLOG][BLOG_GB]."'
                                    ,'".$_model[BLOG][BLOG_URL]."'
                                    ,'".$_model[BLOG][PHASE]."'
                                    ,'".$_model[BLOG][THEME]."'
                                    ,'".$_model[BLOG][NEIGHBOR_CNT]."'
                                    ,'".$_model[BLOG][POST_CNT]."'
                                    ,'".$_model[BLOG][VISIT_CNT]."'
                                    ,'".$_model[BLOG][SNS]."'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                } else {
                    if(isset($_model[CERT_GB]) && $_model[CERT_GB] == 'EMAIL') {
//                        $to = __SMTP_USR__;
                        $from_email = "angeweb@ange.co.kr";
                        $from_user = "앙쥬";
                        $to = $_model[EMAIL];
                        $to_user = $_model[USER_NM];
                        $headers = "From: hacker9100@gmail.com";
                        $subject = "앙쥬에 오신걸 환영합니다. 이메일을 인증해 주세요.";
                        $message = "안녕하세요. ".$_model[USER_NM]." 회원님.<br>아래 링크를 클릭하면 이메일 인증이 완료됩니다. <a href='".BASE_URL."/serverscript/services/com/user.php?_method=PUT&_type=cert&_key=".$_model[USER_ID]."&_hash=test'>이메일 인증</a><br>테스트로 보냅니다.";

//                        MtUtil::sendMail($to, $subject, $message, $headers);
                        MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user);
                    }

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'response') {
                $sql = "INSERT INTO ANGE_USER_RESPONSE
                                (
                                    USER_ID
                                    ,NOTE
                                    ,REG_DT
                                ) VALUES (
                                    '".$_model[USER_ID]."'
                                    ,'".$_model[NOTE]."'
                                    ,SYSDATE()
                                )";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else if ($_type == 'mail') {
//                $to = __SMTP_USR__;
                $from_email = "angeweb@ange.co.kr";
                $from_user = "앙쥬";
                $to = $_model[EMAIL];
                $to_user = $_model[USER_NM];
                $headers = "From: hacker9100@gmail.com";
                $subject = "앙쥬에 오신걸 환영합니다. 이메일을 인증해 주세요.";
                $message = "안녕하세요. ".$_model[USER_NM]."회원님.<br>아래 링크를 클릭하면 이메일 인증이 완료됩니다. <br><br><a href='".BASE_URL."/serverscript/services/com/user.php?_method=PUT&_type=cert&_key=".$_model[USER_ID]."&_hash=test'>이메일 인증</a><br>테스트로 보냅니다.";

                MtUtil::_d("------------>>>>> mail : ");

//                $return = MtUtil::sendMail($to, $subject, $message, $headers);
                MtUtil::_d("------------>>>>> mail : ".$return);
                $return = MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user);
                $_d->succEnd('');
            }

            break;

        case "PUT":
            if ($_type == 'item') {
                if (!isset($_key) || $_key == '') {
                    $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                }

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/user/'.$_key.'/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model[FILE]) > 0) {
                        $file = $_model[FILE];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        if (file_exists($upload_path.$file[name])) {
                            $uid = uniqid();
                            rename($upload_path.$file[name], $source_path.$uid);
                            $insert_path = array(path => $file_path, uid => $uid, kind => $file[kind]);
                        } else {
                            $insert_path = array(path => '', uid => '', kind => '');
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

    //            $FORM = json_decode(file_get_contents("php://input"),true);
    //            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

                $update_password = "";

                if (isset($_model[PASSWORD]) && $_model[PASSWORD] != "") {
                    $password = $_model[PASSWORD];
                    $hash = create_hash($password);

                    $update_password = "PASSWORD = '".$hash."',";
                }

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_USER
                        SET
                            USER_NM = '".$_model[USER_NM]."',
                            NICK_NM = '".$_model[NICK_NM]."',
                            ".$update_password."
                            LUNAR_FL = '".$_model[LUNAR_FL]."',
                            BIRTH = '".$_model[BIRTH]."',
                            ZIP_CODE = '".$_model[ZIP_CODE]."',
                            ADDR = '".$_model[ADDR]."',
                            ADDR_DETAIL = '".$_model[ADDR_DETAIL]."',
                            PHONE_1 = '".$_model[PHONE_1]."',
                            PHONE_2 = '".$_model[PHONE_2]."',
                            USER_GB = '".$_model[USER_GB][value]."',
                            USER_ST = '".$_model[USER_ST]."',
                            EMAIL = '".$_model[EMAIL]."',
                            SEX_GB = '".$_model[SEX_GB]."',
                            INTRO = '".$_model[INTRO]."',
                            NOTE = '".$_model[NOTE]."',
                            MARRIED_FL = '".$_model[MARRIED_FL]."',
                            PREGNENT_FL = '".$_model[PREGNENT_FL]."',
                            BLOG_FL = '".$_model[BLOG_FL]."',
                            JOIN_PATH = '".$_model[JOIN_PATH]."',
                            CONTACT_ID = '".$_model[CONTACT_ID]."',
                            CARE_CENTER = '".$_model[CARE_CENTER]."',
                            CENTER_VISIT_DT = '".$_model[CENTER_VISIT_DT]."',
                            CENTER_OUT_DT = '".$_model[CENTER_OUT_DT]."',
                            EN_FL = '".$_model[EN_FL]."',
                            EN_ANGE_EMAIL_FL = '".( $_model[EN_ANGE_EMAIL_FL] == "true" ? "Y" : 'N' )."',
                            EN_ANGE_SMS_FL = '".( $_model[EN_ANGE_SMS_FL] == "true" ? "Y" : 'N' )."',
                            EN_ALARM_EMAIL_FL = '".( $_model[EN_ALARM_EMAIL_FL] == "true" ? "Y" : 'N' )."',
                            EN_ALARM_SMS_FL = '".( $_model[EN_ALARM_SMS_FL] == "true" ? "Y" : 'N' )."',
                            EN_STORE_EMAIL_FL = '".( $_model[EN_STORE_EMAIL_FL] == "true" ? "Y" : 'N' )."',
                            EN_STORE_SMS_FL = '".( $_model[EN_STORE_SMS_FL] == "true" ? "Y" : 'N' )."'
                        WHERE
                            USER_ID = '".$_key."'
                        ";

    // 에러가 발생하여 주석처리
    //                        EN_EMAIL_FL = '".$_model[EN_EMAIL_FL]."',
    //                        EN_POST_FL = '".$_model[EN_POST_FL]."',
    //                        EN_SNS_FL = '".$_model[EN_SNS_FL]."',
    //                        EN_PHONE_FL = '".$_model[EN_PHONE_FL]."'
                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_USER U, FILE F, CONTENT_SOURCE S
                        WHERE
                            U.NO = S.TARGET_NO
                            AND F.NO = S.SOURCE_NO
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_GB = 'USER'
                            AND U.USER_ID = '".$_key."'
                            AND F.FILE_GB = 'THUMB'
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $is_delete = true;

                    if (count($_model[FILE]) > 0) {
                        $file = $_model[FILE];
                        if ($row[FILE_NM] == $file[name] && $row[FILE_SIZE] == $file[size]) {
                            $is_delete = false;
                        }
                    }

                    if ($is_delete) {
                        $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                        $_d->sql_query($sql);

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'USER' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                        $_d->sql_query($sql);

                        if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        }
                    }
                }

                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);

                    if ($insert_path[uid] != "") {
                        $sql = "INSERT INTO FILE
                                (
                                    FILE_NM
                                    ,FILE_ID
                                    ,PATH
                                    ,FILE_EXT
                                    ,FILE_SIZE
                                    ,THUMB_FL
                                    ,REG_DT
                                    ,FILE_ST
                                    ,FILE_GB
                                ) VALUES (
                                    '".$file[name]."'
                                    , '".$insert_path[uid]."'
                                    , '".$insert_path[path]."'
                                    , '".$file[type]."'
                                    , '".$file[size]."'
                                    , '0'
                                    , SYSDATE()
                                    , 'C'
                                    , '".strtoupper($file[kind])."'
                                )";

                        $_d->sql_query($sql);
                        $file_no = $_d->mysql_insert_id;

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }

                        $sql = "INSERT INTO CONTENT_SOURCE
                                (
                                    TARGET_NO
                                    ,SOURCE_NO
                                    ,CONTENT_GB
                                    ,TARGET_GB
                                    ,SORT_IDX
                                ) VALUES (
                                    '".$_model[NO]."'
                                    , '".$file_no."'
                                    , 'FILE'
                                    , 'USER'
                                    , '0'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if (isset($_model[BABY]) && $_model[BABY] != "") {
                    $sql = "DELETE FROM ANGE_USER_BABY WHERE USER_ID = '".$_model[USER_ID]."'";

                    $_d->sql_query($sql);

                    foreach ($_model[BABY] as $e) {
                        if (isset($e[BABY_NM]) && $e[BABY_NM] != "") {
                            $sql = "INSERT INTO ANGE_USER_BABY
                                    (
                                        USER_ID
                                        ,BABY_NM
                                        ,BABY_BIRTH
                                        ,BABY_SEX_GB
                                    ) VALUES (
                                        '".$_model[USER_ID]."'
                                        ,'".$e[BABY_NM]."'
                                        ,'".$e[BABY_YEAR].(strlen($e[BABY_MONTH]) == 1 ? "0".$e[BABY_MONTH] : $e[BABY_MONTH]).(strlen($e[BABY_DAY]) == 1 ? "0".$e[BABY_DAY] : $e[BABY_DAY])."'
                                        ,'".$e[BABY_SEX_GB]."'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }

                $sql = "UPDATE ANGE_USER_BLOG
                        SET
                            BLOG_URL = '".$_model[BLOG][BLOG_URL]."'
                            ,PHASE = '".$_model[BLOG][PHASE]."'
                            ,THEME = '".$_model[BLOG][THEME]."'
                            ,NEIGHBOR_CNT = '".$_model[BLOG][NEIGHBOR_CNT]."'
                            ,POST_CNT = '".$_model[BLOG][POST_CNT]."'
                            ,VISIT_CNT = '".$_model[BLOG][VISIT_CNT]."'
                            ,SNS = '".$_model[BLOG][SNS]."'
                        WHERE
                            USER_ID = '".$_key."'
                        ";


                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (isset($_model[ROLE]) && $_model[ROLE] != "") {
                    $sql = "UPDATE USER_ROLE UR, COM_ROLE R
                            SET
                                UR.ROLE_ID = '".$_model[ROLE][ROLE_ID]."',
                                UR.REG_DT = SYSDATE()
                            WHERE
                                UR.ROLE_ID = R.ROLE_ID
                                AND UR.USER_ID = '".$_key."'
                                AND R.SYSTEM_GB = '".$_model[SYSTEM_GB]."'
                            ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "status") {
                $sql = "UPDATE COM_USER
                            SET
                                USER_ST = '".$_model[USER_ST]."'
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else if ($_type == "type") {
                $sql = "UPDATE COM_USER
                            SET
                                USER_GB = '".$_model[USER_GB]."'
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else if ($_type == 'admin') {
                $update_where = "";

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

                        $update_where = "AND USER_ID IN (".$in_str.") ";
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

                            $update_where .= "AND ".$_model[CONDITION][value]." IN (".$in_condition.") ";
                        } else if ($_model[CONDITION][value] == "PHONE") {
                            $update_where .= "AND ( PHONE_1 LIKE '%".$_model[KEYWORD]."%' OR PHONE_2 LIKE '%".$_model[KEYWORD]."%' ) ";
                        } else {
                            $update_where .= "AND ".$_model[CONDITION][value]." LIKE '%".$_model[KEYWORD]."%' ";
                        }
                    }
                    if (isset($_model[TYPE]) && $_model[TYPE] != "") {

                        $in_type = "";
                        for ($i=0; $i< count($_model[TYPE]); $i++) {
                            $in_type .= "'".$_model[TYPE][$i]."'";
                            if (count($_model[TYPE]) - 1 != $i) $in_type .= ",";
                        }

                        $update_where .= "AND USER_GB IN (".$in_type.") ";
                    }
                    if (isset($_model[STATUS]) && $_model[STATUS] != "" && $_model[STATUS][value] != "A") {
                        $update_where .= "AND USER_ST  = '".$_model[STATUS][value]."' ";
                    }
                }

                $sql = "UPDATE COM_USER
                        SET
                            USER_ST = '".$_model[USER_ST]."'
                        WHERE
                            1 = 1
                            ".$update_where."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'cert') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "SELECT
                            CERT_HASH
                        FROM
                            COM_USER
                        WHERE
                            USER_ID = '".$_key."'
                        ";

                $data  = $_d->sql_fetch($sql);

                if ($data[CERT_HASH] != $_hash) {
                    $_d->failEnd("인증실패입니다:".$msg);
                }

                $sql = "UPDATE COM_USER
                        SET
                            USER_ST = 'N',
                            CERT_GB = 'MAIL',
                            CERT_DT = SYSDATE()
                        WHERE
                            USER_ID = '".$_key."'
                        ";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();

                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('인증에 실패했습니다. 다시 인증 후 로그인 하세요.')";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                } else {
                    $_d->sql_commit();

                    ob_end_clean();
//                    header("Location: http://localhost"); /* Redirect browser */
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('인증에 성공했습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";
                    exit();
                }
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM USER_ROLE WHERE USER_ID = '".$_key."'";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM COM_USER WHERE USER_ID = '".$_key."'";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>