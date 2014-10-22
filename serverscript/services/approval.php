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
                            P.SUBJECT AS PROJECT_NM, C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.SUBJECT, C.BODY, C.EDITOR_ID, C.CONTENT_ST, C.REG_UID, C.REG_NM, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT,
                            C.CURRENT_FL, C.APPLY_YM, C.MODIFY_FL, C.BEGIN_DT, C.CLOSE_DT, C.FINISH_DT, C.CONTENTS, C.HIT_CNT, C.SCRAP_CNT, C.PROJECT_NO
                        FROM
                            CONTENT C, CMS_PROJECT P
                        WHERE
                            C.PROJECT_NO = P.NO
                            AND C.CURRENT_FL = '0'
                            AND C.NO = ".$id."
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

                    $search = "AND C.PHASE IN (".$in_str.")";
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            PROJECT_NM, NO, SUPER_NO, PHASE, VERSION, SUBJECT, BODY, EDITOR_ID, CONTENT_ST, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CURRENT_FL, APPLY_YM, MODIFY_FL, BEGIN_DT, CLOSE_DT, FINISH_DT, CONTENTS, HIT_CNT, SCRAP_CNT, PROJECT_NO
                        FROM
                        (
                            SELECT
                                P.SUBJECT AS PROJECT_NM, C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.SUBJECT, C.BODY, C.EDITOR_ID, C.CONTENT_ST, C.REG_UID, C.REG_NM, C.REG_DT,
                                C.CURRENT_FL, C.APPLY_YM, C.MODIFY_FL, C.BEGIN_DT, C.CLOSE_DT, C.FINISH_DT, C.CONTENTS, C.HIT_CNT, C.SCRAP_CNT, C.PROJECT_NO
                            FROM
                                CONTENT C, CMS_PROJECT P
                            WHERE
                                C.PROJECT_NO = P.NO
                                AND C.CURRENT_FL = '0'
                                ".$search."
                            ORDER BY C.REG_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CONTENT C
                            WHERE
                                C.CURRENT_FL = '0'
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

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($form[CONTENT_NO]) == "" ) {
                $_d->failEnd("콘턴츠 순번이 없습니다");
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_APPROVAL
                    (
                        CONTENT_NO
                        ,APPROVAL_ST
                        ,APPROVER_ID
                        ,APPROVER_NM
                        ,APPROVAL_DT
                        ,NOTE
                    ) VALUES (
                        ".$form[CONTENT_NO]."
                        ,'".$form[APPROVAL_ST]."'
                        ,'".$form[APPROVAL_ID]."'
                        ,'".$form[APPROVAL_NM]."'
                        ,SYSDATE()
                        ,'".$form[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (!empty($form[APPROVAL_ST])) {

                if ($form[APPROVAL_ST] == '11')
                    $parse = '12';
                else
                    $parse = '13';

                $sql = "UPDATE CONTENT
                        SET
                            PHASE = ".$parse."
                        WHERE
                            NO = ".$form[CONTENT_NO]."
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
                $sql = "UPDATE CONTENT
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

                if ( trim($form[CONTENT_ST]) == "" ) {
                    $form[CONTENT_ST] = '0';
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

                $sql = "UPDATE CONTENT
                        SET
                            SUPER_NO = ".(!empty($form[SUPER_NO]) ? $form[SUPER_NO] : !empty($form[NO] ? $form[NO] : 0))."
                            ,PHASE = '".$form[PHASE]."'
                            ,VERSION = '".$form[VERSION]."'
                            ,SUBJECT = '".$form[SUBJECT]."'
                            ,BODY = '".$form[BODY]."'
                            ,EDITOR_ID = '".$form[EDITOR_ID]."'
                            ,CONTENT_ST = '".$form[CONTENT_ST]."'
                            ,REG_UID = '".$form[REG_UID]."'
                            ,REG_NM = '".$form[REG_NM]."'
                            ,CURRENT_FL = '".$form[CURRENT_FL]."'
                            ,APPLY_YM = '".$form[APPLY_YM]."'
                            ,MODIFY_FL = '".$form[MODIFY_FL]."'
                            ,BEGIN_DT = '".$form[BEGIN_DT]."'
                            ,CLOSE_DT = '".$form[CLOSE_DT]."'
                            ,FINISH_DT = '".$form[FINISH_DT]."'
                            ,CONTENTS = '".$form[CONTENTS]."'
                            ,HIT_CNT = ".(empty($form[HIT_CNT]) ? 0 : $form[HIT_CNT])."
                            ,SCRAP_CNT = ".(empty($form[SCRAP_CNT]) ? 0 : $form[SCRAP_CNT])."
                            ,PROJECT_NO = ".$project_no."
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