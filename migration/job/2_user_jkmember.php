<?php
//	header("Content-Type: text/html; charset=UTF-8");
//	header("Expires: 0");
//	header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
//	header("Cache-Control: no-store, no-cache, must-revalidate");
//	header("Cache-Control: pre-check=0, post-check=0, max-age=0");
//	header("Pragma: no-cache");
    Header("Content-type: text/html;Charset:UTF-8");

    @session_start();

    @extract($_GET);
    @extract($_POST);
    @extract($_SERVER);

    date_default_timezone_set('Asia/Seoul');

	include_once("D:/xampp/htdocs/ange/migration/classes/ImportClasses.php");
    include_once("D:/xampp/htdocs/ange/migration/passwordHash.php");

    MtUtil::_c("### [START]");

    $_a = new MtMssqlData();
    $_t = new MtMysqlData();

    $prefix = "";

    if ($_a->connect_db == "") {
        MtUtil::_c("AS-IS DB 연결 실패.");
    }

    if ($_t->connect_db == "") {
        MtUtil::_c("TO-BE DB 연결 실패.");
    }

    $sql = "SELECT
                DATAID AS USER_ID, DATAPW AS PASSWORD, DATANAME AS USER_NM, NICKNAME AS NICK_NM, CASE DATABIRTHL WHEN 'l' THEN '1' ELSE '0' END AS LUNAR_FL, REPLACE(DATABIRTH, '-', '') AS BIRTH, DATAZIP AS ZIP_CODE, DATAADDRESS1 AS ADDR, REPLACE(DATAADDRESS2, '\', '') AS ADDR_DETAIL,
                DATAPHONE1 AS PHONE_1, DATAPHONE2 AS PHONE_2, DATAEMAIL AS EMAIL,
                '0' AS CENTER_CNT, CASE DATASEX WHEN '0' THEN 'F' ELSE 'M' END AS SEX_GB,
                CASE WHEN DATADATE IS NULL THEN NULL WHEN LEN(DATADATE) < 21 THEN DATADATE ELSE convert(varchar(19), convert(datetime,  left(DATADATE,charindex(' ',DATADATE,1)-1)+ ' '+ right(DATADATE,charindex(' ',reverse(DATADATE),1)-1)+ case when charindex('오전',DATADATE,1) > 0 then 'AM' else 'PM' end), 120) END AS REG_DT,
                CASE WHEN DATALAST IS NULL THEN NULL WHEN LEN(DATALAST) < 21 THEN DATALAST ELSE convert(varchar(19), convert(datetime,  left(DATALAST,charindex(' ',DATALAST,1)-1)+ ' '+ right(DATALAST,charindex(' ',reverse(DATALAST),1)-1)+ case when charindex('오전',DATALAST,1) > 0 then 'AM' else 'PM' end), 120) END AS FILAL_LOGIN_DT,
                CASE DATAFLAGEMAIL WHEN '수신' THEN 'Y' ELSE 'N' END AS EN_FL,
                CASE DATAFLAGEMAIL WHEN '수신' THEN 'Y' ELSE 'N' END AS EN_EMAIL_FL,
                CASE DATAFLAGEMAIL WHEN '수신' THEN 'Y' ELSE 'N' END AS EN_SMS_FL,
                DATAPOINT AS SUM_POINT, '' AS CONTACT_NM, DATASERIAL AS MIG_NO, REPLACE(DATAPREG_DATE, '-', '') AS BABY_BIRTH_DT,
                '' AS CARE_CENTER, '' AS CENTER_VISIT_YMD, '' AS CENTER_OUT_YMD, ETC AS NOTE, IP, 'MEMBER' AS USER_GB,
                REPLACE(DATACHILDBIRTH1, '-', '') AS BABY_BIRTH1, DATACHILDNAME1 AS BABY_NM1, DATACHILDSEX1 AS BABY_SEX_GB1, REPLACE(DATACHILDBIRTH2, '-', '') AS BABY_BIRTH2, DATACHILDNAME2 AS BABY_NM2, DATACHILDSEX2 AS BABY_SEX_GB2, REPLACE(DATACHILDBIRTH3, '-', '') AS BABY_BIRTH3, DATACHILDNAME3 AS BABY_NM3, DATACHILDSEX3 AS BABY_SEX_GB3,
                DATABLOG AS BLOG_URL, DATABLOGCATE AS THEME, DATABLOGCATEETC, DATASNS AS SNS, DATABLOGSTEP AS PHASE
            FROM JKMEMBER
            where dataserial between 183783 and 184987
              --dataid not in (select dataid from jkmember j, eqmom e where j.dataid = e.eq_id and j.dataname = e.eq_mom)
              --and dataserial between 130664 and 183750
              order by dataserial asc
            ";

//    $result = $_a->sql_query($sql,true);
//    MtUtil::_c($i."################################### [COUNT] ".count($result));

    for ($i=0; $row=$_a->sql_fetch_array($result); $i++) {
        $err = 0;
        $msg = null;

        $user_info = " [[USER_INFO]] >> [EQ_IDX] ".$row['MIG_NO'].", [USER_ID] ".$row['USER_ID'].", [USER_NM] ".$row['USER_NM']
                     ." [[USER_BABY1]] >> [BABY_NM] ".$row['BABY_NM1'].", [BABY_BIRTH] ".$row['BABY_BIRTH1'].", [BABY_SEX_GB] ".$row['BABY_SEX_GB1']
                     ." [[USER_BABY2]] >> [BABY_NM] ".$row['BABY_NM2'].", [BABY_BIRTH] ".$row['BABY_BIRTH2'].", [BABY_SEX_GB] ".$row['BABY_SEX_GB2']
                     ." [[USER_BABY3]] >> [BABY_NM] ".$row['BABY_NM3'].", [BABY_BIRTH] ".$row['BABY_BIRTH3'].", [BABY_SEX_GB] ".$row['BABY_SEX_GB3']
                     ." [[USER_BLOG]] >> [BLOG_URL] ".$row['BLOG_URL'].", [PHASE] ".$row['PHASE'].", [THEME] ".$row['THEME'].", [SNS] ".$row['SNS'];

//        MtUtil::_c($i.$user_info);

//        $_t->sql_query("INSERT INTO MIG_USER_INFO (USER_ID, MIG_NO, MIG_DT, MIG_ST) VALUES ('".$row['USER_ID']."', '".$row['MIG_NO']."', SYSDATE(), '0')");
//        $no = $_t->mysql_insert_id;

        $_t->sql_beginTransaction();

        $password = $hash = create_hash($row['PASSWORD']);

        $sql = "INSERT INTO ".$prefix."COM_USER
                (
                    USER_ID,
                    USER_NM,
                    NICK_NM,
                    PASSWORD,
                    LUNAR_FL,
                    BIRTH,
                    ZIP_CODE,
                    ADDR,
                    ADDR_DETAIL,
                    PHONE_1,
                    PHONE_2,
                    USER_GB,
                    USER_ST,
                    EMAIL,
                    SEX_GB,
                    NOTE,
                    CONTACT_NM,
                    CARE_CENTER,
                    CENTER_VISIT_YMD,
                    CENTER_OUT_YMD,
                    CENTER_CNT,
                    EN_FL,
                    EN_ANGE_EMAIL_FL,
                    EN_ANGE_SMS_FL,
                    EN_ALARM_EMAIL_FL,
                    EN_ALARM_SMS_FL,
                    EN_STORE_EMAIL_FL,
                    EN_STORE_SMS_FL,
                    REG_DT,
                    SUM_POINT,
                    REMAIN_POINT,
                    IP,
                    MIG_NO,
                    CERT_GB
                ) VALUES (
                    '".$row['USER_ID']."',
                    '".$row['USER_NM']."',
                    '".$row['NICK_NM']."',
                    '".$password."',
                    '".$row['LUNAR_FL']."',
                    '".$row['BIRTH']."',
                    '".$row['ZIP_CODE']."',
                    '".$row['ADDR']."',
                    '".$row['ADDR_DETAIL']."',
                    '".$row['PHONE_1']."',
                    '".$row['PHONE_2']."',
                    '".$row['USER_GB']."',
                    'W',
                    '".$row['EMAIL']."',
                    '".$row['SEX_GB']."',
                    '".$row['NOTE']."',
                    '".$row['CONTACT_NM']."',
                    '".$row['CARE_CENTER']."',
                    '".$row['CENTER_VISIT_YMD']."',
                    '".$row['CENTER_OUT_YMD']."',
                    '".$row['CENTER_CNT']."',
                    '".$row['EN_FL']."',
                    '".$row['EN_EMAIL_FL']."',
                    '".$row['EN_SMS_FL']."',
                    '".$row['EN_EMAIL_FL']."',
                    '".$row['EN_SMS_FL']."',
                    '".$row['EN_EMAIL_FL']."',
                    '".$row['EN_SMS_FL']."',
                    '".$row['REG_DT']."',
                    '".$row['SUM_POINT']."',
                    '".$row['SUM_POINT']."',
                    '".$row['IP']."',
                    '".$row['MIG_NO']."',
                    'MIG'
                )";

        $_t->sql_query($sql);
        if($_t->mysql_errno > 0) {
            $err++;
            $msg .= $_t->mysql_error;
        }

        $_t->sql_query("INSERT INTO ".$prefix."USER_ROLE(ROLE_ID, USER_ID, REG_DT) VALUES ('MEMBER', '".$row['USER_ID']."', SYSDATE())");

        if($_t->mysql_errno > 0) {
            $err++;
            $msg .= $_t->mysql_error;
        }

        if (!empty($row['BABY_BIRTH1']) && $row['BABY_BIRTH1'] != "") {
            $baby_birth = null;
            $baby_birth = str_replace("-", "", $row['BABY_BIRTH1']);
            $baby_birth = str_replace(".", "", $baby_birth);

            if (strlen($baby_birth) == 4) {
                $baby_birth = "0000".$baby_birth;
            } else if (strlen($baby_birth) == 6) {
                $baby_birth = "20".$baby_birth;
            }

            $sql = "INSERT INTO ".$prefix."ANGE_USER_BABY
                    (
                        USER_ID
                        ,BABY_NM
                        ,BABY_BIRTH
                        ,BABY_SEX_GB
                    ) VALUES (
                        '".$row['USER_ID']."'
                        ,'".$row['BABY_NM1']."'
                        ,'".$baby_birth."'
                        ,'".( $row['BABY_SEX_GB1'] == "남" ? "M" : 'F' )."'
                    )";

            $_t->sql_query($sql);

            if($_t->mysql_errno > 0) {
                $err++;
                $msg .= $_t->mysql_error;
            }
        }

        if (!empty($row['BABY_BIRTH2']) && $row['BABY_BIRTH2'] != "") {
            $baby_birth = null;
            $baby_birth = str_replace("-", "", $row['BABY_BIRTH2']);
            $baby_birth = str_replace(".", "", $baby_birth);

            if (strlen($baby_birth) == 4) {
                $baby_birth = "0000".$baby_birth;
            } else if (strlen($baby_birth) == 6) {
                $baby_birth = "20".$baby_birth;
            }

            $sql = "INSERT INTO ".$prefix."ANGE_USER_BABY
                    (
                        USER_ID
                        ,BABY_NM
                        ,BABY_BIRTH
                        ,BABY_SEX_GB
                    ) VALUES (
                        '".$row['USER_ID']."'
                        ,'".$row['BABY_NM2']."'
                        ,'".$baby_birth."'
                        ,'".( $row['BABY_SEX_GB2'] == "남" ? "M" : 'F' )."'
                    )";

            $_t->sql_query($sql);

            if($_t->mysql_errno > 0) {
                $err++;
                $msg .= $_t->mysql_error;
            }
        }

        if (!empty($row['BABY_BIRTH3']) && $row['BABY_BIRTH3'] != "") {
            $baby_birth = null;
            $baby_birth = str_replace("-", "", $row['BABY_BIRTH3']);
            $baby_birth = str_replace(".", "", $baby_birth);

            if (strlen($baby_birth) == 4) {
                $baby_birth = "0000".$baby_birth;
            } else if (strlen($baby_birth) == 6) {
                $baby_birth = "20".$baby_birth;
            }

            $sql = "INSERT INTO ".$prefix."ANGE_USER_BABY
                    (
                        USER_ID
                        ,BABY_NM
                        ,BABY_BIRTH
                        ,BABY_SEX_GB
                    ) VALUES (
                        '".$row['USER_ID']."'
                        ,'".$row['BABY_NM3']."'
                        ,'".$baby_birth."'
                        ,'".( $row['BABY_SEX_GB3'] == "남" ? "M" : 'F' )."'
                    )";

            $_t->sql_query($sql);

            if($_t->mysql_errno > 0) {
                $err++;
                $msg .= $_t->mysql_error;
            }
        }

        if (isset($row['BLOG_URL']) && $row['BLOG_URL'] != "") {

            $blog_theme = "";
            if ($row['THEME'] != null && $row['THEME'] != "") {
                $arr_blogCate = explode(",", $row['THEME']);
                for ($j=0; $j< sizeof($arr_blogCate); $j++) {
//                $blog_theme .= "'".trim($arr_blogCate[$i])."'";
                    if (trim($arr_blogCate[$j]) == "일상/생각") $blog_theme .= "1";
                    else if (trim($arr_blogCate[$j]) == "육아") $blog_theme .= "2";
                    else if (trim($arr_blogCate[$j]) == "요리/레시피") $blog_theme .= "3";
                    else if (trim($arr_blogCate[$j]) == "상품리뷰") $blog_theme .= "4";
                    else if (trim($arr_blogCate[$j]) == "맛집") $blog_theme .= "5";
                    else if (trim($arr_blogCate[$j]) == "문학/책") $blog_theme .= "6";
                    else if (trim($arr_blogCate[$j]) == "홈스쿨링") $blog_theme .= "7";
                    else if (trim($arr_blogCate[$j]) == "문화생활") $blog_theme .= "8";
                    else if (trim($arr_blogCate[$j]) == "인테리어/DIY") $blog_theme .= "9";

                    if (sizeof($arr_blogCate) - 1 != $j) $blog_theme .= ",";
                }
            }

            if ($row['EQ_BLOGCATEETC'] != null && $row['EQ_BLOGCATEETC'] != "") {
                $blog_theme .= ",10,".$row['EQ_BLOGCATEETC'];
            }

            $sql = "INSERT INTO ".$prefix."ANGE_USER_BLOG
                    (
                        USER_ID
                        ,BLOG_URL
                        ,PHASE
                        ,THEME
                        ,NEIGHBOR_CNT
                        ,POST_CNT
                        ,VISIT_CNT
                        ,SNS
                    ) VALUES (
                        '".$row['USER_ID']."'
                        ,'".$row['BLOG_URL']."'
                        ,'".$row['PHASE']."'
                        ,'".$blog_theme."'
                        ,'0'
                        ,'0'
                        ,'0'
                        ,'".$row['SNS']."'
                    )";

            $_t->sql_query($sql);

            if($_t->mysql_errno > 0) {
                $err++;
                $msg .= $_t->mysql_error;
            }
        }

        if($err > 0) {
            MtUtil::_c($i."> [ERROR] ".$_t->mysql_error);
            $_t->sql_rollback();
//            $_t->sql_query("UPDATE MIG_USER_INFO SET MIG_ST = '1', MIG_MSG = '".$msg."' WHERE NO = ".$no);
        } else {
            MtUtil::_c($i."> [SUCCESS] ");
            $_t->sql_commit();
//            $_t->sql_query("UPDATE MIG_USER_INFO SET MIG_ST = '2' WHERE NO = ".$no);
        }
    }

    MtUtil::_c("### [END]");
?>