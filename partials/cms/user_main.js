/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_main.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user_main', ['$scope', '$stateParams', '$location', '$filter', 'dialogs', 'ngTableParams', function ($scope, $stateParams, $location, $filter, dialogs, ngTableParams) {

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};
        $scope.search = {SYSTEM_GB: 'CMS'}

        // 초기화
        $scope.init = function() {
            $scope.getList('comm/permission', 'list', {}, {SYSTEM_GB: 'CMS'}, false)
                .then(function(data){
                    $scope.roles = data;
                    $scope.user_roles = data;
                    $scope.item.ROLE = data[0];
                })
                .catch(function(error){console.log(error)});
        };

        /********** 이벤트 **********/
        // 사용자 삭제 버튼 클릭
        $scope.click_deleteCmsUser = function (parentIdx, idx) {
            var user = $scope.tableParams.data[parentIdx].data[idx];

            $scope.deleteItem('comm/com_user', 'item', user.USER_ID, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.tableParams.data[parentIdx].data.splice(idx, 1);})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                    $scope.getList('comm/com_user', 'list', {}, $scope.search, true)
                        .then(function(data){
                            params.total(data[0].TOTAL_COUNT);
                            $defer.resolve(data);

//                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
//                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){$defer.resolve([]);});
                }
            });

//            $scope.getList('cms_user', 'list', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){alert(error)});
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            $scope.item.SYSTEM_GB = 'CMS';

            if ($scope.key == '') {
                $scope.insertItem('comm/com_user', 'item', $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('comm/com_user', 'item', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.click_cancel();
        };

        // 사용자 편집 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('comm/com_user', 'item', $scope.key, {SYSTEM_GB: 'CMS'}, false)
                    .then(function(data) {
                        var idx = 0;
                        for (var i=0; i < $scope.user_roles.length; i ++) {
                            if (JSON.stringify(data.ROLE) == JSON.stringify($scope.user_roles[i])) {
                                idx = i;
                            }
                        }

                        $scope.item = data;
                        $scope.item.ROLE = $scope.user_roles[idx];
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        }

        // 사용자 상태변경 버튼 클릭
        $scope.click_updateStatus = function (item) {
            item.USER_ST = (item.USER_ST == "1" ? "0" : "1");

            $scope.updateItem('comm/com_user', 'item', item.USER_ID, item, false)
                .then(function(){/*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});
        };

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = {};
            $scope.item.ROLE = $scope.user_roles[0];
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getCmsUserList();

    }]);
});
