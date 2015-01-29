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

            $sql = "SELECT NO, PRODUCT_NO, SUBJECT, BODY, COUNSEL_ST, PROGRESS_ST, USER_ID, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                        (SELECT PRODUCT_CODE FROM ANGE_ORDER WHERE PRODUCT_NO = AO.PRODUCT_NO AND USER_ID = '".$_SESSION['uid']."') AS PRODUCT_CODE,
		                (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AO.PRODUCT_NO) AS PRODUCT_NM
                        FROM
                            ANGE_ORDER_COUNSEL AO
                        WHERE
                            NO = ".$_key."
                            ".$search_where."

                        ";

            $result = $_d->sql_query($sql);
            $data = $_d->sql_fetch_array($result);

/*            if($_d->mysql_errno > 0) {
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
                            $data['REPLY'] = $reply_data;*/


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

            /*            if (isset($_search[TARGET_NO]) && $_search[TARGET_NO] != "") {
                            $search_where .= "AND TARGET_NO = ".$_search[TARGET_NO]." ";
                        }*/

            if (isset($_search[PRODUCT_NM]) && $_search[PRODUCT_NM] != "") {
                $search_where .= "AND AP.PRODUCT_NM LIKE '%".$_search[PRODUCT_NM]."%'";
            }

            if (isset($_search[START_DT]) && $_search[START_DT] != "") {
                $search_where .= "AND DATE_FORMAT(AC.REG_DT, '%Y-%m-%d') BETWEEN '".$_search[START_DT]."' AND '".$_search[END_DT]."'";
            }

            /*AND BODY LIKE '%".$_search[KEYWORD]."%'";*/
