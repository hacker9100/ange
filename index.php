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
MtUtil::_d("### [START]");

$_d = new MtJson(null);

$system = "ANGE";

$sql = "SELECT
            CHANNEL_NO, CHANNEL_ID, CHANNEL_URL, CHANNEL_NM, TAG, SYSTEM_GB, DROP_FL, POSITION, COLUMN_CNT
        FROM
            COM_CHANNEL
        WHERE
            SYSTEM_GB = '".$system."'
            AND CHANNEL_ST = 'Y'
        ORDER BY CHANNEL_NO ASC
        ";

$channel_data = $_d->getData($sql);

$sql = "SELECT
            CM.NO, CM.MENU_ID, CM.MENU_URL, CM.CHANNEL_NO, CM.MENU_NM, CM.SYSTEM_GB, CM.DIVIDER_FL, DEPTH, CM.LINK_FL, CM.CLASS_GB, CM.MENU_DESC, CM.TAIL_DESC, CM.ETC, AC.NO AS COMM_NO, AC.COMM_GB
        FROM
            COM_MENU CM
            LEFT OUTER JOIN ANGE_COMM AC ON CM.MENU_ID = AC.MENU_ID
        WHERE
            CM.SYSTEM_GB  = '".$system."'
            AND CM.MENU_ST  = 'Y'
        ORDER BY CM.MENU_ORD ASC
        ";

$menu_data = $_d->getData($sql);

$sql = "SELECT
            C.NO, C.PARENT_NO, C.CATEGORY_NM, C.CATEGORY_GB, C.CATEGORY_ST, C.REG_DT, C.NOTE
        FROM
            CMS_CATEGORY C
        WHERE
            SYSTEM_GB  = 'CMS'
        ";

$category_data = $_d->getData($sql);

$title = "";
$description = "";
$image = "";
$url = BASE_URL.$REQUEST_URI;
$path = explode('/', $REQUEST_URI);

if ((sizeof($path) == 5) == 1) {
    if ($path[1] == "story") {
        $sql = "SELECT
                   T.SUBJECT, T.SUMMARY, F.PATH, F.FILE_ID
                FROM
                   CMS_TASK T
                        LEFT OUTER JOIN CMS_CONTENT C ON T.NO = C.TASK_NO AND C.CURRENT_FL = 'Y'
                        INNER JOIN COM_FILE F ON C.NO = F.TARGET_NO  AND F.TARGET_GB = 'CONTENT' AND F.FILE_GB = 'MAIN'
                WHERE
                    T.NO = ".$path[4]."
                ";

        $task_data = $_d->sql_fetch($sql);

        $title = $task_data['SUBJECT'];
        $description = $task_data['SUMMARY'];
        $image = BASE_URL.$task_data['PATH']."thumbnail/".$task_data['FILE_ID'];
    }
}

ob_end_clean();
$channel_info = json_encode($channel_data);
$menu_info = json_encode($menu_data);
$category_info = json_encode($category_data);

MtUtil::_d("### [END]");
?>

