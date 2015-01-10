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

    MtUtil::_c(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_c(print_r($_REQUEST,true));
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
                $search_where = "";

                $err = 0;
                $msg = "";

                $sql = "SELECT
	                        NO, SUBJECT, SLOGAN, DELIV_COST, REVIEW_YMD, REVIEW_BEST, PERIOD, COMPANY_NM, COMPANY_URL, COMPANY_GB, EVENT_GB, QUIZ_FL, CHOIS1, CHOIS2, CHOIS3, CHOIS4, CHOIS5, GIFT_NM, CLUB_FL, MUSICAL_WATCH_YMD, NOTE, START_YMD, END_YMD, PEOPLE_CNT, WINNER_DT
	                        ,(SELECT COUNT(*) FROM ANGE_COMP WHERE BOARD_NO = AE.NO) AS COMP_CNT, HIT_CNT, PRODUCT, DATE_FORMAT(NOW(), '%Y-%m-%d') AS TODAY_YMD
                        FROM
                            ANGE_EVENT AE
                        WHERE
                            NO = ".$_key."
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_GB = 'EVENT'
                            AND S.TARGET_NO = ".$_key."
                        ";

                $file_data = $_d->getData($sql);
                $data['FILES'] = $file_data;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }
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

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

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
//                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
//                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
//                }

//                if (isset($_page)) {
//                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
//                }

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

                if (isset($_search[FILE])) {
                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                            $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    FILE F, CONTENT_SOURCE S
                                WHERE
                                    F.NO = S.SOURCE_NO
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'EVENT'
                                    AND S.TARGET_NO = ".$row['NO']."
                                ";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;

                        $__trn->rows[$i] = $row;
                    }
                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd2($data);
                    }
                }

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'selectList') {
                    $sql = "SELECT
                                    NO, SUBJECT
                                FROM
                                    ANGE_EVENT
                                WHERE 1 = 1
                                AND EVENT_GB = '".$_search[EVENT_GB]."' ";

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
                        NOTE
                    ) VALUES (
                        '".$_model[SUBJECT]."',
                        '".$_SESSION['name']."',
                        SYSDATE(),
                        '".$_model[DELIV_COST]."',
                        '".$_model[REVIEW_YMD]."',
                        '".$_model[REVIEW_BEST]."',
                        '".$_model[PERIOD]."',
                        '".$_model[COMPANY_NM]."',
                        '".$_model[COMPANY_URL]."',
                        '".$_model[COMPANY_GB]."',
                        '".$_model[EVENT_GB]."',
                        '".$_model[QUIZ_FL]."',
                        '".$_model[CHOIS1]."',
                        '".$_model[CHOIS2]."',
                        '".$_model[CHOIS3]."',
                        '".$_model[CHOIS4]."',
                        '".$_model[CHOIS5]."',
                        '".$_model[GIFT_NM]."',
                        '".$_model[CLUB_FL]."',
                        '".$_model[MUSICAL_WATCH_YMD]."',
                        '".$_model[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
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



            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            if(isset($_model[ROLE]) && $_model[ROLE] != ""){
                $sql = "UPDATE ANGE_EVENT
                         SET HIT_CNT = HIT_CNT + 1
                        WHERE
                            NO = ".$_key."
                        ";
            }else{

                if( trim($_model[SUBJECT]) == "" ){
                    $_d->failEnd("제목을 작성 하세요");
                }

                $sql = "UPDATE ANGE_COMP
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
                            EVENT_GB = '".$_model[EVENT_GB]."',
                            QUIZ_FL = '".$_model[QUIZ_FL]."',
                            CHOIS1 = '".$_model[CHOIS1]."',
                            CHOIS2 = '".$_model[CHOIS2]."',
                            CHOIS3 = '".$_model[CHOIS3]."',
                            CHOIS4 = '".$_model[CHOIS4]."',
                            CHOIS5 = '".$_model[CHOIS5]."',
                            GIFT_NM = '".$_model[GIFT_NM]."',
                            CLUB_FL = '".$_model[CLUB_FL]."',
                            MUSICAL_WATCH_YMD = '".$_model[MUSICAL_WATCH_YMD]."',
                            NOTE = '".$_model[NOTE]."'
                        WHERE
                            NO = ".$_key."
                        ";
            }

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
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_COMM WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>