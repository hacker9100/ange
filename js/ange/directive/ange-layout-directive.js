/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-29
 * Description : angeLayout 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('angeLayout', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
            replace: true,
            compile: function(element, attrs){
                var menu = element.scope().location.split('/');

                if (menu.length > 2) {
                    if (menu[2] == '' || menu[2] == '') {
                        if (menu[3] == 'list') {
                            menu[2] = '';
                        } else {
                            menu[2] = '';
                        }
                    }
                }
//                element.append('<div ng-include src=" \'/partials/cms/'+menu[1]+'_'+menu[2]+'.html\' "></div>');
                element.append('<ange-body></ange-body>');
            },
//            templateUrl: function(element, attr) {
//                alert(attr.menu);
//                alert(attr.type);
//                return '/partials/cms/'+attr.menu+'_'+attr.type+'.html';
//            },
//            controller: function(element, attr) {
//                return attr.menu+'_'+attr.type;
//            },
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
//                alert("1");
            }
        }
    }]);
});