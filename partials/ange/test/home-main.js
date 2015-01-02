/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('home-main', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {
            $scope.option_r6_c1 = {title: '롤링 배너', api:'ad/banner', dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            $scope.option_r7_c1 = {title: '이벤트 배너', api:'ad/banner', link: true, new: true, image: '../../../imgs/ange/img/img00.jpg'};

            $scope.option_r7_c2 = {title: '커뮤니티', api:'com/webboard', url: '/people/board', image: false, head: true, date: false, nick: false};

            $scope.option_r1_c1 = {title: '앙쥬 POLL', api:'ange/poll', url: '/people/poll', banner: false, link: false};

            $scope.option_r1_c2 = {title: 'Talk&Talk', api:'com/webboard', url: '/people/board', tab: [{no: '1', menu: 'suda', name: '수다방'}, {no: '2', menu: 'yebi', name: '예비맘&출산맘'}], image: false, head: false, date: true, nick: false};
//            $scope.option_r1_c2 = {title: 'Talk&Talk', api:'com/webboard', url: '/people/board', image: false, head: false, date: true, nick: false};

            $scope.option_r1_c3 = {title: '한줄톡', url: '/people/talk/edit', link: false, image: '../../../imgs/ange/img/img00.jpg'};

            $scope.option_r2_c1 = {title: '앙쥬 베이비 모델', autoplay: true, centerMode: true, showNo: 5, fade: false};

            $scope.option_r3_c2 = {title: '맛!맛!맛!', api:'com/webboard', url: '/people/board', tab: [{no: '0', menu: 'suda', name: '앙쥬피플 맛집'}, {no: '1', menu: 'yebi', name: '레시피 아케이드'}], image: true, head: true, date: false, nick: true};


//            $scope.items = [
//                {src: '../../../imgs/ange/img/img00.jpg', description: 'Image 00'},
//                {src: '../../../imgs/ange/img/img01.jpg', description: 'Image 01'},
//                {src: '../../../imgs/ange/img/img02.jpg', description: 'Image 02'},
//                {src: '../../../imgs/ange/img/img03.jpg', description: 'Image 03'},
//                {src: '../../../imgs/ange/img/img04.jpg', description: 'Image 04'},
//                {src: '../../../imgs/ange/img/img00.jpg', description: 'Image 00'},
//                {src: '../../../imgs/ange/img/img01.jpg', description: 'Image 01'},
//                {src: '../../../imgs/ange/img/img02.jpg', description: 'Image 02'},
//                {src: '../../../imgs/ange/img/img03.jpg', description: 'Image 03'},
//                {src: '../../../imgs/ange/img/img04.jpg', description: 'Image 04'}
//            ];
            $scope.items = [
                {src: '../../../storage/cms/thumbnail/548fe2e3ce16c', description: 'Image 00'},
                {src: '../../../storage/cms/thumbnail/5488f0d97f8f5', description: 'Image 01'},
                {src: '../../../storage/cms/thumbnail/54811d6d061c9', description: 'Image 02'},
                {src: '../../../storage/cms/thumbnail/54880cc4705d5', description: 'Image 03'},
                {src: '../../../storage/cms/thumbnail/548124ae6f650', description: 'Image 04'},
                {src: '../../../storage/cms/thumbnail/548124ae636e5', description: 'Image 00'},
                {src: '../../../storage/cms/thumbnail/548124ae7773a', description: 'Image 01'}
            ];
        };

        /********** 이벤트 **********/

        // 프로젝트 목록 조회
        $scope.getProjectList = function (search) {
            $scope.getList('project', {NO:0, SIZE:5}, search, true)
                .then(function(data){$scope.list = data;})
                .catch(function(error){alert(error)});
        };

        /********** 화면 초기화 **********/
        $scope.init();

    }]);
});
