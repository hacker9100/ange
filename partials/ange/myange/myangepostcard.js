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
    controllers.controller('myangepostcard', ['$rootScope', '$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD','CONSTANT', function ($rootScope, $scope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
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
            $scope.search.USER_ID = $rootScope.uid;
            $scope.getList('ange/comp', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCompList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.getCompList();
        /*$scope.viewCheckFl();*/

    }]);
});
