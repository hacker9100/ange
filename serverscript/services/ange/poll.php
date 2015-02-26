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
            if ($_type == "item") {
                $search_where = "";

                // ada_notice,
                $sql = "SELECT  ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close, DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice, ada_option_quantity, ada_image, ada_preview, ada_imagemap,
                             ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url,
                             DATE_FORMAT(ada_date_open,'%Y%m%d') as OPEN_DATE ,DATE_FORMAT(ada_date_close, '%Y%m%d') as END_DATE, ada_option_delivery,
                             ada_url, ada_count_request, ada_detail,ada_que_type, ada_count_join
                        FROM
                            adm_ad AE
                        WHERE
                            ada_idx = ".$_key."
                            ".$search_where."
                        ";

                $result = $_d->sql_query($sql);
                $data = $_d->sql_fetch_array($result);


                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                if($err > 0){
                    $_d->failEnd("조회실패입니다:".$msg);
                }else{
                    $_d->dataEnd2($data);
                }

            } else if ($_type == "list") {
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search[POLL_ST]) && $_search[POLL_ST] != "") {
                    $search_where .= "AND ada_state = '".$_search[POLL_ST]."' ";
                }

                if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND ".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
                }

                if (isset($_search[SORT]) && $_search[SORT] != "") {
                    $sort_order .= "ORDER BY ".$_search[SORT]." ".$_search[ORDER]." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
                }

//                $sql = "SELECT
//                            TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
//                            NO, SUBJECT, START_YMD, END_YMD, PRESENT, QUERY_CNT, POLL_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
//                        FROM
//                        (
//                            SELECT
//                                NO, SUBJECT, START_YMD, END_YMD, PRESENT, QUERY_CNT, POLL_ST, REG_DT
//                            FROM
//                                ANGE_POLL
//                            WHERE
//                                1 = 1
//                                ".$search_where."
//                            ".$sort_order."
//                            ".$limit."
//                        ) AS DATA,
//                        (SELECT @RNUM := 0) R,
//                        (
//                            SELECT
//                                COUNT(*) AS TOTAL_COUNT
//                            FROM
//                                ANGE_POLL
//                            WHERE
//                                1 = 1
//                                ".$search_where."
//                        ) CNT
//                        ";

                // , ada_notice
                $sql = "SELECT TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                             ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close ,ada_option_quantity, ada_image, ada_preview, ada_imagemap
                             ,ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url, ada_type, ada_title, ada_que_type
                             ,DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice
                        FROM
                        (
                            SELECT
                                  ada_idx, ada_type, ada_title, ada_url, ada_date_open, ada_date_close, ada_option_quantity, ada_image, ada_preview, ada_imagemap,
                                  ada_state, ada_que_info, ada_que_type, ada_date_notice
                            FROM adm_ad
                            WHERE 1 = 1
                              AND ada_type = 'survey'
                                ".$search_where."
                                ".$sort_order."
                                ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM adm_ad
                            WHERE 1 = 1
                              AND ada_type = 'survey'
                              ".$search_where."
                        ) CNT
                        ";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == "check") {

