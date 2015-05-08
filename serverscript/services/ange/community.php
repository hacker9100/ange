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

                if (isset($_search['COMM_GB']) && $_search['COMM_GB'] != "") {
                    $search_where .= "AND COMM_GB = '".$_search['COMM_GB']."' ";
                }

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            NO, COMM_NM, COMM_GB, COMM_ST, COMM_CLASS, COMM_MG_ID, COMM_MG_NM, NOTE
                        FROM
                            ANGE_COMM
                        WHERE
                            NO = '".$_key."'
                            ".$search_where."
                        ";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $target_no = null;
                $target_gb = null;

                if ($data['COMM_GB'] == "CLINIC") {
                    $sql = "SELECT NO FROM COM_USER WHERE USER_ID = '".$data['COMM_MG_ID']."'";
                    $user = $_d->sql_fetch($sql,true);

                    $target_gb = "USER";
                    if (isset($user)) {
                        $target_no = $user['NO'];
                    }
                } else {
                    $target_gb = "COMMUNITY";
                    $target_no = $_key;
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
                        FROM
                            COM_FILE F
                        WHERE
                            F.FILE_GB IN ('MAIN', 'MANAGER')
                            AND F.TARGET_GB = '".$target_gb."'
                            AND F.TARGET_NO = '".$target_no."'
                        ";

                $data['FILES'] = $_d->getData($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (isset($_search['BOARD'])) {
                    $sql = "SELECT
                              NO, PARENT_NO, HEAD, SUBJECT, BODY, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG
                            FROM
                              COM_BOARD
                            WHERE
                              COMM_NO = ".$data['COMM_NO']."
                            ";

                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    COM_FILE F
                                WHERE
                                    F.TARGET_GB = 'CMS_BOARD'
                                    AND F.TARGET_NO = ".$row['NO']."
                                ";

                        $row['FILES'] = $_d->getData($sql);

                        $__trn->rows[$i] = $row;
                    }
                    $_d->sql_free_result($result);
                    $data['BOARD'] = $__trn->{'rows'};
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

                if (isset($_search['COMM_GB']) && $_search['COMM_GB'] != "") {
                    $search_where .= "AND COMM_GB = '".$_search['COMM_GB']."' ";
                }

                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                    $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%' ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, COMM_NM, COMM_GB, COMM_ST, COMM_CLASS, COMM_MG_ID, COMM_MG_NM, NOTE, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_YMD
                        FROM
                        (
                            SELECT
                                NO, COMM_NM, COMM_GB, REG_DT, COMM_ST, COMM_CLASS, COMM_MG_ID, COMM_MG_NM, NOTE
                            FROM
                                ANGE_COMM
                            WHERE
                                1 = 1
                                ".$search_where."
                            ".$sort_order."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_COMM
                            WHERE
                                1 = 1
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

            $err = 0;
            $msg = "";

            if( trim($_model['COMM_NM']) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_COMM
                    (
                        COMM_NM,
                        COMM_GB,
                        REG_ID,
                        REG_DT,
                        COMM_ST,
                        COMM_CLASS
                    ) VALUES (
                        '".$_model['COMM_NM']."',
                        '".$_model['COMM_GB']."',
                        '".$_SESSION['name']."',
                        SYSDATE(),
                        '".$_model['COMM_ST']."',
                        '".$_model['COMM_CLASS']."',
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

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if( trim($_model['COMM_NM']) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $target_no = null;
            $target_gb = null;

            $file_path = null;

            if ($_model['COMM_GB'] == "CLINIC") {
                $sql = "SELECT NO FROM COM_USER WHERE USER_ID = '".$_model['COMM_MG_ID']."'";
                $user = $_d->sql_fetch($sql,true);

                $target_gb = "USER";
                $target_no = $user['NO'];
                $file_path = '/storage/user/'.$_model['COMM_MG_ID'].'/';
            } else {
                $target_gb = "COMMUNITY";
                $target_no = $_key;
                $file_path = '/storage/admin/';
            }

            $upload_path = '../../../upload/files/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model['FILES']) > 0) {
                    $files = $_model['FILES'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    for ($i = 0 ; $i < count($_model['FILES']); $i++) {
                        $file = $files[$i];

                        if (file_exists($upload_path.$file['name'])) {
                            $uid = uniqid();
                            rename($upload_path.$file['name'], $source_path.$uid);
                            $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);

                            MtUtil::_d("------------>>>>> imgUrl : ".$file['name']);
                            MtUtil::_d("------------>>>>> imgUrl : ".'http://localhost'.$source_path.$uid);
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

            $sql = "UPDATE ANGE_COMM
                    SET
                        COMM_NM = '".$_model['COMM_NM']."',
                        COMM_GB = '".$_model['COMM_GB']."',
                        COMM_ST = '".$_model['COMM_ST']."',
                        COMM_CLASS = '".$_model['COMM_CLASS']."',
                        COMM_MG_ID = '".$_model['COMM_MG_ID']."',
                        COMM_MG_NM = '".$_model['COMM_MG_NM']."',
                        NOTE = '".$_model['NOTE']."'
                    WHERE
                        NO = '".$_key."'
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
                        F.FILE_GB IN ('MAIN', 'MANAGER')
                        AND F.TARGET_GB = '".$target_gb."'
                        AND F.TARGET_NO = '".$target_no."'
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
                    }
                }
            }

            if (count($_model['FILES']) > 0) {
                $files = $_model['FILES'];

                for ($i = 0 ; $i < count($files); $i++) {
                    $file = $files[$i];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);

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
                                    , '".strtoupper($file['kind'])."'
                                    , '".$i."'
                                    , '".$target_no."'
                                    , '".$target_gb."'
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

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_COMM WHERE NO = ".$_key;

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
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>