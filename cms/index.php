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
                CHANNEL_NO, CHANNEL_URL, CHANNEL_NM, TAG, CHANNEL_GB, DROP_FL, POSITION
            FROM
                COM_CHANNEL
            WHERE
                CHANNEL_GB = 'CMS'
            ORDER BY CHANNEL_NO ASC
            ";

    $__trn = '';
    $result = $_d->sql_query($sql,true);
    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

        $sql = "SELECT
                    MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, DIVIDER_FL, MENU_DESC, TAIL_DESC
                FROM
                    COM_MENU
                WHERE
                    MENU_GB = 'CMS'
                    AND CHANNEL_NO  = '".$row[CHANNEL_NO]."'
                ORDER BY SORT_IDX ASC
                ";

        $menu_data = $_d->getData($sql);
        $row['MENU_INFO'] = $menu_data;

        $__trn->rows[$i] = $row;
    }
    $_d->sql_free_result($result);
    $channel_data = $__trn->{'rows'};

    $sql = "SELECT
                MENU_URL, CHANNEL_NO, MENU_NM, MENU_GB, MENU_DESC, TAIL_DESC
            FROM
                COM_MENU
            WHERE
                MENU_GB  = 'CMS'
            ORDER BY SORT_IDX ASC
            ";

    $__trn = '';
    $result = $_d->sql_query($sql,true);
    for ($i=0; $row=$_d->sql_fetch_array($result); $i++) {

        $sql = "SELECT
                    MENU_URL, SUB_MENU, POSITION, TITLE, SUB_MENU_URL, SUB_MENU_GB, API, CSS, SORT_IDX
                FROM
                    COM_SUB_MENU
                WHERE
                    MENU_URL = '".$row[MENU_URL]."'
                ORDER BY SORT_IDX ASC
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
<title>ANGE CMS</title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<link rel="stylesheet" type="text/css" href="/lib/jquery/css/base/jquery-ui-1.10.2.min.css" />
<link rel="stylesheet" type="text/css" href="/lib/plupload/jquery.ui.plupload/css/jquery.ui.plupload.css" />
<link rel="stylesheet" type="text/css" href="/lib/ngActivityIndicator/css/ngActivityIndicator.css" />
<link rel="stylesheet" type="text/css" href="/lib/fullcalendar/fullcalendar.css" />

<link rel="stylesheet" type="text/css" href="/css/calendarDemo.css" />
<link rel="stylesheet" type="text/css" href="/css/ng-table/ng-table.min.css" />
<link rel="stylesheet" type="text/css" href="/css/dialog/dialogs.min.css" />
<link rel="stylesheet" type="text/css" href="/css/app_d.css">

<link rel="stylesheet" type="text/css" href="/css/normalize.css" >
<link rel="stylesheet" type="text/css" href="/css/angeCMS_bootstrap.css" />
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
<style type="text/css">
    #veil {
        position: absolute;
        top: 0;
        left: 0;
        height:100%;
        width:100%;
        cursor: not-allowed;
        filter: alpha(opacity=60);
        opacity: 0.6;
        background: #000000 url(http://www.wingo.com/angular/AngularShieldLogo.png) no-repeat center;
    }
    #feedLoading {
        position: absolute;
        top:200px;
        width:100%;
        text-align: center;
        font-size: 4em;
        color:white;
        text-shadow: 2px 2px 2px #021124;
    }
    .feed-loading {
        position: absolute;
        display: block;
        width: 32px;
        height: 32px;
        top:10px;
        width:50px;
    }
</style>

<style>
    .loading-container {
        position: relative;
    }
    .loading-container .loading:before, .loading-container .loading:after {
        content: " ";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        min-height: 50px;
        min-width: 50px;
    }
    .loading-container .loading:before {
        background-color: white;
        opacity: 0.5;
    }

    .form-horizontal input.ng-invalid.ng-dirty {
        border-color: #FA787E;
    }
/*
    .form-horizontal input.ng-valid.ng-dirty {
        border-color: #78FA89;
    }
*/
</style>

<!-- IE6,7,8에서도 HTML5 element를 인식시켜주기 위한 코드 -->
<!--[if lt IE 9]>
<script src="/lib/html5shiv/html5shiv.js"></script>
<script src="/lib/respond/respond.min.js"></script>
<![endif]-->

<script>
    function cms_init($rootScope, $location) {
        $rootScope.cms_channel = <?=$channel_info?>;
        $rootScope.cms_menu = <?=$menu_info?>;
        $rootScope.location = $location.path();
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
<div ui-view ng-controller="cms_init"></div>

<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->
<script src="/lib/require/require.js" data-main="/js/cms/main.js"></script>
</body>

</html>