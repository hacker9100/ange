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

    switch ($_method) {
        case "GET":
            if (isset($id)) {
                $sql = "SELECT
                            P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, DATE_FORMAT(T.REG_DT, '%Y-%m-%d') AS REG_DT,
                            T.CLOSE_YMD, T.TAG, T.NOTE, T.PROJECT_NO
                        FROM
                            CMS_TASK T, CMS_PROJECT P
                        WHERE
                            T.PROJECT_NO = P.NO
                            AND T.NO = ".$id."
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                        FROM
                            CMS_TASK T, CONTENT_CATEGORY CC, CATEGORY C
                        WHERE
                            T.NO = CC.TARGET_NO
                            AND CC.CATEGORY_NO = C.NO
                            AND T.NO = ".$id."
                        ";

                $category_data = $_d->getData($sql);

                $data['CATEGORY'] = $category_data;

                $_d->dataEnd2($data);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
            } else {
                $where_search = "";
                $from_category = "";
                $limit_search = "";

                if (isset($_phase)) {
                    $in_str = "";
                    $arr_phase = explode(',', $_phase);
                    for($i=0;$i< sizeof($arr_phase);$i++){
                        $in_str = $in_str."'".$arr_phase[$i]."'";
                        if (sizeof($arr_phase) - 1 != $i) $in_str = $in_str.",";
                    }

                    $where_search = "AND T.PHASE IN (".$in_str.") ";
                }

                MtUtil::_c("### [START]".$_page);
                MtUtil::_c("### [START]".$_size);

                if (isset($_page) && isset($_size)) {
                    $limit_search .= "LIMIT ".($_page * $_size).", ".$_size;
                }

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
                    if (isset($_search[YEAR]) && $_search[YEAR] != 'null') {
                        $where_search .= "AND P.YEAR  = '".$_search[YEAR]."' ";
                    }
                    if (isset($_search[PROJECT]) && $_search[PROJECT] != 'null') {
                        $where_search .= "AND P.NO  = '".$_search[PROJECT][NO]."' ";
                    }
                    if (isset($_search[KEYWORD])) {
                        $where_search .= "AND T.".$_search[ORDER][value]." LIKE '%".$_search[KEYWORD]."%' ";
                    }
                    if (isset($_search[CATEGORY])) {
                        $where_category = "";
                        for ($i = 0; $i < count($_search[CATEGORY]); $i++) {
                            $category = $_search[CATEGORY][$i];
                            $where_category .= $category[NO].($i != count($_search[CATEGORY]) - 1 ? "," : "");
                        }

                        $from_category = ",(
                                              SELECT
                                                  TARGET_NO
                                              FROM
                                                  CONTENT_CATEGORY
                                              WHERE CATEGORY_NO IN (".$where_category.")
                                              GROUP BY TARGET_NO
                                          ) AS C ";

                        $where_search .= "AND C.TARGET_NO = T.NO ";
                    }
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            PROJECT_NM, NO, PHASE, SUBJECT, EDITOR_ID, EDITOR_NM, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT,
                            CLOSE_YMD, TAG, NOTE, PROJECT_NO
                        FROM
                        (
                            SELECT
                                P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, T.REG_DT,
                                T.CLOSE_YMD, T.TAG, T.NOTE, T.PROJECT_NO
                            FROM
                                CMS_TASK T, CMS_PROJECT P
                                ".$from_category."
                            WHERE
                                T.PROJECT_NO = P.NO
                                ".$where_search."
                            ORDER BY T.REG_DT DESC
                            ".$limit_search."
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
                                ".$where_search."
                        ) CNT
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                            C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST
                        FROM
                            CMS_TASK T, CONTENT_CATEGORY CC, CATEGORY C
                        WHERE
                            T.NO = CC.TARGET_NO
                            AND CC.CATEGORY_NO = C.NO
                            AND T.NO = ".$row['NO']."
                        ";

                    $category_data = $_d->getData($sql);
                    $row['CATEGORY'] = $category_data;

                    $__trn->rows[$i] = $row;
                }
                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                $_d->dataEnd2($data);

