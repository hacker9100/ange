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

    switch ($_method) {
        case "GET":
            if (isset($_key) && $_key != "") {
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
            } else {
                $where_search = "";

                if (isset($_search[CATEGORY_GB]) && $_search[CATEGORY_GB] != "") {
                    $where_search .= "AND C.CATEGORY_GB  = '".$_search[CATEGORY_GB]."' ";
                }
                if (isset($_search[PARENT_NO])) {
                    $where_search .= "AND C.PARENT_NO = ".$_search[PARENT_NO]." ";
                }
                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $where_search .= "AND C.CATEGORY_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                $sql = "SELECT
                            C.NO, C.PARENT_NO, C.CATEGORY_NM,
                            CASE C.PARENT_NO WHEN 0 THEN '' ELSE C.CATEGORY_NM END AS CHILD_NM,
                            CASE C.PARENT_NO WHEN 0 THEN C.CATEGORY_NM ELSE (SELECT CATEGORY_NM FROM CMS_CATEGORY WHERE NO = C.PARENT_NO) END AS PARENT_NM,
                            C.CATEGORY_GB, C.CATEGORY_ST, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT, C.NOTE
                        FROM
                            CMS_CATEGORY C
                        WHERE
                            1=1
                            ".$where_search."
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
                        PARENT_NO = ".( isset($_model[PARENT]) && $_model[PARENT] != "" ? $_model[PARENT][NO] : 0 )."
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

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM CMS_CATEGORY WHERE NO = ".$_id;

            $_d->sql_query($sql);

            $sql = "DELETE FROM CONTENT_CATEGORY WHERE CATEGORY_NO = ".$_id;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

//            if ($_d->mysql_errno > 0) {
//                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
//            } else {
//                $_d->succEnd($no);
//            }

            break;
    }
?>