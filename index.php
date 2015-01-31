<!--
    Author : Sung-hwan Kim
    Email  : hacker9100@marveltree.com
    Date   : 2014-09-23
    Description : app의 최상위 파일로서 최초 로딩되는 index 파일
-->
<?php
    @extract($_SERVER);

    include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");
    MtUtil::_c("### [START]");

    $_d = new MtJson();

    $sql = "SELECT
                CHANNEL_NO, CHANNEL_ID, CHANNEL_URL, CHANNEL_NM, TAG, SYSTEM_GB, DROP_FL, POSITION, COLUMN_CNT
            FROM
                COM_CHANNEL
            WHERE
                SYSTEM_GB = 'ANGE'
                AND CHANNEL_ST = 'Y'
            ORDER BY CHANNEL_NO ASC
            ";

    $__trn = '';
    $result = $_d->sql_query($sql,true);
    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

        $sql = "SELECT
                    MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_DESC, TAIL_DESC, ETC, F.FILE_ID
                FROM
                    COM_MENU M
                    LEFT OUTER JOIN CONTENT_SOURCE S ON M.NO = S.TARGET_NO AND S.CONTENT_GB = 'FILE' AND S.TARGET_GB = 'MENU'
                    LEFT OUTER JOIN FILE F ON F.NO = S.SOURCE_NO
                WHERE
                    SYSTEM_GB = 'ANGE'
                    AND MENU_ST  = 'Y'
                    AND CHANNEL_NO  = '".$row[CHANNEL_NO]."'
                ORDER BY MENU_ORD ASC
                ";

        $menu_data = $_d->getData($sql);
        $row['MENU_INFO'] = $menu_data;

        $__trn->rows[$i] = $row;
    }
    $_d->sql_free_result($result);
    $channel_data = $__trn->{'rows'};

    $sql = "SELECT
                CM.MENU_ID, CM.MENU_URL, CM.CHANNEL_NO, CM.MENU_NM, CM.SYSTEM_GB, CM.DIVIDER_FL, DEPTH, CM.LINK_FL, CM.CLASS_GB, CM.MENU_DESC, CM.TAIL_DESC, CM.ETC, AC.NO AS COMM_NO, AC.COMM_GB
            FROM
                COM_MENU CM
                LEFT OUTER JOIN ANGE_COMM AC ON CM.MENU_ID = AC.MENU_ID
            WHERE
                CM.SYSTEM_GB  = 'ANGE'
                AND CM.MENU_ST  = 'Y'
            ORDER BY CM.MENU_ORD ASC
            ";

    $__trn = '';
    $result = $_d->sql_query($sql,true);
    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

        $sql = "SELECT
                    MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_GB, API, CSS, COLUMN_ORD, ROW_ORD
                FROM
                    COM_SUB_MENU
                WHERE
                    MENU_URL = '".$row[MENU_URL]."'
                ORDER BY COLUMN_ORD ASC, ROW_ORD ASC
                ";

        $sub_menu_data = $_d->getData($sql);
        $row['SUB_MENU_INFO'] = $sub_menu_data;

        $__trn->rows[$i] = $row;
    }
    $_d->sql_free_result($result);
    $menu_data = $__trn->{'rows'};

    ob_end_clean();
    $channel_info = json_encode($channel_data);
    $menu_info = json_encode($menu_data);
    MtUtil::_c("### [END]");
?>

<!doctype html>
<html lang="en">
<head>
<title>ANGE - 엄마들의 즐거운 놀이터</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">
<meta name="fragment" content="!" />
<base href="/">

<link rel="stylesheet" type="text/css" href="css/ange/normalize.css" >
<link rel="stylesheet" type="text/css" href="css/ange_bootstrap.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_style.css" />

<link rel="stylesheet" type="text/css" href="lib/jquery/css/base/jquery-ui-1.10.2.min.css" />
<link rel="stylesheet" type="text/css" href="lib/plupload/jquery.ui.plupload/css/jquery.ui.plupload.css" />

<link rel="stylesheet" type="text/css" href="lib/slick-carousel/slick.css" />

<link rel="stylesheet" type="text/css" href="css/ng-table/ange-ng-table.css" />
<!--<link rel="stylesheet" type="text/css" href="css/dialog/dialogs.min.css" />-->

<!-- file-upload -->
<!-- blueimp Gallery styles -->
<link rel="stylesheet" href="css/file-upload/blueimp-gallery.css">
<!-- CSS to style the file input field as button and adjust the Bootstrap progress bars -->
<link rel="stylesheet" href="css/file-upload/jquery.fileupload.css">
<link rel="stylesheet" href="css/file-upload/jquery.fileupload-ui.css">
<!-- CSS adjustments for browsers with JavaScript disabled -->
<noscript><link rel="stylesheet" href="css/file-upload/jquery.fileupload-noscript.css"></noscript>
<noscript><link rel="stylesheet" href="css/file-upload/jquery.fileupload-ui-noscript.css"></noscript>

<link rel="stylesheet" type="text/css" href="css/article.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_storylist.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_people_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_peoplepoll.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_peopleboard.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_moms_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_myange_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_store_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_infodesk_main.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_join.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_moms.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_store.css" />
<link rel="stylesheet" type="text/css" href="css/ange/ange_club.css" />

<!-- IE6,7,8에서도 HTML5 element를 인식시켜주기 위한 코드 -->
<!--[if lt IE 9]>
<script src="lib/html5shiv/html5shiv.js"></script>
<script src="lib/respond/respond.min.js"></script>
<![endif]-->

<!-- 다음 무편번호 서비스 추가 -->
<script src="http://dmaps.daum.net/map_js_init/postcode.js"></script>

<script>
    function ange_init($rootScope) {
        $rootScope.ange_channel = <?=$channel_info?>;
        $rootScope.ange_menu = <?=$menu_info?>;
    }
</script>

<!-- **
일부 페이지마다 필요한 CSS은 아래와 같이 컨트롤러에서 설정해서 로드
http://plnkr.co/edit/KzjIMN
*** -->
<link ng-repeat="stylesheet in stylesheets" ng-href="{{stylesheet}}" type="text/css" rel="stylesheet" />
</head>

<body>
<!-- View가 표시될 영역 -->
<div ui-view ng-controller="ange_init"></div>

<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->
<script src="lib/require/require.js" data-main="js/ange/main.js"></script>
</body>

</html>