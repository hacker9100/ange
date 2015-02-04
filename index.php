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
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
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
<div ui-view ng-controller="ange_init" class="wrap"></div>
<!--
    requireJS를 사용하기 위한 부분으로,
    requireJS는 data-main에 설정한 main.js 파일을 최초로 로드한다.
 -->

공유
<!--<div facebook class="facebookShare" data-url='http://ange.marveltree.com' data-shares='shares'>{{ shares }}</div>-->
<!--<div facebook class="facebookShare" data-url='http://ange.marveltree.com' data-shares='shares'>{{ shares }}</div>-->
<!--<br /><br />-->
<!--<a twitter  data-lang="en" data-count='horizontal' data-url='http://localhost' data-via='앙쥬' data-size="medium" data-text='Testing Twitter Share' ></a>-->

<!--
<a href="#"
   socialshare
   socialshare-provider="facebook"
   socialshare-text="test"
   socialshare-url="http://ange.marveltree.com/story/content/list/12">
    Face Book
</a>

<a href="#"
   socialshare
   socialshare-provider="twitter"
   socialshare-text="제목입니다."
   socialshare-url="http://ange.marveltree.com"
   socialshare-hashtags="앙쥬, 유아포털">
    Twitter
</a>

<p id="post-result">KAKAO</p>

<a id="kakao-login-btn" ng-controller="kakao_share"></a>
-->

<script>
    function kakao_share($scope, $location, UPLOAD) {

        // 사용할 앱의 Javascript 키를 설정해 주세요.
        Kakao.init('207aa395bc0cb51730547fd97ee9d369');
        Kakao.Auth.createLoginButton({
            container: '#kakao-login-btn',
            success: function() {

                // 로그인 성공시, API를 호출합니다.
                Kakao.API.request( {
                    url : '/v1/api/story/linkinfo',
                    data : {
                        url : UPLOAD.BASE_URL + $location.path() + '/' + $scope.task.NO
                    }
                }).then(function(res) {
                    res.title = $scope.task.SUBJECT;
                    res.description = $scope.task.SUMMARY;
                    res.site_name = UPLOAD.BASE_URL;
                    // 이전 API 호출이 성공한 경우 다음 API를 호출합니다.
                    return Kakao.API.request( {
                        url : '/v1/api/story/post/link',
                        data : {
                            link_info : res
                        }
                    });
                }).then(function(res) {
                    return Kakao.API.request( {
                        url : '/v1/api/story/mystory',
                        data : { id : res.id }
                    });
                }).then(function(res) {
                    alert("공유 되었습니다.")
                    document.getElementById('post-result').innerHTML = JSON.stringify(res);
                }, function (err) {
                    alert(JSON.stringify(err));
                });

            },
            fail: function(err) {
                alert(JSON.stringify(err))
            }
        });
    }
</script>

<script src="lib/require/require.js" data-main="js/ange/main.js"></script>
</body>

</html>