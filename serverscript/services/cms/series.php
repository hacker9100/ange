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

    $_d = new MtJson(null);

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
                            NO, SERIES_NM, SERIES_GB, SERIES_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                        FROM
                            CMS_SERIES
                        WHERE
                            NO = ".$_key."
                        ";

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_where = "";
                $sort_order = "";

                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND SERIES_NM LIKE '%".$_search[KEYWORD]."%' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SERIES_NM, SERIES_GB, SERIES_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                        FROM
                        (
                            SELECT
                                NO, SERIES_NM, SERIES_GB, SERIES_ST, REG_DT, NOTE
                            FROM
                              CMS_SERIES
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_SERIES
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) CNT
                        $sort_order
                        ";

/*
                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SERIES_NM, SERIES_GB, SERIES_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                        FROM
                        (
                            SELECT
                                NO, SERIES_NM, SERIES_GB, SERIES_ST, REG_DT, NOTE
                            FROM
                              CMS_SERIES
                            WHERE
                                1 = 1
                                ".$where_search."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_SERIES
                        ) CNT
                        ";
*/
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            }

            break;

        case "POST":

//            $FORM = json_decode(file_get_contents("php://input"),true);

            $sql = "INSERT INTO CMS_SERIES
                    (
                        SERIES_NM,
                        SERIES_GB,
                        SERIES_ST,
                        REG_DT,
                        NOTE
                    ) VALUES (
                        '".$_model[SERIES_NM]."'
                        , '".$_model[SERIES_GB]."'
                        , '0'
                        , SYSDATE()
                        , '".$_model[NOTE]."'
                    )";

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
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $FORM = json_decode(file_get_contents("php://input"),true);

            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $sql = "UPDATE CMS_SERIES
                    SET
                        SERIES_NM = '".$_model[SERIES_NM]."'
                        ,SERIES_GB = '".$_model[SERIES_GB]."'
                        ,SERIES_ST = '".$_model[SERIES_ST]."'
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
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_SERIES WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
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