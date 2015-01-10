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
                        url = menu[1] + '/' + menu[1] + menu[2];
                        break;
                    default :
                        // 앙쥬스토리
                        if (menu[1] == 'story') {
                            menu[2] = 'content';
                        // 앙쥬피플
                        } else if (menu[2] == 'angeroom' || menu[2] == 'momstalk' || menu[2] == 'babycare' || menu[2] == 'firstbirthtalk' || menu[2] == 'booktalk'){
                            menu[2] = 'board';
                        } else if (menu[2] == 'angemodel' || menu[2] == 'recipearcade' || menu[2] == 'peopletaste'){
                            menu[2] = 'photo';
                        } else if (menu[2] == 'childdevelop' || menu[2] == 'chlidoriental' || menu[2] == 'obstetrics' || menu[2] == 'momshealth' || menu[2] == 'financial'){
                            menu[2] = 'clinic';
//                        }else if (menu[2] == 'poll'){
//                            menu[2] = 'poll';
                        // 앙쥬맘스
                        } else if (menu[2] == 'experienceprocess' || menu[2] == 'experiencepast') {
                            menu[2] = 'experience';
                        } else if (menu[2] == 'eventprocess' || menu[2] == 'eventperformance') {
                            menu[2] = 'event';
                        } else if (menu[2] == 'experiencewinner' || menu[2] == 'eventwinner' || menu[2] == 'supporterboard') {
                            menu[2] = 'board';
                        } else if (menu[2] == 'experiencereview' || menu[2] == 'productreview' || menu[2] == 'angereview' || menu[2] == 'samplereview' || menu[2] == 'samplepackreview'|| menu[2] == 'eventreview') {
                            menu[2] = 'review';
                        } else if (menu[2] == 'ranknow' || menu[2] == 'rankbest') {
                            menu[2] = 'rank';
                        // 앙쥬스토어
                        } else if (menu[2] == 'mileagemall' || menu[2] == 'cummerce') {
                            menu[2] = 'mall';
                        }

                        url = menu[1] + '/' + menu[1] + menu[2] + '-' + menu[3];
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