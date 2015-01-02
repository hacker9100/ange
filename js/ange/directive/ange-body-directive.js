/**
 * Author : Sung-hwan Kim
 * Date   : 2014-12-29
 * Description : angeBody 로드
 */
define(['./directives'], function (directives) {
    'use strict';

    directives.directive('angeBody', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: true,
//            replace: true,
//            controller: "@",
//            name: "controllerName",
            templateUrl: function(element, attr) {
                var menu = element.scope().location.split('/');
                var url = '';

                switch(menu.length) {
                    case 2 :
                        url = menu[1];
                        break;
                    case 3 :
                        url = menu[1] + '/' + menu[2];
                        break;
                    default :
                        if (menu[2] == 'angeroom' || menu[2] == 'momstalk')
                            menu[2] = 'board';

                        url = menu[1] + '/' + menu[2] + '-' + menu[3];
                        break;
                }

                return '/partials/ange/'+url+'.html';
            },
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