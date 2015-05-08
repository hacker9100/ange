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
            if ($_type == "item") {
                $search_where = "";

                if (isset($_search['CURRENT_FL']) && $_search['CURRENT_FL'] != "") {
                    $search_where .= "AND C.CURRENT_FL = '".$_search['CURRENT_FL']."' ";
                } else {
                    $search_where .= "AND C.CURRENT_FL = 'Y' ";
                }

                $sql = "SELECT
                            C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.BODY, C.CONTENT_ST, C.REG_UID, C.REG_NM, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT,
                            C.CURRENT_FL, C.MODIFY_FL, C.HIT_CNT, C.SCRAP_CNT, C.TASK_NO, T.EDITOR_ID, T.SUMMARY
                        FROM
                            CMS_CONTENT C, CMS_TASK T
                        WHERE
                            C.TASK_NO = T.NO
                            ".$search_where."
                            AND T.NO = ".$_key."
                        ";

                $data  = $_d->sql_fetch($sql);

                if ($data != null) {
                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB, F.FILE_EXT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'CONTENT'
                                AND F.TARGET_NO = ".$data['NO']."
                            ";

                    $data['FILES'] = $_d->getData($sql);

                    $sql = "SELECT
                                U.USER_ID, U.USER_NM, U.PHONE_1, U.PHONE_2, U.EMAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.INTRO, U.NOTE
                            FROM
                                COM_USER U
                            WHERE
                                U.USER_ID = '".$data['EDITOR_ID']."'
                            ";

                    $data['EDITOR'] = $_d->sql_fetch($sql);
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == "list") {
                $search_where = "";

                if (isset($_phase)) {
                    $in_str = "";
                    $arr_phase = explode(',', $_phase);
                    for($i=0;$i< sizeof($arr_phase);$i++){
                        $in_str = $in_str."'".$arr_phase[$i]."'";
                        if (sizeof($arr_phase) - 1 != $i) $in_str = $in_str.",";
                    }

                    $search = "AND C.PHASE IN (".$in_str.")";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SUPER_NO, PHASE, VERSION, BODY, CONTENT_ST, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CURRENT_FL, MODIFY_FL, HIT_CNT, SCRAP_CNT, TASK_NO
                        FROM
                        (
                            SELECT
                                C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.BODY, C.CONTENT_ST, C.REG_UID, C.REG_NM, C.REG_DT,
                                C.CURRENT_FL, C.MODIFY_FL, C.HIT_CNT, C.SCRAP_CNT, C.TASK_NO
                            FROM
                                CMS_CONTENT C, CMS_TASK T
                            WHERE
                                C.TASK_NO = T.NO
                                AND C.CURRENT_FL = 'Y'
                                ".$search_where."
                            ORDER BY C.REG_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_CONTENT C, CMS_TASK T
                            WHERE
                                C.TASK_NO = T.NO
                                AND C.CURRENT_FL = 'Y'
                                ".$search_where."
                        ) CNT
                        ";
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
/*
            $upload_path = '../upload/';
            $source_path = '../../../';

            if (count($form['FILES']) > 0) {
                $files = $form['FILES'];

//                @mkdir('$source_path');

                for ($i = 0 ; $i < count($form['FILES']); $i++) {
                    $file = $files[$i];

                    if (file_exists($upload_path.$file['name'])) {
                        rename($upload_path.$file['name'], $source_path.$file['name']);
                    }
                }
            }
*/
//            MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

            if ($_type == "new") {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/cms/';
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
                                rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);

                                MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i]['path']);

                                $body_str = str_replace($file['mediumUrl'], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                            }
                        }
                    }

                    $_model['BODY'] = $body_str;
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                if ( !isset($_model['PHASE']) || $_model['PHASE'] == "" || $_model['PHASE'] == "0") {
                    $_model['PHASE'] = '10';
                }

                if ( trim($_model['CONTENT_ST']) == "" ) {
                    $_model['CONTENT_ST'] = '0';
                }

                $task_no = 0;
                $task_st = '1';

                if ( trim($_model['TASK_NO']) != "" ) {
                    $task_no = $_model['TASK_NO'];
                }

                if (count($_model['TASK']) > 0) {
                    $task = $_model['TASK'];
                    $task_no = $task['NO'];
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                MtUtil::_d("### ['SUPER_NO'] ".( empty($form['SUPER_NO']) ? 0 : $form['SUPER_NO']) );

                $sql = "INSERT INTO CMS_CONTENT
                        (
                            SUPER_NO
                            ,PHASE
                            ,VERSION
                            ,BODY
                            ,CONTENT_ST
                            ,REG_UID
                            ,REG_NM
                            ,REG_DT
                            ,CURRENT_FL
                            ,MODIFY_FL
                            ,HIT_CNT
                            ,SCRAP_CNT
                            ,TASK_NO
                        ) VALUES (
                            ".(!empty($_model['SUPER_NO']) ? $_model['SUPER_NO'] : !empty($_model['NO']) ? $_model['NO'] : 0)."
                            ,'".$_model['PHASE']."'
                            ,'".$_model['VERSION']."'
                            ,'".$_model['BODY']."'
                            ,'".$_model['CONTENT_ST']."'
                            ,'".$_SESSION['uid']."'
                            ,'".$_SESSION['name']."'
                            ,SYSDATE()
                            ,'Y'
                            ,'N'
                            ,'0'
                            ,'0'
                            ,".$task_no."
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$_model['PHASE']."',
                            SUMMARY = '".$_model['SUMMARY']."'
                        WHERE
                            NO = ".$task_no."
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
                                    , 'CONTENT'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if (!empty($_model['NO']) && $_model['PHASE'] > 0) {
                    $sql = "UPDATE CMS_CONTENT
                            SET
                                CURRENT_FL = '1'
                            WHERE
                                NO = ".$_model['NO']."
                            ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
    /*
                if (!($_d->mysql_errno > 0) && ($project_st == 0)) {
                    $sql = "UPDATE CMS_PROJECT
                            SET
                                PROJECT_ST = '1'
                            WHERE
                                NO = ".$project_no."
                            ";

                    $_d->sql_query($sql);
                }
    */
                if ($err > 0) {
                    $_d->sql_rollback();

                    for ($i = 0 ; $i < count($insert_path); $i++) {
                        if (file_exists($source_path.$insert_path['i']['uid'])) {
                            unlink($source_path.$insert_path['i']['uid']);
                            unlink($source_path.'thumbnail/'.$insert_path['i']['uid']);
                            unlink($source_path.'medium/'.$insert_path['i']['uid']);
                        }
                    }

                    $_d->failEnd("등록실패입니다:".$msg);
                } else {
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
                                ,ETC
                            ) VALUES (
                                '".$task_no."'
                                ,'CREATE'
                                ,SYSDATE()
                                ,'".$_SESSION['uid']."'
                                ,'".$no."'
                                ,'CONTENT'
                                ,'CREATE'
                                ,'".$ip."'
                                ,'/content'
                                ,''
                            )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "version") {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/cms/';
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
                                rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);

                                MtUtil::_d("------------>>>>> mediumUrl : ".$file['mediumUrl']);
                                MtUtil::_d("------------>>>>> mediumUrl : ".BASE_URL.$source_path.'medium/'.$uid);

                                $body_str = str_replace($file['mediumUrl'], BASE_URL.$file_path.'medium/'.$uid, $body_str);

                                MtUtil::_d("------------>>>>> body_str : ".$body_str);
                            } else {
                                $uid = uniqid();

                                $file_url = explode('/', $file['url']);
                                $file_name = end($file_url);
                                copy($source_path.$file_name, $source_path.$uid);
                                copy($source_path.'thumbnail/'.$file_name, $source_path.'thumbnail/'.$uid);
                                copy($source_path.'medium/'.$file_name, $source_path.'medium/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind']);
                            }
                        }
                    }

                    $_model['BODY'] = $body_str;
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                if ( !isset($_model['PHASE']) || $_model['PHASE'] == "" ) {
                    $_model['PHASE'] = '20';
                }

                if ( $_model['PHASE'] == "13" ) {
                    $_model['PHASE'] = '20';
                }

                if ( trim($_model['CONTENT_ST']) == "" ) {
                    $_model['CONTENT_ST'] = '0';
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE CMS_CONTENT
                        SET
                            CURRENT_FL = 'N'
                        WHERE
                            TASK_NO = ".$_model['TASK']['NO']."
                        ";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "INSERT INTO CMS_CONTENT
                        (
                            SUPER_NO
                            ,PHASE
                            ,VERSION
                            ,BODY
                            ,CONTENT_ST
                            ,REG_UID
                            ,REG_NM
                            ,REG_DT
                            ,CURRENT_FL
                            ,MODIFY_FL
                            ,HIT_CNT
                            ,SCRAP_CNT
                            ,TASK_NO
                        ) VALUES (
                            ".$_model['NO']."
                            ,'".$_model['TASK']['PHASE']."'
                            ,'".$_model['VERSION']."'
                            ,'".$_model['BODY']."'
                            ,'".$_model['CONTENT_ST']."'
                            ,'".$_SESSION['uid']."'
                            ,'".$_SESSION['name']."'
                            ,SYSDATE()
                            ,'Y'
                            ,'N'
                            ,'0'
                            ,'0'
                            ,".$_model['TASK']['NO']."
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
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
                                        , '".$file['kind']."'
                                        , '".$i."'
                                        , '".$no."'
                                        , 'CONTENT'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();

                    for ($i = 0 ; $i < count($insert_path); $i++) {
                        if (file_exists($source_path.$insert_path['i']['uid'])) {
                            unlink($source_path.$insert_path['i']['uid']);
                            unlink($source_path.'thumbnail/'.$insert_path['i']['uid']);
                            unlink($source_path.'medium/'.$insert_path['i']['uid']);
                        }
                    }

                    $_d->failEnd("등록실패입니다:".$msg);
                } else {
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
                                ,ETC
                            ) VALUES (
                                '".$_model['TASK']['NO']."'
                                ,'CREATE'
                                ,SYSDATE()
                                ,'".$_SESSION['uid']."'
                                ,'".$no."'
                                ,'CONTENT'
                                ,'CREATE'
                                ,'".$ip."'
                                ,'/content'
                                ,''
                            )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }
            break;

        case "PUT":
            if (!isset($_key) || $_key == "") {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

            if (isset($_phase)) {
                $_d->sql_beginTransaction();

                $sql = "UPDATE CMS_CONTENT
                        SET
                            PHASE = '".$_phase."'
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$_phase."'
                        WHERE
                            NO = ( SELECT TASK_NO FROM CMS_CONTENT C WHERE C.NO = ".$_key.")
                        ";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if (isset($_modify)) {
                $sql = "UPDATE CMS_CONTENT
                        SET
                            MODIFY_FL = '".$_modify."'
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
            } else {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/cms/';
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
                                rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file['kind'], no => '');

                                MtUtil::_d("------------>>>>> mediumUrl : ".$file['mediumUrl']);
                                MtUtil::_d("------------>>>>> mediumUrl : ".BASE_URL.$source_path.'medium/'.$uid);

                                $body_str = str_replace($file['mediumUrl'], BASE_URL.$file_path.'medium/'.$uid, $body_str);

                                MtUtil::_d("------------>>>>> body_str : ".$body_str);
                            } else {
                                $insert_path[$i] = array(path => '', uid => '', kind => $file['kind'], no => $file['no']);
                            }
                        }
                    }

                    $_model['BODY'] = $body_str;
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if ( trim($_model['PHASE']) == "" ) {
                    $_model['PHASE'] = '10';
                }

                if ( trim($_model['CONTENT_ST']) == "" ) {
                    $_model['CONTENT_ST'] = '0';
                }

                $task_no = 0;
                $task_st = "1";
                $task_phase = "";

                if ( trim($_model['TASK_NO']) != "" ) {
                    $task_no = $_model['TASK_NO'];
                }

                if ($_model['TASK'] != "") {
                    $task = $_model['TASK'];
                    $task_no = $task['NO'];
                    $task_phase = $task['PHASE'];
                }

                MtUtil::_d("------------>>>>> count_task___________ : ".$_model['TASK']);

                $sql = "UPDATE CMS_CONTENT
                        SET
                            SUPER_NO = ".((!empty($_model['SUPER_NO'])) ? $_model['SUPER_NO'] : (!empty($_model['NO']) ? $_model['NO'] : 0))."
                            ,PHASE = '".$_model['TASK']['PHASE']."'
                            ,VERSION = '".$_model['VERSION']."'
                            ,BODY = '".$_model['BODY']."'
                            ,CONTENT_ST = '".$_model['CONTENT_ST']."'
                            ,CURRENT_FL = '".$_model['CURRENT_FL']."'
                            ,MODIFY_FL = '".$_model['MODIFY_FL']."'
                            ,HIT_CNT = ".(empty($_model['HIT_CNT']) ? 0 : $_model['HIT_CNT'])."
                            ,SCRAP_CNT = ".(empty($_model['SCRAP_CNT']) ? 0 : $_model['SCRAP_CNT'])."
                            ,TASK_NO = ".$task_no."
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (trim($task_phase) != "") {
                    $sql = "UPDATE CMS_TASK
                            SET
                                PHASE = '".$task_phase."',
                                SUMMARY = '".$_model['SUMMARY']."'
                            WHERE
                                NO = ".$task_no."
                            ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_FILE F
                        WHERE
                            F.TARGET_GB = 'CONTENT'
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

                        MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);

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
                                        , 'CONTENT'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        } else {
                            $sql = "UPDATE COM_FILE
                                    SET
                                        FILE_GB = '".$file['kind']."'
                                    WHERE
                                        NO = '".$file['no']."'
                                    ";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();

                    for ($i = 0 ; $i < count($insert_path); $i++) {
                        if (file_exists($source_path.$insert_path['i']['uid'])) {
                            unlink($source_path.$insert_path['i']['uid']);
                            unlink($source_path.'thumbnail/'.$insert_path['i']['uid']);
                            unlink($source_path.'medium/'.$insert_path['i']['uid']);
                        }
                    }

                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
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
                                ,ETC
                            ) VALUES (
                                '".$task_no."'
                                ,'UPDATE'
                                ,SYSDATE()
                                ,'".$_SESSION['uid']."'
                                ,'".$_key."'
                                ,'CONTENT'
                                ,'UPDATE'
                                ,'".$ip."'
                                ,'/content'
                                ,''
                            )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;

        case "DELETE":
            if (!isset($id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_CONTENT WHERE NO = ".$id;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;
    }
?>