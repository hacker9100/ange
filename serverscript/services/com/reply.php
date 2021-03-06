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

                if (!isset($_search['TARGET_NO']) || $_search['TARGET_NO'] == '') {
                    $_d->failEnd("조회실패입니다:"."TARGET_NO 누락되었습니다.");
                }

                $search_common = "";
                $limit = "";
                $sort_order = "ORDER BY REG_DT DESC";

                if (isset($_search['TARGET_NO']) && $_search['TARGET_NO'] != "") {
                    $search_common .= "AND TARGET_NO = ".$_search['TARGET_NO']." ";
                }

                if (isset($_search['TARGET_GB']) && $_search['TARGET_GB'] != "") {
                    $search_common .= "AND TARGET_GB = '".$_search['TARGET_GB']."' ";
                }

                if (isset($_search['REPLY_GB']) && $_search['REPLY_GB'] != "") {
                    $search_common .= "AND REPLY_GB = '".$_search['REPLY_GB']."' ";
                }

                if (isset($_search['TODAY_DATE']) && $_search['TODAY_DATE'] != "") {
                    $search_common .= "AND DATE_FORMAT(REG_DT, '%Y-%m-%d') = CONCAT('".$_search['YEAR']."','-' ,'".$_search['MONTH']."', '-', '".$_search['DAY']."')";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order = "ORDER BY ".$_search['SORT']." ".$_search['ORDER'];
                }

                if (isset($_search['PAGE_NO']) && $_search['PAGE_NO'] != "") {
                    $limit .= "LIMIT ".(($_search['PAGE_NO'] - 1) * $_search['PAGE_SIZE']).", ".$_search['PAGE_SIZE'];
                }

                $sql = "SELECT
                            DATA.*, F.PATH, F.FILE_ID
                        FROM (
                            SELECT
                                NO, PARENT_NO, COMMENT, (SELECT COUNT(NO) FROM COM_REPLY WHERE PARENT_NO = R.NO ".$search_common.") AS RE_COUNT, LEVEL, REPLY_NO, R.NICK_NM
                                ,DATE_FORMAT(R.REG_DT, '%Y-%m-%d %H:%i') AS REG_DT, BLIND_FL, REG_UID, (SELECT COUNT(NO) FROM COM_REPLY WHERE 1=1 ".$search_common.") AS TOTAL_COUNT
                            FROM
                                COM_REPLY R
                            WHERE 1=1
                                AND PARENT_NO = 0
                                ".$search_common."
                            ".$sort_order."
                            ".$limit."
                        ) AS DATA
                        INNER JOIN COM_USER U ON DATA.REG_UID = U.USER_ID
                        LEFT OUTER JOIN COM_FILE F ON U.NO = F.TARGET_NO AND F.TARGET_GB = 'USER' AND F.FILE_GB = 'THUMB'
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                NO, PARENT_NO, PARENT_NO, REPLY_NO, REPLY_GB, COMMENT, REG_UID, NICK_NM, REG_NM, TARGET_NO, TARGET_GB,
                                DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i') AS REG_DT,
                                BLIND_FL, REG_UID
                            FROM COM_REPLY
                            WHERE PARENT_NO = ".$row['NO']."
                            ".$search_common."
                            ".$sort_order."";

                    $file_data = $_d->getData($sql);
                    $row['REPLY_COMMENT'] = $file_data;

                    $__trn->rows[$i] = $row;
                }

                $_d->sql_free_result($result);
                $data['COMMENT'] = $__trn->{'rows'};

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$msg);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'subjectitem') {

                $search_common = "";

                if (isset($_search['TODAY_DATE']) && $_search['TODAY_DATE'] != "") {
                    $search_common .= "AND CONCAT(YEAR,'-',MONTH,'-',DAY) = CONCAT('".$_search['YEAR']."','-' ,'".$_search['MONTH']."', '-', '".$_search['DAY']."')";
                }

                $sql = "SELECT NO, SUBJECT, BODY
                        FROM ANGE_TALK
                        WHERE 1=1
                         ".$search_common."
                ";

                $__trn = '';
                //$result = $_d->sql_query($sql,true);

                $data = $_d->sql_fetch($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($data) {
                    $sql = "SELECT
                            F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_FILE F
                        WHERE
                            F.TARGET_GB = 'TALK'
                            AND F.TARGET_NO = ".$data['NO']."
                            AND F.FILE_GB = 'MAIN'
                        ";

                    $file_data = $_d->sql_fetch($sql);
                    $data['FILE'] = $file_data;
                }

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'check') {

                $search_common = "";

                if (isset($_search['TARGET_NO']) && $_search['TARGET_NO'] != "") {
                    $search_common .= "AND TARGET_NO = ".$_search['TARGET_NO']." ";
                }

                if (isset($_search['TARGET_GB']) && $_search['TARGET_GB'] != "") {
                    $search_common .= "AND TARGET_GB = '".$_search['TARGET_GB']."' ";
                }

                if (isset($_search['REPLY_GB']) && $_search['REPLY_GB'] != "") {
                    $search_common .= "AND REPLY_GB = '".$_search['REPLY_GB']."' ";
                }

                if (isset($_search['TODAY_DATE']) && $_search['TODAY_DATE'] != "") {
                    $search_common .= "AND DATE_FORMAT(REG_DT, '%Y-%m-%d') = CONCAT('".$_search['YEAR']."','-' ,'".$_search['MONTH']."', '-', '".$_search['DAY']."')";
                }

                if (isset($_search['REG_UID']) && $_search['REG_UID'] != "") {
                    $search_common .= "AND REG_UID = '".$_search['REG_UID']."' ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order = "ORDER BY ".$_search['SORT']." ".$_search['ORDER'];
                }

                if (isset($_search['PAGE_NO']) && $_search['PAGE_NO'] != "") {
                    $limit .= "LIMIT ".(($_search['PAGE_NO'] - 1) * $_search['PAGE_SIZE']).", ".$_search['PAGE_SIZE'];
                }

                $sql = "SELECT
                            COUNT(*) AS COUNT
                        FROM
                            COM_REPLY
                        WHERE 1=1
                            AND PARENT_NO = 0
                            ".$search_common."
                        ";

                $data = $_d->sql_fetch($sql);

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

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

           if ( trim($_model['COMMENT']) == "" ) {
                $_d->failEnd("내용을 입력하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_REPLY
                    (
                        NO,
                        PARENT_NO,
                        REPLY_NO,
                        REPLY_GB,
                        LEVEL,
                        COMMENT,
                        REG_UID,
                        NICK_NM,
                        REG_NM,
                        REG_DT,
                        LIKE_CNT,
                        TARGET_NO,
                        TARGET_GB,
                        BLIND_FL
                    ) VALUES (
                        (SELECT MAX(NO)+1 FROM COM_REPLY a),
                        ".$_model['PARENT_NO'].",
                        '".$_model['REPLY_NO']."',
                        '".$_model['REPLY_GB']."',
                        '".$_model['LEVEL']."',
                        '".addslashes($_model['COMMENT'])."',
                        '".$_SESSION['uid']."',
                        '".$_SESSION['nick']."',
                        '".$_SESSION['name']."',
                        NOW(),
                        '0',
                        '".$_model['TARGET_NO']."',
                        '".$_model['TARGET_GB']."',
                        'N'
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
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

            if($_type == 'blind'){

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_REPLY
                        SET
                            BLIND_FL = 'Y'
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }

            }if($_type == 'blind_clear'){

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_REPLY
                            SET
                                BLIND_FL = 'N'
                            WHERE
                                NO = ".$_key."
                            ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }

            }else{
                if (!isset($_key) || $_key == '') {
                    $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
                }

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_REPLY
                        SET
                            COMMENT = '".addslashes($_model['COMMENT'])."',
                            REG_UID = '".$_SESSION['uid']."',
                            NICK_NM = '".$_SESSION['nick']."',
                            REG_NM = '".$_SESSION['name']."'
                        WHERE
                            NO = ".$_key."
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("수정실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }
            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            if (!isset($_SESSION['uid'])) {
                $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM COM_REPLY WHERE PARENT_NO = ".$_key;
            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM COM_REPLY WHERE NO = ".$_key;
            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>