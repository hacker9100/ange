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
            if (isset($id)) {
                $sql = "SELECT
                            P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.REG_UID, T.REG_NM, DATE_FORMAT(T.REG_DT, '%Y-%m-%d') AS REG_DT,
                            T.CLOSE_YMD, T.TAG, T.NOTE, T.PROJECT_NO
                        FROM
                            CMS_TASK T, CMS_PROJECT P
                        WHERE
                            T.PROJECT_NO = P.NO
                            AND T.NO = ".$id."
                        ";
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            } else {
                $search = "";

                if (isset($_phase)) {
                    $in_str = "";
                    $arr_phase = explode(',', $_phase);
                    for($i=0;$i< sizeof($arr_phase);$i++){
                        $in_str = $in_str."'".$arr_phase[$i]."'";
                        if (sizeof($arr_phase) - 1 != $i) $in_str = $in_str.",";
                    }

                    $search = "AND T.PHASE IN (".$in_str.")";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            PROJECT_NM, NO, PHASE, SUBJECT, EDITOR_ID, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CLOSE_YMD, TAG, NOTE, PROJECT_NO
                        FROM
                        (
                            SELECT
                                P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.REG_UID, T.REG_NM, T.REG_DT,
                                T.CLOSE_YMD, T.TAG, T.NOTE, T.PROJECT_NO
                            FROM
                                CMS_TASK T, CMS_PROJECT P
                            WHERE
                                T.PROJECT_NO = P.NO
                                ".$search."
                            ORDER BY T.REG_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_TASK T
                            WHERE
                                1 = 1
                                ".$search."
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
            $form = json_decode(file_get_contents("php://input"),true);
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
            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($form[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($form[PHASE]) == "" ) {
                $form[PHASE] = '0';
            }

            $project_no = 0;
            $project_st = '1';

            if ( trim($form[PROJECT_NO]) != "" ) {
                $project_no = $form[PROJECT_NO];
            }

            if (count($form[PROJECT]) > 0) {
                $project = $form[PROJECT];
                $project_no = $project[NO];
                $project_st = $project[PROJECT_ST];
            }

            $_d->sql_beginTransaction();

            MtUtil::_c("### [SUPER_NO] ".( empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO]) );

            $sql = "INSERT INTO CMS_TASK
                    (
                        PHASE
                        ,SUBJECT
                        ,EDITOR_ID
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                        ,CLOSE_YMD
                        ,PROJECT_NO
                        ,TAG
                        ,NOTE
                    ) VALUES (
                        '".$form[PHASE]."'
                        ,'".$form[SUBJECT]."'
                        ,'".$form[EDITOR_ID]."'
                        ,'".$form[REG_UID]."'
                        ,'".$form[REG_NM]."'
                        ,SYSDATE()
                        ,'".$form[CLOSE_YMD]."'
                        ,".$project_no."
                        ,'".$form[TAG]."'
                        ,'".$form[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (!empty($form[NO]) && $form[PHASE] > 0) {
                $sql = "UPDATE CONTENT
                        SET
                            CURRENT_FL = '1'
                        WHERE
                            NO = ".$form[NO]."
                        ";

                $_d->sql_query($sql);
            }

            if (!($_d->mysql_errno > 0) && ($project_st == 0)) {
                $sql = "UPDATE CMS_PROJECT
                        SET
                            PROJECT_ST = '1'
                        WHERE
                            NO = ".$project_no."
                        ";

                $_d->sql_query($sql);
            }

            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($id)) {
                $_d->failEnd("수정실패입니다:"."ID가 누락되었습니다.");
            }

            $form = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if (isset($_phase)) {
                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$_phase."'
                        WHERE
                            NO = ".$id."
                        ";
            } else {

                if ( trim($form[SUBJECT]) == "" ) {
                    $_d->failEnd("제목을 작성 하세요");
                }

                if ( trim($form[PHASE]) == "" ) {
                    $form[PHASE] = '0';
                }

                $project_no = 0;
                $project_st = '1';

                if ( trim($form[PROJECT_NO]) != "" ) {
                    $project_no = $form[PROJECT_NO];
                }

                if (count($form[PROJECT]) > 0) {
                    $project = $form[PROJECT];
                    $project_no = $project[NO];
                    $project_st = $project[PROJECT_ST];
                }

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$form[PHASE]."'
                            ,SUBJECT = '".$form[SUBJECT]."'
                            ,EDITOR_ID = '".$form[EDITOR_ID]."'
                            ,REG_UID = '".$form[REG_UID]."'
                            ,REG_NM = '".$form[REG_NM]."'
                            ,CLOSE_YMD = '".$form[CLOSE_YMD]."'
                            ,PROJECT_NO = ".$project_no."
                            ,TAG = '".$form[TAG]."'
                            ,NOTE = '".$form[NOTE]."'
                        WHERE
                            NO = ".$id."
                        ";
            }

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_TASK WHERE NO = ".$id;

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