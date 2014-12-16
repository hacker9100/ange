/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : portletList 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('cmsPortletList', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: { code:'=' },
            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/cms/'+attr.type+'-list.html';
            },
            controller: 'portlet-list',
//            controller: function($scope, $location) {
//                angular.extend(this, $controller('cms-common', {$scope: $scope}));
//
//                /********** 초기화 **********/
//                // 초기화
//                $scope.PAGE_NO = 0;
//                $scope.PAGE_SIZE = 5;
//
//                /********** 이벤트 **********/
//                // 목록 이동
//                $scope.click_showList = function () {
//                    $location.url('/'+$scope.api+'/list');
//                };
//
//                // 선택
//                $scope.click_showView = function (key) {
//                    $location.url('/'+$scope.api+'/view/'+key);
//                };
//
//                // 포틀릿 조회
//                $scope.getPortlet = function (api) {
//                    $scope.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
//                        .then(function(data){$scope.list = data})
//                        .catch(function(error){$scope.list = [];  alert(error)});
//                };
//            },
            link: function (scope, element, attr) {
                scope.url = attr.url;
                scope.api = attr.api;
                scope.portletTitle = attr.title;
                scope.portletCss = attr.css;
                scope.getPortlet(attr.api);
            }
        }
    }]);
});