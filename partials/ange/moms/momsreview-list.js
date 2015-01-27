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

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 초기화
        $scope.init = function(session) {
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
            }else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.search['TARGET_GB'] = 'EVENT';
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
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }
                    $scope.list = data;
                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            if ($stateParams.menu == 'experiencereview') {
                $location.url('/moms/experiencereview/view/'+key);
            } else if ($stateParams.menu == 'productreview') {
                $location.url('/moms/productreview/view/'+key);
            } else if ($stateParams.menu == 'angereview') {
                $location.url('/moms/angereview/view/'+key);
            } else if ($stateParams.menu == 'samplereview') {
                $location.url('/moms/samplereview/view/'+key);
            } else if ($stateParams.menu == 'samplepackreview') {
                $location.url('/moms/samplepackreview/view/'+key);
            }else if ($stateParams.menu == 'eventreview') {
                $location.url('/moms/eventreview/view/'+key);
            }

        };

        // 등록 버튼 클릭
        $scope.click_showCreateReview = function () {

            if ($scope.uid == '' || $scope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }


            if ($stateParams.menu == 'experiencereview') {
                $location.url('/moms/experiencereview/edit/0');
            } else if ($stateParams.menu == 'productreview') {
                $location.url('/moms/productreview/edit/0');
            } else if ($stateParams.menu == 'angereview') {
                $location.url('/moms/angereview/edit/0');
            } else if ($stateParams.menu == 'samplereview') {
                $location.url('/moms/samplereview/edit/0');
            } else if ($stateParams.menu == 'samplepackreview') {
                $location.url('/moms/samplepackreview/edit/0');
            }else if ($stateParams.menu == 'eventreview') {
                $location.url('/moms/eventreview/edit/0');
            }

        };

        $scope.click_searchPeopleBoard = function(){
            $scope.getMomsReviewList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);


        $scope.init();
        $scope.getMomsReviewList();

    }]);
});
