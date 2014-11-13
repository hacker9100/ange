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
            if (isset($_key) && $_key != "") {
                $sql = "SELECT
                            NO, YEAR, SERIES_NO, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST, NOTE
                        FROM
                            CMS_PROJECT
                        WHERE
                            NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            NO, SERIES_NM, SERIES_GB, SERIES_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                        FROM
                            CMS_SERIES
                        WHERE
                            NO = ".$data[SERIES_NO]."
                        ";

                $result = $_d->sql_query($sql);
                $series_data = $_d->sql_fetch_array($result);
                $data['SERIES'] = $series_data;

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_NO = ".$_key."
                            AND F.THUMB_FL = '0'
                        ";

                $file_data = $_d->getData($sql);
                $data['FILE'] = $file_data;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else {
                if (isset($_mode)) {
                    $sql = "SELECT
                                NO, SUBJECT, PROJECT_ST
                            FROM
                                CMS_PROJECT
                            WHERE
                                PROJECT_ST <> '2'
                            ORDER BY REG_DT DESC
                            ";
                } else {
                    $where_search = "";
                    $limit_search = "";

                    if (isset($_status)) {
                        $in_str = "";
                        $arr_status = explode(',', $_status);
                        for($i=0;$i< sizeof($arr_status);$i++){
                            $in_str = $in_str."'".$arr_status[$i]."'";
                            if (sizeof($arr_status) - 1 != $i) $in_str = $in_str.",";
                        }

                        $where_search = "AND PROJECT_ST IN (".$in_str.") ";
                    }

                    if (isset($_page)) {
                        $limit_search .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                    }

                    if (isset($_search[YEAR]) && $_search[YEAR] != "") {
                        $where_search .= "AND YEAR  = '".$_search[YEAR]."' ";
                    }
                    if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                        $where_search .= "AND ".$_search[ORDER][value]." LIKE '%".$_search[KEYWORD]."%' ";
                    }

                    if (isset($_search[ROLE]) && $_search[ROLE] != "") {
                        $sql = "SELECT
                                    NO AS PROJECT_NO, SUBJECT
                                FROM
                                    CMS_PROJECT
                            ";
                    } else {
                        $sql = "SELECT
                                TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                                NO, YEAR, (SELECT SERIES_NM FROM CMS_SERIES WHERE NO = DATA.SERIES_NO) AS SERIES_NM, SERIES_NO, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST
                            FROM
                            (
                                SELECT
                                    NO, YEAR, SERIES_NO, SUBJECT, REG_UID, REG_NM, REG_DT, PROJECT_ST
                                FROM
                                    CMS_PROJECT
                                WHERE
                                    1=1
                                    ".$where_search."
                                ORDER BY REG_DT DESC
                                ".$limit_search."
                            ) AS DATA,
                            (SELECT @RNUM := 0) R,
                            (
                                SELECT
                                    COUNT(*) AS TOTAL_COUNT
                                FROM
                                    CMS_PROJECT
                                WHERE
                                    1=1
                                    ".$where_search."
                            ) CNT
                            ";
                    }

                }

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd($sql);
                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
/*
            $upload_path = '../upload/';
            $source_path = '../../../';

            if (count($form[FILES]) > 0) {
                $files = $form[FILES];

//                @mkdir('$source_path');

                for ($i = 0 ; $i < count($form[FILES]); $i++) {
                    $file = $files[$i];

                    if (file_exists($upload_path.$file[name])) {
                        rename($upload_path.$file[name], $source_path.$file[name]);
                    }
                }
            }
*/
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($_model[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($_model[PROJECT_ST]) == "" ) {
                $_model[PROJECT_ST] = '0';
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_PROJECT
                    (
                        SERIES_NO
                        ,YEAR
                        ,SUBJECT
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                        ,PROJECT_ST
                        ,NOTE
                    ) VALUES (
                        '".$_model[SERIES][NO]."'
                        ,'".$_model[YEAR]."'
                        ,'".$_model[SUBJECT]."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'0'
                        ,'".$_model[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (isset($_model[FILE])) {
                $file = $_model[FILE];

                MtUtil::_c("------------>>>>> file : ".$file['name']);

                $sql = "INSERT INTO FILE
                (
                    FILE_NM
                    ,PATH
                    ,FILE_EXT
                    ,FILE_SIZE
                    ,THUMB_FL
                    ,REG_DT
                    ,FILE_ST
                ) VALUES (
                    '".$file[name]."'
                    , '".$file[url]."'
                    , '".$file[type]."'
                    , '".$file[size]."'
                    , '0'
                    , SYSDATE()
                    , 'C'
                )";

                $_d->sql_query($sql);
                $ori_file_no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "INSERT INTO CONTENT_SOURCE
                (
                    TARGET_NO
                    ,SOURCE_NO
                    ,CONTENT_GB
                    ,SORT_IDX
                ) VALUES (
                    '".$no."'
                    , '".$ori_file_no."'
                    , 'FILE'
                    , '0'
                )";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "INSERT INTO FILE
                (
                    FILE_NM
                    ,PATH
                    ,FILE_EXT
                    ,FILE_SIZE
                    ,ORIGINAL_NO
                    ,THUMB_FL
                    ,REG_DT
                    ,FILE_ST
                ) VALUES (
                    '".$file[name]."'
                    , '".$file[thumbnailUrl]."'
                    , '".$file[type]."'
                    , ''
                    , '".$ori_file_no."'
                    , '1'
                    , SYSDATE()
                    , 'C'
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
                    ,SORT_IDX
                ) VALUES (
                    '".$no."'
                    , '".$file_no."'
                    , 'FILE'
                    , '0'
                )";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $sql = "INSERT INTO FILE
                (
                    FILE_NM
                    ,PATH
                    ,FILE_EXT
                    ,FILE_SIZE
                    ,ORIGINAL_NO
                    ,THUMB_FL
                    ,REG_DT
                    ,FILE_ST
                ) VALUES (
                    '".$file[name]."'
                    , '".$file[mediumUrl]."'
                    , '".$file[type]."'
                    , ''
                    , '".$ori_file_no."'
                    , '2'
                    , SYSDATE()
                    , 'C'
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
                    ,SORT_IDX
                ) VALUES (
                    '".$no."'
                    , '".$file_no."'
                    , 'FILE'
                    , '0'
                )";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($_model[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE CMS_PROJECT
                    SET
                        SERIES_NO = '".$_model[SERIES][NO]."'
                        ,YEAR = '".$_model[YEAR]."'
                        ,SUBJECT = '".$_model[SUBJECT]."'
                        ,PROJECT_ST = '".( $_model[COMPLETE_FL] == true ? "3" : $_model[PROJECT_ST] )."'
                        ,NOTE = '".$_model[NOTE]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (isset($_model[FILE])) {
                $file = $_model[FILE];

                MtUtil::_c("------------>>>>> file : ".$file['name']);

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_NO = ".$_key."
                            AND F.THUMB_FL = '0'
                        ";

                $result = $_d->sql_query($sql);
                $file_data  = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                MtUtil::_c("------------>>>>> FILE_NM : ".$file_data[FILE_NM]);
                MtUtil::_c("------------>>>>> name : ".$file[name]);

                if ($file_data == null || $file_data[FILE_NM] != $file[name]) {
                    $sql = "DELETE FROM FILE
                            WHERE NO IN (
                                SELECT NO FROM (
                                    SELECT
                                        F.NO
                                    FROM
                                        FILE F, CONTENT_SOURCE S
                                    WHERE
                                        F.NO = S.SOURCE_NO
                                        AND S.TARGET_NO = ".$_key."
                                ) AS DATA
                            )
                            ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "DELETE FROM CONTENT_SOURCE
                            WHERE
                                TARGET_NO = ".$_key."
                            ";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO FILE
                    (
                        FILE_NM
                        ,PATH
                        ,FILE_EXT
                        ,FILE_SIZE
                        ,THUMB_FL
                        ,REG_DT
                        ,FILE_ST
                    ) VALUES (
                        '".$file[name]."'
                        , '".$file[url]."'
                        , '".$file[type]."'
                        , '".$file[size]."'
                        , '0'
                        , SYSDATE()
                        , 'C'
                    )";

                    $_d->sql_query($sql);
                    $ori_file_no = $_d->mysql_insert_id;

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO CONTENT_SOURCE
                    (
                        TARGET_NO
                        ,SOURCE_NO
                        ,CONTENT_GB
                        ,SORT_IDX
                    ) VALUES (
                        '".$_key."'
                        , '".$ori_file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO FILE
                    (
                        FILE_NM
                        ,PATH
                        ,FILE_EXT
                        ,FILE_SIZE
                        ,ORIGINAL_NO
                        ,THUMB_FL
                        ,REG_DT
                        ,FILE_ST
                    ) VALUES (
                        '".$file[name]."'
                        , '".$file[thumbnailUrl]."'
                        , '".$file[type]."'
                        , ''
                        , '".$ori_file_no."'
                        , '1'
                        , SYSDATE()
                        , 'C'
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
                        ,SORT_IDX
                    ) VALUES (
                        '".$_key."'
                        , '".$file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $sql = "INSERT INTO FILE
                    (
                        FILE_NM
                        ,PATH
                        ,FILE_EXT
                        ,FILE_SIZE
                        ,ORIGINAL_NO
                        ,THUMB_FL
                        ,REG_DT
                        ,FILE_ST
                    ) VALUES (
                        '".$file[name]."'
                        , '".$file[mediumUrl]."'
                        , '".$file[type]."'
                        , ''
                        , '".$ori_file_no."'
                        , '2'
                        , SYSDATE()
                        , 'C'
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
                        ,SORT_IDX
                    ) VALUES (
                        '".$_key."'
                        , '".$file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_PROJECT WHERE NO = ".$_key;

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