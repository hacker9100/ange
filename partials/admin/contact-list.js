/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : contact-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('contact-list', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'ngTableParams', function ($scope, $stateParams, $location, $filter, dialogs, ngTableParams) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};

        if (!$scope.isModal) {
            $scope.search = {};
        }

        // 초기화
        $scope.init = function() {
            $scope.getList('com/permission', 'list', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.roles = data;
                    $scope.user_roles = data;
                    $scope.item.ROLE = data[0];
                })
                .catch(function(error){console.log(error);});
        };

        /********** 이벤트 **********/
        // 검색 버튼 클릭
        $scope.click_searchUser = function () {
            $scope.tableParams.reload();
//            $scope.getCmsUserList($scope.search);
        }

        // 사용자 목록 조회
        $scope.getUserList = function () {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 1000,          // count per page
                sorting: {
                    USER_NM: 'asc'     // initial sorting
                }
            }, {
                groupBy: 'ROLE_NM',
                counts: [],         // hide page counts control
                total: 0,           // length of data
                getData: function($defer, params) {
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('com/user', 'list', {}, $scope.search, true)
                        .then(function(data){
                            var total_cnt = data[0].TOTAL_COUNT;
                            $scope.TOTAL_COUNT = total_cnt;

                            params.total(total_cnt);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$defer.resolve([]);});
                }
            });
        };

        // 사용자 조회 클릭
        $scope.click_getUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('com/user', 'item', $scope.key, {}, false)
                    .then(function(data) {
                        // 스크롤 하단으로 이동
                        $('html,body').animate({scrollTop:$('#item').offset().top}, 100);
                        $scope.item = data;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        }

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
            $scope.item.ROLE = $scope.user_roles[0];
        };

        /********** 화면 초기화 **********/
//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
//            .then($scope.init)
//            .then($scope.getUserList)
//            .catch($scope.reportProblems);

        $scope.init();
        $scope.getUserList();

    }]);
});
