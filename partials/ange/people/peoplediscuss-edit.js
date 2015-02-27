/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-02-27
 * Description : peoplediscuss-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplediscuss-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, $filter, dialogs, UPLOAD, $http) {

        // 게시판 초기화
        $scope.item = {};
        /********** 초기화 **********/



        $scope.search = {};
        // 초기화
        $scope.init = function() {

            console.log($rootScope.PARENT_NO);
            $scope.item.PARENT_NO = $rootScope.PARENT_NO;

            $scope.item.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});


        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>Hello</p>';


        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {
            $location.url('/'+$stateParams.channel+'/discuss/list/'+$rootScope.PARENT_NO);
        };

        // 취소
        $scope.click_showPeopleBoardCancel = function (){
            $scope.item.SUBJECT = '';
            $scope.item.BODY = '';
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleBoard = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'BOARD';

            if ($stateParams.id == 0) {
                $scope.item.REMAIN_POINT = 10;
                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

                        $scope.updateItem('ange/mileage', 'mileageitemplus', {}, $scope.item, false)
                            .then(function(){
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                        $location.url('/'+$stateParams.channel+'/discuss/list/'+$rootScope.PARENT_NO);
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else {
                $scope.item.REMAIN_POINT = 10;
                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        $scope.updateItem('ange/mileage', 'mileageitemminus', {}, $scope.item, false)
                            .then(function(){
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                        $location.url('/'+$stateParams.channel+'/discuss/list/'+$rootScope.PARENT_NO);
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };



        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            .catch($scope.reportProblems);

//        $scope.init();
//        $scope.getPeopleBoard();

        console.log($rootScope.uid);


    }]);
});
