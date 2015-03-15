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

    $_d = new MtJson(null);

    if ($_d->connect_db == "") {
        $_d->failEnd("DB 연결 실패. 관리자에게 문의하세요.");
    }

    if (!isset($_type) || $_type == "") {
        $_d->failEnd("서버에 문제가 발생했습니다. 작업 유형이 없습니다.");
    }

    switch ($_method) {
        case "GET":
            break;

        case "POST":
            if ($_type == 'item') {
                $err = 0;
                $msg = "";

                $_d->sql_beginTransaction();

                $sql = "insert into em_smt_tran
                        (
                            date_client_req,
                            content,
                            callback,
                            service_type,
                            broadcast_yn,
                            msg_status,
                            recipient_num
                        )
                        values
                        (
                            sysdate(),
                            '[앙쥬] 본인인증을 위해 [".$_model['CERT_NO']."]를 입력해 주세요',
                            '023334650',
                            '0',
                            'N',
                            '1',
                            '".$_model['PHONE_2']."'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("전송실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == 'brodcast') {
                $sql = "insert into em_smt_tran
                        (
                            date_client_req,
                            content,
                            callback,
                            service_type,
                            broadcast_yn,
                            msg_status
                        )
                        values
                        (
                            sysdate(),
                            '".$_model['MESSAGE']."',
                            '".$_model['SEND_PHONE']."',
                            '0',
                            'Y',
                            '9'
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

//                $sql = "select max(mt_pr) from em_smt_tran";
//                $smt_pr = $_d->sql_fetch($sql);

                if ($_model[CHECKED] == "C") {
                    if (isset($_model[USER_ID_LIST])) {
                        $in_str = "";
                        $in_size = sizeof($_model[USER_ID_LIST]);
                        for ($i=0; $i< $in_size; $i++) {
                            $in_str .= "'".trim($_model[USER_ID_LIST][$i])."'";
                            if ($in_size - 1 != $i) $in_str .= ",";
                        }

                        $search_where = "AND USER_ID IN (".$in_str.") ";
                    }
                } else {
                    if ((isset($_model[CONDITION]) && $_model[CONDITION] != "") && (isset($_model[KEYWORD]) && $_model[KEYWORD] != "")) {
                        if ($_model[CONDITION][value] == "USER_NM" || $_model[CONDITION][value] == "USER_ID" || $_model[CONDITION][value] == "NICK_NM") {
                            $arr_keywords = explode(",", $_model[KEYWORD]);
                            $in_condition = "";
                            for ($i=0; $i< sizeof($arr_keywords); $i++) {
                                $in_condition .= "'".trim($arr_keywords[$i])."'";
                                if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                            }

                            $search_where .= "AND ".$_model[CONDITION][value]." IN (".$in_condition.") ";
                        } else if ($_model[CONDITION][value] == "PHONE") {
                            $search_where .= "AND ( PHONE_1 LIKE '%".$_model[KEYWORD]."%' OR PHONE_2 LIKE '%".$_model[KEYWORD]."%' ) ";
                        } else {
                            $search_where .= "AND ".$_model[CONDITION][value]." LIKE '%".$_model[KEYWORD]."%' ";
                        }
                    }
                    if (isset($_model[TYPE]) && $_model[TYPE] != "") {

                        $in_type = "";
                        for ($i=0; $i< count($_model[TYPE]); $i++) {
                            $in_type .= "'".$_model[TYPE][$i]."'";
                            if (count($_model[TYPE]) - 1 != $i) $in_type .= ",";
                        }

                        $search_where .= "AND USER_GB IN (".$in_type.") ";
                    }
                    if (isset($_model[STATUS]) && $_model[STATUS] != "" && $_model[STATUS][value] != "A") {
                        $search_where .= "AND USER_ST  = '".$_model[STATUS][value]."' ";
                    }
                }

                $sql = "SELECT USER_ID, PHONE_2
                        FROM
                            COM_USER
                        WHERE
                            1 = 1
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql,true);
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    if ($row[PHONE_2] != "") {
                        $sql = "insert into em_smt_client
                            (
                                mt_pr,
                                mt_seq,
                                msg_status,
                                recipient_num,
                                change_word1,
                                change_word2,
                                change_word3
                            )
                            values
                            (
                                '".$no."',
                                '".$i."',
                                1,
                                '".$row[PHONE_2]."',
                                '".$_model['WORD1']."',
                                '".$_model['WORD2']."',
                                '".$_model['WORD3']."'
                            )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                if (isset($_model[ADD_PHONE])) {
                    $arr_phone = explode(",", $_model[ADD_PHONE]);
                    for ($j=0; $j< sizeof($arr_phone); $j++) {
                        $sql = "insert into em_smt_client
                            (
                                mt_pr,
                                mt_seq,
                                msg_status,
                                recipient_num,
                                change_word1,
                                change_word2,
                                change_word3
                            )
                            values
                            (
                                '".$no."',
                                '".($i+$j)."',
                                1,
                                '".str_replace("-", "", trim($arr_phone[$j]))."',
                                '".$_model['WORD1']."',
                                '".$_model['WORD2']."',
                                '".$_model['WORD3']."'
                            )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }
                    }
                }

                $sql = "update em_smt_tran
                        set msg_status = '1'
                        where mt_pr = ".$no;

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if ($err > 0) {
                    $_d->sql_rollback();
                    $_d->failEnd("전송실패입니다:".$msg);
                } else {
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            }

            break;

        case "PUT":
            break;

        case "DELETE":
            break;
    }
?>