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
            if($_type == 'item'){
                $sql = "SELECT
                            NO, MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                        FROM
                            ANGE_MILEAGE
                        WHERE NO = ".$_key."
                        ";

                $data = $_d->sql_query($sql);
                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $result = $_d->sql_query($sql);
                    $data = $_d->sql_fetch_array($result);
                    $_d->dataEnd2($data);
                }
            } else if($_type == 'list'){
                $search_where = "";
                $sort_order = "";
                $limit = "";

                // 검색조건 추가
                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%'";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                $sql = "SELECT
                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                            NO, MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                        FROM
                        (
                            SELECT
                                NO, MILEAGE_GB, POINT, SUBJECT, REASON, COMM_GB, LIMIT_CNT, LIMIT_GB, LIMIT_DAY, POINT_ST
                            FROM ANGE_MILEAGE
                            WHERE 1=1
                            ".$search_where."
                         ".$sort_order."
                         ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM ANGE_MILEAGE
                            WHERE 1=1
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
            if ($_type == "item") {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_MILEAGE
                        (
                            SUBJECT,
                            POINT,
                            REASON,
                            COMM_GB,
                            LIMIT_CNT,
                            LIMIT_GB,
                            LIMIT_DAY,
                            POINT_ST
                        ) VALUES (
                            '".$_model['SUBJECT']."',
                            '".$_model['POINT']."',
                            '".$_model['REASON']."',
                            '".$_model['COMM_GB']."',
                            '".$_model['LIMIT_CNT']."',
                            '".$_model['LIMIT_GB']."',
                            '".$_model['LIMIT_DAY']."',
                            '".$_model['POINT_ST']."'
                        )";

                $_d->sql_query($sql);

                if ($_d->mysql_errno > 0) {
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
            }

            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if($_type == 'item') {
                $sql = "UPDATE ANGE_MILEAGE
                        SET
                            SUBJECT = '".$_model[SUBJECT]."',
                            POINT = '".$_model[POINT]."',
                            REASON = '".$_model[REASON]."',
                            COMM_GB = '".$_model[COMM_GB]."',
                            LIMIT_CNT = ".$_model[LIMIT_CNT].",
                            LIMIT_GB = '".$_model[LIMIT_GB]."',
                            LIMIT_DAY = '".$_model[LIMIT_DAY]."',
                            POINT_ST = ".$_model[POINT_ST]."
                        WHERE NO = '".$_key."'
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            } else if ($_type == 'status') {
                $sql = "UPDATE ANGE_MILEAGE
                        SET
                            POINT_ST = ".$_model[POINT_ST]."
                        WHERE NO = '".$_key."'
                        ";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("수정실패입니다:".$_d->mysql_error);
                } else {
                    $_d->succEnd($no);
                }
            }

            break;

        case "DELETE":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
            }

            $sql = "DELETE FROM ANGE_MILEAGE WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("삭제실패입니다:".$_d->mysql_error);
            } else {
                $_d->succEnd($no);
            }

            break;
    }