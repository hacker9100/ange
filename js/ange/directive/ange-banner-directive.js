/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : portletList 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('angeBannerSlide', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: { images:'=' },
//            replace: true,
            template: '<slider images="images"/>',
            controller: ['$scope', '$location', '$window', function($scope, $location, $window) {

                /********** 공통 콘트롤러 호출 **********/
                angular.extend(this, $controller('ange-common', {$scope: $scope}));
                /********** 초기화 **********/

                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = 5;

                // 테스트 이미지
                $scope.images = [
                    {src: '../../../imgs/ange/img/img00.jpg', description: 'Image 00'},
                    {src: '../../../imgs/ange/img/img01.jpg', description: 'Image 01'},
                    {src: '../../../imgs/ange/img/img02.jpg', description: 'Image 02'},
                    {src: '../../../imgs/ange/img/img03.jpg', description: 'Image 03'},
                    {src: '../../../imgs/ange/img/img04.jpg', description: 'Image 04'}
                ];

                /********** 이벤트 **********/
                // 배너 클릭
                $scope.click_linkBanner = function (url) {
                    $window.open(url, '', 'width=400,height=500');
                };

                // 이미지 조회
                $scope.getBanner = function (api) {
                    $scope.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){$scope.list = data})
                        .catch(function(error){$scope.list = [];  alert(error)});
                };
            }],
            link: function (scope, element, attr) {
                scope.url = attr.url;
                scope.api = attr.api;
                scope.portletTitle = attr.title;
                scope.portletCss = attr.css;
//                scope.getBanner(attr.api);
            }
        }
    }]);

    directives.directive('angeBannerLink', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: { images:'=' },
//            replace: true,
            template: function (scope, element, attr) { return '<img ng-src="{{image}}" ng-click="click_linkBanner()"/>'},
            controller: ['$scope', '$location', '$window', function($scope, $location, $window) {
                console.log('angeBannerRolling');
                /********** 공통 콘트롤러 호출 **********/
                angular.extend(this, $controller('ange-common', {$scope: $scope}));
                /********** 초기화 **********/

                $scope.image = '../../../imgs/ange/img/img00.jpg';
                $scope.url = '//google.co.kr';

                /********** 이벤트 **********/
                // 배너 클릭
                $scope.click_linkBanner = function () {
                    alert($scope.url)
                    $window.open($scope.url, '', 'width=400,height=500');
                };

                // 이미지 조회
                $scope.getBanner = function (api) {
                    $scope.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){$scope.list = data})
                        .catch(function(error){$scope.list = [];  alert(error)});
                };
            }],
            link: function (scope, element, attr) {
                scope.url = attr.url;
                scope.api = attr.api;
                scope.portletTitle = attr.title;
                scope.portletCss = attr.css;
//                scope.getBanner(attr.api);
            }
        }
    }]);
});