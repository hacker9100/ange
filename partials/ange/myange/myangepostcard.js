/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangemessage.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangepostcard', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getCompList();
        };

        // 초기화
        $scope.init = function(session) {
            $scope.community = "이벤트/응모 신청내역";
        };

        $scope.getCompList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.getList('ange/comp', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getCompList();
        /*$scope.viewCheckFl();*/

    }]);
});
