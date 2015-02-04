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

            if (isset($_search[YEAR]) && $_search[YEAR] != "") {
                $search_where .= "AND YEAR = '".$_search[YEAR]."' ";
            }

            if (isset($_search[MONTH]) && $_search[MONTH] != "") {
                $search_where .= "AND MONTH = '".$_search[MONTH]."' ";
            }

            if (isset($_search[DAY]) && $_search[DAY] != "") {
                $search_where .= "AND DAY = '".$_search[DAY]."' ";
            }

            $err = 0;
            $msg = "";

            $sql = "SELECT
                        NO, YEAR, MONTH, DAY, SUBJECT
                    FROM
                        ANGE_TALK
                    WHERE
                        1 = 1
                        ".$search_where."
                    ";

            $data = $_d->sql_fetch($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if ($data) {
                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_GB = 'TALK'
                            AND S.TARGET_NO = ".$data['NO']."
                            AND F.FILE_GB = 'MAIN'
                        ";

                $file_data = $_d->sql_fetch($sql);
                $data['FILE'] = $file_data;
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

            $sql = "";

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

        if( trim($_model[SUBJECT]) == "" ){
            $_d->failEnd("제목을 작성 하세요");
        }

        $upload_path = '../../../upload/files/';
        $file_path = '/storage/board/';
        $source_path = '../../..'.$file_path;
        $insert_path = null;

        $body_str = $_model[BODY];

        try {
            if (count($_model[FILE]) > 0) {
                $file = $_model[FILE];
                if (!file_exists($source_path) && !is_dir($source_path)) {
                    @mkdir($source_path);
                }

                if (file_exists($upload_path.$file[name])) {
                    $uid = uniqid();
                    rename($upload_path.$file[name], $source_path.$uid);
                    $insert_path = array(path => $file_path, uid => $uid, kind => $file[kind]);
                }
            }

        } catch(Exception $e) {
            $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
            break;
        }

        $_d->sql_beginTransaction();

        $sql = "INSERT INTO ANGE_TALK
                (
                    YEAR,
                    MONTH,
                    DAY,
                    SUBJECT
                ) VALUES (
                    '".$_model[YEAR]."',
                    '".$_model[MONTH]."',
                    '".$_model[DAY]."',
                    '".$_model[SUBJECT]."'
                )";

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if($_d->mysql_errno > 0) {
            $err++;
            $msg = $_d->mysql_error;
        }

        if (isset($_model[FILE]) && $_model[FILE] != "") {
            $file = $_model[FILE];

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
                        , '".$insert_path[uid]."'
                        , '".$insert_path[path]."'
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
                    , 'TALK'
                    , '0'
                )";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }
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
            $file_path = '/storage/board/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            $body_str = $_model[BODY];

            try {
                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    if (file_exists($upload_path.$file[name])) {
                        $uid = uniqid();
                        rename($upload_path.$file[name], $source_path.$uid);
                        $insert_path = array(path => $file_path, uid => $uid, kind => $file[kind]);

                    } else {
                        $insert_path = array(path => '', uid => '', kind => '');
                    }
                }
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_TALK
                    SET
                        YEAR = '".$_model[YEAR]."',
                        MONTH = '".$_model[MONTH]."',
                        DAY = '".$_model[DAY]."',
                        SUBJECT = '".$_model[SUBJECT]."'
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
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'BOARD'
                        AND S.CONTENT_GB = 'FILE'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

            $result_data = $_d->sql_fetch($sql,true);
            $is_delete = true;

            if (count($_model[FILE]) > 0) {
                $file = $_model[FILE];
                if ($result_data[FILE_NM] == $file[name] && $result_data[FILE_SIZE] == $file[size]) {
                    $is_delete = false;
                }
            }

            if ($result_data && $is_delete) {
                MtUtil::_c("------------>>>>> DELETE NO : ".$result_data[NO]);
                $sql = "DELETE FROM FILE WHERE NO = ".$result_data[NO];

                $_d->sql_query($sql);

                $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'BOARD' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$result_data[NO];

                $_d->sql_query($sql);

                MtUtil::_c("------------>>>>> DELETE NO : ".$result_data[NO]);

                if (file_exists('../../..'.$result_data[PATH].$result_data[FILE_ID])) {
                    unlink('../../..'.$result_data[PATH].$result_data[FILE_ID]);
                }
            }

            if (count($_model[FILE]) > 0) {
                $file = $_model[FILE];

                if ($insert_path[uid] != "") {
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
                                , '".$insert_path[uid]."'
                                , '".$insert_path[path]."'
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
                                , 'TALK'
                                , '0'
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

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        $sql = "DELETE FROM ANGE_REVIEW WHERE NO = ".$_key;

        $_d->sql_query($sql);
        /*$no = $_d->mysql_insert_id;*/

        $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'REVIEW'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

        $result = $_d->sql_query($sql,true);
        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
            MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
            $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

            $_d->sql_query($sql);

            $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'REVIEW' AND TARGET_NO = ".$row[NO];

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