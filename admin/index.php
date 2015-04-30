<!--
    Author : Sung-hwan Kim
    Email  : hacker9100@marveltree.com
    Date   : 2014-09-23
    Description : app의 최상위 파일로서 최초 로딩되는 index 파일
-->
<?php
header("Content-type: text/html; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Expires: Tue, 01 Jan 1980 1:00:00 GMT");
header("Expires: -1");

@extract($_SERVER);

include_once($_SERVER['DOCUMENT_ROOT']."/serverscript/classes/ImportClasses.php");
MtUtil::_a("### [START]");

$_d = new MtJson(null);

$system = "ADMIN";

$sql = "SELECT
            CHANNEL_NO, CHANNEL_ID, CHANNEL_URL, CHANNEL_NM, TAG, SYSTEM_GB, DROP_FL, POSITION, COLUMN_CNT
        FROM
            COM_CHANNEL
        WHERE
            SYSTEM_GB = '".$system."'
            AND CHANNEL_ST = 'Y'
        ORDER BY CHANNEL_NO ASC
        ";

$__trn = '';
$result = $_d->sql_query($sql,true);
for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

    $sql = "SELECT
                NO, MENU_ID, MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, DIVIDER_FL, DEPTH, LINK_FL, CLASS_GB, MENU_DESC, TAIL_DESC
            FROM
                COM_MENU
            WHERE
                SYSTEM_GB = '".$system."'
                AND MENU_ST = 'Y'
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
            MENU_URL, CHANNEL_NO, MENU_NM, SYSTEM_GB, MENU_DESC, TAIL_DESC
        FROM
            COM_MENU
        WHERE
            SYSTEM_GB  = '".$system."'
            AND MENU_ST  = 'Y'
        ORDER BY MENU_ORD ASC
        ";

$menu_data = $_d->getData($sql);

ob_end_clean();
$channel_info = json_encode($channel_data);
$menu_info = json_encode($menu_data);
MtUtil::_a("### [START]");
?>

<!doctype html>
<html lang="en">
<head>
<title>ANGE ADMIN</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<link rel="stylesheet" type="text/css" href="/lib/jquery/css/base/jquery-ui-1.10.2.min.css" />
<link rel="stylesheet" type="text/css" href="/lib/ngActivityIndicator/css/ngActivityIndicator.css" />
<link rel="stylesheet" type="text/css" href="/lib/fullcalendar/fullcalendar.css" />

<link rel="stylesheet" type="text/css" href="/css/ng-table/ng-table.min.css" />
<link rel="stylesheet" type="text/css" href="/css/dialog/dialogs.min.css" />

<link rel="stylesheet" type="text/css" href="/css/normalize.css" >
<link rel="stylesheet" type="text/css" href="/css/angeADMIN_bootstrap.css" />
<link rel="stylesheet" type="text/css" href="/css/style.css" />
<link rel="stylesheet" type="text/css" href="/css/article.css" />
<!-- file-upload -->
<!-- blueimp Gallery styles -->
<link rel="stylesheet" href="/css/file-upload/blueimp-gallery.css">
<!-- CSS to style the file input field as button and adjust the Bootstrap progress bars -->
<link rel="stylesheet" href="/css/file-upload/jquery.fileupload.css">
<link rel="stylesheet" href="/css/file-upload/jquery.fileupload-ui.css">
<!-- CSS adjustments for browsers with JavaScript disabled -->
<noscript><link rel="stylesheet" href="/css/file-upload/jquery.fileupload-noscript.css"></noscript>
<noscript><link rel="stylesheet" href="/css/file-upload/jquery.fileupload-ui-noscript.css"></noscript>

<!-- IE6,7,8에서도 HTML5 element를 인식시켜주기 위한 코드 -->
<!--[if lt IE 9]>
<script src="/lib/html5shiv/html5shiv.js"></script>
<script src="/lib/respond/respond.min.js"></script>
<![endif]-->

<!-- 다음 무편번호 서비스 추가 -->
<script src="http://dmaps.daum.net/map_js_init/postcode.js"></script>

<script>
    function admin_init($rootScope, $location) {
        $rootScope.admin_channel = <?=$channel_info?>;
        $rootScope.admin_menu = <?=$menu_info?>;
//        $rootScope.location = $location.path();
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
<div ui-view ng-controller="admin_init"></div>

<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->
<script src="/lib/require/require.js" data-main="/js/admin/main.js"></script>
</body>

</html>