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

    $_d = new MtJson();

    $where_search = "";

    if (isset($_search[JOIN_PATH]) && $_search[JOIN_PATH] != "") {
        $where_search .= "AND U.JOIN_PATH  = '".$_search[JOIN_PATH]."' ";
    }
    if (isset($_search[ROLE]) && $_search[ROLE] != "") {
        $where_search .= "AND R.ROLE_ID  = '".$_search[ROLE][ROLE_ID]."' ";
    }
    if (isset($_search[ROLE_ID]) && $_search[ROLE_ID] != "") {
        $where_search .= "AND R.ROLE_ID  = '".$_search[ROLE_ID]."' ";
    }
    if (isset($_search[KEYWORD]) && $_search[KEYWORD] != "") {
        $where_search .= "AND U.USER_NM LIKE '%".$_search[KEYWORD]."%' ";
    }

    $sql = "SELECT
                TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                USER_ID, USER_NM, NICK_NM, ZIP_CODE, ADDR, ADDR_DETAIL, PHONE_1, PHONE_2, EMAIL, SEX_GB, USER_ST, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT, DATE_FORMAT(FINAL_LOGIN_DT, '%Y-%m-%d') AS FINAL_LOGIN_DT, NOTE,
                PREGNENT_FL, BLOG_FL, JOIN_PATH, CONTACT_ID, CARE_CENTER, CENTER_VISIT_DT, CENTER_OUT_DT, EN_FL, EN_EMAIL_FL, EN_POST_FL, EN_SNS_FL, EN_PHONE_FL,
                ROLE_ID, ROLE_NM
            FROM
            (
                SELECT
                    U.USER_ID, U.USER_NM, U.NICK_NM, U.ZIP_CODE, U.ADDR, U.ADDR_DETAIL, U.PHONE_1, U.PHONE_2, U.EMAIL, U.SEX_GB, U.USER_ST, U.REG_DT, U.FINAL_LOGIN_DT, U.NOTE,
                    U.PREGNENT_FL, U.BLOG_FL, U.JOIN_PATH, U.CONTACT_ID, U.CARE_CENTER, U.CENTER_VISIT_DT, U.CENTER_OUT_DT, U.EN_FL, U.EN_EMAIL_FL, U.EN_POST_FL, U.EN_SNS_FL, U.EN_PHONE_FL,
                    R.ROLE_ID, (SELECT ROLE_NM FROM CMS_ROLE WHERE ROLE_ID = R.ROLE_ID) AS ROLE_NM
                FROM
                  COM_USER U, USER_ROLE R
                WHERE
                    U.USER_ID = R.USER_ID
                    ".$where_search."
            ) AS DATA,
            (SELECT @RNUM := 0) R,
            (
                SELECT
                    COUNT(*) AS TOTAL_COUNT
                FROM
                    COM_USER U, USER_ROLE R
                WHERE
                    U.USER_ID = R.USER_ID
                    ".$where_search."
            ) CNT
            ";
    $__trn = '';
    $result = $_d->sql_query($sql,true);

    $EXCEL_STR = "
    <table border='1'>
    <tr>
       <td>사용자 ID</td>
       <td>사용자명</td>
       <td>별명</td>
    </tr>";

    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
        $EXCEL_STR .= "
       <tr>
           <td>".$row['USER_ID']."</td>
           <td>".$row['USER_NM']."</td>
           <td>".$row['NICK_NM']."</td>
       </tr>
       ";
    }

    $EXCEL_STR .= "</table>";

    ob_end_clean();

    header( "Content-type: application/vnd.ms-excel" );
    header( "Content-type: application/vnd.ms-excel; charset=utf-8");
    header( "Content-Disposition: attachment; filename = invoice.xls" );
    header( "Content-Description: PHP4 Generated Data" );

    echo "<meta content=\"application/vnd.ms-excel; charset=UTF-8\" name=\"Content-type\"> ";
    echo $EXCEL_STR;
?>