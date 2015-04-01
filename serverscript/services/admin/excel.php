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

    $_search = json_decode($_search, true);

    $filename = null;
    $search_where = "";
    $sort_order = "";

    if ($_type == "user") {
        $filename = "회원 목록";

        if ($_search[CHECKED] == "C") {
            MtUtil::_d($_search.CHECKED);
            if (isset($_search[USER_ID_LIST])) {
                MtUtil::_d($_search.CHECKED);
                $in_str = "";
                $in_size = sizeof($_search[USER_ID_LIST]);
                for ($i=0; $i< $in_size; $i++) {
                    $in_str .= "'".trim($_search[USER_ID_LIST][$i])."'";
                    if ($in_size - 1 != $i) $in_str .= ",";
                }

                $search_where = "AND U.USER_ID IN (".$in_str.") ";
            }
        } else {
            if ((isset($_search[CONDITION]) && $_search[CONDITION] != "") && (isset($_search[KEYWORD]) && $_search[KEYWORD] != "")) {
                if ($_search[CONDITION][value] == "USER_NM" || $_search[CONDITION][value] == "USER_ID" || $_search[CONDITION][value] == "NICK_NM") {
                    $arr_keywords = explode(",", $_search[KEYWORD]);
                    $in_condition = "";
                    for ($i=0; $i< sizeof($arr_keywords); $i++) {
                        $in_condition .= "'".trim($arr_keywords[$i])."'";
                        if (sizeof($arr_keywords) - 1 != $i) $in_condition .= ",";
                    }

                    $search_where .= "AND U.".$_search[CONDITION][value]." IN (".$in_condition.") ";
                } else if ($_search[CONDITION][value] == "PHONE") {
                    $search_where .= "AND ( U.PHONE_1 LIKE '%".$_search[KEYWORD]."%' OR U.PHONE_2 LIKE '%".$_search[KEYWORD]."%' ) ";
                } else {
                    $search_where .= "AND U.".$_search[CONDITION][value]." LIKE '%".$_search[KEYWORD]."%' ";
                }
            }
            if (isset($_search[TYPE]) && $_search[TYPE] != "") {

                $in_type = "";
                for ($i=0; $i< count($_search[TYPE]); $i++) {
                    $in_type .= "'".$_search[TYPE][$i]."'";
                    if (count($_search[TYPE]) - 1 != $i) $in_type .= ",";
                }

                $search_where .= "AND U.USER_GB IN (".$in_type.") ";
            }
            if (isset($_search[STATUS]) && $_search[STATUS] != "" && $_search[STATUS][value] != "A") {
                $search_where .= "AND U.USER_ST  = '".$_search[STATUS][value]."' ";
            }
        }

        $sql = "SELECT
                    TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                    USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, INTRO, NOTE,
                    MARRIED_FL, PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_YMD, CENTER_OUT_YMD, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SMS_FL, EN_PHONE_FL,
                    ROLE_ID, ROLE_NM,
                    (SELECT COUNT(1) FROM ANGE_USER_BABY UB WHERE UB.USER_ID = DATA.USER_ID) AS BABY_CNT,
                    (SELECT COUNT(1) FROM COM_BOARD CB WHERE CB.REG_UID = DATA.USER_ID) AS BOARD_CNT,
                    (SELECT COUNT(1) FROM COM_REPLY CR WHERE CR.REG_UID = DATA.USER_ID) AS REPLY_CNT,
                    (SELECT COUNT(1) FROM ANGE_COMP AC WHERE AC.USER_ID = DATA.USER_ID AND TARGET_GB = 'EXPERIENCE') AS EXPERIENCE_COMP_CNT,
                    (SELECT COUNT(1) FROM ANGE_COMP AC WHERE AC.USER_ID = DATA.USER_ID AND TARGET_GB = 'EVENT') AS EVENT_COMP_CNT,
                    (SELECT COUNT(1) FROM ANGE_COMP_WINNER AW WHERE AW.USER_ID = DATA.USER_ID AND TARGET_GB = 'EXPERIENCE') AS EXPERIENCE_WINNER_CNT,
                    (SELECT COUNT(1) FROM ANGE_COMP_WINNER AW WHERE AW.USER_ID = DATA.USER_ID AND TARGET_GB = 'EVENT') AS EVENT_WINNER_CNT,
                    (SELECT COUNT(1) FROM ANGE_REVIEW AR WHERE AR.REG_UID = DATA.USER_ID) AS REVIEW_CNT
                FROM
                (
                    SELECT
                        U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.INTRO, U.NOTE,
                        U.MARRIED_FL, U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_YMD, U.CENTER_OUT_YMD, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SMS_FL, U.EN_PHONE_FL,
                        UR.ROLE_ID, (SELECT ROLE_NM FROM COM_ROLE WHERE ROLE_ID = UR.ROLE_ID) AS ROLE_NM
                    FROM
                        COM_USER U, USER_ROLE UR, COM_ROLE R
                    WHERE
                        U.USER_ID = UR.USER_ID
                        AND UR.ROLE_ID = R.ROLE_ID
                        ".$search_where."
                    ".$sort_order."
                    ".$limit."
                ) AS DATA,
                (SELECT @RNUM := 0) R,
                (
                    SELECT
                        COUNT(*) AS TOTAL_COUNT
                    FROM
                        COM_USER U, USER_ROLE UR, COM_ROLE R
                    WHERE
                        U.USER_ID = UR.USER_ID
                        AND UR.ROLE_ID = R.ROLE_ID
                        ".$search_where."
                ) CNT
                ";

        $__trn = '';
        $result = $_d->sql_query($sql,true);

        $EXCEL_STR = "
        <table border='1'>
        <tr>
           <td>계정</td>
           <td>연락처</td>
           <td>현황</td>
           <td>상태</td>
        </tr>";

        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
            $EXCEL_STR .= "
           <tr>
               <td>".$row['USER_NM']."(".$row['NICK_NM'].")".$row['USER_ID']."</td>
               <td>".$row['PHONE_2']."</td>
               <td>".$row['BABY_CNT']."</td>
               <td>".($row['USER_GB'] == "C" ? "" : $row['USER_GB'] == "S" ? "서포터즈" : "일반")."</td>
           </tr>
           ";
        }

        $EXCEL_STR .= "</table>";
    } else if ($_type == "order") {
        $filename = "주문 목록";

        if ($_search[CHECKED] == "C") {
            MtUtil::_d($_search.CHECKED);
            if (isset($_search[ORDER_NO_LIST])) {
                MtUtil::_d($_search.CHECKED);
                $in_str = "";
                $in_size = sizeof($_search[ORDER_NO_LIST]);
                for ($i=0; $i< $in_size; $i++) {
                    $in_str .= "'".trim($_search[ORDER_NO_LIST][$i])."'";
                    if ($in_size - 1 != $i) $in_str .= ",";
                }

                $search_where = "AND AC.NO IN (".$in_str.") ";
            }
        } else {
            if (isset($_search[CONDITION]) && $_search[CONDITION] != "") {
                if ($_search[CONDITION][index] == 1 && isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
                    $search_where .= "AND AC.".$_search[CONDITION][value]." LIKE '".$_search[KEYWORD]."%' ";
                } else if ($_search[CONDITION][index] == 2 && isset($_search[START_YMD]) && isset($_search[END_YMD])) {
                    $search_where .= "AND DATE_FORMAT(AC.ORDER_DT, '%Y-%m-%d') BETWEEN '".$_search[START_YMD]."' AND '".$_search[END_YMD]."'";
                }
            }
            if (isset($_search[ORDER_GB]) && $_search[ORDER_GB] != "") {
                $search_where .= "AND AC.ORDER_GB = '".$_search[ORDER_GB][value]."' ";
            }
            if (isset($_search[ORDER_ST]) && $_search[ORDER_ST] != "") {
                $search_where .= "AND AC.ORDER_ST = '".$_search[ORDER_ST][value]."' ";
            }
        }

        if (isset($_search[SORT]) && $_search[SORT] != "") {
            $sort_order .= "ORDER BY ".$_search[SORT][value]." ".$_search[ORDER][value]." ";
        }

        $sql = "SELECT
                    NO, PRODUCT_CNT, SUM_PRICE, RECEIPTOR_NM, RECEIPT_ADDR, RECEIPT_ADDR_DETAIL, RECEIPT_PHONE, PRODUCT_NO, USER_ID, DATE_FORMAT(ORDER_DT, '%Y-%m-%d') AS ORDER_YMD, PAY_GB, DATE_FORMAT(PAY_DT, '%Y-%m-%d') AS PAY_YMD,
                    CASE ORDER_ST when 0 then '결제완료' when 1 then '주문접수' when 2 then '상품준비중' when 3 then '배송중' when 4 then '배송완료' when 5 then '주문취소' ELSE '환불/교환' end AS ORDER_ST_NM,
                    PRODUCT_NM, PRODUCT_GB, PRICE, ORDER_GB, ORDER_ST, REQUEST_NOTE,
                    CASE PROGRESS_ST WHEN 1 THEN '접수완료' WHEN 2 THEN '처리중' WHEN 3 THEN '처리완료' ELSE '' END AS PROGRESS_ST_NM, PARENT_NO, PARENT_PRODUCT_NM, PRODUCT_CODE
                FROM
                (
                    SELECT
                        AC.NO, AC.PRODUCT_CNT, AC.SUM_PRICE, AC.RECEIPTOR_NM, AC.RECEIPT_ADDR, AC.RECEIPT_ADDR_DETAIL, AC.RECEIPT_PHONE, AC.PRODUCT_NO,
                        AC.USER_ID, AC.ORDER_GB, AP.PRODUCT_NM, AP.PRODUCT_GB, AP.PRICE, AC.ORDER_DT, AC.ORDER_ST, AC.REQUEST_NOTE,
                        (SELECT PROGRESS_ST FROM ANGE_ORDER_COUNSEL WHERE PRODUCT_NO = AC.PRODUCT_NO AND PRODUCT_CODE = AC.PRODUCT_CODE) AS PROGRESS_ST, AP.PARENT_NO,
                        (SELECT PRODUCT_NM FROM ANGE_PRODUCT WHERE NO = AP.PARENT_NO) AS PARENT_PRODUCT_NM, PRODUCT_CODE, AC.PAY_GB, AC.PAY_DT
                    FROM
                        ANGE_ORDER AC
                    LEFT OUTER JOIN ANGE_PRODUCT AP
                        ON AC.PRODUCT_NO = AP.NO
                    WHERE  1 = 1
                        ".$search_where."
                    ".$sort_order."
                ) AS DATA
                ";

        $__trn = '';
        $result = $_d->sql_query($sql,true);

        $EXCEL_STR = "
            <table border='1'>
            <tr>
               <td>주문일</td>
               <td>주문자ID</td>
               <td>받는사람</td>
               <td>상품명</td>
               <td>수량</td>
               <td>총합계</td>
               <td>주소</td>
               <td>상세주소</td>
               <td>받는사람 연락처</td>
               <td>메모</td>
               <td>상태</td>
            </tr>";

        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
            $EXCEL_STR .= "
               <tr>
                   <td>".$row['ORDER_YMD']."</td>
                   <td>".$row['USER_ID']."</td>
                   <td>".$row['RECEIPTOR_NM']."</td>
                   <td>".$row['PRODUCT_NM']."</td>
                   <td>".$row['PRODUCT_CNT']."</td>
                   <td>".$row['SUM_PRICE']."</td>
                   <td>".$row['RECEIPT_ADDR']."</td>
                   <td>".$row['RECEIPT_ADDR_DETAIL']."</td>
                   <td>".$row['RECEIPT_PHONE']."</td>
                   <td>".$row['REQUEST_NOTE']."</td>
                   <td>".$row['ORDER_ST_NM']."</td>
               </tr>
               ";
        }

        $EXCEL_STR .= "</table>";
    }

//    $EXCEL_STR = $_data;

    ob_end_clean();

//    header( "Content-type: application/vnd.ms-excel" );
    header( "Content: application/vnd.ms-excel; charset=utf-8");
    header( "Content-Disposition: attachment; filename = ".$filename."_".date('Y-m-d').".xls" );
    header( "Content-Description: PHP4 Generated Data" );

    echo "<meta content=\"application/vnd.ms-excel; charset=utf-8\" name=\"Content-type\"> ";
    echo $EXCEL_STR;
?>