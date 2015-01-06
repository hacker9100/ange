/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-01-02
 * Description : poll-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("poll-edit", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        // 게시판 초기화
        $scope.item = {};
        // 첨부파일 초기화
        $scope.queue = [];

        $scope.answer = {}
        $scope.showDetails = false;

        // 초기화
        $scope.init = function() { // function(session){

        };

        // 게시판 조회
        $scope.getAngePoll = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/poll', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;

                        var query = data.QUERY;

                        for(var i in query) {
                            $scope.queue.push({"BOARD_NO":query[i].BOARD_NO,"QUERY":query[i].QUERY,"QUERY_GB":query[i].QUERY_GB,"QUERY_NO":query[i].QUERY_NO,"QUERY_SORT":query[i].QUERY_SORT,"SELECT":query[i].SELECT});
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_saveAngePoll = function () {



             $("input[id=select_sort]:checked").each(function(index,element){


                $scope.answer.SELECT_ANSWER = $(element).val();

                 $("input[name=query_no]").each(function(index,element){
                     $scope.answer.QUERY_NO = $(element).val();
                     console.log($scope.answer.QUERY_NO);
                 });

                 $("input[name=query_sort]").each(function(index,element){
                     $scope.answer.QUERY_SORT = $(element).val();
                     console.log($scope.answer.QUERY_SORT);
                 });

                 $("input[name=note]").each(function(index,element){
                     $scope.answer.NOTE = $(element).val();
                     console.log($scope.answer.NOTE);
                 });

                 $scope.insertItem('ange/poll', 'answear', $scope.answer, false)
                      .then(function(){
                          dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                      })
                      .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

             });


            console.log('end');

        }

        $scope.click_showAngePollList = function() {
            $location.url('/people/peoplepoll/list');
        }


        $scope.init();
        $scope.getAngePoll();
    }]);
});
