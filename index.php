<!--
    Author : Sung-hwan Kim
    Email  : hacker9100@marveltree.com
    Date   : 2014-09-23
    Description : app의 최상위 파일로서 최초 로딩되는 index 파일
-->
<?php
//    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
//    header("Cache-Control: post-check=0, pre-check=0", false);
//    header("Pragma: no-cache");

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
                CM.MENU_ID, CM.MENU_URL, CM.CHANNEL_NO, CM.MENU_NM, CM.SYSTEM_GB, CM.DIVIDER_FL, DEPTH, CM.LINK_FL, CM.CLASS_GB, CM.MENU_DESC, CM.TAIL_DESC, CM.ETC, AC.NO AS COMM_NO, AC.COMM_GB
            FROM
                COM_MENU CM
                LEFT OUTER JOIN ANGE_COMM AC ON CM.MENU_ID = AC.MENU_ID
            WHERE
                CM.SYSTEM_GB  = '".$system."'
                AND CM.MENU_ST  = 'Y'
            ORDER BY CM.MENU_ORD ASC
            ";

    $menu_data = $_d->getData($sql);

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
                            INNER JOIN CONTENT_SOURCE S ON C.NO = S.TARGET_NO AND S.TARGET_GB = 'CONTENT'
                            INNER JOIN FILE F ON F.NO = S.SOURCE_NO AND F.FILE_GB = 'MAIN'
                    WHERE
                        T.NO = ".$path[4]."
                    ";

            $task_data = $_d->sql_fetch($sql);

            $title = $task_data['SUBJECT'];
            $description = $task_data['SUMMARY'];
            $image = BASE_URL."/thumbnail".$task_data['PATH'].$task_data['FILE_ID'];
        }
    }

    ob_end_clean();
    $channel_info = json_encode($channel_data);
    $menu_info = json_encode($menu_data);

    MtUtil::_d("### [END]");
?>

<!doctype html>
<html lang="en">
<head>
<title>ANGE - 엄마들의 즐거운 놀이터</title>

<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!--
<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="-1" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
<meta http-equiv="pragma" content="no-cache">
-->
<meta name="author" content="앙쥬" />
<meta name="copyright" content="앙쥬" />
<meta name="subject" content="출산,육아" />
<meta name="title" content="앙쥬스토리 - 조물조물 손 놀이로 운필력 다지기" />
<meta name="Other Agent" content="MARVELTREE" />
<meta name="Location" content="Republic of Korea" />
<meta name="description" content="그림을 그리거나 글씨를 쓸 수 있는 손의 힘을 운필력이라고 한다. 만 5세 전후, 아이의 운필력을 길러주면 초등학교 입학 후 공부를 따라가기가 한결 수월해진다. 하지만 너무 이른 훈련이나 강요는 스트레스가 될 수 있으니 주의하자. 연필로 사람의 형태를 그릴 수 있거나 글씨를 따라 쓰는 데 자신 있다면 운필력이 충분한 것으로 판단된다. 하지만 아이가 아직 그리거나 쓰는 데 부족하다면 취학 전 미리 운필력을 키워주는 훈련을 하는것도 좋다. 학교에 입학하면 일기 쓰기, 받아쓰기 등 글을 쓰는 학습이 많아 아이의 자신감이 높아질 수 있기 때문이다. 하지만 이런 이유로 아이에게 너무 글씨 쓰기를 강요하거나 지나친 훈련으로 아이가 스트레스를 받는다면 오히려 훈련하지 않는 것만 못한 결과를 가져올 수 있다. 또 너무 이른 나이에 시작하면 아이가 학습에 대한 흥미를 잃을 수 있으므로 주의해야 한다. 운필력은 주로 실생활에서 간단한 놀이나 학습을 통해 기를 수 있으므로 아이가 적정 연령이라면너무 성급하지 않게, 즐겁게 준비해보자." />

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
<!--<link rel="stylesheet" type="text/css" href="css/dialog/dialogs.min.css" />-->

<!-- chart -->
<!--<link rel="stylesheet" type="text/css" href="/lib/chartjs/angular-chart.css" />-->

<!-- social -->
<link rel="stylesheet" type="text/css" href="/lib/angular-socialshare/angular-socialshare.css" />

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
<link rel="stylesheet" type="text/css" href="css/ange/ange_company.css" />

<!-- IE6,7,8에서도 HTML5 element를 인식시켜주기 위한 코드 -->
<!--[if lt IE 9]>
<script src="lib/html5shiv/html5shiv.js"></script>
<script src="lib/respond/respond.min.js"></script>
<![endif]-->

<!-- 다음 무편번호 서비스 추가 -->
<script src="http://dmaps.daum.net/map_js_init/postcode.js"></script>
<!-- 구글 맵 서비스 추가 -->
<script src="https://maps.google.com/maps/api/js?sensor=false"></script>
<!-- 트위터 공유 서비스 추가 -->
<script src="http://platform.twitter.com/widgets.js"></script>
<!-- 카카오 스토리 공유 서비스 추가 -->
<script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>

<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-59669559-1', 'auto');

    function ange_init($rootScope, $scope, $location, $filter) {
        $rootScope.ange_channel = <?=$channel_info?>;
        $rootScope.ange_menu = <?=$menu_info?>;

        Kakao.init('207aa395bc0cb51730547fd97ee9d369');
    }
</script>

<!-- **
일부 페이지마다 필요한 CSS은 아래와 같이 컨트롤러에서 설정해서 로드
http://plnkr.co/edit/KzjIMN
*** -->
<link ng-repeat="stylesheet in stylesheets" ng-href="{{stylesheet}}" type="text/css" rel="stylesheet" />
</head>

<body ng-controller="ange_init">

<div class="wrap">
    <div class="panel_ad" ng-include=" '/partials/ange/com/ui-ads.html' "></div>

    <!-- View가 표시될 영역 -->
    <div ui-view class="panel_content"></div>

    <div class="panel_user" ng-include=" '/partials/ange/com/ui-utility.html' "></div>
    <!--<div ng-show="role != '' && role!=null">{{role}}</div>-->
</div>

<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->
<script src="lib/require/require.js" data-main="js/ange/main.js"></script>
</body>

</html>