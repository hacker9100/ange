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

    MtUtil::_d("### [START]");
	MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC[processApi] category.cnt : ".count($category));
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
                $sql = "SELECT
                            WORK_ID, WORK_DT, WORKER_ID, OBJECT_ID, OBJECT_GB, ACTION_GB, IP, ACTION_PLACE, WORK_GB, ETC
                        FROM
                            CMS_HISTORY
                        WHERE
                            WORK_ID = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                if ( trim($_search[TASK_NO]) == "" ) {
                    $_d->failEnd("태스크 순번이 없습니다.");
                }

                $sql = "SELECT
                            H.WORK_ID, H.WORK_DT, H.WORKER_ID, U.USER_NM AS WORKER_NM, H.OBJECT_ID, H.OBJECT_GB, H.ACTION_GB, H.IP, H.ACTION_PLACE, H.WORK_GB, H.ETC
                        FROM
                            CMS_HISTORY H
                            LEFT OUTER JOIN COM_USER U ON H.WORKER_ID = U.USER_ID
                        WHERE
                            WORK_ID = '".$_search[TASK_NO]."'
                        ORDER BY H.WORK_DT ASC
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
            break;

        case "PUT":
            break;

        case "DELETE":
            break;
    }
?>