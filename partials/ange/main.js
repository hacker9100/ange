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
    controllers.controller('main', ['$scope', '$stateParams', '$location', '$controller', 'CONSTANT', function ($scope, $stateParams, $location, $controller, CONSTANT) {

        /********** 초기화 **********/
        // 메인 화면 모드
        $scope.slide = 'cover';
        $scope.mode = '';

        // 초기화
        $scope.init = function() {
            // ange-portlet-slide-banner
            $scope.option_r1_c1 = {title: '롤링 배너', api:'ad/banner', size: 99, id: 'main', type: 'banner', gb: CONSTANT.AD_CODE_BN05, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-link-image
            $scope.option_r2_c2 = {title: '이벤트 배너', api:'ad/banner', size: 1, gb: CONSTANT.AD_CODE_BN06, link: true, open: true, image: '/imgs/ange/temp/temp_maineventbanner.png'};

            // ange-portlet-moms-list
//            $scope.option_r2_c1 = {title: '앙쥬스토리', api:'cms/task', size: 5, id: 'story', type: 'content', url: '/story/content/list', defIdx: 0, tab: [{no: '0', menu: 'popular', name: '인기'}, {no: '1', menu: 'current', name: '최신'}, {no: '2', menu: 'fit', name: '추천[맞춤서비스]'}], image: true, head: true, date: false, nick: true};
            $scope.option_r2_c1 = {title: '앙쥬스토리', api:'cms/task', size: 5, id: 'story', type: 'content', url: '/story/content/list', defIdx: 0, tab: [{no: '0', menu: 'popular', name: '인기'}, {no: '1', menu: 'current', name: '최신'}], image: true, head: true, date: false, nick: true};

            // ange-portlet-basic-list
            $scope.option_r3_c2 = {title: '앙쥬피플', api:'com/webboard', size: 5, type: 'board', url: '/people/home', image: false, head: true, date: false, nick: false};

            // ange-portlet-slide-page
            $scope.option_r4_c1 = {title: '체험단&이벤트', api:'ange/event', size: 6, url: '/moms/home', id: 'event', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-piece-image
            $scope.option_r5_c1 = {title: '도전 앙쥬모델', api:'com/webboard', size: 10, type: 'photo', url: '/people/angemodel'};

            // ange-portlet-basic-list
            $scope.option_r5_c2 = {title: '전문가상담', api:'com/webboard', size: 3, type: 'clinic', url: '/people/chlidoriental/list', image: false, head: false, date: false, nick: false};

            // ange-portlet-basic-list
            $scope.option_r6_c1 = {title: '앙쥬후기', api:'ange/review', size: 5, type: 'review', url: '/moms/review', defIdx: 2, tab: [{no: 'sample', menu: 'samplereview', name: '샘플팩'}, {no: 'product', menu: 'productreview', name: '상품'}, {no: 'ange', menu: 'angereview', name: '앙쥬'}], image: true, head: false, date: false, nick: true};

            // ange-portlet-basic-list
            $scope.option_r6_c2 = {title: '공지사항&당첨자발표', api:'com/webboard', size: 5, type: 'notice', url: '/infodesk/notice/list', image: false, head: false, date: false, nick: false};
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
                angular.element('#main').slickPrev();

                $scope.slide = slide;
                $scope.mode = 'pan';
            } else {
                angular.element('#main').slickPrev();

                $scope.slide = 'cover';
                $scope.mode = '';
            }
        };

        $scope.click_moveMenu = function(menu) {
            $location.url(menu);
        };

        $scope.main1 = [];
        $scope.main2 = [];

        // 메뉴 목록 조회
        $scope.getStoryList = function () {
            $scope.getList('com/task', 'main', {}, {SYSTEM_GB: 'ANGE', MENU_ID: 'home'}, false)
                .then(function(data){

                })
                ['catch'](function(error){alert(error)});
            }


        // 메뉴 목록 조회
        $scope.getMenuList = function () {
            $scope.getList('com/menu', 'submenu', {}, {SYSTEM_GB: 'ANGE', MENU_ID: 'home'}, false)
                .then(function(data){
                    for (var i=0; i<data.length; i++) {
                        var file = data[i].FILES;
                        for(var j in file) {
                            if (file[j].FILE_GB == 'ICON')
                                data[i].ICON_IMAGE = CONSTANT.BASE_URL+file[j].PATH+file[j].FILE_ID;
                            else
                                data[i].DETAIL_IMAGE = CONSTANT.BASE_URL+file[j].PATH+file[j].FILE_ID;
                        }

                        if (data[i].COLUMN_ORD == '1') {
                            $scope.main1.push(data[i]);
                        } else if (data[i].COLUMN_ORD == '2') {
                            $scope.main2.push(data[i]);
                        }
                    }

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                ['catch'](function(error){alert(error)});
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getMenuList();
    }]);
});
