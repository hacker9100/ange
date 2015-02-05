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
            $search_where = "";

//                if (isset($_search[COMM_GB]) && $_search[COMM_GB] != "") {
//                    $search_where .= "AND COMM_GB = '".$_search[COMM_GB]."' ";
//                }



            $err = 0;
            $msg = "";

            $sql = "SELECT
                        NO, PRODUCT_NM, PRODUCT_GB, COMPANY_NO, COMPANY_NM, URL, BODY, PRICE, STOCK_FL, SUM_IN_CNT, SUM_OUT_CNT, NOTE, DELEIVERY_PRICE,
                        DELEIVERY_ST, DIRECT_PRICE, ORDER_YN,(SELECT SUM(AMOUNT) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_AMOUNT,
                        (SELECT COUNT(*) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_COUNT
                    FROM
                        ANGE_PRODUCT AP
                    WHERE
                        NO = ".$_key."
                        ".$search_where."
                    ";

            $result = $_d->sql_query($sql);
            $data = $_d->sql_fetch_array($result);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.CONTENT_GB = 'FILE'
                        AND S.TARGET_GB = 'PRODUCT'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

            $file_data = $_d->getData($sql);
            $data['FILES'] = $file_data;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            /*
                            $sql = "SELECT
                                        NO, PARENT_NO, REPLY_NO, REPLY_GB, SYSTEM_GB, COMMENT, REG_ID, REG_NM, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, SCORE
                                    FROM
                                        COM_REPLY
                                    WHERE
                                        TARGET_NO = ".$_key."
                                    ";

                            $reply_data = $_d->getData($sql);
                            $data['REPLY'] = $reply_data;
            */

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

            if ($_search[ORDER_YN] == "Y") {
                $search_where .= "AND ORDER_YN = '".$_search[ORDER_YN]."' ";
            } else if ($_search[ORDER_YN] == "N"){
                $search_where .= "AND ORDER_YN = '".$_search[ORDER_YN]."' ";
            }

            if (isset($_search[PRODUCT_TYPE]) && $_search[PRODUCT_TYPE] != "" && $_search[PRODUCT_TYPE] != "ALL") {

                if($_search[PRODUCT_TYPE] == 1){
                    $search_where .= "AND PRICE < 10000 ";
                }else if($_search[PRODUCT_TYPE] == 2){
                    $search_where .= "AND PRICE < 30000 ";
                }else if($_search[PRODUCT_TYPE] == 3){
                    $search_where .= "AND PRICE < 50000 ";
                }else if($_search[PRODUCT_TYPE] == 4){
                    $search_where .= "AND PRICE < 100000 ";
                }else if($_search[PRODUCT_TYPE] == 5){
                    $search_where .= "AND PRICE >= 100000 ";
                }

            }

            /*            if (isset($_search[TARGET_NO]) && $_search[TARGET_NO] != "") {
                            $search_where .= "AND TARGET_NO = ".$_search[TARGET_NO]." ";
                        }*/

            if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%'";
            }

            /*AND BODY LIKE '%".$_search[KEYWORD]."%'";*/
//                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
//                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
//                }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT
                        NO,PRODUCT_NM, PRODUCT_GB, COMPANY_NO, PRICE, SUM_IN_CNT, SUM_OUT_CNT, NOTE, TOTAL_COUNT, PERIOD, ORDER_YN, DIRECT_PRICE,AUCTION_AMOUNT,AUCTION_COUNT
                    FROM
                    (
                        SELECT NO,PRODUCT_NM, PRODUCT_GB, COMPANY_NO, PRICE, SUM_IN_CNT, SUM_OUT_CNT, NOTE, PERIOD, ORDER_YN, DIRECT_PRICE,
                                (SELECT SUM(AMOUNT) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_AMOUNT,
                                (SELECT COUNT(*) FROM ANGE_AUCTION WHERE PRODUCT_NO = AP.NO) AS AUCTION_COUNT
                        FROM
                            ANGE_PRODUCT AP
                        WHERE
                            1 = 1
                            AND PARENT_NO = 0
                            ".$search_where."
                         ORDER BY NO DESC
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

            if (isset($_search[FILE])) {
                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                FILE F, CONTENT_SOURCE S
                            WHERE
                                F.NO = S.SOURCE_NO
                                AND S.CONTENT_GB = 'FILE'
                                AND S.TARGET_GB = 'PRODUCT'
                                AND F.FILE_GB = 'MAIN'
                                AND S.TARGET_NO = ".$row['NO']."
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

                            MtUtil::_c("------------>>>>> mediumUrl : ".$file[mediumUrl]);
                            MtUtil::_c("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);

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

            MtUtil::_c("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();


            if( trim($_model[PRODUCT_NM]) == '' ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $sql = "UPDATE ANGE_PRODUCT
                    SET
                        PRODUCT_NM = '".$_model[PRODUCT_NM]."',
                        PRODUCT_GB = '".$_model[PRODUCT_GB][value]."',
                        COMPANY_NO = '".$_model[COMPANY_NO]."',
                        COMPANY_NM = '".$_model[COMPANY_NM]."',
                        BODY = '".$_model[BODY]."',
                        PRICE = ".$_model[PRICE].",
                        SUM_IN_CNT = ".$_model[SUM_IN_CNT].",
                        SUM_OUT_CNT = ".$_model[SUM_OUT_CNT].",
                        NOTE = '".$_model[NOTE]."'
                    WHERE
                        NO = ".$_key."
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
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_GB = 'PRODUCT'
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_NO = ".$_key."
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
                    MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
                    $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                    $_d->sql_query($sql);

                    $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'PRODUCT' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                    $_d->sql_query($sql);

                    MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

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
                    MtUtil::_c("------------>>>>> file : ".$file['name']);

                    if ($insert_path[$i][uid] != "") {
                        $sql = "INSERT INTO FILE
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
                            )";

                        $_d->sql_query($sql);
                        $file_no = $_d->mysql_insert_id;

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }

                        $sql = "INSERT INTO CONTENT_SOURCE
                            (
                                TARGET_NO
                                ,SOURCE_NO
                                ,CONTENT_GB
                                ,TARGET_GB
                                ,SORT_IDX
                            ) VALUES (
                                '".$_key."'
                                , '".$file_no."'
                                , 'FILE'
                                , 'REVIEW'
                                , '".$i."'
                            )";

                        $_d->sql_query($sql);

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
                $sql = "INSERT INTO ANGE_HISTORY
                        (
                            WORK_ID
                            ,WORK_GB
                            ,WORK_DT
                            ,WORKER_ID
                            ,OBJECT_ID
                            ,OBJECT_GB
                            ,ACTION_GB
                            ,IP
                            ,ACTION_PLACE
                        ) VALUES (
                            '".$_model[WORK_ID]."'
                            ,'UPDATE'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$_key.'
                            ,'PRODUCT'
                            ,'UPDATE'
                            ,'".$ip."'
                            ,'/product/edit'
                        )";

                $_d->sql_query($sql);

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
                $sql = "INSERT INTO ANGE_HISTORY
                        (
                            WORK_ID
                            ,WORK_GB
                            ,WORK_DT
                            ,WORKER_ID
                            ,OBJECT_ID
                            ,OBJECT_GB
                            ,ACTION_GB
                            ,IP
                            ,ACTION_PLACE
                        ) VALUES (
                            '".$_model[WORK_ID]."'
                            ,'STOCK'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$no.'
                            ,'PRODUCT'
                            ,'".$_model[IN_OUT_GB]."'
                            ,'".$ip."'
                            ,'/product/list'
                        )";

                $_d->sql_query($sql);

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
            /*$no = $_d->mysql_insert_id;*/

            $sql = "DELETE FROM ANGE_PRODUCT_STOCK WHERE PRODUCT_NO = ".$_key;

            $_d->sql_query($sql);

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'PRODUCT'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
                $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                $_d->sql_query($sql);

                $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'PRODUCT' AND TARGET_NO = ".$row[NO];

                $_d->sql_query($sql);

                MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

                if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                    unlink('../../..'.$row[PATH].$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                }
            }

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }


            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $sql = "INSERT INTO ANGE_HISTORY
                        (
                            WORK_ID
                            ,WORK_GB
                            ,WORK_DT
                            ,WORKER_ID
                            ,OBJECT_ID
                            ,OBJECT_GB
                            ,ACTION_GB
                            ,IP
                            ,ACTION_PLACE
                        ) VALUES (
                            '".$_model[WORK_ID]."'
                            ,'PRODUCT'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$_key.'
                            ,'PRODUCT'
                            ,'DELETE'
                            ,'".$ip."'
                            ,'/product/list'
                        )";

                $_d->sql_query($sql);

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
                $sql = "INSERT INTO ANGE_HISTORY
                        (
                            WORK_ID
                            ,WORK_GB
                            ,WORK_DT
                            ,WORKER_ID
                            ,OBJECT_ID
                            ,OBJECT_GB
                            ,ACTION_GB
                            ,IP
                            ,ACTION_PLACE
                        ) VALUES (
                            '".$_model[WORK_ID]."'
                            ,'STOCK'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$_key.'
                            ,'PRODUCT'
                            ,'DELETE'
                            ,'".$ip."'
                            ,'/product/list'
                        )";

                $_d->sql_query($sql);

                $_d->sql_commit();
                $_d->succEnd($no);
            }
        }

        break;
}
?>