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
            if ($_type == "contents") {
                $search_where = "";

                $sql = "SELECT
                            DISTINCT E.SECTION_ORD, E.SECTION_NO, S.SECTION_NM
                        FROM
                            CMS_EPUB E, CMS_SECTION S
                        WHERE
                            E.SECTION_NO = S.NO
                            AND E.PROJECT_NO = ".$project_no."
                            ".$search_where."
                        ORDER BY E.SECTION_ORD
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                E.TASK_ORD, T.SUBJECT
                            FROM
                                CMS_EPUB E, CMS_TASK T
                            WHERE
                                E.TASK_NO = T.NO
                                AND E.PROJECT_NO = ".$project_no."
                                AND E.SECTION_NO = ".$row['SECTION_NO']."
                            ORDER BY E.TASK_ORD
                            ";

                    $task_data = $_d->getData($sql);
                    $row['TASK'] = $task_data;

                    $__trn->rows[$i] = $row;
                }

                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } if ($_type == "contents_str") {
                $html = "";

                $sql = "SELECT
                            DISTINCT E.SECTION_ORD, E.SECTION_NO, S.SECTION_NM
                        FROM
                            CMS_EPUB E, CMS_SECTION S
                        WHERE
                            E.SECTION_NO = S.NO
                            AND E.PROJECT_NO = ".$project_no."
                            ".$search_where."
                        ORDER BY E.SECTION_ORD
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $html .= "<span>".$row['SECTION_NM']."</span>";

                    $sql = "SELECT
                                E.TASK_ORD, T.SUBJECT
                            FROM
                                CMS_EPUB E, CMS_TASK T
                            WHERE
                                E.TASK_NO = T.NO
                                AND E.PROJECT_NO = ".$project_no."
                                AND E.SECTION_NO = ".$row['SECTION_NO']."
                            ORDER BY E.TASK_ORD
                            ";

                    $sub_result = $_d->sql_query($sql,true);
                    for ($j=0; $sub_row=$_d->sql_fetch_array($sub_result); $j++) {
                        $html .= "<span>".$sub_row['SUBJECT']."</span>";
                    }
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($html);
                }
            } else if ($_type == "page") {
                $search_where = "";

                $sql = "SELECT
                                T.SUBJECT, C.BODY
                            FROM
                                CMS_CONTENT C, CMS_TASK T
                            WHERE
                                C.TASK_NO = T.NO
                                AND T.NO = ".$task_no."
                                AND T.PROJECT_NO = ".$project_no."
                                ".$search_where."
                            ";

                $data  = $_d->sql_fetch($sql);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd3($data['BODY']);
                }
            } else if ($_type == "item") {
                $search_where = "";

                $sql = "SELECT
                            C.NO, C.SUPER_NO, C.PHASE, C.VERSION, C.BODY, C.CONTENT_ST, C.REG_UID, C.REG_NM, DATE_FORMAT(C.REG_DT, '%Y-%m-%d') AS REG_DT,
                            C.CURRENT_FL, C.MODIFY_FL, C.HIT_CNT, C.SCRAP_CNT, C.TASK_NO, T.EDITOR_ID, T.SUMMARY
                        FROM
                            CMS_CONTENT C, CMS_TASK T
                        WHERE
                            C.TASK_NO = T.NO
                            ".$search_where."
                            AND T.NO = ".$_key."
                        ";

                $data  = $_d->sql_fetch($sql);

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == "list") {
                $search_where = "";

                $sql = "SELECT
                            DISTINCT E.URL, E.EPUB_GB, E.SECTION_ORD, E.TASK_ORD, P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.SUMMARY,
                            T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, DATE_FORMAT(T.REG_DT, '%Y-%m-%d') AS REG_DT,
                            T.CLOSE_YMD, T.DEPLOY_YMD, T.TAG, T.NOTE, T.PROJECT_NO, T.SECTION_NO, T.HIT_CNT, T.SCRAP_CNT, T.LIKE_CNT, T.REPLY_CNT
                        FROM
                            CMS_EPUB E
                            INNER JOIN CMS_TASK T ON E.TASK_NO = T.NO
                            INNER JOIN CMS_PROJECT P ON T.PROJECT_NO = P.NO
                        WHERE
                            1 = 1
                            ".$search_where."
                        ORDER BY ".$sort_order."
                        ".$limit;

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            }

            break;

        case "POST":
            $err = 0;
            $msg = "";

            $page = 1;

            $_d->sql_beginTransaction();

            $project_no = $_model[0]['data'][0]['PROJECT_NO'];

            $sql = "DELETE FROM CMS_EPUB WHERE PROJECT_NO = '".$project_no."'";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            for ($i = 0 ; $i < count($_model); $i++) {
                MtUtil::_d("------------>>>>> section : ".$i);

                $section = $_model[$i]['data'];
                for ($j = 0 ; $j < count($section); $j++) {
                    $task = $section[$j];
                    MtUtil::_d("------------>>>>> task : ".$task['SUBJECT']);

                    $sql = "INSERT INTO CMS_EPUB
                            (
                                TASK_NO
                                ,PROJECT_NO
                                ,SECTION_NO
                                ,REG_DT
                                ,URL
                                ,EPUB_GB
                                ,SECTION_ORD
                                ,TASK_ORD
                                ,PAGE_ORD
                            ) VALUES (
                                '".$task['NO']."'
                                ,'".$task['PROJECT_NO']."'
                                ,'".$task['SECTION_NO']."'
                                ,SYSDATE()
                                ,'".BASE_URL."/serverscript/services/cms/epub.php?_method=GET&_type=page&project_no={$task['PROJECT_NO']}&task_no={$task['NO']}'
                                ,'".$task['EPUB_GB']."'
                                ,".$i."
                                ,".$j."
                                ,".$page++."
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            $sql = "UPDATE CMS_PROJECT SET EPUB_FL = 'Y' WHERE PROJECT_NO = '".$project_no."'";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($page);
            }

            break;

        case "PUT":

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_EPUB WHERE PROJECT_NO = ".$_key;

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