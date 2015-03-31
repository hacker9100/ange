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
                        NO, PRODUCT_NO, PRODUCT_CNT, SUM_PRICE, ORDER_DT, RECEIPTOR_NM, RECEIPT_ADDR, RECEIPT_ADDR_DETAIL, RECEIPT_PHONE, REQUEST_NOTE, ORDER_ST,
                        (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AO.PRODUCT_NO) AS PRODUCT_NM, ORDER_GB
                    FROM
                        ANGE_ORDER AO
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

            $file_data = $_d->getData($sql);
            $data['FILES'] = $file_data;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->failEnd("조회실패입니다:".$msg);
            }else{
                $_d->dataEnd2($data);
            }
        } else if ($_type == 'list') {
            $search_common = "";
            $search_where = "";
            $sort_order = "";
            $limit = "";

//            if (isset($_search[ORDER_GB]) && $_search[ORDER_GB] != "") {
//                $search_where .= "AND AC.ORDER_GB = '".$_search[ORDER_GB]."' ";
//            }
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            if ($_search[ORDER_GB] == 'MILEAGE') {
                $search_where .= "AND AC.ORDER_GB IN ('MILEAGE','AUCTION') ";
            }if ($_search[ORDER_GB] == 'CUMMERCE') {
                $search_where .= "AND AC.ORDER_GB = 'CUMMERCE'";
            }if ($_search[ORDER_GB] == 'NAMING') {
                $search_where .= "AND AC.ORDER_GB = 'NAMING' ";
            }

            if (isset($_search[PRODUCT_NM]) && $_search[PRODUCT_NM] != "") {
                $search_where .= "AND AP.PRODUCT_NM LIKE '%".$_search[PRODUCT_NM]."%'";
            }

            if (isset($_search[START_DT]) && $_search[START_DT] != "") {
                $search_where .= "AND DATE_FORMAT(AC.ORDER_DT, '%Y-%m-%d') BETWEEN '".$_search[START_DT]."' AND '".$_search[END_DT]."'";
            }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT   NO, PRODUCT_CNT, SUM_PRICE, PRODUCT_NO, USER_ID, ORDER_DT,DATE_FORMAT(ORDER_DT, '%Y-%m-%d') AS ORDER_DT,
                            CASE ORDER_ST when 0 then '결제완료' when 1 then '주문접수' when 2 then '상품준비중' when 3 then '배송중' when 4 then '배송완료' when 5 then '주문취소' ELSE 6 end AS ORDER_GB_NM, PRODUCT_NM, PRODUCT_GB, TOTAL_COUNT, PRICE, ORDER_GB,ORDER_ST,
                            CASE PROGRESS_ST WHEN 1 THEN '접수완료' WHEN 2 THEN '처리중' WHEN 3 THEN '처리완료' ELSE '' END AS PROGRESS_ST_NM, PARENT_NO, (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = PARENT_NO) AS PARENT_PRODUCT_NM, PRODUCT_CODE, DIRECT_PRICE
                    FROM (
                                SELECT AC.NO, AC.PRODUCT_CNT, AC.SUM_PRICE, AC.PRODUCT_NO, AC.USER_ID, AC.ORDER_DT, AC.ORDER_ST,
                                        PRODUCT_CODE, AC.ORDER_GB,
                                        (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS PRODUCT_NM,
                                        (SELECT PRODUCT_GB FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS PRODUCT_GB,
                                        (SELECT PRICE FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS PRICE,
                                        (SELECT PARENT_NO FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS PARENT_NO,
                                        (SELECT  DIRECT_PRICE FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS DIRECT_PRICE,
                                			  (SELECT PROGRESS_ST FROM ANGE_ORDER_COUNSEL WHERE PRODUCT_NO = AC.PRODUCT_NO AND PRODUCT_CODE = AC.PRODUCT_CODE) AS PROGRESS_ST
                                FROM ANGE_ORDER AC
                                WHERE  1 = 1
                                 AND AC.ORDER_ST = 0
                                 AND AC.USER_ID = '".$_SESSION['uid']."'
                                 ".$search_where."
                              ORDER BY NO DESC
                              ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM ANGE_ORDER AC
                            WHERE  1 = 1
                              AND AC.ORDER_ST = 0
                              AND AC.USER_ID = '".$_SESSION['uid']."'
                              ".$search_where."
                    ) CNT
                        ";

            $data = null;

            if (isset($_search[FILE])) {
                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'PRODUCT'
                                AND F.FILE_GB = 'MAIN'
                                AND F.TARGET_NO = ".$row['PRODUCT_NO']."
                            ";

                    $category_data = $_d->getData($sql);
                    $row['FILE'] = $category_data;

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
                }
            }
            $data = $_d->sql_query($sql);

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if($_type == 'productnolist'){

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "SELECT PRODUCT_CODE
                    FROM ANGE_ORDER
                    WHERE USER_ID = '".$_SESSION['uid']."'
                    GROUP BY PRODUCT_CODE
                    ";

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if($_type == 'productnmlist'){

            $sql ="SELECT (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AO.PRODUCT_NO) AS PRODUCT_NM, PRODUCT_NO
                    FROM ANGE_ORDER AO
                    WHERE AO.PRODUCT_CODE = '".$_search[PRODUCT_CODE][PRODUCT_CODE]."'
                    ".$search_where."
                    ";

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if($_type == 'namingnoList'){

            $sql ="SELECT NO, PRODUCT_NM, PRICE
                    FROM ANGE_PRODUCT
                    WHERE PRODUCT_GB = 'NAMING'";

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        } else if ($_type == 'admin') {
            $search_common = "";
            $search_where = "";
            $sort_order = "";
            $limit = "";

            if (isset($_search[ORDER_GB]) && $_search[ORDER_GB] != "") {
                $search_where .= "AND AC.ORDER_GB = '".$_search[ORDER_GB][value]."' ";
            }

            if (isset($_search[ORDER_ST]) && $_search[ORDER_ST] != "") {
                $search_where .= "AND AC.ORDER_ST = '".$_search[ORDER_ST][value]."' ";
            }

            if (isset($_search[CONDITION]) && $_search[CONDITION] != "") {
                if ($_search[CONDITION][index] == 1 && isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND AC.".$_search[CONDITION][value]." LIKE '".$_search[KEYWORD]."%' ";
                } else if ($_search[CONDITION][index] == 2 && isset($_search[START_YMD]) && isset($_search[END_YMD])) {
                    $search_where .= "AND DATE_FORMAT(AC.ORDER_DT, '%Y-%m-%d') BETWEEN '".$_search[START_YMD]."' AND '".$_search[END_YMD]."'";
                }
            }

            if (isset($_search[PRODUCT_NM]) && $_search[PRODUCT_NM] != "") {
                $search_where .= "AND AP.PRODUCT_NM LIKE '%".$_search[PRODUCT_NM]."%'";
            }

            if (isset($_search[SORT]) && $_search[SORT] != "") {
                $sort_order .= "ORDER BY ".$_search[SORT][value]." ".$_search[ORDER][value]." ";
            }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT
                        TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                        NO, PRODUCT_CNT, SUM_PRICE, RECEIPTOR_NM, PRODUCT_NO, USER_ID, DATE_FORMAT(ORDER_DT, '%Y-%m-%d') AS ORDER_YMD, PAY_GB, DATE_FORMAT(PAY_DT, '%Y-%m-%d') AS PAY_YMD,
                        CASE ORDER_ST when 0 then '결제완료' when 1 then '주문접수' when 2 then '상품준비중' when 3 then '배송중' when 4 then '배송완료' when 5 then '주문취소' ELSE 6 end AS ORDER_ST_NM,
                        PRODUCT_NM, PRODUCT_GB, PRICE, ORDER_GB, ORDER_ST, REQUEST_NOTE,
                        CASE PROGRESS_ST WHEN 1 THEN '접수완료' WHEN 2 THEN '처리중' WHEN 3 THEN '처리완료' ELSE '' END AS PROGRESS_ST_NM, PARENT_NO, PARENT_PRODUCT_NM, PRODUCT_CODE
                    FROM
                    (
                        SELECT
                            AC.NO, AC.PRODUCT_CNT, AC.SUM_PRICE, AC.RECEIPTOR_NM, AC.PRODUCT_NO, AC.USER_ID, AC.ORDER_GB, AP.PRODUCT_NM, AP.PRODUCT_GB, AP.PRICE, AC.ORDER_DT, AC.ORDER_ST, AC.REQUEST_NOTE,
                            (SELECT PROGRESS_ST FROM ANGE_ORDER_COUNSEL WHERE PRODUCT_NO = AC.PRODUCT_NO AND PRODUCT_CODE = AC.PRODUCT_CODE) AS PROGRESS_ST, AP.PARENT_NO,
                            (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AP.PARENT_NO) AS PARENT_PRODUCT_NM, PRODUCT_CODE, AC.PAY_GB, AC.PAY_DT
                        FROM
                            ANGE_ORDER AC
                        LEFT OUTER JOIN ANGE_PRODUCT AP
                            ON AC.PRODUCT_NO = AP.NO
                        WHERE  1 = 1
                            ".$search_where."
                        ".$sort_order."
                        ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) AS TOTAL_COUNT
                        FROM ANGE_ORDER AC
                        LEFT OUTER JOIN ANGE_PRODUCT AP
                            ON AC.PRODUCT_NO = AP.NO
                        WHERE  1 = 1
                            ".$search_where."
                    ) CNT
                    ";

            $data = null;

            if (isset($_search[FILE])) {
                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'PRODUCT'
                                AND F.FILE_GB = 'MAIN'
                                AND F.TARGET_NO = ".$row['PRODUCT_NO']."
                                ";

                    $category_data = $_d->getData($sql);
                    $row['FILE'] = $category_data;

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
                }
            }
            $data = $_d->sql_query($sql);

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        }else if($_type == 'productcode'){

            $sql = "SELECT if (IFNULL(MAX(NO), 0)+1, CONCAT('AB',DATE_FORMAT(NOW(),'%Y%m%d'),(SELECT IFNULL(MAX(NO), 0)+1 AS CNT FROM ANGE_ORDER B)),CONCAT('AB',DATE_FORMAT(NOW(),'%Y%m%d'),(SELECT IFNULL(MAX(NO), 0)+1 AS CNT FROM ANGE_ORDER B))) AS PRODUCT_CODE
                    FROM ANGE_ORDER";

            $data = $_d->sql_query($sql);

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);
                $_d->dataEnd2($data);
            }
        }

        break;

    case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        if($_type == 'item'){
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $_total_mileage = 0;

            // 주문코드 생성
            /*$sql = "SELECT if (IFNULL(MAX(NO), 0)+1, CONCAT('AB',DATE_FORMAT(NOW(),'%Y%m%d'),(SELECT IFNULL(MAX(NO), 0)+1 AS CNT FROM ANGE_ORDER B)),CONCAT('AB',DATE_FORMAT(NOW(),'%Y%m%d'),(SELECT IFNULL(MAX(NO), 0)+1 AS CNT FROM ANGE_ORDER B))) AS PRODUCT_CODE
                    FROM ANGE_ORDER";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $_model[PRODUCT_CODE] = $row[PRODUCT_CODE];
            }*/


            if (isset($_model[ORDER]) && $_model[ORDER] != "") {
                foreach ($_model[ORDER] as $e) {
                    $sql = "INSERT INTO ANGE_ORDER
                        (
                            PRODUCT_NO,
                            PRODUCT_CNT,
                            SUM_PRICE,
                            ORDER_DT,
                            RECEIPTOR_NM,
                            RECEIPT_ADDR,
                            RECEIPT_ADDR_DETAIL,
                            RECEIPT_PHONE,
                            REQUEST_NOTE,
                            ORDER_ST,
                            USER_ID,
                            ORDER_GB,
                            PAY_GB,
                            PAY_DT,
                            PRODUCT_CODE
                        ) VALUES (
                            ".$e[PRODUCT_NO].",
                            ".$e[PRODUCT_CNT].",
                            ".$e[TOTAL_PRICE].",
                            SYSDATE(),
                            '".$_model[RECEIPTOR_NM]."',
                            '".$_model[RECEIPT_ADDR]."',
                            '".$_model[RECEIPT_ADDR_DETAIL]."',
                            '".$_model[RECEIPT_PHONE]."',
                            '".$_model[REQUEST_NOTE]."',
                            0,
                            '".$_SESSION['uid']."',
                            '".$e[PRODUCT_GB]."',
                            '".$_model[PAY_GB]."',
                            SYSDATE(),
                            '".$_model[PRODUCT_CODE]."'
                        )";

                    $_d->sql_query($sql);
                    $no = $_d->mysql_insert_id;

                    $sql = "UPDATE ANGE_PRODUCT
                                SET
                                    SUM_OUT_CNT = SUM_OUT_CNT + ".$e[PRODUCT_CNT]."
                                WHERE
                                    NO = $e[PRODUCT_NO]
                                ";
                    $_d->sql_query($sql);

                    if(isset($e[PARENT_NO]) && $e[PARENT_NO] != 0){

                        $sql = "SELECT SUM(SUM_IN_CNT) AS SUM_IN_CNT,
                                       SUM(SUM_OUT_CNT) AS SUM_OUT_CNT
                                   FROM ANGE_PRODUCT
                                   WHERE PARENT_NO = ".$e[PARENT_NO]."
                                    ";

                        $result = $_d->sql_query($sql,true);
                        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                            $sql = "UPDATE ANGE_PRODUCT
                                SET SUM_IN_CNT = ".$row['SUM_IN_CNT'].",
                                    SUM_OUT_CNT = ".$row['SUM_OUT_CNT']."
                                WHERE NO = ".$e[PARENT_NO]."
                            ";
                            $_d->sql_query($sql);
                        }
                    }

                    // 찜했던 상품들 삭제
                    $sql = "DELETE FROM ANGE_CART WHERE PRODUCT_NO = ".$e[PRODUCT_NO]."";
                    $_d->sql_query($sql);

                    // 상품구분 존재하면서 구분값이 마일리지몰 일때
                    if(isset($e[PRODUCT_GB]) && $e[PRODUCT_GB] == 'MILEAGE'){

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
                                    , '992'
                                    , '992'
                                    , '마일리지몰'
                                    , '".$e[TOTAL_PRICE]."'
                                    , '마일리지몰 상품 구매'
                                )";

                        $_d->sql_query($sql);

                        $sql = "UPDATE COM_USER
                            SET
                                USE_POINT = USE_POINT + ".$e[TOTAL_PRICE].",
                                REMAIN_POINT = REMAIN_POINT - ".$e[TOTAL_PRICE]."
                            WHERE
                                USER_ID = '".$_SESSION['uid']."'
                            ";
                        $_d->sql_query($sql);

                        //$_SESSION['mileage'] = $_SESSION['mileage'] - $e[TOTAL_PRICE];
                        $_total_mileage += $e[TOTAL_PRICE];
                    }

                    // 상품구분이 존재하면서 구분값이 경매소일때
                    if(isset($e[PRODUCT_GB]) && $e[PRODUCT_GB] == 'AUCTION'){
                        $sql = "UPDATE ANGE_PRODUCT
                            SET ORDER_YN = 'Y'
                            WHERE
                                NO = $e[PRODUCT_NO]
                            ";
                        $_d->sql_query($sql);
                    }

                    /*if(isset($no) && $no != 0){
                        $sql = "SELECT
	                        NO, PRODUCT_NO, PRODUCT_CNT, SUM_PRICE, ORDER_DT, RECEIPTOR_NM, RECEIPT_ADDR, RECEIPT_ADDR_DETAIL, RECEIPT_PHONE, REQUEST_NOTE, ORDER_ST,
	                        (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AO.PRODUCT_NO) AS PRODUCT_NM, ORDER_GB
                        FROM
                            ANGE_ORDER AO
                        WHERE
                            NO = ".$no."

                        ";

                        $result = $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                        } else {
                            $result = $_d->sql_query($sql);
                            $data = $_d->sql_fetch_array($result);
                            $_d->dataEnd2($data);
                        }
                    }*/

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if ($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {

                $_SESSION['mileage'] = $_SESSION['mileage'] - $_total_mileage;

                $_d->sql_commit();
                $_d->dataEnd2(array("mileage" => $_SESSION['mileage']));
                //$_d->succEnd($no);
            }

        }else if($_type == "namingitem"){
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $sql = "SELECT CONCAT('AB',DATE_FORMAT(NOW(),'%Y%m%d'),(SELECT IFNULL(MAX(NO), 0)+1 AS CNT FROM ANGE_ORDER B)) AS PRODUCT_CODE FROM ANGE_ORDER";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $_model[PRODUCT_CODE] = $row[PRODUCT_CODE];
            }

            $sql = "INSERT INTO ANGE_ORDER
                        (
                            PRODUCT_NO,
                            PRODUCT_CNT,
                            SUM_PRICE,
                            ORDER_DT,
                            RECEIPTOR_NM,
                            RECEIPT_ADDR,
                            RECEIPT_ADDR_DETAIL,
                            RECEIPT_PHONE,
                            REQUEST_NOTE,
                            ORDER_ST,
                            USER_ID,
                            ORDER_GB,
                            PAY_GB,
                            PAY_DT,
                            PRODUCT_CODE
                        ) VALUES (
                            ".$_model[PRODUCT][NO].",
                            1,
                            ".$_model[PRODUCT][PRICE].",
                            SYSDATE(),
                            '".$_model[RECEIPTOR_NM]."',
                            '".$_model[RECEIPT_ADDR]."',
                            '".$_model[RECEIPT_ADDR_DETAIL]."',
                            '".$_model[RECEIPT_PHONE]."',
                            '".$_model[REQUEST_NOTE]."',
                            0,
                            '".$_SESSION['uid']."',
                            '".$_model[ORDER_GB]."',
                            '".$_model[PAY_GB]."',
                            SYSDATE(),
                            '".$_model[PRODUCT_CODE]."'
                        )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            $sql = "INSERT INTO ANGE_ORDER_NAMING
                        (
                            ORDER_NO,
                            PRODUCT_NO,
                            REQUEST_RELATION,
                            BABY_SEX_GB,
                            BABY_LUNAR_FL,
                            BABY_BIRTH,
                            BABY_BIRTH_TIME,
                            BABY_LEAP_FL,
                            BABY_LAST_NM,
                            DAD_NM,
                            DAD_LUNAR_FL,
                            DAD_BIRTH,
                            DAD_BIRTH_TIME,
                            DAD_LEAP_FL,
                            MOM_NM,
                            MOM_LUNAR_FL,
                            MOM_BIRTH,
                            MOM_BIRTH_TIME,
                            MOM_LEAP_FL,
                            BABY_BIRTH_AREA,
                            BABY_BRO_RANK,
                            BABY_BRO_NAME,
                            BABY_COMM_NM,
                            REQUEST_NOTE
                        ) VALUES (
                            ".$no.",
                            ".$_model[PRODUCT][NO].",
                            '".$_model[REQUEST_RELATION]."',
                            '".$_model[BABY_SEX_GB]."',
                            '".$_model[BABY_LUNAR_FL]."',
                            CONCAT('".$_model[BABY_YEAR]."','".$_model[BABY_MONTH]."','".$_model[BABY_DAY]."'),
                            CONCAT('".$_model[BABY_BIRTH_HOUR]."',':','".$_model[BABY_BIRTH_MIN]."'),
                            '".$_model[BABY_LEAP_FL]."',
                            '".$_model[BABY_LAST_NM]."',
                            '".$_model[DAD_NM]."',
                            '".$_model[DAD_LUNAR_FL]."',
                            CONCAT('".$_model[DAD_YEAR]."','".$_model[DAD_MONTH]."','".$_model[DAD_DAY]."'),
                            CONCAT('".$_model[DAD_BIRTH_HOUR]."',':','".$_model[DAD_BIRTH_MIN]."'),
                            '".$_model[DAD_LEAP_FL]."',
                            '".$_model[MOM_NM]."',
                            '".$_model[MOM_LUNAR_FL]."',
                            CONCAT('".$_model[MOM_YEAR]."','".$_model[MOM_MONTH]."','".$_model[MOM_DAY]."'),
                            CONCAT('".$_model[MOM_BIRTH_HOUR]."',':','".$_model[MOM_BIRTH_MIN]."'),
                            '".$_model[MOM_LEAP_FL]."',
                            '".$_model[BABY_BIRTH_AREA]."',
                            '".$_model[BABY_BRO_RANK]."',
                            '".$_model[BABY_BRO_NAME]."',
                            '".$_model[BABY_COMM_NM]."',
                            '".$_model[REQUEST_NOTE]."'
                        )";
            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            MtUtil::_d("------------>>>>> mysql_errno : ".$_d->mysql_errno);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        }else if($_type == 'sumitem'){

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $_d->sql_beginTransaction();
            if (isset($_model[CART]) && $_model[CART] != "") {
                foreach ($_model[CART] as $e) {

                    // 상품 재고 수정 SUM_IN_CNT(재고량) SUM_OUT_CNT(주문량)
                    $sql = "UPDATE ANGE_PRODUCT
                                SET
                                    SUM_OUT_CNT = SUM_OUT_CNT + ".$e[PRODUCT_CNT]."
                                WHERE
                                    NO = $e[PRODUCT_NO]
                                ";
                    $_d->sql_query($sql);

                    if(isset($e[PARENT_NO]) && $e[PARENT_NO] != 0){

                        $sql = "SELECT SUM(SUM_IN_CNT) AS SUM_IN_CNT,
                                       SUM(SUM_OUT_CNT) AS SUM_OUT_CNT
                                   FROM ANGE_PRODUCT
                                   WHERE PARENT_NO = ".$e[PARENT_NO]."
                                    ";

                        $result = $_d->sql_query($sql,true);
                        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                            $sql = "UPDATE ANGE_PRODUCT
                                SET SUM_IN_CNT = ".$row['SUM_IN_CNT'].",
                                    SUM_OUT_CNT = ".$row['SUM_OUT_CNT']."
                                WHERE NO = ".$e[PARENT_NO]."
                            ";
                            $_d->sql_query($sql);
                        }
                    }

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

        }


        break;

    case "PUT":

        if ($_type == 'item') {
            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/product/';
            $source_path = '../../..'.$file_path;
            $insert_path = array();

            $body_str = $_model[BODY];

            try {
                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                        $file = $files[$i];

                        if (file_exists($upload_path.$file[name])) {
                            $uid = uniqid();
                            rename($upload_path.$file[name], $source_path.$uid);
                            rename($upload_path.'thumbnail/'.$file[name], $source_path.'thumbnail/'.$uid);
                            rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                            $insert_path[$i] = array(path => $file_path, uid => $uid);

                            MtUtil::_d("------------>>>>> mediumUrl : ".$file[mediumUrl]);
                            MtUtil::_d("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);

                            $body_str = str_replace($file[mediumUrl], BASE_URL.$file_path.'medium/'.$uid, $body_str);

                            MtUtil::_d("------------>>>>> body_str : ".$body_str);
                        } else {
                            $insert_path[$i] = array(path => '', uid => '');
                        }
                    }
                }

                $_model[BODY] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            MtUtil::_d("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();


/*            if( trim($_model[PRODUCT_NM]) == '' ){
                $_d->failEnd("제목을 작성 하세요");
            }*/

            $sql = "UPDATE ANGE_ORDER
                    SET
                        ORDER_ST = ".$_model[ORDER_ST]."
                    WHERE
                        NO = ".$_key."
                ";

            $_d->sql_query($sql);

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        SUM_OUT_CNT = SUM_OUT_CNT- ".$_model[PRODUCT_CNT]."
                    WHERE
                        NO = ".$_model[PRODUCT_NO]."
                ";

            $_d->sql_query($sql);


            $sql = "UPDATE
                        COM_USER
                    SET
                        SUM_POINT = SUM_POINT + ".$_model[PRICE].",
                        REMAIN_POINT = REMAIN_POINT + ".$_model[PRICE]."
                    WHERE
                        USER_ID = '".$_SESSION['uid']."'";

            $_d->sql_query($sql);

            $_SESSION['mileage'] = $_SESSION['mileage'] + $_model[PRICE];

            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE F
                    WHERE
                        F.TARGET_GB = 'PRODUCT'
                        AND F.TARGET_NO = ".$_key."
                    ";

            $result = $_d->sql_query($sql,true);


            $sql = "INSERT INTO ANGE_ORDER_COUNSEL
                    (
                        PRODUCT_NO,
                        PRODUCT_CODE,
                        SUBJECT,
                        BODY,
                        COUNSEL_ST,
                        PROGRESS_ST,
                        USER_ID,
                        REG_DT
                    ) VALUES (
                        ".$_model[PRODUCT_NO].",
                        '".$_model[PRODUCT_CODE]."',
                        '".$_model[PRODUCT_NM]."',
                        '주문취소합니다',
                        1,
                        3,
                        '".$_SESSION['uid']."',
                        SYSDATE()
                    )";

            $_d->sql_query($sql);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
                //$_d->dataEnd2(array("mileage" => $_SESSION['mileage']));

            }
        } else if ($_type == "status") {
            $sql = "UPDATE ANGE_ORDER
                    SET
                        ORDER_ST = '".$_model[ORDER_ST]."'
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
        }

        break;

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        $sql = "DELETE FROM ANGE_ORDER WHERE NO = ".$_key;

        $_d->sql_query($sql);

        if($err > 0){
            $_d->sql_rollback();
            $_d->failEnd("삭제실패입니다:".$msg);
        }else{
            $_d->sql_commit();
            $_d->succEnd($no);
        }

        break;
}
?>