//                $sql = "SELECT COUNT(DISTINCT USER_UID) AS POLL_ANSWER_CNT
//                        FROM ANGE_POLL_ANSWEAR
//                        WHERE POLL_NO = ".$_search[BOARD_NO]."
//                          AND USER_UID = '".$_search[USER_UID]."'";

                $sql = "SELECT COUNT(DISTINCT adu_id) AS POLL_ANSWER_CNT
                        FROM adm_history_join
                        WHERE ada_idx = ".$_search[ada_idx]."
                          AND adu_id = '".$_SESSION['uid']."'";

                $data = $_d->sql_query($sql);
                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }

            }else if ($_type == "chartlist") {


                $sql = "SELECT adhj_answers
                        FROM adm_history_join
                        WHERE ada_idx = ".$_search[ada_idx]."
                        ";


                $result = $_d->sql_query($sql,true);
                //$data = $_d->sql_fetch_array($result);

                $qcnt=0;

                $data = null;

                for ($i=0; $lval=$_d->sql_fetch_array($result); $i++) {

                    MtUtil::_d("### [END] [DATA] lval['adhj_answers'] = ".json_encode($lval['adhj_answers']));

                    $t_answer = json_decode($lval['adhj_answers'],true); // $lval['adhj_answers']

                    if ($t_answer){
                        $qcnt++;

                        foreach($t_answer as $lkey2=>$lval2){ // $lkey2=>$lval2
                            if (isset($a_answer[$lkey2][$lval2])){ // [$lkey2][$lval2]
                                $a_answer[$lkey2][$lval2]++; // [$lkey2][$lval2]
                            }else{

                                $a_answer[$lkey2][$lval2]=1;
                            }
                        }

                    }
                    $data['answer'] = $a_answer;
//                    $data['answer'][1]['삽겹살']=1
//                    $a_answer[1]['소고기']=2
//                    $a_answer[1]['치킨']=10

                    //$__trn->rows[$i] = $data['answer'];
                }

                //$data = $__trn->{'rows'};

//                foreach($data['answer'] as $lkey=>$lval){
//                    echo("<br/>".$lkey.'문항<br/>');
//                    foreach($lval as $lkey2=>$lval2){
//
//                        MtUtil::_d("### [END] [DATA] lval['testtesttest'] = ".$lkey2.":".$lval2);
//
//                        echo(" {$lkey2} : {$lval2} / {$qcnt} , ");
//                    }
//                }

                $lcnt=0;
                foreach($data['answer'] as $lkey=>$lval){
                    $lcnt++;
                    $t_stream = "[";
                    $t_stream .= "['선택','응답율']";
                    arsort($lval); // 가장큰것부터 정렬
                    foreach($lval as $lkey2=>$lval2){

                        //MtUtil::_d("### [END] [DATA] lval['testtesttest'] = ".$lkey2.":".$lval2);

                        $t_rate = (round((int)$lval2/(int)$qcnt*1000)/10);
                        $t_stream .= "^['{$lkey2}'|{$t_rate}]";
                    }
                    $t_stream .= "]";

                    $graphdata_answer[$lcnt]=$t_stream;

                    json_encode($graphdata_answer[$lcnt], true);
                }


                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    ob_end_clean();

                    echo json_encode($graphdata_answer, true); // $data['answer']
                    exit;
                }
            }

            break;

        case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

            if ($_type == "item") {
                $err = 0;
                $msg = "";

/*                if( trim($_model[SUBJECT]) == "" ){
                    $_d->failEnd("제목을 작성 하세요");
                }*/

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO ANGE_POLL
                        (
                            SUBJECT,
                            START_YMD,
                            END_YMD,
                            PRESENT,
                            QUERY_CNT,
                            POLL_ST,
                            REG_DT
                        ) VALUES (
                            '".$_model[SUBJECT]."',
                            '".$_model[START_YMD]."',
                            '".$_model[END_YMD]."',
                            '".$_model[PRESENT]."',
                            '".$_model[QUERY_CNT]."',
                            '".$_model[POLL_ST]."',
                            SYSDATE()
                        )";

                $_d->sql_query($sql);
                $no = $_d->mysql_insert_id;

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                $i = 0;
                foreach ($_model[QUERY] as $e) {
                    if (isset($e[QUERY]) && $e[QUERY] != "") {
                        $sql = "INSERT INTO ANGE_POLL_QUERY
                                (
                                    POLL_NO
                                    ,QUERY_NO
                                    ,QUERY_ORD
                                    ,QUERY_GB
                                    ,QUERY
                                ) VALUES (
                                    '".$no."'
                                    ,'".$i++."'
                                    ,'".$e[BABY_SEX_GB]."'
                                    ,'".$e[QUERY_GB]."'
                                    ,'".$e[QUERY]."'
                                )";

                        $_d->sql_query($sql);

                        if($_d->mysql_errno > 0) {
                            $err++;
                            $msg = $_d->mysql_error;
                        }

                        $j = 0;
                        foreach ($e[SELECT] as $s) {
                            if (isset($s[NOTE]) && $s[NOTE] != "") {
                                $sql = "INSERT INTO ANGE_POLL_SELECT
                                        (
                                            POLL_NO
                                            ,QUERY_NO
                                            ,SELECT_ORD
                                            ,NOTE
                                        ) VALUES (
                                            '".$no."'
                                            ,'".$i++."'
                                            ,'".$j."'
                                            ,'".$s[NOTE]."'
                                        )";

                                $_d->sql_query($sql);

                                if($_d->mysql_errno > 0) {
                                    $err++;
                                    $msg = $_d->mysql_error;
                                }
                            }
                        }
                    }
                }

                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd($no);
                }
            } else if ($_type == "answear") {

                $err = 0;
                $msg = "";

               /* ".$_SESSION['uid']."*/
//                $j = 0;
//                foreach ($_model as $s) {
//
//                   $query_no = "";
//                   $query_sort = "";
//                   $poll_no = "";
//                   $select_answer = "";
//                   $select_short_answer = "";
//                   $note = "";
//
//                    // 질문 유형이 주관식일때
//                    if ($s[QUERY_GB] == 'S') {
//                        $query_no = $s[QUERY_NO];
//                        $query_sort = $s[QUERY_SORT];
//                        $poll_no = $s[BOARD_NO];
//                        $select_answer = 0;
//                        $select_short_answer = $s[SELECT_SHORT_ANSWER];
//                        $note = '';
//                    } else if($s[QUERY_GB] == 'M'){ // 객관식일때
//
//                        if(!isset($s[SELECT_ANSWER])){
//                            $query_no = $s[QUERY_NO];
//                            $query_sort = $s[QUERY_SORT];
//                            $poll_no = $s[BOARD_NO];
//                            $select_answer = 0;
//                            $select_short_answer = '';
//                            $note = '';
//                        }else{
//                            $query_no = $s[SELECT_ANSWER][QUERY_NO];
//                            $query_sort = $s[SELECT_ANSWER][QUERY_SORT];
//                            $poll_no = $s[SELECT_ANSWER][BOARD_NO];
//                            $select_answer = $s[SELECT_ANSWER][SELECT_SORT];
//                            $note = $s[SELECT_ANSWER][NOTE];
//                            $select_short_answer = $s[SELECT_SHORT_ANSWER];
//                        }
//                    }else if($s[QUERY_GB] == 'D'){ // 다중객관식일때
//
//                        if(!isset($s[SELECT_ANSWER])){
//                            $query_no = $s[QUERY_NO];
//                            $query_sort = $s[QUERY_SORT];
//                            $poll_no = $s[BOARD_NO];
//                            $select_answer = 0;
//                            $select_short_answer = '';
//                            $note = '';
//                        }else{
//                            foreach ($s[SELECT_ANSWER] as $e) {
//
//                                $query_no = $e[QUERY_NO];
//                                $query_sort = $e[QUERY_SORT];
//                                $poll_no = $e[BOARD_NO];
//                                $select_answer = $e[SELECT_SORT];
//                                $note = $e[NOTE];
//                                $select_short_answer = $e[SELECT_SHORT_ANSWER];
//                            }
//                        }
//                    }
//
//                    $sql = "INSERT INTO ANGE_POLL_ANSWEAR
//                                (
//                                    QUERY_NO
//                                    ,QUERY_SORT
//                                    ,USER_UID
//                                    ,POLL_NO
//                                    ,NICK_NM
//                                    ,SELECT_ANSWEAR
//                                    ,SELECT_SHORT_ANSWER
//                                    ,NOTE
//                                    ,REG_DT
//                                ) VALUES (
//                                    '".$query_no."'
//                                    ,'".$query_sort."'
//                                    ,'".$_SESSION['uid']."'
//                                    ,'".$poll_no."'
//                                    ,'".$_SESSION['name']."'
//                                    ,'".$select_answer."'
//                                    ,'".$select_short_answer."'
//                                    ,'".$note."'
//                                    ,SYSDATE()
//                                )";
//
//                    $_d->sql_query($sql);
//                    $no = $_d->mysql_insert_id;
//
//                    if($_d->mysql_errno > 0) {
//                        $err++;
//                        $msg = $_d->mysql_error;
//                    }
//
//                }
                // 응모/신청 광고센터 adm_history_join 테이블에 insert -> 실적통계에서 확인가능
//                MtUtil::_d("########################MYSQL ERROR########################\n"
//                    ."SQL:::[".$sql."]\n"
//                    ."MSG:::[".mysql_errno() . ":" . mysql_error()
//                    ."\n###########################################################");

                $_d->sql_beginTransaction();

                $sql = "INSERT INTO adm_history_join
                                (
                                    ada_idx,
                                    adu_id,
                                    adu_name,
                                    adhj_date_request,
                                    adhj_answers
                                ) VALUES (
                                    '".$_model[ada_idx]."'
                                    , '".$_SESSION['uid']."'
                                    , '".$_SESSION['name']."'
                                    , NOW()
                                    , '".$_model[ANSWER]."'
                                )";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }

                // 신청자명 증가
                $sql = "UPDATE adm_ad
                  SET  ada_count_request = ada_count_request + 1
                  WHERE ada_idx = '".$_model[ada_idx]."'";

                $_d->sql_query($sql);

                if($_d->mysql_errno > 0) {
                    $err++;
                    $msg = $_d->mysql_error;
                }


                if($err > 0){
                    $_d->sql_rollback();
                    $_d->failEnd("등록실패입니다:".$msg);
                }else{
                    $_d->sql_commit();
                    $_d->succEnd("0");
                }
        }
            break;

        case "PUT":
            if (!isset($_key) || $_key == '') {
                $_d->failEnd("수정실패입니다:"."KEY가 누락되었습니다.");
            }

            if( trim($_model[SUBJECT]) == "" ){
                $_d->failEnd("제목을 작성 하세요");
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_POLL
                    SET
                        SUBJECT = '".$_model[SUBJECT]."',
                        START_YMD = '".$_model[START_YMD]."',
                        END_YMD = '".$_model[END_YMD]."',
                        PRESENT = '".$_model[PRESENT]."',
                        QUERY_CNT = '".$_model[QUERY_CNT]."',
                        POLL_ST = '".$_model[POLL_ST]."'
                    WHERE
                        NO = ".$_key."
                    ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            $sql = "DELETE FROM ANGE_POLL_QUERY WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_SELECT WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $i = 0;
            foreach ($_model[QUERY] as $e) {
                if (isset($e[QUERY]) && $e[QUERY] != "") {
                    $sql = "INSERT INTO ANGE_POLL_QUERY
                            (
                                POLL_NO
                                ,QUERY_NO
                                ,QUERY_ORD
                                ,QUERY_GB
                                ,QUERY
                            ) VALUES (
                                '".$no."'
                                ,'".$i++."'
                                ,'".$e[BABY_SEX_GB]."'
                                ,'".$e[QUERY_GB]."'
                                ,'".$e[QUERY]."'
                            )";

                    $_d->sql_query($sql);

                    if($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }

                    $j = 0;
                    foreach ($e[SELECT] as $s) {
                        if (isset($s[NOTE]) && $s[NOTE] != "") {
                            $sql = "INSERT INTO ANGE_POLL_SELECT
                                    (
                                        POLL_NO
                                        ,QUERY_NO
                                        ,SELECT_ORD
                                        ,NOTE
                                    ) VALUES (
                                        '".$no."'
                                        ,'".$i++."'
                                        ,'".$j."'
                                        ,'".$s[NOTE]."'
                                    )";

                            $_d->sql_query($sql);

                            if($_d->mysql_errno > 0) {
                                $err++;
                                $msg = $_d->mysql_error;
                            }
                        }
                    }
                }
            }

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

            $sql = "DELETE FROM ANGE_POLL WHERE NO = ".$_key;

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_QUERY WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "DELETE FROM ANGE_POLL_SELECT WHERE POLL_NO = ".$_key;

            $_d->sql_query($sql);

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