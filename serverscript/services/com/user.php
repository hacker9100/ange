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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {
                $search_where = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.PHONE_1, U.PHONE_2, U.EMAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                            UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID) AS ROLE_NM
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
                    $sort_order .= "ORDER BY ".$_search[SORT][value]." ".$_search[ORDER][value]." ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, INTRO, NOTE,
                            PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SNS_FL, EN_PHONE_FL,
                            ROLE_ID, ROLE_NM
                        FROM
                        (
                            SELECT
                                U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                                U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_DT, U.CENTER_OUT_DT, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SNS_FL, U.EN_PHONE_FL,
                                UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID) AS ROLE_NM
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
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $password = $_model[USER_ID];
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
                        PREGNENT_FL,
                        BLOG_FL,
                        JOIN_PATH,
                        CONTACT_ID,
                        CARE_CENTER,
                        CENTER_VISIT_DT,
                        CENTER_OUT_DT,
                        EN_FL,
                        EN_EMAIL_FL,
                        EN_POST_FL,
                        EN_SNS_FL,
                        EN_PHONE_FL,
                        REG_DT
                    ) VALUES (
                        '".$_model[USER_ID]."',
                        '".$_model[USER_NM]."',
                        '".$_model[NICK_NM]."',
                        '".$hash."',
                        '".$_model[ZIP_CODE]."',
                        '".$_model[ADDR]."',
                        '".$_model[ADDR_DETAIL]."',
                        '".$_model[PHONE_1]."',
                        '".$_model[PHONE_2]."',
                        '".$_model[USER_GB][value]."',
                        'N',
                        '".$_model[EMAIL]."',
                        '".$_model[SEX_GB]."',
                        '".$_model[INTRO]."',
                        '".$_model[NOTE]."',
                        '".$_model[PREGNENT_FL]."',
                        '".$_model[BLOG_FL]."',
                        '".$_model[JOIN_PATH]."',
                        '".$_model[CONTACT_ID]."',
                        '".$_model[CARE_CENTER]."',
                        '".$_model[CENTER_VISIT_DT]."',
                        '".$_model[CENTER_OUT_DT]."',
                        '".$_model[EN_FL]."',
                        '".$_model[EN_EMAIL_FL]."',
                        '".$_model[EN_POST_FL]."',
                        '".$_model[EN_SNS_FL]."',
                        '".$_model[EN_PHONE_FL]."',
                        SYSDATE()
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
                            ,'".$e[BABY_YEAR].(strlen($e[BABY_MONTH]) == 1 ? '0'+$e[BABY_MONTH] : $e[BABY_MONTH]).(strlen($e[BABY_DAY]) == 1 ? '0'+$e[BABY_DAY] : $e[BABY_DAY])."'
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
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

//            $FORM = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

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
                        ZIP_CODE = '".$_model[ZIP_CODE]."',
                        ADDR = '".$_model[ADDR]."',
                        ADDR_DETAIL = '".$_model[ADDR_DETAIL]."',
                        PHONE_1 = '".$_model[PHONE_1]."',
                        PHONE_2 = '".$_model[PHONE_2]."',
                        USER_GB = '".$_model[USER_GB]."',
                        USER_ST = '".$_model[USER_ST]."',
                        EMAIL = '".$_model[EMAIL]."',
                        SEX_GB = '".$_model[SEX_GB]."',
                        INTRO = '".$_model[INTRO]."',
                        NOTE = '".$_model[NOTE]."',
                        PREGNENT_FL = '".$_model[PREGNENT_FL]."',
                        BLOG_FL = '".$_model[BLOG_FL]."',
                        JOIN_PATH = '".$_model[JOIN_PATH]."',
                        CONTACT_ID = '".$_model[CONTACT_ID]."',
                        CARE_CENTER = '".$_model[CARE_CENTER]."',
                        CENTER_VISIT_DT = '".$_model[CENTER_VISIT_DT]."',
                        CENTER_OUT_DT = '".$_model[CENTER_OUT_DT]."',
                        EN_FL = '".$_model[EN_FL]."',
                        EN_EMAIL_FL = '".$_model[EN_EMAIL_FL]."',
                        EN_POST_FL = '".$_model[EN_POST_FL]."',
                        EN_SNS_FL = '".$_model[EN_SNS_FL]."',
                        EN_PHONE_FL = '".$_model[EN_PHONE_FL]."'
                    WHERE
                        USER_ID = '".$_key."'
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

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