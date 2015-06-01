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
                            ANGE_BANNER
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

                if (isset($_search['ADP_IDX']) && $_search['ADP_IDX'] != "") {
                    $search_where .= "AND a.adp_idx = '".$_search['ADP_IDX']."' ";
                }

                if (isset($_search['ADP_CODE']) && $_search['ADP_CODE'] != "") {
                    $search_where .= "AND d.adp_code = '".$_search['ADP_CODE']."' ";
                }

                if (isset($_search['ADA_TYPE']) && $_search['ADA_TYPE'] != "") {
                    $search_where .= "AND ada_type = '".$_search['ADA_TYPE']."' ";
                }

                if (isset($_search['ADA_STATE']) && $_search['ADA_STATE'] != "") {
                    $search_where .= "AND ada_state  = '".$_search['ADA_STATE']."' ";
                }

//                if (isset($_search['PROCESS']) && $_search['PROCESS'] != "") {
//                    $search_where .= "AND DATE_FORMAT(a.ada_date_close, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')";
//                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                } else {
                    $sort_order .= "ORDER BY RAND() ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                $sql = "SELECT
                            ada_idx, ada_type, DATE_FORMAT(ada_date_open, '%Y-%m-%d') AS FROM_YMD, DATE_FORMAT(ada_date_close, '%Y-%m-%d') AS TO_YMD, ada_url, ada_title,
                            a.adp_idx, ada_state, ada_files, ada_image, ada_preview
                        FROM
                            adm_ad a, adm_product d
                        WHERE
                            a.adp_idx = d.adp_idx
                            AND DATE_FORMAT(a.ada_date_open, '%Y-%m-%d') <= DATE_FORMAT(NOW(), '%Y-%m-%d')
                            AND DATE_FORMAT(a.ada_date_close, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')
                            ".$search_where."
                        ".$sort_order."
                        ".$limit."
                        ";

                $data = $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

//                if ($data && $_search[ADA_TYPE] == 'banner') {
                if ($data) {
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
                            ,'".$_SESSION['guid']."'
                            ,'".$_SESSION['uid']."'
                            ,'".$_SESSION['ip']."'
                            ,'0'
                            ,'".$_search['MENU']."'
                            ,'".$_search['CATEGORY']."'
                            ,SYSDATE()
                        )";

                        $_d->sql_query($sql2);
                    }
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == "ange") {

                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                    $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%'";
                }

                if (isset($_search['BANNER_GB']) && $_search['BANNER_GB'] != "") {
                    $search_where .= "AND BANNER_GB = '".$_search['BANNER_GB']."' ";
                }

                if (isset($_search['BANNER_ST']) && $_search['BANNER_ST'] != "") {
                    $search_where .= "AND BANNER_ST = '".$_search['BANNER_ST']."' ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                } else {
                    $sort_order .= "ORDER BY RAND() ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, URL, SUBJECT, BANNER_GB, LOCATION_GB, BANNER_ST, BIND_NO
                        FROM
                        (
                            SELECT
                                NO, URL, SUBJECT, BANNER_GB, LOCATION_GB, BANNER_ST, BIND_NO
                            FROM
                                ANGE_BANNER
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
                                ANGE_BANNER
                            WHERE
                                1=1
                                ".$search_where."
                        ) CNT
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $sql = "SELECT
                                NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE
                            WHERE
                                TARGET_GB = 'BANNER'
                                AND TARGET_NO = ".$row['NO']."
                                AND THUMB_FL = '0'
                            ";

                    $file_data = $_d->sql_fetch($sql);
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
            }

            break;

        case "POST":
            if ($_type == 'item') {
                if ( trim($_model['SUBJECT']) == "" ) {
                    $_d->failEnd("제목을 작성 하세요");
                }

                $upload_path = '../../../upload/files/';
                $file_path = '/storage/admin/';
                $source_path = '../../..'.$file_path;
                $insert_path = null;

                try {
                    if (count($_model['FILE']) > 0) {
                        $file = $_model['FILE'];
                        if (!file_exists($source_path) && !is_dir($source_path)) {
                            @mkdir($source_path);
                        }

                        if (file_exists($upload_path.$file['name'])) {
                            $uid = uniqid();
                            rename($upload_path.$file['name'], $source_path.$uid);
                            $insert_path = array(path => $file_path, uid => $uid, kind => $file['kind']);

                            MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path['path']);
                        }
                    }
                } catch(Exception $e) {
                    $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                    break;
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_BANNER
                        (
                            URL,
                            SUBJECT,
                            BANNER_GB,
                            LOCATION_GB,
                            BANNER_ST,
                            BIND_NO
                        ) VALUES (
                            '".$_model['URL']."'
                            ,'".$_model['SUBJECT']."'
                            ,'".$_model['BANNER_GB']."'
                            ,'".$_model['LOCATION_GB']."'
                            ,'".$_model['BANNER_ST']."'
                            ,'".$_model['BIND_NO']."'
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

                    /*if($file[kind] != 'MAIN'){
                        $_d->failEnd("대표이미지를 선택하세요.");
                    }*/

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
                                , '0'
                                , '".$no."'
                                , 'BANNER'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

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
            } else if ($_type == 'click') {
                $sql = "INSERT INTO adm_history_banner
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
                            '".$_model['ada_idx']."'
                            ,'".$_SESSION['guid']."'
                            ,'".$_SESSION['uid']."'
                            ,'".$_SESSION['ip']."'
                            ,'1'
                            ,'".$_model['MENU']."'
                            ,'".$_model['CATEGORY']."'
                            ,SYSDATE()
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("등록실패입니다:".$msg);
                } else {
                    $_d->succEnd($no);
                }
            }

            break;
        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $upload_path = '../../../upload/files/';
            $file_path = '/storage/admin/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    if (file_exists($upload_path.$file['name'])) {
                        $uid = uniqid();
                        rename($upload_path.$file['name'], $source_path.$uid);
                        $insert_path = array(path => $file_path, uid => $uid, kind => $file['kind']);
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

            $sql = "UPDATE ANGE_BANNER
                    SET
                        URL = '".$_model['URL']."'
                        ,SUBJECT = '".$_model['SUBJECT']."'
                        ,BANNER_GB = '".$_model['BANNER_GB']."'
                        ,LOCATION_GB = '".$_model['LOCATION_GB']."'
                        ,BANNER_ST = '".$_model['BANNER_ST']."'
                        ,BIND_NO = '".$_model['BIND_NO']."'
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
                        NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE
                    WHERE
                        TARGET_GB = 'BANNER'
                        AND TARGET_NO = ".$_key."
                        AND THUMB_FL = '0'
                    ";

            $result = $_d->sql_fetch($sql,true);
            $is_delete = true;

            if (count($_model['FILE']) > 0) {
                $file = $_model['FILE'];
                if ($result['FILE_NM'] == $file['name'] && $result['FILE_SIZE'] == $file['size']) {
                    $is_delete = false;
                }
            }

            if ($is_delete) {
                MtUtil::_d("------------>>>>> DELETE NO : ".$result['NO']);
                $sql = "DELETE FROM COM_FILE WHERE TARGET_GB = 'BANNER' AND NO = ".$result['NO'];

                $_d->sql_query($sql);

                if (file_exists('../../..'.$result['PATH'].$result['FILE_ID'])) {
                    unlink('../../..'.$result['PATH'].$result['FILE_ID']);
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
                                , '0'
                                , '".$_key."'
                                , 'BANNER'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

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

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_BANNER WHERE NO = '".$_key."'";
            $result = $_d->sql_query($sql);

            $sql = "SELECT
                        NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE
                    WHERE
                        TARGET_GB = 'BANNER'
                        AND TARGET_NO = ".$_key."
                        AND THUMB_FL = '0'
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $sql = "DELETE FROM COM_FILE WHERE TARGET_GB = 'BANNER' AND NO = ".$row['NO'];

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
                    unlink('../../..'.$row['PATH'].$row['FILE_ID']);
                }
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