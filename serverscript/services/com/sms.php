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
                            '023334650',
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

                for ($i=0; $i< sizeof($_model['SMS']); $i++) {
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
                                '".$_model["SMS"][$i]['PHONE']."',
                                '".$_model["SMS"][$i]['WORD1']."',
                                '".$_model["SMS"][$i]['WORD2']."',
                                '".$_model["SMS"][$i]['WORD3']."'
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
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