<!doctype html>
<html lang="en">
<head>
    <title>ANGE - 엄마들의 즐거운 놀이터</title>

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="format-detection" content="telephone=no, address=no, email=no" />
    <meta name="MobileOptimized" content="width" />
    <meta name="MobileOptimized" content="320" />
    <!--
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="-1" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache">
    -->
    <link rel="shortcut icon" href="/imgs/common/ange_favicon.ico">
    <meta name="author" content="앙쥬" />
    <meta name="copyright" content="앙쥬" />
    <meta name="subject" content="출산,육아" />
    <meta name="title" content="앙쥬스토리" />
    <meta name="Other Agent" content="MARVELTREE" />
    <meta name="Location" content="Republic of Korea" />
    <meta name="description" content="<?=$description?>" />

    <meta name="keywords" content="임신, 출산,육아" />
    <meta name="robots" content="pregnancy, pregnant, childbirth, infant care, child care" />
    <!--    <meta property="fb:app_id" content="640241789454829" />-->
    <!--    <meta id="fb_image" property="og:title" content="" />-->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="<?=$title?>" />
    <meta property="og:url" content="<?=$url?>" />
    <meta property="og:image" content="<?=$image?>" />
    <meta property="og:site_name" content="ANGE - 엄마들의 즐거운 놀이터" />
    <meta property="og:description" content="<?=$description?>" />

    <meta name="fragment" content="!" />
    <base href="/">

    <link rel="stylesheet" type="text/css" href="css/ange/normalize.css" >
    <link rel="stylesheet" type="text/css" href="css/ange/ange_bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_style.css" />

    <link rel="stylesheet" type="text/css" href="lib/jquery/css/base/jquery-ui-1.10.2.min.css" />
    <link rel="stylesheet" type="text/css" href="/lib/ngActivityIndicator/css/ngActivityIndicator.css" />

    <link rel="stylesheet" type="text/css" href="lib/slick-carousel/slick.css" />

    <link rel="stylesheet" type="text/css" href="css/ng-table/ange-ng-table.css" />
    <link rel="stylesheet" type="text/css" href="/css/ange/ange_ng-scrollbar.css" />
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
    <link rel="stylesheet" type="text/css" href="css/ange/ange_gnb.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_storylist.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_people_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_peoplepoll.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_peopleboard.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_moms_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_myange_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_myange.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_myangealbum.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_store_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_infodesk_main.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_join.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_moms.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_store.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_club.css" />
    <link rel="stylesheet" type="text/css" href="css/ange/ange_company.css" />

    <!--[if lte IE 8]>
    <script type="text/javascript">
        document.createElement('ui-lnb');
        document.createElement('ange-body');
        document.createElement('module-reply');

        document.createElement('ange-portlet-main-list');
        document.createElement('ange-mini-story-list');
        document.createElement('ange-portlet-channel-list');
        document.createElement('ange-portlet-slide-page');
        document.createElement('ange-portlet-slide-baby');
        document.createElement('ange-portlet-slide-ads');
        document.createElement('ange-portlet-slide-banner');
        document.createElement('ange-portlet-slide-image');
        document.createElement('ange-portlet-link-image');
        document.createElement('ange-portlet-link-image2');
        document.createElement('ange-portlet-piece-image');

        document.createElement('slick');
        document.createElement('ckeditor');
        document.createElement('ng-dropdown-multiselect');
        document.createElement('checklist-model');
    </script>
    <![endif]-->

    <!--[if lt IE 10]>
    <script type="text/javascript">
        location.href = "/ange/browserinstall.html";
    </script>
    <![endif]-->

    <!-- IE6,7,8에서도 HTML5 element를 인식시켜주기 위한 코드 -->
    <!--[if lt IE 9]>
    <script src="lib/html5shiv/html5shiv.min.js"></script>
    <script src="lib/respond/respond.min.js"></script>
    <![endif]-->

    <!-- 다음 무편번호 서비스 추가 -->
    <? if(isset($_SERVER['HTTPS']) && $_SERVER["HTTPS"] == "on") {?>
        <script src="https://spi.maps.daum.net/imap/map_js_init/postcode.js"></script>
        <script src="https://testpg.easypay.co.kr/plugin/EasyPayPlugin.js" charset="euc-kr"></script>
    <? } else { ?>
        <script src="http://dmaps.daum.net/map_js_init/postcode.js"></script>
        <script src="http://testpg.easypay.co.kr/plugin/EasyPayPlugin.js" charset="euc-kr"></script>
    <? } ?>
    <!-- 구글 맵 서비스 추가 -->
    <script src="https://maps.google.com/maps/api/js?sensor=false"></script>
    <!-- 트위터 공유 서비스 추가 -->
    <script src="http://platform.twitter.com/widgets.js"></script>
    <!-- 카카오 스토리 공유 서비스 추가 -->
    <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
    <!-- 클립보드 추가 -->
    <script src="lib/ng-clip/ZeroClipboard.min.js"></script>

    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-59669559-1', 'auto');

        function ange_init($rootScope) {
            $rootScope.ange_channel = <?=$channel_info?>;
            $rootScope.ange_menu = <?=$menu_info?>;
            $rootScope.ange_category = <?=$category_info?>;
            $rootScope.mobile = false;

            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $rootScope.mobile = true;
            }

            // 로컬 서버
//            Kakao.init('207aa395bc0cb51730547fd97ee9d369');

            // 운영 서버
//            Kakao.init('d3adadb46723eb3879569ddd4f43bf33');
        }

        function externalOrder(ret, val) {
            var scope = angular.element($("#outer")).scope();
            scope.$apply(function(){
                scope.returnPayment(ret, val);
            })
        }
    </script>

    <!-- **
    일부 페이지마다 필요한 CSS은 아래와 같이 컨트롤러에서 설정해서 로드
    http://plnkr.co/edit/KzjIMN
    *** -->
    <link ng-repeat="stylesheet in stylesheets" ng-href="{{stylesheet}}" type="text/css" rel="stylesheet" />
</head>

<body ng-controller="ange_init">

<!-- View가 표시될 영역 -->
<div ui-view class="wrap"></div>

<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->
<script src="lib/require/require.js" data-main="js/ange/main.js"></script>
</body>

</html>