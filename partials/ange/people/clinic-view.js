/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleclinic-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.reply = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleClinicEdit = function (item) {

            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/edit/'+item.NO);
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/edit/'+item.NO);
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/edit/'+item.NO);
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/edit/'+item.NO);
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/edit/'+item.NO);
            }

        };

        // 목록 버튼 클릭
        $scope.click_showPeopleClinicList = function () {
            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/list');
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/list');
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/list');
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/list');
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/list');
            }
        };

/*
        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'item', $stateParams.id, {ROLE: true}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }
*/

        // 게시판 조회
        $scope.getPeopleClinic = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        if(data.REPLY_YN == 'N'){
                            $scope.item.BODY;
                        } else {
                            $scope.item.BODY = data.BODY+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                        }

                        $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                        $scope.reply.PARENT_NO = $scope.item.NO;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 답글 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';

            if ($stateParams.menu == 'childdevelop') {
                $scope.reply.COMM_NO = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.reply.COMM_NO = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.reply.COMM_NO = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.reply.COMM_NO = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.reply.COMM_NO = '13';
            }

            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

/*                    if ($stateParams.menu == 'childdevelop') {
                        $location.url('/people/childdevelop/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'chlidoriental') {
                        $location.url('/people/chlidoriental/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'obstetrics') {
                        $location.url('/people/obstetrics/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'momshealth') {
                        $location.url('/people/momshealth/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'financial') {
                        $location.url('/people/financial/view/'+$scope.item.NO);
                    }*/
                    if ($stateParams.menu == 'childdevelop') {
                        $location.url('/people/childdevelop/list');
                    } else if($stateParams.menu == 'chlidoriental') {
                        $location.url('/people/chlidoriental/list');
                    } else if($stateParams.menu == 'obstetrics') {
                        $location.url('/people/obstetrics/list');
                    } else if($stateParams.menu == 'momshealth') {
                        $location.url('/people/momshealth/list');
                    } else if($stateParams.menu == 'financial') {
                        $location.url('/people/financial/list');
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 이전글
        $scope.getPreBoard = function (){


            if ($stateParams.menu == 'childdevelop') {
                $scope.search['COMM_NO'] = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.search['COMM_NO'] = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.search['COMM_NO'] = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.search['COMM_NO'] = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.search['COMM_NO'] = '13';
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            if ($stateParams.menu == 'childdevelop') {
                $scope.search['COMM_NO'] = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.search['COMM_NO'] = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.search['COMM_NO'] = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.search['COMM_NO'] = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.search['COMM_NO'] = '13';
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/view/'+key);
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/view/'+key);
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/view/'+key);
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/view/'+key);
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/view/'+key);
            }

        };

        $scope.click_showPeopleClinicDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        if ($stateParams.menu == 'childdevelop') {
                            $location.url('/people/childdevelop/list');
                        } else if($stateParams.menu == 'chlidoriental') {
                            $location.url('/people/chlidoriental/list');
                        } else if($stateParams.menu == 'obstetrics') {
                            $location.url('/people/obstetrics/list');
                        } else if($stateParams.menu == 'momshealth') {
                            $location.url('/people/momshealth/list');
                        } else if($stateParams.menu == 'financial') {
                            $location.url('/people/financial/list');
                        }
                        ;})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        //$scope.addHitCnt();
        $scope.getPeopleClinic();
        $scope.getPreBoard();
        $scope.getNextBoard();


    }]);
});
