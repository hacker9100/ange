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
    controllers.controller('myangemessage', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getCouponList();
        };

        // 초기화
        $scope.init = function(session) {
            $scope.community = "메시지";
        };

        $scope.getMessageList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.getList('ange/message', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

/*        // 조회 화면 이동
        $scope.click_showViewMessage = function (key) {

            if ($stateParams.id != 0) {
                return $scope.getItem('ange/message', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };*/

/*        $scope.viewCheckFl = function () {
            $scope.updateItem('ange/message', 'check', $stateParams.id, {ROLE: true}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }*/

        // 상세조회 버튼 클릭
        $scope.click_showViewMessage = function (key) {
            $scope.openViewScrapModal({NO : key}, 'lg');
        };

        $scope.openViewScrapModal = function (item, size) {
            var dlg = dialogs.create('myangemessage_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.getItem('ange/message', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                        })
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    //$scope.viewCheckFl = function () {
                    $scope.updateItem('ange/message', 'check', item.NO, {ROLE: true}, false)
                        .then(function(){
                        })
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    //}


                    $scope.click_ok = function () {
                        $modalInstance.close();
                        $scope.PAGE_NO = 0;
                        $scope.PAGE_SIZE = 20;

                        $scope.getList('ange/message', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.TOTAL_COUNT = total_cnt;

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                            })
                            .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
                    };

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };


        // 등록 버튼 클릭
        $scope.click_regMessage = function () {
            $scope.openViewMessageRegModal(null, null, 'lg');
        };

        $scope.openViewMessageRegModal = function (content, item,  size) {
            var dlg = dialogs.create('myangemessage_edit.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));
                    $scope.content = data;

                    $scope.click_reg = function () {
                        $scope.insertItem('ange/message', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        $modalInstance.close();
                        //console.log($scope.item);
                    };

                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                    // 사용자 조회 검색 클릭
                    $scope.click_searchUser = function (item) {
                        $scope.openViewMessageSearchModal({TO_ID : item.TO_ID, TO_NM : item.TO_NM}, 'lg');
                    };

                    $scope.openViewMessageSearchModal = function (item, size) {
                        var dlg = dialogs.create('myangemessage_search.html',
                            ['$scope','$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                                /********** 공통 controller 호출 **********/
                                angular.extend(this, $controller('ange-common', {$scope: $scope}));
                                $scope.item = {};

                                $scope.PAGE_NO = 1;
                                $scope.PAGE_SIZE = 10;
                                $scope.TOTAL_COUNT = 0;


                                $scope.search = {};

                                $scope.search.NICK_NM = item.TO_NM;
                                $scope.search.USER_ID = item.TO_ID;

                                $scope.searchUserList = function () {

                                    $scope.getList('ange/message', 'searchuserlist', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                                        .then(function(data){
                                            var total_cnt = data[0].TOTAL_COUNT;
                                            $scope.TOTAL_COUNT = total_cnt;

                                            /*$scope.total(total_cnt);*/
                                            $scope.list = data;

                                        })
                                        .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
                                };

                                $scope.pageChanged = function() {
                                    console.log('Page changed to: ' + $scope.PAGE_NO);
                                    $scope.searchUserList();
                                };

                                $scope.select_user = function (to_id, to_nm){
                                    $scope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NM: to_nm} ,'lg');
                                    $modalInstance.close();

                                }

                                $scope.openViewMessageRegModal = function (content, item,  size) {
                                    var dlg = dialogs.create('myangemessage_edit.html',
                                        ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                                            /********** 공통 controller 호출 **********/
                                            angular.extend(this, $controller('ange-common', {$scope: $scope}));
                                            $scope.content = data;

                                            $scope.item = {};
                                            if(item != null){
                                                $scope.item.TO_ID = item.TO_ID;
                                                $scope.item.TO_NM = item.TO_NM;
                                            }

                                            $scope.click_reg = function () {
                                                $scope.insertItem('ange/message', 'item', $scope.item, true)
                                                    .then(function(data){
                                                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                                                    })
                                                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                                                $modalInstance.close();
                                                //console.log($scope.item);
                                            };

                                            $scope.click_close = function(){
                                                $modalInstance.close();
                                            }

                                            // 사용자 조회 검색 클릭
                                            $scope.click_searchUser = function (item) {
                                                $scope.openViewMessageSearchModal({TO_ID : item.TO_ID, TO_NM : item.TO_NM}, 'lg');
                                            };

                                            $scope.openViewMessageSearchModal = function (item, size) {
                                                var dlg = dialogs.create('myangemessage_search.html',
                                                    ['$scope','$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                                                        /********** 공통 controller 호출 **********/
                                                        angular.extend(this, $controller('ange-common', {$scope: $scope}));
                                                        $scope.item = {};

                                                        $scope.PAGE_NO = 1;
                                                        $scope.PAGE_SIZE = 10;
                                                        $scope.TOTAL_COUNT = 0;


                                                        $scope.search = {};

                                                        $scope.search.NICK_NM = item.TO_NM;
                                                        $scope.search.USER_ID = item.TO_ID;

                                                        $scope.searchUserList = function () {

                                                            $scope.getList('ange/message', 'searchuserlist', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                                                                .then(function(data){
                                                                    var total_cnt = data[0].TOTAL_COUNT;
                                                                    $scope.TOTAL_COUNT = total_cnt;

                                                                    /*$scope.total(total_cnt);*/
                                                                    $scope.list = data;

                                                                })
                                                                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
                                                        };

                                                        $scope.pageChanged = function() {
                                                            console.log('Page changed to: ' + $scope.PAGE_NO);
                                                            $scope.searchUserList();
                                                        };

                                                        $scope.select_user = function (to_id, to_nm){
                                                            $scope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NM: to_nm} ,'lg');
                                                            $modalInstance.close();

                                                        }

                                                        $scope.searchUserList();

                                                        $scope.click_close = function(){
                                                            $modalInstance.close();
                                                        }

                                                    }], item, {size:size,keyboard: true}, $scope);
                                                dlg.result.then(function(){

                                                },function(){

                                                });
                                            };

                                        }], content, item, {size:size,keyboard: true}, $scope);
                                    dlg.result.then(function(){

                                    },function(){

                                    });
                                };

                                $scope.searchUserList();

                                $scope.click_close = function(){
                                    $modalInstance.close();
                                }

                            }], item, {size:size,keyboard: true}, $scope);
                        dlg.result.then(function(){

                        },function(){

                        });
                    };

                }], content, item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };



        $scope.getSession()
            .then($scope.sessionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getMessageList();
        /*$scope.viewCheckFl();*/

    }]);
});
