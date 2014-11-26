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

    switch ($_method) {
        case "GET":
            if (isset($_key) && $_key != "") {
                $sql = "SELECT
                            MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, DIVIDER_FL, MENU_DESC, TAIL_DESC
                        FROM
                            COM_MENU
                        WHERE
                            MENU_URL = '".$_key."'
                        ORDER BY SORT_IDX ASC
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, API, CSS, SORT_IDX
                        FROM
                            COM_SUB_MENU
                        WHERE
                            MENU_URL = '".$data[MENU_URL]."'
                        ORDER BY SORT_IDX ASC
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

                if (isset($_search[CHANNEL_GB]) && $_search[CHANNEL_GB] != "") {

                    $sql = "SELECT
                                CHANNEL_NO, CHANNEL_URL, CHANNEL_NM, TAG, CHANNEL_GB, DROP_FL, POSITION
                            FROM
                                COM_CHANNEL
                            WHERE
                                CHANNEL_GB  = '".$_search[CHANNEL_GB]."'
                            ORDER BY CHANNEL_NO ASC
                            ";

                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, DIVIDER_FL, MENU_DESC, TAIL_DESC
                                FROM
                                    COM_MENU
                                WHERE
                                    CHANNEL_NO  = '".$row[CHANNEL_NO]."'
                                ORDER BY SORT_IDX ASC
                                ";

                        $menu_data = $_d->getData($sql);
                        $row['MENU_INFO'] = $menu_data;

                        $__trn->rows[$i] = $row;
                    }
                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                } else if (isset($_search[MENU_GB]) && $_search[MENU_GB] != "") {
                    $sql = "SELECT
                                MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, MENU_DESC, TAIL_DESC
                            FROM
                                COM_MENU
                            WHERE
                                MENU_GB  = '".$_search[MENU_GB]."'
                            ORDER BY SORT_IDX ASC
                            ";

                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, API, CSS, SORT_IDX
                                FROM
                                    COM_SUB_MENU
                                WHERE
                                    MENU_URL = '".$row[MENU_URL]."'
                                ORDER BY SORT_IDX ASC
                                ";

                        $sub_menu_data = $_d->getData($sql);
                        $row['SUB_MENU_INFO'] = $sub_menu_data;

                        $__trn->rows[$i] = $row;
                    }
                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                } else {
                    $_d->failEnd("조회실패입니다:");
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

            $sql = "INSERT INTO CMS_USER
                    (
                        USER_ID,
                        USER_NM,
                        USER_ST,
                        PASSWORD,
                        PHONE,
                        EMAIL,
                        NOTE,
                        REG_DT
                    ) VALUES (
                        '".$_model[USER_ID]."'
                        , '".$_model[USER_NM]."'
                        , '0'
                        , '".$hash."'
                        , '".$_model[PHONE]."'
                        , '".$_model[EMAIL]."'
                        , '".$_model[NOTE]."'
                        , SYSDATE()
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