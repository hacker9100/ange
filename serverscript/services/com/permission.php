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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {
                $sql = "SELECT
                            M.MENU_NM, MR.MENU_ID, MR.ROLE_ID, MR.MENU_FL, MR.LIST_FL, MR.VIEW_FL, MR.EDIT_FL, MR.MODIFY_FL
                        FROM
                            COM_ROLE R, MENU_ROLE MR, COM_MENU M
                        WHERE
                            R.ROLE_ID = '".$_key."'
                            AND R.ROLE_ID = MR.ROLE_ID
                            AND MR.MENU_ID = M.MENU_ID
                        ORDER BY
                            M.CHANNEL_NO ASC, M.MENU_ORD
                        ";

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'list') {
                $search_where = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                $sql = "SELECT
                            ROLE_ID, ROLE_NM, ROLE_GB
                        FROM
                            COM_ROLE
                        WHERE
                            1 = 1
                        ".$search_where."
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

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_
                    (
                    ) VALUES (
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
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

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

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