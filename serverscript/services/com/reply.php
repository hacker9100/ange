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
            if ($_type == 'item') {
                //TODO: 조회
            } else if ($_type == 'list') {
                //TODO: 목록 조회
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($_model[TASK_NO]) == "" ) {
                $_d->failEnd("댓글 순번이 없습니다");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_REPLY
                    (
                        PARENT_NO,
                        REPLY_NO,
                        REPLY_GB,
                        COMMENT,
                        REG_UID,
                        NICK_NM,
                        REG_NM,
                        REG_DATE,
                        LIKE_CNT,
                        TARGET_NO,
                        TARGET_GB
                    ) VALUES (
                        ".$_model[PARENT_NO].",
                        '".$_model[REPLY_NO]."',
                        '".$_model[REPLY_GB]."',
                        '".$_model[COMMENT]."',
                        '".$_SESSION['uid']."',
                        '".$_SESSION['name']."',
                        '".$_SESSION['nick']."',
                        SYSDATE(),
                        '".$_model[LIKE_CNT]."',
                        '".$_model[TARGET_NO]."',
                        '".$_model[TARGET_GB]."',
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

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

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE COM_REPLY
                    SET
                        PARENT_NO = '".$_model[SUBJECT]."',
                        REPLY_NO = '".$_model[SUBJECT]."',
                        REPLY_GB = '".$_model[SUBJECT]."',
                        COMMENT = '".$_model[SUBJECT]."',
                        #REG_UID = '".$_SESSION['uid']."',
                        #NICK_NM = '".$_SESSION['nick']."',
                        #REG_NM = '".$_SESSION['name']."',
                        #REG_DT = SYSDATE(),
                        LIKE_CNT = '".$_model[SUBJECT]."',
                        TARGET_NO = '".$_model[SUBJECT]."',
                        TARGET_GB = '".$_model[SUBJECT]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
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
            //TODO: 삭제

            break;
    }
?>