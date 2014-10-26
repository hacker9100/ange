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

    $_d = new MtJson();

    switch ($_method) {
        case "GET":
            if (isset($id)) {
                $sql = "SELECT
                            USER_ID, USER_NM, EMAIL
                        FROM
                            CMS_USER
                        WHERE
                            USER_ID = '".$id."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    if (!isset($_SESSION)) {
                        session_start();
                    }
                    MtUtil::_c("-------------->>>>>>>>>>>>>".$data['USER_ID']);
                    $_SESSION['uid'] = $data['USER_ID'];
                    $_SESSION['name'] = $data['USER_NM'];
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
                        unset($_SESSION['timeout']);
                    }
                } else {
                    if(isset($_SESSION['uid']))
                    {
                        $sess['USER_ID'] = $_SESSION['uid'];
                        $sess['USER_NM'] = $_SESSION['name'];
//                    $sess['EMAIL'] = $_SESSION['email'];
                        $_SESSION['timeout'] = time();
                    }
                    else
                    {
                        $sess['USER_ID'] = '';
                        $sess['USER_NM'] = 'Guest';
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
//                unset($_SESSION['email']);
                unset($_SESSION['timeout']);
            }

            break;
    }
?>