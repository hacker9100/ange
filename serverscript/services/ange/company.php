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
$_d = new MtJson(null);

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

            $err = 0;
            $msg = "";

            $sql = "SELECT
                        NO, CATEGORY_GB, AFFILIATE_GB, COMPANY_GB, COMPANY_NM, CHARGE_NM, URL, EMAIL, PHONE_1, PHONE_2, NOTE, COMPANY_AGREE_YN
                    FROM
                        ANGE_COMPANY
                    WHERE
                        NO = ".$_key."
                        ".$search_where."
                    ";

            $data = $_d->sql_fetch($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE
                    WHERE
                        TARGET_GB = 'COMPANY'
                        AND TARGET_NO = ".$_key."
                    ";

            $file_data = $_d->sql_fetch($sql);
            $data['FILE'] = $file_data;

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
            $search_where = "";
            $sort_order = "";
            $limit = "";

            if (isset($_search['KEYWORD']) && $_search['KEYWORD'] != "") {
                $search_where .= "AND ".$_search['CONDITION']['value']." LIKE '%".$_search['KEYWORD']."%'";
            }

            if (isset($_search['COMPANY_GB']) && $_search['COMPANY_GB'] != "") {
                $search_where .= "AND COMPANY_GB = '".$_search['COMPANY_GB']."'";
            }

            if (isset($_search['SORT']) && $_search['SORT'] != "") {
                $sort_order .= "ORDER BY ".$_search['SORT']." ".$_search['ORDER']." ";
            }

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page['NO'] * $_page['SIZE']).", ".$_page['SIZE'];
            }

            $sql = "SELECT
                        TOTAL_COUNT, @RNUM := @RNUM + 1 AS RNUM,
                        NO, CATEGORY_GB, AFFILIATE_GB, COMPANY_GB, COMPANY_NM, CHARGE_NM, URL, EMAIL, PHONE_1, PHONE_2, NOTE, COMPANY_AGREE_YN
                    FROM (
                        SELECT
                            NO, CATEGORY_GB, AFFILIATE_GB, COMPANY_GB, COMPANY_NM, CHARGE_NM, URL, EMAIL, PHONE_1, PHONE_2, NOTE, COMPANY_AGREE_YN
                        FROM
                            ANGE_COMPANY
                        WHERE 1 =1
                            ".$search_where."
                            ".$sort_order."
                        ".$limit."
                    ) AS DATA,
                    (SELECT @RNUM := 0) R,
                    (
                        SELECT COUNT(*) AS TOTAL_COUNT
                        FROM
                            ANGE_COMPANY
                        WHERE 1 =1
                            ".$search_where."
                    ) CNT
                        ";

            $__trn = '';
            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                $sql = "SELECT
                            NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                        FROM
                            COM_FILE
                        WHERE
                            TARGET_GB = 'COMPANY'
                            AND TARGET_NO = ".$row['NO']."
                            AND THUMB_FL = '0'
                        ";

                $file_data = $_d->sql_fetch($sql);
                $row['FILE'] = $file_data;

                $__trn->rows[$i] = $row;
            }
            $_d->sql_free_result($result);
            $data = $__trn->{'rows'};

            if($_d->mysql_errno > 0){
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            }else{
                $_d->dataEnd2($data);
            }
        }

        break;

    case "POST":
