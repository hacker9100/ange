/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplelinetalk-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};

        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.showDetails = false;
        $scope.showCommentDetails = false;
        $scope.showReCommentDetails = false;

        $scope.replyList = [];

        $scope.search.PAGE_NO = 1;
        $scope.search.PAGE_SIZE = 10;
        $scope.search.TOTAL_COUNT = 0;

        $scope.TODAY_TOTAL_COUNT = 0;


        // 일일 날짜 셋팅
        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var thisyear = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var lastdd = new Date(thisyear, mm ,0);
        var lastday = lastdd.getDate();

        if(mm < 10){
            mm = '0'+mm;
        }

        if(dd < 10){
            dd = '0'+dd;
        }

        var today = thisyear+'-'+mm+'-'+dd;
        var year = [];
        var month = [];
        var day = [];

        for (var i = thisyear; i >= 2000; i--) {
            year.push(i+'');
        }

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        for (var i = 1; i <= lastday; i++) {

            if(i < 10){
                i = '0'+i;
            }
            day.push(i+'');
        }

        $scope.month = month;
        $scope.today_month= mm;
        $scope.day = day;
        $scope.today_day = dd;
        $scope.year = year;
        $scope.today_year = thisyear;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getPeopleReplyList();
        };


        $(document).ready(function(){

            $("#reply_sort_date").addClass("selected");
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $("#reply_sort_idx").click(function(){
                $scope.search.SORT = 'NO';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_idx").addClass("selected");
                $("#reply_sort_date").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });

            $("#reply_sort_date").click(function(){
                $scope.search.SORT = 'REG_DT';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_date").addClass("selected");
                $("#reply_sort_idx").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });
        });

        // 초기화
        $scope.init = function(session) {
            var idx = 0;
            for(var i=0; i < $scope.month.length; i ++){
                if(JSON.stringify($scope.today_month) == JSON.stringify($scope.month[i])){
                    idx = i;
                }
            }
            $scope.search.MONTH = $scope.month[idx];


            var idx2 = 0;
            for(var i=0; i < $scope.year.length; i ++){
                if(JSON.stringify($scope.today_year) == JSON.stringify($scope.year[i])){
                    idx = i;
                }
            }
            $scope.search.YEAR = $scope.year[idx];

            $scope.search.DAY = $scope.today_day;

        };


        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            if ($scope.talkitem == undefined) {
                return;
            }

            $scope.search.REPLY_GB = 'linetalk';
            $scope.search.TARGET_GB = 'TALK';
            $scope.search.TARGET_NO = $scope.talkitem.NO;
/*            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC'; */

            $scope.search.TODAY_DATE = true;

            $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.search.TOTAL_COUNT = 0;
                    }else{
                        $scope.search.TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                    }

                    var reply = data.COMMENT;

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT, "REG_UID":reply[i].REG_UID});
                    }

                })
                ['catch'](function(error){$scope.replyList = ""; $scope.search.TOTAL_COUNT=0;});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $scope.talkitem.NO;
            $scope.item.REPLY_GB = 'linetalk';
            $scope.item.TARGET_GB = 'TALK';

            if($scope.item.COMMENT.length > 100){
                dialogs.notify('알림', '100자 이내로 입력하세요.', {size: 'md'});
                return;
            }

            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){
                    $scope.addMileage('REPLY', 'TALK');

                    $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                        .then(function(data){
                            if(data.COMMENT == null){
                                $scope.TODAY_TOTAL_COUNT = 0;
                            }else{
                                $scope.TODAY_TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                            }
                        })
                        ['catch'](function(error){$scope.replyList = ""; $scope.TODAY_TOTAL_COUNT = 0;});

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.item.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.updateItem('com/reply', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.item.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            console.log(item);
            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply', 'item', item, true)

                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.replyList = [];
                        $scope.getPeopleReplyList();

                        $scope.item.COMMENT = "";
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 연도 선택
        $scope.change_year = function(year){

           $scope.search.YEAR = year;

            $scope.replyList = [];
           $scope.getTalkSubject();
//           $scope.getPeopleReplyList();
        }

        // 월 선택
        $scope.change_month = function(month){

           $scope.search.MONTH = month;

            var change_lastdd = new Date(thisyear, month ,0);
            var change_lastday = change_lastdd.getDate();

            var change_day = [];
            for (var i = 1; i <= change_lastday; i++) {

                if(i < 10){
                    i = '0'+i;
                }
                change_day.push(i+'');
            }
            $scope.day = change_day;

            $scope.replyList = [];
            $scope.getTalkSubject();
//            $scope.getPeopleReplyList();
        }

        // 일 선택
        $scope.search_day = function(day){


            var searchdate = $scope.search.YEAR+$scope.search.MONTH+day;
            today = today.replace(/-/gi, "");
//            console.log($scope.search.MONTH);
//            console.log($scope.search.YEAR);

            console.log(searchdate);
            console.log(today);

            if($rootScope.role != 'ANGE_ADMIN'){
                if(today < searchdate){
                    dialogs.notify('알림', '오늘과 이전일 톡주제만 검색이 가능합니다.', {size: 'md'});
                    return;
                }
            }

            $scope.search.DAY = day;

            $scope.replyList = [];
            $scope.getTalkSubject();
//            $scope.getPeopleReplyList();
        }

        $scope.getTalkSubject = function (){

            $scope.search.TODAY_DATE = true;

            $scope.getItem('com/reply', 'subjectitem', {}, $scope.search, true)
                .then(function(data){
                    $scope.talkitem = data;
                    var file = data.FILE;
                    if (file) {
                        $scope.file = {"name":file.FILE_NM,"size":file.FILE_SIZE,"url":UPLOAD.BASE_URL+file.PATH+file.FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+file.FILE_NM,"deleteType":"DELETE","kind":angular.lowercase(file.FILE_GB)};
                    }

                    $scope.getPeopleReplyList();
                })
                ['catch'](function(error){
                    $scope.talkitem="";
                    console.log('aa = '+$scope.talkitem);
                });

        }

        $scope.today = function() {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getTalkSubject)
            ['catch']($scope.reportProblems);
    }]);
});
