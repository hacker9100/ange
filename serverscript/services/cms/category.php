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
                            C.NO, C.PARENT_NO, C.CATEGORY_NM,
                            CASE C.PARENT_NO WHEN 0 THEN '' ELSE C.CATEGORY_NM END AS CHILD_NM,
                            CASE C.PARENT_NO WHEN 0 THEN C.CATEGORY_NM ELSE (SELECT CATEGORY_NM FROM CMS_CATEGORY WHERE NO = C.PARENT_NO) END AS PARENT_NM,
                            C.CATEGORY_GB, C.CATEGORY_ST, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT, C.NOTE
                        FROM
                            CMS_CATEGORY C
                        WHERE
                            C.NO = ".$_key."
                        ";

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $result = $_d->sql_query($sql);
                    $data  = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_where = "";
                $sort_order = "";

                if (isset($_search[CATEGORY_GB]) && $_search[CATEGORY_GB] != "") {
                    $search_where .= "AND C.CATEGORY_GB  = '".$_search[CATEGORY_GB]."' ";
                }
                if (isset($_search[PARENT_NO])) {
                    $search_where .= "AND C.PARENT_NO = ".$_search[PARENT_NO]." ";
                }
                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND C.CATEGORY_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, PARENT_NO, CATEGORY_NM,
                            CASE PARENT_NO WHEN 0 THEN '' ELSE CATEGORY_NM END AS CHILD_NM,
                            CASE PARENT_NO WHEN 0 THEN DATA.CATEGORY_NM ELSE (SELECT CATEGORY_NM FROM CMS_CATEGORY WHERE NO = DATA.PARENT_NO) END AS PARENT_NM,
                            CATEGORY_GB, CATEGORY_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                        FROM
                        (
                            SELECT
                                C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST, C.REG_DT, C.NOTE
                            FROM
                                CMS_CATEGORY C
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_CATEGORY C
                            WHERE
                                1 = 1
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

            $sql = "INSERT INTO CMS_CATEGORY
                    (
                        PARENT_NO,
                        CATEGORY_NM,
                        CATEGORY_GB,
                        CATEGORY_ST,
                        REG_DT,
                        NOTE
                    ) VALUES (
                        ".( isset($_model[PARENT]) && $_model[PARENT] != "" ? $_model[PARENT][NO] : 0 )."
                        , '".$_model[CATEGORY_NM]."'
                        , '".$_model[CATEGORY_GB]."'
                        , '0'
                        , SYSDATE()
                        , '".$_model[NOTE]."'
                    )";

            MtUtil::_c("### [POST_DATA] ".$sql);

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."ID가 누락되었습니다.");
            }

            $FORM = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $sql = "UPDATE CMS_CATEGORY
                    SET
                        PARENT_NO = ".( isset($_model[PARENT_NO]) && $_model[PARENT_NO] != "" ? $_model[PARENT_NO] : 0 )."
                        ,CATEGORY_NM = '".$_model[CATEGORY_NM]."'
                        ,CATEGORY_GB = '".$_model[CATEGORY_GB]."'
                        ,CATEGORY_ST = '".$_model[CATEGORY_ST]."'
                        ,NOTE = '".$_model[NOTE]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM CMS_CATEGORY WHERE NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM CONTENT_CATEGORY WHERE CATEGORY_NO = ".$_key;

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