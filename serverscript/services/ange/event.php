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

    MtUtil::_d(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_d(print_r($_REQUEST,true));
/*
    if (isset($_REQUEST['_category'])) {
        $category = explode("/", $_REQUEST['_category']);

        Util::_c("FUNC['processApi'] category : ".print_r($_REQUEST,true));
        Util::_c("FUNC['processApi'] category.cnt : ".count($category));
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
            if ($_type == 'item') {
                $search_where = "";

                $err = 0;
                $msg = "";

                // ada_notice,
                $sql = "SELECT  ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close, DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice, ada_option_quantity, ada_image, ada_preview, ada_imagemap,
                             ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url,
                             DATE_FORMAT(ada_date_open,'%Y%m%d') as OPEN_DATE ,DATE_FORMAT(ada_date_close, '%Y%m%d') as END_DATE, ada_option_delivery,ada_text, ada_guide,
                             ada_url, ada_count_request, ada_detail,ada_que_type, ada_count_join, DATE_FORMAT(ada_date_review_open,'%Y-%m-%d') as ada_date_review_open, DATE_FORMAT(ada_date_review_close,'%Y-%m-%d') as ada_date_review_close
                        FROM
                            adm_ad AE
                        WHERE
                            ada_idx = ".$_key."
                            ".$search_where."
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
            } if ($_type == 'replyitem') {

                $search_where = "";
                $search_common = "";
                $limit = "";
                $sort_order = "ORDER BY REG_DT DESC";

                if(isset($_search['ada_idx']) && $_search['ada_idx'] != ""){
                    $search_where .= "AND ada_idx = '".$_search['ada_idx']."' ";
                }

                if (isset($_search['PAGE_NO']) && $_search['PAGE_NO'] != "") {
                    $limit .= "LIMIT ".(($_search['PAGE_NO']-1) * $_search['PAGE_SIZE']).", ".$_search['PAGE_SIZE'];
                }

                //TODO: 조회
                $sql = "SELECT adhj_answers, nick_nm, DATE_FORMAT(adhj_date_request, '%Y-%m-%d') as adhj_date_request, TOTAL_COUNT
                        FROM
                        (
                            SELECT
                                  a.adhj_answers, (SELECT MAX(U.NICK_NM) FROM COM_USER U WHERE U.USER_ID = a.adu_id) nick_nm, a.adhj_date_request
                            FROM adm_history_join a
                            WHERE 1 = 1
                                ".$search_where."
                                ORDER BY adhj_date_request DESC
                                ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM adm_history_join a
                            WHERE 1 = 1
                                ".$search_where."
                        ) CNT";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            }else if ($_type == 'list') {
                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if (isset($_search['ADA_TYPE_IN']) && $_search['ADA_TYPE_IN'] != "") {
                    $search_where .= "AND a.ada_type IN (".$_search['ADA_TYPE_IN'].") ";
                }

                if (isset($_search['ADP_CODE_NOT_IN']) && $_search['ADP_CODE_NOT_IN'] != "") {
                    $search_where .= "AND p.adp_code NOT IN (".$_search['ADP_CODE_NOT_IN'].") ";
                }

                if(isset($_search['NOT_SAMPLE']) && $_search['NOT_SAMPLE'] == "Y"){
                    $search_where .= "AND a.adp_idx NOT IN (45, 46) ";
                }

                if(isset($_search['NOT_POST']) && $_search['NOT_POST'] == "Y"){
                    $search_where .= "AND a.adp_idx != 49 ";
                }

                if(isset($_search['NOT_POST']) && $_search['NOT_POST'] == "Y"){
                    $search_where .= "AND a.adp_idx != 49 ";
                }

                if(isset($_search['PERFORM_FL']) && $_search['PERFORM_FL'] == "N"){
                    $search_where .= "AND a.adp_idx != 53 ";
                }

                if(isset($_search['PERFORM_FL']) && $_search['PERFORM_FL'] == "Y"){
                    $search_where .= "AND a.adp_idx = 53 ";
                }

                if (isset($_search['EVENT_GB']) && $_search['EVENT_GB'] != "") {
                    $search_where .= "AND a.ada_type = '".$_search['EVENT_GB']."' ";
                }

                if (isset($_search['PRODUCT_CODE']) && $_search['PRODUCT_CODE'] != "") {
                    $search_where .= "AND a.adp_idx = '".$_search['PRODUCT_CODE']."' ";
                }

                if (isset($_search['PROCESS']) && $_search['PROCESS'] != "") {
                    $search_where .= "AND DATE_FORMAT(a.ada_date_close, '%Y-%m-%d') >= DATE_FORMAT(NOW(), '%Y-%m-%d')  AND  DATE_FORMAT(NOW(), '%Y-%m-%d') >= DATE_FORMAT(a.ada_date_open, '%Y-%m-%d')";
                }

                if (isset($_search['PAST']) && $_search['PAST'] != "") {
                    $search_where .= "AND DATE_FORMAT(a.ada_date_close, '%Y-%m-%d')  < DATE_FORMAT(NOW(), '%Y-%m-%d')";
                }

                if (isset($_search['REVIEW_EVENT_GB']) && $_search['REVIEW_EVENT_GB'] != "") {
                    $search_where .= "AND a.ada_type IN ('exp','event') ";
                }

                if(isset($_search['ADA_STATE']) && $_search['ADA_STATE'] != ""){
                    if($_search['ADA_STATE'] == 1){
                        $search_where .= "AND a.ada_state = '".$_search['ADA_STATE']."' ";
                    }else{
                        $search_where .= "AND a.ada_state = '".$_search['ADA_STATE']."' ";
                    }
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                }

                if (isset($_page)) {
                    $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
                }

                // , ada_notice
                $sql = "SELECT TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                             ada_idx, ada_title, ada_url ,DATE_FORMAT(ada_date_open,'%Y-%m-%d') as ada_date_open ,DATE_FORMAT(ada_date_close, '%Y-%m-%d') as ada_date_close ,ada_option_quantity, ada_image, ada_preview, ada_imagemap
                             ,ada_state ,ada_que_info, concat('http://angead.marveltree.com/adm/upload/', ada_image) as ada_image_url, ada_type, ada_title, ada_que_type
                             ,DATE_FORMAT(ada_date_notice, '%Y-%m-%d') as ada_date_notice, ada_count_request
                        FROM
                        (
                            SELECT
                                  ada_idx, ada_type, ada_title, ada_url, ada_date_open, ada_date_close, ada_option_quantity, ada_image, ada_preview, ada_imagemap,
                                  ada_state, ada_que_info, ada_que_type, ada_date_notice, ada_count_request
                            FROM adm_ad a, adm_product p
                            WHERE 1 = 1
                            	  AND a.adp_idx = p.adp_idx
                                ".$search_where."
                                ".$sort_order."
                                ".$limit."
                        ) AS DATA,
                        (SELECT @RNUM := 0) R,
                        (
                            SELECT COUNT(*) AS TOTAL_COUNT
                            FROM adm_ad a, adm_product p
                            WHERE 1 = 1
                            	AND a.adp_idx = p.adp_idx
                              ".$search_where."
                        ) CNT
                        ";

                $data = $_d->sql_query($sql);

                if($_d->mysql_errno > 0){
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                }else{
                    $_d->dataEnd($sql);
                }
            } else if ($_type == 'selectList') {

                if (!isset($_SESSION['uid'])) {
                    $_d->failEnd("세션이 만료되었습니다. 다시 로그인 해주세요.");
                }

                $search_common = "";
                $search_where = "";
                $sort_order = "";
                $limit = "";

                if(isset($_search['NOT_SAMPLE']) && $_search['NOT_SAMPLE'] == "Y"){
                    $search_where .= "AND b.adp_idx NOT IN (45, 46) ";
                }

                if(isset($_search['NOT_SAMPLE']) && $_search['NOT_SAMPLE'] == "N"){
                    $search_where .= "AND b.adp_idx IN (45, 46) ";
                }

                if(isset($_search['NOT_POST']) && $_search['NOT_POST'] == "Y"){
                    $search_where .= "AND b.adp_idx != 49 ";
                }

                if(isset($_search['PERFORM_FL']) && $_search['PERFORM_FL'] == "N"){
                    $search_where .= "AND b.adp_idx != 53 ";
                }

                if(isset($_search['PERFORM_FL']) && $_search['PERFORM_FL'] == "Y"){
                    $search_where .= "AND b.adp_idx = 53 ";
                }

                if (isset($_search['PRODUCT_CODE']) && $_search['PRODUCT_CODE'] != "") {
                    $search_where .= "AND b.adp_idx = '".$_search['PRODUCT_CODE']."' ";
                }

                if (isset($_search['EXIST']) && $_search['EXIST'] != "") {
                    $search_where .= "AND NOT EXISTS (SELECT * FROM ANGE_REVIEW WHERE TARGET_NO = a.ada_idx AND REG_UID = '".$_SESSION['uid']."')";
                }

                if (isset($_search['SORT']) && $_search['SORT'] != "") {
                    $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
                }

                // , ada_notice
                $sql = "SELECT (SELECT ada_title FROM adm_ad a WHERE a.ada_idx = DATA.ada_idx) AS ada_title, ada_idx, adu_id, adu_name,
                            (SELECT DATE_FORMAT(ada_date_notice, '%Y-%m-%d') FROM adm_ad a WHERE a.ada_idx = DATA.ada_idx) AS ada_date_notice, TOTAL_COUNT,
                            (SELECT DATE_FORMAT(ada_date_review_close, '%Y-%m-%d') FROM adm_ad a WHERE a.ada_idx = DATA.ada_idx) AS ada_date_review_close
                            FROM
                            (
                                SELECT
                                      a.ada_idx, a.adu_id, a.adu_name
                                FROM adm_history_join a, adm_ad b
                                WHERE 1 = 1
                                    AND a.ada_idx = b.ada_idx
                                    AND a.adu_id = '".$_SESSION['uid']."'
                                    AND a.adhj_date_join IS NOT NULL
                                    AND a.adhj_date_complete IS NOT NULL
                                    ".$search_where."
                            ) AS DATA,
                            (SELECT @RNUM := 0) R,
                            (
                                SELECT COUNT(*) AS TOTAL_COUNT
                                FROM adm_history_join a, adm_ad b
                                WHERE 1 = 1
                                    AND a.ada_idx = b.ada_idx
                                    AND a.adu_id = '".$_SESSION['uid']."'
                                    AND a.adhj_date_join IS NOT NULL
                                    AND a.adhj_date_complete IS NOT NULL
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
            break;

        case "PUT":
            break;

        case "DELETE":
            break;
    }
?>