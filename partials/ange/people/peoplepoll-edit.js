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

        $scope.piedata = [];
        $scope.pielabels = [];

        // 차트
        $scope.chart;
//        $scope.labels1 = ["예", "아니오"];
//        $scope.data1 = [1, 0];
        $scope.labels1 = [];
        $scope.data1 = [];
        $scope.labels2 = [];
        $scope.data2 = [];
        $scope.labels3 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data3 = [300, 500, 100, 40, 120];
        $scope.labels4 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data4 = [300, 500, 100, 40, 120];
        $scope.labels5 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data5 = [300, 500, 100, 40, 120];
        $scope.labels6 = ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"];
        $scope.data6 = [300, 500, 100, 40, 120];

        $scope.chart = {};

        $scope.onions = [
            {v: "Onions"},
            {v: 3},
        ];

        $scope.chart[1] = {};

        $scope.chart[1].data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: [
                {v: "Mushrooms"},
                {v: 3},
            ]},
            {c: $scope.onions},
            {c: [
                {v: "Olives"},
                {v: 31}
            ]},
            {c: [
                {v: "Zucchini"},
                {v: 1},
            ]},
            {c: [
                {v: "Pepperoni"},
                {v: 2},
            ]}
        ]};


        // $routeParams.chartType == BarChart or PieChart or ColumnChart...
        $scope.chart[1].type = 'PieChart';
        $scope.chart[1].options = {
            'title': 'How Much Pizza I Ate Last Night'
        }


        // Chart.js Data
//        $scope.data = [
//            {
//                value: 300,
//                color:"#F7464A",
//                highlight: "#FF5A5E",
//                label: "Red"
//            },
//            {
//                value: 50,
//                color: "#46BFBD",
//                highlight: "#5AD3D1",
//                label: "Green"
//            },
//            {
//                value: 100,
//                color: "#FDB45C",
//                highlight: "#FFC870",
//                label: "Yellow"
//            }
//        ];
//
        // Chart.js Options
//        $scope.options =  {
//
//            responsive: true,
//
//            maintainAspectRatio: true,
//
//            //Boolean - Whether we should show a stroke on each segment
//            segmentShowStroke : true,
//
//            //String - The colour of each segment stroke
//            segmentStrokeColor : "#fff",
//
//            //Number - The width of each segment stroke
//            segmentStrokeWidth : 2,
//
//            //Number - The percentage of the chart that we cut out of the middle
//            percentageInnerCutout : 50, // This is 0 for Pie charts
//
//            //Number - Amount of animation steps
//            animationSteps : 100,
//
//            //String - Animation easing effect
//            animationEasing : "easeOutBounce",
//
//            //Boolean - Whether we animate the rotation of the Doughnut
//            animateRotate : true,
//
//            //Boolean - Whether we animate scaling the Doughnut from the centre
//            animateScale : false,
//
//            legendTemplate : "<ul style=\"width:10px; height:10px\" class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"width:10px; height:10px;background-color:<%=segments[i].fillColor%>\"></span><font size=\"1pt\"><%if(segments[i].label){%><%=segments[i].label%><%}%></li></font></li></li><%}%></ul>"
//
//        }


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

                            console.log(query[i].SELECT);

                            var piechart = query[i].SELECT;

                            for(var j in piechart){


//                                if(query[i].SELECT[j].QUERY_NO == 12){
//                                    $scope.data1.push(query[i].SELECT[j].POLL_CNT);
//                                    $scope.labels1.push(query[i].SELECT[j].NOTE);
//                                } else if (query[i].SELECT[j].QUERY_NO == 13){
//                                    $scope.data2.push(query[i].SELECT[j].POLL_CNT);
//                                    $scope.labels2.push(query[i].SELECT[j].NOTE);
//                                }

//                                console.log($scope.data1);
//                                console.log($scope.labels1);
                            }


                            $scope.queue.push({"BOARD_NO":query[i].BOARD_NO,"QUERY":query[i].QUERY,"QUERY_GB":query[i].QUERY_GB,"QUERY_NO":query[i].QUERY_NO,"QUERY_SORT":query[i].QUERY_SORT,"SELECT":query[i].SELECT});
                            //$("#select_sort").attr('checked', true);

                            $('input:radio[name=q2_'+query[i].QUERY_NO+']').attr('checked','checked');
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


