/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : contact_list.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('contact_list', ['$scope', '$stateParams', '$location', '$filter', 'ngTableParams', function ($scope, $stateParams, $location, $filter, ngTableParams) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            $scope.getList('com/permission', 'list', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.roles = data;
                    $scope.user_roles = data;
                    $scope.item.ROLE = data[0];
                })
                .catch(function(error){alert(error)});
        };

        /********** 이벤트 **********/
        // 사용자 삭제 버튼 클릭
        $scope.click_deleteCmsUser = function (idx) {
            var user = $scope.tableParams.data[idx];

            $scope.deleteItem('com/user', 'item', user.USER_ID, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.tableParams.data.splice(idx, 1);})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchCmsUser = function () {
            $scope.tableParams.reload();
//            $scope.getCmsUserList($scope.search);
        }

        // 사용자 목록 조회
        $scope.getCmsUserList = function () {
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
                    $scope.getList('com/user', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){alert(error)});
                }
            });

//            $scope.getList('cms_user', 'list', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){alert(error)});
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            if ($scope.key == '') {
                $scope.insertItem('com/user', 'item', $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('com/user', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            }

            $scope.click_cancel();
        };

        // 사용자 조회 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('com/user', 'item', $scope.key, {}, false)
                    .then(function(data) {
                        // 스크롤 하단으로 이동
                        $('html,body').animate({scrollTop:$('#item').offset().top}, 100);
                        $scope.item = data;
                    })
                    .catch(function(error){alert(error)});
            }
        }

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
            $scope.item.ROLE = $scope.user_roles[0];
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getCmsUserList)
            .catch($scope.reportProblems);

    }]);

    controllers.controller('contact_list_modal', ['$scope', '$stateParams', '$modalInstance', '$location', '$filter', 'ngTableParams', 'data', function ($scope, $stateParams, $modalInstance, $location, $filter, ngTableParams, data) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            $scope.getList('com/permission', 'list', {}, {ROLE: true}, false)
                .then(function(data){
                    $scope.roles = data;
                    $scope.user_roles = data;
                    $scope.item.ROLE = data[0];
                })
                .catch(function(error){alert(error)});

            if (data != undefined) {
                $scope.isModal = true;
                $scope.search = data;
            }
        };

        /********** 이벤트 **********/
        // 사용자 삭제 버튼 클릭
        $scope.click_deleteCmsUser = function (idx) {
            var user = $scope.tableParams.data[idx];

            $scope.deleteItem('com/user', 'item', user.USER_ID, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.tableParams.data.splice(idx, 1);})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchCmsUser = function () {
            $scope.tableParams.reload();
//            $scope.getCmsUserList($scope.search);
        }

        // 사용자 목록 조회
        $scope.getCmsUserList = function () {
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
                    $scope.getList('com/user', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){alert(error)});
                }
            });

//            $scope.getList('cms_user', 'list', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){alert(error)});
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            if ($scope.key == '') {
                $scope.insertItem('com/user', 'item', $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('com/user', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){alert(error)});
            }

            $scope.click_cancel();
        };

        // 사용자 조회 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('com/user', 'item', $scope.key, {}, false)
                    .then(function(data) { $scope.item = data; })
                    .catch(function(error){alert(error)});
            }
        }

        // 사용자 선택 클릭
        $scope.click_selectCmsUser = function (item) {
            $modalInstance.close(item);
        }

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
            $scope.item.ROLE = $scope.user_roles[0];
        };

        $scope.click_ok = function () {
            $modalInstance.close();
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getCmsUserList)
            .catch($scope.reportProblems);

    }]);
});
