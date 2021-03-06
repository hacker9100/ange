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
    controllers.controller("peoplepoll-edit", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', '$sce', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams,$sce) {

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

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10){
            mm = '0'+mm;
        }

        if(dd < 10){
            dd = '0'+dd;
        }

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;


        // 차트
        $scope.chart = {};
        $scope.chartObject = {};
        $scope.percent = {};

        $rootScope.jsontext = new Array();
        $rootScope.jsontext2 = new Array();

        $rootScope.contact = new Array();
        $rootScope.contact2 = new Array();

        $rootScope.contact3 = new Array();
        $rootScope.contact4 = new Array();

        $rootScope.rate = new Array();

        $rootScope.select_cnt = [];


        $scope.init = function (){
            $scope.nextclick = true;
            $scope.preclick = false;

            $scope.search.ada_idx = $stateParams.id;
            $scope.getList('ange/poll', 'check', {}, $scope.search, false)
                .then(function(data){
                    var answer_cnt = data[0].POLL_ANSWER_CNT;

                    if (answer_cnt == 1) {
                        $scope.comp_yn = 'Y';
                    }else{
                        $scope.comp_yn = 'N';
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

        // 통계
        $scope.getChart = function (){
            $scope.search.ada_idx = $stateParams.id;


            $rootScope.select_answer = [];
            $rootScope.select_cnt = [];

            $rootScope.arr2 = new Array();

            $scope.getList('ange/poll', 'chartlist', {}, $scope.search, true)
                .then(function(data){

                    var object = JSON.stringify(data);
                    var parsed = JSON.parse(object);
                    console.log(data);

                    //console.log(parsed);

                    for(var x in parsed){
                        //data[x] = data[x].split("|");
                        $rootScope.arr.push(data[x]);
                    }

                    for (var i = 0; i < $rootScope.arr.length; i++) {
                        $scope.chart[i] = {};
                        $scope.chartObject[i] = {};
                        $scope.percent[i] = {};

                        $rootScope.test = '{"cols": [{"id": "t", "label": "Topping", "type": "string"}, {"id": "s", "label": "", "type": "number"} ], "rows": []}';
                        $rootScope.obj = JSON.parse($rootScope.test);

                        $rootScope.arr[i] = $rootScope.arr[i].split("^");

                        $rootScope.arr2.push($rootScope.arr[i]);

                        for(var j = 0; j < $rootScope.arr2[i].length; j++){
                            if($rootScope.arr2[i][j] != "[['선택','응답율']"){

                                $rootScope.arr2[i][j] = $rootScope.arr2[i][j].replace(/\[/g,''); //특정문자 제거
                                $rootScope.arr2[i][j] = $rootScope.arr2[i][j].replace(/\]/g,''); //특정문자 제거

                                $rootScope.arr2[i][j] = $rootScope.arr2[i][j].split('|');


                                $rootScope.jsontext[i] = '{"v":"'+ $rootScope.arr2[i][j][0]+'"}';
                                $rootScope.jsontext2[i] = '{"v":'+ $rootScope.arr2[i][j][1]+'}';

                                $scope.percent[i][j]= $rootScope.arr2[i][j][1];

                                //console.log($rootScope.arr2[i][j][1]);
                                $rootScope.contact[i] = JSON.parse($rootScope.jsontext[i]);
                                $rootScope.contact2[i] = JSON.parse($rootScope.jsontext2[i]);

                                var test = $rootScope.contact[i] + $rootScope.contact2[i];
                                $rootScope.obj['rows'].push({c:[$rootScope.contact[i], $rootScope.contact2[i]]});
                            }
                        }

                        var a = JSON.stringify($rootScope.obj);
                        $rootScope.result = JSON.parse(a);

                        $scope.chart[i].data = $rootScope.result;

                        $scope.chart[i].type = 'PieChart';

                        $scope.chartObject[i].data = $rootScope.result;

                        $scope.chartObject[i].type = 'ColumnChart';

                        $scope.chartObject[i].displayed = true;
                    }
                })
                ['catch'](function(error){});
        }

        $scope.getChart2 = function (){
            $scope.search.ada_idx = $stateParams.id;


            $rootScope.select_answer = [];
            $rootScope.select_cnt = [];

            $rootScope.arr3 = new Array();

            $scope.getList('ange/poll', 'chartlist2', {}, $scope.search, true)
                .then(function(data){

                    //console.log(data);
                    var object = JSON.stringify(data);
                    var parsed = JSON.parse(object);

                    //console.log(parsed);

                    for(var x in parsed){
                        //data[x] = data[x].split("|");
                        $rootScope.columnarr.push(data[x]);
                    }

                    //console.log($rootScope.arr);
                    for (var i = 0; i < $rootScope.columnarr.length; i++) {
                        //console.log($rootScope.columnarr[i]);

                        $scope.chartObject[i] = {};
                        //$scope.chart[i].data = '';

                        $rootScope.test = '{"cols": [{"id": "t", "label": "Topping", "type": "string"}, {"id": "s", "label": "Slices", "type": "number"} ], "rows": []}';
                        $rootScope.obj = JSON.parse($rootScope.test);

                        $rootScope.columnarr[i] = $rootScope.columnarr[i].split("^");

                        $rootScope.arr3.push($rootScope.columnarr[i]);

                        for(var j = 0; j < $rootScope.arr3[i].length; j++){

                            //console.log($rootScope.arr2[i][j]);

                            if($rootScope.arr3[i][j] != "[['선택','응답율']"){

                                $rootScope.arr3[i][j] = $rootScope.arr3[i][j].replace(/\[/g,''); //특정문자 제거
                                $rootScope.arr3[i][j] = $rootScope.arr3[i][j].replace(/\]/g,''); //특정문자 제거

                                $rootScope.arr3[i][j] = $rootScope.arr3[i][j].split('|');


                                $rootScope.jsontext[i] = '{"v":"'+ $rootScope.arr3[i][j][0]+'"}';
                                $rootScope.jsontext2[i] = '{"v":'+ $rootScope.arr3[i][j][1]+'}';

                                $rootScope.contact[i] = JSON.parse($rootScope.jsontext[i]);
                                $rootScope.contact2[i] = JSON.parse($rootScope.jsontext2[i]);


                                var test = $rootScope.contact[i] + $rootScope.contact2[i];
                                $rootScope.obj['rows'].push({c:[$rootScope.contact[i], $rootScope.contact2[i]]});
                            }
                        }

                        var a = JSON.stringify($rootScope.obj);
                        //console.log(JSON.parse(a));
                        $rootScope.result = JSON.parse(a);

                        $scope.chartObject[i].data = $rootScope.result;

                        $scope.chartObject[i].type = 'ColumnChart';

                        $scope.chartObject[i].displayed = true;
                    }
                })
                ['catch'](function(error){});
        }

        // 게시판 조회
        $scope.getAngePoll = function () {

            $("#select_sort").attr("checked", 'checked');

            $rootScope.arr = new Array();
            $rootScope.columnarr = new Array();

            $rootScope.a = [];
            $rootScope.aa = [];
            if ($stateParams.id != 0) {
                $scope.getItem('ange/poll', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;

                        var que_data = $scope.item.ada_que_info;

                        $scope.renderHtml = $sce.trustAsHtml(data.ada_text);

                        $scope.item.QUE = [];
                        //$scope.item.QUE = new Array();
                        que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                        var parse_que_data = JSON.parse(que_data);


                        for(var x in parse_que_data){

                            var choice = [];
                            if(parse_que_data[x].type == 0){ // 객관식일때
                                var select_answer = parse_que_data[x].choice.split(';'); // ,를 기준으로 문자열을 잘라 배열로 변환

                                $rootScope.test = '';

                                for(var i=0; i < select_answer.length; i++){

                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                    //console.log(select_answer[i]);

                                    $rootScope.aa.push(select_answer[i]);

                                }

                            }else if(parse_que_data[x].type == 1){ // 주관식일때
                                choice = "";
                            }else if(parse_que_data[x].type == 2){ // 통합형
                                var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                for(var i=0; i < select_answer.length; i++){
                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                }
                            }else if(parse_que_data[x].type == 3){ // 복수
                                var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                for(var i=0; i < select_answer.length; i++){
                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
                                }
                            }else if(parse_que_data[x].type == 4){ // 장문입력
                                choice = "";
                            }

                            var index = parseInt(x)+parseInt(1);
                            $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});

                        }

                        if(data.ada_state == 0){
                            $scope.showPollView = false;
                        }else{
                            $scope.showPollView = true;
                        }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        function CheckForm(p_obj){

            //alert(p_obj.name);
            //$("#validation")

            var t_pattern = { 'id':/^[a-zA-Z0-9_]+$/,'email':/^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{2,5}$/,'number':/^[0-9]+$/ };

            for(var t_cnt=0; t_cnt< p_obj.length; t_cnt++){

                var t_obj = p_obj.elements[t_cnt];

                //alert(t_obj.name);

                // 유효한 항목인지 확인
                if (typeof t_obj!='undefined' && t_obj.name!=''){

                    // 검사 대상인지 확인
                    if (t_obj.title!='' &&  t_obj.type!='button' && t_obj.type!='submit' ){
                        var t_item = t_obj.title.split(':');

                        if (t_obj.type=='radio' || t_obj.type=='checkbox'){

                            var t_value = $('input[name="'+t_obj.name+'"]:checked').val();

                            if ( !t_value ){
                                alert(t_item[0]+'란은 꼭 선택하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }
                        }

                        if (t_obj.type=='text' || t_obj.type=='password' || t_obj.type=='file' || t_obj.type == 'textarea'){

                            if (!t_obj.value){
                                alert(t_item[0]+'란은 꼭 입력하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }

                            if (t_obj.alt!='' && Number(t_obj.alt)>t_obj.value.length ){
                                alert(t_item[0]+'란에는 최소 '+t_obj.alt+'자 이상 입력하셔야만 합니다.');
                                t_obj.focus();
                                return false;
                            }

                            if (t_item.length>1) {
                                alert(t_pattern[t_item[1]].test(t_obj.value));
                                if (t_pattern[t_item[1]].test(t_obj.value)==false) {
                                    alert(t_item[0]+'란에 적절하지 않은 값이 입력되었습니다.');
                                    t_obj.focus();
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        }

        $scope.click_saveAngePoll = function (no, item) {


            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 설문조사에 참여 할 수 있습니다.', {size: 'md'});
                return;
            }

//            if(item.ada_state ==  0){
//                dialogs.notify('알림', '시행중인 설문조사가 아닙니다.', {size: 'md'});
//                return;
//            }

            if($scope.todayDate < item.ada_date_open){
                dialogs.notify('알림', '설문조사 기간이 아닙니다.', {size: 'md'});
                return;
            }

            if(item.ada_date_close <  $scope.todayDate){
                dialogs.notify('알림', '종료된 설문조사 입니다.', {size: 'md'});
                return;
            }


            if(CheckForm(document.getElementById("validation")) == false){
                return;
            }


            $scope.search['ada_idx'] = no;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            $scope.search['USER_UID'] = $rootScope.uid; // 테스트

            // 설문조사 참여여부 체크
            // 사용자아이디와 설문조사 번호를 가지고 조회하여
            // cnt가 1일때 목록으로 이동 아니면 저장

            //console.log($("input[name='index[]'").length);



            $rootScope.jsontext2 = new Array();
            var poll_length = $('.poll_no').length;
            console.log(poll_length);

            //$rootScope.jsontext2 = new Array();
            for(var i=1; i<= poll_length; i++){

                if(document.getElementById("answer"+i).type == 'radio'){
                    $rootScope.jsontext2[i] = '"'+i+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                }else if(document.getElementById("answer"+i).type == 'checkbox'){
                    var checkvalue = '';
                    $("input[name=answer"+i+"]:checked").each(function() {
                        checkvalue += $(this).val() + ';';
                    });
                    $rootScope.jsontext2[i] = '"'+i+'":"'+ checkvalue+'"';
                }else if(document.getElementById("answer"+i).type == 'text'){
                    $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                }else if(document.getElementById("answer"+i).type == 'textarea'){
                    $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                }

            }

            $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';

            $scope.item.ANSWER = item.ANSWER.replace(/{,/ig, '{');
            console.log($scope.item.ANSWER);


            $scope.getList('ange/poll', 'check', {}, $scope.search, false)
                .then(function(data){
                    var answer_cnt = data[0].POLL_ANSWER_CNT;

                    if (answer_cnt == 1) {
                        dialogs.notify('알림', '이미 이 설문조사에 참여하셨습니다.', {size: 'md'});
                        $location.url('/people/poll/list');
                    } else {
                        $rootScope.jsontext2 = new Array();

                        var poll_length = $('.poll_no').length;
                        console.log(poll_length);


                        for(var i=1; i<=poll_length; i++){

                            if(document.getElementById("answer"+i).type == 'radio'){
                                $rootScope.jsontext2[i] = '"'+i+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                            }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                var checkvalue = '';
                                $("input[name=answer"+i+"]:checked").each(function() {
                                    checkvalue += $(this).val() + ';';
                                    console.log(checkvalue);
                                });
                               $rootScope.jsontext2[i] = '"'+i+'":"'+ checkvalue+'"';
                            }else if(document.getElementById("answer"+i).type == 'text'){
                                $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                            }else if(document.getElementById("answer"+i).type == 'textarea'){
                                $rootScope.jsontext2[i] = '"'+i+'":"'+ document.getElementById("answer"+i).value+'"';
                            }
                        }

                        $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
                        $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                        console.log($scope.item.ANSWER);

                        $scope.insertItem('ange/poll', 'answear', $scope.item, false) //$scope.queue
                            .then(function(){
                                $scope.addMileage('POLL', null);

                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $location.url('/people/poll/list');
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_showAngePollList = function() {
            $location.url('/people/poll/list');
        }
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getAngePoll)
            .then($scope.getChart)
            ['catch']($scope.reportProblems);
    }]);
});


