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

    $sql1 = "select
                e.EQ_ID AS USER_ID, EQ_PASS AS PASSWORD, e.EQ_MOM AS USER_NM, EQ_NICKNAME AS NICK_NM, '0' AS LUNAR_FL, REPLACE(EQ_BIRTH, '-', '') AS BIRTH, REPLACE(EQ_POST, ', ', '') AS ZIP_CODE, EQ_ADD1 AS ADDR, EQ_ADD2 AS ADDR_DETAIL,
                EQ_PH1 + '-' + EQ_PH2 + '-' + EQ_PH3 AS PHONE_1, EQ_HP1 + '-' + EQ_HP2 + '-' + EQ_HP3 AS PHONE_2, EQ_EMAIL AS EMAIL,
                CASE WHEN eq_date IS NULL THEN NULL WHEN LEN(eq_date) < 21 THEN eq_date ELSE convert(varchar(19), convert(datetime,  left(eq_date,charindex(' ',eq_date,1)-1)+ ' '+ right(eq_date,charindex(' ',reverse(eq_date),1)-1)+ case when charindex('오전',eq_date,1) > 0 then 'AM' else 'PM' end), 120) END AS REG_DT,
                CASE WHEN eq_lastdate IS NULL THEN NULL WHEN LEN(eq_lastdate) < 21 THEN eq_lastdate ELSE convert(varchar(19), convert(datetime,  left(eq_lastdate,charindex(' ',eq_lastdate,1)-1)+ ' '+ right(eq_lastdate,charindex(' ',reverse(eq_lastdate),1)-1)+ case when charindex('오전',eq_lastdate,1) > 0 then 'AM' else 'PM' end), 120) END AS FILAL_LOGIN_DT,
                EQ_COUNT AS CENTER_CNT, 'M' AS SEX_GB,
                CASE EQ_EN_FLAG WHEN 'Y' THEN 'Y' ELSE 'N' END AS EN_FL,
                CASE EQ_EN_EMAIL_FLAG WHEN 'OK' THEN 'Y' ELSE 'N' END AS EN_EMAIL_FL,
                CASE EQ_EN_SMS_FLAG WHEN 'OK' THEN 'Y' ELSE 'N' END AS EN_SMS_FL,
                DATAPOINT AS SUM_POINT, EQ_MEMBER_NAME AS CONTACT_NM, e.EQ_IDX AS MIG_NO, REPLACE(EQ_HAPPY_DAY, '.', '') AS BABY_BIRTH_DT,
                EQ_HAPPY_HOUSE AS CARE_CENTER, REPLACE(EQ_VISI_DAY, '.', '-') AS CENTER_VISIT_YMD, REPLACE(EQ_EN_DAY, '.', '-') AS CENTER_OUT_YMD, EQ_ETC AS NOTE, IP, 'CLUB' AS USER_GB,
                EQ_CHILD1 AS BABY_BIRTH1, EQ_BABYNAME AS BABY_NM1, EQ_CHILD1_SEX AS BABY_SEX_GB1, EQ_CHILD2 AS BABY_BIRTH2, EQ_CHILD2_NAME AS BABY_NM2, EQ_CHILD2_SEX AS BABY_SEX_GB2, EQ_CHILD3 AS BABY_BIRTH3, EQ_CHILD3_NAME AS BABY_NM3, EQ_CHILD3_SEX AS BABY_SEX_GB3,
                EQ_BLOG AS BLOG_URL, EQ_BLOGCATE AS THEME, EQ_BLOGCATEETC, EQ_SNS AS SNS, EQ_BLOGSTEP AS PHASE
            from (
                select max(eq_idx) as eq_idx, eq_id, eq_mom from eqmom group by eq_id, eq_mom having count(*) > 1
            ) data, eqmom e
            where eq_idx = '102872'
            --where data.eq_idx = e.eq_idx
--                and e.eq_idx between '222594' and '223530'
--                and e.eq_idx between '222611' and '223530'
            order by e.eq_idx, eq_date asc
            ";

//    $result = $_a->sql_query($sql1,true);
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
                    'F',
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