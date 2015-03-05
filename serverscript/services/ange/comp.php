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

    //$_d = new MtJson(null);
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
            $sql = "SELECT
                        NO, TARGET_NO, USER_ID, NICK_NM, USER_NM, REG_DT, PREG_FL, BABY_MONTH,
                        BABY_AGE, BLOG_URL, ANSWER,
                        ADD1, ADD2, ADD3,HOPE_REASON, SIZE1, SIZE2, SIZE3, ANGE_MEET, PLACE, PREGNANT_WEEKS, CHILD_AGE, CHILD_FL
                    FROM
                        ANGE_COMP
                    WHERE
                        NO = ".$_key."
                    ";

            $data = $_d->sql_query($sql);
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);
                $_d->dataEnd2($data);
            }
        } else if ($_type == 'list') {
            $search_where = "";
            $sort_order = "";
            $limit = "";

/*            if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                $search_where .= "AND S.SECTION_NM LIKE '%".$_search[KEYWORD]."%' ";
            }

            if (isset($_search[SEARCH_SEASON_NM][SEASON_NM]) && $_search[SEARCH_SEASON_NM][SEASON_NM] != "") {
                $search_where .= "AND S.SEASON_NM  = '".$_search[SEARCH_SEASON_NM][SEASON_NM]."' ";
            }

            if (isset($_search[SORT]) && $_search[SORT] != "") {
                $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
            }*/

            if (isset($_search[USER_ID]) && $_search[USER_ID] != "") {
                $search_where .= "AND AC.USER_ID  = '".$_search[USER_ID]."' ";
            }

            if (isset($_search[TARGET_GB]) && $_search[TARGET_GB] != "") {
                $search_where .= "AND AC.TARGET_GB  = '".$_search[TARGET_GB]."' ";
            }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }


            $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM, NO, TARGET_NO, USER_ID, NICK_NM, USER_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PREG_FL, BABY_MONTH,
                            BABY_AGE, BLOG_URL, ANSWER,
                            ADD1, ADD2, ADD3, HOPE_REASON, SIZE1, SIZE2, SIZE3, ANGE_MEET, PLACE, PREGNANT_WEEKS, CHILD_AGE, CHILD_FL,
                            (SELECT SUBJECT FROM ANGE_EVENT WHERE NO = DATA.TARGET_NO) AS SUBJECT, COMP_CNT, TARGET_GB,
                            (SELECT COUNT(1) FROM ANGE_COMP_WINNER WHERE JOIN_NO = DATA.NO) AS ANGE_COMP_FL
                        FROM
                        (
                             SELECT  AC.NO, AC.TARGET_NO, AC.USER_ID, AC.NICK_NM, AC.USER_NM, AC.REG_DT, AC.PREG_FL, AC.BABY_MONTH,
                                      AC.BABY_AGE, AC.BLOG_URL, AC.ANSWER,
                                      AC.ADD1, AC.ADD2, AC.ADD3, AC.HOPE_REASON, AC.SIZE1, AC.SIZE2, AC.SIZE3, AC.ANGE_MEET, AC.PLACE, AC.PREGNANT_WEEKS, AC.CHILD_AGE, AC.CHILD_FL,
                                      (SELECT COUNT(*) FROM ANGE_COMP_WINNER WHERE TARGET_NO = AC.TARGET_NO AND JOIN_NO = AC.NO AND TARGET_GB = AC.TARGET_GB) AS COMP_CNT, AC.TARGET_GB
                             FROM ANGE_COMP AC
                             WHERE 1=1
                               ".$search_where."
                             ORDER BY REG_DT DESC
                             ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                             SELECT COUNT(*) AS TOTAL_COUNT
                             FROM ANGE_COMP AC
                             WHERE 1=1
                               ".$search_where."
                        ) CNT
                        ";

            $data = $_d->sql_query($sql);
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd($sql);
            }
        } else if ($_type == "check") {

            $sql = "SELECT COUNT(*) AS COMP_CNT
                 FROM adm_history_join
                 WHERE ada_idx = ".$_search[ada_idx]."
                   AND adu_id = '".$_SESSION['uid']."'";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        } else if ($_type == "samplepackCheck") {

            $sql = "SELECT COUNT(*) AS COMP_CNT
                 FROM adm_history_join
                 WHERE ada_idx = ".$_search[ada_idx]."
                   AND adu_id = '".$_SESSION['uid']."'";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        }else if ($_type == "check_1") {

            $sql = "SELECT COUNT(*) AS COMP_CNT
                 FROM ANGE_COMP
                 WHERE TARGET_NO = ".$_search[TARGET_NO]."
                   AND USER_ID = '".$_SESSION['uid']."'";

            $data = $_d->sql_query($sql);
            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd($sql);
            }

        }
