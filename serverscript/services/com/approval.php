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
//            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($_model[TASK_NO]) == "" ) {
                $_d->failEnd("태스크 순번이 없습니다");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_APPROVAL
                    (
                        TASK_NO
                        ,APPROVAL_ST
                        ,APPROVER_ID
                        ,APPROVER_NM
                        ,APPROVAL_DT
                        ,NOTE
                    ) VALUES (
                        ".$_model[TASK_NO]."
                        ,'".$_model[APPROVAL_ST]."'
                        ,'".$_model[APPROVAL_ID]."'
                        ,'".$_model[APPROVAL_NM]."'
                        ,SYSDATE()
                        ,'".$_model[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (!empty($_model[APPROVAL_ST])) {

                if ($_model[APPROVAL_ST] == '11')
                    $parse = '12';
                else if ($_model[APPROVAL_ST] == '12')
                    $parse = '13';
                else if ($_model[APPROVAL_ST] == '21')
                    $parse = '22';
                else if ($_model[APPROVAL_ST] == '22')
                    $parse = '30';

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$parse."'
                        WHERE
                            NO = ".$_model[TASK_NO]."
                        ";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($_model[APPROVAL_ST] == '22') {
                    $project_no;
                    $sql = "SELECT
                                PHASE, PROJECT_NO
                            FROM
                                CMS_TASK
                            WHERE
                                PROJECT_NO = (SELECT PROJECT_NO FROM CMS_TASK WHERE NO = ".$_model[TASK_NO].")
                    ";

                    $result = $_d->sql_query($sql,true);
                    $is_all = true;
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                        $project_no = $row[PROJECT_NO];
                        if ($row[PHASE] != '30') {
                            $is_all = false;
                        }
                    }

                    if ($is_all) {
                        $sql = "UPDATE CMS_PROJECT
                                SET
                                    PROJECT_ST = '2'
                                WHERE
                                    NO = ".$project_no."
                                ";

                        $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $sql = "INSERT INTO CMS_HISTORY
                    (
                        WORK_ID
                        ,WORK_GB
                        ,WORK_DT
                        ,WORKER_ID
                        ,OBJECT_ID
                        ,OBJECT_GB
                        ,ACTION_GB
                        ,IP
                        ,ACTION_PLACE
                        ,ETC
                    ) VALUES (
                        '".$_model[TASK_NO]."'
                        ,'APPROVAL'
                        ,SYSDATE()
                        ,'".$_SESSION['uid']."'
                        ,'".$_model[TASK_NO]."'
                        ,'TASK'
                        ,'".($_model[APPROVAL_ST] == '11' ? 'GIVE_BACK' : 'APPROVAL')."'
                        ,'".$ip."'
                        ,'/content'
                        ,''
                    )";

                $_d->sql_query($sql);

                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            //TODO: 수정

            break;

        case "DELETE":
            //TODO: 삭제

            break;
    }
?>