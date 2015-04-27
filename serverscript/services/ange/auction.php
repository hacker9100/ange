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

MtUtil::_d(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_d(print_r($_REQUEST,true));
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

switch ($_method) {
    case "GET":
        if ($_type == 'item') {
            $search_where = "";

            $err = 0;
            $msg = "";

            $sql = "SELECT
                        NO, PRODUCT_NM, PRODUCT_GB, COMPANY_NO, COMPANY_NM, URL, BODY, PRICE, STOCK_FL, SUM_IN_CNT, SUM_OUT_CNT, NOTE, DELIVERY_PRICE,
                        DELIVERY_ST, DIRECT_PRICE, ORDER_YN,(SELECT SUM(AMOUNT) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_AMOUNT,
                        (SELECT COUNT(*) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_COUNT
                    FROM
                        ANGE_PRODUCT AP
                    WHERE
                        NO = ".$_key."
                        ".$search_where."
                    ";

            $data = $_d->sql_fetch($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
                    FROM
                        COM_FILE F
                    WHERE
                        F.TARGET_GB = 'PRODUCT'
                        AND F.TARGET_NO = ".$_key."
                    ";

            $data['FILES'] = $_d->getData($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->failEnd("조회실패입니다:".$msg);
            }else{
                $_d->dataEnd2($data);
            }
        } else if ($_type == "ordercheck"){
            $search_where = "";
            $sort_order = "";
            $limit = "";


            $sql = "SELECT
                        NO, PRODUCT_NM, TOTAL_COUNT
                    FROM
                    (
                        SELECT
                            NO, PRODUCT_NM
                        FROM
                            ANGE_PRODUCT
                        WHERE 1=1
                          AND NO = '".$_search[NO]."'
                          AND ORDER_YN = 'Y'
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) AS TOTAL_COUNT
                        FROM
                            ANGE_PRODUCT
                        WHERE 1=1
                          AND  NO  = '".$_search[PRODUCT_NO]."'
                          AND ORDER_YN = 'Y'
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
//            $form = json_decode(file_get_contents("php://input"),true);

        if ($_type == 'item') {
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_AUCTION
                        (
                            PRODUCT_NO,
                            AMOUNT,
                            USER_ID,
                            NICK_NM,
                            REG_DT
                        ) VALUES (
                            ".$_model[NO].",
                            100,
                            '".$_SESSION['uid']."',
                            '".$_SESSION['nick']."',
                            SYSDATE()
                        )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $_d->sql_commit();
            $_d->succEnd($no);

        }
        break;

    case "PUT":

        break;

    case "DELETE":

        break;
}
?>