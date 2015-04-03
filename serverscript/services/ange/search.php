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

MtUtil::_d(json_encode(file_get_contents("php://input"),true));

//	MtUtil::_d(print_r($_REQUEST,true));
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
        if ($_type == 'list' && $_search[SEARCH_KEYWORD]!='' ) {
            $search_where = "";
            $limit = "";

            if (isset($_page)) {
                $limit .= "LIMIT ".($_page[NO] * $_page[SIZE]).", ".$_page[SIZE];
            }

            /* 스토리 검색 */
            if ($_search[BOARD_GB]=='STORY'){

                //$sql = "select count(*) as TOTAL_COUNT from CMS_TASK where PHASE>='30' and (SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or SUMMARY LIKE '%{$_search[SEARCH_KEYWORD]}%' or TAG LIKE '%{$_search[SEARCH_KEYWORD]}%' ) ";
                $sql = "select count(*) as TOTAL_COUNT from CMS_TASK T INNER JOIN CMS_PROJECT P ON T.PROJECT_NO = P.NO where T.PHASE>='30' and (T.SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or T.SUMMARY LIKE '%{$_search[SEARCH_KEYWORD]}%' or T.TAG LIKE '%{$_search[SEARCH_KEYWORD]}%' ) ";
                $result = $_d->sql_query($sql,true);
                $row=$_d->sql_fetch_array($result);
                $t_total_count = $row['TOTAL_COUNT'];

                //$sql = "select * from CMS_TASK where PHASE>='30' and ( SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or SUMMARY LIKE '%{$_search[SEARCH_KEYWORD]}%' or TAG LIKE '%{$_search[SEARCH_KEYWORD]}%' ) order by NO desc {$limit};";
                $sql = "select P.SUBJECT AS PROJECT_NM, T.NO, T.PHASE, T.SUBJECT, T.SUMMARY, T.EDITOR_ID, T.EDITOR_NM, T.REG_UID, T.REG_NM, T.REG_DT,T.CLOSE_YMD, T.DEPLOY_YMD, T.TAG, T.NOTE, T.PROJECT_NO, T.SECTION_NO
                        from CMS_TASK T INNER JOIN CMS_PROJECT P ON T.PROJECT_NO = P.NO
                        where T.PHASE>='30'
                        and ( T.SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or T.SUMMARY LIKE '%{$_search[SEARCH_KEYWORD]}%' or T.TAG LIKE '%{$_search[SEARCH_KEYWORD]}%' )
                        order by NO desc {$limit};";


            }else{

                if ($_search[BOARD_GB]=='BOARD'){
                    $search_where = " and CB.COMM_NO in (1,2,3,4,5,6,7) " ;
                }

                if ($_search[BOARD_GB]=='CLINIC'){
                    $search_where = " and ( PASSWORD='' or PASSWORD is null ) and CB.PARENT_NO=0 and CB.SUBJECT<>'' " ;
                }

                if ($_search[BOARD_GB]=='PHOTO'){
                    $search_where = " and CB.COMM_NO in (11,12,13) " ;
                }

                $sql = "select count(*) as TOTAL_COUNT from COM_BOARD CB where BOARD_GB='{$_search[BOARD_GB]}' and NOTICE_FL=0 {$search_where} and ( SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or BODY LIKE '%{$_search[SEARCH_KEYWORD]}%'); ";
                $result = $_d->sql_query($sql,true);
                $row=$_d->sql_fetch_array($result);
                $t_total_count = $row['TOTAL_COUNT'];

                $sql = "select CB.*,AC.COMM_NM,AC.SHORT_NM,AC.MENU_ID from COM_BOARD CB left join ANGE_COMM AC on CB.COMM_NO=AC.NO where CB.BOARD_GB='{$_search[BOARD_GB]}' {$search_where} and ( CB.SUBJECT LIKE '%{$_search[SEARCH_KEYWORD]}%' or CB.BODY LIKE '%{$_search[SEARCH_KEYWORD]}%') order by CB.NO desc {$limit};";

            }
            $data = null;

            $__trn = '';
            $result = $_d->sql_query($sql,true);

            if($_search['FILE']) {

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                            FROM
                                COM_FILE F
                            WHERE
                                F.TARGET_GB = 'BOARD'
                                AND F.FILE_GB = 'MAIN'
                                AND F.TARGET_NO = ".$row['NO']."";

                    $file_result = $_d->sql_query($sql);
                    $file_data = $_d->sql_fetch_array($file_result);
                    $row['FILE'] = $file_data;

                    $__trn->rows[$i] = $row;
                    $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                }

                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            } else if($_search['STORY_FILE']) {
                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

                    $sql = "SELECT
                                    F.NO, F.FILE_NM, F.FILE_SIZE, F.FILE_ID, F.PATH, F.THUMB_FL, F.ORIGINAL_NO, DATE_FORMAT(F.REG_DT, '%Y-%m-%d') AS REG_DT
                                FROM
                                    CMS_CONTENT C, COM_FILE F
                                WHERE
                                    C.NO = F.TARGET_NO
                                    AND C.TASK_NO = ".$row['NO']."
                                    AND C.CURRENT_FL = 'Y'
                                    AND F.TARGET_GB = 'CONTENT'
                                    AND F.FILE_GB = 'MAIN'
                                ";

                    $file_result = $_d->sql_query($sql);
                    $file_data = $_d->sql_fetch_array($file_result);
                    $row['FILE'] = $file_data;

                    $__trn->rows[$i] = $row;
                    $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                }

                $_d->sql_free_result($result);
                $data = $__trn->{'rows'};

                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }
            }
            else {

                for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {
                    $__trn->rows[$i] = $row;
                    $__trn->rows[$i]['TOTAL_COUNT'] = $t_total_count;
                }

                $data = $__trn->{'rows'};
                $_d->sql_free_result($result);


                if ($_d->mysql_errno > 0) {
                    $_d->failEnd("조회실패입니다:".$_d->mysql_error);
                } else {
                    $_d->dataEnd2($data);
                }

            }
        }

        break;

}
?>