//                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
//                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
//                }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            $sql = "SELECT    TOTAL_COUNT, NO, PRODUCT_NO, SUBJECT, COUNSEL_ST, PROGRESS_ST,
                          CASE PROGRESS_ST WHEN 1 THEN '접수완료' WHEN 2 THEN '처리중' WHEN 3 THEN '처리완료' ELSE ' ' END AS PROGRESS_ST_NM,
                          USER_ID, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PRODUCT_NM, SUM_PRICE, PRODUCT_CNT, PRODUCT_GB, PRODUCT_CODE
                  FROM (
                             SELECT AC.NO, AC.PRODUCT_NO, AC.SUBJECT, AC.COUNSEL_ST, AC.PROGRESS_ST, AC.USER_ID, AC.REG_DT,
                                       AP.PRODUCT_NM, AP.PRODUCT_GB,
                                        AO.PRODUCT_CODE, AO.SUM_PRICE,AO.PRODUCT_CNT
                             FROM ANGE_ORDER_COUNSEL AC
                             LEFT OUTER JOIN ANGE_ORDER AO
                             ON AC.PRODUCT_NO = AO.PRODUCT_NO
                             LEFT OUTER JOIN ANGE_PRODUCT AP
                             ON AO.PRODUCT_NO = AP.NO
                             WHERE 1=1
                                AND AO.USER_ID = '".$_SESSION['uid']."'
                                ".$search_where."
                             ORDER BY NO DESC
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                          SELECT COUNT(*) AS TOTAL_COUNT
                          FROM ANGE_ORDER_COUNSEL AC
                            LEFT OUTER JOIN ANGE_ORDER AO
                            ON AC.PRODUCT_NO = AO.PRODUCT_NO
                            LEFT OUTER JOIN ANGE_PRODUCT AP
                            ON AO.PRODUCT_NO = AP.NO
                          WHERE 1=1
                            AND AO.USER_ID = '".$_SESSION['uid']."'
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
                                    AND S.TARGET_NO = ".$row['PRODUCT_NO']."
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
        }

        break;

    case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

        $err = 0;
        $msg = "";

        /*        if( trim($_model[PRODUCT_NM]) == "" ){
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

                        MtUtil::_c("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);


                    }
                }
            }

            $_model[BODY] = $body_str;
        } catch(Exception $e) {
            $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
            break;
        }

        $_d->sql_beginTransaction();
        $_change_product_no = 0;
        if(!isset($_model[CHANGE_PRODUCT][NO]) || $_model[CHANGE_PRODUCT][NO] == ''){
           $_change_product_no = 0;
        }else{
           $_change_product_no = $_model[CHANGE_PRODUCT][NO];
        }

        $sql = "INSERT INTO ANGE_ORDER_COUNSEL
                    (
                        PRODUCT_NO,
                        PRODUCT_CODE,
                        CHANGE_PRODUCT_NO,
                        SUBJECT,
                        BODY,
                        COUNSEL_ST,
                        PROGRESS_ST,
                        USER_ID,
                        REG_DT
                    ) VALUES (
                        ".$_model[PRODUCT][PRODUCT_NO].",
                        '".$_model[PRODUCT_CODE][PRODUCT_CODE]."',
                        ".$_change_product_no.",
                        '".$_model[SUBJECT]."',
                        '".$_model[BODY]."',
                        '".$_model[COUNSEL_ST]."',
                        1,
                        '".$_SESSION['uid']."',
                        SYSDATE()
                    )";

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        $sql = "UPDATE ANGE_ORDER_COUNSEL
                        SET
                           PROGRESS_ST  = 1
                        WHERE
                            PRODUCT_NO = '".$_model[PRODUCT][PRODUCT_NO]."'
                        ";


        $_d->sql_query($sql);

        if($_d->mysql_errno > 0) {
            $err++;
            $msg = $_d->mysql_error;
        }

        if (count($_model[FILES]) > 0) {
            $files = $_model[FILES];

            for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                $file = $files[$i];
                MtUtil::_c("------------>>>>> file : ".$file['name']);
                MtUtil::_c("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);

                /*if($file[kind] != 'MAIN'){
                    $_d->failEnd("대표이미지를 선택하세요.");
                }*/

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
                        '".$no."'
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

        MtUtil::_c("------------>>>>> mysql_errno : ".$_d->mysql_errno);

        if($err > 0){
            $_d->sql_rollback();
            $_d->failEnd("등록실패입니다:".$msg);
        }else{
            $sql = "INSERT INTO CMS_HISTORY
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
                        ,'CREATE'
                        ,SYSDATE()
                        ,'".$_SESSION['uid']."'
                        ,'.$no.'
                        ,'BOARD'
                        ,'CREATE'
                        ,'".$ip."'
                        ,'/webboard'
                    )";

            $_d->sql_query($sql);

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
                            rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                            $insert_path[$i] = array(path => $file_path, uid => $uid);

                            MtUtil::_c("------------>>>>> mediumUrl : ".$file[mediumUrl]);
                            MtUtil::_c("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);

                            $body_str = str_replace($file[mediumUrl], BASE_URL.$file_path.'medium/'.$uid, $body_str);

                            MtUtil::_c("------------>>>>> body_str : ".$body_str);
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

            MtUtil::_c("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();


            /*            if( trim($_model[PRODUCT_NM]) == '' ){
                            $_d->failEnd("제목을 작성 하세요");
                        }*/

            $sql = "UPDATE ANGE_ORDER_COUNSEL
                    SET
                        PROCESS_ST = ".$_model[PROCESS_ST]."
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
                            AND F.THUMB_FL = '0'
                        ";

            $result = $_d->sql_query($sql,true);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $sql = "INSERT INTO CMS_HISTORY
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
                            ,'BOARD'
                            ,'UPDATE'
                            ,'".$ip."'
                            ,'/webboard'
                        )";

            }
        }
        $_d->sql_query($sql);

        $_d->sql_commit();
        $_d->succEnd($no);


        break;

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        $sql = "DELETE FROM ANGE_PRODUCT_COUNSEL WHERE NO = ".$_key;

        $_d->sql_query($sql);
        /*$no = $_d->mysql_insert_id;*/

        if($err > 0){
            $_d->sql_rollback();
            $_d->failEnd("삭제실패입니다:".$msg);
        }else{
            $sql = "INSERT INTO CMS_HISTORY
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
                        ,'DELETE'
                        ,SYSDATE()
                        ,'".$_SESSION['uid']."'
                        ,'.$_key.'
                        ,'BOARD'
                        ,'DELETE'
                        ,'".$ip."'
                        ,'/webboard'
                    )";

            $_d->sql_query($sql);

            $_d->sql_commit();
            $_d->succEnd($no);
        }

        break;
}
?>