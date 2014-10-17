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

//	MtUtil::_c(print_r($_REQUEST,true));
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
            if (isset($id)){
//                MtUtil::_c("FUNC[processApi] 1 : "+$id);

                $sql = "SELECT
                          NO, SUBJECT, BODY, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                          CMS_BOARD
                        WHERE
                          NO = ".$id."
                        ";
                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }
            else {
//                MtUtil::_c("FUNC[processApi] 2 : ");

                $sql = "SELECT
                          TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                          NO, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                        (
                            SELECT
                                NO, SUBJECT, REG_UID, REG_NM, REG_DT
                            FROM
                                CMS_BOARD
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_BOARD
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
            $form = json_decode(file_get_contents("php://input"),true);

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

//            MtUtil::_c("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            if( trim($form[SUBJECT]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }
            if( trim($form[BODY]) == "" ){
                $_d->failEnd("내용이 비어있습니다");
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_BOARD
                    (
                        SUBJECT
                        ,BODY
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                    ) VALUES (
                        '".$form[SUBJECT]."'
                        , '".$form[BODY]."'
                        , '".$form[REG_UID]."'
                        , '".$form[REG_NM]."'
                        , SYSDATE()
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            MtUtil::_c("------------>>>>> NO : ".$no);
            MtUtil::_c("------------>>>>> files : ".$form[FILES]);
            MtUtil::_c("------------>>>>> files size : ".count($form[FILES]));

            if (count($form[FILES]) > 0) {
                $files = $form[FILES];

                for ($i = 0 ; $i < count($form[FILES]); $i++) {
                    $file = $files[$i];
                    MtUtil::_c("------------>>>>> file : ".$file['name']);

                    $sql = "INSERT INTO FILE
                    (
                        FILE_NM
                        ,PATH
                        ,FILE_EXT
                        ,FILE_SIZE
                        ,THUMB_FL
                        ,REG_DT
                        ,FILE_ST
                    ) VALUES (
                        '".$file[name]."'
                        , '".$file[BODY]."'
                        , '".$file[type]."'
                        , '".$file[size]."'
                        , 'N'
                        , SYSDATE()
                        , 'C'
                    )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    $sql = "INSERT INTO CONTENT_SOURCE
                    (
                        TARGET_NO
                        ,SOURCE_NO
                        ,CONTENT_GB
                        ,SORT_IDX
                    ) VALUES (
                        '".$no."'
                        , '".$file_no."'
                        , 'FILE'
                        , '".$i."'
                    )";

                    $_d->sql_query($sql);
                }
            }

            MtUtil::_c("------------>>>>> mysql_errno : ".$_d->mysql_errno);

            if($_d->mysql_errno > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

        case "PUT":
            if (!isset($id)){
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            }

            $FORM = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            if( trim($FORM[SUBJECT]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }
            if( trim($FORM[BODY]) == "" ){
                $_d->failEnd("내용이 비어있습니다");
            }

            $sql = "UPDATE CMS_BOARD
                    SET
                        SUBJECT = '".$FORM[SUBJECT]."'
                        ,BODY = '".$FORM[BODY]."'
                        ,REG_UID = '".$FORM[REG_UID]."'
                        ,REG_NM = '".$FORM[REG_NM]."'
                        ,REG_DT = SYSDATE()
                    WHERE
                        NO = ".$id."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;
            if($_d->mysql_errno > 0){
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            }else{
                $_d->succEnd($no);
            }

        case "DELETE":
            if (isset($id)){
                $sql = "DELETE FROM CMS_BOARD WHERE NO = ".$id;

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;
                if($_d->mysql_errno > 0){
                    $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
                }else{
                    $_d->succEnd($no);
                }
            }
            break;
    }
?>