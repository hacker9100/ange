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
        var check = false;
        $scope.key = '';
        $scope.item = {};
        $scope.search = {SYSTEM_GB: 'CMS'}

        // 초기화
        $scope.init = function() {
            $scope.getList('com/permission', 'list', {}, {SYSTEM_GB: 'CMS'}, false)
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

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/user', 'item', user.USER_ID, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'}); $scope.tableParams.data[parentIdx].data.splice(idx, 1);})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
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
                    var key = Object.keys(params.sorting())[0];

                    $scope.search['SORT'] = key;
                    $scope.search['ORDER'] = params.sorting()[key];

                    $scope.getList('com/user', 'list', {}, $scope.search, true)
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
                if (!check) {
                    dialogs.notify('알림', '아이디 확인을 해주세요.', {size: 'md'});
                    return;
                }

                $scope.insertItem('com/user', 'item', $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/user', 'item', $scope.key, $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'}); $scope.tableParams.reload();})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.click_cancel();
        };

        // 사용자 편집 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('com/user', 'item', $scope.key, {SYSTEM_GB: 'CMS'}, false)
                    .then(function(data) {
                        var idx = 0;
                        for (var i=0; i < $scope.user_roles.length; i ++) {
                            if (JSON.stringify(data.ROLE) == JSON.stringify($scope.user_roles[i])) {
                                idx = i;
                            }
                        }

                        check = true;
                        $scope.item = data;
                        $scope.item.ROLE = $scope.user_roles[idx];

                        // 스크롤 하단으로 이동
                        $('html,body').animate({scrollTop:$('#item').offset().top}, 100);
                        $('#item_id').focus();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        }

        // 사용자 상태변경 버튼 클릭
        $scope.click_updateStatus = function (item) {
            item.USER_ST = (item.USER_ST == "N" ? "F" : "N");

            $scope.updateItem('com/user', 'item', item.USER_ID, item, false)
                .then(function(){dialogs.notify('알림', '사용자 상태가 변경되었습니다.', {size: 'md'}); /*$scope.tableParams.reload(); $scope.getCmsUserList();*/})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'}); $scope.tableParams.reload();});
        };

        // 취소 클릭
        $scope.click_cancel = function () {
            check = false;
            $scope.key = '';
            $scope.item = {};
            $scope.item.ROLE = $scope.user_roles[0];
        };

        $scope.click_checkUserId = function () {
            $scope.getItem('com/user', 'check', $scope.item.USER_ID, {SYSTEM_GB: 'CMS'}, false)
                .then(function(data) {
                    if (data.COUNT < 1) {
                        check = true;
                        dialogs.notify('알림', '사용 가능한 아이디입니다.', {size: 'md'});
                    } else {
                        dialogs.notify('알림', '이미 존재하는 아이디입니다.', {size: 'md'});
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.$watch('item.USER_ID', function(data) {
            check = false;
        });

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.getCmsUserList)
            .catch($scope.reportProblems);

    }]);
});
