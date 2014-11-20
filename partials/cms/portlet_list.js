/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : portlet_list.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('portlet_list', ['$scope', '$rootScope', '$location', '$controller', '$activityIndicator', function ($scope, $rootScope, $location, $controller, $activityIndicator) {
        angular.extend(this, $controller('cms_common', {$scope: $scope}));

        /********** 초기화 **********/
        // 초기화
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 5;

        /********** 이벤트 **********/
        // 목록 이동
        $scope.click_showList = function () {
            $location.url('/'+$scope.api+'/list');
        };

        // 선택
        $scope.click_showView = function (key) {
            $location.url('/'+$scope.api+'/view/'+key);
        };

        // 포틀릿 조회
        $scope.getPortlet = function (api) {
            $scope.getList(api, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                .then(function(data){$scope.list = data})
                .catch(function(error){$scope.list = [];});
        };
	}]);
});
