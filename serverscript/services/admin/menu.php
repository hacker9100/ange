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
            if ($_type == 'item') {
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
            } else if ($_type == 'channel') {
                $where_search = "";

                if (isset($_search[CHANNEL_NO]) && $_search[CHANNEL_NO] != "") {
                    $where_search .= "AND CHANNEL_NO = '".$_search[CHANNEL_NO]."' ";
                }

                $sql = "SELECT
                            CHANNEL_NO, CHANNEL_ID, CHANNEL_URL, CHANNEL_NM, TAG, SYSTEM_GB, DROP_FL, POSITION, COLUMN_CNT
                        FROM
                            COM_CHANNEL
                        WHERE
                            SYSTEM_GB  = '".$_search[CHANNEL_GB]."'
                            ".$where_search."
                        ORDER BY CHANNEL_NO ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    if ($_search[MENU]) {
                        $sql = "SELECT
                                    MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_DESC, TAIL_DESC
                                FROM
                                    COM_MENU
                                WHERE
                                    SYSTEM_GB  = '".$_search[CHANNEL_GB]."'
                                    AND CHANNEL_NO  = '".$row[CHANNEL_NO]."'
                                ORDER BY MENU_ORD ASC
                                ";

                        $menu_data = $_d->getData($sql);
                        $row['MENU_INFO'] = $menu_data;
                    }

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'menu') {
                $where_search = "";

                if (isset($_search[CHANNEL_NO]) && $_search[CHANNEL_NO] != "") {
                    $where_search .= "AND CHANNEL_NO = '".$_search[CHANNEL_NO]."' ";
                }

                $sql = "SELECT
                            MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_ORD, MENU_DESC, TAIL_DESC, ETC
                        FROM
                            COM_MENU
                        WHERE
                            SYSTEM_GB  = '".$_search[CHANNEL_GB]."'
                            ".$where_search."
                        ORDER BY MENU_ORD ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $in_str = "";
                    $arr_category = explode(',', $row['ETC']);
                    for($j=0;$j< sizeof($arr_category);$j++){
                        $in_str = $in_str."'".trim($arr_category[$j])."'";
                        if (sizeof($arr_category) - 1 != $j) $in_str = $in_str.",";
                    }

                    $sql = "SELECT
                                NO, PARENT_NO, CATEGORY_NM, CATEGORY_GB, CATEGORY_ST
                            FROM
                                CMS_CATEGORY
                            WHERE
                                CATEGORY_ST = '0'
                                AND NO IN (".$in_str.")
                            ";

                    $category_data = $_d->getData($sql);
                    $row['CATEGORY'] = $category_data;

                    if ($_search[SUB_MENU]) {
                        $sql = "SELECT
                                    MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, API, CSS, COLUMN_ORD, ROW_ORD
                                FROM
                                    COM_SUB_MENU
                                WHERE
                                    MENU_URL = '".$row[MENU_URL]."'
                                ORDER BY COLUMN_ORD ASC, ROW_ORD ASC
                                ";

                        $sub_menu_data = $_d->getData($sql);
                        $row['SUB_MENU_INFO'] = $sub_menu_data;
                    }

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

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

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

            if ($_type == 'menu') {

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $etc_str = "";
                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    $etc_str .= $category[NO];
                    if (sizeof($_model[CATEGORY]) - 1 != $i) $etc_str .= ",";
                }

                $sql = "UPDATE COM_MENU
                        SET
                            MENU_NM = '".$_model[MENU_NM]."'
                            ,DEPTH = '".$_model[DEPTH]."'
                            #,MENU_ORD = '".$_model[MENU_ORD]."'
                            ,ETC = '".$etc_str."'
                        WHERE
                            MENU_URL = '".$_key."'
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

//                if (isset($_model[ROLE]) && $_model[ROLE] != "") {
//                    $sql = "UPDATE USER_ROLE
//                            SET
//                                ROLE_ID = '".$_model[ROLE][ROLE_ID]."'
//                                ,REG_DT = SYSDATE()
//                            WHERE
//                                USER_ID = '".$_key."'
//                            ";
//
//                    $_d->sql_query($sql);
//
//                    if($_d->mysql_errno > 0) {
//                        $err++;
//                        $msg = $_d->mysql_error;
//                    }
//                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
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