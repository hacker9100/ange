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
            if ($_type == 'total') {
                if (isset($_search['PARENT_NO']) && $_search['PARENT_NO'] != "") {
                    $search_where .= "AND PARENT_NO = '{$_search['PARENT_NO']}' ";
                }

                $sql = "SELECT COUNT(*) AS TOTAL_COUNT FROM ANGE_ALBUM B WHERE REG_UID = '{$_SESSION['uid']}' {$search_where}";
                $result=$_d->sql_fetch($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($result);
                }
            } else if ($_type == 'item') {
                $err = 0;
                $msg = "";

                $sql = "SELECT A.*, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID FROM ANGE_ALBUM A, COM_FILE F WHERE A.NO = F.TARGET_NO AND F.TARGET_GB = 'ALBUM' AND A.REG_UID = '".$_SESSION['uid']."' AND A.NO = ".$_key."";

                $data = $_d->sql_fetch($sql);

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
                $search_where = "";
                $sort_order = "REG_DT DESC";
                $limit = "";

                if (isset($_search['PARENT_NO']) && $_search['PARENT_NO'] != "") {
                    $search_where .= "AND PARENT_NO = '{$_search['PARENT_NO']}' ";
                }

                if (isset($_search['PARENT_NO_NOT']) && $_search['PARENT_NO_NOT'] != "") {
                    $search_where .= "AND PARENT_NO <> '{$_search['PARENT_NO_NOT']}' ";
                }

                if (isset($_search['COMM_NO_IN']) && $_search['COMM_NO_IN'] != "") {
                    $search_where .= "AND COMM_NO IN ({$_search['COMM_NO_IN']}) ";
                }

                if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                    $search_where .= "AND REG_UID = '{$_search['REG_UID']}' ";
                }

                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                    if($_search['CONDITION']['value'] == "SUBJECT+BODY"){
                        $search_where .= "AND SUBJECT LIKE '%{$_search['KEYWORD']}' AND SUMMARY LIKE '%{$_search['KEYWORD']}%' ";
                    }else{
                        $search_where .= "AND {$_search['CONDITION']['value']} LIKE '%{$_search['KEYWORD']}%' ";
                    }
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order = "{$_search['SORT']} {$_search['ORDER']} ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", {$_page['SIZE']} ";
                }

                $sql = "SELECT COUNT(*) AS TOTAL_COUNT FROM ANGE_ALBUM B WHERE REG_UID = '{$_SESSION['uid']}' {$search_where}";
                $row=$_d->sql_fetch($sql);

                if ($_search['PARENT_NO'] == "0") {
                    $sql = "SELECT {$row['TOTAL_COUNT']} AS TOTAL_COUNT, DATA.*, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, (SELECT COUNT(*) FROM ANGE_ALBUM WHERE PARENT_NO = DATA.NO) AS PHOTO_CNT FROM
                            (
                                SELECT * FROM ANGE_ALBUM WHERE REG_UID = '{$_SESSION['uid']}' {$search_where}
                                ORDER BY {$sort_order}
                                {$limit}
                            ) AS DATA
                                LEFT OUTER JOIN COM_FILE F ON (SELECT MAX(NO) FROM ANGE_ALBUM WHERE PARENT_NO = DATA.NO) = F.TARGET_NO AND F.TARGET_GB = 'ALBUM'";
                } else {
                    $sql = "SELECT {$row['TOTAL_COUNT']} AS TOTAL_COUNT, DATA.*, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, (SELECT COUNT(*) FROM ANGE_ALBUM WHERE PARENT_NO = DATA.NO) AS PHOTO_CNT FROM
                            (
                                SELECT * FROM ANGE_ALBUM WHERE REG_UID = '{$_SESSION['uid']}' {$search_where}
                                ORDER BY {$sort_order}
                                {$limit}
                            ) AS DATA
                                LEFT OUTER JOIN COM_FILE F ON DATA.NO = F.TARGET_NO AND F.TARGET_GB = 'ALBUM'";
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

            if ($_type == "album") {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_ALBUM
                        (
                            SUBJECT
                            ,ALBUM_GB
                            ,SUMMARY
                            ,BODY
                            ,REG_UID
                            ,REG_NM
                            ,NICK_NM
                            ,REG_DT
                        ) VALUES (
                            '".$_model['SUBJECT']."'
                            ,'ALBUM'
                            ,'".$_model['SUMMARY']."'
                            ,'".$_model['SUMMARY']."'
                            , '".$_SESSION['uid']."'
                            , '".$_SESSION['name']."'
                            , '".$_SESSION['nick']."'
                            , SYSDATE()
                        )";

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
            } else if ($_type == "picture") {

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/user/'.$_SESSION['uid'].'/';
                $source_path = '../../..'.$file_path;
                $insert_path = array();

                try {
                    if (count($_model['FILES']) > 0) {
                        $files = $_model['FILES'];
                        if (!file_exists($source_path.'thumbnail/') && !is_dir($source_path.'thumbnail/')) {
                            @mkdir($source_path);
                            @mkdir($source_path.'thumbnail/');
                        }

                        for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file['name'])) {
                                $uid = uniqid();
                                rename($upload_path.$file['name'], $source_path.$uid);
                                rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);

                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);
                            }
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];

                    for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                        $file = $files[$i];

                        $sql = "INSERT INTO ANGE_ALBUM
                                (
                                    PARENT_NO
                                    ,ALBUM_GB
                                    ,SUBJECT
                                    ,SUMMARY
                                    ,BODY
                                    ,REG_UID
                                    ,REG_NM
                                    ,NICK_NM
                                    ,REG_DT
                                    ,TAG
                                    ,SHOOTING_YMD
                                ) VALUES (
                                    '".$_model['PARENT_NO']."'
                                    ,'PICTURE'
                                    ,'".$_model['SUBJECT']."'
                                    ,'".$_model['SUMMARY']."'
                                    ,'".$_model['BODY']."'
                                    , '".$_SESSION['uid']."'
                                    , '".$_SESSION['name']."'
                                    , '".$_SESSION['nick']."'
                                    , SYSDATE()
                                    , '".$_model['TAG']."'
                                    , '".$_model['SHOOTING_YMD']."'
                                )";

                        $_d->sql_query($sql);
                        $no = $_d->mysql_insert_id;

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
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
                                    , 'ALBUM'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
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
            if ($_type == "album") {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE ANGE_ALBUM
                    SET
                        SUBJECT = '".$_model['SUBJECT']."'
                        ,BODY = '".$_model['BODY']."'
                        ,SUMMARY = '".$_model['SUMMARY']."'
                    WHERE
                        NO = ".$_key."
                    ";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($_key);
                }

            } else if ($_type == "picture") {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/user/'.$_SESSION['uid'].'/';
                $source_path = '../../..'.$file_path;
                $insert_path = array();

                try {
                    if (count($_model['FILES']) > 0) {
                        $files = $_model['FILES'];

                        if (!file_exists($source_path.'thumbnail/') && !is_dir($source_path.'thumbnail/')) {
                            @mkdir($source_path);
                            @mkdir($source_path.'thumbnail/');
                        }

                        for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file['name'])) {
                                $uid = uniqid();
                                rename($upload_path.$file['name'], $source_path.$uid);
                                rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);

                            } else {
                                $insert_path[$i] = array(path => '', uid => '', kind => '');
                            }
                        }
                    }

                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE ANGE_ALBUM
                    SET
                        SUBJECT = '".$_model['SUBJECT']."'
                        ,BODY = '".$_model['BODY']."'
                        ,SUMMARY = '".$_model['SUMMARY']."'
                        ,REG_UID = '".$_SESSION['uid']."'
                        ,REG_NM = '".$_SESSION['name']."'
                        ,TAG = '".$_model['TAG']."'
                        ,SHOOTING_YMD = '".$_model['SHOOTING_YMD']."'
                    WHERE
                        NO = ".$_key."
                    ";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE F
                    WHERE
                        F.TARGET_GB = 'ALBUM'
                        AND F.TARGET_NO = ".$_key."
                    ";

                $result = $_d->sql_fetch($sql);
                $is_delete = true;

                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];
                    for ($i = 0 ; $i < count($files); $i++) {
                        if ($result['FILE_NM'] == $files[$i]['name'] && $result['FILE_SIZE'] == $files[$i]['size']) {
                            $is_delete = false;
                        }
                    }
                }

                if ($is_delete) {
                    $sql = "DELETE FROM ANGE_ALBUM WHERE NO = ".$_key;

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "DELETE FROM COM_FILE WHERE NO = ".$result['NO'];
                    $_d->sql_query($sql);

                    if (file_exists('../../..'.$result['PATH'].$result['FILE_ID'])) {
                        unlink('../../..'.$result['PATH'].$result['FILE_ID']);
                        unlink('../../..'.$result['PATH'].'thumbnail/'.$result['FILE_ID']);
                    }
                }

                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];

                    for ($i = 0 ; $i < count($files); $i++) {
                        $file = $files[$i];

                        MtUtil::_d("------------>>>>> file : ".$file['name']);

                        if ($insert_path[$i]['uid'] != "") {
                            $sql = "INSERT INTO ANGE_ALBUM
                                (
                                    PARENT_NO
                                    ,ALBUM_GB
                                    ,SUBJECT
                                    ,SUMMARY
                                    ,BODY
                                    ,REG_UID
                                    ,REG_NM
                                    ,NICK_NM
                                    ,REG_DT
                                    ,TAG
                                    ,SHOOTING_YMD
                                ) VALUES (
                                    '".$_model['PARENT_NO']."'
                                    ,'PICTURE'
                                    ,'".$_model['SUBJECT']."'
                                    ,'".$_model['SUMMARY']."'
                                    ,'".$_model['BODY']."'
                                    , '".$_SESSION['uid']."'
                                    , '".$_SESSION['name']."'
                                    , '".$_SESSION['nick']."'
                                    , SYSDATE()
                                    , '".$_model['TAG']."'
                                    , '".$_model['SHOOTING_YMD']."'
                                )";

                            $_d->sql_query($sql);
                            $no = $_d->mysql_insert_id;

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
                            , 'ALBUM'
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
                    $_d->succEnd($_key);
                }
            }

            break;

        case "DELETE":
            if ($_type == "album") {
                if (!isset($_key) || $_key == '') {
                    $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                }

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "DELETE FROM ANGE_ALBUM WHERE NO = ".$_key;

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT NO FROM ANGE_ALBUM WHERE PARENT_NO = ".$_key;

                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "DELETE FROM ANGE_ALBUM WHERE NO = ".$row['NO'];

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'ALBUM'
                                AND F.TARGET_NO = ".$row['NO']."
                            ";

                    $result = $_d->sql_fetch($sql);
                    MtUtil::_d("------------>>>>> DELETE NO : ".$result['NO']);
                    $sql = "DELETE FROM COM_FILE WHERE NO = ".$result['NO'];

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    if (file_exists('../../..'.$result['PATH'].$result['FILE_ID'])) {
                        unlink('../../..'.$result['PATH'].$result['FILE_ID']);
                        unlink('../../..'.$result['PATH'].'thumbnail/'.$result['FILE_ID']);
                    }
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("삭제실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "picture") {
                if (!isset($_key) || $_key == '') {
                    $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                }

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "DELETE FROM ANGE_ALBUM WHERE NO = ".$_key;

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                    F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                FROM
                    COM_FILE F
                WHERE
                    F.TARGET_GB = 'ALBUM'
                    AND F.TARGET_NO = ".$_key."
                ";

                $result = $_d->sql_fetch($sql);
                MtUtil::_d("------------>>>>> DELETE NO : ".$result['NO']);
                $sql = "DELETE FROM COM_FILE WHERE NO = ".$result['NO'];

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (file_exists('../../..'.$result['PATH'].$result['FILE_ID'])) {
                    unlink('../../..'.$result['PATH'].$result['FILE_ID']);
                    unlink('../../..'.$result['PATH'].'thumbnail/'.$result['FILE_ID']);
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