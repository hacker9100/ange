<?php
/*
<전달 인수>
_method : GET(고정값)
_type : contents(목차조회), page(본문조회)
project_no : 프로젝트 번호
task_no : 태스크 번호

<예제 url>
목차 조회
http://ange.co.kr/serverscript/services/external/epub.php?_method=GET&_type=contents&project_no=148

본문 내용 조회
http://ange.co.kr/serverscript/services/external/epub.php?_method=GET&_type=page&project_no=148&task_no=1986
*/

@session_start();

@extract($_GET);
@extract($_POST);
@extract($_SERVER);

date_default_timezone_set('Asia/Seoul');

include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");

MtUtil::_d("### ['START']");
MtUtil::_d(print_r($_REQUEST,true));
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
        if ($_type == "contents") {
            $search_where = "";

            $sql = "SELECT
                        SUBJECT, NO AS TASK_NO, PROJECT_NO
                    FROM
                        CMS_TASK
                    WHERE
                        PROJECT_NO = ".$project_no."
                    ORDER BY SECTION_NO
                    ";
            $data = $_d->getData($sql);

/*
//            $sql = "SELECT
//                        DISTINCT E.SECTION_ORD, E.SECTION_NO, S.SECTION_NM
//                    FROM
//                        CMS_EPUB E, CMS_SECTION S
//                    WHERE
//                        E.SECTION_NO = S.NO
//                        AND E.PROJECT_NO = ".$project_no."
//                        ".$search_where."
//                    ORDER BY E.SECTION_ORD
//                    ";

            $sql = "SELECT
                       DISTINCT T.SECTION_NO, S.SECTION_NM
                    FROM
                       CMS_TASK T, CMS_SECTION S
                    WHERE
                       T.SECTION_NO = S.NO
                       AND T.PROJECT_NO = ".$project_no."
                    ORDER BY SECTION_NO
                    ";

            $__trn = '';
            $result = $_d->sql_query($sql,true);
            for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

//                $sql = "SELECT
//                            E.TASK_ORD, T.SUBJECT
//                        FROM
//                            CMS_EPUB E, CMS_TASK T
//                        WHERE
//                            E.TASK_NO = T.NO
//                            AND E.PROJECT_NO = ".$project_no."
//                            AND E.SECTION_NO = ".$row['SECTION_NO']."
//                        ORDER BY E.TASK_ORD
//                        ";

                $sql = "SELECT
                            T.SUBJECT
                        FROM
                            CMS_TASK T
                        WHERE
                            T.PROJECT_NO = ".$project_no."
                            AND T.SECTION_NO = ".$row['SECTION_NO']."
                        ORDER BY NO
                        ";

                $task_data = $_d->getData($sql);
                $row['TASK'] = $task_data;

                $__trn->rows[$i] = $row;
            }

            $_d->sql_free_result($result);
            $data = $__trn->{'rows'};
*/

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd2($data);
            }
        } else if ($_type == "page") {
            $search_where = "";

            $sql = "SELECT
                        T.SUBJECT, C.BODY
                    FROM
                        CMS_CONTENT C, CMS_TASK T
                    WHERE
                        C.TASK_NO = T.NO
                        AND T.NO = ".$task_no."
                        AND T.PROJECT_NO = ".$project_no."
                        ".$search_where."
                    ";

            $data  = $_d->sql_fetch($sql);

            if ($_d->mysql_errno > 0) {
                $_d->failEnd("조회실패입니다:".$_d->mysql_error);
            } else {
                $_d->dataEnd3($data['BODY']);
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