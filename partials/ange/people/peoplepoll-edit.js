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

                        var que_data = $scope.item.ada_que_info;

                        $scope.item.QUE = [];
                        //$scope.item.QUE = new Array();
                        que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                        var parse_que_data = JSON.parse(que_data);

                        for(var x in parse_que_data){

                            var choice = [];
                            if(parse_que_data[x].type == 0){ // 객관식일때
                                var select_answer = parse_que_data[x].choice.split(','); // ,를 기준으로 문자열을 잘라 배열로 변환

                                for(var i=0; i < select_answer.length; i++){
                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                    //console.log(select_answer[i]);
                                }
                            }else{ // 주관식일때
                                choice = "";
                            }

                            var index = parseInt(x)+parseInt(1);
                            $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                        }

                        console.log($scope.item.QUE);

                        if(data.ada_state == 0){
                            $scope.showPollView = false;
                        }else{
                            $scope.showPollView = true;
                        }

                        var query = data.QUERY;

//                        var select_sort = [];
//                        for(var i in query) {
//
//                            $scope.queue.push({"BOARD_NO":query[i].BOARD_NO,"QUERY":query[i].QUERY,"QUERY_GB":query[i].QUERY_GB,"QUERY_NO":query[i].QUERY_NO,"QUERY_SORT":query[i].QUERY_SORT,"SELECT":query[i].SELECT});

                        $scope.lastPage = Math.round(data.QUERY_CNT/2);

                        // 차트
//                      var query = data.QUERY;

