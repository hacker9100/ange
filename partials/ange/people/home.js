/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : home.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('home', ['$scope', '$stateParams', '$location', '$controller', function ($scope, $stateParams, $location, $controller) {

        /********** 초기화 **********/
        // 메인 화면 모드
        $scope.slide = 'cover';
        $scope.mode = '';

        // 초기화
        $scope.init = function() {
            // ange-portlet-link-poll
            $scope.option_r1_c1 = {title: '앙쥬 설문 링크', api:'ange/poll', size: 1};

            // ange-portlet-basic-list
            $scope.option_r1_c2 = {title: 'Talk&Talk', api:'com/board', size: 5, channel: "people", type: 'people', url: '/people/board', tab: [{no: '0', menu: 'dol', name: '돌잔치톡'}, {no: '1', menu: 'bady', name: '육아방'}, {no: '2', menu: 'bady', name: '예비맘&출산맘'}, {no: '3', menu: 'suda', name: '수다방'}], image: false, head: false, date: true, nick: false};

            // ange-portlet-link-menu
            $scope.option_r1_c3 = {title: '한줄 톡', api:'ad/banner', gb: 'talk', url: '/people/talk/list'};

            // ange-portlet-slide-baby
            $scope.option_r2_c1 = {title: '앙쥬모델 선발대회', api:'ange/event', size: 6, id: 'baby', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-link-menu
            $scope.option_r3_c1 = {title: '책수다방', api:'ad/banner', gb: 'book', url: '/people/book/list'};

            // ange-portlet-basic-list
            $scope.option_r3_c2 = {title: '맛!맛!맛!', api:'com/board', size: 6, channel: "people", type: 'people', url: '/people/board', tab: [{no: '0', menu: 'dol', name: '레시피 아케이드'}, {no: '1', menu: 'bady', name: '앙쥬피플 맛집'}], image: true, head: true, date: false, nick: true};

            // ange-portlet-link-menu
            $scope.option_r3_c3 = {title: '앙쥬그룹', api:'ad/banner', gb: 'group', url: '/people/group/list'};



            // ange-portlet-slide-page
            $scope.option_r4_c1 = {title: '체험단&이벤트', api:'ange/event', size: 6, id: 'event', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-piece-image
            $scope.option_r5_c1 = {title: '도전 앙쥬모델', api:'com/webboard', size: 10, type: 'photo', url: '/people/board'};

            // ange-portlet-basic-list
            $scope.option_r5_c2 = {title: '전문가상담', api:'com/webboard', size: 3, type: 'clinic', url: '/people/board', image: false, head: false, date: false, nick: false};

            // ange-portlet-basic-list
            $scope.option_r6_c2 = {title: '공지사항&당첨자발표', api:'com/webboard', size: 5, type: 'board', url: '/people/board', image: false, head: true, date: false, nick: false};
        };

        /********** 이벤트 **********/
        // 우측 메뉴 클릭
        $scope.click_showSlide = function(slide, mode) {
            $scope.slide = slide;
            $scope.mode = mode;
        };

        $scope.click_toggleSlide = function(slide) {
            if ($scope.slide != slide && $scope.mode != '') {
                $scope.slide = slide;
            } else if ($scope.slide != slide && $scope.mode == '') {
                $scope.slide = slide;
                $scope.mode = 'pan';
            } else {
                $scope.slide = 'cover';
                $scope.mode = '';
            }
        };

        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        /********** 화면 초기화 **********/
        $scope.init();

    }]);
});
