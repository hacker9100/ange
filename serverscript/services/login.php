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

    $_d = new MtJson();

    if ($_d->connect_db == "") {
        $_d->failEnd("DB 연결 실패. 시스템에 비정상적으로 작동합니다.");
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
            if (isset($_key) && $_key != "") {
//                $form = json_decode(file_get_contents("php://input"),true);
//                MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

                $where_search = "";

                if (!isset($_model[password]) || $_model[password] == "") {
                    $_d->failEnd("아이디나 패스워드를 확인해주세요.");
                }

                if (isset($_model[SYSTEM_GB]) && $_model[SYSTEM_GB] != "") {
                    $where_search .= "AND R.SYSTEM_GB  = '".$_model[SYSTEM_GB]."' ";
                }

                MtUtil::_c("### [PW] ".create_hash($password));

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.EMAIL, UR.ROLE_ID, U.PASSWORD, U.USER_ST
                        FROM
                            COM_USER U, USER_ROLE UR, COM_ROLE R
                        WHERE
                            U.USER_ID = '".$_key."'
                            AND U.USER_ID = UR.USER_ID
                            AND UR.ROLE_ID = R.ROLE_ID
                            ".$where_search."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($data) {
                    if ( $data['USER_ST'] == "F") {
                        $_d->failEnd("이용이 정지된 사용자입니다. 관리자에게 문의하세요.");
                    }

                    if ( !validate_password($_model[password], $data['PASSWORD'])) {
                        $_d->failEnd("아이디나 패스워드를 확인해주세요.");
                    }

                    $sql = "SELECT
                                M.MENU_ID, M.ROLE_ID, M.MENU_FL, M.LIST_FL, M.VIEW_FL, M.EDIT_FL, M.MODIFY_FL
                            FROM
                                USER_ROLE UR, COM_ROLE R, MENU_ROLE M
                            WHERE
                                UR.USER_ID = '".$_key."'
                                AND R.ROLE_ID = M.ROLE_ID
                                AND UR.ROLE_ID = R.ROLE_ID
                                ".$where_search."
                            ";

                    $role_data = $_d->getData($sql);
                    $data['MENU_ROLE'] = $role_data;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                } else {
                    $_d->failEnd("아이디나 패스워드를 확인해주세요.");
                }

                if ($err > 0) {
                    $_d->failEnd("조회실패입니다:".$msg);
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
                    ) VALUES (
                        '".$_model[WORK_ID]."'
                        ,'CMS_LOGIN'
                        ,SYSDATE()
                        ,'".$data[USER_ID]."'
                        ,''
                        ,''
                        ,''
                        ,'".$ip."'
                        ,'/signin'
                    )";

                    $_d->sql_query($sql);

                    if (!isset($_SESSION)) {
                        session_start();
                    }
                    $_SESSION['uid'] = $data['USER_ID'];
                    $_SESSION['name'] = $data['USER_NM'];
                    $_SESSION['role'] = $data['ROLE_ID'];
                    $_SESSION['menu_role'] = $data['MENU_ROLE'];
                    $_SESSION['timeout'] = time();

                    $_d->dataEnd2($data);
                }
            } else {
                if (!isset($_SESSION)) {
                    session_start();
                }

                $sess = array();

                if(isset($_SESSION['timeout']) && time() - $_SESSION['timeout'] > 1800) {
                    if(isset($_SESSION['uid']))
                    {
                        unset($_SESSION['uid']);
                        unset($_SESSION['name']);
                        unset($_SESSION['role']);
                        unset($_SESSION['menu_role']);
                        unset($_SESSION['timeout']);
                    }
                } else {
                    if(isset($_SESSION['uid']))
                    {
                        $sess['USER_ID'] = $_SESSION['uid'];
                        $sess['USER_NM'] = $_SESSION['name'];
                        $sess['ROLE_ID'] = $_SESSION['role'];
                        $sess['MENU_ROLE'] = $_SESSION['menu_role'];
//                    $sess['EMAIL'] = $_SESSION['email'];
                        $_SESSION['timeout'] = time();
                    }
                    else
                    {
                        $sess['USER_ID'] = '';
                        $sess['USER_NM'] = 'Guest';
                        $sess['ROLE_ID'] = '';
                        $sess['MENU_ROLE'] = '';
//                    $sess['EMAIL'] = '';
                    }
                }

                $_d->dataEnd2($sess);
            }

            break;

        case "DELETE":

            if (!isset($_SESSION)) {
                session_start();
            }
            if(isSet($_SESSION['uid']))
            {
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
                    ) VALUES (
                        '".$_model[WORK_ID]."'
                        ,'CMS_LOGOUT'
                        ,SYSDATE()
                        ,'".$_SESSION[uid]."'
                        ,''
                        ,''
                        ,''
                        ,'".$ip."'
                        ,'/signin'
                    )";

                $_d->sql_query($sql);

                unset($_SESSION['uid']);
                unset($_SESSION['name']);
                unset($_SESSION['role']);
                unset($_SESSION['menu_role']);
//                unset($_SESSION['email']);
                unset($_SESSION['timeout']);
            }

            $_d->succEnd("ok");

            break;
    }
?>