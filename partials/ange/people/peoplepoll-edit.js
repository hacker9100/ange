/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-01-02
 * Description : peoplepoll-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("peoplepoll-edit", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        // 게시판 초기화
        $scope.item = {};
        // 첨부파일 초기화
        $scope.queue = [];

        $scope.answer = {}
        //$scope.showDetails = false;
        $scope.showPollView = false;
        $scope.showPoll = true;

        $scope.page = 1;
        $scope.lastPage = 0;
        $scope.firstIndex=0;

        $scope.currentPage = 0;

        $scope.search = {};


// 차트
        $scope.chart = {};





        //console.log($scope.chart[j+1]);


        $scope.init = function (){
            $scope.nextclick = true;
            $scope.preclick = false;
        }

        $scope.next_click = function(){

            $scope.nextclick = false;

            $scope.firstIndex = parseInt($scope.firstIndex+1);
            $scope.page =  $scope.page + 2;
            $scope.currentPage = $scope.currentPage+1;

            if($scope.currentPage +1 == $scope.lastPage){
                $scope.preclick = true;
            }

        }

        $scope.pre_click = function(){

            $scope.firstIndex = parseInt($scope.firstIndex-1);
            $scope.page =  $scope.page - 2;
            $scope.currentPage = $scope.currentPage-1;

            $scope.preclick = false;

            if($scope.currentPage == 0){
                $scope.nextclick = true;

            }
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

                            var j = parseInt(i)+1;

                            $scope.search.BOARD_NO = $stateParams.id ;

//                            $scope.getList('ange/poll', 'chartlist', {}, $scope.search, true)
//                                .then(function(data){
//                                    $scope.chartlist = data;
//
//                                    var note = [];
//                                    var poll_cnt = [];
//                                    var myJSON = "";
//
//                                    for(var k=0; k<$scope.chartlist.length; k++) {
//                                        var item = {
//                                            v: $scope.chartlist[k].NOTE
//                                        };
//
//                                        var item2 = {
//                                            v: $scope.chartlist[k].POLL_CNT
//                                        };
//
//                                        note.push(item);
//                                        poll_cnt.push(item2);
//
//                                        $rootScope.jsontext = '{"v":"'+ $scope.chartlist[k].NOTE+'"}';
//                                        $rootScope.jsontext2 = '{"v":"'+ $scope.chartlist[k].POLL_CNT+'"}';
//
//                                        $rootScope.contact = JSON.parse($rootScope.jsontext);
//                                        $rootScope.contact2 = JSON.parse($rootScope.jsontext2);
//
//                                    }
//
//                                })
//                                .catch(function(error){});

                            var myarray = [{}];
                            var json = [];

                            var j = parseInt(i)+1;
                            $scope.chart[i] = {};

//                            $rootScope.jsontext1 = '{"cols": [ {id: "t", label: "Topping", type: "string"}, {id: "s", label: "Slices", type: "number"} ], "rows": {c:[]};';
//
//                            var obj = JSON.parse($rootScope.jsontext1);
//                            obj["c"].push({"v":"title"},{"v": 500});
//                            $rootScope.jsontext1 = JSON.stringify(obj);

                            $rootScope.jsontext = new Array();
                            $rootScope.jsontext2 = new Array();

                            $rootScope.contact = new Array();
                            $rootScope.contact2 = new Array();

                            $rootScope.contact3 = new Array();

                            $rootScope.test = '';
                            for(var k in query[i].SELECT) {

                                $rootScope.jsontext[k] = '{"v":"'+ query[i].SELECT[k].NOTE+'"}';
                                $rootScope.jsontext2[k] = '{"v":'+ query[i].SELECT[k].POLL_CNT+'}';

                                $rootScope.contact[k] = JSON.parse($rootScope.jsontext[k]);
                                $rootScope.contact2[k] = JSON.parse($rootScope.jsontext2[k]);

                                $rootScope.contact3[k] = $rootScope.contact[k] + $rootScope.contact2[k];
                            }

                            for(var q=0; q < $rootScope.contact3.length; q++){
                                console.log($rootScope.contact[q]);
                                console.log($rootScope.contact2[q]);
                            }

//                            for(var q=0; q < $rootScope.contact2.length; q++){
//                                console.log($rootScope.contact2[q]);
//                            }

                            var test = '{"cols": [{"id": "t", "label": "Topping", "type": "string"}, {"id": "s", "label": "Slices", "type": "number"} ], "rows": []}';
                            var obj = JSON.parse(test);

                            for(var q=0; q < $rootScope.contact3.length; q++){
                                console.log($rootScope.contact[q]);
                                console.log($rootScope.contact2[q]);
                                obj['rows'].push({c:[$rootScope.contact[q], $rootScope.contact2[q]]});
                            }

                            //obj['rows'].push({c:[]});
                            test = JSON.stringify(obj);
                            var result = JSON.parse(test);
                            console.log(result);

//                            var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';
//
//                            var obj = JSON.parse(jsonStr);
//                            obj['theTeam'].push({"teamId":"4","status":"pending"});
//                            jsonStr = JSON.stringify(obj);
//
//
//                            console.log(jsonStr);
                            //{c:[]}
//                            $scope.chart[i].data = {"cols": [
//                                {id: "t", label: "Topping", type: "string"},
//                                {id: "s", label: "Slices", type: "number"}
//                            ], "rows": [
//                                {c: [
//                                    $rootScope.contact[0],
//                                    $rootScope.contact2[0]
//                                ]},
//                                {c:[
//                                    {v:"예(Q3번으로)"}
//                                    ,{v:1}
//                                ]},
//                                {c:[
//                                    {v:"아니오(Q4번으로)"}
//                                    ,{v:1}
//                                ]}
//                            ]};
                            $scope.chart[i].data = result;

                            // $routeParams.chartType == BarChart or PieChart or ColumnChart...
                            $scope.chart[i].type = 'PieChart';
//                            $scope.chart[i].options = {
//                                'title': 'How Much Pizza I Ate Last Night'
//                            }

                        }


                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_saveAngePoll = function (no, poll_st) {


            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 설문조사에 참여 할 수 있습니다.', {size: 'md'});
                return;
            }

            if(poll_st == 1){
                dialogs.notify('알림', '종료된 설문조사 입니다.', {size: 'md'});
                return;
            }

            $scope.search['BOARD_NO'] = no;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            $scope.search['USER_UID'] = $rootScope.uid; // 테스트

            // 설문조사 참여여부 체크
            // 사용자아이디와 설문조사 번호를 가지고 조회하여
            // cnt가 1일때 목록으로 이동 아니면 저장
            $scope.getList('ange/poll', 'check', {}, $scope.search, false)
                .then(function(data){
                    var answer_cnt = data[0].POLL_ANSWER_CNT;

                    if (answer_cnt == 1) {
                        dialogs.notify('알림', '이미 이 설문조사에 참여하셨습니다.', {size: 'md'});
                        $location.url('/people/poll/list');
                    } else {
                        $scope.insertItem('ange/poll', 'answear', $scope.queue, false)
                            .then(function(){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $location.url('/people/poll/list');
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

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



        $scope.init();
        $scope.getAngePoll();
    }]);

});


