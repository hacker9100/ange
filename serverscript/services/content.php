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
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC[processApi] category.cnt : ".count($category));
    }
*/
    $_d = new MtJson();

    switch ($_method) {
        case "GET":
            if (isset($_key) && $_key != "") {
                $sql = "SELECT
                            C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.BODY, C.CONTENT_ST, C.REG_UID, C.REG_NM, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT,
                            C.CURRENT_FL, C.MODIFY_FL, C.HIT_CNT, C.SCRAP_CNT, C.TASK_NO
                        FROM
                            CONTENT C, CMS_TASK T
                        WHERE
                            C.TASK_NO = T.NO
                            AND C.CURRENT_FL = '0'
                            AND T.NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($data != null) {
                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                FILE F, CONTENT_SOURCE S
                            WHERE
                                F.NO = S.SOURCE_NO
                                AND S.TARGET_NO = ".$data[NO]."
                                AND F.THUMB_FL = '0'
                            ";

                    $file_data = $_d->getData($sql);

                    $data['FILES'] = $file_data;
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else {
                $where_search = "";

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
                                CONTENT C, CMS_TASK T
                            WHERE
                                C.TASK_NO = T.NO
                                AND C.CURRENT_FL = '0'
                                ".$where_search."
                            ORDER BY C.REG_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CONTENT C, CMS_TASK T
                            WHERE
                                C.TASK_NO = T.NO
                                AND C.CURRENT_FL = '0'
                                ".$where_search."
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

            if (count($form[FILES]) > 0) {
                $files = $form[FILES];

//                @mkdir('$source_path');

                for ($i = 0 ; $i < count($form[FILES]); $i++) {
                    $file = $files[$i];

                    if (file_exists($upload_path.$file[name])) {
                        rename($upload_path.$file[name], $source_path.$file[name]);
                    }
                }
            }
*/
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $upload_path = '../../upload/files/';
            $file_path = '/storage/'.date('Y').'/'.date('m').'/';
            $source_path = '../..'.$file_path;
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

                            MtUtil::_c("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);

                            $body_str = str_replace($file[mediumUrl], 'http://localhost'.$file_path.'medium/'.$uid, $body_str);
                        }
                    }
                }

                $_model[BODY] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            if ( trim($_model[PHASE]) == "" ) {
                $_model[PHASE] = '10';
            }

            if ( trim($_model[CONTENT_ST]) == "" ) {
                $_model[CONTENT_ST] = '0';
            }

            $task_no = 0;
            $task_st = '1';

            if ( trim($_model[TASK_NO]) != "" ) {
                $task_no = $_model[TASK_NO];
            }

            if (count($_model[TASK]) > 0) {
                $task = $_model[TASK];
                $task_no = $task[NO];
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            MtUtil::_c("### [SUPER_NO] ".( empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO]) );

            $sql = "INSERT INTO CONTENT
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
                        ".(!empty($_model[SUPER_NO]) ? $_model[SUPER_NO] : !empty($_model[NO]) ? $_model[NO] : 0)."
                        ,'".$_model[PHASE]."'
                        ,'".$_model[VERSION]."'
                        ,'".$_model[BODY]."'
                        ,'".$_model[CONTENT_ST]."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'0'
                        ,'".$_model[MODIFY_FL]."'
                        ,".(empty($_model[HIT_CNT]) ? 0 : $_model[HIT_CNT])."
                        ,".(empty($_model[SCRAP_CNT]) ? 0 : $_model[SCRAP_CNT])."
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
                            PHASE = '".$_model[PHASE]."'
                        WHERE
                            NO = ".$task_no."
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
                    ) VALUES (
                        '".$file[name]."'
                        , '".$insert_path[$i][uid]."'
                        , '".$insert_path[$i][path]."'
                        , '".$file[type]."'
                        , '".$file[size]."'
                        , '0'
                        , SYSDATE()
                        , 'C'
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
                        , 'CONTENT'
                        , '".$i."'
                    )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if (!empty($_model[NO]) && $_model[PHASE] > 0) {
                $sql = "UPDATE CONTENT
                        SET
                            CURRENT_FL = '1'
                        WHERE
                            NO = ".$_model[NO]."
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
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if (isset($_phase)) {
                $_d->sql_beginTransaction();

                $sql = "UPDATE CONTENT
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
                            NO = ( SELECT TASK_NO FROM CONTENT C WHERE C.NO = ".$_key.")
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
                $sql = "UPDATE CONTENT
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
                $upload_path = '../../upload/files/';
                $file_path = '/storage/'.date('Y').'/'.date('m').'/';
                $source_path = '../..'.$file_path;
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

                                $body_str = str_replace($file[mediumUrl], 'http://localhost'.$file_path.'medium/'.$uid, $body_str);

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

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if ( trim($_model[PHASE]) == "" ) {
                    $_model[PHASE] = '10';
                }

                if ( trim($_model[CONTENT_ST]) == "" ) {
                    $_model[CONTENT_ST] = '0';
                }

                $task_no = 0;
                $task_st = "1";
                $task_phase = "";

                if ( trim($_model[TASK_NO]) != "" ) {
                    $task_no = $_model[TASK_NO];
                }

                if (count($_model[TASK]) > 0) {
                    $task = $_model[TASK];
                    $task_no = $task[NO];
                    $task_phase = $task[PHASE];
                }

                $sql = "UPDATE CONTENT
                        SET
                            SUPER_NO = ".(!empty($_model[SUPER_NO]) ? $_model[SUPER_NO] : !empty($_model[NO] ? $_model[NO] : 0))."
                            ,PHASE = '".$task_phase."'
                            ,VERSION = '".$_model[VERSION]."'
                            ,BODY = '".$_model[BODY]."'
                            ,CONTENT_ST = '".$_model[CONTENT_ST]."'
                            ,CURRENT_FL = '".$_model[CURRENT_FL]."'
                            ,MODIFY_FL = '".$_model[MODIFY_FL]."'
                            ,HIT_CNT = ".(empty($_model[HIT_CNT]) ? 0 : $_model[HIT_CNT])."
                            ,SCRAP_CNT = ".(empty($_model[SCRAP_CNT]) ? 0 : $_model[SCRAP_CNT])."
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
                                PHASE = '".$task_phase."'
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
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'CONTENT'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
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

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE AND TARGET_GB = 'CONTENT' AND TARGET_NO = ".$row[NO];

                        $_d->sql_query($sql);

                        MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

                        if (file_exists('../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../..'.$row[PATH].$row[FILE_ID]);
                            unlink('../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                            unlink('../..'.$row[PATH].'medium/'.$row[FILE_ID]);
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
                        ) VALUES (
                            '".$file[name]."'
                            , '".$insert_path[$i][uid]."'
                            , '".$insert_path[$i][path]."'
                            , '".$file[type]."'
                            , '".$file[size]."'
                            , '0'
                            , SYSDATE()
                            , 'C'
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
                            , 'CONTENT'
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

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;

        case "DELETE":
            if (!isset($id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CONTENT WHERE NO = ".$id;

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