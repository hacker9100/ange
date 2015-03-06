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
//                MtUtil::_d("FUNC[processApi] 1 : "+$id);

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            NO,PARENT_NO,HEAD,SUBJECT,BODY,REG_UID,REG_NM,REG_DT, HIT_CNT, LIKE_CNT , SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG, COMM_NO, COMM_NM,
                            REPLY_BODY , IFNULL(REPLY_BODY,'N')AS REPLY_YN, SCRAP_FL, REPLY_FL, REPLY_COUNT, BOARD_GB, ETC1, ETC2, ETC3, ETC4, ETC5, NICK_NM, BOARD_NO,
                            CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT1, PASSWORD, REG_NEW_DT, CATEGORY_NO, BOARD_ST,
                            (SELECT NOTE FROM CMS_CATEGORY WHERE NO = CATEGORY_NO) AS CATEGORY_NM,BLIND_FL
                        FROM (
                            SELECT
                                B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.BODY, B.REG_UID, B.REG_NM, DATE_FORMAT(B.REG_DT, '%Y-%m-%d') AS REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.NOTICE_FL, B.WARNING_FL, B.BEST_FL, B.TAG,
                                (SELECT BODY FROM COM_BOARD WHERE PARENT_NO = B.NO) AS REPLY_BODY, B.SCRAP_FL, B.REPLY_FL, (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = B.NO AND TARGET_GB = 'BOARD') AS REPLY_COUNT, B.BOARD_GB, B.COMM_NO, C.COMM_NM,
                                B.ETC1, B.ETC2, B.ETC3, B.ETC4, B.ETC5, B.NICK_NM, B.BOARD_NO, B.PASSWORD, DATE_FORMAT(NOW(), '%Y-%m-%d') AS REG_NEW_DT, B.CATEGORY_NO, B.BOARD_ST,B.BLIND_FL
                            FROM
                              COM_BOARD B
                              LEFT OUTER JOIN ANGE_COMM C ON B.COMM_NO = C.NO
                            WHERE
                              B.NO = ".$_key."
                            )  A";
                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB, F.FILE_EXT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_GB = 'BOARD'
                            AND S.TARGET_NO = ".$_key."
                            AND F.THUMB_FL = '0'
                        ";

                $file_data = $_d->getData($sql);
                $data['FILES'] = $file_data;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (isset($_search['CATEGORY'])) {
                    $sql = "SELECT
                                C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                            FROM
                                COM_BOARD B, CMS_CATEGORY C
                            WHERE
                                B.CATEGORY_NO = C.NO
                                AND B.NO = ".$_key."
                            ";

                    $category_data = $_d->sql_fetch($sql);
                    $data['CATEGORY'] = $category_data;
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
            } if ($_type == 'discussitem') {

                    $err = 0;
                    $msg = "";

                    $sql = "SELECT  NO, PARENT_NO, HEAD, SUBJECT, BODY, REG_UID, REG_NM, REG_DT, HIT_CNT, BLIND_FL, ETC1, ETC2
                        FROM (
                           SELECT
                               B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.BODY, B.REG_UID, B.REG_NM, DATE_FORMAT(B.REG_DT, '%Y-%m-%d') AS REG_DT, B.HIT_CNT, B.BLIND_FL, B.ETC1, B.ETC2
                           FROM
                             COM_BOARD B
                             LEFT OUTER JOIN ANGE_COMM C ON B.COMM_NO = C.NO
                           WHERE
                              B.NO = ".$_key."
                                    )  A";
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    if($err > 0){
                        $_d->failEnd("조회실패입니다:".$msg);
                    }else{
                        $_d->dataEnd2($data);
                    }
            }
            else if ($_type == 'list') {
                $search_where = "";
                $sort_order = ", REG_DT DESC";
                $limit = "";

                if (isset($_search[COMM_NO_IN]) && $_search[COMM_NO_IN] != "") {
                    $search_where .= "AND COMM_NO IN (".$_search[COMM_NO_IN].") ";
                }

                if (isset($_search[COMM_NO]) && $_search[COMM_NO] != "") {
                    $search_where .= "AND COMM_NO = '".$_search[COMM_NO]."' ";
                }

                if(isset($_search[COMM_NO]) && ( $_search[COMM_GB] == "CLINIC" || $_search[COMM_GB] == "TALK" )){
                    if (isset($_search[PARENT_NO]) && $_search[PARENT_NO] != "") {
                        $search_where .= "AND PARENT_NO = '".$_search[PARENT_NO]."' ";
                    }else{
//                        $search_where .= "AND PARENT_NO = '0' ";
                    }
                }else{
//                    $search_where .= "AND PARENT_NO = '0' ";
                }

                if(isset($_search[MY_QNA]) && $_search[MY_QNA] == "Y"){
                    $search_where .= "AND B.REG_UID = '".$_SESSION['uid']."'";
                }

                if (isset($_search[BOARD_GB]) && $_search[BOARD_GB] != "") {
                    $search_where .= "AND BOARD_GB = '".$_search[BOARD_GB]."' ";
                }

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND SYSTEM_GB = '".$_search[SYSTEM_GB]."' ";
                }

                if (isset($_search[REG_UID]) && $_search[REG_UID] != "") {
                    $search_where .= "AND B.REG_UID = '".$_search[REG_UID]."' ";
                }

                if (isset($_search[PHOTO_TYPE]) && $_search[PHOTO_TYPE] != "" && $_search[PHOTO_TYPE] != "ALL") {
                    $search_where .= "AND PHOTO_TYPE = '".$_search[PHOTO_TYPE]."'
                                    AND PHOTO_GB = '".$_search[PHOTO_GB]."'
                                ";
                }

                if (isset($_search[FAQ_TYPE]) && $_search[FAQ_TYPE] != "" && $_search[FAQ_TYPE] != "ALL") {
                    $search_where .= "AND FAQ_TYPE = '".$_search[FAQ_TYPE]."'
                                    AND FAQ_GB = '".$_search[FAQ_GB]."'
                                ";
                }

                if (isset($_search[CATEGORY_NO]) && $_search[CATEGORY_NO] != "") {
                    $search_where .= "AND CATEGORY_NO = '".$_search[CATEGORY_NO]."' ";
                }

                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    if($_search[CONDITION][value] == "SUBJECT+BODY"){
                        $search_where .= "AND SUBJECT LIKE '%".$_search[KEYWORD]."%' AND BODY LIKE '%".$_search[KEYWORD]."%'";
                    }else{
                        $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%'";
                    }
                }

                if (isset($_search[NOTICE_FL]) && $_search[NOTICE_FL] != "") {
                    $search_where .= "AND NOTICE_FL = '".$_search[NOTICE_FL]."' ";
                }

                if (isset($_search[COMM_NO_NOT]) && $_search[COMM_NO_NOT] != "") {
                    $search_where .= "AND COMM_NO != '".$_search[COMM_NO_NOT]."' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order = ", ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                if(isset($_search[SUPPORT_NO]) && $_search[SUPPORT_NO] != ""){
                    $search_where .= "AND CATEGORY_NO = '".$_search[SUPPORT_NO]."' ";
                }

                if(isset($_search[BOARD_ST]) && $_search[BOARD_ST] != ""){
                    $search_where .= "AND BOARD_ST IS NULL";
                }
/*
                // AND PARENT_NO = 0
                $sql = "SELECT
                          TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                          DATA.NO, PARENT_NO, HEAD, SUBJECT, DATA.REG_UID, DATA.REG_NM, DATA.NICK_NM, DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG, COMM_NO, IFNULL(C.COMM_NM, '') AS COMM_NM, IFNULL(C.SHORT_NM, '') AS SHORT_NM,
                          (DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') > DATE_FORMAT(DATE_ADD(NOW(), INTERVAL - 7 DAY), '%Y-%m-%d')) AS NEW_FL,
	                      CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL, CATEGORY_NO,
	                      BOARD_NO, DATE_FORMAT(NOW(), '%Y-%m-%d') AS REG_NEW_DT,
	                      (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = DATA.NO AND TARGET_GB = 'BOARD') AS REPLY_COUNT,
                          (SELECT COUNT(*) AS BOARD_REPLY_COUNT FROM COM_BOARD WHERE PARENT_NO = DATA.NO) AS BOARD_REPLY_COUNT,
	                      (SELECT CATEGORY_NM FROM CMS_CATEGORY WHERE NO = CATEGORY_NO) AS CATEGORY_NM, BOARD_ST,
	                      IF(BOARD_REPLY_COUNT > 0,'Y','N') AS BOARD_REPLY_FL, ETC1, ETC2, ETC3, ETC4, BLIND_FL
                        FROM
                        (
                            SELECT
                                B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.REG_UID, B.REG_NM, NICK_NM, B.REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.WARNING_FL, B.BEST_FL, B.NOTICE_FL, B.TAG, B.COMM_NO,
                                B.PASSWORD, B.BOARD_NO, B.CATEGORY_NO, B.BOARD_ST,
                                (SELECT COUNT(*) AS BOARD_REPLY_COUNT FROM COM_BOARD WHERE PARENT_NO = B.NO) AS BOARD_REPLY_COUNT, ETC1, ETC2, ETC3, ETC4, BLIND_FL
                            FROM
                                COM_BOARD B
                            WHERE
                                1=1
                                ".$search_where."
                            ORDER BY NOTICE_FL DESC".$sort_order."
                            ".$limit."
                        ) AS DATA
                        LEFT OUTER JOIN ANGE_COMM C ON DATA.COMM_NO = C.NO,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                COM_BOARD B
                            WHERE
                                1=1
                                ".$search_where."
                        ) CNT
                        ";
*/

                $sql = "SELECT COUNT(*) AS TOTAL_COUNT FROM COM_BOARD B WHERE 1=1 ".$search_where;
                $result = $_d->sql_query($sql,true);
                $row=$_d->sql_fetch_array($result);
                $t_total_count = $row['TOTAL_COUNT'];

                $sql = "SELECT
                          0 as TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                          DATA.NO, PARENT_NO, HEAD, SUBJECT, DATA.REG_UID, DATA.REG_NM, DATA.NICK_NM, DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG, COMM_NO, IFNULL(C.COMM_NM, '') AS COMM_NM, IFNULL(C.SHORT_NM, '') AS SHORT_NM,
                          (DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') > DATE_FORMAT(DATE_ADD(NOW(), INTERVAL - 7 DAY), '%Y-%m-%d')) AS NEW_FL,
	                      CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL, CATEGORY_NO,
	                      BOARD_NO, DATE_FORMAT(NOW(), '%Y-%m-%d') AS REG_NEW_DT,
	                      (SELECT COUNT(*) AS REPLY_COUNT FROM COM_REPLY WHERE TARGET_NO = DATA.NO AND TARGET_GB = 'BOARD') AS REPLY_COUNT,
                          (SELECT COUNT(*) AS BOARD_REPLY_COUNT FROM COM_BOARD WHERE PARENT_NO = DATA.NO) AS BOARD_REPLY_COUNT,
	                      (SELECT CATEGORY_NM FROM CMS_CATEGORY WHERE NO = CATEGORY_NO) AS CATEGORY_NM, BOARD_ST,
	                      IF(BOARD_REPLY_COUNT > 0,'Y','N') AS BOARD_REPLY_FL, ETC1, ETC2, ETC3, ETC4, BLIND_FL
                        FROM
                        (
                            SELECT
                                B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.REG_UID, B.REG_NM, NICK_NM, B.REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.WARNING_FL, B.BEST_FL, B.NOTICE_FL, B.TAG, B.COMM_NO,
                                B.PASSWORD, B.BOARD_NO, B.CATEGORY_NO, B.BOARD_ST,
                                (SELECT COUNT(*) AS BOARD_REPLY_COUNT FROM COM_BOARD WHERE PARENT_NO = B.NO) AS BOARD_REPLY_COUNT, ETC1, ETC2, ETC3, ETC4, BLIND_FL
                            FROM
                                COM_BOARD B
                            WHERE
                                1=1
                                ".$search_where."
                            ORDER BY NOTICE_FL DESC".$sort_order."
                            ".$limit."
                        ) AS DATA
                        LEFT OUTER JOIN ANGE_COMM C ON DATA.COMM_NO = C.NO,
                        (SELECT @RNUM := 0) R
                        ";

                $data = null;

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                if($_search['FILE']) {
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    FILE F, CONTENT_SOURCE S
                                WHERE
                                    F.NO = S.SOURCE_NO
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'BOARD'
                                    AND F.FILE_GB = 'MAIN'
                                    AND F.THUMB_FL = 0
                                    AND S.TARGET_NO = ".$row['NO']."";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;

                        $__trn->rows[$i] = $row;
                        $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                    }

                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                } if (isset($_search['FILE_EXIST'])) {
                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql =  "SELECT
                            COUNT(F.NO) AS FILE_CNT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_GB = 'BOARD'
                            AND S.TARGET_NO = ".$row['NO']."
                            AND F.THUMB_FL = '0'
                                ";

                        $category_data = $_d->getData($sql);
                        $row['FILE'] = $category_data;

                        $__trn->rows[$i] = $row;
                        $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                    }
                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd2($data);
                    }
                }else if (isset($_search['CATEGORY'])) {
                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                        $sql = "SELECT
                                    C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                                FROM
                                    COM_BOARD B, CMS_CATEGORY C
                                WHERE
                                    B.CATEGORY_NO = C.NO
                                    AND B.NO = ".$row['NO']."
                                ";

                        $category_data = $_d->sql_fetch($sql);
                        $row['CATEGORY'] = $category_data;

                        $__trn->rows[$i] = $row;
                        $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                    }
                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd2($data);
                    }
                } else {
                    $data = $_d->sql_query($sql);

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd($sql);
                    }
                }
            } else if ($_type == 'main') {
                $search_where = "";
                $sort_order = ", REG_DT DESC";
                $limit = "";

                if (isset($_search[COMM_NO_IN]) && $_search[COMM_NO_IN] != "") {
                    $search_where .= "AND COMM_NO IN (".$_search[COMM_NO_IN].") ";
                }

                if (isset($_search[COMM_NO]) && $_search[COMM_NO] != "") {
                    $search_where .= "AND COMM_NO = '".$_search[COMM_NO]."' ";
                }

                if (isset($_search[PARENT_NO]) && $_search[PARENT_NO] != "") {
                    $search_where .= "AND PARENT_NO = '".$_search[PARENT_NO]."' ";
                }

                if (isset($_search[BOARD_GB]) && $_search[BOARD_GB] != "") {
                    $search_where .= "AND BOARD_GB = '".$_search[BOARD_GB]."' ";
                }

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $search_where .= "AND SYSTEM_GB = '".$_search[SYSTEM_GB]."' ";
                }

                if (isset($_search[NOTICE_FL]) && $_search[NOTICE_FL] != "") {
                    $search_where .= "AND NOTICE_FL = '".$_search[NOTICE_FL]."' ";
                }

                if (isset($_search[COMM_NO_NOT]) && $_search[COMM_NO_NOT] != "") {
                    $search_where .= "AND COMM_NO != '".$_search[COMM_NO_NOT]."' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order = ", ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = "SELECT
                            DATA.NO, HEAD, SUBJECT, DATA.REG_UID, DATA.REG_NM, DATA.NICK_NM, DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG, COMM_NO,
                            (SELECT SHORT_NM FROM ANGE_COMM WHERE DATA.COMM_NO = NO) AS SHORT_NM,
                            (DATE_FORMAT(DATA.REG_DT, '%Y-%m-%d') > DATE_FORMAT(DATE_ADD(NOW(), INTERVAL - 7 DAY), '%Y-%m-%d')) AS NEW_FL,
                            CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL, CATEGORY_NO,
                            BOARD_NO, DATE_FORMAT(NOW(), '%Y-%m-%d') AS REG_NEW_DT, BLIND_FL
                        FROM
                        (
                            SELECT
                                B.NO, B.PARENT_NO, B.HEAD, B.SUBJECT, B.REG_UID, B.REG_NM, NICK_NM, B.REG_DT, B.HIT_CNT, B.LIKE_CNT, B.SCRAP_CNT, B.REPLY_CNT, B.WARNING_FL, B.BEST_FL, B.NOTICE_FL, B.TAG, B.COMM_NO,
                                B.PASSWORD, B.BOARD_NO, B.CATEGORY_NO, B.BOARD_ST, BLIND_FL
                            FROM
                                COM_BOARD B
                            WHERE
                                1=1
                                ".$search_where."
                            ORDER BY NOTICE_FL DESC".$sort_order."
                            ".$limit."
                        ) AS DATA
                        ";

                $data = null;

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                MtUtil::_d("### [START]");
                if($_search['FILE']) {
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    FILE F, CONTENT_SOURCE S
                                WHERE
                                    F.NO = S.SOURCE_NO
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'BOARD'
                                    AND F.FILE_GB = 'MAIN'
                                    AND F.THUMB_FL = 0
                                    AND S.TARGET_NO = ".$row['NO']."";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;

                        $__trn->rows[$i] = $row;
                    }

                    $_d->sql_free_result($result);
                    $data = $__trn->{'rows'};

                    if ($_d->mysql_errno > 0) {
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    } else {
                        $_d->dataEnd2($data);
                    }
                } else {
                    $data = $_d->sql_query($sql);

                    if($_d->mysql_errno > 0){
                        $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                    }else{
                        $_d->dataEnd($sql);
                    }
                }
            } else if ($_type == 'pre') {

                $search_where = "";
                if(isset($_search[PARENT_NO]) && $_search[PARENT_NO] != ""){
                    $search_where .= "AND PARENT_NO = '".$_search[PARENT_NO]."' ";
                }else{
                    $search_where .= "AND PARENT_NO = '0' ";
                }

                $sql = "SELECT NO, SUBJECT,NICK_NM, BOARD_ST, REG_UID, BLIND_FL,CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL  FROM COM_BOARD WHERE NO < ".$_search[KEY]." AND NOTICE_FL = 0 AND BOARD_ST IS NULL AND COMM_NO=".$_search[COMM_NO]." ".$search_where." ORDER BY  NO DESC LIMIT 1";

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'next') {

                $search_where = "";
                if(isset($_search[PARENT_NO]) && $_search[PARENT_NO] != ""){
                    $search_where .= "AND PARENT_NO = '".$_search[PARENT_NO]."' ";
                }else{
                    $search_where .= "AND PARENT_NO = '0' ";
                }

                $sql = "SELECT NO, SUBJECT,NICK_NM, BOARD_ST, REG_UID, BLIND_FL,CASE IFNULL(PASSWORD, 0) WHEN 0 THEN 0 ELSE 1 END AS PASSWORD_FL FROM COM_BOARD WHERE NO > ".$_search[KEY]." AND NOTICE_FL = 0  AND BOARD_ST IS NULL  AND COMM_NO=".$_search[COMM_NO]." ".$search_where." ORDER BY NO LIMIT 1";

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'category') {

//                if (isset($_search[COMM_NO]) && $_search[COMM_NO] == "") {
//                    $search_where .= "AND CATEGORY_GB = '".$_search[COMM_NO]."' ";
//                }

                if (isset($_search[CATEGORY_NO]) && $_search[CATEGORY_NO] != "") {
                    $search_where .= "AND NO = '".$_search[CATEGORY_NO]."' ";
                }

                $sql = "SELECT NO, CATEGORY_NM, NOTE
                    FROM CMS_CATEGORY
                    WHERE 1=1
                    AND SYSTEM_GB = 'ANGE'
                    AND CATEGORY_GB = '".$_search[COMM_NO]."'
                    ".$search_where."
                    ORDER BY SORT_IDX ASC
                ";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }else if ($_type == 'faqcategory') {

                $sql = "SELECT TITLE, MENU_URL, TYPE
                        FROM COM_SUB_MENU
                        WHERE SYSTEM_GB = 'ANGE'
                          AND MENU_ID = 'infodesk'
                          AND MENU_URL = CONCAT('/infodesk/faq/list')";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }else if ($_type == 'like'){

                $search_where = "";

                if (isset($_search[TARGET_GB]) && $_search[TARGET_GB] != "") {
                    $search_where .= "AND L.TARGET_GB = '".$_search[TARGET_GB]."' ";
                }
/*
                if (isset($_search[REG_UID]) && $_search[REG_UID] != "") {
                    $search_common .= "AND L.REG_UID = '".$_search[REG_UID]."' ";
                }*/

                if (isset($_search[NO]) && $_search[NO] != "") {
                    $search_common .= "AND B.NO = '".$_search[NO]."' ";
                }

                $sql = "SELECT    CASE IFNULL(L.TARGET_NO, 'N') WHEN 'N' THEN 'N' ELSE 'Y' END AS LIKE_FL, COUNT(*) AS TOTAL_COUNT
                        FROM COM_BOARD B
                        INNER JOIN ANGE_LIKE L
                        ON B.NO = L.TARGET_NO
                        WHERE 1=1
                         AND L.REG_UID = '".$_SESSION['uid']."'
                         AND B.NO = ".$_key."
                        ".$search_where."";

                if($_d->mysql_errno > 0){
                    //$_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            }else if ($_type == 'checkpassword') {

                $sql = "SELECT COUNT(*) AS CHECK_COUNT
                        FROM COM_BOARD
                        WHERE SYSTEM_GB = 'ANGE'
                          AND NO = ".$_search[NO]."
                          AND PASSWORD = ".$_search[PASSWORD]."";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }else if ($_type == 'manager') {

                $sql = "SELECT AC.COMM_MG_ID, AC.COMM_MG_NM
                        FROM ANGE_COMM AC
                        WHERE 1=1
                          AND NO = '".$_search[COMM_NO]."'
                          AND COMM_GB = '".$_search[COMM_GB]."'";

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

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $err = 0;
            $msg = "";

            if( trim($_model[SUBJECT]) == '' ){
                $_d->failEnd("제목을 작성 하세요");
            }
            if( trim($_model[BODY]) == '' ){
                $_d->failEnd("내용이 비어있습니다");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/board/';
            $source_path = '../../..'.$file_path;
            $insert_path = array();

            $body_str = $_model[BODY];

            try {
                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                        $file = $files[$i];


                        if (file_exists($upload_path.$file[name])) {
                            $uid = uniqid();
                            rename($upload_path.$file[name], $source_path.$uid);
                            rename($upload_path.'thumbnail/'.$file[name], $source_path.'thumbnail/'.$uid);

                            if ($file[version] == 6 ) {
                                $body_str = str_replace($file[url], BASE_URL.$file_path.$uid, $body_str);
                            } else {
                                rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                                $body_str = str_replace($file[mediumUrl], BASE_URL.$file_path.'medium/'.$uid, $body_str);
                            }

                            $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                            MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);


                        }
                    }
                }

                $_model[BODY] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }
