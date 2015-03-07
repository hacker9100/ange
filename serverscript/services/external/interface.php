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
            if ($_type == 'check') {
                $sql = "SELECT
                            COUNT(*) AS COUNT
                        FROM
                            COM_USER
                        WHERE
                            USER_ID = '".$user_id."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'cert') {
                $sql = "SELECT
                            CERT_GB, CERT_DT, CERT_HASH
                        FROM
                            COM_USER
                        WHERE
                            USER_ID = '".$user_id."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'nick') {
            $sql = "SELECT
                        COUNT(*) AS COUNT
                    FROM
                        COM_USER
                    WHERE
                        NICK_NM = '".$user_id."'
                    ";

            $result = $_d->sql_query($sql);
            $data  = $_d->sql_fetch_array($result);

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
        } else if ($_type == 'item') {
                $search_where = "";

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND R.SYSTEM_GB  = '".$_search[SYSTEM_GB]."' ";
                }

                $sql = "SELECT
                            U.NO, U.USER_ID, U.USER_NM, U.NICK_NM, U.LUNAR_FL, U.BIRTH, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_GB, U.USER_ST,
                            U.REG_DT, U.FINAL_LOGIN_DT, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_YMD, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_YMD,
                            U.INTRO, U.NOTE, U.MARRIED_FL, U.PREGNENT_FL, U.BABY_BIRTH_DT, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_YMD, U.CENTER_OUT_YMD,
                            U.EN_ANGE_EMAIL_FL, U.EN_ANGE_SMS_FL, U.EN_ALARM_EMAIL_FL, U.EN_ALARM_SMS_FL, U.EN_STORE_EMAIL_FL, U.EN_STORE_SMS_FL,
                            UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID AND SYSTEM_GB  = '".$_search[SYSTEM_GB]."') AS ROLE_NM, U.CERT_GB
                        FROM
                            COM_USER U, USER_ROLE UR, COM_ROLE R
                        WHERE
                            U.USER_ID = UR.USER_ID
                            AND UR.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$user_id."'
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            R.ROLE_ID, R.ROLE_NM, R.ROLE_GB
                        FROM
                            USER_ROLE U, COM_ROLE R
                        WHERE
                            U.ROLE_ID = R.ROLE_ID
                            AND U.USER_ID = '".$user_id."'
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $role_data  = $_d->sql_fetch_array($result);

                $data['ROLE'] = $role_data;

                if (isset($_search[DETAIL])) {
                    $sql = "SELECT
                                SUM_POINT, USE_POINT, REMAIN_POINT
                            FROM
                                ANGE_MILEAGE_STATUS
                            WHERE
                                USER_ID = '".$user_id."'
                            ";

                    $mileage_result = $_d->sql_query($sql);
                    $mileage_data  = $_d->sql_fetch_array($mileage_result);
                    $data['MILEAGE'] = $mileage_data;

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_USER U, FILE F, CONTENT_SOURCE S
                            WHERE
                                U.NO = S.TARGET_NO
                                AND F.NO = S.SOURCE_NO
                                AND S.CONTENT_GB = 'FILE'
                                AND S.TARGET_GB = 'USER'
                                AND U.USER_ID = '".$user_id."'
                                AND F.FILE_GB = 'THUMB'
                            ";

                    $file_result = $_d->sql_query($sql);
                    $file_data = $_d->sql_fetch_array($file_result);
                    $data['FILE'] = $file_data;

                    $sql = "SELECT
                                BABY_NM, BABY_BIRTH, BABY_SEX_GB, CARE_CENTER, CENTER_VISIT_YMD, CENTER_OUT_YMD
                            FROM
                                ANGE_USER_BABY
                            WHERE
                                USER_ID = '".$user_id."'
                            ";

                    $baby_data = $_d->getData($sql);
                    $data['BABY'] = $baby_data;

                    $sql = "SELECT
                                BLOG_GB, BLOG_URL, PHASE, THEME, NEIGHBOR_CNT, POST_CNT, VISIT_CNT, SNS
                            FROM
                                ANGE_USER_BLOG
                            WHERE
                                USER_ID = '".$user_id."'
                            ";

                    $blog_result = $_d->sql_query($sql);
                    $blog_data  = $_d->sql_fetch_array($blog_result);
                    $data['BLOG'] = $blog_data;
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            }

            break;

        case "POST":
            MtUtil::_d("### INFO [maileage] ".$_method);
            MtUtil::_d("### INFO [maileage] ".$user_id);

            if ($_type == 'mail') {
                $from_email = __SMTP_USR__;
                $from_user = __SMTP_USR_NM__;
                $to = $_model[EMAIL];
                $to_user = $_model[USER_NM];
                $headers = "From: hacker9100@gmail.com";
                $subject = "앙쥬에 오신걸 환영합니다. 이메일을 인증해 주세요.";
                $message = "안녕하세요. ".$_model[USER_NM]."회원님.<br>아래 링크를 클릭하면 이메일 인증이 완료됩니다. <br><br><a href='http://ange.marveltree.com/serverscript/services/external/interface.php?_method=POST&_type=mileage&user_id=hong&earn_gb=20150306&point=50'>마일리지 적립</a>";

                $return = MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user);
                $_d->succEnd('');
            } else if ($_type == 'point') {
                $err = 0;
                $msg = "";
                MtUtil::_d("### INFO [maileage] ".$user_id);
                if (!isset($user_id) || $user_id == '') {
                    MtUtil::_d("### ERROR [maileage] user_id");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('존재하지 않는 사용자 입니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                if (!isset($point) || $point == '') {
                    MtUtil::_d("### ERROR [maileage] point");
                    ob_end_clean();
                    header('Content-type: text/html; charset=utf-8');

                    echo "<script language='javascript'>";
                    echo "alert('적립 점수가 없습니다.');";
                    echo "window.location.href='".BASE_URL."';";
                    echo "</script>";

                    exit();
                }

                if (!isset($earn_gb) || $earn_gb == '') {
                    MtUtil::_d("### ERROR [maileage] earn_gb");
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
                    MtUtil::_d("### ERROR [maileage] check");
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
                    MtUtil::_d("### ERROR [maileage] duple");
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

                MtUtil::_d("### END [maileage]");

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
            }

            break;

        case "PUT":
            if ($_type == "type") {
                $sql = "UPDATE COM_USER
                            SET
                                USER_GB = '".$_model[USER_GB]."'
                            WHERE
                                USER_ID = '".$user_id."'
                            ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            }

            break;

        case "DELETE":
            if (!isset($user_id) || $user_id == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM = '".$user_id."'";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
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