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
            if (isset($_id)) {
                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.PHONE, U.EMAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.NOTE,
                            R.ROLE_ID, (SELECT ROLE_NM FROM CMS_ROLE WHERE ROLE_ID = R.ROLE_ID) AS ROLE_NM
                        FROM
                            CMS_USER U, USER_ROLE R
                        WHERE
                            U.USER_ID = R.USER_ID
                            AND U.USER_ID = '".$_id."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            R.ROLE_ID, R.ROLE_GB, ROLE_NM
                        FROM
                            USER_ROLE U, CMS_ROLE R
                        WHERE
                            U.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$_id."'
                        ";

//                $role_data = $_d->getData($sql);
                $result = $_d->sql_query($sql);
                $role_data  = $_d->sql_fetch_array($result);

                $data['ROLE'] = $role_data;

                $_d->dataEnd2($data);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
            } else {
                $where_search = "";

                if (isset($_search[ROLE])) {
                    $where_search .= "AND R.ROLE_ID  = '".$_search[ROLE][ROLE_ID]."' ";
                }
                if (isset($_search[KEYWORD])) {
                    $where_search .= "AND U.USER_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            USER_ID, USER_NM, PHONE, EMAIL, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, NOTE,
                            ROLE_ID, ROLE_NM
                        FROM
                        (
                            SELECT
                                U.USER_ID, U.USER_NM, U.PHONE, U.EMAIL, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.NOTE,
                                R.ROLE_ID, (SELECT ROLE_NM FROM CMS_ROLE WHERE ROLE_ID = R.ROLE_ID) AS ROLE_NM
                            FROM
                              CMS_USER U, USER_ROLE R
                            WHERE
                                U.USER_ID = R.USER_ID
                                ".$where_search."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_PROJECT
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
            $form = json_decode(file_get_contents("php://input"),true);
/*
            $upload_path = '../upload/';
            $source_path = '../../../';

            if (count($form[FILES]) > 0) {
                $files = $form[FILES];

//                @mkdir('$source_path');

                for ($i = 0 ; $i < count($form[FILES]); $i++) {
                    $file = $files[$i];

                    if (file_exists($upload_path.$file[name])) {
                        rename($upload_path.$file[name], $source_path.$file[name]);
                    }
                }
            }
*/
            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_USER
                    (
                        USER_ID,
                        USER_NM,
                        PASSWORD,
                        PHONE,
                        EMAIL,
                        NOTE,
                        REG_DT
                    ) VALUES (
                        '".$form[USER_ID]."'
                        , '".$form[USER_NM]."'
                        , '".$form[PASSWORD]."'
                        , '".$form[PHONE]."'
                        , '".$form[EMAIL]."'
                        , '".$form[NOTE]."'
                        , SYSDATE()
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (isset($_search[ROLE])) {
                $sql = "INSERT INTO USER_ROLE
                    (
                        ROLE_ID
                        ,USER_ID
                        ,REG_DT
                    ) VALUES (
                        '".$_search[ROLE][ROLE_ID]."'
                        , '".$no."'
                        , SYSDATE()
                    )";

                $_d->sql_query($sql);
            }



            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_id)) {
                $_d->failEnd("수정실패입니다:"."ID가 누락되었습니다.");
            }

            $FORM = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $sql = "UPDATE CMS_USER
                    SET
                        USER_ID = '".$FORM[USER_ID]."'
                        ,USER_NM = '".$FORM[USER_NM]."'
                        ,PHONE = '".$FORM[PHONE]."'
                        ,EMAIL = '".$FORM[EMAIL]."'
                        ,NOTE = '".$FORM[NOTE]."'
                    WHERE
                        USER_ID = '".$_id."'
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (isset($_search[ROLE])) {
                $sql = "UPDATE USER_ROLE
                        SET
                            ROLE_ID = '".$_search[ROLE][ROLE_ID]."'
                            ,REG_DT = SYSDATE()
                        WHERE
                            USER_ID = '".$no."'
                        ";

                $_d->sql_query($sql);
            }

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_USER WHERE USER_ID = ".$_id;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;
    }
?>