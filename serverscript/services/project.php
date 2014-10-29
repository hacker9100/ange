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
                            NO, YEAR, MONTH, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST, NOTE
                        FROM
                            CMS_PROJECT
                        WHERE
                            NO = ".$id."
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_NO = ".$id."
                            AND F.THUMB_FL = '0'
                        ";

                $file_data = $_d->getData($sql);

                $data['FILE'] = $file_data;

                $_d->dataEnd2($data);

//                $data = $_d->sql_query($sql);
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd($sql);
//                }
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
                    $search = "";

                    if (isset($_search) && count($_search) > 0) {
                        for ($i = 0 ; $i < count($_search); $i++) {
                            $item = $_search[$i];
                            $arr_item = explode('/', $item);

                            $search .= "AND ".$arr_item[0]." LIKE '%".$arr_item[1]."%' ";
                        }
                    }

                    $sql = "SELECT
                                TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                                NO, YEAR, MONTH, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST
                            FROM
                            (
                                SELECT
                                    NO, YEAR, MONTH, SUBJECT, REG_UID, REG_NM, REG_DT, PROJECT_ST
                                FROM
                                    CMS_PROJECT
                                WHERE
                                    1=1
                                    ".$search."
                                ORDER BY REG_DT DESC
                            ) AS DATA,
                            (SELECT @RNUM := 0) R,
                            (
                                SELECT
                                    COUNT(*) AS TOTAL_COUNT
                                FROM
                                    CMS_PROJECT
                                WHERE
                                    1=1
                                    ".$search."
                            ) CNT
                            ";
                }

                $_d->dataEnd($sql);

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
            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($form[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($form[PROJECT_ST]) == "" ) {
                $form[PROJECT_ST] = '0';
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_PROJECT
                    (
                        YEAR
                        ,MONTH
                        ,SUBJECT
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                        ,PROJECT_ST
                        ,NOTE
                    ) VALUES (
                        '".$form[YEAR]."'
                        ,'".$form[MONTH]."'
                        ,'".$form[SUBJECT]."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'".$form[PROJECT_ST]."'
                        ,'".$form[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (isset($form[FILE])) {
                $file = $form[FILE];

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

            if ( trim($form[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            $sql = "UPDATE CMS_PROJECT
                    SET
                        YEAR = '".$form[YEAR]."'
                        ,MONTH = '".$form[MONTH]."'
                        ,SUBJECT = '".$form[SUBJECT]."'
                        ,REG_UID = '".$_SESSION['uid']."'
                        ,REG_NM = '".$_SESSION['name']."'
                        ,PROJECT_ST = '".$form[PROJECT_ST]."'
                        ,NOTE = '".$form[NOTE]."'
                    WHERE
                        NO = ".$id."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if (isset($form[FILE])) {
                $file = $form[FILE];

                MtUtil::_c("------------>>>>> file : ".$file['name']);

                $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            FILE F, CONTENT_SOURCE S
                        WHERE
                            F.NO = S.SOURCE_NO
                            AND S.TARGET_NO = ".$id."
                            AND F.THUMB_FL = '0'
                        ";

                $result = $_d->sql_query($sql);
                $file_data  = $_d->sql_fetch_array($result);

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
                                        AND S.TARGET_NO = ".$id."
                                ) AS DATA
                            )
                            ";

                    $_d->sql_query($sql);

                    $sql = "DELETE FROM CONTENT_SOURCE
                            WHERE
                                TARGET_NO = ".$id."
                            ";

                    $_d->sql_query($sql);

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

                    $sql = "INSERT INTO CONTENT_SOURCE
                    (
                        TARGET_NO
                        ,SOURCE_NO
                        ,CONTENT_GB
                        ,SORT_IDX
                    ) VALUES (
                        '".$id."'
                        , '".$ori_file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);

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

                    $sql = "INSERT INTO CONTENT_SOURCE
                    (
                        TARGET_NO
                        ,SOURCE_NO
                        ,CONTENT_GB
                        ,SORT_IDX
                    ) VALUES (
                        '".$id."'
                        , '".$file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);

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

                    $sql = "INSERT INTO CONTENT_SOURCE
                    (
                        TARGET_NO
                        ,SOURCE_NO
                        ,CONTENT_GB
                        ,SORT_IDX
                    ) VALUES (
                        '".$id."'
                        , '".$file_no."'
                        , 'FILE'
                        , '0'
                    )";

                    $_d->sql_query($sql);
                }
            }

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("수정실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($id)) {
                $_d->failEnd("삭제실패입니다:"."ID가 누락되었습니다.");
            }

            $sql = "DELETE FROM CMS_PROJECT WHERE NO = ".$id;

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