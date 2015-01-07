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

        $scope.page = 1;
        $scope.lastPage = 0;
        $scope.firstIndex=0;

        $scope.currentPage = 0;


        $scope.next_click = function(){

            $scope.firstIndex = parseInt($scope.firstIndex+1);
            $scope.page =  $scope.page + 2;
            $scope.currentPage = $scope.currentPage+1;

        }

        $scope.pre_click = function(){
            $scope.firstIndex = parseInt($scope.firstIndex-1);
            $scope.page =  $scope.page - 2;
            $scope.currentPage = $scope.currentPage-1;

        }

        // 게시판 조회
        $scope.getAngePoll = function () {
            $("#select_sort").attr("checked", 'checked');

            if ($stateParams.id != 0) {
                $scope.getItem('ange/poll', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;
                        $scope.lastPage = Math.round(data.QUERY_CNT/2);

                        var query = data.QUERY;

                        var select_sort = [];
                        for(var i in query) {
                            $scope.queue.push({"BOARD_NO":query[i].BOARD_NO,"QUERY":query[i].QUERY,"QUERY_GB":query[i].QUERY_GB,"QUERY_NO":query[i].QUERY_NO,"QUERY_SORT":query[i].QUERY_SORT,"SELECT":query[i].SELECT});


                            //$("#select_sort").attr('checked', true);

                            $('input:radio[name=q2_'+query[i].QUERY_NO+']').attr('checked','checked');
                        }


                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_saveAngePoll = function () {


            $scope.insertItem('ange/poll', 'answear', $scope.queue, false)
                .then(function(){
                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $location.url('/people/poll/list');
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});


             /*$("input[id=select_sort]:checked").each(function(index,element){

                 var check = $("input[id=select_sort]:checked").val();

                 $scope.answer.SELECT_ANSWER = $(element).val();

*//*                $scope.answer.QUERY_NO = 3;
                $scope.answer.QUERY_SORT = 3;
                $scope.answer.NOTE = '설문조사 3';*//*

                 console.log(queue);

                 for(var i=0; i< check.length; i++){
                     console.log(queue[i].SELECT[i].QUERY_NO);
                     console.log(queue[i].SELECT);
                     console.log(queue[i].SELECT);
                 }
*//*

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
*//*

                 $scope.insertItem('ange/poll', 'answear', $scope.answer, false)
                      .then(function(){
                          dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                         $location.url('/people/poll/list');
                      })
                      .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

             });*/

/*            for(var i = 0 ; i < $scope.queue.length ; i++) {
*//*                if(! $scope.queue[i].SELECT[i]) {
                    return false;
                }*//*
                console.log($scope.queue[i].SELECT);
            }
            console.log('end');*/
        }

        $scope.click_showAngePollList = function() {
            $location.url('/people/poll/list');
        }


        //$scope.init();
        $scope.getAngePoll();
    }]);
});
