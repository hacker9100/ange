/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : project.html 화면 콘트롤러
 */

define([
    '../../js/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user', ['$scope', '$stateParams', '$location', '$controller', '$filter', 'ngTableParams', function ($scope, $stateParams, $location, $controller, $filter, ngTableParams) {

        /********** 공통 controller 호출 **********/
        angular.extend(this, $controller('common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.key = '';
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            $scope.getList('permission', {}, {ROLE: true}, false)
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
            var user = $scope.$data[idx];

            $scope.deleteItem('cms_user', user.USER_ID, true)
                .then(function(){alert('정상적으로 삭제했습니다.'); $scope.list.splice(idx, 1);})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchCmsUser = function () {
            $scope.tableParams.reload();
//            $scope.getCmsUserList($scope.search);
        }

        // 사용자 목록 조회
        $scope.getCmsUserList = function (search) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    USER_NM: 'asc'     // initial sorting
                }
            }, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    alert("1");
                    $scope.getList('cms_user', {}, search, true)
                        .then(function(data){
                            alert("2");
                            params.total(data[0].TOTAL_COUNT);
//                            $defer.resolve(data);

                            var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        })
                        .catch(function(error){alert(error)});
                },
                $scope: { $data: {} }
            });

//            $scope.getList('cms_user', {}, search, true)
//                .then(function(data){$scope.list = data;})
//                .catch(function(error){alert(error)});
        };

        // 사용자 저장 버튼 클릭
        $scope.click_saveCmsUser = function () {
            if ($scope.key == '') {
                $scope.insertItem('cms_user', $scope.item, false)
                    .then(function(){$scope.tableParams.reload(); $scope.getCmsUserList();})
                    .catch(function(error){alert(error)});
            } else {
                $scope.updateItem('cms_user', $scope.key, $scope.item, false)
                    .then(function(){$scope.tableParams.reload(); $scope.getCmsUserList();})
                    .catch(function(error){alert(error)});
            }

            $scope.key = '';
        };

        // 사용자 편집 클릭
        $scope.click_getCmsUser = function (id) {
            $scope.key = id;

            if ($scope.key != '') {
                $scope.getItem('cms_user', $scope.key, {}, false)
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
                    .catch(function(error){alert(error)});
            }
        }

        // 사용자 상태변경 버튼 클릭
        $scope.click_updateStatus = function (idx) {
            alert(idx);
            var user = $scope.$data[idx];
            user.USER_ST = (user.USER_ST == "1" ? "0" : "1");

            $scope.updateItem('webboard', user.USER_ID, user, false)
                .then(function(){$scope.tableParams.reload(); $scope.getCmsUserList();})
                .catch(function(error){alert(error)});
        };

        // 취소 클릭
        $scope.click_cancel = function () {
            $scope.key = '';
            $scope.item = null;
            $scope.item.ROLE = $scope.user_roles[0];
        };

        /********** 화면 초기화 **********/
        $scope.init();
//        $scope.initEdit();
        $scope.getCmsUserList();

    }]);
});
