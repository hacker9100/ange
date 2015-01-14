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
                $sort_order = "ORDER BY R.REG_DT DESC";

                if (isset($_search[TARGET_NO]) && $_search[TARGET_NO] != "") {
                    $search_common .= "AND TARGET_NO = ".$_search[TARGET_NO]." ";
                }

                if (isset($_search[TARGET_GB]) && $_search[TARGET_GB] != "") {
                    $search_common .= "AND TARGET_GB = '".$_search[TARGET_GB]."' ";
                }

                if (isset($_search[REPLY_GB]) && $_search[REPLY_GB] != "") {
                    $search_common .= "AND REPLY_GB = '".$_search[REPLY_GB]."' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order = "ORDER BY R.".$_search[SORT]." ".$_search[ORDER];
                }


                //TODO: 조회
                $sql = "SELECT
                            NO, PARENT_NO, COMMENT, (SELECT COUNT(*) FROM COM_REPLY WHERE PARENT_NO = R.NO) AS RE_COUNT, LEVEL, REPLY_NO, R.NICK_NM
                            ,DATE_FORMAT(R.REG_DT, '%Y-%m-%d %H:%i') AS REG_DT, BLIND_FL, REG_UID
                        FROM
                            COM_REPLY R
                        WHERE 1=1
                            AND PARENT_NO = 0
                            ".$search_common."
                        ".$sort_order."
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                REPLY_CTE.LEVEL, R.NO, PARENT_NO, PARENT_NO, REPLY_NO, REPLY_GB, COMMENT, REG_UID, NICK_NM, REG_NM, R.TARGET_NO, TARGET_GB,
                                DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i') AS REG_DT,
                                (SELECT COUNT(*) FROM COM_REPLY WHERE PARENT_NO = R.NO) AS RE_COUNT, BLIND_FL, REG_UID
                            FROM (
                                SELECT
                                    REPLY_CONNET_BY_PRIOR_ID(NO) AS NO, @level AS LEVEL, TARGET_NO
                                FROM    (
                                    SELECT  @start_with := 0,
                                    @NO := @start_with,
                                    @level := 0
                                ) TMP, COM_REPLY
                                WHERE   @NO IS NOT NULL
                            ) REPLY_CTE, COM_REPLY R
                            WHERE REPLY_CTE.NO = R.NO
                            AND R.PARENT_NO = ".$row[NO]."
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


            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);
//            MtUtil::_c("### [POST_DATA] ".json_encode(file_get_contents("php://input"),true));

/*            if ( trim($_model[TASK_NO]) == "" ) {
                $_d->failEnd("댓글 순번이 없습니다");
            }*/

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO COM_REPLY
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
                        ".$_model[PARENT_NO].",
                        '".$_model[REPLY_NO]."',
                        '".$_model[REPLY_GB]."',
                        '".$_model[LEVEL]."',
                        '".$_model[COMMENT]."',
                        '".$_SESSION['uid']."',
                        '".$_SESSION['name']."',
                        '".$_SESSION['nick']."',
                        SYSDATE(),
                        '0',
                        '".$_model[TARGET_NO]."',
                        '".$_model[TARGET_GB]."',
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

                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "UPDATE COM_REPLY
                        SET
                            COMMENT = '".$_model[COMMENT]."',
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

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM COM_REPLY WHERE PARENT_NO = ".$_key;
            $_d->sql_query($sql);

            $sql = "DELETE FROM COM_REPLY WHERE NO = ".$_key;
            $_d->sql_query($sql);

            /*$no = $_d->mysql_insert_id;*/

            /*$sql = "SELECT
                        F.NO, F.FILE_NM, F.FILE_SIZE, F.PATH, F.FILE_ID, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        FILE F, CONTENT_SOURCE S
                    WHERE
                        F.NO = S.SOURCE_NO
                        AND S.TARGET_GB = 'REVIEW'
                        AND S.TARGET_NO = ".$_key."
                        AND F.THUMB_FL = '0'
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);
                $sql = "DELETE FROM FILE WHERE NO = ".$row[NO];

                $_d->sql_query($sql);

                $sql = "DELETE FROM CONTENT_SOURCE WHERE TARGET_GB = 'REVIEW' AND TARGET_NO = ".$row[NO];

                $_d->sql_query($sql);

                MtUtil::_c("------------>>>>> DELETE NO : ".$row[NO]);

                if (file_exists('../../..'.$row[PATH].$row[FILE_ID])) {
                    unlink('../../..'.$row[PATH].$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'thumbnail/'.$row[FILE_ID]);
                    unlink('../../..'.$row[PATH].'medium/'.$row[FILE_ID]);
                }
            }

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }


            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("삭제실패입니다:".$msg);
            }else{
                $sql = "INSERT INTO CMS_HISTORY
                    (
                        WORK_ID
                        ,WORK_GB
                        ,WORK_DT
                        ,WORKER_ID
                        ,OBJECT_ID
                        ,OBJECT_GB
                        ,ACTION_GB
                        ,IP
                        ,ACTION_PLACE
                    ) VALUES (
                        '".$_model[WORK_ID]."'
                        ,'DELETE'
                        ,SYSDATE()
                        ,'".$_SESSION['uid']."'
                        ,'.$_key.'
                        ,'BOARD'
                        ,'DELETE'
                        ,'".$ip."'
                        ,'/webboard'
                    )";*/

                $_d->sql_query($sql);

                $_d->sql_commit();
                $_d->succEnd($no);

            break;
    }
?>