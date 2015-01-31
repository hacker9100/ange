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
            if ($_type == 'item') {
                $sql = "SELECT
                            MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, DIVIDER_FL, MENU_DESC, TAIL_DESC
                        FROM
                            COM_MENU
                        WHERE
                            MENU_URL = '".$_key."'
                        ORDER BY SORT_IDX ASC
                        ";

                $result = $_d->sql_query($sql);
                $data  = $_d->sql_fetch_array($result);

                $sql = "SELECT
                            MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, API, CSS, COLUMN_ORD, ROW_ORD
                        FROM
                            COM_SUB_MENU
                        WHERE
                            MENU_URL = '".$row[MENU_URL]."'
                        ORDER BY COLUMN_ORD ASC, ROW_ORD ASC
                        ";

                $sub_menu_data = $_d->getData($sql);
                $row['SUB_MENU_INFO'] = $sub_menu_data;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'channel') {
                $where_search = "";

                if (isset($_search[CHANNEL_NO]) && $_search[CHANNEL_NO] != "") {
                    $where_search .= "AND CHANNEL_NO = '".$_search[CHANNEL_NO]."' ";
                }

                $sql = "SELECT
                            CHANNEL_NO, CHANNEL_ID, CHANNEL_URL, CHANNEL_NM, TAG, SYSTEM_GB, DROP_FL, POSITION, COLUMN_CNT
                        FROM
                            COM_CHANNEL
                        WHERE
                            SYSTEM_GB  = '".$_search[CHANNEL_GB]."'
                            ".$where_search."
                        ORDER BY CHANNEL_NO ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    if ($_search[MENU]) {
                        $sql = "SELECT
                                    MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_DESC, TAIL_DESC
                                FROM
                                    COM_MENU
                                WHERE
                                    SYSTEM_GB  = '".$_search[CHANNEL_GB]."'
                                    AND CHANNEL_NO  = '".$row[CHANNEL_NO]."'
                                ORDER BY MENU_ORD ASC
                                ";

                        $menu_data = $_d->getData($sql);
                        $row['MENU_INFO'] = $menu_data;
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
            } else if ($_type == 'menu') {
                $where_search = "";

                if (isset($_search[CHANNEL_NO]) && $_search[CHANNEL_NO] != "") {
                    $where_search .= "AND CHANNEL_NO = '".$_search[CHANNEL_NO]."' ";
                }

                if (isset($_search[ETC]) && $_search[ETC] != "") {
                    $where_search .= "AND ETC = '".$_search[ETC]."' ";
                }

                $sql = "SELECT
                            NO, MENU_ID, MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_ORD, MENU_DESC, TAIL_DESC, ETC
                        FROM
                            COM_MENU
                        WHERE
                            SYSTEM_GB  = '".$_search[SYSTEM_GB]."'
                            ".$where_search."
                        ORDER BY MENU_ORD ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    if ($row['CHANNEL_NO'] == '1') {
                        $in_str = "";
                        $arr_category = explode(',', $row['ETC']);
                        for($j=0;$j< sizeof($arr_category);$j++){
                            $in_str = $in_str."'".trim($arr_category[$j])."'";
                            if (sizeof($arr_category) - 1 != $j) $in_str = $in_str.",";
                        }

                        $sql = "SELECT
                                    NO, PARENT_NO, CATEGORY_NM, CATEGORY_GB, CATEGORY_ST
                                FROM
                                    CMS_CATEGORY
                                WHERE
                                    CATEGORY_ST = '0'
                                    AND NO IN (".$in_str.")
                                ";

                        $category_data = $_d->getData($sql);
                        $row['CATEGORY'] = $category_data;
                    } else if ($row['CHANNEL_NO'] == '2') {
                        $sql = "SELECT
                                    COMM_NM, SHORT_NM, COMM_GB
                                FROM
                                    ANGE_COMM
                                WHERE
                                    MENU_ID = '".$row['MENU_ID']."'
                                ";

                        $community_result = $_d->sql_query($sql);
                        $community_data = $_d->sql_fetch_array($community_result);
                        $row['COMM'] = $community_data;
                    }

                    if ($_search[SUB_MENU]) {
                        $sql = "SELECT
                                    NO, MENU_ID, MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, SUB_MENU_URL, API, CSS, COLUMN_ORD, ROW_ORD
                                FROM
                                    COM_SUB_MENU
                                WHERE
                                    MENU_URL = '".$row[MENU_URL]."'
                                ORDER BY COLUMN_ORD ASC, ROW_ORD ASC
                                ";

                        $sub_menu_data = $_d->getData($sql);
                        $row['SUB_MENU'] = $sub_menu_data;
                    }

                    if ($_search[FILE]) {
                        $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
                            FROM
                                FILE F, CONTENT_SOURCE S
                            WHERE
                                F.NO = S.SOURCE_NO
                                AND S.CONTENT_GB = 'FILE'
                                AND S.TARGET_GB = 'MENU'
                                AND S.TARGET_NO = ".$row[NO]."
                            ";

                        $file_data = $_d->sql_fetch($sql);
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
            } else if ($_type == 'submenu') {
                $where_search = "";

                if (isset($_search[MENU_ID]) && $_search[MENU_ID] != "") {
                    $where_search .= "AND MENU_ID = '".$_search[MENU_ID]."' ";
                }

                if (isset($_search[SYSTEM_GB]) && $_search[SYSTEM_GB] != "") {
                    $where_search .= "AND SYSTEM_GB = '".$_search[SYSTEM_GB]."' ";
                }

                $sql = "SELECT
                            NO, MENU_ID, MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, SUB_MENU_URL, API, CSS, COLUMN_ORD, ROW_ORD
                        FROM
                            COM_SUB_MENU
                        WHERE
                            1 = 1
                            ".$where_search."
                        ORDER BY COLUMN_ORD ASC, ROW_ORD ASC
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, F.FILE_GB
                            FROM
                                FILE F, CONTENT_SOURCE S
                            WHERE
                                F.NO = S.SOURCE_NO
                                AND S.CONTENT_GB = 'FILE'
                                AND S.TARGET_GB = 'SUB_MENU'
                                AND S.TARGET_NO = ".$row[NO]."
                            ";

                    $file_data = $_d->getData($sql);
                    $row['FILES'] = $file_data;

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
                $_d->failEnd("조회실패입니다:");
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

            if ($_type == 'menu') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO COM_MENU
                        (
                            MENU_ID,
                            MENU_URL,
                            CHANNEL_NO,
                            MENU_NM,
                            SYSTEM_GB,
                            DIVIDER_FL,
                            DEPTH,
                            LINK_FL,
                            CLASS_GB,
                            MENU_ORD,
                            MENU_DESC,
                            TAIL_DESC,
                            ETC
                        ) VALUES (
                            '".$_model[MENU_ID]."'
                            , '".$_model[MENU_URL]."'
                            , '".$_model[CHANNEL_NO]."'
                            , '".$_model[MENU_NM]."'
                            , '".$_model[SYSTEM_GB]."'
                            , '".$_model[DIVIDER_FL]."'
                            , '".$_model[DEPTH]."'
                            , '".$_model[LINK_FL]."'
                            , '".$_model[CLASS_GB]."'
                            , '".$_model[MENU_ORD]."'
                            , '".$_model[MENU_DESC]."'
                            , '".$_model[TAIL_DESC]."'
                            , '".$_model[ETC]."'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($_model[CHANNEL_NO] == "2") {
                    $sql = "INSERT INTO ANGE_COMM
                            (
                                MENU_ID
                                ,COMM_NM
                                ,SHORT_NM
                                ,COMM_GB
                                ,COMM_MG
                            ) VALUES (
                                '".$_model[MENU_ID]."'
                                , '".$_model[MENU_NM]."'
                                , '".$_model[MENU_NM]."'
                                , '".$_model[COMM_GB]."'
                                , '".$_model[COMM_MG]."'
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
            } else if ($_type == 'submenu') {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/admin/';
                $source_path = '../../..'.$file_path;
                $insert_path = array();

                $body_str = $_model[BODY];

                try {
                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file[name])) {
                                $uid = uniqid();
                                rename($upload_path.$file[name], $source_path.$uid);

                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);
                            }
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO COM_SUB_MENU
                        (
                            MENU_ID,
                            MENU_URL,
                            SUB_MENU,
                            POSITION,
                            TITLE,
                            SUB_MENU_GB,
                            SUB_MENU_URL,
                            API,
                            CSS,
                            COLUMN_ORD,
                            ROW_ORD,
                            SYSTEM_GB
                        ) VALUES (
                            '".$_model[MENU_ID]."'
                            , '".$_model[MENU_URL]."'
                            , '".$_model[SUB_MENU]."'
                            , '".$_model[POSITION]."'
                            , '".$_model[TITLE]."'
                            , '".$_model[SUB_MENU_GB]."'
                            , '".$_model[SUB_MENU_URL]."'
                            , '".$_model[API]."'
                            , '".$_model[CSS]."'
                            , '".$_model[COLUMN_ORD]."'
                            , '".$_model[ROW_ORD]."'
                            , '".$_model[SYSTEM_GB]."'
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
                        MtUtil::_c("------------>>>>> file : ".$file['name']);
                        MtUtil::_c("------------>>>>> mediumUrl : ".$i.'--'.$insert_path[$i][path]);

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
                            , '".strtoupper($file[kind])."'
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
                            , 'SUB_MENU'
                            , '".$i."'
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
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if ($_type == 'menu') {

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/admin/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model[FILE]) > 0) {
                        $file = $_model[FILE];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        if (file_exists($upload_path.$file[name])) {
                            if ($file[kind] == 'download') {
                                rename($upload_path.$file[name], $source_path.$file[name]);
                            } else {
                                $uid = uniqid();
                                rename($upload_path.$file[name], $source_path.$uid);
                                $insert_path = array(path => $file_path, uid => $uid, kind => $file[kind]);
                            }
                        } else {
                            $insert_path = array(path => '', uid => '', kind => '');
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $etc_str = $_model[ETC];
                $categories = $_model[CATEGORY];

                for ($i = 0 ; $i < count($_model[CATEGORY]); $i++) {
                    $category = $categories[$i];

                    $etc_str .= $category[NO];
                    if (sizeof($_model[CATEGORY]) - 1 != $i) $etc_str .= ",";
                }

                $sql = "UPDATE COM_MENU
                        SET
                            MENU_NM = '".$_model[MENU_NM]."'
                            ,DEPTH = '".$_model[DEPTH]."'
                            #,MENU_ORD = '".$_model[MENU_ORD]."'
                            ,ETC = '".$etc_str."'
                        WHERE
                            MENU_URL = '".$_key."'
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
                        AND S.CONTENT_GB = 'FILE'
                        AND S.TARGET_GB = 'MENU'
                        AND S.TARGET_NO = ".$_model[NO]."
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
                        MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
                        $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                        $_d->sql_query($sql);

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'MENU' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                        $_d->sql_query($sql);

                        MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

                        if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        }
                    }
                }

                if (count($_model[FILE]) > 0) {
                    $file = $_model[FILE];

                    MtUtil::_c("------------>>>>> file : ".$file['name']);

                    if ($insert_path[uid] != "" || $file[kind] == "download") {
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
                                , '".($file[kind] == 'download' ? $file[name] : $insert_path[uid])."'
                                , '".$file_path."'
                                , '".$file[type]."'
                                , '".$file[size]."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".strtoupper($file[kind])."'
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
                                '".($file[kind] == 'download' ? $_model[NO] : $_key)."'
                                , '".$file_no."'
                                , 'FILE'
                                , 'MENU'
                                , '".$i."'
                            )";

                        $_d->sql_query($sql);

                        if ($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

//                if (isset($_model[ROLE]) && $_model[ROLE] != "") {
//                    $sql = "UPDATE USER_ROLE
//                            SET
//                                ROLE_ID = '".$_model[ROLE][ROLE_ID]."'
//                                ,REG_DT = SYSDATE()
//                            WHERE
//                                USER_ID = '".$_key."'
//                            ";
//
//                    $_d->sql_query($sql);
//
//                    if($_d->mysql_errno > 0) {
//                        $err++;
//                        $msg = $_d->mysql_error;
//                    }
//                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'submenu') {
                $upload_path = '../../../upload/files/';
                $file_path = '/storage/admin/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        for ($i = 0 ; $i < count($_model[FILES]); $i++) {
                            $file = $files[$i];

                            if (file_exists($upload_path.$file[name])) {
                                $uid = uniqid();
                                rename($upload_path.$file[name], $source_path.$uid);
                                $insert_path[$i] = array(path => $file_path, uid => $uid, kind => $file[kind]);

                                MtUtil::_c("------------>>>>> mediumUrl : ".$file[name]);
                                MtUtil::_c("------------>>>>> mediumUrl : ".'http://localhost'.$source_path.$uid);
                            } else {
                                $insert_path[$i] = array(path => '', uid => '', kind => '');
                            }
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_SUB_MENU
                        SET
                            MENU_ID = '".$_model[MENU_ID]."',
                            MENU_URL = '".$_model[MENU_URL]."',
                            SUB_MENU = '".$_model[SUB_MENU]."',
                            POSITION = '".$_model[POSITION]."',
                            TITLE = '".$_model[TITLE]."',
                            SUB_MENU_GB = '".$_model[SUB_MENU_GB]."',
                            SUB_MENU_URL = '".$_model[SUB_MENU_URL]."',
                            API = '".$_model[API]."',
                            CSS = '".$_model[CSS]."',
                            COLUMN_ORD = '".$_model[COLUMN_ORD]."',
                            ROW_ORD = '".$_model[ROW_ORD]."',
                            SYSTEM_GB = '".$_model[SYSTEM_GB]."'
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
                            AND S.TARGET_GB = 'SUB_MENU'
                            AND S.CONTENT_GB = 'FILE'
                            AND S.TARGET_NO = ".$_key."
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $is_delete = true;

                    if (count($_model[FILES]) > 0) {
                        $files = $_model[FILES];
                        for ($i = 0 ; $i < count($files); $i++) {
                            if ($row[FILE_NM] == $files[$i][name] && $row[FILE_SIZE] == $files[$i][size]) {
                                $is_delete = false;
                            }
                        }
                    }

                    if ($is_delete) {
                        MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
                        $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                        $_d->sql_query($sql);

                        $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'SUB_MENU' AND CONTENT_GB = 'FILE' AND TARGET_NO = ".$row[NO];

                        $_d->sql_query($sql);

                        MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

                        if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                            unlink('../../..'.$row[PATH].$row[FILE_ID]);
                        }
                    }
                }

                if (count($_model[FILES]) > 0) {
                    $files = $_model[FILES];

                    for ($i = 0 ; $i < count($files); $i++) {
                        $file = $files[$i];
                        MtUtil::_c("------------>>>>> file : ".$file['name']);

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
                                , '".strtoupper($file[kind])."'
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
                                , 'SUB_MENU'
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

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM USER_ROLE WHERE USER_ID = '".$_key."'";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM CMS_USER WHERE USER_ID = '".$_key."'";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if ($err > 0) {
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>