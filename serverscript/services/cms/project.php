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
            if ($_type == 'item') {
                $sql = "SELECT
                            NO, YEAR, SERIES_NO, SUBJECT, ISBN_NO, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST, NOTE
                        FROM
                            CMS_PROJECT
                        WHERE
                            NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if ($data) {
                    $sql = "SELECT
                                NO, SERIES_NM, SERIES_GB, SERIES_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, NOTE
                            FROM
                                CMS_SERIES
                            WHERE
                                NO = ".$data['SERIES_NO']."
                            ";

                    $result = $_d->sql_query($sql);
                    $series_data = $_d->sql_fetch_array($result);
                    $data['SERIES'] = $series_data;

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'PROJECT'
                                AND F.TARGET_NO = ".$_key."
                            ";

                    $data['FILE'] = $_d->getData($sql);
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
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
                    $search_where = "";
                    $sort_order = "";
                    $limit = "";

                    if (isset($_search['STATUS'])) {
                        $in_str = "";
                        $arr_status = explode(',', $_search['STATUS']);
                        for($i=0;$i< sizeof($arr_status);$i++){
                            $in_str = $in_str."'".$arr_status[$i]."'";
                            if (sizeof($arr_status) - 1 != $i) $in_str = $in_str.",";
                        }

                        $search_where = "AND PROJECT_ST IN (".$in_str.") ";
                    }
                    if (isset($_search['IS_PROGRESS']) && $_search['IS_PROGRESS'] != "") {
                        if ($_search['IS_PROGRESS'] == 'true') {
                            $search_where .= "AND PROJECT_ST IN ('0', '1') ";
                        }
                    }
                    if (isset($_search['YEAR']) && $_search['YEAR'] != "") {
                        $search_where .= "AND YEAR  = '".$_search['YEAR']."' ";
                    }
                    if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                        $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%' OR NOTE LIKE '%".$_search['KEYWORD']."%'";
                    }

                    if (isset($_search['SORT']) && $_search['SORT'] != "") {
                        $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                    }

                    if (isset($_page)) {
                        $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                    }

                    if (isset($_search['ROLE']) && $_search['ROLE'] != "") {
                        $sql = "SELECT
                                    NO AS PROJECT_NO, SUBJECT
                                FROM
                                    CMS_PROJECT
                                WHERE
                                    1=1
                                ";
                    } else {
                        $sql = "SELECT
                                    TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                                    NO, YEAR, (SELECT SERIES_NM FROM CMS_SERIES WHERE NO = DATA.SERIES_NO) AS SERIES_NM, SERIES_NO, SUBJECT, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, PROJECT_ST,
                                    (SELECT COUNT(1) FROM CMS_TASK T WHERE T.PROJECT_NO = DATA.NO) AS TASK_CNT,
                                    (SELECT COUNT(1) FROM CMS_TASK T WHERE T.PROJECT_NO = DATA.NO AND T.PHASE > 29) AS DIST_CNT
                                FROM
                                (
                                    SELECT
                                        NO, YEAR, SERIES_NO, SUBJECT, ISBN_NO, REG_UID, REG_NM, REG_DT, PROJECT_ST
                                    FROM
                                        CMS_PROJECT
                                    WHERE
                                        1=1
                                        ".$search_where."
                                    ".$sort_order."
                                    ".$limit."
                                ) AS DATA,
                                (SELECT @RNUM := 0) R,
                                (
                                    SELECT
                                        COUNT(*) AS TOTAL_COUNT
                                    FROM
                                        CMS_PROJECT
                                    WHERE
                                        1=1
                                        ".$search_where."
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

            if ( trim($_model['SUBJECT']) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($_model['PROJECT_ST']) == "" ) {
                $_model['PROJECT_ST'] = '0';
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/cms/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    if (file_exists($upload_path.$file['name'])) {
                        $uid = uniqid();
                        rename($upload_path.$file['name'], $source_path.$uid);
                        rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);
                        rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                        $insert_path = array(path => $file_path, uid => $uid);
                    }
                }

                $_model['BODY'] = $body_str;
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO CMS_PROJECT
                    (
                        SERIES_NO
                        ,YEAR
                        ,SUBJECT
                        ,ISBN_NO
                        ,REG_UID
                        ,REG_NM
                        ,REG_DT
                        ,PROJECT_ST
                        ,NOTE
                    ) VALUES (
                        '".$_model['SERIES']['NO']."'
                        ,'".$_model['YEAR']."'
                        ,'".$_model['SUBJECT']."'
                        ,'".$_model['ISBN_NO']."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'0'
                        ,'".$_model['NOTE']."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (isset($_model['FILE']) && $_model['FILE'] != "") {
                $file = $_model['FILE'];

                MtUtil::_d("------------>>>>> file : ".$file['name']);

                $sql = "INSERT INTO COM_FILE
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
                            ,FILE_ORD
                            ,TARGET_NO
                            ,TARGET_GB
                        ) VALUES (
                            '".$file['name']."'
                            , '".$insert_path['uid']."'
                            , '".$insert_path['path']."'
                            , '".$file['type']."'
                            , '".$file['size']."'
                            , '0'
                            , SYSDATE()
                            , 'C'
                            , '".$file['kind']."'
                            , '".$i."'
                            , '".$no."'
                            , 'PROJECT'
                        )";

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
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/cms/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    if (file_exists($upload_path.$file['name'])) {
                        $uid = uniqid();
                        rename($upload_path.$file['name'], $source_path.$uid);
                        rename($upload_path.'thumbnail/'.$file['name'], $source_path.'thumbnail/'.$uid);
                        rename($upload_path.'medium/'.$file['name'], $source_path.'medium/'.$uid);
                        $insert_path = array(path => $file_path, uid => $uid);

                        MtUtil::_d("------------>>>>> mediumUrl : ".$file['mediumUrl']);
                        MtUtil::_d("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.'medium/'.$uid);
                        MtUtil::_d("------------>>>>> body_str : ".$body_str);
                    } else {
                        $insert_path = array(path => '', uid => '');
                    }
                }
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            if ( trim($_model['SUBJECT']) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE CMS_PROJECT
                    SET
                        SERIES_NO = '".$_model['SERIES']['NO']."'
                        ,YEAR = '".$_model['YEAR']."'
                        ,SUBJECT = '".$_model['SUBJECT']."'
                        ,ISBN_NO = '".$_model['ISBN_NO']."'
                        ,PROJECT_ST = '".( $_model['COMPLETE_FL'] == "true" ? "3" : $_model['PROJECT_ST'] )."'
                        ,NOTE = '".$_model['NOTE']."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE F
                    WHERE
                        F.TARGET_GB = 'PROJECT'
                        AND F.TARGET_NO = ".$_key."
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $is_delete = true;

                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if ($row['FILE_NM'] == $file['name'] && $row['FILE_SIZE'] == $file['size']) {
                        $is_delete = false;
                    }
                }

                if ($is_delete) {
                    MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);
                    $sql = "DELETE FROM COM_FILE WHERE NO = ".$row['NO'];

                    $_d->sql_query($sql);

                    MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);

                    if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
                        unlink('../../..'.$row['PATH'].$row['FILE_ID']);
                        unlink('../../..'.$row['PATH'].'thumbnail/'.$row['FILE_ID']);
                        unlink('../../..'.$row['PATH'].'medium/'.$row['FILE_ID']);
                    }
                }
            }

            if (count($_model['FILE']) > 0) {
                $file = $_model['FILE'];

                MtUtil::_d("------------>>>>> file : ".$file['name']);

                if ($insert_path['uid'] != "") {
                    $sql = "INSERT INTO COM_FILE
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
                                ,FILE_ORD
                                ,TARGET_NO
                                ,TARGET_GB
                            ) VALUES (
                                '".$file['name']."'
                                , '".$insert_path['uid']."'
                                , '".$insert_path['path']."'
                                , '".$file['type']."'
                                , '".$file['size']."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".$file['kind']."'
                                , '".$i."'
                                , '".$_key."'
                                , 'PROJECT'
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
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $sql = "SELECT
                        COUNT(*) AS COUNT
                    FROM
                        CMS_TASK
                    WHERE
                        PROJECT_NO = ".$_key."
                    ";

            $data = $_d->sql_fetch($sql);

            if ($data['"COUNT"'] > 0) {
                $err++;
                $msg = "등록된 태스크가 있습니다.";
            } else {
                $sql = "DELETE FROM CMS_PROJECT WHERE NO = ".$_key;

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }
            }

            if ($err > 0) {
                $_d->failEnd("삭제실패입니다:".$msg);
            } else {
                $_d->succEnd($no);
            }

            break;
    }
?>