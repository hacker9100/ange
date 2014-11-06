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
                            M.MENU_ID, M.ROLE_ID, M.MENU_FL, M.LIST_FL, M.VIEW_FL, M.EDIT_FL, M.MODIFY_FL
                        FROM
                            CMS_ROLE R, MENU_ROLE M
                        WHERE
                            R.ROLE_ID = '".$_key."'
                            AND R.ROLE_ID = M.ROLE_ID;
                        ";

                $_d->dataEnd($sql);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
            } else {
                if (isset($_search[ROLE]) && $_search[ROLE] != "") {
                    $sql = "SELECT
                                ROLE_ID, ROLE_NM, ROLE_GB
                            FROM
                                CMS_ROLE
                            ";
                } else {
                    $sql = "SELECT
                                TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                                NO, YEAR, MONTH, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST
                            FROM
                            (
                                SELECT
                                    NO, YEAR, MONTH, SUBJECT, REG_UID, REG_NM, REG_DT, PROJECT_ST
                                FROM
                                    CMS_PROJECT
                                ORDER BY REG_DT DESC
                            ) AS DATA,
                            (SELECT @RNUM := 0) R,
                            (
                                SELECT
                                    COUNT(*) AS TOTAL_COUNT
                                FROM
                                    CMS_PROJECT
                            ) CNT
                            ";
                }

                $_d->dataEnd($sql);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_
                    (
                    ) VALUES (
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $form = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $_d->sql_beginTransaction();

            if (count($_model) > 0) {
                $permissions = $_model;

                for ($i = 0 ; $i < count($_model); $i++) {
                    $permission = $permissions[$i];

                    $sql = "UPDATE MENU_ROLE
                            SET
                                MENU_FL = '".( $permission[MENU_FL] != null ? $permission[MENU_FL] : null )."'
                                ,LIST_FL = '".( $permission[LIST_FL] != null ? $permission[LIST_FL] : null )."'
                                ,VIEW_FL = '".( $permission[VIEW_FL] != null ? $permission[VIEW_FL] : null )."'
                                ,EDIT_FL = '".( $permission[EDIT_FL] != null ? $permission[EDIT_FL] : null )."'
                                ,MODIFY_FL = '".( $permission[MODIFY_FL] != null ? $permission[MODIFY_FL] : null )."'
                            WHERE
                                MENU_ID = '".$permission[MENU_ID]."'
                                AND ROLE_ID = '".$permission[ROLE_ID]."'
                    ";

                    $_d->sql_query($sql);
                    $no = $_d->mysql_insert_id;
                }
            }

            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_PROJECT WHERE NO = ".$_key;

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