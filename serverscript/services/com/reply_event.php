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

                $search_common = "";
                $limit = "";
                $sort_order = "ORDER BY R.REG_DT DESC";

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
                    $search_common .= "AND DATE_FORMAT(REG_DT, '%Y-%m-%d') = '".$_search['TODAY_DATE']."' ";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order = "ORDER BY R.".$_search['SORT']." ".$_search['ORDER'];
                }

                if (isset($_search['PAGE_NO']) && $_search['PAGE_NO'] != "") {
                    $limit .= "LIMIT ".(($_search['PAGE_NO'] - 1) * $_search['PAGE_SIZE']).", ".$_search['PAGE_SIZE'];
                }

                //TODO: 조회
                $sql = "SELECT
                            NO, PARENT_NO, COMMENT, (SELECT COUNT(*) FROM COM_REPLY_EVENT WHERE PARENT_NO = R.NO) AS RE_COUNT, LEVEL, REPLY_NO, R.NICK_NM
                            ,DATE_FORMAT(R.REG_DT, '%Y-%m-%d %H:%i') AS REG_DT, BLIND_FL, REG_UID, (SELECT COUNT(*) FROM COM_REPLY_EVENT WHERE 1=1 ".$search_common.") AS TOTAL_COUNT
                        FROM
                            COM_REPLY_EVENT R
                        WHERE 1=1
                            AND PARENT_NO = 0
                            ".$search_common."
                        ".$sort_order."
                        ".$limit."
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                REPLY_CTE.LEVEL, R.NO, PARENT_NO, PARENT_NO, REPLY_NO, REPLY_GB, COMMENT, REG_UID, NICK_NM, REG_NM, R.TARGET_NO, TARGET_GB,
                                DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i') AS REG_DT,
                                (SELECT COUNT(*) FROM COM_REPLY_EVENT WHERE PARENT_NO = R.NO) AS RE_COUNT, BLIND_FL, REG_UID
                            FROM (
                                SELECT
                                    REPLY_CONNET_BY_PRIOR_ID(NO) AS NO, @level AS LEVEL, TARGET_NO
                                FROM    (
                                    SELECT  @start_with := 0,
                                    @NO := @start_with,
                                    @level := 0
                                ) TMP, COM_REPLY_EVENT
                                WHERE   @NO IS NOT NULL
                            ) REPLY_CTE, COM_REPLY_EVENT R
                            WHERE REPLY_CTE.NO = R.NO
                            AND R.PARENT_NO = ".$row['NO']."
                            ".$sort_order."";

                    $file_data = $_d->getData($sql);
                    $row['REPLY_COMMENT'] = $file_data;

                    $__trn->rows[$i] = $row;
                }

                $_d->sql_free_result($result);
                $data['COMMENT'] = $__trn->{'rows'};

                //TODO: 목록 조회
                /*                $data = $_d->sql_query($sql);
                                if ($_d->mysql_errno > 0) {
                                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                                } else {
                                    $_d->dataEnd($sql);
                                }*/

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$msg);
                }else{
                    $_d->dataEnd2($data);
                }
            } else if ($_type == 'list') {


            } else if ($_type == 'check'){

                $sql = "SELECT COUNT(*) AS COUNT
                        FROM COM_REPLY_EVENT
                        WHERE REG_UID = '".$_search['REG_UID']."'
                          AND TARGET_NO = '".$_search['TARGET_NO']."'";


                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_d("### ['POST_DATA'] ".json_encode(file_get_contents("php://input"),true));

           if ( trim($_model['COMMENT']) == "" ) {
                $_d->failEnd("내용을 입력하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_REPLY_EVENT
                    (
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
                        ".$_model['PARENT_NO'].",
                        '".$_model['REPLY_NO']."',
                        '".$_model['REPLY_GB']."',
                        '".$_model['LEVEL']."',
                        '".str_replace("'", "\\'",$_model['COMMENT'])."',
                        '".$_model['REG_UID']."',
                        '".$_model['NICK_NM']."',
                        '".$_model['USER_NM']."',
                        SYSDATE(),
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

                $sql = "UPDATE COM_REPLY_EVENT
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

                $sql = "UPDATE COM_REPLY_EVENT
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

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_REPLY_EVENT
                        SET
                            COMMENT = '".$_model['COMMENT']."',
                            REG_UID = '".$_model['REG_UID']."',
                            NICK_NM = '".$_model['NICK_NM']."',
                            REG_NM = '".$_model['USER_NM']."'
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

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM COM_REPLY_EVENT WHERE PARENT_NO = ".$_key;
            $_d->sql_query($sql);

            $sql = "DELETE FROM COM_REPLY_EVENT WHERE NO = ".$_key;
            $_d->sql_query($sql);

            $_d->sql_commit();
            $_d->succEnd($no);

            break;
    }
?>