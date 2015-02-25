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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {
                $sql = "SELECT
                            NO, FROM_YMD, TO_YMD, URL, SUBJECT, BANNER_GB, LOCATION_GB, COMPANY_NO, BANNER_ST, BIND_NO
                        FROM
                            AD_BANNER
                        WHERE
                            NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if ($data) {
                    $sql = "SELECT
                                NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE
                            WHERE
                                TARGET_GB = 'BANNER'
                                AND TARGET_NO = ".$_key."
                                AND THUMB_FL = '0'
                            ";

                    $result = $_d->sql_query($sql);
                    $file_data = $_d->sql_fetch_array($result);
                    $data['FILE'] = $file_data;

//                    $file_data = $_d->getData($sql);
//                    $data['FILE'] = $file_data;
                }

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {
                $search_where = "";
                $sort_order = "";
                $limit = "";

                $err = 0;
                $msg = "";

                if (isset($_search[ADP_IDX]) && $_search[ADP_IDX] != "") {
                    $search_where .= "AND adp_idx = '".$_search[ADP_IDX]."' ";
                }

                if (isset($_search[ADA_STATE]) && $_search[ADA_STATE] != "") {
                    $search_where .= "AND ada_state  = '".$_search[ADA_STATE]."' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                } else {
                    $sort_order .= "ORDER BY RAND() ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

                $sql = "SELECT
                            ada_idx, DATE_FORMAT(ada_date_open, '%Y-%m-%d') AS FROM_YMD, DATE_FORMAT(ada_date_close, '%Y-%m-%d') AS TO_YMD, ada_url, ada_title,
                            adp_idx, ada_state, ada_files, ada_image, ada_preview
                        FROM
                            adm_ad
                        WHERE
                            1=1
                            ".$search_where."
                        ".$sort_order."
                        ".$limit."
                        ";

                $data = $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                for ($i=0; $row=$_d->sql_fetch_array($data); $i++) {
                    $sql2 = "INSERT INTO adm_history_banner
                        (
                            ada_idx,
                            adu_guid,
                            adu_id,
                            adu_ip,
                            adhb_type,
                            adhb_menu,
                            adhb_category,
                            adhb_date_regi
                        ) VALUES (
                            '".$row['ada_idx']."'
                            ,'aaa'
                            ,'admin'
                            ,'".MtUtil::getClientIp()."'
                            ,'0'
                            ,'".$_search['MENU']."'
                            ,'".$_search['CATEGORY']."'
                            ,SYSDATE()
                        )";

                    $_d->sql_query($sql2);
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

//                $sql = "SELECT
//                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
//                            NO, FROM_YMD, TO_YMD, URL, SUBJECT, BANNER_GB, LOCATION_GB, COMPANY_NO, BANNER_ST, BIND_NO
//                        FROM
//                        (
//                            SELECT
//                                NO, FROM_YMD, TO_YMD, URL, SUBJECT, BANNER_GB, LOCATION_GB, COMPANY_NO, BANNER_ST, BIND_NO
//                            FROM
//                                AD_BANNER
//                            WHERE
//                                1=1
//                                ".$search_where."
//                            ".$sort_order."
//                            ".$limit."
//                        ) AS DATA,
//                        (SELECT @RNUM := 0) R,
//                        (
//                            SELECT
//                                COUNT(*) AS TOTAL_COUNT
//                            FROM
//                                AD_BANNER
//                            WHERE
//                                1=1
//                                ".$search_where."
//                        ) CNT
//                        ";
//
//                $__trn = '';
//                $result = $_d->sql_query($sql,true);
//                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
//
//                    $sql = "SELECT
//                                NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
//                            FROM
//                                COM_FILE
//                            WHERE
//                                TARGET_GB = 'BANNER'
//                                AND TARGET_NO = ".$row['NO']."
//                                AND THUMB_FL = '0'
//                            ";
//
//                    $file_result = $_d->sql_query($sql);
//                    $file_data = $_d->sql_fetch_array($file_result);
//                    $row['FILE'] = $file_data;
//
//                    $__trn->rows[$i] = $row;
//                }
//                $_d->sql_free_result($result);
//                $data = $__trn->{'rows'};
//
//                if ($_d->mysql_errno > 0) {
//                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
//                } else {
//                    $_d->dataEnd2($data);
//                }
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
//            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ( trim($_model[SUBJECT]) == "" ) {
                $_d->failEnd("제목을 작성 하세요");
            }

            if ( trim($_model[PROJECT_ST]) == "" ) {
                $_model[PROJECT_ST] = '0';
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/cms/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    if (file_exists($upload_path.$file[name])) {
                        $uid = uniqid();
                        rename($upload_path.$file[name], $source_path.$uid);
                        rename($upload_path.'thumbnail/'.$file[name], $source_path.'thumbnail/'.$uid);
                        rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                        $insert_path = array(path => $file_path, uid => $uid);
                    }
                }

                $_model[BODY] = $body_str;
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
                        '".$_model[SERIES][NO]."'
                        ,'".$_model[YEAR]."'
                        ,'".$_model[SUBJECT]."'
                        ,'".$_model[ISBN_NO]."'
                        ,'".$_SESSION['uid']."'
                        ,'".$_SESSION['name']."'
                        ,SYSDATE()
                        ,'0'
                        ,'".$_model[NOTE]."'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (isset($_model[FILE]) && $_model[FILE] != "") {
                $file = $_model[FILE];

                MtUtil::_d("------------>>>>> file : ".$file['name']);

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
                        ) VALUES (
                            '".$file[name]."'
                            , '".$insert_path[uid]."'
                            , '".$insert_path[path]."'
                            , '".$file[type]."'
                            , '".$file[size]."'
                            , '0'
                            , SYSDATE()
                            , 'C'
                        )";

                $_d->sql_query($sql);
                $ori_file_no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
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
                            , '".$ori_file_no."'
                            , 'FILE'
                            , 'PROJECT'
                            , '0'
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

//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_d("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/cms/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                        @mkdir($source_path.'thumbnail/');
                        @mkdir($source_path.'medium/');
                    }

                    if (file_exists($upload_path.$file[name])) {
                        $uid = uniqid();
                        rename($upload_path.$file[name], $source_path.$uid);
                        rename($upload_path.'thumbnail/'.$file[name], $source_path.'thumbnail/'.$uid);
                        rename($upload_path.'medium/'.$file[name], $source_path.'medium/'.$uid);
                        $insert_path = array(path => $file_path, uid => $uid);

                        MtUtil::_d("------------>>>>> mediumUrl : ".$file[mediumUrl]);
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
                        ,ISBN_NO = '".$_model[ISBN_NO]."'
                        ,PROJECT_ST = '".( $_model[COMPLETE_FL] == "true" ? "3" : $_model[PROJECT_ST] )."'
                        ,NOTE = '".$_model[NOTE]."'
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
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.CONTENT_GB = 'FILE'
                        AND S.TARGET_GB = 'PROJECT'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $is_delete = true;

                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];
                    if ($row[FILE_NM] == $file[name] && $row[FILE_SIZE] == $file[size]) {
                        $is_delete = false;
                    }
                }

                if ($is_delete) {
                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);
                    $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                    $_d->sql_query($sql);

                    $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'PROJECT' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                    $_d->sql_query($sql);

                    MtUtil::_d("------------>>>>> DELETE NO : ".$row[NO]);

                    if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                        unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                        unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                    }
                }
            }

            if (count($_model[FILE]) > 0) {
                $file = $_model[FILE];

                MtUtil::_d("------------>>>>> file : ".$file['name']);

                if ($insert_path[uid] != "") {
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
                            ) VALUES (
                                '".$file[name]."'
                                , '".$insert_path[uid]."'
                                , '".$insert_path[path]."'
                                , '".$file[type]."'
                                , '".$file[size]."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    if ($_d->mysql_errno > 0) {
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
                                , 'PROJECT'
                                , '".$i."'
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

            $result = $_d->sql_query($sql);
            $data = $_d->sql_fetch_array($result);

            if ($data["COUNT"] > 0) {
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