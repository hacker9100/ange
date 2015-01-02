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
    controllers.controller('user-list', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        $scope.portelt1 = {title: ''};

        /********** 초기화 **********/
        // 초기화
        $scope.init = function() {

        };

        $scope.images1 = [
            {src: '../../../imgs/ange/img/img04.jpg', description: 'Image 04'},
            {src: '../../../imgs/ange/img/img03.jpg', description: 'Image 03'},
            {src: '../../../imgs/ange/img/img02.jpg', description: 'Image 02'},
            {src: '../../../imgs/ange/img/img01.jpg', description: 'Image 01'},
            {src: '../../../imgs/ange/img/img00.jpg', description: 'Image 00'}
        ];

        $scope.click = function() {
            alert("클릭");
        }

//        $scope.myInterval = 3000;
        $scope.myInterval = 10000000;

        var i, first = [],
            second, third;
        var many = 2;

        for (i = 0; i < $scope.images1.length; i += many) {
            second = {
                slide1: $scope.images1[i]
            };
            if (many == 1) {}
            if ($scope.images1[i + 1] && (many == 2 || many == 3)) {
                second.slide2 = $scope.images1[i + 1];
            }
            first.push(second);
        }

        $scope.groupedSlides = first;


        $scope.test1 = [
            {subject : '상품1', regNm :'홍길동1'},
            {subject : '상품2', regNm :'홍길동2'},
            {subject : '상품3', regNm :'홍길동3'},
            {subject : '상품4', regNm :'홍길동4'},
            {subject : '상품5', regNm :'홍길동5'}
        ];

        $scope.test2 = [
            {subject : '상품11', regNm :'홍길동1'},
            {subject : '상품21', regNm :'홍길동2'},
            {subject : '상품31', regNm :'홍길동3'},
            {subject : '상품41', regNm :'홍길동4'},
            {subject : '상품51', regNm :'홍길동5'}
        ];

        $scope.test3 = [
            {subject : '상품12', regNm :'홍길동1'},
            {subject : '상품22', regNm :'홍길동2'},
            {subject : '상품32', regNm :'홍길동3'},
            {subject : '상품42', regNm :'홍길동4'},
            {subject : '상품52', regNm :'홍길동5'}
        ];

        $scope.tabs = [
            {title : '상품', content : $scope.test1},
            {title : '앙쥬', content : $scope.test2 },
            {title : '샘플팩', content : $scope.test3}
        ];

        $scope.tabs1 = [
            {title : '공지사항', content : $scope.test3},
            {title : 'FAQ', content : $scope.test2},
            {title : 'QNA', content : $scope.test1}
        ];

        /********** 화면 초기화 **********/
        $scope.init();

    }]);
});
