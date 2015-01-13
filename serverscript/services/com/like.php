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

            } else if ($_type == 'list') {

            }

            break;

        case "POST":
            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $update_table = "";

            if ($_model[TARGET_GB] == "CONTENT") {
                $update_table = "CMS_TASK";
            } else if ($_model[TARGET_GB] == "BOARD") {
                $update_table = "COM_BOARD";
            } else if ($_model[TARGET_GB] == "EVENT") {
                $update_table = "ANGE_EVENT";
            } else if ($_model[TARGET_GB] == "REVIEW") {
                $update_table = "COM_REVIEW";
            }

            if (isset($_model[LIKE_FL]) && $_model[LIKE_FL] != "") {
                if ($_model[LIKE_FL] == "N") {
                    $sql = "INSERT INTO ANGE_LIKE
                            (
                                TARGET_NO,
                                TARGET_GB,
                                REG_UID,
                                REG_DT
                            ) VALUES (
                                '".$_model[TARGET_NO]."',
                                '".$_model[TARGET_GB]."',
                                '".$_SESSION['uid']."',
                                SYSDATE()
                            )";

                    $_d->sql_query($sql);
                    $no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    if ($_model[TARGET_GB] == "CONTENT") {
                        $sql = "SELECT
                                    COUNT(*)
                                FROM
                                    ANGE_SCRAP
                                WHERE
                                    REG_UID = '".$_SESSION['uid']."'
                                    AND TARGET_NO = '".$_model[TARGET_NO]."'
                                    AND TARGET_GB = '".$_model[TARGET_GB]."'
                                ";

                        $result = $_d->sql_query($sql);
                        $data  = $_d->sql_fetch_array($result);

                        if (!$data) {
                            $sql = "INSERT INTO COM_SCRAP
                                    (
                                        TARGET_NO,
                                        TARGET_GB,
                                        REG_UID,
                                        NICK_NM,
                                        REG_NM,
                                        REG_DT
                                    ) VALUES (
                                         ".$_model[TARGET_NO]."
                                        , '".$_model[TARGET_GB]."'
                                        , '".$_SESSION['uid']."'
                                        , '".$_SESSION['nick']."'
                                        , '".$_SESSION['name']."'
                                        , SYSDATE()
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }

                    $sql = "UPDATE ".$update_table." SET
                                    LIKE_CNT = LIKE_CNT + 1
                             WHERE NO = ".$_model[TARGET_NO]."
                                ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                } else {
                    $sql = "DELETE FROM ANGE_LIKE
                            WHERE
                                REG_UID = '".$_SESSION['uid']."'
                                AND TARGET_NO = '".$_model[TARGET_NO]."'
                                AND TARGET_GB = '".$_model[TARGET_GB]."'
                            ";

                    $_d->sql_query($sql);
                    $no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    if ($_model[TARGET_GB] == "CONTENT") {
//                        $sql = "SELECT
//                                    COUNT(*)
//                                FROM
//                                    ANGE_LIKE
//                                WHERE
//                                    REG_UID = '".$_SESSION['uid']."'
//                                    AND TARGET_NO = '".$_model[TARGET_NO]."'
//                                    AND TARGET_GB = '".$_model[TARGET_GB]."'
//                                ";
//
//                        $result = $_d->sql_query($sql);
//                        $data  = $_d->sql_fetch_array($result);
//
//                        if (!$data) {
                            $sql = "DELETE FROM COM_SCRAP
                                    WHERE
                                        REG_UID = '".$_SESSION['uid']."'
                                        AND TARGET_NO = '".$_model[TARGET_NO]."'
                                        AND TARGET_GB = '".$_model[TARGET_GB]."'
                                    ";

                            $_d->sql_query($sql);
                            $no = $_d->mysql_insert_id;

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
//                    }

                    $sql = "UPDATE ".$update_table." SET
                                    LIKE_CNT = LIKE_CNT - 1
                             WHERE NO = ".$_model[TARGET_NO]."
                                ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            } else {

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

            $sql = "UPDATE COM_
                    SET
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