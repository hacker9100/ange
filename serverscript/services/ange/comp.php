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

    MtUtil::_d(json_encode(file_get_contents("php://input"),true));

    //	MtUtil::_d(print_r($_REQUEST,true));
    /*
        if (isset($_REQUEST['_category'])) {
            $category = explode("/", $_REQUEST['_category']);

            Util::_c("FUNC[processApi] category : ".print_r($_REQUEST,true));
            Util::_c("FUNC[processApi] category.cnt : ".count($category));
        }
    */

    //$_d = new MtJson(null);
    $_d = new MtJson('ad');

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
        if ($_type == "check") {

//            if (!isset($_SESSION['uid'])) {
//                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
//            }

            $sql = "SELECT COUNT(*) AS COMP_CNT
                 FROM adm_history_join
                 WHERE ada_idx = ".$_search[ada_idx]."
                   AND adu_id = '".$_SESSION['uid']."'";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        } else if ($_type == "samplepackCheck") {

//            if (!isset($_SESSION['uid'])) {
//                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
//            }

            $sql = "SELECT COUNT(*) AS COMP_CNT
                 FROM adm_history_join
                 WHERE ada_idx = ".$_search[ada_idx]."
                   AND adu_id = '".$_SESSION['uid']."'";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        }

        break;

    case "POST":

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $FORM = json_decode(file_get_contents("php://input"),true);
        $_d->sql_beginTransaction();

        if($_type == "item") {

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/ad/';
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
                        rename($upload_path.$file[name], $source_path.$file[name]);
                        $insert_path = array(path => $file_path, name => $file[name], kind => $file[kind]);
                    }
                }

            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            // 응모/신청 광고센터 adm_history_join 테이블에 insert -> 실적통계에서 확인가능
            $sql = "INSERT INTO adm_history_join
                    (
                        ada_idx,
                        adu_id,
                        adu_name,
                        adhj_date_request,
                        adhj_answers
                    ) VALUES (
                         '".$_model[ada_idx]."'
                        , '".$_SESSION['uid']."'
                        , '".$_SESSION['name']."'
                        , NOW()
                        , '".$_model[ANSWER]."'
                    )";

            $_d->sql_query($sql);

            // 신청자명 증가
            $sql = "UPDATE adm_ad
                    SET  ada_count_request = ada_count_request + 1
                    WHERE ada_idx = '".$_model[ada_idx]."'";

            $_d->sql_query($sql);
        }
        if ($_d->mysql_errno > 0) {
            $_d->failEnd("등록실패입니다:".$_d->mysql_error);
        } else {
            $_d->sql_commit();
            $_d->succEnd($no);
        }

        break;

    case "PUT":
        break;

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $sql = "DELETE FROM adm_history_join WHERE adhj_idx = ".$_key;

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