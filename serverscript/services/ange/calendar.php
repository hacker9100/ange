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
        if ($_type == 'list' ) {

            $this_month = "{$_search['year']}-{$_search['month']}-1";
            //$this_month = isset($_REQUEST['month'])?$_REQUEST['month']:date('Y-m-d');

            $search_where = "";
            $limit = "";

            // $_search[USER_ID]
            // $_search[YEAR]
            // $_search[MONTH]

            $this_month = date('Y',strtotime($this_month)).'-'.date('m',strtotime($this_month)).'-01';

            $t_add = date('w',strtotime($this_month));
            $t_startday = date('Y-m-d',strtotime("{$this_month} -{$t_add}days"));
            $t_endday = date('Y-m-d',strtotime("{$this_month} +1months"));
            $t_add = 7-date('w',strtotime($t_endday));
            $t_endday = date('Y-m-d',strtotime("{$t_endday} +{$t_add}days"));

            $lday = $t_startday;
            $lcnt=0;
            //$t_stream = '';
            $t_year = date('Y',strtotime($this_month));
            $t_month = date('m',strtotime($this_month));
            while($lday!=$t_endday && $lcnt<50 ){

                if ($t_month==date('m',strtotime($lday))){
                    $t_type="normal";
                }else{
                    $t_type="blind";
                }
                $t_event = $v_event[date('m-d',strtotime($lday))];
                if ($t_event!=''){
                    $t_type="event";
                }

                //$t_stream .= "<td class=\"day\" title=\"{$t_event}\" style=\"{$t_style}\">".date('d',strtotime("{$lday}")).'</td>';
                $t_key = substr( "0".(string)$lcnt,-2 );
                $t_key = date('Ymd',strtotime($lday));
                $data[$t_key]['day']=(int)date('d',strtotime("{$lday}"));
                $data[$t_key]['event']="";
                $data[$t_key]['type']=$t_type;
                $data[$t_key]['event_type']=''; // 생일 birth, 출산예정일 , 병원 , 돌 birth_first, 행사참여 join, 결혼기념일 marriage

                $lday = date('Y-m-d',strtotime("{$lday} +1days"));
                $lcnt++;

                $data_set['list'] = '';

            }

            // 일정 조회
            // LUNAR_FL: 0/1, BIRTH: 회원 생일, BABY_BIRTH_DT : 출산 예정일
            // $_SESSION['user_info']['USER_ID']
            // $_SESSION['user_info']['USER_ID']="hong";


            // 출산예정일
            // - $_SESSION['USER_INFO']['BABY_BIRTH_DT']="20150405"; // 출산 예정일 테스트
            $lcnt=0; // 이벤트 리스트 목록의 중복을 방지하기 위한 카운터


            if ($_SESSION['user_info']['BABY_BIRTH_DT']!=''){
                $e_date = $_SESSION['user_info']['BABY_BIRTH_DT'];
                $e_year = substr($e_date,0,4);
                $e_month = substr($e_date,4,2);
                $e_day = substr($e_date,6,2);

                if ((int)$e_year==(int)$t_year && (int)$e_month==(int)$t_month){
                    $t_key = $e_date;
                    $data[$t_key]['type'] = "event";
                    $data[$t_key]['event'] .= "출산예정일\r\n";
                    $data[$t_key]['event_type'] += ",duedate";

                    $lcnt++;
                    $list[$t_key.$lcnt]['day'] = $e_day;
                    $list[$t_key.$lcnt]['type'] = "event";
                    $list[$t_key.$lcnt]['event'] = "{$row['ada_name']} 후기 마감\r\n";
                    $list[$t_key.$lcnt]['event_type'] = "duedate";
                }
            }

            // 아이 생일
            $sql = "select BABY_SEX_GB,BABY_NM,BABY_BIRTH from ANGE_USER_BABY where USER_ID={$_SESSION['user_info']['BABY_BIRTH_DT']} ";
            $result = $_d->sql_query($sql,true);

            while($row=$_d->sql_fetch_array($result)){

                $e_date = $row['BABY_BIRTH'];
                $e_year = substr($e_date,0,4);
                $e_month = substr($e_date,4,2);
                $e_day = substr($e_date,6,2);

                if ((int)$e_year==(int)$t_year && (int)$e_month==(int)$t_month){
                    $t_key = $e_date;
                    $data[$t_key]['type'] = "event";
                    $data[$t_key]['event'] .= "{$row['BABY_NM']} 생일\r\n ";
                    $data[$t_key]['event_type'] += ",birth";

                    $lcnt++;
                    $list[$t_key.$lcnt]['day'] = $e_day;
                    $list[$t_key.$lcnt]['type'] = "event";
                    $list[$t_key.$lcnt]['event'] = "{$row['ada_name']} 후기 마감\r\n";
                    $list[$t_key.$lcnt]['event_type'] = "birth";
                }
            }

            // 참여행사 발표일
            //$row=NULL;
            $sql = "select ahj.ada_idx,ad.ada_name,ad.ada_date_notice, ad.ada_date_review_close from adm_history_join ahj left join adm_ad ad on ahj.ada_idx=ad.ada_idx where ahj.adu_id='{$_SESSION['user_info']['USER_ID']}' ";
            $result = $_d->sql_query($sql,true);

            $lcnt=0;
            while($row=$_d->sql_fetch_array($result)){
                $row['ada_date_review_close'] = trim($row['ada_date_review_close']);
                if ($row['ada_date_review_close']!=''){
                    $e_date = date('Ymd',strtotime("2015-04-15"));
                    $e_year = substr($e_date,0,4);
                    $e_month = substr($e_date,4,2);
                    $e_day = substr($e_date,6,2);
                    if ((int)$e_year==(int)$t_year && (int)$e_month==(int)$t_month){
                        $t_key = $e_date;
                        $data[$t_key]['type'] = "event";
                        $data[$t_key]['event'] .= "{$row['ada_name']} 후기 마감\r\n";
                        $data[$t_key]['event_type'] += ",reviewclose";

                        $lcnt++;
                        $list[$t_key.$lcnt]['day'] = $e_day;
                        $list[$t_key.$lcnt]['type'] = "event";
                        $list[$t_key.$lcnt]['event'] = "{$row['ada_name']} 후기 마감\r\n";
                        $list[$t_key.$lcnt]['event_type'] = "reviewclose";
                    }
                }
                if ($row['ada_date_notice']!=''){
                    $e_date = date('Ymd',strtotime($row['ada_date_notice']));
                    $e_year = substr($e_date,0,4);
                    $e_month = substr($e_date,4,2);
                    $e_day = substr($e_date,6,2);

                    if ((int)$e_year==(int)$t_year && (int)$e_month==(int)$t_month){
                        $t_key = $e_date;
                        $data[$t_key]['type'] = "event";
                        $data[$t_key]['event'] .= "{$row['ada_name']} 발표\r\n";
                        $data[$t_key]['event_type'] += ",notice";

                        $lcnt++;
                        $list[$t_key.$lcnt]['day'] = $e_day;
                        $list[$t_key.$lcnt]['type'] = "event";
                        $list[$t_key.$lcnt]['event'] = "{$row['ada_name']} 발표\r\n";
                        $list[$t_key.$lcnt]['event_type'] = "notice";
                    }
                }
            }

            // 달력 자료 연결
            $data_set['calendar'] = $data;
            $data_set['list'] = $list;



            $_d->dataEnd2($data_set);

            /*
            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
            */
        }

        break;

}
?>