//            $form = json_decode(file_get_contents("php://input"),true);

        $upload_path = '../../../upload/files/';
        $file_path = '/storage/company/';
        $source_path = '../../..'.$file_path;
        $insert_path = null;

        $file_name = null;

        try {
            if (count($_model['FILE']) > 0) {
                $file = $_model['FILE'];
                $file_name = $file['name'];
                if (!file_exists($source_path) && !is_dir($source_path)) {
                    @mkdir($source_path);
                }

                if (file_exists($upload_path.$file['name'])) {
                    $uid = uniqid();
                    copy($upload_path.$file['name'], $source_path.$uid);
                    $insert_path = array(path => $file_path, uid => $uid, kind => $file['kind']);

                    MtUtil::_d("------------>>>>> mediumUrl : ".$i.'--'.$insert_path['path']);
                }
            }
        } catch(Exception $e) {
            $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
            break;
        }

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        $sql = "INSERT INTO ANGE_COMPANY
                (
                    CATEGORY_GB,
                    AFFILIATE_FL,
                    AFFILIATE_GB,
                    COMPANY_GB,
                    COMPANY_NM,
                    CHARGE_NM,
                    URL,
                    EMAIL,
                    PHONE_1,
                    PHONE_2,
                    NOTE,
                    COMPANY_AGREE_YN,
                    REG_DT
                ) VALUES (
                    '".$_model['CATEGORY_GB']."',
                    '".$_model['AFFILIATE_FL']."',
                    '".$_model['AFFILIATE_GB']."',
                    '".$_model['COMPANY_GB']."',
                    '".$_model['COMPANY_NM']."',
                    '".$_model['CHARGE_NM']."',
                    '".$_model['URL']."',
                    '".$_model['EMAIL']."',
                    '".$_model['PHONE_1']."',
                    '".$_model['PHONE_2']."',
                    '".$_model['NOTE']."',
                    'Y',
                    SYSDATE()
                )";

        $_d->sql_query($sql);
        $no = $_d->mysql_insert_id;

        if($_d->mysql_errno > 0) {
            $err++;
            $msg = $_d->mysql_error;
        }

        if (isset($_model['FILE']) && $_model['FILE'] != "") {
            $file = $_model['FILE'];

            MtUtil::_d("------------>>>>> file : ".$file['name']);

            /*if($file['kind'] != 'MAIN'){
                $_d->failEnd("대표이미지를 선택하세요.");
            }*/

            $sql = "INSERT INTO COM_FILE
                    (
                        FILE_NM
                        ,FILE_ID
                        ,PATH
                        ,FILE_EXT
                        ,FILE_SIZE
                        ,THUMB_FL
                        ,REG_DT
                        ,FILE_ST
                        ,FILE_GB
                        ,FILE_ORD
                        ,TARGET_NO
                        ,TARGET_GB
                    ) VALUES (
                        '".$file['name']."'
                        , '".$insert_path['uid']."'
                        , '".$insert_path['path']."'
                        , '".$file['type']."'
                        , '".$file['size']."'
                        , '0'
                        , SYSDATE()
                        , 'C'
                        , '".$file['kind']."'
                        , '0'
                        , '".$no."'
                        , 'COMPANY'
                    )";

            $_d->sql_query($sql);

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }
        }

        MtUtil::_d("------------>>>>> mysql_errno : ".$_d->mysql_errno);

        if ($_model['COMPANY_GB'] == "AFFILIATE") {
            $from_email = $to = __SMTP_USR__;
            $from_user = $to_user = __SMTP_USR_NM__;
            $aff_gb = "월간 앙쥬(잡지) 광고 문의";

            if ($_model['AFFILIATE_GB'] == "MAGAZINE") {
                $to = "ange@ange.co.kr";
                $aff_gb = "월간 앙쥬(잡지) 광고 문의";
            } else if ($_model['AFFILIATE_GB'] == "ONLINE") {
                $aff_gb = "온라인 광고 및 제휴 문의";
            } else if ($_model['AFFILIATE_GB'] == "EVENT") {
                $to = "ange@ange.co.kr";
                $aff_gb = "체험단 및 이벤트/공동구매 문의";
            } else if ($_model['AFFILIATE_GB'] == "STORE") {
                $to = "ange@ange.co.kr";
                $aff_gb = "스토어 판매 관련 문의";
            }

//            $from_email = $_model['EMAIL'];
//            $from_user = $_model['CHARGE_NM'];

//            $from_email = __SMTP_USR__;
//            $from_user = __SMTP_USR_NM__;
//            $to = $_model['EMAIL'];
//            $to_user = $_model['CHARGE_NM'];
            $subject = $_model['COMPANY_NM']."의 제휴&광고문의 입니다.";
            $message = "안녕하세요. ".$_model['COMPANY_NM']."의 제휴&광고문의 내용입니다.".
                        "<br>광고구분 : ".$aff_gb.
                        "<br>기업명 : ".$_model['COMPANY_NM'].
                        "<br>담당자 : ".$_model['COMPANY_NM'].
                        "<br>홈페이지 : ".$_model['URL'].
                        "<br>유선전화 : ".$_model['PHONE_1'].
                        "<br>휴대폰 : ".$_model['PHONE_2'].
                        "<br>내용 : ".str_replace("\n", "<br />", $_model['NOTE']);

            $result = MtUtil::smtpMail($from_email, $from_user, $subject, $message, $to, $to_user, $file_name);

            if(!$result) {
                $err++;
                $msg = "메일발송에 실패했습니다.";
            }
        }

        if($err > 0) {
            $_d->sql_rollback();
            $_d->failEnd("등록실패입니다:".$msg);
        } else {
            $_d->sql_commit();
            $_d->succEnd($no);
        }

        break;

    case "PUT":

        if ($_type == 'item') {
            $upload_path = '../../../upload/files/';
            $file_path = '/storage/company/';
            $source_path = '../../..'.$file_path;
            $insert_path = null;

            try {
                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if (!file_exists($source_path) && !is_dir($source_path)) {
                        @mkdir($source_path);
                    }

                    if (file_exists($upload_path.$file['name'])) {
                        $uid = uniqid();
                        rename($upload_path.$file['name'], $source_path.$uid);
                        $insert_path = array(path => $file_path, uid => $uid, kind => $file['kind']);
                    } else {
                        $insert_path = array(path => '', uid => '', kind => '');
                    }
                }
            } catch(Exception $e) {
                $_d->failEnd("파일 업로드 중 오류가 발생했습니다.");
                break;
            }

            $err = 0;
            $msg = "";

            $_d->sql_beginTransaction();

            $sql = "UPDATE ANGE_COMPANY
                    SET
                        CATEGORY_GB = '".$_model['CATEGORY_GB']."'
                        ,AFFILIATE_FL = '".$_model['AFFILIATE_FL']."'
                        ,AFFILIATE_GB = '".$_model['AFFILIATE_GB']."'
                        ,COMPANY_GB = '".$_model['COMPANY_GB']."'
                        ,COMPANY_NM = '".$_model['COMPANY_NM']."'
                        ,CHARGE_NM= '".$_model['CHARGE_NM']."'
                        ,URL= '".$_model['URL']."'
                        ,EMAIL= '".$_model['EMAIL']."'
                        ,PHONE_1= '".$_model['PHONE_1']."'
                        ,PHONE_2= '".$_model['PHONE_2']."'
                        ,NOTE = '".$_model['NOTE']."'
                    WHERE
                        NO = '".$_key."'
                ";

            $_d->sql_query($sql);
            $no = $_d->mysql_insert_id;

            if($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            $sql = "SELECT
                        NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                    FROM
                        COM_FILE
                    WHERE
                        TARGET_GB = 'COMPANY'
                        AND TARGET_NO = ".$_key."
                    ";

            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                $is_delete = true;

                if (count($_model['FILE']) > 0) {
                    $file = $_model['FILE'];
                    if ($row['FILE_NM'] == $file['name'] && $row['FILE_SIZE'] == $file['size']) {
                        $is_delete = false;
                    }
                }

                if ($is_delete) {
                    MtUtil::_d("------------>>>>> DELETE NO : ".$row['NO']);
                    $sql = "DELETE COM_FROM FILE WHERE TARGET_GB = 'COMPANY' NO = ".$row['NO'];

                    $_d->sql_query($sql);

                    if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
                        unlink('../../..'.$row['PATH'].$row['FILE_ID']);
                    }
                }
            }

            if (count($_model['FILE']) > 0) {
                $file = $_model['FILE'];

                MtUtil::_d("------------>>>>> file : ".$file['name']);

                if ($insert_path['uid'] != "") {
                    $sql = "INSERT INTO COM_FILE
                            (
                                FILE_NM
                                ,FILE_ID
                                ,PATH
                                ,FILE_EXT
                                ,FILE_SIZE
                                ,THUMB_FL
                                ,REG_DT
                                ,FILE_ST
                                ,FILE_GB
                                ,FILE_ORD
                                ,TARGET_NO
                                ,TARGET_GB
                            ) VALUES (
                                '".$file['name']."'
                                , '".$insert_path['uid']."'
                                , '".$insert_path['path']."'
                                , '".$file['type']."'
                                , '".$file['size']."'
                                , '0'
                                , SYSDATE()
                                , 'C'
                                , '".$file['kind']."'
                                , '0'
                                , '".$_key."'
                                , 'COMPANY'
                            )";

                    $_d->sql_query($sql);
                    $file_no = $_d->mysql_insert_id;

                    if ($_d->mysql_errno > 0) {
                        $err++;
                        $msg = $_d->mysql_error;
                    }
                }
            }

            if($err > 0){
                $_d->sql_rollback();
                $_d->failEnd("수정실패입니다:".$msg);
            } else {
                $_d->sql_commit();
                $_d->succEnd($no);
            }
        }

        break;

    case "DELETE":
        if (!isset($_key) || $_key == '') {
            $_d->failEnd("삭제실패입니다:"."KEY가 누락되었습니다.");
        }

        $err = 0;
        $msg = "";

        $_d->sql_beginTransaction();

        $sql = "DELETE FROM ANGE_COMPANY WHERE NO = ".$_key;
        $_d->sql_query($sql);

        if ($_d->mysql_errno > 0) {
            $err++;
            $msg = $_d->mysql_error;
        }

        $sql = "SELECT
                    NO, FILE_NM, FILE_SIZE, FILE_ID, PATH, THUMB_FL, ORIGINAL_NO, DATE_FORMAT(REG_DT, '%Y-%m-%d') AS REG_DT
                FROM
                    COM_FILE
                WHERE
                    TARGET_GB = 'COMPANY'
                    AND TARGET_NO = ".$_key."
                ";

        $result = $_d->sql_query($sql,true);
        for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
            $sql = "DELETE FROM COM_FILE WHERE TARGET_GB = 'COMPANY' AND NO = ".$row['NO'];

            $_d->sql_query($sql);

            if ($_d->mysql_errno > 0) {
                $err++;
                $msg = $_d->mysql_error;
            }

            if (file_exists('../../..'.$row['PATH'].$row['FILE_ID'])) {
                unlink('../../..'.$row['PATH'].$row['FILE_ID']);
            }
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