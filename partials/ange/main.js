/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-29
 * Description : main.html 화면 콘트롤러
 */

define([
    '../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('main', ['$scope', '$stateParams', '$location', '$controller', function ($scope, $stateParams, $location, $controller) {

        /********** 초기화 **********/
        // 메인 화면 모드
        $scope.slide = 'cover';
        $scope.mode = '';

        // 초기화
        $scope.init = function() {
            // ange-portlet-slide-banner
            $scope.option_r1_c1 = {title: '롤링 배너', api:'ad/banner', size: 5, id: 'main', gb: 0, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-link-image
            $scope.option_r2_c2 = {title: '이벤트 배너', api:'ad/banner', size: 1, gb: 1, link: true, new: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};

            // ange-portlet-basic-list
            $scope.option_r3_c2 = {title: '커뮤니티', api:'com/webboard', size: 5, type: 'board', url: '/people/board', image: false, head: true, date: false, nick: false};

            // ange-portlet-slide-page
            $scope.option_r4_c1 = {title: '체험단&이벤트', api:'ange/event', size: 6, id: 'event', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-piece-image
            $scope.option_r5_c1 = {title: '도전 앙쥬모델', api:'com/webboard', size: 10, type: 'photo', url: '/people/board'};

            // ange-portlet-basic-list
            $scope.option_r5_c2 = {title: '전문가상담', api:'com/webboard', size: 3, type: 'clinic', url: '/people/board', image: false, head: false, date: false, nick: false};

            // ange-portlet-basic-list
            $scope.option_r6_c1 = {title: '앙쥬후기', api:'ange/review', size: 5, type: 'review', url: '/people/board', tab: [{no: '1', menu: 'shop', name: '상품'}, {no: '0', menu: 'ange', name: '앙쥬'}], image: false, head: true, date: false, nick: true};

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