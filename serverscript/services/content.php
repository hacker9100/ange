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
                            NO, SUPER_NO, PHASE, VERSION, SUBJECT, BODY, EDITOR_ID, CONTENT_ST, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CURRENT_FL, APPLY_YM, MODIFY_FL, BEGIN_DT, CLOSE_DT, FINISH_DT, CONTENTS, HIT_CNT, SCRAP_CNT
                        FROM
                            CONTENT
                        WHERE
                            NO = ".$id."
                        ";
                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            } else {
                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SUPER_NO, PHASE, VERSION, SUBJECT, BODY, EDITOR_ID, CONTENT_ST, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CURRENT_FL, APPLY_YM, MODIFY_FL, BEGIN_DT, CLOSE_DT, FINISH_DT, CONTENTS, HIT_CNT, SCRAP_CNT
                        FROM
                        (
                            SELECT
                                NO, SUPER_NO, PHASE, VERSION, SUBJECT, BODY, EDITOR_ID, CONTENT_ST, REG_UID, REG_NM, REG_DT,
                                CURRENT_FL, APPLY_YM, MODIFY_FL, BEGIN_DT, CLOSE_DT, FINISH_DT, CONTENTS, HIT_CNT, SCRAP_CNT
                            FROM
                                CONTENT
                            ORDER BY REG_DT DESC
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CONTENT
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
            $upload_path = '../uploads/';
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

            $_d->sql_beginTransaction();

            MtUtil::_c("### [SUPER_NO] ".$form[SUPER_NO]);
            MtUtil::_c("### [SUPER_NO] ".( empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO]) );

            $sql = "INSERT INTO CONTENT
                    (
                        SUPER_NO,
                        PHASE,
                        VERSION,
                        SUBJECT,
                        BODY,
                        EDITOR_ID,
                        CONTENT_ST,
                        REG_UID,
                        REG_NM,
                        REG_DT,
                        CURRENT_FL,
                        APPLY_YM,
                        MODIFY_FL,
                        BEGIN_DT,
                        CLOSE_DT,
                        FINISH_DT,
                        CONTENTS,
                        HIT_CNT,
                        SCRAP_CNT
                    ) VALUES (
                        ".(empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO])."
                        , '".$form[PHASE]."'
                        , '".$form[VERSION]."'
                        , '".$form[SUBJECT]."'
                        , '".$form[BODY]."'
                        , '".$form[EDITOR_ID]."'
                        , '".$form[CONTENTS_ST]."'
                        , '".$form[REG_UID]."'
                        , '".$form[REG_NM]."'
                        , SYSDATE()
                        , '".$form[CURRENT_FL]."'
                        , '".$form[APPLY_YM]."'
                        , '".$form[MODIFY_FL]."'
                        , '".$form[BEGIN_DT]."'
                        , '".$form[CLOSE_DT]."'
                        , '".$form[FINISH_DT]."'
                        , '".$form[CONTENTS]."'
                        , ".(empty($form[HIT_CNT]) ? 0 : $form[HIT_CNT])."
                        , ".(empty($form[SCRAP_CNT]) ? 0 : $form[SCRAP_CNT])."
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

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

            $FORM = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($FORM[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            $sql = "UPDATE CONTENT
                    SET
                        SUPER_NO = ".(empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO])."
                        ,PHASE = '".$FORM[PHASE]."'
                        ,VERSION = '".$FORM[VERSION]."'
                        ,SUBJECT = '".$FORM[SUBJECT]."'
                        ,BODY = '".$FORM[BODY]."'
                        ,EDITOR_ID = '".$FORM[EDITOR_ID]."'
                        ,CONTENT_ST = '".$FORM[CONTENTS_ST]."'
                        ,REG_UID = '".$FORM[REG_UID]."'
                        ,REG_NM = '".$FORM[REG_NM]."'
                        ,REG_DT = SYSDATE()
                        ,CURRENT_FL = '".$FORM[CURRENT_FL]."'
                        ,APPLY_YM = '".$FORM[APPLY_YM]."'
                        ,MODIFY_FL = '".$FORM[MODIFY_FL]."'
                        ,BEGIN_DT = '".$FORM[BEGIN_DT]."'
                        ,CLOSE_DT = '".$FORM[CLOSE_DT]."'
                        ,FINISH_DT = '".$FORM[FINISH_DT]."'
                        ,CONTENTS = '".$FORM[CONTENTS]."'
                        ,HIT_CNT = ".(empty($form[HIT_CNT]) ? 0 : $form[HIT_CNT])."
                        ,SCRAP_CNT = ".(empty($form[SCRAP_CNT]) ? 0 : $form[SCRAP_CNT])."
                    WHERE
                        NO = ".$id."
                    ";

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