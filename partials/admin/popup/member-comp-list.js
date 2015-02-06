/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : member-comp-list.html 화면 콘트롤러
 */

define([
    '../../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('member-comp-list', ['$scope', '$location', 'dialogs', 'ngTableParams', function ($scope, $location, dialogs, ngTableParams) {

        /********** 초기화 **********/
        // 목록 데이터
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_CNT = 0;

        if (!$scope.isModal) {
            $scope._search = {};
        }

        // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
        // 마일리지 목록 조회
        $scope.getCompList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,                    // show first page
                count: $scope.PAGE_SIZE,    // count per page
                sorting: {                  // initial sorting
                    REG_DT: 'DESC'
                }
            }, {
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope._search['SORT'] = key;
                    $scope._search['ORDER'] = params.sorting()[key];

                    $scope.getList('ange/comp', 'list', {NO: params.page() - 1, SIZE: $scope.PAGE_SIZE}, $scope._search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_CNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);
                        })
                        .catch(function(error){$scope.TOTAL_CNT = 0; $defer.resolve([]);});
                }
            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getCompList();

    }]);
});
