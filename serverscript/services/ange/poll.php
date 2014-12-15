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

    MtUtil::_c(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_c(print_r($_REQUEST,true));
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

    switch ($_method) {
        case "GET":
            if ($_type == 'item') {
                $search_where = "";

                if (isset($_search[COMM_GB]) && $_search[COMM_GB] != "") {
                    $search_where .= "AND COMM_GB = '".$_search[COMM_GB]."' ";
                }

                $err = 0;
                $msg = "";

                $sql = "SELECT
                            NO, COMM_NM, COMM_GB, REG_ID, REG_DT, COMM_ST, COMM_CLASS
                        FROM
                            ANGE_COMM
                        WHERE
                            NO = ".$_key."
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if (isset($_search[BOARD])) {
                    $sql = "SELECT
                              NO, PARENT_NO, HEAD, SUBJECT, BODY, REG_UID, REG_NM, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, HIT_CNT, LIKE_CNT, SCRAP_CNT, REPLY_CNT, NOTICE_FL, WARNING_FL, BEST_FL, TAG
                            FROM
                              COM_BOARD
                            WHERE
                              COMM_NO = ".$data[COMM_NO]."
                            ";

                    $__trn = '';
                    $result = $_d->sql_query($sql,true);
                    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                        $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    FILE F, CONTENT_SOURCE S
                                WHERE
                                    F.NO = S.SOURCE_NO
                                    AND S.TARGET_GB = 'CMS_BOARD'
                                    AND S.TARGET_NO = ".$row[NO]."
                                    AND F.THUMB_FL = '0'
                                ";

                        $file_data = $_d->getData($sql);
                        $row['FILES'] = $file_data;

                        $__trn->rows[$i] = $row;
                    }
                    $_d->sql_free_result($result);
                    $data['BOARD'] = $__trn->{'rows'};
                }
/*
                $sql = "SELECT
                            NO, PARENT_NO, REPLY_NO, REPLY_GB, SYSTEM_GB, COMMENT, REG_ID, REG_NM, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT, SCORE
                        FROM
                            COM_REPLY
                        WHERE
                            TARGET_NO = ".$_key."
                        ";

                $reply_data = $_d->getData($sql);
                $data['REPLY'] = $reply_data;
*/

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
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search[COMM_GB]) && $_search[COMM_GB] != "") {
                    $search_where .= "AND COMM_GB = '".$_search[COMM_GB]."' ";
                }

//                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
//                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
//                }

//                if (isset($_page)) {
//                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
//                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, COMM_NM, COMM_GB, REG_ID, REG_DT, COMM_ST, COMM_CLASS
                        FROM
                        (
                            SELECT
                                NO, COMM_NM, COMM_GB, REG_ID, REG_DT, COMM_ST, COMM_CLASS
                            FROM
                                ANGE_COMM
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT
                                COUNT(*) AS TOTAL_COUNT
                            FROM
                                ANGE_COMM
                            WHERE
                                1 = 1
                                ".$search_where."
                        ) CNT
                        ";

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

            $err = 0;
            $msg = "";

            if( trim($_model[COMM_NM]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $_d->sql_beginTransaction();

            $sql = "INSERT INTO ANGE_COMM
                    (
                        COMM_NM,
                        COMM_GB,
                        REG_ID,
                        REG_DT,
                        COMM_ST,
                        COMM_CLASS
                    ) VALUES (
                        '".$_model[COMM_NM]."',
                        '".$_model[COMM_GB]."',
                        '".$_SESSION['name']."',
                        SYSDATE(),
                        '".$_model[COMM_ST]."',
                        '".$_model[COMM_CLASS]."',
                    )";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("등록실패입니다:".$msg);
            }else{
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if( trim($_model[COMM_NM]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_COMM
                    SET
                        COMM_NM = '".$_model[COMM_NM]."',
                        COMM_GB = '".$_model[COMM_GB]."',
                        REG_UID = '".$_model[REG_UID]."',
                        REG_DT = SYSDATE(),
                        COMM_ST = '".$_model[COMM_ST]."',
                        COMM_CLASS = '".$_model[COMM_CLASS]."'
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
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "DELETE FROM ANGE_COMM WHERE NO = ".$_key;

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
                $_d->sql_commit();
                $_d->succEnd($no);
            }

            break;
    }
?>