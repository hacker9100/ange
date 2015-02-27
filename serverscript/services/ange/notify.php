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
                $search_where = "";
                $sort_order = "";

                if (isset($_model['CONDITION']) && $_model['CONDITION'] != "") {
                    $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%' ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                }

                $sql = "SELECT DATA.NO, TARGET_NO, TARGET_GB, TARGET_NOTE, TARGET_ST, TARGET_UID, TARGET_NICK, NOTE, REG_UID, REG_NICK,
                            DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_YMD, WARNING_CNT
                        FROM
                        (
                            SELECT
                                MAX(NO) AS NO, COUNT(*) AS WARNING_CNT
                            FROM
                                ANGE_NOTIFY
                            GROUP BY TARGET_NO, TARGET_GB
                        ) AS DATA
                        INNER JOIN ANGE_NOTIFY N ON DATA.NO = N.NO
                        WHERE 1 = 1
                        ".$search_where."
                        ".$sort_order."
                        ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'detail') {
                $search_where = "";
                $sort_order = "";

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                }

                $sql = "SELECT COUNT(*) AS TOTAL_COUNT, DATA.NO, TARGET_NO, TARGET_GB, TARGET_NOTE, TARGET_ST, TARGET_UID, TARGET_NICK, NOTE, REG_UID, REG_NICK,
                            DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_YMD
                        FROM
                            ANGE_NOTIFY
                        WHERE 1 = 1
                            AND TARGET_NO = '".$_search['TARGET_NO']."'
                            AND TARGET_GB = '".$_search['TARGET_GB']."'
                        ".$search_where."
                        ".$sort_order."
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
            if ($_type == 'item') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_NOTIFY
                        (
                            TARGET_NO,
                            TARGET_GB,
                            TARGET_NOTE,
                            TARGET_ST,
                            TARGET_UID,
                            TARGET_NICK,
                            NOTE,
                            REG_UID,
                            REG_NICK,
                            REG_DT
                        ) VALUES (
                            '".$_model['TARGET_NO']."',
                            '".$_model['TARGET_GB']."',
                            '".$_model['TARGET_NOTE']."',
                            '".$_model['TARGET_ST']."',
                            '".$_model['TARGET_UID']."',
                            '".$_model['TARGET_NICK']."',
                            '".$_model['NOTE']."',
                            '".$_model['REG_UID']."',
                            '".$_model['REG_NICK']."',
                            SYSDATE()
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                            COUNT(*) AS WARNING_CNT
                        FROM
                            ANGE_NOTIFY
                        WHERE
                            TARGET_NO = '".$_model['TARGET_NO']."'
                            AND TARGET_GB = '".$_model['TARGET_GB']."'
                        ";

                $data = $_d->sql_fetch($sql);

                if ($data['WARNING_CNT'] > 2) {

                    $table = "";

                    if ($_model['TARGET_GB']== "BOARD") {
                        $table = "COM_REPLY";
                    } else if ($_model['TARGET_GB']== "BOARD") {
                        $table = "ANGE_REVIEW";
                    } else {
                        $table = "COM_BOARD";
                    }

                    $sql = "UPDATE ".$table."
                                SET BLIND_FL = 'Y'
                            WHERE
                                NO = ".$_model['TARGET_NO']."
                            ";

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
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            break;

        case "DELETE":
            if ($_type == "item") {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "DELETE FROM ANGE_NOTIFY WHERE TARGET_NO = '".$_key."'";

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