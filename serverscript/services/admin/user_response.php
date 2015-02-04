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
                $limit = "";

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = "SELECT
                            TOTAL_COUNT,
                            NOTE, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_YMD
                        FROM
                        (
                            SELECT
                                NOTE, REG_DT
                            FROM
                                ANGE_USER_RESPONSE
                            WHERE
                                USER_ID = '".$_search['USER_ID']."'
                            ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_USER_RESPONSE
                            WHERE
                                USER_ID = '".$_search['USER_ID']."'
                        ) CNT
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

            $sql = "INSERT INTO ANGE_USER_RESPONSE
                    (
                        USER_ID,
                        NOTE,
                        REG_DT
                    ) VALUES (
                        '".$_model[USER_ID]."',
                        '".$_model[NOTE]."',
                        SYSDATE()
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