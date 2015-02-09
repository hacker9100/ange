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
                var path = element.scope().location.split('/');
                var ange_menu = element.scope().ange_menu;
                var menu = null;
                var url = '';

                for (var i=0; i<ange_menu.length; i++) {
                    if (ange_menu[i].MENU_ID.indexOf(path[2]) > -1) {
                        menu = ange_menu[i];
                    }
                }

                switch(path.length) {
                    case 2 :
                        url = path[1];
                        break;
                    case 3 :
                        url = path[1] + '/' + path[1] + path[2];
                        break;
                    default :
                        // 앙쥬스토리
                        if (path[1] == 'story') {
                            path[2] = 'content';
                        // 앙쥬피플
                        } if (path[1] == 'people') {
                            if (menu.COMM_GB != null) {
                                path[2] = angular.lowercase(menu.COMM_GB);
                            }

//                            if (path[2] == 'angeroom' || path[2] == 'momstalk' || path[2] == 'babycare' || path[2] == 'firstbirthtalk' || path[2] == 'booktalk'){
//                                path[2] = 'board';
//                            } else if (path[2] == 'angemodel' || path[2] == 'recipearcade' || path[2] == 'peopletaste'){
//                                path[2] = 'photo';
//                            } else if (path[2] == 'childdevelop' || path[2] == 'chlidoriental' || path[2] == 'obstetrics' || path[2] == 'momshealth' || path[2] == 'financial'){
//                                path[2] = 'clinic';
//                            }
    //                        }else if (path[2] == 'poll'){
    //                            path[2] = 'poll';
                        // 앙쥬맘스
                        } else if (path[2] == 'experienceprocess' || path[2] == 'experiencepast') {
                            path[2] = 'experience';
                        } else if (path[2] == 'eventprocess' || path[2] == 'eventperformance') {
                            path[2] = 'event';
                        } else if (path[2] == 'experiencewinner' || path[2] == 'eventwinner' || path[2] == 'supporterboard' || path[2] == 'postwinner') {
                            path[2] = 'board';
                        } else if (path[2] == 'experiencereview' || path[2] == 'productreview' || path[2] == 'angereview' || path[2] == 'samplereview' || path[2] == 'samplepackreview'|| path[2] == 'eventreview') {
                            path[2] = 'review';
                        } else if (path[2] == 'ranknow' || path[2] == 'rankbest') {
                            path[2] = 'rank';
                        // 앙쥬스토어
                        } else if (path[2] == 'mileagemall' || path[2] == 'cummerce') {
                            path[2] = 'mall';
                        }
                        // 고객센터
                        else if (path[2] == 'notice' || path[2] == 'system' || path[2] == 'faq') {
                            path[2] = 'board';
                        }else if(path[2] == 'qna' || path[2] == 'myqna'){
                            path[2] = 'board';
                        }

                        url = path[1] + '/' + path[1] + path[2] + '-' + path[3];
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