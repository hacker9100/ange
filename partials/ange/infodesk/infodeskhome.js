/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : infodeskhome.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('infodeskhome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};
        $scope.faq = {};

        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        $scope.search.CONDITION = {name: "제목", value: "SUBJECT"};

        $scope.selectIdx = 0;
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        /********** 초기화 **********/
        // 초기화
        $scope.init = function(session) {
            $scope.search.COMM_NO = 53;
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.tabs = data;

                })
                ['catch'](function(error){ $scope.tabs = "";});
        };

        /********** 이벤트 **********/
        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;

            if(idx == 0){
                $scope.search.CATEGORY_NO = '';
                $scope.getFaqList();
            }else{
                $scope.search.CATEGORY_NO = category_no;
                $scope.getFaqList();
            }
        };

        // 게시판 목록 조회
        $scope.getFaqList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    console.log(data[0].TOTAL_COUNT);

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewFaq = function (item) {
            $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                .then(function(data){
                    $scope.faq = data;
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색
        $scope.click_searchFaq = function(){
            $scope.PAGE_NO = 1;
            $scope.getFaqList();
        };

        // 더보기 버튼 클릭
        $scope.click_showList = function (menu) {
            $location.url('/infodesk/'+menu+'/list');
        };

        // 리스트 선택
        $scope.click_showView = function (item) {
            if (item.COMM_NO == CONSTANT.COMM_NO_QNA && $scope.uid != item.REG_UID && item.PASSWORD_FL != '0') {
                dialogs.notify('알림', '비밀글입니다. 작성자와 관리자만 볼 수 있습니다.', {size: 'md'});
                return;
            }

            var menu = '';

            switch(item.COMM_NO) {
                case '51' :
                    menu = 'notice';
                    break;
                case '52' :
                    menu = 'system';
                    break;
                case CONSTANT.COMM_NO_QNA :
                    menu = 'qna';
                    break;
            }

            $location.url("infodesk/"+menu+'/view/'+item.NO);
        };

        // 리스트 조회
        $scope.getNoticeList = function () {
            $scope.getList('com/webboard', 'main', {NO: 0, SIZE: 10}, {COMM_NO_IN: CONSTANT.COMM_NO_NOTICE}, true)
                .then(function(data){
                    $scope.noticeList = data;
                })
                ['catch'](function(error){$scope.list = [];});
        };

        // 리스트 조회
        $scope.getQnaList = function () {
            $scope.getList('com/webboard', 'main', {NO: 0, SIZE: 10}, {COMM_NO_IN: CONSTANT.COMM_NO_QNA}, true)
                .then(function(data){
                    $scope.qnaList = data;
                })
                ['catch'](function(error){$scope.list = [];});
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getFaqList();
        $scope.getNoticeList();
        $scope.getQnaList();

    }]);
});
