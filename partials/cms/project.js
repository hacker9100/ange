/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers',
    './project_list',
    './project_edit',
    './project_view'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('project', ['$scope', '$stateParams', 'loginService', '$location', function ($scope, $stateParams, loginService, $location) {

        var search = $location.search();

        $scope.method = search._method;
        $scope.isId = $stateParams.id == 0 || $stateParams.id == undefined ? false : true;

//        alert(localStorage.getItem('userToken'))

        $scope.logout = function() {
            loginService.logout().then( function(data) {
                $location.path('/signin');
            });
        };

    }]);
});