//            MtUtil::_d("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

            if($_model[PARENT_NO] == ''){
                $board_no = "(SELECT COUNT(*)+1 FROM COM_BOARD A WHERE A.COMM_NO = '".$_model[COMM_NO]."' AND A.PARENT_NO = 0)";
            }else{
                //$board_no = 0;
                $board_no = "(SELECT COUNT(*)+1 FROM COM_BOARD A WHERE A.COMM_NO = '".$_model[COMM_NO]."' AND A.PARENT_NO = '".$_model[PARENT_NO]."')";
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_BOARD
                    (
                        PARENT_NO
                        ,COMM_NO
                        ,HEAD
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
                        ,TAG
                        ,ETC1
                        ,ETC2
                        ,ETC3
                        ,ETC4
                        ,ETC5
                        ,PASSWORD
                        ,PHOTO_TYPE
                        ,PHOTO_GB
                        ,FAQ_TYPE
                        ,FAQ_GB
                        ,BOARD_NO
                        ,CATEGORY_NO
                    ) VALUES (
                        '".$_model[PARENT_NO]."'
                        ,'".$_model[COMM_NO]."'
                        ,'".$_model[HEAD]."'
                        ,'".$_model[SUBJECT]."'
                        , '".$_model[BODY]."'
                        , '".$_model[BOARD_GB]."'
                        , '".$_model[SYSTEM_GB]."'
                        , '".$_SESSION['uid']."'
                        , '".$_SESSION['name']."'
                        , '".$_SESSION['nick']."'
                        , SYSDATE()
                        , '".($_model[NOTICE_FL] == "true" ? "1" : "0")."'
                        , '".($_model[SCRAP_FL] == "true" ? "Y" : "N")."'
                        , '".($_model[REPLY_FL] == "true" ? "Y" : "N")."'
                        , '".$_model[TAG]."'
                        , '".$_model[ETC1]."'
                        , '".$_model[ETC2]."'
                        , '".$_model[ETC3]."'
                        , '".$_model[ETC4]."'
                        , '".$_model[ETC5]."'
                        , '".$_model[PASSWORD]."'
                        , '".$_model[PHOTO_TYPE]."'
                        , '".$_model[PHOTO_GB]."'
                        , '".$_model[FAQ_TYPE]."'
                        , '".$_model[FAQ_GB]."'
                        , $board_no
                        , '".$_model[CATEGORY_NO]."'
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

                    if($_model[BOARD_GB] == 'PHOTO'){
                        if(!isset($file[kind])){
                            $_d->failEnd("대표이미지를 선택하세요.");
                        }
                    }
//                    if($file[kind] != 'MAIN'){
//                        $_d->failEnd("대표이미지를 선택하세요.");
//                    }

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
                        , '".$file[kind]."'
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
                        , 'BOARD'
                        , '".$i."'
                    )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            MtUtil::_d("------------>>>>> mysql_errno : ".$_d->mysql_errno);

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if ($_type == 'item') {

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }
//            $FORM = json_decode(file_get_contents("php://input"),true);

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/board/';
                $source_path = '../../..'.$file_path;
                $insert_path = array();

                $body_str = $_model[BODY];


                try {
                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];

                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');

                        for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file[name])) {
                                $uid = uniqid();
                                rename($upload_path.$file[name], $source_path.$uid);
                                rename($upload_path.'thumbnail/'.$file[name], $source_path.'thumbnail/'.$uid);
                                rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                                MtUtil::_d("------------>>>>> mediumUrl : ".$file[mediumUrl]);
                                MtUtil::_d("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);

                                $body_str = str_replace($file[mediumUrl], BASE_URL.$file_path.'medium/'.$uid, $body_str);

                                MtUtil::_d("------------>>>>> body_str : ".$body_str);
                            } else {
                                $uid = uniqid();
                                $insert_path[$i] = array(path => '', uid => '', kind => '');
                                //$insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);
                            }
                        }
                    }

                    $_model[BODY] = $body_str;
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                MtUtil::_d("------------>>>>> json : ".json_encode(file_get_contents("php://input"),true));

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if( trim($_model[SUBJECT]) == '' ){
                    $_d->failEnd("제목을 작성 하세요");
                }
                if( trim($_model[BODY]) == '' ){
                    $_d->failEnd("내용이 비어있습니다");
                }

                $sql = "UPDATE COM_BOARD
                    SET
                        HEAD = '".$_model[HEAD]."'
                        ,SUBJECT = '".$_model[SUBJECT]."'
                        ,BODY = '".$_model[BODY]."'
                        ,REG_UID = '".$_SESSION['uid']."'
                        ,REG_NM = '".$_model[REG_NM]."'
                        ,NOTICE_FL = '".($_model[NOTICE_FL] == "true" ? "1" : "0")."'
                        ,SCRAP_FL = '".($_model[SCRAP_FL] == "true" ? "Y" : "N")."'
                        ,REPLY_FL = '".($_model[REPLY_FL] == "true" ? "Y" : "N")."'
                        ,TAG = '".$_model[TAG]."'
                        ,ETC1 = '".$_model[ETC1]."'
                        ,ETC2 = '".$_model[ETC2]."'
                        ,ETC3 = '".$_model[ETC3]."'
                        ,ETC4 = '".$_model[ETC4]."'
                        ,ETC5 = '".$_model[ETC5]."'
                        ,PASSWORD = '".$_model[PASSWORD]."'
                        ,PHOTO_TYPE = '".$_model[PHOTO_TYPE]."'
                        ,PHOTO_GB = '".$_model[PHOTO_GB]."'
                        ,FAQ_TYPE = '".$_model[FAQ_TYPE]."'
                        ,FAQ_GB = '".$_model[FAQ_GB]."'
                        ,COMM_NO = '".$_model[COMM_NO]."'
                        ,CATEGORY_NO = '".$_model[CATEGORY_NO]."'
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
                            AND S.TARGET_GB = 'BOARD'
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_NO = ".$_key."
                            AND F.THUMB_FL = '0'
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $is_delete = "Y";

                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];

                        MtUtil::_d("------------>>>>> FILES >>>>>>>>>>>>>>>: ".count($files));

                        for ($i = 0 ; $i < count($files); $i++) {
                            if ($row[FILE_NM] == $files[$i][name] && $row[FILE_SIZE] == $files[$i][size]) {
                                $is_delete = "N";
                            }
                        }
                    }

                    MtUtil::_d("------------>>>>> is_delete >>>>>>>>>>>>>>>: ".$is_delete);

                    if ($is_delete == "Y") {
                        MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                        $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                        $_d->sql_query($sql);

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'BOARD' AND CONTENT_GB = 'FILE' AND SOURCE_NO = ".$row[NO]." AND TARGET_NO = ".$_key."";
                        // TARGET_NO

                        $_d->sql_query($sql);

                        MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                        if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../../..'.$row[PATH].$row[FILE_ID]);
                            unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                            unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                        }
                    }
                }

                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];

                    for ($i = 0 ; $i < count($files); $i++) {
                        $file = $files[$i];
                        MtUtil::_d("------------>>>>> file : ".$file['name']);

                        if($_model[BOARD_GB] == 'PHOTO'){
                            if(!isset($file[kind])){
                                $_d->failEnd("대표이미지를 선택하세요.");
                            }
                        }

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
                                , '".$file[kind]."'
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
                                , 'BOARD'
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
                            ,'UPDATE'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'.$_key.'
                            ,'BOARD'
                            ,'UPDATE'
                            ,'".$ip."'
                            ,'/webboard'
                        )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'likeCntitem') {

                $sql = "UPDATE COM_BOARD SET
                            LIKE_CNT = LIKE_CNT + 1
                     WHERE NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            }   else if ($_type == 'hit') {

                $sql = "UPDATE COM_BOARD
                         SET HIT_CNT = HIT_CNT + 1
                        WHERE
                            NO = ".$_key."
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
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if ($_type =="item") {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO COM_BOARD_DEL SELECT * FROM COM_BOARD WHERE NO = ".$_key;


                $_d->sql_query($sql);

                $sql = "DELETE FROM COM_BOARD WHERE NO = ".$_key;

//                $sql = "UPDATE COM_BOARD SET
//                 BOARD_ST = 'D'
//                 WHERE NO = ".$_key;

                $_d->sql_query($sql);

//                $sql = "DELETE FROM COM_SCRAP WHERE TARGET_NO = ".$_key;
//
////                $sql = "UPDATE COM_BOARD SET
////                 BOARD_ST = 'D'
////                 WHERE NO = ".$_key;
//
//                $_d->sql_query($sql);
                /*$no = $_d->mysql_insert_id;*/

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
                
            } else if ($_type == "terminate") {
                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "DELETE FROM COM_BOARD WHERE NO = ".$_key;

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
                        AND S.TARGET_GB = 'BOARD'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                    $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                    $_d->sql_query($sql);

                    $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'BOARD' AND TARGET_NO = ".$row[NO];

                    $_d->sql_query($sql);

                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                    if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                        unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                    }
                }

//                $sql = "DELETE FROM COM_BOARD WHERE PARENT_NO = ".$_key;

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("삭제실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;
    }
?>