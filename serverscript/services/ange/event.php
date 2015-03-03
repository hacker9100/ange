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
            if ($_type == 'item') {
                $search_where = "";

                $err = 0;
                $msg = "";

                // ada_notice,
                $sql = "SELECT  ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close, DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice, ada_option_quantity, ada_image, ada_preview, ada_imagemap,
                             ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url,
                             DATE_FORMAT(ada_date_open,'%Y%m%d') as OPEN_DATE ,DATE_FORMAT(ada_date_close, '%Y%m%d') as END_DATE, ada_option_delivery,ada_text, ada_guide,
                             ada_url, ada_count_request, ada_detail,ada_que_type, ada_count_join, DATE_FORMAT(ada_date_review_open,'%Y-%m-%d') as ada_date_review_open, DATE_FORMAT(ada_date_review_close,'%Y-%m-%d') as ada_date_review_close
                        FROM
                            adm_ad AE
                        WHERE
                            ada_idx = ".$_key."
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

//                $sql = "SELECT
//                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
//                        FROM
//                            FILE F, CONTENT_SOURCE S
//                        WHERE
//                            F.NO = S.SOURCE_NO
//                            AND S.CONTENT_GB = 'FILE'
//                            AND S.TARGET_GB = 'EVENT'
//                            AND S.TARGET_NO = ".$_key."
//                        ";
//
//                $file_data = $_d->getData($sql);
//                $data['FILES'] = $file_data;
//
//                if($_d->mysql_errno > 0) {
//                    $err++;
//                    $msg = $_d->mysql_error;
//                }
/*
                $sql = "SELECT
                            NO, PARENT_NO, REPLY_NO, REPLY_GB, SYSTEM_GB, COMMENT, REG_ID, REG_NM, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, SCORE
                        FROM
                            COM_REPLY
                        WHERE
                            TARGET_NO = ".$_key."
                        ";

                $reply_data = $_d->getData($sql);
                $data['REPLY'] = $reply_data;
*/

//                if($_d->mysql_errno > 0) {
//                    $err++;
//                    $msg = $_d->mysql_error;
//                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$msg);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search[ADA_TYPE_IN]) && $_search[ADA_TYPE_IN] != "") {
                    $search_where .= "AND a.ada_type IN (".$_search[ADA_TYPE_IN].") ";
                }

                if (isset($_search[ADP_CODE_NOT_IN]) && $_search[ADP_CODE_NOT_IN] != "") {
                    $search_where .= "AND p.adp_code NOT IN (".$_search[ADP_CODE_NOT_IN].") ";
                }

                if(isset($_search[NOT_SAMPLE]) && $_search[NOT_SAMPLE] == "Y"){
                    $search_where .= "AND a.adp_idx NOT IN (45, 46) ";
                }

                if(isset($_search[NOT_POST]) && $_search[NOT_POST] == "Y"){
                    $search_where .= "AND a.adp_idx != 49 ";
                }

                if(isset($_search[NOT_POST]) && $_search[NOT_POST] == "Y"){
                    $search_where .= "AND a.adp_idx != 49 ";
                }

                if(isset($_search[PERFORM_FL]) && $_search[PERFORM_FL] == "N"){
                    $search_where .= "AND a.adp_idx != 53 ";
                }

                if(isset($_search[PERFORM_FL]) && $_search[PERFORM_FL] == "Y"){
                    $search_where .= "AND a.adp_idx = 53 ";
                }

                if (isset($_search[EVENT_GB]) && $_search[EVENT_GB] != "") {
                    $search_where .= "AND a.ada_type = '".$_search[EVENT_GB]."' ";
                }

                if (isset($_search[PROCESS]) && $_search[PROCESS] != "") {
                    $search_where .= "AND DATE_FORMAT(ada_date_close, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')";
                }

                if (isset($_search[PAST]) && $_search[PAST] != "") {
                    $search_where .= "AND DATE_FORMAT(ada_date_close, '%Y-%m-%d')  < DATE_FORMAT(NOW(), '%Y-%m-%d')";
                }

                if (isset($_search[REVIEW_EVENT_GB]) && $_search[REVIEW_EVENT_GB] != "") {
                    $search_where .= "AND a.ada_type IN ('exp','event') ";
                }

                if(isset($_search[ADA_STATE]) && $_search[ADA_STATE] != ""){
                    if($_search[ADA_STATE] == 1){
                        $search_where .= "AND ada_state = '".$_search[ADA_STATE]."' ";
                    }else{
                        $search_where .= "AND ada_state = '".$_search[ADA_STATE]."' ";
                    }
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                // , ada_notice
                $sql = "SELECT TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                             ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close ,ada_option_quantity, ada_image, ada_preview, ada_imagemap
                             ,ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url, ada_type, ada_title, ada_que_type
                             ,DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice
                        FROM
                        (
                            SELECT
                                  a.ada_idx, a.ada_type, a.ada_title, a.ada_url, a.ada_date_open, a.ada_date_close, a.ada_option_quantity, a.ada_image, a.ada_preview, a.ada_imagemap,
                                  a.ada_state, a.ada_que_info, a.ada_que_type, a.ada_date_notice
                            FROM adm_ad a, adm_product p
                            WHERE 1 = 1
                                AND a.adp_idx = p.adp_idx
                                ".$search_where."
                                ".$sort_order."
                                ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM adm_ad a, adm_product p
                            WHERE 1 = 1
                                AND a.adp_idx = p.adp_idx
                              ".$search_where."
                        ) CNT
                        ";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }else if ($_type == 'eventlist') {
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search[EVENT_GB]) && $_search[EVENT_GB] != "") {
                    $search_where .= "AND EVENT_GB = '".$_search[EVENT_GB]."' ";
                }

                if (isset($_search[PROCESS]) && $_search[PROCESS] != "") {
                    $search_where .= "AND END_YMD >= DATE_FORMAT(NOW(), '%Y-%m-%d')";
                }

                if (isset($_search[PAST]) && $_search[PAST] != "") {
                    $search_where .= "AND END_YMD < DATE_FORMAT(NOW(), '%Y-%m-%d')";
                }

                if (isset($_search[PERFORM_FL]) && $_search[PERFORM_FL] != "") {
                    $search_where .= "AND PERFORM_FL = '".$_search[PERFORM_FL]."' ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, SUBJECT, SLOGAN, DELIV_COST, REVIEW_YMD, REVIEW_BEST, PERIOD, COMPANY_NM, COMPANY_URL, COMPANY_GB, EVENT_GB, QUIZ_FL, CHOIS1, CHOIS2, CHOIS3, CHOIS4, CHOIS5, GIFT_NM, CLUB_FL, MUSICAL_WATCH_YMD, NOTE, START_YMD, END_YMD,
                            PEOPLE_CNT, WINNER_DT
                        FROM
                        (
                            SELECT
                                NO, SUBJECT, SLOGAN, DELIV_COST, REVIEW_YMD, REVIEW_BEST, PERIOD, COMPANY_NM, COMPANY_URL, COMPANY_GB, EVENT_GB, QUIZ_FL, CHOIS1, CHOIS2, CHOIS3, CHOIS4, CHOIS5, GIFT_NM, CLUB_FL, MUSICAL_WATCH_YMD, NOTE, START_YMD, END_YMD,
                                PEOPLE_CNT, WINNER_DT
                            FROM
                                ANGE_EVENT
                            WHERE
                                1 = 1
                                ".$search_where."
                                ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_EVENT
                            WHERE
                                1 = 1
                                ".$search_where."

                        ) CNT
                        ";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'selectList') {

                $search_where = "";
/*                if (isset($_search[EVENT_GB]) && $_search[EVENT_GB] != "") {
                    $search_where .= "AND EVENT_GB = '".$_search[EVENT_GB]."' ";
                }*/

                if (isset($_search[USER_ID]) && $_search[USER_ID] != "") {
                    $search_where .= "AND USER_ID = '".$_SESSION['uid']."' ";
                }

                if (isset($_search[REVIEW_FL]) && $_search[REVIEW_FL] != "") {
                    $search_where .= "AND REVIEW_FL = 'N'";
                }

                if (isset($_search[JOIN_GB]) && $_search[JOIN_GB] != "") {
                    $search_where .= "AND JOIN_GB = '".$_search[JOIN_GB]."' ";
                }

                    $sql = "SELECT
                                NO, SUBJECT, TARGET_NO, JOIN_NO, USER_ID, NICK_NM, REVIEW_FL, TOTAL_COUNT,REVIEW_YMD
                            FROM
                            (
                                SELECT NO, (SELECT SUBJECT FROM ANGE_EVENT WHERE NO = ACW.TARGET_NO) AS SUBJECT, TARGET_NO, JOIN_NO,
                                            USER_ID, NICK_NM, REVIEW_FL, (SELECT REVIEW_YMD FROM ANGE_EVENT WHERE NO = ACW.TARGET_NO) AS REVIEW_YMD
                                FROM ANGE_COMP_WINNER ACW
                                 WHERE 1 = 1
                                 ".$search_where."

                            ) AS DATA,
                            (
                                SELECT
                                    COUNT(*) AS TOTAL_COUNT
                                FROM ANGE_COMP_WINNER ACW
                                 WHERE 1 = 1
                                 ".$search_where."
                            ) CNT";

                    $data = $_d->sql_query($sql);

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd($sql);
                    }
            }


            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/event/';
            $source_path = '../../..'.$file_path;
            $insert_path = array();

            $body_str = $_model[BODY];

            try {
                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                        $file = $files[$i];

                        if (file_exists($upload_path.$file[name])) {
                            $uid = uniqid();
                            rename($upload_path.$file[name], $source_path.$uid);

                            $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                            MtUtil::_d("------------>>>>> url : ".$i.'--'.$insert_path[$i][path]);
                        }
                    }
                }
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $err = 0;
            $msg = "";

            if( trim($_model[SUBJECT]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_EVENT
                    (
                        SUBJECT,
                        REG_UID,
                        REG_DT,
                        DELIV_COST,
                        REVIEW_YMD,
                        REVIEW_BEST,
                        PERIOD,
                        COMPANY_NM,
                        COMPANY_URL,
                        COMPANY_GB,
                        EVENT_GB,
                        QUIZ_FL,
                        CHOIS1,
                        CHOIS2,
                        CHOIS3,
                        CHOIS4,
                        CHOIS5,
                        GIFT_NM,
                        CLUB_FL,
                        MUSICAL_WATCH_YMD,
                        NOTE,
                        START_YMD,
                        END_YMD,
                        PEOPLE_CNT,
                        WINNER_DT
                    ) VALUES (
                        '".$_model[SUBJECT]."',
                        '".$_SESSION['uid']."',
                        SYSDATE(),
                        '".$_model[DELIV_COST]."',
                        '".$_model[REVIEW_YMD]."',
                        '".$_model[REVIEW_BEST]."',
                        '".$_model[PERIOD]."',
                        '".$_model[COMPANY_NM]."',
                        '".$_model[COMPANY_URL]."',
                        '".$_model[COMPANY_GB]."',
                        '".$_model[EVENT_GB][value]."',
                        '".$_model[QUIZ_FL]."',
                        '".$_model[CHOIS1]."',
                        '".$_model[CHOIS2]."',
                        '".$_model[CHOIS3]."',
                        '".$_model[CHOIS4]."',
                        '".$_model[CHOIS5]."',
                        '".$_model[GIFT_NM]."',
                        '".$_model[CLUB_FL]."',
                        '".$_model[MUSICAL_WATCH_YMD]."',
                        '".$_model[NOTE]."',
                        '".$_model[START_YMD]."',
                        '".$_model[END_YMD]."',
                        '".$_model[PEOPLE_CNT]."',
                        '".$_model[WINNER_DT]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (count($_model[FILES]) > 0) {
                $files = $_model[FILES];

                for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                    $file = $files[$i];
                    MtUtil::_d("------------>>>>> file : ".$file['name']);
                    MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);

                    $sql = "INSERT INTO FILE
                            (
                                FILE_NM
                                ,FILE_ID
                                ,PATH
                                ,FILE_EXT
                                ,FILE_SIZE
                                ,THUMB_FL
                                ,REG_DT
                                ,FILE_ST
                                ,FILE_GB
                            ) VALUES (
                                '".$file[name]."'
                                , '".$insert_path[$i][uid]."'
                                , '".$insert_path[$i][path]."'
                                , '".$file[type]."'
                                , '".$file[size]."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".strtoupper($file[kind])."'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO CONTENT_SOURCE
                            (
                                TARGET_NO
                                ,SOURCE_NO
                                ,CONTENT_GB
                                ,TARGET_GB
                                ,SORT_IDX
                            ) VALUES (
                                '".$no."'
                                , '".$file_no."'
                                , 'FILE'
                                , 'EVENT'
                                , '".$i."'
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if ($_type == 'item') {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/event/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file[name])) {
                                $uid = uniqid();
                                rename($upload_path.$file[name], $source_path.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                                MtUtil::_d("------------>>>>> mediumUrl : ".$file[name]);
                                MtUtil::_d("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.$uid);
                            } else {
                                $insert_path[$i] = array(path => '', uid => '', kind => '');
                            }
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if( trim($_model[SUBJECT]) == "" ){
                    $_d->failEnd("제목을 작성 하세요");
                }

                $sql = "UPDATE ANGE_EVENT
                        SET
                            SUBJECT = '".$_model[SUBJECT]."',
                            #REG_UID = '".$_SESSION['uid']."',
                            #REG_DT = SYSDATE(),
                            DELIV_COST = '".$_model[DELIV_COST]."',
                            REVIEW_YMD = '".$_model[REVIEW_YMD]."',
                            REVIEW_BEST = '".$_model[REVIEW_BEST]."',
                            PERIOD = '".$_model[PERIOD]."',
                            COMPANY_NM = '".$_model[COMPANY_NM]."',
                            COMPANY_URL = '".$_model[COMPANY_URL]."',
                            COMPANY_GB = '".$_model[COMPANY_GB]."',
                            EVENT_GB = '".$_model[EVENT_GB][value]."',
                            QUIZ_FL = '".$_model[QUIZ_FL]."',
                            CHOIS1 = '".$_model[CHOIS1]."',
                            CHOIS2 = '".$_model[CHOIS2]."',
                            CHOIS3 = '".$_model[CHOIS3]."',
                            CHOIS4 = '".$_model[CHOIS4]."',
                            CHOIS5 = '".$_model[CHOIS5]."',
                            GIFT_NM = '".$_model[GIFT_NM]."',
                            CLUB_FL = '".$_model[CLUB_FL]."',
                            MUSICAL_WATCH_YMD = '".$_model[MUSICAL_WATCH_YMD]."',
                            NOTE = '".$_model[NOTE]."',
                            START_YMD = '".$_model[START_YMD]."',
                            END_YMD = '".$_model[END_YMD]."',
                            PEOPLE_CNT = '".$_model[PEOPLE_CNT]."'
                            WINNER_DT = '".$_model[WINNER_DT]."'
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_GB = 'EVENT'
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $is_delete = true;

                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];
                        for ($i = 0 ; $i < count($files); $i++) {
                            if ($row[FILE_NM] == $files[$i][name] && $row[FILE_SIZE] == $files[$i][size]) {
                                $is_delete = false;
                            }
                        }
                    }

                    if ($is_delete) {
                        MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                        $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                        $_d->sql_query($sql);

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'SUB_MENU' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                        $_d->sql_query($sql);

                        MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                        if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        }
                    }
                }

                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];

                    for ($i = 0 ; $i < count($files); $i++) {
                        $file = $files[$i];
                        MtUtil::_d("------------>>>>> file : ".$file['name']);

                        if ($insert_path[$i][uid] != "") {
                            $sql = "INSERT INTO FILE
                                    (
                                        FILE_NM
                                        ,FILE_ID
                                        ,PATH
                                        ,FILE_EXT
                                        ,FILE_SIZE
                                        ,THUMB_FL
                                        ,REG_DT
                                        ,FILE_ST
                                        ,FILE_GB
                                    ) VALUES (
                                        '".$file[name]."'
                                        , '".$insert_path[$i][uid]."'
                                        , '".$insert_path[$i][path]."'
                                        , '".$file[type]."'
                                        , '".$file[size]."'
                                        , '0'
                                        , SYSDATE()
                                        , 'C'
                                        , '".strtoupper($file[kind])."'
                                    )";

                            $_d->sql_query($sql);
                            $file_no = $_d->mysql_insert_id;

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }

                            $sql = "INSERT INTO CONTENT_SOURCE
                                    (
                                        TARGET_NO
                                        ,SOURCE_NO
                                        ,CONTENT_GB
                                        ,TARGET_GB
                                        ,SORT_IDX
                                    ) VALUES (
                                        '".$_key."'
                                        , '".$file_no."'
                                        , 'FILE'
                                        , 'EVENT'
                                        , '".$i."'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "hit") {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE ANGE_EVENT
                            SET HIT_CNT = HIT_CNT + 1
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);

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
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_EVENT WHERE NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'EVENT'
                        AND S.TARGET_NO = ".$_key."
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                $_d->sql_query($sql);

                $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'EVENT' AND TARGET_NO = ".$row[NO];

                $_d->sql_query($sql);

                MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                    unlink('../../..'.$row[PATH].$row[FILE_ID]);
                }
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $sql = "INSERT INTO ANGE_HISTORY
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
                            ,'DELETE'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$_key.'
                            ,'EVENT'
                            ,'DELETE'
                            ,'".$ip."'
                            ,'/webboard'
                        )";

                $_d->sql_query($sql);

                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>