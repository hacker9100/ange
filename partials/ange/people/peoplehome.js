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
    controllers.controller('peoplehome', ['$scope', '$stateParams', '$location', '$controller', function ($scope, $stateParams, $location, $controller) {

        /********** 초기화 **********/
        // 메인 화면 모드
        $scope.slide = 'cover';
        $scope.mode = '';

        // 초기화
        $scope.init = function() {
            // ange-portlet-link-poll
            $scope.option_r1_c1 = {title: '앙쥬 설문 링크', api:'ange/poll', size: 1, url: '/people/poll'};

            // ange-portlet-channel-list
            $scope.option_r1_c2 = {title: 'Talk&Talk', api:'com/webboard', size: 10, channel: "people", type: 'board', url: '/people/board', defIdx: 0, tab: [{no: '3', menu: '/people/babycare', name: '육아방'}, {no: '2', menu: '/people/momstalk', name: '예비맘&출산맘'}, {no: '1', menu: '/people/angeroom', name: '수다방'}], image: false, head: false, date: true, nick: false};

            // ange-portlet-link-menu
            $scope.option_r1_c3 = {title: '한줄 톡', api:'ad/banner', gb: 'talk', url: '/people/linetalk/list'};

            // ange-portlet-slide-baby
            $scope.option_r2_c1 = {title: '앙쥬모델 선발대회', api:'com/webboard', size: 6, id: 'baby', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-link-menu
            $scope.option_r3_c1 = {title: '책수다방', api:'ad/banner', gb: 'book', url: '/people/booktalk/list'};

            // ange-portlet-channel-list
            $scope.option_r3_c2 = {title: '맛!맛!맛!', api:'com/webboard', size: 6, channel: "people", type: 'photo', url: '/people/board', defIdx: 0, tab: [{no: '12', menu: '/people/recipearcade', name: '레시피 아케이드'}, {no: '13', menu: '/people/peopletaste', name: '앙쥬피플 맛집'}], image: true, head: true, date: false, nick: true};

            // ange-portlet-link-menu
//            $scope.option_r3_c3 = {title: '앙쥬그룹', api:'ad/banner', gb: 'group', url: '/people/group/list'};
            $scope.option_r3_c3 = {title: '앙쥬그룹', api:'ad/banner', gb: 'group', url: ''};
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

        $scope.click_showClinicList = function (menu) {
            $location.url('/people/'+menu+'/list');
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
