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
                            S.PROJECT_NO, S.SECTION_NM, S.SORT_IDX, S.NOTE, S.NO, S.SEASON_NM
                        FROM
                            CMS_SECTION S
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
        } else {
            $where_search = "";


            if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                $where_search .= "AND S.SECTION_NM LIKE '%".$_search[KEYWORD]."%' ";
            }

            if (isset($_search[SEASON_NM][SEASON_NM]) && $_search[SEASON_NM][SEASON_NM] != "") {
                $where_search .= "AND S.SEASON_NM  = '".$_search[SEASON_NM][SEASON_NM]."' ";
            }

            if (isset($_search[SEASON_NM]) && $_search[SEASON_NM] != "") {
                $where_search .= "AND S.SEASON_NM  = '".$_search[SEASON_NM]."' ";
            }

            if (isset($_search[ROLE]) && $_search[ROLE] != "") {
                $sql = "SELECT SEASON_NM
                         FROM
                                CMS_SECTION
                         WHERE
                                1=1
                         GROUP BY SEASON_NM
                            ";
            }else{
            $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM, SEASON_NM,
	                         SECTION_NM, PROJECT_NO, SORT_IDX, NO
                        FROM
                        (
                             SELECT  S.NO,
                                     S.SEASON_NM,
                                     S.SECTION_NM,
                                     S.PROJECT_NO,
                                     SORT_IDX
                             FROM CMS_SECTION S
                             WHERE 1=1
                             ".$where_search."
                             ORDER BY SEASON_NM DESC, SORT_IDX ASC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                             SELECT COUNT(*) AS TOTAL_COUNT
                             FROM CMS_SECTION S
                             WHERE 1=1
                             ".$where_search."
                             ORDER BY SEASON_NM DESC, SORT_IDX ASC
                        ) CNT
                        ";
            }

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

        $sql = "INSERT INTO CMS_SECTION
                    (
                        SECTION_NM,
                        SEASON_NM,
                        SORT_IDX,
                        NOTE
                    ) VALUES (
                         '".$_model[SECTION_NM]."'
                        , '".$_model[SEASON_NM]."'
                        , '".$_model[SORT_IDX]."'
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

        MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));



        $sql = "UPDATE CMS_SECTION
                    SET
                        SECTION_NM = '".$_model[SECTION_NM]."'
                        ,SORT_IDX = '".$_model[SORT_IDX]."'
                        ,NOTE = '".$_model[NOTE]."'
                    WHERE
                        NO = ".$_key."
                    ";
               // ,SEASON_NM = '".$_model[SEASON_NM]."'

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

        $sql = "DELETE FROM CMS_SECTION WHERE NO = ".$_key;

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