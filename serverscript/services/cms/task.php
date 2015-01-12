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
                $sql = "SELECT
                            P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, DATE_FORMAT(T.REG_DT, '%Y-%m-%d') AS REG_DT,
                            T.CLOSE_YMD, T.DEPLOY_YMD, T.TAG, T.NOTE, T.PROJECT_NO, S.SERIES_NM, C.SEASON_NM, C.SECTION_NM, P.YEAR, T.LIKE_CNT, T.HIT_CNT, SCRAP_CNT, REPLY_CNT
                        FROM
                            CMS_TASK T
                            INNER JOIN CMS_PROJECT P ON T.PROJECT_NO = P.NO
                            LEFT OUTER JOIN CMS_SERIES S ON S.NO = P.SERIES_NO
                            LEFT OUTER JOIN CMS_SECTION C ON T.SECTION_NO = C.NO
                        WHERE
                            T.NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                if ($data) {
                    $sql = "SELECT
                                C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                            FROM
                                CMS_TASK T, CONTENT_CATEGORY CC, CMS_CATEGORY C
                            WHERE
                                T.NO = CC.TARGET_NO
                                AND CC.CATEGORY_NO = C.NO
                                AND T.NO = ".$_key."
                            ";

                    $category_data = $_d->getData($sql);

                    $data['CATEGORY'] = $category_data;

                    $sql = "SELECT
                                TASK_NO, APPROVAL_ST, APPROVER_ID, APPROVER_NM, APPROVAL_DT, NOTE
                            FROM
                                COM_APPROVAL
                            WHERE
                                TASK_NO = ".$_key."
                            ORDER BY APPROVAL_DT DESC
                            ";

                    $approval_data = $_d->getData($sql);

                    $data['APPROVAL'] = $approval_data;
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_where = "";
                $from_category = "";
                $sort_order = "T.REG_DT DESC";
                $limit = "";

                if (isset($_page)) {
                    $limit = "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order = $_search[SORT]." ".$_search[ORDER]." ";
                }

//                if ($_SESSION['role'] != 'CMS_ADMIN' && $_SESSION['role'] != 'MANAGER') {
//                    $search_where .= "AND T.EDITOR_ID  = '".$_SESSION['uid']."' ";
//                }

                if (isset($_search) && count($_search) > 0) {
/*
                    for ($i = 0 ; $i < count($_search); $i++) {
                        $item = $_search[$i];
                        $arr_item = explode('/', $item);

                        if ($arr_item[0] == 'PROJECT_N0') {
                            $search .= "AND P.NO  = ".$arr_item[1]." ";
                        } else if ($arr_item[0] == 'YEAR') {
                            $search .= "AND P.YEAR  = '".$arr_item[1]."' ";
                        } else {
                            $search .= "AND T.".$arr_item[0]." LIKE '%".$arr_item[1]."%' ";
                        }
                    }
*/

                    if (isset($_search[PHASE])) {
                        $in_str = "";
                        $arr_phase = explode(',', $_search[PHASE]);
                        for($i=0;$i< sizeof($arr_phase);$i++){
                            $in_str = $in_str."'".trim($arr_phase[$i])."'";
                            if (sizeof($arr_phase) - 1 != $i) $in_str = $in_str.",";
                        }

                        $search_where = "AND T.PHASE IN (".$in_str.") ";
                    }
                    if (isset($_search[MY_TASK]) && $_search[MY_TASK] != "") {
                        if ($_search[MY_TASK] == 'true') {
                            $search_where .= "AND T.EDITOR_ID  = '".$_SESSION['uid']."' ";
                        }
                    }
                    if (isset($_search[YEAR]) && $_search[YEAR] != "") {
                        $search_where .= "AND P.YEAR  = '".$_search[YEAR]."' ";
                    }
                    if (isset($_search[PROJECT]) && $_search[PROJECT] != "") {
                        $search_where .= "AND P.NO  = '".$_search[PROJECT][NO]."' ";
                    }
                    if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                        $search_where .= "AND T.".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
                    }
                    if (isset($_search[EDITOR_ID]) && $_search[EDITOR_ID] != "") {
                        $search_where .= "AND T.EDITOR_ID  = '".$_search[EDITOR_ID]."' ";
                    }
                    if (isset($_search[CATEGORY_NO]) && $_search[CATEGORY_NO] != "") {
//                        $where_category = $_search[CATEGORY_NO];
//
//                        if (!isset($_search[CATEGORY]) || $_search[CATEGORY] == "") {
                            $from_category .= ",(
                                              SELECT
                                                  TARGET_NO
                                              FROM
                                                  CONTENT_CATEGORY
                                              WHERE CATEGORY_NO IN (".$_search[CATEGORY_NO].")
                                              GROUP BY TARGET_NO
                                          ) AS TEMP1 ";

                            $search_where .= "AND TEMP1.TARGET_NO = T.NO ";
//                        }
                    }

                    if (isset($_search[CATEGORY]) && count($_search[CATEGORY]) != 0) {
                        $where_category = "";

//                        if (count($_search[CATEGORY]) == 1 && $_search[CATEGORY][0][CATEGORY_GB] == 2 && $_search[CATEGORY][0][PARENT_NO] == 0) {
//                            $from_category = ",(
//                                              SELECT
//                                                    TARGET_NO
//                                              FROM
//                                                    CONTENT_CATEGORY CC, CMS_CATEGORY C
//                                              WHERE CC.CATEGORY_NO = C.NO
//                                              AND C.PARENT_NO = ".$_search[CATEGORY][0][NO]."
//                                              GROUP BY TARGET_NO
//                                          ) AS C ";
//                        } else {
                            for ($i = 0; $i < count($_search[CATEGORY]); $i++) {
                                $category = $_search[CATEGORY][$i];

                                if ($category[CATEGORY_GB] == 2 && $category[PARENT_NO] == 0) {
                                    $sql = "SELECT
                                                NO
                                            FROM
                                                CMS_CATEGORY
                                            WHERE
                                                CATEGORY_ST = '0'
                                                AND CATEGORY_GB = '2'
                                                AND PARENT_NO = ".$category[NO]."
                                            ";

                                    $result = $_d->sql_query($sql,true);

                                    for ($j=0; $row=$_d->sql_fetch_array($result); $j++) {
                                        $where_category .= $row[NO].($j != $_d->mysql_num_rows - 1 ? "," : "");
                                    }
                                } else {
                                    $where_category .= $category[NO].($i != count($_search[CATEGORY]) - 1 ? "," : "");
                                }
//                            }

                            $from_category .= ",(
                                              SELECT
                                                  TARGET_NO
                                              FROM
                                                  CONTENT_CATEGORY
                                              WHERE CATEGORY_NO IN (".$where_category.")
                                              GROUP BY TARGET_NO
                                          ) AS TEMP2 ";
                        }

                        $search_where .= "AND TEMP2.TARGET_NO = T.NO ";
                    }
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            PROJECT_NM, NO, PHASE, SUBJECT, EDITOR_ID, EDITOR_NM, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CLOSE_YMD, DEPLOY_YMD, TAG, NOTE, PROJECT_NO, SECTION_NO, SERIES_NM, (SELECT SECTION_NM FROM CMS_SECTION S WHERE S.NO = SECTION_NO) AS SECTION_NM,
                            HIT_CNT, SCRAP_CNT, LIKE_CNT, REPLY_CNT, LIKE_FL
                        FROM
                        (
                            SELECT
                                P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, T.REG_DT,
                                T.CLOSE_YMD, T.DEPLOY_YMD, T.TAG, T.NOTE, T.PROJECT_NO, T.SECTION_NO, T.HIT_CNT, T.SCRAP_CNT, T.LIKE_CNT, T.REPLY_CNT, S.SERIES_NM,
                                CASE IFNULL(L.TARGET_NO, 'N') WHEN 'N' THEN 'N' ELSE 'Y' END AS LIKE_FL
                            FROM
                                CMS_TASK T
                                INNER JOIN CMS_PROJECT P ON T.PROJECT_NO = P.NO
                                LEFT OUTER JOIN CMS_SERIES S ON S.NO = P.SERIES_NO
                                LEFT OUTER JOIN ANGE_LIKE L ON T.NO = L.TARGET_NO AND L.TARGET_GB = 'CONTENT' AND L.REG_UID = '".$_SESSION['uid']."'
                                ".$from_category."
                            WHERE
                                1 = 1
                                ".$search_where."
                            ORDER BY ".$sort_order."
                            ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                CMS_TASK T, CMS_PROJECT P
                                ".$from_category."
                            WHERE
                                T.PROJECT_NO = P.NO
                                ".$search_where."
                        ) CNT
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                            C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                        FROM
                            CMS_TASK T, CONTENT_CATEGORY CC, CMS_CATEGORY C
                        WHERE
                            C.CATEGORY_ST = '0'
                            AND T.NO = CC.TARGET_NO
                            AND CC.CATEGORY_NO = C.NO
                            AND T.NO = ".$row['NO']."
                        ";

                    $category_data = $_d->getData($sql);
                    $row['CATEGORY'] = $category_data;

                    if ($_search[FILE]) {
                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    CMS_CONTENT C, FILE F, CONTENT_SOURCE S
                                WHERE
                                    C.NO = S.TARGET_NO
                                    AND F.NO = S.SOURCE_NO
                                    AND C.TASK_NO = ".$row['NO']."
                                    AND C.CURRENT_FL = 'Y'
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'CONTENT'
                                    AND F.FILE_GB = 'MAIN'
                                ";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;
                    }

                    if ($_search[CONETNT]) {
                        $sql = "SELECT
                                    NO, SUPER_NO, PHASE, VERSION, SUMMERY, BODY, CONTENT_ST, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                                    CURRENT_FL, MODIFY_FL, HIT_CNT, SCRAP_CNT, TASK_NO
                                FROM
                                    CMS_CONTENT
                                WHERE
                                    CURRENT_FL = 'Y'
                                    AND TASK_NO = ".$row['NO']."
                                ";

                        $content_result = $_d->sql_query($sql);
                        $content_data  = $_d->sql_fetch_array($content_result);
                        $row['CONTENT'] = $content_data;

                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    FILE F, CONTENT_SOURCE S
                                WHERE
                                    F.NO = S.SOURCE_NO
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'CONTENT'
                                    AND F.FILE_GB = 'MAIN'
                                    AND S.TARGET_NO = ".$content_data[NO]."
                                ";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;
                    }

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'food') {
                $search_where = "";
                $limit = "";

                if (isset($_page)) {
                    $limit = "LIMIT ".($_page[NO] * $_page[SIZE]).", ".($_page[SIZE]/4);
                }

                $search_where = "AND T.PHASE IN ('30', '31') ";

                if (isset($_search[CATEGORY_NO]) && $_search[CATEGORY_NO] != "") {

                    $select = "";

                    $arr_category = explode(',', $_search[CATEGORY_NO]);
                    for($i=0;$i< sizeof($arr_category);$i++){

                        $sql = "SELECT
                                    NO
                                FROM
                                    CMS_CATEGORY
                                WHERE
                                    CATEGORY_ST = '0'
                                    AND CATEGORY_GB = '2'
                                    AND ( PARENT_NO = 27 OR PARENT_NO = 38 )
                                ";

                        $result = $_d->sql_query($sql,true);

                        for ($j=0; $row=$_d->sql_fetch_array($result); $j++) {
                            $where_category .= $row[NO].($j != $_d->mysql_num_rows - 1 ? "," : "");
                        }

                        $select_where = "AND C.CATEGORY_NO = ".trim($arr_category[$i])." ";

                        $select .= "SELECT
                                        @RNUM := @RNUM + 1 AS RNUM,
                                        NUM, NO, PHASE, SUBJECT, EDITOR_ID, EDITOR_NM, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                                        CLOSE_YMD, DEPLOY_YMD, TAG, NOTE, HIT_CNT, SCRAP_CNT, LIKE_CNT, REPLY_CNT, CATEGORY_NO
                                    FROM
                                    (
                                        SELECT
                                            '".$i."' AS NUM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, T.REG_DT,
                                            T.CLOSE_YMD, T.DEPLOY_YMD, T.TAG, T.NOTE, T.PROJECT_NO, T.SECTION_NO, T.HIT_CNT, T.SCRAP_CNT, T.LIKE_CNT, T.REPLY_CNT,
                                            C.CATEGORY_NO
                                        FROM
                                            CMS_TASK T, CONTENT_CATEGORY C,
                                            (
                                                SELECT
                                                    TARGET_NO
                                                FROM
                                                    CONTENT_CATEGORY
                                                WHERE CATEGORY_NO IN (".$where_category.")
                                                GROUP BY TARGET_NO
                                            ) AS TEMP
                                        WHERE
                                            T.NO = C.TARGET_NO
                                            AND TEMP.TARGET_NO = T.NO
                                            ".$select_where."
                                            ".$search_where."
                                        ORDER BY REG_DT DESC
                                        ".$limit."
                                    ) AS DATA,
                                    (SELECT @RNUM := 0) R
                                   ";

                        if (sizeof($arr_category) - 1 != $i) $select .= "UNION ";
                    }
                }

                $sql = "SELECT
                            NUM, RNUM, NO, PHASE, SUBJECT, EDITOR_ID, EDITOR_NM, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CLOSE_YMD, DEPLOY_YMD, TAG, NOTE, HIT_CNT, SCRAP_CNT, LIKE_CNT, REPLY_CNT, CATEGORY_NO
                        FROM
                        (
                            ".$select."
                        ) AS DATA
                        ORDER BY RNUM ASC, NUM ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    if ($_search[FILE]) {
                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    CMS_CONTENT C, FILE F, CONTENT_SOURCE S
                                WHERE
                                    C.NO = S.TARGET_NO
                                    AND F.NO = S.SOURCE_NO
                                    AND C.TASK_NO = ".$row['NO']."
                                    AND C.CURRENT_FL = 'Y'
                                    AND S.CONTENT_GB = 'FILE'
                                    AND S.TARGET_GB = 'CONTENT'
                                    AND F.FILE_GB = 'MAIN'
                                ";

                        $file_result = $_d->sql_query($sql);
                        $file_data = $_d->sql_fetch_array($file_result);
                        $row['FILE'] = $file_data;
                    }

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ($_type == 'item') {
                if ( trim($_model[SUBJECT]) == "" ) {
                    $_d->failEnd("제목을 작성 하세요");
                }

                if ( trim($_model[PHASE]) == "" ) {
                    $_model[PHASE] = '0';
                }

                $project_no = 0;
                $project_st = '1';

                if ( trim($_model[PROJECT_NO]) != "" ) {
                    $project_no = $_model[PROJECT_NO];
                }

                if (count($_model[PROJECT]) > 0) {
                    $project = $_model[PROJECT];
                    $project_no = $project[NO];
                    $project_st = $project[PROJECT_ST];
                }

                // 2014.11.14(금) SECTION 섹션 추가
                if (count($_model[SECTION]) > 0) {
                    $section = $_model[SECTION];
                    $section_no = $section[NO];
                    $section_nm = $section[SECTION_NM];
                    $season_nm = $section[SEASON_NM];
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO CMS_TASK
                        (
                            PHASE
                            ,SUBJECT
                            ,EDITOR_ID
                            ,EDITOR_NM
                            ,REG_UID
                            ,REG_NM
                            ,REG_DT
                            ,CLOSE_YMD
                            ,DEPLOY_YMD
                            ,PROJECT_NO
                            ,SECTION_NO
                            ,TAG
                            ,NOTE
                        ) VALUES (
                            '".$_model[PHASE]."'
                            ,'".$_model[SUBJECT]."'
                            ,'".$_model[EDITOR_ID]."'
                            ,'".$_model[EDITOR_NM]."'
                            ,'".$_SESSION['uid']."'
                            ,'".$_SESSION['name']."'
                            ,SYSDATE()
                            ,'".$_model[CLOSE_YMD]."'
                            ,'".$_model[DEPLOY_YMD]."'
                            ,".$project_no."
                            ,".$section_no."
                            ,'".$_model[TAG]."'
                            ,'".$_model[NOTE]."'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (count($_model[CATEGORY]) > 0) {
                    $categories = $_model[CATEGORY];

                    for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                        $category = $categories[$i];

                        $sql = "INSERT INTO CONTENT_CATEGORY
                        (
                            CATEGORY_NO
                            ,TARGET_NO
                            ,TARGET_GB
                        ) VALUES (
                            '".$category[NO]."'
                            , '".$no."'
                            , 'T'
                        )";

                        $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if (!empty($_model[NO]) && $_model[PHASE] > 0) {
                    $sql = "UPDATE CMS_CONTENT
                            SET
                                CURRENT_FL = 'N'
                            WHERE
                                NO = ".$_model[NO]."
                            ";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                if (!($_d->mysql_errno > 0) && ($project_st == 0)) {
                    $sql = "UPDATE CMS_PROJECT
                            SET
                                PROJECT_ST = '1'
                            WHERE
                                NO = ".$project_no."
                            ";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
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
                            ,ETC
                        ) VALUES (
                            '".$no."'
                            ,'CREATE'
                            ,SYSDATE()
                            ,'".$_SESSION['uid']."'
                            ,'".$no."'
                            ,'TASK'
                            ,'CREATE'
                            ,'".$ip."'
                            ,'/task'
                            ,'".$_model[SUBJECT]."'
                        )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'delete') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO CMS_TASK_DEL
                            SELECT * FROM CMS_TASK
                            WHERE NO = ".$_model[NO]."
                       ";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
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
                                ,ETC
                            ) VALUES (
                                '".$no."'
                                ,'DELETE'
                                ,SYSDATE()
                                ,'".$_SESSION['uid']."'
                                ,'".$no."'
                                ,'TASK'
                                ,'DELETE'
                                ,'".$ip."'
                                ,'/task'
                                ,''
                            )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ($_type == 'item') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                if ( trim($_model[PHASE]) == "" ) {
                    $_model[PHASE] = '0';
                }

                $project_no = 0;
                $project_st = '1';

                if ( trim($_model[PROJECT_NO]) != "" ) {
                    $project_no = $_model[PROJECT_NO];
                }

                if (count($_model[PROJECT]) > 0) {
                    $project = $_model[PROJECT];
                    $project_no = $project[NO];
                    $project_st = $project[PROJECT_ST];
                }

                // 2014.11.14(금) SECTION 섹션 추가
                if (count($_model[SECTION]) > 0) {
                    $section = $_model[SECTION];
                    $section_no = $section[NO];
                    $section_nm = $section[SECTION_NM];
                }

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$_model[PHASE]."'
                            ,SUBJECT = '".$_model[SUBJECT]."'
                            ,EDITOR_ID = '".$_model[EDITOR_ID]."'
                            ,EDITOR_NM = '".$_model[EDITOR_NM]."'
                            ,REG_UID = '".$_SESSION['uid']."'
                            ,REG_NM = '".$_SESSION['name']."'
                            ,CLOSE_YMD = '".$_model[CLOSE_YMD]."'
                            ,DEPLOY_YMD = '".$_model[DEPLOY_YMD]."'
                            ,PROJECT_NO = ".$project_no."
                            ,SECTION_NO = ".$section_no."
                            ,TAG = '".$_model[TAG]."'
                            ,NOTE = '".$_model[NOTE]."'
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($_model[PHASE] == '30') {

                    $sql = "SELECT
                                PHASE
                            FROM
                                CMS_TASK
                            WHERE
                                PROJECT_NO = '".$project_no."'
                    ";

                    $result = $_d->sql_query($sql,true);
                    $project_st = '2';
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                        if ($row[PHASE] != '30' && $row[PHASE] != '31') {
                            $project_st = '1';
                        }
                    }

                    if ($is_all) {
                        $sql = "UPDATE CMS_PROJECT
                                SET
                                    PROJECT_ST = '".$project_st."'
                                WHERE
                                    NO = ".$project_no."
                                ";

                        $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if (count($_model[CATEGORY]) > 0) {

                    $sql = "DELETE FROM CONTENT_CATEGORY
                            WHERE
                                TARGET_NO = ".$_key."
                            ";

                    $_d->sql_query($sql);

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $categories = $_model[CATEGORY];

                    for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                        $category = $categories[$i];

                        $sql = "INSERT INTO CONTENT_CATEGORY
                                (
                                    CATEGORY_NO
                                    ,TARGET_NO
                                    ,TARGET_GB
                                ) VALUES (
                                    '".$category[NO]."'
                                    , '".$_key."'
                                    , 'T'
                                )";

                        $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
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
                        ,ETC
                    ) VALUES (
                        '".$_key."'
                        ,'UPDATE'
                        ,SYSDATE()
                        ,'".$_SESSION['uid']."'
                        ,'".$_key."'
                        ,'TASK'
                        ,'UPDATE'
                        ,'".$ip."'
                        ,'/task'
                        ,'".$_model[SUBJECT]."'
                    )";

                    $_d->sql_query($sql);

                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "status") {
                $sql = "UPDATE CMS_TASK
                            SET
                                PHASE = '".$_phase."'
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
            } else if ($_type == 'like') {

                $sql = "UPDATE CMS_TASK SET
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
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_TASK WHERE NO = ".$_key;

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