//                        var select_sort = [];
//                        for(var i in query) {
//
//                            $scope.queue.push({"BOARD_NO":query[i].BOARD_NO,"QUERY":query[i].QUERY,"QUERY_GB":query[i].QUERY_GB,"QUERY_NO":query[i].QUERY_NO,"QUERY_SORT":query[i].QUERY_SORT,"SELECT":query[i].SELECT});
//
//                            var j = parseInt(i)+1;
//
//                            $scope.search.BOARD_NO = $stateParams.id ;
//
////                            $scope.getList('ange/poll', 'chartlist', {}, $scope.search, true)
////                                .then(function(data){
////                                    $scope.chartlist = data;
////
////                                    var note = [];
////                                    var poll_cnt = [];
////                                    var myJSON = "";
////
////                                    for(var k=0; k<$scope.chartlist.length; k++) {
////                                        var item = {
////                                            v: $scope.chartlist[k].NOTE
////                                        };
////
////                                        var item2 = {
////                                            v: $scope.chartlist[k].POLL_CNT
////                                        };
////
////                                        note.push(item);
////                                        poll_cnt.push(item2);
////
////                                        $rootScope.jsontext = '{"v":"'+ $scope.chartlist[k].NOTE+'"}';
////                                        $rootScope.jsontext2 = '{"v":"'+ $scope.chartlist[k].POLL_CNT+'"}';
////
////                                        $rootScope.contact = JSON.parse($rootScope.jsontext);
////                                        $rootScope.contact2 = JSON.parse($rootScope.jsontext2);
////
////                                    }
////
////                                })
////                                .catch(function(error){});
//
//                            var myarray = [{}];
//                            var json = [];
//
//                            var j = parseInt(i)+1;
//                            $scope.chart[i] = {};
//
////                            $rootScope.jsontext1 = '{"cols": [ {id: "t", label: "Topping", type: "string"}, {id: "s", label: "Slices", type: "number"} ], "rows": {c:[]};';
////
////                            var obj = JSON.parse($rootScope.jsontext1);
////                            obj["c"].push({"v":"title"},{"v": 500});
////                            $rootScope.jsontext1 = JSON.stringify(obj);
//
//                            $rootScope.jsontext = new Array();
//                            $rootScope.jsontext2 = new Array();
//
//                            $rootScope.contact = new Array();
//                            $rootScope.contact2 = new Array();
//
//                            $rootScope.contact3 = new Array();
//
//                            $rootScope.test = '';
//                            for(var k in query[i].SELECT) {
//
//                                $rootScope.jsontext[k] = '{"v":"'+ query[i].SELECT[k].NOTE+'"}';
//                                $rootScope.jsontext2[k] = '{"v":'+ query[i].SELECT[k].POLL_CNT+'}';
//
//                                $rootScope.contact[k] = JSON.parse($rootScope.jsontext[k]);
//                                $rootScope.contact2[k] = JSON.parse($rootScope.jsontext2[k]);
//
//                                $rootScope.contact3[k] = $rootScope.contact[k] + $rootScope.contact2[k];
//                            }
//
//                            for(var q=0; q < $rootScope.contact3.length; q++){
//                                console.log($rootScope.contact[q]);
//                                console.log($rootScope.contact2[q]);
//                            }
//
////                            for(var q=0; q < $rootScope.contact2.length; q++){
////                                console.log($rootScope.contact2[q]);
////                            }
//
//                            var test = '{"cols": [{"id": "t", "label": "Topping", "type": "string"}, {"id": "s", "label": "Slices", "type": "number"} ], "rows": []}';
//                            var obj = JSON.parse(test);
//
//                            for(var q=0; q < $rootScope.contact3.length; q++){
//                                console.log($rootScope.contact[q]);
//                                console.log($rootScope.contact2[q]);
//                                obj['rows'].push({c:[$rootScope.contact[q], $rootScope.contact2[q]]});
//                            }
//
//                            //obj['rows'].push({c:[]});
//                            test = JSON.stringify(obj);
//                            var result = JSON.parse(test);
//                            console.log(result);
//
////                            var jsonStr = '{"theTeam":[{"teamId":"1","status":"pending"},{"teamId":"2","status":"member"},{"teamId":"3","status":"member"}]}';
////
////                            var obj = JSON.parse(jsonStr);
////                            obj['theTeam'].push({"teamId":"4","status":"pending"});
////                            jsonStr = JSON.stringify(obj);
////
////
////                            console.log(jsonStr);
//                            //{c:[]}
////                            $scope.chart[i].data = {"cols": [
////                                {id: "t", label: "Topping", type: "string"},
////                                {id: "s", label: "Slices", type: "number"}
////                            ], "rows": [
////                                {c: [
////                                    $rootScope.contact[0],
////                                    $rootScope.contact2[0]
////                                ]},
////                                {c:[
////                                    {v:"예(Q3번으로)"}
////                                    ,{v:1}
////                                ]},
////                                {c:[
////                                    {v:"아니오(Q4번으로)"}
////                                    ,{v:1}
////                                ]}
////                            ]};
//                            $scope.chart[i].data = result;
//
//                            // $routeParams.chartType == BarChart or PieChart or ColumnChart...
//                            $scope.chart[i].type = 'PieChart';
////                            $scope.chart[i].options = {
////                                'title': 'How Much Pizza I Ate Last Night'
////                            }
//
//                        }


                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_saveAngePoll = function (no, poll_st) {


            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 설문조사에 참여 할 수 있습니다.', {size: 'md'});
                return;
            }

            if(poll_st == 0){
                dialogs.notify('알림', '종료된 설문조사 입니다.', {size: 'md'});
                return;
            }

            $scope.search['ada_idx'] = no;

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

                        var answer = [];
                        $scope.item.QUE_SHORT_ANSWER = ''
                        $("input[name='answer[]'").each(function(index, element) {
                            $scope.item.QUE_SHORT_ANSWER = $(element).val();
                            answer.push($scope.item.QUE_SHORT_ANSWER); // 주관식
                        })


                        var values = {};
                        $('.poll_select_radio:checked').each(function() {

                            if(this.value == undefined){
                                values[this.name] = "";
                            }
                            values[this.name] = this.value;
                            answer.push(values[this.name]);
                            console.log(this.value);
                        });

                        $rootScope.jsontext2 = new Array();
                        //
//                        for(var i=0; i<answer.length; i++){
//                            var index = parseInt(i+1);
//                            $rootScope.jsontext2[i] = '"'+index+'":"'+ answer[i]+'"';
//                        }
                        $("input[name='index[]'").each(function(index, element) {
                            //$scope.item.QUE_SHORT_ANSWER = $(element).val();
                            $rootScope.jsontext2[$(element).val()] = '"'+$(element).val()+'":"'+ answer[index]+'"';
                        })

                        $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
                        console.log($scope.item.ANSWER);

                        $scope.insertItem('ange/poll', 'answear', $scope.item, false) //$scope.queue
                            .then(function(){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $location.url('/people/poll/list');
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_showAngePollList = function() {
            $location.url('/people/poll/list');
        }



        $scope.init();
        $scope.getAngePoll();
    }]);

});


