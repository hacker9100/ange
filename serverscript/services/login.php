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

    switch ($_method) {
        case "GET":
            if (isset($id)) {
                if (!isset($id)) {
                    $_d->failEnd("ID가 누락되었습니다.");
                }

                $form = json_decode(file_get_contents("php://input"),true);

                MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.EMAIL, R.ROLE_ID, U.PASSWORD
                        FROM
                            CMS_USER U, USER_ROLE R
                        WHERE
                            U.USER_ID = '".$id."'
                            AND U.USER_ID = R.USER_ID
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            M.MENU_ID, M.ROLE_ID, M.MENU_FL, M.LIST_FL, M.VIEW_FL, M.EDIT_FL, M.MODIFY_FL
                        FROM
                            USER_ROLE R, MENU_ROLE M
                        WHERE
                            R.USER_ID = '".$id."'
                           AND R.ROLE_ID = M.ROLE_ID;
                        ";

                $role_data = $_d->getData($sql);
                $data['MENU_ROLE'] = $role_data;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    if ( !validate_password($form[password], $data['PASSWORD'])) {
                        $_d->failEnd("아이디나 패스워드가 일치하지 않습니다.");
                    }

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