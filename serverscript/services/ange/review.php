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

    MtUtil::_d(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_d(print_r($_REQUEST,true));
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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {
                $search_where = "";

                $err = 0;
                $msg = "";

                $sql = "SELECT
	                        NO, SUBJECT, BODY, REG_UID, NICK_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, REPLY_CNT, WARNING_FL, BEST_FL, BLOG_URL, TARGET_NO, TARGET_GB, REPLY_FL, BLIND_FL
                        FROM
                            ANGE_REVIEW
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
                            F.TARGET_GB = 'REVIEW'
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
            } else if ($_type == 'list') {
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search['TARGET_GB']) && $_search['TARGET_GB'] != "") {
                    $search_where .= "AND TARGET_GB = '".$_search['TARGET_GB']."' ";
                }

                if (isset($_search['TARGET_NO']) && $_search['TARGET_NO'] != "") {
                    $search_where .= "AND TARGET_NO = ".$_search['TARGET_NO']." ";
                }

                if (isset($_search['MIG_NO']) && $_search['MIG_NO'] != "") {
                    $search_where .= "AND MIG_NO = ".$_search['MIG_NO']." ";
                } else {
                    $search_where .= "AND MIG_NO IS NULL ";
                }

//                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
//                    $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%'";
//                }

                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                    if($_search['CONDITION']['value'] == "SUBJECT+BODY"){
                        $search_where .= "AND (SUBJECT LIKE '%".$_search['KEYWORD']."%' OR BODY LIKE '%".$_search['KEYWORD']."%') ";
                    }else{
                        $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%' ";
                    }
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                if(isset($_search['BOARD_ST']) && $_search['BOARD_ST'] != ""){
                    $search_where .= "AND BOARD_ST IS NULL";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SUBJECT, BODY, REG_UID, NICK_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, WARNING_FL, BEST_FL, BLOG_URL, TARGET_NO, TARGET_GB,
                            (DATE_FORMAT(REG_DT, '%Y-%m-%d') > DATE_FORMAT(DATE_ADD(NOW(), INTERVAL - 7 DAY), '%Y-%m-%d')) AS NEW_FL,
                            (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = DATA.NO AND TARGET_GB = 'REVIEW') AS REPLY_CNT,
                            CASE TARGET_GB WHEN 'EXPERIENCE' THEN '체험단' WHEN 'EVENT' THEN '이벤트' WHEN 'SAMPLE' THEN '샘플팩' WHEN 'PRODUCT' THEN '상품' ELSE '앙쥬' END AS SHORT_NM, REVIEW_NO, REPLY_FL,
                            BLIND_FL, BOARD_ST
                        FROM
                        (
                            SELECT
                                NO, SUBJECT, BODY, REG_UID, NICK_NM, REG_DT, HIT_CNT, LIKE_CNT, WARNING_FL, BEST_FL, BLOG_URL, TARGET_NO, TARGET_GB,
                                REVIEW_NO, REPLY_FL, BLIND_FL, BOARD_ST
                            FROM
                                ANGE_REVIEW AR
                            WHERE
                                1 = 1
                                ".$search_where."
                             ORDER BY REVIEW_NO DESC
                             ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_REVIEW
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) CNT
                        ";

                $data = null;

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                if (isset($_search['FILE'])) {
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    COM_FILE F
                                WHERE
                                    F.TARGET_GB = 'REVIEW'
                                    AND F.FILE_GB = 'MAIN'
                                    AND F.TARGET_NO = ".$row['NO']."
                                ";

                        $file_data = $_d->sql_fetch($sql);
                        $row['FILE'] = $file_data;

                        $__trn->rows[$i] = $row;
                    }

                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                }
            } else if ($_type == 'main') {
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search['TARGET_GB']) && $_search['TARGET_GB'] != "") {
                    $search_where .= "AND TARGET_GB = '".$_search['TARGET_GB']."' ";
                }

                if (isset($_search['TARGET_NO']) && $_search['TARGET_NO'] != "") {
                    $search_where .= "AND TARGET_NO = ".$_search['TARGET_NO']." ";
                }

                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                    $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%'";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                if(isset($_search['BOARD_ST']) && $_search['BOARD_ST'] != ""){
                    $search_where .= "AND BOARD_ST IS NULL'";
                }

                $sql = "SELECT
                            NO, SUBJECT, BODY, REG_UID, NICK_NM, REG_DT, HIT_CNT, LIKE_CNT, WARNING_FL, BEST_FL, BLOG_URL, TARGET_NO, TARGET_GB,
                            REVIEW_NO, REPLY_FL, BLIND_FL, BOARD_ST
                        FROM
                            ANGE_REVIEW
                        WHERE
                            1 = 1
                            ".$search_where."
                        ORDER BY REG_DT DESC
                        ".$limit."
                        ";

                $data = null;

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                if (isset($_search['FILE'])) {
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                        F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                    FROM
                                        COM_FILE F
                                    WHERE
                                        F.TARGET_GB = 'REVIEW'
                                        AND F.FILE_GB = 'MAIN'
                                        AND F.TARGET_NO = ".$row['NO']."
                                    ";

                        $file_data = $_d->sql_fetch($sql);
                        $row['FILE'] = $file_data;

                        $__trn->rows[$i] = $row;
                    }

                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                }
            } else if ($_type == 'like'){

                $search_where = "";

                if (isset($_search['TARGET_GB']) && $_search['TARGET_GB'] != "") {
                    $search_where .= "AND L.TARGET_GB = '".$_search['TARGET_GB']."' ";
                }

                if (isset($_search['NO']) && $_search['NO'] != "") {
                    $search_common .= "AND B.NO = '".$_search['NO']."' ";
                }

                $sql = "SELECT
                            CASE IFNULL(L.TARGET_NO, 'N') WHEN 'N' THEN 'N' ELSE 'Y' END AS LIKE_FL, COUNT(*) AS TOTAL_COUNT
                        FROM ANGE_REVIEW B
                            INNER JOIN ANGE_LIKE L ON B.NO = L.TARGET_NO
                        WHERE 1=1
                            AND L.REG_UID = '".$_SESSION['uid']."'
                            AND B.NO = ".$_key."
                            ".$search_where."";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0){
                    //$_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if($_type == 'pre') {

                $sql = "SELECT NO, SUBJECT, BLIND_FL, BOARD_ST FROM ANGE_REVIEW WHERE NO < ".$_search['KEY']." AND BOARD_ST IS NULL  AND TARGET_GB='".$_search['TARGET_GB']."' ORDER BY  NO DESC LIMIT 1";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if($_type == 'next') {

                $sql = "SELECT NO, SUBJECT, BLIND_FL, BOARD_ST FROM ANGE_REVIEW WHERE NO > ".$_search['KEY']." AND BOARD_ST IS NULL  AND  TARGET_GB='".$_search['TARGET_GB']."' ORDER BY NO LIMIT 1";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
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

            if( trim($_model['SUBJECT']) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/review/';
            $source_path = '../../..'.$file_path;
            $insert_path = array();

            $body_str = $_model['BODY'];

            try {
                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                        $file = $files[$i];

                        if (file_exists($upload_path.$file['name'])) {
                            $uid = uniqid();
                            rename($upload_path.$file['name'], $source_path.$uid);
                            rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);

                            if ($file['version'] == 6 ) {
                                $body_str = str_replace($file['url'], BASE_URL.$file_path.$uid, $body_str);
                                $body_str = str_replace(BASE_URL.'/upload/files/'.$file['name'], BASE_URL.$file_path.$uid, $body_str);
                            } else {
                                rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                                $body_str = str_replace($file['mediumUrl'], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                                $body_str = str_replace(BASE_URL.'/upload/files/medium/'.$file['name'], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                            }

                            $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);

                            MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i]['path']);
                        }
                    }
                }

                $_model['BODY'] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_REVIEW
                    (
                        SUBJECT,
                        BODY,
                        REG_UID,
                        NICK_NM,
                        REG_DT,
                        HIT_CNT,
                        LIKE_CNT,
                        REPLY_CNT,
                        WARNING_FL,
                        BEST_FL,
                        BLOG_URL,
                        TARGET_NO,
                        TARGET_GB,
                        REPLY_FL,
                        REVIEW_NO,
                        BLIND_FL
                    ) VALUES (
                        '".addslashes($_model['SUBJECT'])."',
                        '".addslashes($_model['BODY'])."',
                        '".$_SESSION['uid']."',
                        '".$_SESSION['nick']."',
                        SYSDATE(),
                        '".$_model['HIT_CNT']."',
                        '".$_model['LIKE_CNT']."',
                        '".$_model['REPLY_CNT']."',
                        '".$_model['WARNING_FL']."',
                        '".$_model['BEST_FL']."',
                        '".$_model['BLOG_URL']."',
                        '".$_model['TARGET_NO']."',
                        '".$_model['TARGET_GB']."',
                        '".($_model['REPLY_FL'] == "true" ? "Y" : "N")."',
                        (SELECT COUNT(*)+1 FROM ANGE_REVIEW A WHERE A.TARGET_GB = '".$_model['TARGET_GB']."'),
                        'N'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "UPDATE adm_history_join
                    SET
                        adhj_date_complete = SYSDATE()
                    WHERE
                        adu_id = '".$_SESSION['uid']."'
                        AND ada_idx = '".$_model['TARGET_NO']."'
                        AND adhj_date_complete IS NULL
                    ";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (count($_model['FILES']) > 0) {
                $files = $_model['FILES'];

                for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                    $file = $files[$i];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);
                    MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i]['path']);

                    if(!isset($file['kind'])){
                        $_d->failEnd("대표이미지를 선택하세요.");
                    }

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
                                '".$file['name']."'
                                , '".$insert_path[$i]['uid']."'
                                , '".$insert_path[$i]['path']."'
                                , '".$file['type']."'
                                , '".$file['size']."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".$file['kind']."'
                                , '".$i."'
                                , '".$no."'
                                , 'REVIEW'
                            )";

                    $_d->sql_query($sql);

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

            break;

        case "PUT":

            if ($_type == 'item') {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/review/';
                $source_path = '../../..'.$file_path;
                $insert_path = array();

                $body_str = $_model['BODY'];

                try {
                    if (count($_model['FILES']) > 0) {
                        $files = $_model['FILES'];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                            @mkdir($source_path.'thumbnail/');
                            @mkdir($source_path.'medium/');
                        }

                        for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file['name'])) {
                                $uid = uniqid();
                                rename($upload_path.$file['name'], $source_path.$uid);
                                rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);

                                if ($file['version'] == 6 ) {
                                    $body_str = str_replace($file['url'], BASE_URL.$file_path.$uid, $body_str);
                                    $body_str = str_replace(BASE_URL.'/upload/files/'.$file['name'], BASE_URL.$file_path.$uid, $body_str);
                                } else {
                                    rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                                    $body_str = str_replace($file['mediumUrl'], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                                    $body_str = str_replace(BASE_URL.'/upload/files/medium/'.$file['name'], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                                }

                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);
                            } else {
                                $insert_path[$i] = array(path => '', uid => '');
                            }
                        }
                    }

                    $_model['BODY'] = $body_str;
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                MtUtil::_d("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();


                if( trim($_model['SUBJECT']) == '' ){
                    $_d->failEnd("제목을 작성 하세요");
                }
                if( trim($_model['BODY']) == '' ){
                    $_d->failEnd("내용이 비어있습니다");
                }
                
                $sql = "UPDATE ANGE_REVIEW
                    SET
                        SUBJECT = '".addslashes($_model['SUBJECT'])."',
                        BODY = '".addslashes($_model['BODY'])."',
                        HIT_CNT = '".$_model['HIT_CNT']."',
                        LIKE_CNT = '".$_model['LIKE_CNT']."',
                        REPLY_CNT = '".$_model['REPLY_CNT']."',
                        WARNING_FL = '".$_model['WARNING_FL']."',
                        BEST_FL = '".$_model['BEST_FL']."',
                        BLOG_URL = '".$_model['BLOG_URL']."',
                        TARGET_NO = '".$_model['TARGET_NO']."',
                        TARGET_GB = '".$_model['TARGET_GB']."',
                        REPLY_FL = '".($_model['REPLY_FL'] == "true" ? "Y" : "N")."'
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
                            COM_FILE F
                        WHERE
                            F.TARGET_GB = 'REVIEW'
                            AND F.TARGET_NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $is_delete = true;

                    if (count($_model['FILES']) > 0) {
                        $files = $_model['FILES'];
                        for ($i = 0 ; $i < count($files); $i++) {
                            if ($row['FILE_NM'] == $files[$i]['name'] && $row['FILE_SIZE'] == $files[$i]['size']) {
                                $is_delete = false;
                            }
                        }
                    }

                    if ($is_delete) {
                        MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);
                        $sql = "DELETE FROM COM_FILE WHERE NO = ".$row['NO'];

                        $_d->sql_query($sql);

                        if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
                            unlink('../../..'.$row['PATH'].$row['FILE_ID']);
                            unlink('../../..'.$row['PATH'].'thumbnail/'.$row['FILE_ID']);
                            unlink('../../..'.$row['PATH'].'medium/'.$row['FILE_ID']);
                        }
                    }
                }

                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];

                    for ($i = 0 ; $i < count($files); $i++) {
                        $file = $files[$i];
                        MtUtil::_d("------------>>>>> file : ".$file['name']);

                        if(!isset($file['kind'])){
                            $_d->failEnd("대표이미지를 선택하세요.");
                        }

                        if ($insert_path[$i]['uid'] != "") {
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
                                        '".$file['name']."'
                                        , '".$insert_path[$i]['uid']."'
                                        , '".$insert_path[$i]['path']."'
                                        , '".$file['type']."'
                                        , '".$file['size']."'
                                        , '0'
                                        , SYSDATE()
                                        , 'C'
                                        , '".$file['kind']."'
                                        , '".$i."'
                                        , '".$_key."'
                                        , 'REVIEW'
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
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'likeCntitem') {

                $sql = "UPDATE ANGE_REVIEW SET
                                LIKE_CNT = LIKE_CNT + 1
                         WHERE NO = ".$_key."
                            ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else if ($_type == 'hit'){
                $sql = "UPDATE ANGE_REVIEW
                         SET HIT_CNT = HIT_CNT + 1
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

            //$sql = "DELETE FROM ANGE_REVIEW WHERE NO = ".$_key;
            $sql = "INSERT INTO ANGE_REVIEW_DEL SELECT * FROM ANGE_REVIEW WHERE NO = ".$_key;


            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_REVIEW WHERE NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

//            $sql = "SELECT
//                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
//                    FROM
//                        FILE F, CONTENT_SOURCE S
//                    WHERE
//                        F.NO = S.SOURCE_NO
//                        AND S.TARGET_GB = 'REVIEW'
//                        AND S.TARGET_NO = ".$_key."
//                        AND F.THUMB_FL = '0'
//                    ";

//            $result = $_d->sql_query($sql,true);
//            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
//                MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);
//                $sql = "DELETE FROM FILE WHERE NO = ".$row['NO'];
//
//                $_d->sql_query($sql);
//
//                $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'REVIEW' AND TARGET_NO = ".$row['NO'];
//
//                $_d->sql_query($sql);
//
//                MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);
//
//                if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
//                    unlink('../../..'.$row['PATH'].$row['FILE_ID']);
//                    unlink('../../..'.$row['PATH'].'thumbnail/'.$row['FILE_ID']);
//                    unlink('../../..'.$row['PATH'].'medium/'.$row['FILE_ID']);
//                }
//            }

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