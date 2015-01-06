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
                //TODO: 조회
                $sql = "SELECT NO, PARENT_NO, COMMENT, (SELECT COUNT(*) FROM COM_REPLY WHERE PARENT_NO = R.NO) AS RE_COUNT, LEVEL, REPLY_NO
                    FROM
                      COM_REPLY R
                        WHERE 1=1
                          AND TARGET_NO = ".$_search[TARGET_NO]."
                          AND PARENT_NO = 0
                        ";

                $__trn = '';
                $result = $_d->sql_query($sql,true);

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                REPLY_CTE.LEVEL, R.NO, PARENT_NO, PARENT_NO, REPLY_NO, REPLY_GB, COMMENT, REG_UID, NICK_NM, REG_NM, R.TARGET_NO, TARGET_GB,
                                DATE_FORMAT(REG_DT, '%Y-%m-%d %H:%i') AS REG_DT,
                                (SELECT COUNT(*) FROM COM_REPLY WHERE PARENT_NO = R.NO) AS RE_COUNT
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
                            AND R.PARENT_NO = ".$row[NO]."";

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
                        TARGET_GB
                    ) VALUES (
                        ".$_model[PARENT_NO].",
                        '".$_model[REPLY_NO]."',
                        '".$_model[REPLY_GB]."',
                        '".$_model[LEVEL]."',
                        '".$_model[COMMENT]."',
                        'hong',
                        '홍길동',
                        '므에에롱',
                        SYSDATE(),
                        '0',
                        '".$_model[TARGET_NO]."',
                        '".$_model[TARGET_GB]."'
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
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE COM_REPLY
                    SET
                        PARENT_NO = '".$_model[SUBJECT]."',
                        REPLY_NO = '".$_model[SUBJECT]."',
                        REPLY_GB = '".$_model[SUBJECT]."',
                        COMMENT = '".$_model[SUBJECT]."',
                        #REG_UID = '".$_SESSION['uid']."',
                        #NICK_NM = '".$_SESSION['nick']."',
                        #REG_NM = '".$_SESSION['name']."',
                        #REG_DT = SYSDATE(),
                        LIKE_CNT = '".$_model[SUBJECT]."',
                        TARGET_NO = '".$_model[SUBJECT]."',
                        TARGET_GB = '".$_model[SUBJECT]."'
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

            break;

        case "DELETE":
            //TODO: 삭제

            break;
    }
?>