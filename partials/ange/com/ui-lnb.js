/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-30
 * Description : ui-lnb.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('ui-lnb', ['$scope', '$rootScope', '$stateParams', '$controller', '$location', '$filter', 'dialogs', function ($scope, $rootScope, $stateParams, $controller, $location, $filter, dialogs) {

        /********** 페이지 타이틀 **********/
//        angular.forEach($rootScope.ange_menu, function(menu) {
//
//            if (menu.MENU_URL.indexOf(spMenu[1]+"/") > -1) {
//                $scope.$parent.$parent.pageTitle = menu.MENU_NM;
//                $scope.$parent.$parent.pageDescription = menu.MENU_DESC;
//                $scope.$parent.$parent.tailDescription = menu.TAIL_DESC;
//
//                return;
//            }
//        });

        /********** 초기화 **********/
        // 선택 카테고리
        $scope.CATEGORY = [];

        // 카테고리 데이터
        $scope.category = [];

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {}, false).then(function(data){

                $scope.category = data;

                var category_a = [];
                var category_b = [];

                for (var i in data) {
                    var item = data[i];

                    if (item.CATEGORY_GB == '1' && item.CATEGORY_ST == '0') {
                        category_a.push(item);
                    } else if (item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO == '0') {
                        category_b.push(item);
                    }
                }

                $scope.category_a = category_a;
                $scope.category_b = category_b;
            })
            .catch(function(error){$scope.projects = []; console.log(error)});
        };

        // 카테고리 주제 대분류 선택
        $scope.$watch('CATEGORY_M', function(data) {
            var category_s = [];

            if (data != undefined) {
                for (var i in $scope.category) {
                    var item = $scope.category[i];

                    if (item.PARENT_NO == data.NO && item.CATEGORY_GB == '2' && item.CATEGORY_ST == '0' && item.PARENT_NO != '0') {
                        category_s.push(item);
                    }
                }
            }
            $scope.category_s = category_s;
        });

        /********** 좌측 메뉴 **********/
//        var menu = $filter('filter')($rootScope.ange_menu, function (data) {
//            return (data.MENU_URL.indexOf(menu[1]) > -1)
//        })[0];

        var channelNo = "2";

        var channel = $filter('filter')($rootScope.ange_channel, function (data) {
            return data.CHANNEL_NO === channelNo;
        })[0];

        $scope.item = channel;

//        $scope.selectMenu = function(menu) {
//            if ($scope.permissionCheck(menu.MENU_URL, false)) {
//                $location.url(menu.MENU_URL);
//            }
//        };
//
//        $scope.nowMenu = spMenu[1];
        //alert(spMenu[1]);

	}]);
});
