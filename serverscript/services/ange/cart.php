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

//                if (isset($_search[COMM_GB]) && $_search[COMM_GB] != "") {
//                    $search_where .= "AND COMM_GB = '".$_search[COMM_GB]."' ";
//                }

            $err = 0;
            $msg = "";

            $sql = "SELECT
                        NO, USER_ID, PRODUCT_NO, (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AC.PRODUCT_NO) AS PRODUCT_NM,
                        PRODUCT_CNT, REG_DT
                    FROM
                        ANGE_CART AC
                    WHERE
                        PRODUCT_NO = ".$_key."
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


            if ($_search[PRODUCT_GB] == "mileage") {
                $search_where .= "AND AP.PRODUCT_GB IN ('MILEAGE', 'AUCTION')";
            }else if ($_search[PRODUCT_GB] == "cummerce") {
                $search_where .= "AND AP.PRODUCT_GB IN ('CUMMERCE', 'NAMING')";
            }

            /*AND BODY LIKE '%".$_search[KEYWORD]."%'";*/
//                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
//                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
//                }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT
                       NO, PRODUCT_NO, USER_ID, PRODUCT_CNT, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PRODUCT_NM, PRICE,
                       TOTAL_COUNT, PRODUCT_CNT * PRICE AS TOTAL_PRICE, PRODUCT_GB, DELIVERY_ST, DELIVERY_PRICE,DIRECT_PRICE,
                       CASE PRODUCT_GB WHEN 'CUMMERCE' THEN '커머스' WHEN 'AUCTION' THEN '경매소' WHEN 'MILEAGE' THEN '마일리지' ELSE '기타' END AS PRODUCT_GB_NM,
                       SUM_IN_CNT - SUM_OUT_CNT AS SUM_CNT
                  FROM (
                            SELECT AC.NO, AC.PRODUCT_NO, AC.USER_ID, AC.PRODUCT_CNT, AC.REG_DT, AP.PRODUCT_NM, AP.PRICE, AP.PRODUCT_GB,
                                    AP.DELIVERY_ST, AP.DELIVERY_PRICE, AP.DIRECT_PRICE, AP.SUM_IN_CNT , AP.SUM_OUT_CNT
                            FROM
                                ANGE_CART AC INNER JOIN ANGE_PRODUCT AP ON AC.PRODUCT_NO = AP.NO
                            WHERE
                                1 = 1
                                AND AC.USER_ID = '".$_SESSION['uid']."'
                                ".$search_where."
                                 ORDER BY NO DESC
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) TOTAL_COUNT
                        FROM ANGE_CART AC INNER JOIN ANGE_PRODUCT AP ON AC.PRODUCT_NO = AP.NO
                        WHERE
                            1 = 1
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

                    $row['FILE'] = $_d->getData($sql);

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
        }

        break;

    case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $err = 0;
        $msg = "";

        /*if( trim($_model[PRODUCT_NM]) == "" ){
            $_d->failEnd("상품명을 작성 하세요");
        }*/

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

                            if ($file[version] == 6 ) {
                                $body_str = str_replace($file[url], BASE_URL.$file_path.$uid, $body_str);
                            } else {
                                rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                                $body_str = str_replace($file[mediumUrl], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                            }

                            $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                            MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);


                        }
                    }
                }

                $_model[BODY] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $_d->sql_beginTransaction();
            if (isset($_model[CART]) && $_model[CART] != "") {
                foreach ($_model[CART] as $e) {

                    if( trim($e[PRODUCT_CNT]) == "" || $e[PRODUCT_CNT] == 0){
                        $_d->failEnd("수량을 선택 하세요");
                    }

                    $sql = "INSERT INTO ANGE_CART
                            (
                                USER_ID,
                                PRODUCT_NO,
                                PRODUCT_CNT,
                                REG_DT
                            ) VALUES (
                               '".$_SESSION['uid']."',
                                ".$e[PRODUCT_NO].",
                                ".$e[PRODUCT_CNT].",
                                SYSDATE()
                            )";

                    $_d->sql_query($sql);

                    // 상품 재고 수정 SUM_IN_CNT(재고량) SUM_OUT_CNT(주문량)
//                    $sql = "UPDATE ANGE_PRODUCT
//                            SET
//                                SUM_OUT_CNT = SUM_OUT_CNT + ".$e[PRODUCT_CNT]."
//                            WHERE
//                                NO = $e[PRODUCT_NO]
//                            ";
//                    $_d->sql_query($sql);
//
//                    if(isset($e[PARENT_NO]) && $e[PARENT_NO] != 0){
//
//                        $sql = "SELECT SUM(SUM_IN_CNT) AS SUM_IN_CNT,
//                                   SUM(SUM_OUT_CNT) AS SUM_OUT_CNT
//                               FROM ANGE_PRODUCT
//                               WHERE PARENT_NO = ".$e[PARENT_NO]."
//                                ";
//
//                        $result = $_d->sql_query($sql,true);
//                        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
//
//                            $sql = "UPDATE ANGE_PRODUCT
//                            SET SUM_IN_CNT = ".$row['SUM_IN_CNT'].",
//                                SUM_OUT_CNT = ".$row['SUM_OUT_CNT']."
//                            WHERE NO = ".$e[PARENT_NO]."
//                        ";
//                            $_d->sql_query($sql);
//                        }
//                    }

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

        break;

    case "PUT":

        if ($_type == 'item') {
            $upload_path = '../../../upload/files/';
            $file_path = '/storage/review/';
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

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();


            if( trim($_model[PRODUCT_NM]) == '' ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $sql = "UPDATE ANGE_CART
                    SET
                        PRODUCT_CNT = ".$_model[PRODUCT_CNT]."
                    WHERE
                        PRODUCT_NO = ".$_key."
                ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        FILE F
                    WHERE
                        F.TARGET_GB = 'PRODUCT'
                        AND F.TARGET_NO = ".$_key."
                    ";

            $result = $_d->sql_query($sql,true);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
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

        $sql = "DELETE FROM ANGE_CART WHERE NO = ".$_key;

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