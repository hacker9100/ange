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

    MtUtil::_d("### ['START']");
	MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC['processApi'] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC['processApi'] category.cnt : ".count($category));
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
            break;

        case "POST":
            MtUtil::_d("### INFO ['maileage'] ".$_method);
            MtUtil::_d("### INFO ['maileage'] ".$user_id);

            if ($_type == 'mail') {
                $from_email = __SMTP_USR__;
                $from_user = __SMTP_USR_NM__;
                $to = $_model['EMAIL'];
                $to_user = $_model['USER_NM'];
                $headers = "From: hacker9100@gmail.com";
                $subject = "앙쥬에 오신걸 환영합니다. 이메일을 인증해 주세요.";
                $message = "안녕하세요. ".$_model['USER_NM']."회원님.<br>아래 링크를 클릭하면 이메일 인증이 완료됩니다. <br><br><a href='http://ange.marveltree.com/serverscript/services/external/interface.php?_method=POST&_type=mileage&user_id=hong&earn_gb=20150306&point=50'>마일리지 적립</a>";

                $return = MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user, null);
                $_d->succEnd('');
            } else if ($_type == 'point') {
                $err = 0;
                $msg = "";
                MtUtil::_d("### INFO ['maileage'] ".$user_id);
                if (!isset($user_id) || $user_id == '') {
                    MtUtil::_d("### ERROR ['maileage'] user_id");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('존재하지 않는 사용자 입니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                if (!isset($point) || $point == '') {
                    MtUtil::_d("### ERROR ['maileage'] point");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('적립 점수가 없습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                if (!isset($earn_gb) || $earn_gb == '') {
                    MtUtil::_d("### ERROR ['maileage'] earn_gb");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo ("<script language='javascript'>");
                    echo ("alert('인증할 수 없는 정보입니다.');");
                    echo ("window.location.href='".BASE_URL."';");
                    echo ("</script>");

                    exit();
                }

                $_d->sql_beginTransaction();

                $sql = "SELECT USER_ID, USER_NM, NICK_NM FROM COM_USER WHERE USER_ID = '".$user_id."'";
                $data  = $_d->sql_fetch($sql);

                if (!$data) {
                    MtUtil::_d("### ERROR ['maileage'] check");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('존재하지 않는 사용자 입니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                $sql = "SELECT COUNT(*) AS CNT FROM ANGE_USER_MILEAGE WHERE USER_ID = '".$user_id."' AND EARN_GB = '".$earn_gb."'";
                $data  = $_d->sql_fetch($sql);

                if ($data['CNT'] > 0) {
                    MtUtil::_d("### ERROR ['maileage'] duple");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('이미 적립된 사용자 입니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                $sql = "SELECT
                            NO, MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                        FROM
                            ANGE_MILEAGE
                        WHERE
                            POINT_ST = '0'
                            AND NO = '63'
                            AND MILEAGE_GB = '15'
                        ";

                $mileage_data = $_d->sql_fetch($sql);

                $sql = "INSERT INTO ANGE_USER_MILEAGE
                        (
                            USER_ID,
                            EARN_DT,
                            MILEAGE_NO,
                            EARN_GB,
                            PLACE_GB,
                            POINT,
                            REASON
                        ) VALUES (
                            '".$user_id."'
                            , SYSDATE()
                            , '".$mileage_data['NO']."'
                            , '".$earn_gb."'
                            , '".$mileage_data['SUBJECT']."'
                            , '".$point."'
                            , '".$mileage_data['REASON']."'
                        )";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "UPDATE
                            COM_USER
                        SET
                            SUM_POINT = SUM_POINT + ".$point.",
                            REMAIN_POINT = REMAIN_POINT + ".$point."
                        WHERE
                            USER_ID = '".$user_id."'";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                MtUtil::_d("### END ['maileage']");

                if ($err > 0) {
                    $_d->sql_rollback();

                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('마일리지 적립에 실패했습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                } else {
                    $_d->sql_commit();

                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('마일리지가 적립됐습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";
                    exit();
                }
            }  else if ($_type == 'clinic') {
                MtUtil::_d("### 111111111111111111");

                $err = 0;
                $msg = "";

                if (!isset($comm_no) || $comm_no == '') {
                    MtUtil::_d("### ERROR ['maileage'] user_id");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('게시판 정보가 존재하지 않습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                if (!isset($parent_no) || $parent_no == '') {
                    MtUtil::_d("### ERROR ['maileage'] user_id");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('존재하지 않는 질문 입니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                $_d->sql_beginTransaction();

                $sql = "SELECT
                            C.MENU_ID, C.COMM_NM, C.COMM_MG_ID, C.COMM_MG_NM, U.USER_NM, U.NICK_NM
                        FROM
                            ANGE_COMM C
                            LEFT OUTER JOIN COM_USER U ON C.COMM_MG_ID = U.USER_ID
                        WHERE
                            C.NO = '".$comm_no."'
                        ";

                $comm_data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT COUNT(*) AS CNT FROM COM_BOARD WHERE PARENT_NO = '".$parent_no."' AND BOARD_GB = 'CLINIC'";
                $data  = $_d->sql_fetch($sql);

                if ($data['CNT'] > 0) {
                    MtUtil::_d("### ERROR ['clinic'] duple");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('이미 답변이 등록된 질문 입니다.');";
                    echo "window.location.href='".BASE_URL."/people/".$comm_data['MENU_ID']."/list';";
                    echo "</script>";

                    exit();
                }

                $sql = "INSERT INTO COM_BOARD
                        (
                            PARENT_NO
                            ,COMM_NO
                            ,SUBJECT
                            ,BODY
                            ,BOARD_GB
                            ,SYSTEM_GB
                            ,REG_UID
                            ,REG_NM
                            ,NICK_NM
                            ,REG_DT
                            ,NOTICE_FL
                            ,SCRAP_FL
                            ,REPLY_FL
                            ,BOARD_NO
                        ) VALUES (
                            '".$parent_no."'
                            , '".$comm_no."'
                            , '".addslashes($subject)."'
                            , '".addslashes(str_replace("\n", "<br />", $body))."'
                            , 'CLINIC'
                            , 'ANGE'
                            , '".$comm_data['uid']."'
                            , '".$comm_data['name']."'
                            , '".$comm_data['NICK_NM']."'
                            , SYSDATE()
                            , '0'
                            , 'N'
                            , 'N'
                            , '0'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                MtUtil::_d("### END ['clinic']");

                if ($err > 0) {
                    $_d->sql_rollback();

                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('상담실 답변 등록에 실패했습니다.');";
                    echo "window.location.href='".BASE_URL."/people/".$comm_data['MENU_ID']."/list';";
                    echo "</script>";

                    exit();
                } else {
                    $_d->sql_commit();

                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('상담실 답변이 등록 됐습니다.');";
                    echo "window.location.href='".BASE_URL."/people/".$comm_data['MENU_ID']."/list';";
                    echo "</script>";
                    exit();
                }
            }

            break;

        case "PUT":
            break;

        case "DELETE":
            break;
    }
?>