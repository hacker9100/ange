/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : portlet_list.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('portlet_list', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {

        /********** 초기화 **********/
        // 초기화
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 5;

        /********** 이벤트 **********/
        // 목록 이동
        $scope.click_showList = function () {
            $location.url('/'+$scope.url+'/list');
        };

        // 선택
        $scope.click_showView = function (key) {
            $location.url('/'+$scope.url+'/view/'+key);
        };

        // 포틀릿 조회
        $scope.getPortlet = function (api) {
            $scope.isLoading = true;
            $scope.$parent.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {SYSTEM_GB: 'CMS', NOTICE_FL: 'Y'}, true)
                .then(function(data){$scope.list = data})
                .catch(function(error){$scope.list = []; console.log(error);})
                .finally(function(){$scope.isLoading = false;});
        };
	}]);
});
