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
	include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/services/passwordHash.php");

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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {

            } else if ($_type == 'list') {

            }

            break;

        case "POST":

            break;

        case "PUT":

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        AND F.NO = S.SOURCE_NO
                        AND C.TASK_NO = '".$_key."'
                        AND S.CONTENT_GB = 'FILE'
                    ";

            $file_result = $_d->sql_query($sql);
            $file_data = $_d->sql_fetch_array($file_result);

            $sql = "DELETE FROM CONTENT_SOURCE WHERE SOURCE_NO = '".$_key."' AND CONTENT_GB = 'FILE'";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM FILE WHERE NO = '".$_key."'";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (file_exists('../../..'.$file_data[PATH].$file_data[FILE_ID])) {
                unlink('../../..'.$file_data[PATH].$file_data[FILE_ID]);
                unlink('../../..'.$file_data[PATH].'thumbnail/'.$file_data[FILE_ID]);
                unlink('../../..'.$file_data[PATH].'medium/'.$file_data[FILE_ID]);
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>