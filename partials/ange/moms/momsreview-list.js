/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsreivew-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsreview-list', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {


        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);

            // 페이징
            $scope.PAGE_NO = 1;
            $scope.PAGE_SIZE = 10;
            $scope.TOTAL_COUNT = 0;

            $scope.list = [];
            $scope.getPeopleBoardList();
        };

        // 초기화
        $scope.init = function(session) {

            $scope.search.BOARD_ST = 'D';

            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "체험단/서평단 후기";
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            } else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.search['TARGET_GB'] = 'EVENT';
            } else if ($stateParams.menu == 'bookreview') {
                $scope.community = "북카페 후기";
                $scope.search['TARGET_GB'] = 'BOOK';
            } else if ($stateParams.menu == 'dolreview') {
                $scope.community = "앙쥬돌 후기";
                $scope.search['TARGET_GB'] = 'DOL';
            }
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        // 게시판 목록 조회
        $scope.getMomsReviewList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/
            $scope.search.FILE = true;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {

                        console.log(data[i].FILE.PATH);
                        // /storage/review/

                        var img = UPLOAD.BASE_URL + '/storage/review/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.list.push(data[i]);
                    }
                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//            if ($stateParams.menu == 'experiencereview') {
//                $location.url('/moms/experiencereview/view/'+key);
//            } else if ($stateParams.menu == 'productreview') {
//                $location.url('/moms/productreview/view/'+key);
//            } else if ($stateParams.menu == 'angereview') {
//                $location.url('/moms/angereview/view/'+key);
//            } else if ($stateParams.menu == 'samplereview') {
//                $location.url('/moms/samplereview/view/'+key);
//            } else if ($stateParams.menu == 'samplepackreview') {
//                $location.url('/moms/samplepackreview/view/'+key);
//            }else if ($stateParams.menu == 'eventreview') {
//                $location.url('/moms/eventreview/view/'+key);
//            }

        };

        // 등록 버튼 클릭
        $scope.click_showCreateReview = function () {

            if ($scope.uid == '' || $scope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');

//            if ($stateParams.menu == 'experiencereview') {
//                $location.url('/moms/experiencereview/edit/0');
//            } else if ($stateParams.menu == 'productreview') {
//                $location.url('/moms/productreview/edit/0');
//            } else if ($stateParams.menu == 'angereview') {
//                $location.url('/moms/angereview/edit/0');
//            } else if ($stateParams.menu == 'samplereview') {
//                $location.url('/moms/samplereview/edit/0');
//            } else if ($stateParams.menu == 'samplepackreview') {
//                $location.url('/moms/samplepackreview/edit/0');
//            }else if ($stateParams.menu == 'eventreview') {
//                $location.url('/moms/eventreview/edit/0');
//            }

        };

        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
            $scope.getMomsReviewList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);


        $scope.init();
        $scope.getMomsReviewList();

    }]);
});
