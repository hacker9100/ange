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
    controllers.controller('myangemessage', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.search = {};

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];
        //
        $scope.pageBoardChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);

            $scope.PAGE_NO = 1;
            $scope.PAGE_SIZE = 10;
            $scope.TOTAL_COUNT = 0;

            $scope.list = [];

            $scope.getMessageList();
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

                    for(var i in data) {

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.list.push(data[i]);
                    }

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 상세조회 버튼 클릭
        $scope.click_showViewMessage = function (item) {
            $scope.openViewScrapModal(item, 'lg'); //{NO : item.key}
        };

        $scope.openViewScrapModal = function (item, size) {
            var dlg = dialogs.create('myangemessage_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.reitem = {};
                    $scope.getItem('ange/message', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;
                            console.log($scope.item);

                            var source = data.BODY;
                            var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

//                            var state = "";
//                            if ($scope.item.FROM_ID == $_SESSION['uid']) {
//                                state = "SEND";
//                            } else {
//                                state = "RECIEVE";
//                            }

                            source = source.replace(pattern, '');
                            source = source.replace(/&nbsp;/ig, '');
                            source = source.trim();

                            $scope.item.BODY = source;

                            if($scope.item.FROM_ID != $scope.uid){
                                $scope.reitem.FROM_ID = $scope.item.TO_ID;
                                $scope.reitem.FROM_NM = $scope.item.TO_NM;
                                $scope.reitem.TO_ID = $scope.item.FROM_ID;
                                $scope.reitem.TO_NM = $scope.item.FROM_NM;
                            }else{
                                $scope.reitem.TO_ID = $scope.item.TO_ID;
                                $scope.reitem.TO_NM = $scope.item.TO_NM;
                                $scope.reitem.FROM_ID = $scope.item.FROM_ID;
                                $scope.reitem.FROM_NM = $scope.item.FROM_NM;
                            }

                            console.log("보내는"+$scope.reitem.TO_ID);
                            console.log("보내는"+$scope.reitem.TO_NM);
                            console.log("받는"+$scope.reitem.FROM_ID);
                            console.log("받는"+$scope.reitem.FROM_NM);

                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    $scope.viewCheckFl = function () {
                        $scope.updateItem('ange/message', 'check', item.NO, {ROLE: true}, false)
                            .then(function(){
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_reg = function () {

                        if($scope.reitem.BODY == undefined){
                            alert('내용을 입력하세요');
                            return;
                        }

                        if($scope.reitem.TO_ID == undefined){
                            alert('수신자를 검색해서 선택하세요');
                            return;
                        }

//                        if($scope.uid == $scope.item.FROM_ID){
//
//                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
//                            return;
//
//                        }else{
//
//                            console.log($scope.reitem);
//                            $scope.insertItem('ange/message', 'item', $scope.reitem, true)
//                                .then(function(data){
//                                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
//                                    $modalInstance.close();
//                                })
//                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//                        }
                        console.log($scope.reitem);
                        $scope.insertItem('ange/message', 'item', $scope.reitem, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    $scope.click_ok = function () {
                        //$scope.getMessageList();
                        $modalInstance.close();
                    };

                    // 받는사람과 로그인한 사람이 일치할때 확인여부 수정
                    if(item.TO_ID == $scope.uid){
                        console.log('일치');
                        $scope.viewCheckFl();
                    }else{
                        console.log('일치하지 않음');
                    }

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.list = [];
                $scope.getMessageList();
            },function(){

            });
        };


        // 등록 버튼 클릭
        $rootScope.click_regMessage = function () {
            $rootScope.openViewMessageRegModal(null, null, 'lg');
        };

        $rootScope.openViewMessageRegModal = function (content, item,  size) {
            var dlg = dialogs.create('myangemessage_edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));
                    $scope.content = data;

                    $scope.searchUsetList = "N";

                    $scope.selectUser = "N";

                    console.log(item);
                    $scope.item = {};

//                    if(item != null){
//                        $scope.item.TO_ID = item.TO_ID;
//                        $scope.item.TO_NICK_NM = item.TO_NICK_NM;
//                    }else{
//                        $scope.item.TO_ID = "";
//                        $scope.item.TO_NICK_NM = "";
//                    }


                    $scope.click_reg = function () {

                        console.log($scope.item.BODY);
                        console.log($scope.item.TO_ID);

                        if($scope.item.BODY == undefined){
                            alert('내용을 입력하세요');
                            return;
                        }

                        if($scope.item.TO_ID == undefined){
                            alert('수신자를 검색해서 선택하세요');
                            return;
                        }

                        $scope.insertItem('ange/message', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }

                    // 사용자 조회 검색 클릭
                    $scope.click_searchUser = function (name) { //item

                        if(name == null || name == ''){
                            $scope.searchUsetList = "N";
                            dialogs.notify('알림', '닉네임을 입력하세요.', {size: 'md'});
                            return;
                        }else{
                            //var search = '';
                            //search = name;
//                            $modalInstance.close();
//                            $rootScope.openViewMessageSearchModal(search, 'lg'); //{TO_ID : item.TO_ID, TO_NM : item.TO_NM}

                            var stringByteLength = name.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1$2").length;
                            console.log(stringByteLength + " Bytes");


                            if(stringByteLength < 4){
                                dialogs.notify('알림', '한글은 2자 이상, 영문은 4자 이상으로 입력해주세요.', {size: 'md'});
                                return;
                            }else{
                                $scope.search.NICK_NM = name;
                                $scope.searchUserList();
                            }

                        }

                    };

                    $scope.user_pageChanged = function(){
                        console.log('User Page changed to: ' + $scope.USER_PAGE_NO);
                        $scope.searchUserList();
                    }

                    $scope.USER_PAGE_NO = 1;
                    $scope.USER_PAGE_SIZE = 15;
                    $scope.USER_TOTAL_COUNT = 0;

                    // 사용자 리스트
                    $scope.searchUserList = function () {
                        $scope.getList('ange/message', 'searchuserlist', {NO: $scope.USER_PAGE_NO - 1, SIZE: $scope.USER_PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.USER_TOTAL_COUNT = total_cnt;

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                                $scope.searchUsetList = "Y";

                            })
                            ['catch'](function(error){$scope.USER_TOTAL_COUNT = 0; $scope.searchUsetList = "Y";  $scope.list = "";});
                    };

                    // 사용자 선택
                    $scope.select_user = function (to_id, to_nm){

                        if(to_id == $scope.uid){
                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
                            return;
                        }else{
//                            $modalInstance.close();
//                            $rootScope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NICK_NM: to_nm} ,'lg');
                            $scope.selectUser = "Y";

                            $scope.item.TO_ID = to_id;
                            $scope.item.TO_NM = to_nm;

                            $scope.searchUsetList = "N";
                            console.log($scope.item.TO_ID);
                            console.log($scope.item.TO_NM);
                        }
                    }


                }], content, item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.list = [];
                $scope.getMessageList();
            },function(){

            });
        };

        $rootScope.openViewMessageSearchModal = function (item, size) {
            var dlg = dialogs.create('myangemessage_search.html',
                ['$scope','$rootScope','$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));
                    $scope.item = {};

                    $scope.PAGE_NO = 1;
                    $scope.PAGE_SIZE = 10;
                    $scope.TOTAL_COUNT = 0;

                    $scope.search = {};

                    //console.log(item);
                    if(item != null){
                        $scope.search.NICK_NM = item;
                    }

                    $scope.searchUserList = function () {
                        $scope.getList('ange/message', 'searchuserlist', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                            .then(function(data){
                                var total_cnt = data[0].TOTAL_COUNT;
                                $scope.TOTAL_COUNT = total_cnt;

                                /*$scope.total(total_cnt);*/
                                $scope.list = data;

                            })
                            ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
                    };

                    // 팝업에서 검색
                    $scope.popupsearchList = function (){
                        $scope.search.NICK_NM = '';
                        $scope.searchUserList();
                    }

                    $scope.pageChanged = function() {
                        console.log('Page changed to: ' + $scope.PAGE_NO);
                        $scope.searchUserList();
                    };

                    // 사용자 선택
                    $scope.select_user = function (to_id, to_nm){

                        if(to_id == $scope.uid){
                            dialogs.notify('알림', '본인에게 보낼 수 없습니다.', {size: 'md'});
                            return;
                        }else{
                            $modalInstance.close();
                            $rootScope.openViewMessageRegModal(null, {TO_ID : to_id, TO_NICK_NM: to_nm} ,'lg');
                        }
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

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMessageList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.getMessageList();
        /*$scope.viewCheckFl();*/

    }]);
});
