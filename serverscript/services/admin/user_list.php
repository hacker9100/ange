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
            if ($_type == 'item') {

            } else if ($_type == 'list') {
                $sql = "SELECT
                            NO, LIST_NM, LIST_GB, REG_DT, CONDITION_IDX, KEYWORD, TYPE, SORT_IDX, ORDER_IDX, STATUS, ACT
                        FROM
                            ADMIN_SAVE_LIST
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
            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            if (isset($_model[TYPE])) {
                $type_str = "";
                for($i=0;$i< sizeof($_model[TYPE]);$i++){
                    $type_str .= trim($_model[TYPE][$i]);
                    if (sizeof($_model[TYPE]) - 1 != $i) $type_str .= ",";
                }
            }

            $sql = "INSERT INTO ADMIN_SAVE_LIST
                    (
                        LIST_NM,
                        LIST_GB,
                        REG_DT,
                        CONDITION_IDX,
                        KEYWORD,
                        TYPE,
                        SORT_IDX,
                        ORDER_IDX,
                        STATUS,
                        ACT,
                        FILTER,
                        MODE
                    ) VALUES (
                        '".$_model[LIST_NM]."',
                        '".$_model[CHECKED]."',
                        SYSDATE(),
                        '".$_model[CONDITION][index]."',
                        '".$_model[KEYWORD]."',
                        '".$type_str."',
                        '".$_model[SORT][index]."',
                        '".$_model[ORDER][index]."',
                        '".$_model[STATUS]."',
                        '".$_model[ACT]."',
                        '".$_model[FILTER]."',
                        '".$_model[MODE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

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

            $sql = "INSERT INTO ADMIN_SAVE_USER
                    (
                        LIST_NO,
                        USER_ID
                    )
                    SELECT ".$no." AS LIST_NO, USER_ID
                    FROM
                        COM_USER
                    WHERE
                        1 = 1
                        ".$search_where."
                    ";

            $_d->sql_query($sql);

            if ($_d->mysql_errno > 0) {
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

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ADMIN_SAVE_LIST
                    SET
                        LIST_NM = '".$_model[LIST_NM]."',
                        CONDITION = '".$_model[CONDITION]."',
                        KEYWORD = '".$_model[KEYWORD]."',
                        TYPE = '".$_model[TYPE]."',
                        FILTER = '".$_model[FILTER]."',
                        MODE = '".$_model[MODE]."',
                        SORT = '".$_model[SORT]."',
                        ORDER = '".$_model[ORDER]."',
                        STATUS = '".$_model[STATUS]."',
                        ACT = '".$_model[ACT]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if ($_type == "item") {
                $_d->sql_beginTransaction();

                $sql = "DELETE FROM ADMIN_SAVE_USER WHERE USER_ID = '".$_key."'";

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
            } else if ($_type == "list") {
                $_d->sql_beginTransaction();

                $sql = "DELETE FROM ADMIN_SAVE_LIST WHERE NO = '".$_key."'";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "DELETE FROM ADMIN_SAVE_USER WHERE LIST_NO = '".$_key."'";

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
            }

            break;
    }
?>