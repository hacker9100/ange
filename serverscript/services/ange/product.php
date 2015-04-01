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
                        NO, PRODUCT_NM, PRODUCT_GB, COMPANY_NO, COMPANY_NM, URL, BODY, PRICE, STOCK_FL, SUM_IN_CNT, SUM_OUT_CNT, NOTE, DELEIVERY_PRICE,
                        DELEIVERY_ST, DIRECT_PRICE, ORDER_YN,(SELECT SUM(AMOUNT) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_AMOUNT,
                        (SELECT COUNT(*) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_COUNT, PARENT_NO, SUM_IN_CNT - SUM_OUT_CNT AS SUM_CNT
                    FROM
                        ANGE_PRODUCT AP
                    WHERE
                        NO = ".$_key."
                        ".$search_where."
                    ";

            $data = $_d->sql_fetch($sql);

            $sql = "SELECT
                        NO, PARENT_NO, PRODUCT_NM
                    FROM
                        ANGE_PRODUCT
                    WHERE
                        PARENT_NO = ".$_key."
                    ";

            $data['PRODUCTS'] = $_d->getData($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                    FROM
                        ANGE_PRODUCT P, CONTENT_CATEGORY CC, CMS_CATEGORY C
                    WHERE
                        P.NO = CC.TARGET_NO
                        AND CC.CATEGORY_NO = C.NO
                        AND CC.TARGET_GB = 'PRODUCT'
                        AND P.NO = ".$_key."
                    ";

            $data['CATEGORY'] = $_d->getData($sql);

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

            if (isset($_search[PRODUCT_GB]) && $_search[PRODUCT_GB] != "") {
                $search_where .= "AND PRODUCT_GB = '".$_search[PRODUCT_GB]."' ";
            }

            if (isset($_search[ORDER_YN]) && $_search[ORDER_YN] != "") {
                $search_where .= "AND ORDER_YN = '".$_search[ORDER_YN]."' ";
            }

            if (isset($_search[PRODUCT_TYPE]) && $_search[PRODUCT_TYPE] != "" && $_search[PRODUCT_TYPE] != "ALL") {

                if($_search[PRODUCT_TYPE] == 1){
                    $search_where .= "AND PRICE <= 10000 ";
                }else if($_search[PRODUCT_TYPE] == 2){
                    $search_where .= "AND PRICE <= 30000 ";
                }else if($_search[PRODUCT_TYPE] == 3){
                    $search_where .= "AND PRICE <= 50000 ";
                }else if($_search[PRODUCT_TYPE] == 4){
                    $search_where .= "AND PRICE <= 100000 ";
                }else if($_search[PRODUCT_TYPE] == 5){
                    $search_where .= "AND PRICE >= 100000 ";
                }
            }

            if (isset($_search[NOT_PRODUCRT_NO]) && $_search[NOT_PRODUCRT_NO] != "") {
                $search_where .= "AND NO  != '".$_search[NOT_PRODUCRT_NO]."' ";
            }

            if (isset($_search[CATEGORY_NO]) && $_search[CATEGORY_NO] != "") {
                $search_where .= "AND CATEGORY_NO = '".$_search[CATEGORY_NO]."' ";
            }

            for ($i = 0; $i < count($_search[CATEGORY]); $i++) {
                $category = $_search[CATEGORY][$i];
                $search_where .= "AND CATEGORY_NO = '".$category[NO]."' ";
            }


            if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%'";
            }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT
                        NO,PRODUCT_NM, PRODUCT_GB, COMPANY_NO, PRICE, SUM_IN_CNT, SUM_OUT_CNT, NOTE, TOTAL_COUNT, PERIOD, ORDER_YN, DIRECT_PRICE,AUCTION_AMOUNT,AUCTION_COUNT,
                        SUM_IN_CNT - SUM_OUT_CNT AS SUM_CNT, COMPANY_NM
                    FROM
                    (
                        SELECT NO,PRODUCT_NM, PRODUCT_GB, COMPANY_NO, PRICE, SUM_IN_CNT, SUM_OUT_CNT, NOTE, PERIOD, ORDER_YN, DIRECT_PRICE,
                                (SELECT SUM(AMOUNT) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_AMOUNT,
                                (SELECT COUNT(*) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_COUNT, COMPANY_NM
                        FROM
                            ANGE_PRODUCT AP
                        WHERE
                            1 = 1
                            AND PARENT_NO = 0
                            ".$search_where."
                         ORDER BY PRICE ASC
                         ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT
                            COUNT(*) AS TOTAL_COUNT
                        FROM
                            ANGE_PRODUCT
                        WHERE
                            1 = 1
                            AND PARENT_NO = 0
                            ".$search_where."
                    ) CNT
                    ";

            $data = null;

            $__trn = '';
            $result = $_d->sql_query($sql,true);

            if($_search['FILE']) {
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    COM_FILE F
                                WHERE
                                    F.TARGET_GB = 'PRODUCT'
                                    AND F.FILE_GB = 'MAIN'
                                    AND F.TARGET_NO = ".$row['NO']."";

                    $row['FILE'] = $_d->sql_fetch($sql);

                    $__trn->rows[$i] = $row;
                }

                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            }else if(isset($_search[BOARD_NEXT]) && $_search[BOARD_NEXT] != "") {

                $sql = "SELECT NO, PRODUCT_NM FROM ANGE_PRODUCT WHERE NO > ".$_search[KEY]." AND  PRODUCT_GB='".$_search[PRODUCT_GB]."' ORDER BY NO LIMIT 1";

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }

            }else if(isset($_search[BOARD_PRE]) && $_search[BOARD_PRE] != "") {

                $sql = "SELECT NO, PRODUCT_NM FROM ANGE_PRODUCT WHERE NO < ".$_search[KEY]." AND PRODUCT_GB='".$_search[PRODUCT_GB]."' ORDER BY  NO DESC LIMIT 1";

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            }

            $data = $_d->sql_query($sql);

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }
        } else if ($_type == 'stock') {
            $search_where = "";
            $sort_order = "";
            $limit = "";

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT
                        TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                        NO, PRODUCT_NO, IN_OUT_GB, IN_OUT_ST, IN_OUT_CNT, REG_DT, ORDER_NO
                    FROM
                    (
                        SELECT
                            NO, PRODUCT_NO, IN_OUT_GB, IN_OUT_ST, IN_OUT_CNT, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, ORDER_NO
                        FROM
                            ANGE_PRODUCT_STOCK
                        WHERE
                            PRODUCT_NO = '".$_search[PRODUCT_NO]."'
                        ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT
                            COUNT(*) AS TOTAL_COUNT
                        FROM
                            ANGE_PRODUCT_STOCK
                        WHERE
                            PRODUCT_NO = '".$_search[PRODUCT_NO]."'
                            ".$search_where."
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

            $err = 0;
            $msg = "";

            if( trim($_model[PRODUCT_NM]) == "" ){
                $_d->failEnd("상품명을 작성 하세요");
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

            if (count($_model[CATEGORY]) > 0) {
                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    if ($category['PARENT_NO'] == "1") {
                        $category_no = $category['NO'];
                    }
                }
            }

            $sql = "INSERT INTO ANGE_PRODUCT
                    (
                        PRODUCT_NM,
                        PRODUCT_GB,
                        COMPANY_NO,
                        COMPANY_NM,
                        BODY,
                        URL,
                        PRICE,
                        DIRECT_PRICE,
                        SUM_IN_CNT,
                        SUM_OUT_CNT,
                        NOTE,
                        DELEIVERY_PRICE,
                        DELEIVERY_ST,
                        CATEGORY_NO
                    ) VALUES (
                        '".$_model[PRODUCT_NM]."',
                        '".$_model[PRODUCT_GB][value]."',
                        '".$_model[COMPANY_NO]."',
                        '".$_model[COMPANY_NM]."',
                        '".$_model[BODY]."',
                        '".$_model[URL]."',
                        '".$_model[PRICE]."',
                        '".$_model[DIRECT_PRICE]."',
                        '".$_model[SUM_IN_CNT]."',
                        '".$_model[SUM_OUT_CNT]."',
                        '".$_model[NOTE]."',
                        '".$_model[DELEIVERY_PRICE]."',
                        '".$_model[DELEIVERY_ST]."',
                        '".$category_no."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (count($_model[CATEGORY]) > 0) {
                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    if ($category['PARENT_NO'] == "1") {
                        $category_no = $category['NO'];
                    }

                    $sql = "INSERT INTO CONTENT_CATEGORY
                            (
                                CATEGORY_NO
                                ,TARGET_NO
                                ,TARGET_GB
                            ) VALUES (
                                '".$category[NO]."'
                                , '".$no."'
                                , 'PRODUCT'
                            )";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            $sql = "INSERT INTO ANGE_PRODUCT_STOCK
                    (
                        PRODUCT_NO,
                        IN_OUT_GB,
                        IN_OUT_ST,
                        IN_OUT_CNT,
                        REG_DT
                    ) VALUES (
                        '".$no."',
                        'IN',
                        '0',
                        ".$_model[SUM_IN_CNT].",
                        SYSDATE()
                    )";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (count($_model[FILES]) > 0) {
                $files = $_model[FILES];

                for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                    $file = $files[$i];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);
                    MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);

                    $sql = "INSERT INTO COM_FILE
                            (
                                FILE_NM
                                ,FILE_ID
                                ,PATH
                                ,FILE_EXT
                                ,FILE_SIZE
                                ,THUMB_FL
                                ,REG_DT
                                ,FILE_ST
                                ,FILE_GB
                                ,FILE_ORD
                                ,TARGET_NO
                                ,TARGET_GB
                            ) VALUES (
                                '".$file[name]."'
                                , '".$insert_path[$i][uid]."'
                                , '".$insert_path[$i][path]."'
                                , '".$file[type]."'
                                , '".$file[size]."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".$file[kind]."'
                                , '".$i."'
                                , '".$no."'
                                , 'PRODUCT'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            MtUtil::_d("------------>>>>> mysql_errno : ".$_d->mysql_errno);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        } else if ($_type == 'stock') {

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_PRODUCT_STOCK
                    (
                        PRODUCT_NO,
                        IN_OUT_GB,
                        IN_OUT_ST,
                        IN_OUT_CNT,
                        REG_DT
                    ) VALUES (
                        '".$_model[PRODUCT_NO]."',
                        '".$_model[IN_OUT_GB]."',
                        '0',
                        '".$_model[IN_OUT_CNT]."',
                        SYSDATE()
                    )";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $update_set = '';

            if ($_model[IN_OUT_GB] == 'IN') {
                $update_set = "SUM_IN_CNT = SUM_IN_CNT + ".$_model[IN_OUT_CNT];
            } else {
                $update_set = "SUM_OUT_CNT = SUM_OUT_CNT + ".$_model[IN_OUT_CNT];
            }

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        ".$update_set."
                    WHERE
                        NO = ".$_model[PRODUCT_NO]."
                ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

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

                            MtUtil::_d("------------>>>>> mediumUrl : ".$file[mediumUrl]);
                            MtUtil::_d("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);

                        } else {
                            $insert_path[$i] = array(path => '', uid => '', kind => '');
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


            if( trim($_model[PRODUCT_NM]) == '' ){
                $_d->failEnd("제목을 작성 하세요");
            }

            if (count($_model[CATEGORY]) > 0) {
                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    if ($category['PARENT_NO'] == "1") {
                        $category_no = $category['NO'];
                    }
                }
            }

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        PRODUCT_NM = '".$_model[PRODUCT_NM]."',
                        PRODUCT_GB = '".$_model[PRODUCT_GB][value]."',
                        COMPANY_NO = '".$_model[COMPANY_NO]."',
                        COMPANY_NM = '".$_model[COMPANY_NM]."',
                        BODY = '".$_model[BODY]."',
                        URL = '".$_model[URL]."',
                        PRICE = ".$_model[PRICE].",
                        DIRECT_PRICE = ".$_model[DIRECT_PRICE].",
                        SUM_IN_CNT = ".$_model[SUM_IN_CNT].",
                        SUM_OUT_CNT = ".$_model[SUM_OUT_CNT].",
                        NOTE = '".$_model[NOTE]."',
                        CATEGORY_NO = '".$category_no."'
                    WHERE
                        NO = ".$_key."
                ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (count($_model[CATEGORY]) > 0) {

                $sql = "DELETE FROM CONTENT_CATEGORY
                        WHERE
                            TARGET_GB = 'PRODUCT'
                            AND TARGET_NO = ".$_key."
                        ";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    if ($category['PARENT_NO'] == "1") {
                        $category_no = $category['NO'];
                    }

                    $sql = "INSERT INTO CONTENT_CATEGORY
                            (
                                CATEGORY_NO
                                ,TARGET_NO
                                ,TARGET_GB
                            ) VALUES (
                                '".$category[NO]."'
                                , '".$_key."'
                                , 'PRODUCT'
                            )";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_FILE F
                        WHERE
                            F.TARGET_GB = 'PRODUCT'
                            AND F.CONTENT_GB = 'FILE'
                            AND F.TARGET_NO = ".$_key."
                        ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $is_delete = true;

                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];
                    for ($i = 0 ; $i < count($files); $i++) {
                        if ($row[FILE_NM] == $files[$i][name] && $row[FILE_SIZE] == $files[$i][size]) {
                            $is_delete = false;
                        }
                    }
                }

                if ($is_delete) {
                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                    $sql = "DELETE FROM COM_FILE WHERE NO = ".$row[NO];

                    $_d->sql_query($sql);

                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                    if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                        unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                    }
                }
            }

            if (count($_model[FILES]) > 0) {
                $files = $_model[FILES];

                for ($i = 0 ; $i < count($files); $i++) {
                    $file = $files[$i];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);

                    if ($insert_path[$i][uid] != "") {
                        $sql = "INSERT INTO COM_FILE
                                (
                                    FILE_NM
                                    ,FILE_ID
                                    ,PATH
                                    ,FILE_EXT
                                    ,FILE_SIZE
                                    ,THUMB_FL
                                    ,REG_DT
                                    ,FILE_ST
                                    ,FILE_GB
                                    ,FILE_ORD
                                    ,TARGET_NO
                                    ,TARGET_GB
                                ) VALUES (
                                    '".$file[name]."'
                                    , '".$insert_path[$i][uid]."'
                                    , '".$insert_path[$i][path]."'
                                    , '".$file[type]."'
                                    , '".$file[size]."'
                                    , '0'
                                    , SYSDATE()
                                    , 'C'
                                    , '".$file[kind]."'
                                    , '".$i."'
                                    , '".$_key."'
                                    , 'PRODUCT'
                                )";

                        $_d->sql_query($sql);
                        $file_no = $_d->mysql_insert_id;

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        } else if ($_type == 'stock') {

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_PRODUCT_STOCK
                    SET
                        IN_OUT_GB = '".$_model[IN_OUT_GB]."',
                        IN_OUT_CNT = '".$_model[IN_OUT_CNT]."'
                    WHERE
                        NO = '".$_key."'
                    ";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $update_set = '';

            if ($_model[IN_OUT_GB] == 'IN') {
                $update_set = "SUM_IN_CNT = SUM_IN_CNT - ".($_model[OLD_IN_OUT_CNT] - $_model[IN_OUT_CNT]);
            } else {
                $update_set = "SUM_OUT_CNT = SUM_OUT_CNT - ".($_model[OLD_IN_OUT_CNT] - $_model[IN_OUT_CNT]);
            }

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        ".$update_set."
                    WHERE
                        NO = ".$_model[PRODUCT_NO]."
                ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

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

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        if ($_type == "item") {
            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_PRODUCT WHERE NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_PRODUCT_STOCK WHERE PRODUCT_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM CONTENT_CATEGORY
                    WHERE
                        TARGET_GB = 'PRODUCT'
                        AND TARGET_NO = ".$_key."
                    ";

            $_d->sql_query($sql);

            if ($_d->mysql_errno > 0) {
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
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                $sql = "DELETE FROM COM_FILE WHERE NO = ".$row[NO];

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                    unlink('../../..'.$row[PATH].$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                }
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        } else if ($_type == "stock") {
            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "SELECT
                        NO, PRODUCT_NO, IN_OUT_GB, IN_OUT_ST, IN_OUT_CNT, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, ORDER_NO
                    FROM
                        ANGE_PRODUCT_STOCK
                    WHERE
                        NO = ".$_key."
                    ";

            $product_result = $_d->sql_query($sql,true);
            $product_data = $_d->sql_fetch_array($product_result);

            $update_set = '';

            if ($product_data[IN_OUT_GB] == 'IN') {
                $update_set = "SUM_IN_CNT = SUM_IN_CNT - ".$product_data[IN_OUT_CNT];
            } else {
                $update_set = "SUM_OUT_CNT = SUM_OUT_CNT - ".$product_data[IN_OUT_CNT];
            }

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        ".$update_set."
                    WHERE
                        NO = ".$product_data[PRODUCT_NO]."
                    ";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_PRODUCT_STOCK WHERE NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        }

        break;
}
?>