//                $_d->dataEnd($sql);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
            }

            break;

        case "POST":
            $form = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($form[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($form[PHASE]) == "" ) {
                $form[PHASE] = '0';
            }

            $project_no = 0;
            $project_st = '1';

            if ( trim($form[PROJECT_NO]) != "" ) {
                $project_no = $form[PROJECT_NO];
            }

            if (count($form[PROJECT]) > 0) {
                $project = $form[PROJECT];
                $project_no = $project[NO];
                $project_st = $project[PROJECT_ST];
            }

            $_d->sql_beginTransaction();

            MtUtil::_c("### [SUPER_NO] ".( empty($form[SUPER_NO]) ? 0 : $form[SUPER_NO]) );

            $sql = "INSERT INTO CMS_TASK
                    (
                        PHASE
                        ,SUBJECT
                        ,EDITOR_ID
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                        ,CLOSE_YMD
                        ,PROJECT_NO
                        ,TAG
                        ,NOTE
                    ) VALUES (
                        '".$form[PHASE]."'
                        ,'".$form[SUBJECT]."'
                        ,'".$form[EDITOR_ID]."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'".$form[CLOSE_YMD]."'
                        ,".$project_no."
                        ,'".$form[TAG]."'
                        ,'".$form[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (count($form[CATEGORY]) > 0) {
                $categories = $form[CATEGORY];

                for ($i = 0 ; $i < count($form[CATEGORY]); $i++) {
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
                }
            }

            if (!empty($form[NO]) && $form[PHASE] > 0) {
                $sql = "UPDATE CONTENT
                        SET
                            CURRENT_FL = '1'
                        WHERE
                            NO = ".$form[NO]."
                        ";

                $_d->sql_query($sql);
            }

            if (!($_d->mysql_errno > 0) && ($project_st == 0)) {
                $sql = "UPDATE CMS_PROJECT
                        SET
                            PROJECT_ST = '1'
                        WHERE
                            NO = ".$project_no."
                        ";

                $_d->sql_query($sql);
            }

            if ($_d->mysql_errno > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$_d->mysql_error);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($id)) {
                $_d->failEnd("수정실패입니다:"."ID가 누락되었습니다.");
            }

            $form = json_decode(file_get_contents("php://input"),true);

            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if (isset($_phase)) {
                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$_phase."'
                        WHERE
                            NO = ".$id."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else {

                $_d->sql_beginTransaction();

                if ( trim($form[PHASE]) == "" ) {
                    $form[PHASE] = '0';
                }

                $project_no = 0;
                $project_st = '1';

                if ( trim($form[PROJECT_NO]) != "" ) {
                    $project_no = $form[PROJECT_NO];
                }

                if (count($form[PROJECT]) > 0) {
                    $project = $form[PROJECT];
                    $project_no = $project[NO];
                    $project_st = $project[PROJECT_ST];
                }

                $sql = "UPDATE CMS_TASK
                        SET
                            PHASE = '".$form[PHASE]."'
                            ,SUBJECT = '".$form[SUBJECT]."'
                            ,EDITOR_ID = '".$form[EDITOR_ID]."'
                            ,REG_UID = '".$_SESSION['uid']."'
                            ,REG_NM = '".$_SESSION['name']."'
                            ,CLOSE_YMD = '".$form[CLOSE_YMD]."'
                            ,PROJECT_NO = ".$project_no."
                            ,TAG = '".$form[TAG]."'
                            ,NOTE = '".$form[NOTE]."'
                        WHERE
                            NO = ".$id."
                        ";

                $_d->sql_query($sql);

                if (count($form[CATEGORY]) > 0) {

                    $sql = "DELETE FROM CONTENT_CATEGORY
                            WHERE
                                TARGET_NO = ".$id."
                            ";

                    $_d->sql_query($sql);

                    $categories = $form[CATEGORY];

                    for ($i = 0 ; $i < count($form[CATEGORY]); $i++) {
                        $category = $categories[$i];

                        $sql = "INSERT INTO CONTENT_CATEGORY
                                (
                                    CATEGORY_NO
                                    ,TARGET_NO
                                    ,TARGET_GB
                                ) VALUES (
                                    '".$category[NO]."'
                                    , '".$id."'
                                    , 'T'
                                )";

                        $_d->sql_query($sql);
                    }
                }

                if ($_d->mysql_errno > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

//            $_d->sql_query($sql);
//            $no = $_d->mysql_insert_id;
//            if ($_d->mysql_errno > 0) {
//                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
//            } else {
//                $_d->succEnd($no);
//            }

            break;

        case "DELETE":
            if (!isset($id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_TASK WHERE NO = ".$id;

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