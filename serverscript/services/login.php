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

    $_d = new MtJson(null);

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
//                MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

                $where_search = "";

                if (!isset($_model[password]) || $_model[password] == "") {
                    $_d->failEnd("아이디나 패스워드를 확인해주세요.");
                }

                if (isset($_model[SYSTEM_GB]) && $_model[SYSTEM_GB] != "") {
                    $where_search .= "AND R.SYSTEM_GB  = '".$_model[SYSTEM_GB]."' ";
                }

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.NICK_NM,  U.PASSWORD, U.PHONE_1, U.PHONE_2, U.EMAIL, U.ADDR, U.ADDR_DETAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                            UR.ROLE_ID, R.ROLE_NM, U.PREGNENT_FL, U.BABY_BIRTH_DT, U.CERT_GB, U.ZIP_CODE,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID) BABY_CNT,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID AND BABY_SEX_GB = 'M') BABY_MALE_CNT,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID AND BABY_SEX_GB = 'F') BABY_FEMALE_CNT,
                            U.USER_GB, U.SUPPORT_NO, U.REMAIN_POINT
                        FROM
                            COM_USER U, USER_ROLE UR, COM_ROLE R
                        WHERE
                            U.USER_ID = '".$_key."'
                            AND U.USER_ST != 'S'
                            AND U.USER_ID = UR.USER_ID
                            AND UR.ROLE_ID = R.ROLE_ID
                            ".$where_search."
                        ";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($data) {
                    if ( $data['USER_ST'] == "F") {
                        $_d->failEnd("이용이 정지된 사용자입니다. 관리자에게 문의하세요.");
                    }

                    if ( $data['USER_ST'] == "W") {
                        $_d->failEnd("인증전 사용자입니다. 인증을 해주세요.");
                    }

                    if ( $_model[password] != "pass" && !validate_password($_model[password], $data['PASSWORD'])) {
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

                    $sql = "SELECT
                                SUM_POINT, USE_POINT, REMAIN_POINT
                            FROM
                                ANGE_MILEAGE_STATUS
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $mileage_data  = $_d->sql_fetch($sql);
                    $data['MILEAGE'] = $mileage_data;

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_USER U, COM_FILE F
                            WHERE
                                U.NO = F.TARGET_NO
                                AND F.TARGET_GB = 'USER'
                                AND U.USER_ID = '".$_key."'
                                AND F.FILE_GB = 'THUMB'
                            ";

                    $file_data = $_d->sql_fetch($sql);
                    $data['FILE'] = $file_data;

                    $sql = "SELECT
                                BABY_NM, BABY_BIRTH, BABY_SEX_GB, CARE_CENTER, CENTER_VISIT_YMD, CENTER_OUT_YMD
                            FROM
                                ANGE_USER_BABY
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $baby_data = $_d->getData($sql);
                    $data['BABY'] = $baby_data;

                    $sql = "SELECT
                                BLOG_GB, BLOG_URL, PHASE, THEME, NEIGHBOR_CNT, POST_CNT, VISIT_CNT, SNS
                            FROM
                                ANGE_USER_BLOG
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $blog_data  = $_d->sql_fetch($sql);
                    $data['BLOG'] = $blog_data;
                } else {
                    $_d->failEnd("아이디나 패스워드를 확인해주세요.");
                }

                if ($err > 0) {
                    $_d->failEnd("조회실패입니다:".$msg);
                } else {
                    $sql = "UPDATE COM_USER
                            SET
                                FINAL_LOGIN_DT = SYSDATE()
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $_d->sql_query($sql);

                    $sql = "INSERT INTO ".$_model[SYSTEM_GB]."_HISTORY
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
                        ,'LOGIN'
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

                    if (!isset($_SESSION['count'])) {
                        $_SESSION['count'] = 1;
                        MtUtil::_d("################################### [session1] ");
                    } else {
                        $_SESSION['count']++;
                        MtUtil::_d("################################### [session2] ");
                    }

                    if (!isset($_SESSION['ip']) || $_SESSION['ip']==''){ $_SESSION['ip'] = MtUtil::getClientIp(); }
                    if (!isset($_SESSION['guid']) || $_SESSION['guid']==''){ $_SESSION['guid'] = uniqid('',true); }

                    $_SESSION['user_info'] = $data;
                    $_SESSION['uid'] = $data['USER_ID'];
                    $_SESSION['nick'] = $data['NICK_NM'];
                    $_SESSION['name'] = $data['USER_NM'];
                    $_SESSION['role'] = $data['ROLE_ID'];
                    $_SESSION['mileage'] = $data['REMAIN_POINT'];
                    $_SESSION['system'] = $_model['SYSTEM_GB'];
                    $_SESSION['menu_role'] = $data['MENU_ROLE'];

                    $_SESSION['addr'] = $data['ADDR'];
                    $_SESSION['addr_detail'] = $data['ADDR_DETAIL'];
                    $_SESSION['phone1'] = $data['PHONE_1'];
                    $_SESSION['phone2'] = $data['PHONE_2'];
                    $_SESSION['pregnent_fl'] = $data['PREGNENT_FL'];
                    $_SESSION['baby_birth_dt'] = $data['BABY_BIRTH_DT'];
                    $_SESSION['baby_cnt'] = $data['BABY_CNT'];
                    $_SESSION['baby_male_cnt'] = $data['BABY_MALE_CNT'];
                    $_SESSION['baby_female_cnt'] = $data['BABY_FEMALE_CNT'];
                    $_SESSION['timeout'] = time();

                    $_d->dataEnd2($data);
                }
            } else {
                if (!isset($_SESSION)) {
                    session_start();
                }

                $sess = array();

                if(isset($_SESSION['timeout']) && time() - $_SESSION['timeout'] > SESSION_TIMEOUT) {
                    MtUtil::_d("### [SESSION CHECK1]");

                    if(isset($_SESSION['uid']))
                    {
                        unset($_SESSION['user_info']);
                        unset($_SESSION['uid']);
                        unset($_SESSION['nick']);
                        unset($_SESSION['name']);
                        unset($_SESSION['role']);
                        unset($_SESSION['mileage']);
                        unset($_SESSION['system']);
                        unset($_SESSION['menu_role']);

                        unset($_SESSION['addr']);
                        unset($_SESSION['addr_detail']);
                        unset($_SESSION['phone1']);
                        unset($_SESSION['phone2']);
                        unset($_SESSION['pregnent_fl']);
                        unset($_SESSION['baby_birth_dt']);
                        unset($_SESSION['baby_cnt']);
                        unset($_SESSION['baby_male_cnt']);
                        unset($_SESSION['baby_female_cnt']);
                        unset($_SESSION['timeout']);

                        session_destroy();

                        $_SESSION['ip'] = MtUtil::getClientIp();
                        $_SESSION['goud'] = uniqid('',true);
                    }
                } else {
                    if(isset($_SESSION['uid']))
                    {
                        MtUtil::_d("### [SESSION CHECK2]");

                        if (!isset($_SESSION['ip']) || $_SESSION['ip']==''){ $_SESSION['ip'] = MtUtil::getClientIp(); }
                        if (!isset($_SESSION['guid']) || $_SESSION['guid']==''){ $_SESSION['guid'] = uniqid('',true); }

                        $sess['IP'] = $_SESSION['ip'];
                        $sess['GUID'] = $_SESSION['guid'];

                        $sess['USER_INFO'] = $_SESSION['user_info'];
                        $sess['USER_ID'] = $_SESSION['uid'];
                        $sess['NICK_NM'] = $_SESSION['nick'];
                        $sess['USER_NM'] = $_SESSION['name'];
                        $sess['ROLE_ID'] = $_SESSION['role'];
                        $sess['REMAIN_POINT'] = $_SESSION['mileage'];
                        $sess['SYSTEM_GB'] = $_SESSION['system'];
                        $sess['MENU_ROLE'] = $_SESSION['menu_role'];

                        $sess['ADDR'] = $_SESSION['addr'];
                        $sess['ADDR_DETAIL'] = $_SESSION['addr_detail'];
                        $sess['PHONE_1'] = $_SESSION['phone1'];
                        $sess['PHONE_2'] = $_SESSION['phone2'];
                        $sess['PREGNENT_FL'] = $_SESSION['pregnent_fl'];
                        $sess['BABY_BIRTH_DT'] = $_SESSION['baby_birth_dt'];

                        $sess['BABY_CNT'] = $_SESSION['baby_cnt'];
                        $sess['BABY_MALE_CNT'] = $_SESSION['baby_male_cnt'];
                        $sess['BABY_FEMALE_CNT'] = $_SESSION['baby_female_cnt'];

//                    $sess['EMAIL'] = $_SESSION['email'];
                        $_SESSION['timeout'] = time();
                    }
                    else
                    {
                        MtUtil::_d("### [SESSION CHECK3]");

                        if (!isset($_SESSION['ip']) || $_SESSION['ip']==''){ $_SESSION['ip'] = MtUtil::getClientIp(); }
                        if (!isset($_SESSION['guid']) || $_SESSION['guid']==''){ $_SESSION['guid'] = uniqid('',true); }

                        $sess['IP'] = $_SESSION['ip'];
                        $sess['GUID'] = $_SESSION['guid'];

                        $sess['USER_INFO'] = '';
                        $sess['USER_ID'] = '';
                        $sess['NICK_NM'] = 'Guest';
                        $sess['USER_NM'] = 'Guest';
                        $sess['ROLE_ID'] = '';
                        $sess['MILEAGE'] = '';
                        $sess['SYSTEM_GB'] = '';
                        $sess['MENU_ROLE'] = '';

                        $sess['ADDR']= '';
                        $sess['ADDR_DETAIL'] = '';
                        $sess['PHONE1'] = '';
                        $sess['PHONE2'] = '';
                        $sess['PREG_FL'] = '';
                        $sess['BABY_BIRTH_DT'] = '';

                        $sess['BABY_CNT'] = '';
                        $sess['BABY_MALE_CNT'] = '';
                        $sess['BABY_FEMALE_CNT'] = '';
//                    $sess['EMAIL'] = '';
                    }
                }

                MtUtil::_d("### [SESSION GUID]".$sess['GUID']);

                $_d->dataEnd2($sess);
            }

            break;

        case "POST":
            if ($_type == "temp") {
                if (!isset($_SESSION)) {
                    session_start();
                }

                MtUtil::_d("### [TEMP SESSION]");

                $sess = array();

                if(isset($_SESSION['uid']))
                {
                    unset($_SESSION['user_info']);
                    unset($_SESSION['uid']);
                    unset($_SESSION['nick']);
                    unset($_SESSION['name']);
                    unset($_SESSION['role']);
                    unset($_SESSION['system']);
                    unset($_SESSION['menu_role']);
                    unset($_SESSION['timeout']);

                    session_destroy();
                }

                $_SESSION['user_info'] = null;
                $_SESSION['uid'] = $_model['user_id'];
                $_SESSION['nick'] = $_model['user_nick'];
                $_SESSION['name'] = null;
                $_SESSION['role'] = null;
                $_SESSION['system'] = null;
                $_SESSION['menu_role'] = null;
                $_SESSION['timeout'] = time();

                $_d->dataEnd2($sess);
            }

            break;

        case "PUT":

            if (isset($_key) && $_key != "") {
                $where_search = "";

                if (isset($_model[SYSTEM_GB]) && $_model[SYSTEM_GB] != "") {
                    $where_search .= "AND R.SYSTEM_GB  = '".$_model[SYSTEM_GB]."' ";
                }

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            U.USER_ID, U.USER_NM, U.NICK_NM,  U.PASSWORD, U.PHONE_1, U.PHONE_2, U.EMAIL, U.ADDR, U.ADDR_DETAIL, U.USER_ST, DATE_FORMAT(U.REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(U.FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                            UR.ROLE_ID, R.ROLE_NM, U.PREGNENT_FL, U.BABY_BIRTH_DT, U.CERT_GB,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID) BABY_CNT,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID AND BABY_SEX_GB = 'M') BABY_MALE_CNT,
                            (SELECT COUNT(*) FROM ANGE_USER_BABY WHERE USER_ID = U.USER_ID AND BABY_SEX_GB = 'F') BABY_FEMALE_CNT,
                            U.USER_GB, U.SUPPORT_NO, U.REMAIN_POINT
                        FROM
                            COM_USER U, USER_ROLE UR, COM_ROLE R
                        WHERE
                            U.USER_ID = '".$_key."'
                            AND U.USER_ID = UR.USER_ID
                            AND UR.ROLE_ID = R.ROLE_ID
                            ".$where_search."
                        ";

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($data) {
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

                    $sql = "SELECT
                                SUM_POINT, USE_POINT, REMAIN_POINT
                            FROM
                                ANGE_MILEAGE_STATUS
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $mileage_data  = $_d->sql_fetch($sql);
                    $data['MILEAGE'] = $mileage_data;

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_USER U, COM_FILE F
                            WHERE
                                U.NO = F.TARGET_NO
                                AND F.TARGET_GB = 'USER'
                                AND U.USER_ID = '".$_key."'
                                AND F.FILE_GB = 'THUMB'
                            ";

                    $file_data = $_d->sql_fetch($sql);
                    $data['FILE'] = $file_data;

                    $sql = "SELECT
                                BABY_NM, BABY_BIRTH, BABY_SEX_GB, CARE_CENTER, CENTER_VISIT_YMD, CENTER_OUT_YMD
                            FROM
                                ANGE_USER_BABY
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $baby_data = $_d->getData($sql);
                    $data['BABY'] = $baby_data;

                    $sql = "SELECT
                                BLOG_GB, BLOG_URL, PHASE, THEME, NEIGHBOR_CNT, POST_CNT, VISIT_CNT, SNS
                            FROM
                                ANGE_USER_BLOG
                            WHERE
                                USER_ID = '".$_key."'
                            ";

                    $blog_result = $_d->sql_query($sql);
                    $blog_data  = $_d->sql_fetch_array($blog_result);
                    $data['BLOG'] = $blog_data;
                }

                if ($err > 0) {
                    $_d->failEnd("조회실패입니다:".$msg);
                } else {
//                    if(isset($_SESSION['uid'])) {
//                        unset($_SESSION['user_info']);
//                        unset($_SESSION['uid']);
//                        unset($_SESSION['nick']);
//                        unset($_SESSION['name']);
//                        unset($_SESSION['role']);
//                        unset($_SESSION['system']);
//                        unset($_SESSION['menu_role']);
//
//                        unset($_SESSION['addr']);
//                        unset($_SESSION['addr_detail']);
//                        unset($_SESSION['phone1']);
//                        unset($_SESSION['phone2']);
//                        unset($_SESSION['pregnent_fl']);
//                        unset($_SESSION['baby_birth_dt']);
//                        unset($_SESSION['baby_cnt']);
//                        unset($_SESSION['baby_male_cnt']);
//                        unset($_SESSION['baby_female_cnt']);
//                        unset($_SESSION['timeout']);
//
//                        session_destroy();
//                    }

                    if (!isset($_SESSION)) {
                        session_start();
                    }

                    $_SESSION['ip'] = MtUtil::getClientIp();
                    $_SESSION['guid'] = uniqid('',true);

                    $_SESSION['user_info'] = $data;
                    $_SESSION['uid'] = $data['USER_ID'];
                    $_SESSION['nick'] = $data['NICK_NM'];
                    $_SESSION['name'] = $data['USER_NM'];
                    $_SESSION['role'] = $data['ROLE_ID'];
                    $_SESSION['mileage'] = $data['REMAIN_POINT'];
                    $_SESSION['system'] = $_model['SYSTEM_GB'];
                    $_SESSION['menu_role'] = $data['MENU_ROLE'];

                    $_SESSION['addr'] = $data['ADDR'];
                    $_SESSION['addr_detail'] = $data['ADDR_DETAIL'];
                    $_SESSION['phone1'] = $data['PHONE_1'];
                    $_SESSION['phone2'] = $data['PHONE_2'];
                    $_SESSION['pregnent_fl'] = $data['PREGNENT_FL'];
                    $_SESSION['baby_birth_dt'] = $data['BABY_BIRTH_DT'];
                    $_SESSION['baby_cnt'] = $data['BABY_CNT'];
                    $_SESSION['baby_male_cnt'] = $data['BABY_MALE_CNT'];
                    $_SESSION['baby_female_cnt'] = $data['BABY_FEMALE_CNT'];
                    $_SESSION['timeout'] = time();

                    $_d->dataEnd2($data);
                }
            }

            break;

        case "DELETE":

            if (!isset($_SESSION)) {
                session_start();
            }
            if(isset($_SESSION['uid']))
            {
/*
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
*/

                unset($_SESSION['user_info']);
                unset($_SESSION['uid']);
                unset($_SESSION['nick']);
                unset($_SESSION['name']);
                unset($_SESSION['role']);
                unset($_SESSION['mileage']);
                unset($_SESSION['system']);
                unset($_SESSION['menu_role']);
//                unset($_SESSION['email']);
                unset($_SESSION['timeout']);

                session_destroy();
            }

            $_d->succEnd("ok");

            break;
    }
?>