//        else if ($_type == 'samplepackCheck') {
//
//            $search_where = "";
//            if (isset($_search[TARGET_NO]) && $_search[TARGET_NO] != "") {
//                $search_where .= "AND ACW.TARGET_NO =".$_search[TARGET_NO]."";
//            }
//
//            if (isset($_search[TARGET_GB]) && $_search[TARGET_GB] != "") {
//                $search_where .= "  AND ACW.TARGET_GB ='".$_search[TARGET_GB]."'";
//            }
//
//            $sql = "SELECT COUNT(*) COUNT
//                    FROM COM_USER CU
//                    INNER JOIN ANGE_COMP_WINNER ACW
//                    ON CU.USER_ID = ACW.USER_ID
//                    WHERE 1=1
//                      AND CU.PREGNENT_FL = 'Y'
//                      AND CU.USER_ID = '".$_SESSION['uid']."'
//                      ".$search_where."
//                      ";
//
//            $data = $_d->sql_query($sql);
//            if($_d->mysql_errno > 0){
//                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//            }else{
//                $_d->dataEnd($sql);
//            }
//        }
        break;

    case "POST":

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $FORM = json_decode(file_get_contents("php://input"),true);
        $_d->sql_beginTransaction();

        if($_type == "eventitem"){

            $sql = "INSERT INTO ANGE_COMP
                            (
                                TARGET_NO,
                                USER_ID,
                                NICK_NM,
                                USER_NM,
                                REG_DT,
                                PREG_FL,
                                BABY_MONTH,
                                BABY_AGE,
                                BLOG_URL,
                                ANSWER,
                                ADD1,
                                ADD2,
                                ADD3,
                                CHILD_CNT,
                                PHONE1,
                                PHONE2,
                                PRODUCT,
                                CREDIT_FL,
                                REASON,
                                TARGET_GB,
                                HOPE_REASON,
                                SIZE1,
                                SIZE2,
                                SIZE3,
                                ANGE_MEET,
                                PLACE,
                                PREGNANT_WEEKS,
                                CHILD_AGE,
                                CHILD_FL,
                                BABY_BIRTH
                            ) VALUES (
                                 '".$_model[NO]."'
                                , '".$_SESSION['uid']."'
                                , '".$_SESSION['nick']."'
                                , '".$_SESSION['name']."'
                                , SYSDATE()
                                , '".$_model[PREG_FL]."'
                                ,'".$_model[BABY_MONTH]."'
                                ,'".$_model[BABY_AGE]."'
                                ,'".$_model[BLOG_URL]."'
                                ,'".$_model[ANSWER]."'
                                ,'".$_model[ADD1]."'
                                ,'".$_model[ADD2]."'
                                ,'".$_model[ADD3]."'
                                ,'".$_model[CHILD_CNT]."'
                                , '".$_SESSION['phone1']."'
                                , '".$_SESSION['phone2']."'
                                ,'".$_model[PRODUCT]."'
                                ,'".$_model[CREDIT_FL]."'
                                ,'".$_model[REASON]."'
                                ,'".$_model[TARGET_GB]."'
                                ,'".$_model[HOPE_REASON]."'
                                ,'".$_model[SIZE1]."'
                                ,'".$_model[SIZE2]."'
                                ,'".$_model[SIZE3]."'
                                ,'".$_model[ANGE_MEET]."'
                                ,'".$_model[PLACE]."'
                                ,".$_model[PREGNANT_WEEKS]."
                                ,'".$_model[CHILD_AGE]."'
                                ,'".$_model[CHILD_FL]."'
                                ,'".$_model[BABY_BIRTH]."'
                            )";

            $_d->sql_query($sql);

            $no = $_d->mysql_insert_id;

        }else if($_type == "item") {

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/ad/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            $body_str = $_model[BODY];

            try {
                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    if (file_exists($upload_path.$file[name])) {
                        $uid = uniqid();
                        rename($upload_path.$file[name], $source_path.$file[name]);
                        $insert_path = array(path => $file_path, name => $file[name], kind => $file[kind]);
                    }
                }

            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            // 응모/신청 광고센터 adm_history_join 테이블에 insert -> 실적통계에서 확인가능
            $sql = "INSERT INTO adm_history_join
                                (
                                    ada_idx,
                                    adu_id,
                                    adu_name,
                                    adhj_date_request,
                                    adhj_answers
                                ) VALUES (
                                     '".$_model[ada_idx]."'
                                    , '".$_SESSION['uid']."'
                                    , '".$_SESSION['name']."'
                                    , NOW()
                                    , '".$_model[ANSWER]."'
                                )";

            $_d->sql_query($sql);

            // 신청자명 증가
            $sql = "UPDATE adm_ad
                  SET  ada_count_request = ada_count_request + 1
                  WHERE ada_idx = '".$_model[ada_idx]."'";

            $_d->sql_query($sql);


        }
        if ($_d->mysql_errno > 0) {
            $_d->failEnd("등록실패입니다:".$_d->mysql_error);
        } else {
            $_d->sql_commit();
            $_d->succEnd($no);
        }

        break;

    case "PUT":


        //            $FORM = json_decode(file_get_contents("php://input"),true);

        MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

        /*            if($_model[OLD_SEASON_NM] != "" || $_model[OLD_SEASON_NM] != $_model[SEASON_NM]){
                        $sql = "UPDATE CMS_SECTION SET
                                    SEASON_NM = '".$_model[SEASON_NM]."'
                             WHERE SEASON_NM = '".$_model[OLD_SEASON_NM]."'
                                ";
                    }else{
                        if (!isset($_key) || $_key == '') {
                            $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                        }
                        $sql = "UPDATE CMS_SECTION
                                        SET
                                            SECTION_NM = '".$_model[SECTION_NM]."'
                                            ,SORT_IDX = '".$_model[SORT_IDX]."'
                                            ,NOTE = '".$_model[NOTE]."'
                                        WHERE
                                            NO = ".$_key."
                                    ";
                    }*/
        $sql = "UPDATE ANGE_COMP
                            SET
                                USER_ID = '".$_SESSION['uid']."'
                                ,NICK_NM = '".$_SESSION['nick']."'
                                ,USER_NM = '".$_SESSION['name']."'
                                ,PREG_FL = '".$_model[PREG_FL]."'
                                ,BABY_MONTH = '".$_model[BABY_MONTH]."'
                                ,BABY_AGE = '".$_model[BABY_AGE]."'
                                ,BLOG_URL = '".$_model[BLOG_URL]."'
                                ,ANSWER = '".$_model[ANSWER]."'
                                ,ADD1 = '".$_model[ADD1]."'
                                ,ADD2 = '".$_model[ADD2]."'
                                ,ADD3 = '".$_model[ADD3]."'
                                ,CHILD_CNT  = '".$_model[CHILD_CNT]."'
                                ,PHONE1  = '".$_SESSION['phone1']."'
                                ,PHONE2  = '".$_SESSION['phone2']."'
                                ,CREDIT_FL = '".$_model['CREDIT_FL']."'
                                ,REASON = '".$_model['REASON']."'
                            WHERE
                                NO = ".$_key."

         ";
        // ,SEASON_NM = '".$_model[SEASON_NM]."'


        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if ($_d->mysql_errno > 0) {
            $_d->failEnd("수정실패입니다:".$_d->mysql_error);
        } else {
            $_d->succEnd($no);
        }

        break;

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        if (!isset($_SESSION['uid'])) {
            $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
        }

        $sql = "DELETE FROM adm_history_join WHERE adhj_idx = ".$_key;

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if ($_d->mysql_errno > 0) {
            $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
        } else {
            $_d->succEnd($no);
        }

        break;
}
?>