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

    switch ($_method) {
        case "GET":
            if (isset($_key) && $_key != "") {
                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.PHONE, U.EMAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.NOTE,
                            R.ROLE_ID, (SELECT ROLE_NM FROM CMS_ROLE WHERE ROLE_ID = R.ROLE_ID) AS ROLE_NM
                        FROM
                            COM_USER U, USER_ROLE R
                        WHERE
                            U.USER_ID = R.USER_ID
                            AND U.USER_ID = '".$_key."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            R.ROLE_ID, R.ROLE_NM, R.ROLE_GB
                        FROM
                            USER_ROLE U, CMS_ROLE R
                        WHERE
                            U.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$_key."'
                        ";

                $result = $_d->sql_query($sql);
                $role_data  = $_d->sql_fetch_array($result);

                $data['ROLE'] = $role_data;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else {
                $where_search = "";

                if (isset($_search[JOIN_PATH]) && $_search[JOIN_PATH] != "") {
                    $where_search .= "AND U.JOIN_PATH  = '".$_search[JOIN_PATH]."' ";
                }
                if (isset($_search[ROLE]) && $_search[ROLE] != "") {
                    $where_search .= "AND R.ROLE_ID  = '".$_search[ROLE][ROLE_ID]."' ";
                }
                if (isset($_search[ROLE_ID]) && $_search[ROLE_ID] != "") {
                    $where_search .= "AND R.ROLE_ID  = '".$_search[ROLE_ID]."' ";
                }
                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $where_search .= "AND U.USER_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, NOTE,
                            PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SNS_FL, EN_PHONE_FL,
                            ROLE_ID, ROLE_NM
                        FROM
                        (
                            SELECT
                                U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.NOTE,
                                U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_DT, U.CENTER_OUT_DT, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SNS_FL, U.EN_PHONE_FL,
                                R.ROLE_ID, (SELECT ROLE_NM FROM CMS_ROLE WHERE ROLE_ID = R.ROLE_ID) AS ROLE_NM
                            FROM
                              COM_USER U, USER_ROLE R
                            WHERE
                                U.USER_ID = R.USER_ID
                                ".$where_search."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                COM_USER U, USER_ROLE R
                            WHERE
                                U.USER_ID = R.USER_ID
                                ".$where_search."
                        ) CNT
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
                        '".$_model[USER_GB]."',
                        'C',
                        '".$_model[EMAIL]."',
                        '".$_model[SEX_GB]."',
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
                        , '".$_model[USER_ID]."'
                        , SYSDATE()
                    )";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
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

                $update_password = ",PASSWORD = '".$hash."'";
            }

            $_d->sql_beginTransaction();

            $sql = "UPDATE CMS_USER
                    SET
                        USER_NM = '".$_model[USER_NM]."'
                        ".$update_password."
                        ,USER_ST = '".$_model[USER_ST]."'
                        ,PHONE = '".$_model[PHONE]."'
                        ,EMAIL = '".$_model[EMAIL]."'
                        ,NOTE = '".$_model[NOTE]."'
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
                $sql = "UPDATE USER_ROLE
                        SET
                            ROLE_ID = '".$_model[ROLE][ROLE_ID]."'
                            ,REG_DT = SYSDATE()
                        WHERE
                            USER_ID = '".$_key."'
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

            $sql = "DELETE FROM CMS_USER WHERE USER_ID = '".$_key."'";

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