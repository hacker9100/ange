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

MtUtil::_d("### ['START']");
MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC['processApi'] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC['processApi'] category.cnt : ".count($category));
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
        if($_type == 'item'){

            $sql = "SELECT NO, COUPON_NM, COUPON_GB, COUPON_CD, USE_FL, REG_DT, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                     FROM (
                                SELECT NO, COUPON_NM, COUPON_GB, COUPON_ST, USER_ID, REG_DT, COUPON_CD
                                FROM ANGE_COUPON
                                WHERE NO = ".$_key."
                     )  A";

            $data = $_d->sql_query($sql);
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);
                $_d->dataEnd2($data);
            }
        } else if($_type == 'list'){

            // 검색조건 추가
            /*               if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                               $search_where .= "AND AMS.USER_ID = '".$_SESSION['uid']."'";
                           }*/

            $limit = "";

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
            }

//            // 검색조건 추가
//            if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
//                $search_where .= "AND AUM.USER_ID = '".$_SESSION['uid']."'";
//            }

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = " SELECT USER_ID,
                         COUPON_NM,
                         DATE_FORMAT(REG_DT, '%Y-%m-%d') as REG_DT,
                         TOTAL_CNT,
                         (@RNUM := @RNUM -1)+1  AS RNUM,
                         COUPON_CD,
                         CASE COUPON_GB
                            WHEN 'ANGE' THEN '앙쥬맘쿠폰(마일리지적립)'
                            WHEN 'EXPO' THEN '박람회 쿠폰(마일리지적립)'
                            WHEN 'MAGAZINE' THEN '매거진다운로드(마일리지적립)'
                         ELSE '' END AS COUPON_GB_NM,
                         COUPON_GB
                        FROM
                        (
                            SELECT NO, COUPON_NM, COUPON_GB, COUPON_ST, USER_ID, REG_DT, COUPON_CD
                            FROM ANGE_COUPON
                            WHERE 1=1
                              AND USER_ID = '".$_SESSION['uid']."'
                            ORDER BY REG_DT DESC
                            ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := (SELECT COUNT(*) FROM ANGE_COUPON WHERE 1=1 AND USER_ID = '".$_SESSION['uid']."')) R,
                        (
                            SELECT COUNT(*) TOTAL_CNT
                            FROM ANGE_COUPON AUC
                            WHERE 1=1
                              AND USER_ID = '".$_SESSION['uid']."'
                        ) TO_CNT
                ";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if ($_type == "couponCheck") {

//            if (!isset($_SESSION['uid'])) {
//                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
//            }
            $search_where = "";

            if (isset($_search['YEAR']) && $_search['YEAR'] != "") {
                $search_where .= "AND DATE_FORMAT(NOW(), '%Y') = '".$_search['YEAR']."'";
            }

            if (isset($_search['MONTH']) && $_search['MONTH'] != "") {
                $search_where .= "AND DATE_FORMAT(NOW(), '%Y%m') = '".$_search['MONTH']."'";
            }

            $sql = "SELECT COUNT(*) AS COUPON_CNT
                 FROM ANGE_COUPON
                 WHERE 1 = 1
                   AND COUPON_CD = '".$_search['COUPON_CD']."'
                   AND USER_ID = '".$_SESSION['uid']."'
                   ".$search_where."";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        }

        break;

    case "POST":
        $sql = "INSERT INTO ANGE_COUPON
                        (
                            COUPON_NM,
                            COUPON_GB,
                            COUPON_CD,
                            USE_FL,
                            USER_ID,
                            REG_DT
                        ) VALUES (
                             '".$_model['COUPON_NM']."'
                            , '".$_model['COUPON_GB']."'
                            , '".$_model['COUPON_CD']."'
                            , 'Y'
                            , '".$_SESSION['uid']."'
                            , SYSDATE()
                        )";

        /*".$_model['SORT_IDX']."*/

        $_d->sql_query($sql);

        if(isset($_model['MILEAGE']) && $_model['MILEAGE'] != ""){
            $sql = "INSERT INTO ANGE_USER_MILEAGE
                                (
                                    USER_ID,
                                    EARN_DT,
                                    MILEAGE_NO,
                                    EARN_GB,
                                    PLACE_GB,
                                    POINT,
                                    REASON
                                ) VALUES (
                                    '".$_SESSION['uid']."'
                                    , SYSDATE()
                                    , '0'
                                    , '0'
                                    , '쿠폰등록'
                                    ,  '".$_model['MILEAGE']."'
                                    , '쿠폰등록'
                                )";

            $_d->sql_query($sql);

            $sql = "UPDATE COM_USER
                                SET
                                    SUM_POINT = SUM_POINT + ".$_model['MILEAGE'].",
                                    REMAIN_POINT = REMAIN_POINT + ".$_model['MILEAGE']."
                                WHERE
                                    USER_ID = '".$_SESSION['uid']."'
                                ";
            $_d->sql_query($sql);

            $_SESSION['mileage'] = $_SESSION['mileage'] + 1000;
        }

        if ($_d->mysql_errno > 0) {
            $_d->failEnd("등록실패입니다:".$_d->mysql_error);
        } else {
            $_d->sql_commit();
            //$_d->succEnd($no);
            $_d->dataEnd2(array("mileage" => $_SESSION['mileage']));
        }

        break;

    case "PUT":

        MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

        $sql = "UPDATE ANGE_COUPON  SET
                        COUPON_NM = '".$_model['COUPON_NM']."'
                        , COUPON_GB = '".$_model['COUPON_GB']."'
                        , COUPON_CD = '".$_model['COUPON_CD']."'
                        , USE_FL = '".$_model['USE_FL']."'
                 WHERE NO = '".$_key."'
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

        $sql = "DELETE FROM ANGE_COUPON WHERE NO = ".$_key;

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if ($_d->mysql_errno > 0) {
            $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
        } else {
            $_d->succEnd($no);
        }

        break;
}