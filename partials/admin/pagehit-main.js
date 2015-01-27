/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : pagehit-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('pagehit-main', ['$scope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 목록 데이터
        $scope.list = [];

        // 초기화
        $scope.init = function() {
            // 검색조건
            var period = [{name: "이름", value: "USER_NM", index: 0}, {name: "아이디", value: "USER_ID", index: 1}, {name: "닉네임", value: "NICK_NM", index: 2}, {name: "전화번호", value: "PHONE", index: 3}, {name: "주소", value: "ADDR", index: 4}, {name: "이메일", value: "EMAIL", index: 5}, {name: "생일", value: "BIRTH", index: 6}, {name: "가입기간", value: "REG_DT", index: 7}];
        };

        /********** 이벤트 **********/
        // 목록갱신 버튼 클릭
        $scope.click_refresh = function () {
            $scope.getSessionCount();
        };

        // 세션수 조회
        $scope.getSessionCount = function () {
            $scope.getItem('com/user', 'session', {}, {}, true)
                .then(function(data){
                    alert(JSON.stringify(data))
                })
                .catch(function(error){});
        };

        // 사용자 목록 조회
        $scope.getUserList = function () {
            $scope.getList('com/user', 'statistics', {NO:0, SIZE:5}, $scope.search, true)
                .then(function(data){
                    $scope.list = data;
                })
                .catch(function(error){alert(error)});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getSessionCount();
        $scope.getUserList();
    }]);
});
