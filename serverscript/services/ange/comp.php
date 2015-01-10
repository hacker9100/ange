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

MtUtil::_c(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_c(print_r($_REQUEST,true));
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
                                NO, BOARD_NO, USER_ID, NICK_NM, USER_NM, REG_DT, PREG_FL, BABY_MONTH,
                                BABY_AGE, BLOG_URL, ANSWER,
                                ADD1, ADD2, ADD3
                            FROM
                                ANGE_COMP
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


/*            if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                $search_where .= "AND S.SECTION_NM LIKE '%".$_search[KEYWORD]."%' ";
            }

            if (isset($_search[SEARCH_SEASON_NM][SEASON_NM]) && $_search[SEARCH_SEASON_NM][SEASON_NM] != "") {
                $search_where .= "AND S.SEASON_NM  = '".$_search[SEARCH_SEASON_NM][SEASON_NM]."' ";
            }

            if (isset($_search[SEASON_NM]) && $_search[SEASON_NM] != "") {
                $search_where .= "AND S.SEASON_NM  = '".$_search[SEASON_NM]."' ";
            }

            if (isset($_search[SORT]) && $_search[SORT] != "") {
                $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
            }*/


            $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM, NO, BOARD_NO, USER_ID, NICK_NM, USER_NM, REG_DT, PREG_FL, BABY_MONTH,
                            BABY_AGE, BLOG_URL, ANSWER,
                            ADD1, ADD2, ADD3
                        FROM
                        (
                             SELECT  AC.NO, AC.BOARD_NO, AC.USER_ID, AC.NICK_NM, AC.USER_NM, AC.REG_DT, AC.PREG_FL, AC.BABY_MONTH,
                                    AC.BABY_AGE, AC.BLOG_URL, AC.ANSWER,
                                    AC.ADD1, AC.ADD2, AC.ADD3
                             FROM ANGE_COMP AC
                             WHERE 1=1
                             ".$search_where."
                             ".$sort_order."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                             SELECT COUNT(*) AS TOTAL_COUNT
                             FROM ANGE_COMP
                             WHERE 1=1
                             ".$search_where."
                        ) CNT
                        ";
        }

        $data = $_d->sql_query($sql);
        if ($_d->mysql_errno > 0) {
            $_d->failEnd("조회실패입니다:".$_d->mysql_error);
        } else {
            $_d->dataEnd($sql);
        }

        break;

    case "POST":

        //            $FORM = json_decode(file_get_contents("php://input"),true);

        $sql = "INSERT INTO ANGE_COMP
                        (
                            BOARD_NO,
                            USER_ID,
                            NICK_NM,
                            USER_NM,
                            REG_DT,
                            PREG_FL,
                            BABY_MONTH,
                            BABY_AGE,
                            BLOG_URL,
                            ANSWER,
                            ADD1,
                            ADD2,
                            ADD3
                        ) VALUES (
                             '".$_model[BOARD_NO]."'
                            , '".$_SESSION['uid']."'
                            , '".$_SESSION['nick']."'
                            , '".$_SESSION['name']."'
                            , SYSDATE()
                            , '".$_model[PREG_FL]."'
                            , '".($_model[PREG_FL] == "true" ? "Y" : "N")."'
                            ,'".$_model[BABY_AGE]."'
                            ,'".$_model[BLOG_URL]."'
                            ,'".$_model[ADD1]."'
                            ,'".$_model[ADD2]."'
                            ,'".$_model[ADD3]."'
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


        //            $FORM = json_decode(file_get_contents("php://input"),true);

        MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

        /*            if($_model[OLD_SEASON_NM] != "" || $_model[OLD_SEASON_NM] != $_model[SEASON_NM]){
                        $sql = "UPDATE CMS_SECTION SET
                                    SEASON_NM = '".$_model[SEASON_NM]."'
                             WHERE SEASON_NM = '".$_model[OLD_SEASON_NM]."'
                                ";
                    }else{
                        if (!isset($_key) || $_key == '') {
                            $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                        }
                        $sql = "UPDATE CMS_SECTION
                                        SET
                                            SECTION_NM = '".$_model[SECTION_NM]."'
                                            ,SORT_IDX = '".$_model[SORT_IDX]."'
                                            ,NOTE = '".$_model[NOTE]."'
                                        WHERE
                                            NO = ".$_key."
                                    ";
                    }*/
        $sql = "UPDATE ANGE_COMP
                            SET
                                BOARD_NO = '".$_model[SECTION_NM]."'
                                ,USER_ID = '".$_SESSION['uid']."'
                                ,NICK_NM = '".$_SESSION['nick']."'
                                ,USER_NM = '".$_SESSION['name']."'
                                ,PREG_FL = '".($_model[PREG_FL] == "true" ? "Y" : "N")."'
                                ,BABY_MONTH = '".$_model[BABY_MONTH]."'
                                ,BABY_AGE = '".$_model[BABY_AGE]."'
                                ,BLOG_URL = '".$_model[BLOG_URL]."'
                                ,ANSWER = '".$_model[ANSWER]."'
                                ,ADD1 = '".$_model[ADD1]."'
                                ,ADD2 = '".$_model[ADD2]."'
                                ,ADD3 = '".$_model[ADD3]."'
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

        $sql = "DELETE FROM ANGE_COMP WHERE NO = ".$_key;

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