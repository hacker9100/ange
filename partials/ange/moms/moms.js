/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : momsboard-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsboard-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, $filter, dialogs, UPLOAD, $http) {

        $scope.checked = true;
        // 게시판 초기화
        $scope.item = {};

        $(document).ready(function(){

            $("#check_reply").prop("checked",true);
            $("input[name='check']").prop("checked",true);

            if($scope.role == 'ANGE_MANAGER' || $scope.role == 'ANGE_ADMIN'){
                $("input[name='noti_check']").prop("checked",true);
                $scope.item.NOTICE_FL = "true";
            }else{
                $("input[name='noti_check']").prop("checked",false);
                $scope.item.NOTICE_FL = "false";
            }

            $("#checkall").click(function(){
                //클릭되었으면
                if($("#checkall").is(":checked")){
                    $("input[name='check']").prop("checked",true);
                    $scope.item.SCRAP_FL = "true";
                    $scope.item.REPLY_FL = "true";
                }else{ //클릭이 안되있으면
                    $("input[name='check']").prop("checked",false);
                    $scope.checked = false;
                }
            })
//            $("#check_scrap").click(function(){
//                if(!$("#check_scrap").is(":checked")){
//                    $scope.item.SCRAP_FL = "true";
//                }else{
//                    $scope.item.SCRAP_FL = "false";
//                }
//            });
//
//            $("#check_reply").click(function(){
//                if(!$("#check_reply").is(":checked")){
//                    $scope.item.REPLY_FL = "true";
//                }else{
//                    $scope.item.REPLY_FL = "false";
//                }
//            });
        });

        $(function(){
            $("#check_scrap").click(function(){
                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true";
                }else{
                    $scope.item.SCRAP_FL = "false";
                    $("input[name='check']").prop("checked",false);
                    $("#checkall").attr("checked",false);
                }
            });

            $("#check_reply").click(function(){
                if($("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true";
                }else{
                    $scope.item.REPLY_FL = "false";
                    $("input[name='check']").prop("checked",false);
                    $("#checkall").attr("checked",false);
                }
            });

            $("#notice_fl").click(function(){
                if($("#notice_fl").is(":checked")){
                    $scope.item.NOTICE_FL = "true";
                }else{
                    $scope.item.NOTICE_FL = "false";
                    $("input[name='check']").prop("checked",false);
                    $("#checkall").attr("checked",false);
                }
            });
        });

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;
        $scope.checkAll = false;

        $scope.checkFile = [];
        $scope.click_selectMainImage = function (file) {

            angular.forEach($scope.queue, function(file) {
                file.kind = '';
            });

            if (file.kind == 'MAIN') {
                file.kind = '';
            } else {
                file.kind = 'MAIN';
            }
        };

        $scope.click_checkAllToggle = function () {
            $scope.checkAll = !$scope.checkAll;

            if ($scope.checkAll) {
                $scope.item.queue = angular.copy($scope.queue);
            } else {
//                angular.forEach($scope.select, function(file) {
//                    $scope.select.pop();
//                });
                $scope.item.queue = [];
//                $scope.checkFile.splice(0, $scope.checkFile.length);
            }
//            console.log($scope.checkFile)
        };

        var state;
        $scope.click_checkFileDestroy = function () {
            angular.forEach($scope.item.queue, function(file) {
                state = 'pending';
                return $http({
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function () {
                        $scope.item.queue.splice($scope.checkFile.indexOf(file), 1);

                        state = 'resolved';
                        $scope.clear(file);
                    },
                    function () {
                        state = 'rejected';
                    }
                );
            });
        };

        $scope.click_checkFileEditor = function () {
            angular.forEach($scope.item.queue, function(file) {
                if (!angular.isUndefined(CKEDITOR)) {
                    var element = CKEDITOR.dom.element.createFromHtml( '<img alt="" src="'+file.url+'" />' );
                    CKEDITOR.instances.editor1.insertElement( element );
                }
            });
        };

        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];


        // 첨부파일 체크박스 리스트 초기화
        $scope.item.queue = [];

        $scope.search = {};
        // 초기화
        $scope.init = function() {

            $scope.item.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
//            $scope.search.COMM_GB = 'BOARD';
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>Hello</p>';

//        $scope.ckeditor = '<div><p>\n<p>aaa</div>'+
//        '<div class= "form-group" id="dropzone" name="dropzone" style="width:100%; height:100px; background-color: #f5f5f5; border: 1px solid #ddd transparent; text-align: center; font-weight: bold;">' +
//        '이미지를 여기에 드래그 앤 드롭하여 등록할 수 있습니다.<br />' +
//        '(gif, jpg, png만 등록 가능)' +
//        '</div>';

        /********** 이벤트 **********/
            // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');

        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == '1' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

                        if($scope.item.REPLY_FL == "Y"){
                            $("#check_reply").attr("checked", true);
                        }else{
                            $("#check_reply").attr("checked", false);
                        }

                        if($scope.item.NOTICE_FL == "1"){
                            $("#noti_check").attr("checked", true);
                        }else{
                            $("#noti_check").attr("checked", false);
                        }

                        if($scope.item.SCRAP_FL== "Y"){
                            $("#check_scrap").attr("checked", true);
                        }else{
                            $("#check_scrap").attr("checked", false);
                        }

                        if($scope.item.REPLY_FL == "Y" && $scope.item.SCRAP_FL== "Y"){
                            $("#checkall").attr("checked", true);
                        }else{
                            $("#checkall").attr("checked", false);
                        }

                        $scope.item.COMM_NO = data.COMM_NO;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE", "type" : files[i].FILE_EXT});
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleBoard = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'BOARD';
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            if ($stateParams.id == 0) {

                if($("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true"
                }else{
                    $scope.item.REPLY_FL = "false"
                }

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                if($("#notice_fl").is(":checked")){
                    $scope.item.NOTICE_FL = "true";
                }else{
                    $scope.item.NOTICE_FL = "false";
                }

                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

//                       $scope.item.REMAIN_POINT = 10;
//                       $scope.updateItem('ange/mileage', 'mileageitemplus', {}, $scope.item, false)
//                           .then(function(){
//                           })
//                           ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        $scope.addMileage($scope.item.BOARD_GB, $scope.menu.COMM_NO);

                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else {

                if($("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true"
                }else{
                    $scope.item.REPLY_FL = "false"
                }

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                if($("#notice_fl").is(":checked")){
                    $scope.item.NOTICE_FL = "true";
                }else{
                    $scope.item.NOTICE_FL = "false";
                }

                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

//                        $scope.item.REMAIN_POINT = 10;
//                        $scope.updateItem('ange/mileage', 'mileageitemminus', {}, $scope.item, false)
//                            .then(function(){
//                            })
//                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            ['catch']($scope.reportProblems);

    }]);

    controllers.controller('momsboard-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} , {name: "내용", value: "BODY"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        // 초기화
        $scope.init = function(session) {
            $scope.search.COMM_NO = $scope.menu.COMM_NO;

//            $scope.search.BOARD_GB = "WINNER";
//            if ($stateParams.menu == 'experiencewinner') {
//                $scope.search.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'eventwinner') {
//                $scope.search.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'postwinner') {
//                $scope.search.EVENT_GB = "POSTCARD";
//            }
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            console.log('getParam("page_no") = '+getParam("page_no"));

            if(getParam("page_no") == undefined){
                $scope.PAGE_NO = 1;
            }else{
                $scope.PAGE_NO = getParam("page_no");
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }
                $scope.search.KEYWORD = getParam("keyword");
            }
        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.isLoding = true;

            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    /*$scope.total(total_cnt);*/

                    for(var i in data) {

                        if (data[i].FILE != null) {
                            var file_cnt = data[i].FILE[0].FILE_CNT;
                            data[i].FILE_CNT = file_cnt;

                        }
                    }

                    $scope.list = data;

                    $scope.isLoding = false;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        $scope.click_showViewPeopleBoard = function(key){

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);

            $location.url('/moms/'+$stateParams.menu+'/view/'+key);
        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.role != 'ANGE_ADMIN') {
                dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        $scope.click_searchPeopleBoard = function (){
            //$scope.getPeopleBoardList();
            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('momsboard-view', ['$scope', '$rootScope', '$sce',  '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $sce, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};


        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'BOARD';

        $scope.replyList = [];

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $(document).ready(function(){

        });

        // 초기화
        $scope.init = function(session) {
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';
//            if ($stateParams.menu == 'experiencewinner') {
//                $scope.item.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'eventwinner') {
//                $scope.item.EVENT_GB = "EVENT";
//            } else if ($stateParams.menu == 'supporterboard') {
//                $scope.item.EVENT_GB = "SUPPORTER";
//            }

        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/moms/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            $location.url('/moms/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);

            //$location.url('/moms/'+$stateParams.menu+'/list/');
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        $scope.renderHtml = $sce.trustAsHtml(data.BODY);
                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };



        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/moms/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){
            /*
             if ($stateParams.menu == 'experiencewinner') {
             $scope.search.EVENT_GB = "EVENT";
             } else if ($stateParams.menu == 'eventwinner') {
             $scope.search.EVENT_GB = "EVENT";
             } else if ($stateParams.menu == 'supporterboard') {
             $scope.search.EVENT_GB = "SUPPORTER";
             }
             */

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){
            /*
             if ($stateParams.menu == 'experiencewinner') {
             $scope.search.EVENT_GB = "EVENT";
             } else if ($stateParams.menu == 'eventwinner') {
             $scope.search.EVENT_GB = "EVENT";
             } else if ($stateParams.menu == 'supporterboard') {
             $scope.search.EVENT_GB = "SUPPORTER";
             }
             */

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        $scope.likeFl = function (){
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.search.NO = $stateParams.id;
                $scope.search.TARGET_GB = 'BOARD';

                $scope.getItem('com/webboard', 'like', $stateParams.id, $scope.search, false)
                    .then(function(data){

                        if(data.TOTAL_COUNT == 0){
                            $scope.LIKE_FL = 'N';
                        }else{
                            $scope.LIKE_FL = data.LIKE_FL;
                            console.log($scope.LIKE_FL);
                        }

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.LIKE_FL = 'N';
            }

        }

        // 공감
        $scope.click_likeCntAdd = function(item, like_fl){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = like_fl;
            $scope.likeItem.TARGET_NO = item.NO;
            $scope.likeItem.TARGET_GB = 'BOARD';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.likeItem.LIKE_FL == 'Y' ? 'N' : 'Y';
                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.queue = [];
                        $scope.getPeopleBoard();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.queue = [];
                        $scope.getPeopleBoard();
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 스크랩이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.search['TARGET_NO'] = item.NO;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            $scope.search['REG_UID'] = 'hong'; // 테스트

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {

                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = item.NO;
                        $scope.scrap.TARGET_GB = item.BOARD_GB;

                        // [테스트] 등록자아이디, 등록자명, 닉네임 은 세션처리 되면 삭제할예정
                        $scope.scrap.REG_UID = 'hong';
                        $scope.scrap.NICK_NM = '므에에롱';
                        $scope.scrap.REG_NM = '홍길동';

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);

    }]);

    controllers.controller('momsevent-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
            }
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('momsevent-list', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD','$timeout', '$sce', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT, UPLOAD, $timeout, $sce) {


        angular.element(document).ready(function () {
            angular.element('#common').scroll(function () {
                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },1000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

//                console.log("common : "+ (angular.element('#common').prop('scrollHeight') - angular.element('#common').height()));
//                console.log("scrollTop : "+(angular.element('#common').scrollTop() ));

                if (angular.element('#common').scrollTop() + 100 >= angular.element('#common').prop('scrollHeight') - angular.element('#common').height()) {
                    if (!$scope.busy) {
                        $scope.PAGE_NO++;
                        //$scope.getContentList();
                        //$scope.getPeopleBoardList();
                        $scope.getPeopleBoardList();
                    }
//                    var scope = angular.element($("#listr")).scope();
//                    scope.$apply(function(){
//                        scope.PAGE_NO++;
//                        $scope.getContentList();
//                    });
                }
            });
        });

        $scope.search = {};
//        $scope.$parent.reload = false;
//        $scope.busy = false;
//        $scope.end = false;
        $scope.$parent.reload = false;
        $scope.busy = false;
        $scope.end = false;
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 15;
        //$scope.list = {};


        // 초기화
        $scope.init = function() {

            $scope.option = {title: '롤링 배너', api:'ad/banner', size: 5, id: 'main', type: 'banner', gb: 5, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            //$scope.search.ADA_STATE = 1;
            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "event";
                $scope.search.PERFORM_FL = "N";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "event";
                $scope.search.PERFORM_FL = "Y";
            }

            $scope.search.PROCESS = "process"; // 진행중인 이벤트


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
        };

        var isFirst = true;
        /********** 이벤트 **********/
            // 게시판 목록 조회
        $scope.$parent.getPeopleBoardList = function () {

            $scope.busy = true;
            if ($scope.$parent.reload) {
                $scope.end = false;
                $scope.list = [];
                $scope.PAGE_NO = 0;
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;

            $scope.search.NOT_POST = "Y";

            $scope.search.SORT = 'a.ada_date_open';
            $scope.search.ORDER = 'DESC';

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    var endDate = data[0].ada_date_close;

                    if(endDate >= $scope.todayDate){
                        $scope.showForm = "compForm";
                    }else{
                        $scope.showForm = "reviewForm";
                    }

                    for(var i in data) {
                        var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                        data[i].ada_preview_img = img;
                        $scope.list.push(data[i]);
                    }

                    //$scope.list = data;

                    $scope.$parent.reload = false;
                    $scope.busy = false;
//                    if (isFirst) {
//                        console.log($scope.PAGE_NO);
//
//                        $scope.PAGE_NO = $scope.PAGE_NO + 1;
//                        $scope.PAGE_SIZE = 1;
//                        isFirst = false;
//                    }

                })
                ['catch'](function(error){$scope.end = true;}); // $scope.TOTAL_COUNT = 0; $scope.list = "";
        };

        // 상세보기
        $scope.view_momsevent = function(key){

            $rootScope.focus = 'view';

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+key);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+key);
            }

        }

        //  응모하기
        $scope.comp_momsevent = function(item){

//            if (item.ada_state == 0) {
//                dialogs.notify('알림', "이벤트 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }
//
//            if ($scope.todayDate < item.ada_date_open || $scope.todayDate > item.ada_date_close) {
//                dialogs.notify('알림', "이벤트 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }

            $rootScope.focus = 'comp';

            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/view/'+item.ada_idx);
            } else if ($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/view/'+item.ada_idx);
            }

        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);

    controllers.controller('momsevent-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$window', '$location', '$timeout', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope,$rootScope, $sce, $stateParams, $window, $location, $timeout, dialogs, CONSTANT, UPLOAD) {

        $scope.imageMap = function(id) {
            if (angular.element('img[usemap=#'+id+']').attr('usemap') == undefined) {
                return;
            }

            var w = angular.element('img[usemap=#'+id+']').attr('width'),
                h = angular.element('img[usemap=#'+id+']').attr('height');

            function resize(){
                if (!w || !h) {
                    var temp = new Image();
                    temp.src = angular.element('img[usemap=#'+id+']').attr('src');
                    if(temp.src == undefined)
                        temp.src = angular.element('img[usemap=#'+id+']').attr('ng-src');

                    if (!w)
                        w = temp.width;
                    if (!h)
                        h = temp.height;
                }

                var wPercent = angular.element('img[usemap=#'+id+']').width()/100,
                    hPercent = angular.element('img[usemap=#'+id+']').height()/100,
                    map = angular.element('img[usemap=#'+id+']').attr('usemap').replace('#', ''),
                    c = 'coords';

                angular.element('map[name="' + map + '"]').find('area').each(function(){
                    var $this = $(this);

                    if (!$this.data(c)){
                        $this.data(c, $this.attr(c));
                    }

                    var coords = $this.data(c).split(','),
                        coordsPercent = new Array(coords.length);

                    for (var i = 0; i<coordsPercent.length; ++i){
                        if (i % 2 === 0){
                            coordsPercent[i] = parseInt(((coords[i]/w)*100)*wPercent);
                        } else {
                            coordsPercent[i] = parseInt(((coords[i]/h)*100)*hPercent);
                        };
                    };
                    $this.attr(c, coordsPercent.toString());
                });
            }
            angular.element($window).resize(resize).trigger('resize');
        };

        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.queue = [];
        $scope.search = {};

        $scope.item = {};
        $scope.item.BLOG = [];

        // 리뷰리스트
        $scope.reviewList = [];

        // 날짜 셀렉트 박스셋팅
        var year = [];
        var babyYear = [];
        var babyBirthYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];


        for (var i = nowYear ; i >= nowYear -10; i--) {
            babyYear.push(i+'');
        }

        for (var i = nowYear+1; i >= nowYear; i--) {
            babyBirthYear.push(i+'');
        }

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        for (var i = 1; i <= 31; i++) {

            if(i < 10){
                i = '0'+i;
            }
            day.push(i+'');
        }

        $scope.babyBirthYear = babyBirthYear;
        $scope.babyYear = babyYear;
        $scope.month = month;
        $scope.day = day;

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10) {
            mm = '0'+mm;
        }

        if(dd < 10) {
            dd = '0'+dd;
        }

        var today = year+mm+dd;
        $scope.todayDate = today;

        if($rootScope.focus == 'comp'){
            $('html,body').animate({scrollTop:$('#moms_state').offset().top}, 300);
            $('#preg_fl').focus();

        }else if($rootScope.focus == 'view'){
            $('html,body').animate({scrollTop:$('#view_state').offset().top}, 100);
            $('#event_view').focus();
        }


        $(document).ready(function(){

            $('input:radio[name="credit_agreement"]:input[value="Y"]').attr("checked", true);

            $("#credit_agreement_Y").click(function(){
                if(!$("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = "Y";
                }
            });

            $("#credit_agreement_N").click(function(){
                if(!$("#credit_agreement_N").is(":checked")){
                    $scope.item.CREDIT_FL = "N";
                }
            });
        });

        /********** 콘텐츠 랜더링 **********/
//        $scope.renderHtml = function(html_code) {
//            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
////            return html_code;
//        };

        /********** 이벤트 **********/

            // 사용자 정보수정 버튼 클릭
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item= {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){
                                $scope.item = data;
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $(document).ready(function(){
                        $('#birth_dt').css('display', 'none');

                        $("#preg_Y").click(function(){
                            if(!$("#preg_Y").is(":checked")){
                                $scope.item.PREGNENT_FL = "Y";
                                $('#birth_dt').css('display', 'block');
                            }
                        });

                        $("#preg_N").click(function(){
                            if(!$("#preg_N").is(":checked")){
                                $scope.item.PREGNENT_FL = "N";
                                $('#birth_dt').css('display', 'none');
                            }
                        });
                    });

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';
                        $scope.item.USER_NM = $scope.name;
                        $scope.item.NICK_NM = $scope.nick;

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.user_info();
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                    .then(function(data){

                        $rootScope.user_info.USER_ID = data.USER_ID;
                        $rootScope.user_info.USER_NM = data.USER_NM;
                        $rootScope.user_info.NICK_NM = data.NICK_NM;
                        $rootScope.user_info.ADDR = data.ADDR;
                        $rootScope.user_info.ADDR_DETAIL = data.ADDR_DETAIL;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.PHONE_1 = data.PHONE_1;
                        $rootScope.user_info.PHONE_2 = data.PHONE_2;
                        $rootScope.user_info.BLOG_URL = data.BLOG_URL;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };


        // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
                $scope.search.EVENT_GB = "EVENT";
                $scope.menu = "eventprocess"
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
                $scope.search.EVENT_GB = "EVENT";
                $scope.search.PERFORM_FL = "Y";
            }

            $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                .then(function(data){

                    $scope.USER_ID = data.USER_ID;
                    $scope.USER_NM = data.USER_NM;
                    $scope.NICK_NM = data.NICK_NM;
                    $scope.ADDR = data.ADDR;
                    $scope.ADDR_DETAIL = data.ADDR_DETAIL;
                    $scope.REG_DT = data.REG_DT;
                    $scope.REG_DT = data.REG_DT;
                    $scope.PHONE_1 = data.PHONE_1;
                    $scope.PHONE_2 = data.PHONE_2;
                    $scope.BLOG_URL = data.BLOG_URL;

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            // 리뷰 리스트 페이징 처리
            $scope.PAGE_NO = 1;
            $scope.TOTAL_COUNT = 0;

            $scope.search.ada_idx = $stateParams.id;
            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){

                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 1){
                        $scope.comp_yn = 'Y';
                    }else{
                        $scope.comp_yn = 'N';
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_focus = function(){
            $("#preg_fl").focus();
        }

        // 조회수
//        $scope.addHitCnt = function () {
//            $scope.updateItem('ange/event', 'hit', $stateParams.id, {}, false)
//                .then(function(){
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        }

        // 게시판 조회
        $scope.getMomsEvent = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

//                        $scope.open_date = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.open_date = data.ada_date_open.replace(/-/gi, "");
                        $scope.open_date2 = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.end_date = data.ada_date_close.replace(/-/gi, "");
                        $scope.end_date2 = data.ada_date_close.replace(/-/gi, "");
                        $scope.ada_detail = data.ada_detail != null ? data.ada_detail.replace(/&quot;/gi, '\"') : data.ada_detail;

                        if (data.ada_text != null) {
                            $scope.ada_text = data.ada_text.replace(/&quot;/gi, '\"');
                            $scope.ada_text = $scope.ada_text.replace(/src="(?!http)/gi, 'src="'+CONSTANT.AD_SERVER_URL);
                            $scope.ada_text = $scope.ada_text.replace(/background="(?!http)/gi, 'background="'+CONSTANT.AD_SERVER_URL);
                        }

                        if (data.ada_imagemap != null) {
                            $scope.ada_imagemap = data.ada_imagemap.replace(/&quot;/gi, '\"');
                            $scope.ada_imagemap = $scope.ada_imagemap.replace(/%name%/gi, 'adimage');
                        }

                        //$scope.ada_imagemap = data.ada_imagemap;

                        $scope.renderHtml = $sce.trustAsHtml($scope.ada_text+$scope.ada_imagemap);
                        $timeout(function() {
                            $scope.imageMap('adimage');
                        }, 500);


                        $scope.item = data;
                        $scope.item.BOARD_NO = data.ada_idx;

                        data.ada_preview_img = CONSTANT.AD_FILE_URL + data.ada_preview;
                        data.ada_content_img = CONSTANT.AD_FILE_URL + data.ada_image;


                        console.log('$scope.open_date2 = '+$scope.open_date2);

                        if($scope.todayDate <= $scope.end_date2|| $scope.open_date == '00000000'){ //if($scope.todayDate <= $scope.open_date2 || $scope.open_date2 == '00000000'){
                            $scope.showForm = "compForm";
                        }else{
                            $scope.showForm = "reviewForm";
                        }

                        $scope.item.ada_option_delivery = data.ada_option_delivery.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        if ($scope.tempEvent) return;

                        // 질문일 때
                        if($scope.item.ada_que_type == 'question'){
                            var que_data = data.ada_que_info;

                            //$scope.item.QUE = [];
                            $scope.item.QUE = new Array();
                            que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                            console.log(que_data);
                            var parse_que_data = JSON.parse(que_data);

                            console.log(parse_que_data);

                            for(var x in parse_que_data){

                                var choice = [];
                                if(parse_que_data[x].type == 0){ // 객관식일때
                                    var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                    for(var i=0; i < select_answer.length; i++){
                                        choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                console.log($scope.item.QUE);
                            }
                        }

                        // 질문일 때
                        if($scope.item.ada_que_type == 'upload'){

                            // 파일 업로드 설정
                            $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                            // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
                            $scope.$watch('newFile', function(data){
                                if (typeof data !== 'undefined') {
                                    $scope.file = data[0];
                                }
                            });

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        // 댓글일 때
                        if($scope.item.ada_que_type == 'reply'){

                            //$scope.item.REPLY_SUBJECT = $scope.item.ada_title;
                            $scope.search.PAGE_NO = 1;
                            $scope.search.PAGE_SIZE = 10;
                            $scope.search.TOTAL_COUNT = 0;

                            $scope.eventReplyList = [];


                            $scope.replyPageChange = function(){
                                console.log('Page changed to: ' + $scope.search.PAGE_NO);
                                $scope.eventReplyList = [];
                                $rootScope.getEventReplyList();
                            }

                            $scope.search.ada_idx = $stateParams.id;
                            $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                .then(function(data){

                                    $scope.REPLY_TOTAL_COUNT = data[0].TOTAL_COUNT;
                                })
                                .catch(function(error){$scope.eventReplyList = "";});

                            // 댓글 리스트
                            $rootScope.getEventReplyList = function () {

                                $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                    .then(function(data){

                                        $scope.search.TOTAL_COUNT = data[0].TOTAL_COUNT;
                                        for(var i in data) {

                                            data[i].adhj_answers = data[i].adhj_answers.replace(/{"1":"/gi, '');
                                            data[i].adhj_answers = data[i].adhj_answers.replace(/"}/gi, '');

                                            $scope.eventReplyList.push({'NICK_NM' : data[i].nick_nm, 'COMMENT' : data[i].adhj_answers, 'REG_DT' : data[i].adhj_date_request});
                                        }
                                    })
                                    .catch(function(error){$scope.eventReplyList = "";});
                            };

                            $rootScope.getEventReplyList();

                        }

                        if($scope.item.ada_que_type == 'join'){

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        // 날짜선택
                        if($scope.item.ada_que_type == 'reserve'){

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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


        // 이벤트 신청
        $scope.click_momseventcomp = function () {

            // 세션만료 되었을 때 리스트로 이동
            if($scope.uid == '' || $scope.uid == null){
                dialogs.notify('알림', '로그인 후 이용 가능합니다', {size: 'md'});
                return;

//                if ($stateParams.menu == 'eventprocess') {
//                    $location.url('/moms/eventprocess/list');
//                } else if($stateParams.menu == 'eventperformance') {
//                    $location.url('/moms/eventperformance/list');
//                }
            }

            // 현재날짜가 모집시작일이 아닐때
            if($scope.open_date > $scope.todayDate){
                dialogs.notify('알림', '모집 시작기간이 아닙니다', {size: 'md'});
                return;
            }

            // 이벤트 종료기간이 지났을때
            if($scope.end_date2 < $scope.todayDate){
                dialogs.notify('알림', '종료된 체험단 입니다', {size: 'md'});
                return;
            }

            if(CheckForm(document.getElementById("eventvalidation")) == false){
                return;
            }

            if($scope.item.ada_que_type == 'question'){ // 문답일때

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){

                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_question_no').length;
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

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'reserve'){ // 날짜예약선택

                // 정보제공 동의체크 확인
//                if($("#credit_agreement_Y").is(":checked")){
//                    $scope.item.CREDIT_FL = 'Y';
//                }else{
//                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
//                    return;
//                }
//
//                if($scope.item.BABY_YEAR == undefined){
//                    alert('아기 생일년도를 선택하세요');
//                    return;
//                }
//
//                if($scope.item.BABY_MONTH == undefined){
//                    alert('아기 생년월을 선택하세요');
//                    return;
//                }
//
//                if($scope.item.BABY_DAY == undefined){
//                    alert('아기 생년일을 선택하세요');
//                    return;
//                }

//                if($scope.item.DELIVERY_YEAR == undefined){
//                    alert('출산예정일 연도를 선택하세요');
//                    return;
//                }
//
//                if($scope.item.DELIVERY_MONTH == undefined){
//                    alert('출산예정일 월을 선택하세요');
//                    return;
//                }
//
//                if($scope.item.DELIVERY_DAY == undefined){
//                    alert('출산예정일 일을 선택하세요');
//                    return;
//                }
//                if($scope.item.DELIVERY_YEAR == undefined){
//                    $scope.item.DELIVERY_YEAR = '';
//                }else{
//                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
//                }
//
//                if($scope.item.DELIVERY_MONTH == undefined){
//                    $scope.item.DELIVERY_MONTH = '';
//                }else{
//                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
//                }
//
//                if($scope.item.DELIVERY_DAY == undefined){
//                    $scope.item.DELIVERY_DAY = '';
//                }else{
//                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
//                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_reserve_no').length;
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

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                if($scope.item.COMMENT == undefined || $scope.item.COMMENT == ''){
                    alert('댓글을 입력하세요');
                    return;
                }

                //console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'join'){ // 신청이나 응모일때

                // 정보제공 동의체크 확인
                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;


                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);

                            if($scope.item.QUE != undefined){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);
                            }else{
                                $scope.item.ANSWER = '{'+answer+'}';
                                console.log($scope.item.ANSWER);
                            }

                            //poll_join_no

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }else if($scope.item.ada_que_type == 'upload'){

                // 문답일때
                var answer = [];
                $rootScope.jsontext3 = "";

                console.log($scope.file);

                if ($scope.file == undefined) {
                    dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){

                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            $scope.item.FILE = $scope.file;

                            console.log($scope.item.QUE);

                            if($scope.item.QUE != undefined){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_upload_no').length;
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

                                var last_poll_length = 0;
                                last_poll_length = poll_length+1;
                                //$scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);

                                console.log($scope.item.ANSWER);

                            }else{

                                $rootScope.jsontext3 = '"1":"'+ $scope.file.name+'"';
                                $scope.item.ANSWER = '{'+$rootScope.jsontext3+'}';

                                console.log($scope.item.ANSWER);
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '이벤트 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EVENT', 'EVENT');

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

        }

        $scope.click_momseventlist = function (){
            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/list');
            } else if($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/list');
            }
        }

        $scope.getExperienceReviewList = function() {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;
            $scope.search.TARGET_GB = '';


            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO-1, SIZE: 5}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        // thumnail
                        var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        // 본문 html 태그 제거
                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        // data push
                        $scope.reviewList.push(data[i]);
                    }

                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.reviewList = "";});
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {
            if ($stateParams.menu == 'eventprocess' || $stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventreview/view/'+key);
            }
        };

        // 블로그 추가
        $scope.click_add_blog = function (){

            // clone 속성을 true 로 지정하면 이벤트도 같이 복사됨
            var new_blog =  $('span.blog:last').clone(true);
            new_blog.find('input').val('');
            $("#blog_url").append(new_blog);

            $(".button").each(function(index){
                $(".button:eq("+index+1+")").removeAttr('disabled');
            })
        }

        // 블로그 삭제
        $scope.delete_blog_url = function (){
            $('span.blog:last').remove();

            if($("input[name='blog[]'").length == 1){
                $(".button").attr('disabled','disabled');
            }
        }

        /* 댓글 (삭제예정) */

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


        // 페이지 변경
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getPeopleReplyList();
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {


            $scope.search.TARGET_NO = $stateParams.id;
            $scope.search.TARGET_GB = 'event';

            $scope.getItem('com/reply_event', 'item', {}, $scope.search, true)
                .then(function(data){

                    if(data.COMMENT == null){
                        $scope.search.TOTAL_COUNT = 0;
                    }else{
                        $scope.search.TOTAL_COUNT = parseInt(data.COMMENT[0].TOTAL_COUNT);
                    }

                    var reply = data.COMMENT;

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT, "REG_UID":reply[i].REG_UID});
                    }

                })
                .catch(function(error){$scope.replyList = ""; $scope.search.TOTAL_COUNT=0;});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            if ($rootScope.uid == null || $rootScope.uid == '') {
                dialogs.notify('알림', '등록할 수 없는 상태입니다.', {size: 'md'});
                return;
            }

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $stateParams.id;
            $scope.item.TARGET_GB = 'event';

            $scope.item.REMAIN_POINT = 10;

            if($scope.item.COMMENT.length > 100){
                dialogs.notify('알림', '100자 이내로 입력하세요.', {size: 'md'});
                return;
            }

            $scope.item.REG_UID = $rootScope.uid;
            $scope.item.NICK_NM = $rootScope.nick;

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('com/reply_event', 'check', {}, $scope.search, false)
                .then(function(data){
                    var cnt = data[0].COUNT;

                    if(cnt == 0){
                        $scope.insertItem('com/reply_event', 'item', $scope.item, false)
                            .then(function(){
                                $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                                    .then(function(data){
                                        if(data.COMMENT == null){
                                            $scope.TODAY_TOTAL_COUNT = 0;
                                        }else{
                                            $scope.TODAY_TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                                        }

                                        $scope.addMileage('EVENT', 'EVENT');
                                    })
                                    .catch(function(error){$scope.replyList = ""; $scope.TODAY_TOTAL_COUNT = 0;});

                                $scope.search.TARGET_NO = $stateParams.id;
                                $scope.replyList = [];
                                $scope.getPeopleReplyList();

                                $scope.item.COMMENT = "";
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이벤트는 한번만 참여가 가능합니다.', {size: 'md'});
                        return;
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});


        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.replyItem.REG_UID = $rootScope.uid;
            $scope.replyItem.NICK_NM = $rootScope.nick;

            $scope.updateItem('com/reply_event', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.item.COMMENT = "";
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            console.log(item);
            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply_event', 'item', item, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});

                        $scope.replyList = [];
                        $scope.getPeopleReplyList();

                        $scope.item.COMMENT = "";
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 주석해제 할 예정
//        $scope.getSession()
//          .then($scope.sessionCheck)
//          .catch($scope.reportProblems);

        $scope.tempReply = false;
        $scope.tempEvent = false;

        if ($stateParams.id == 39) {
            $scope.tempReply = true;
            $scope.tempEvent = true;

            if ($location.search()) {
                var param = $location.search();
                if(param.user_id != undefined && param.user_id != '') {
                    $scope.item.SYSTEM_GB = 'ANGE';
                    $scope.item.password = 'pass';

                    $scope.login(param.user_id, $scope.item)
                        .then(function(data){
                            $rootScope.login = true;
                            $rootScope.authenticated = true;
                            $rootScope.user_info = data;
                            $rootScope.uid = data.USER_ID;
                            $rootScope.name = data.USER_NM;
                            $rootScope.role = data.ROLE_ID;
                            $rootScope.system = data.SYSTEM_GB;
                            $rootScope.menu_role = data.MENU_ROLE;
                            $rootScope.email = data.EMAIL;
                            $rootScope.nick = data.NICK_NM;

                            if (data.FILE) {
                                $rootScope.profileImg = UPLOAD.BASE_URL + data.FILE.PATH + data.FILE.FILE_ID;
                            } else {
                                $rootScope.profileImg = null;
                            }

                        }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }
            }
        } else if ($stateParams.id == 55) {
            $scope.tempEvent = true;

            $scope.getSession()
//                .then($scope.logout())
                .then($scope.sessionCheck)
                .then($scope.moveAccount)
                .catch($scope.reportProblems);
        } else if ($stateParams.id == 56) {
            $scope.tempEvent = true;
        }

        $scope.logout = function () {
            if ($rootScope.uid != undefined) {
                $scope.logout($rootScope.uid).then( function(data) {});
            }
        }

        $scope.click_review = function(){
            $location.url('/moms/productreview/edit/0');
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMomsEvent)
            .then($scope.getExperienceReviewList)
            .catch($scope.reportProblems);

        console.log($rootScope.uid);

//        $scope.init();
////         $scope.addHitCnt();
//        $scope.getMomsEvent();
//        $scope.getExperienceReviewList();

        // 댓글리스트(삭제예정)
        $scope.getPeopleReplyList();

    }]);

    controllers.controller('momsexperience-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {


        $(document).ready(function(){

            $("#check_pregfl").click(function(){
                if(!$("#check_pregfl").is(":checked")){
                    $scope.item.PREG_FL = "true";
                }else{
                    $scope.item.PREG_FL = "false";
                }
            });

        });

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
            }
        };

        $scope.click_savePeopleClinic = function () {
            $scope.item.SYSTEM_GB = 'ANGE';


            if($("#check_pregfl").is(":checked")){
                $scope.item.PREG_FL = "true";
            }else{
                $scope.item.PREG_FL = "false"
            }

            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $location.url('/moms/experienceprocess/list');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };
        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('momsexperience-list', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD' ,'$timeout', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT, UPLOAD, $timeout) {

        angular.element(document).ready(function () {
            angular.element('#common').scroll(function () {
                $timeout(function(){
                    //$scope.images;
                    $scope.isLoading = false;
                },1000);

                $timeout(function() {
                    $scope.isLoading = true;
                });

//                console.log("common : "+ (angular.element('#common').prop('scrollHeight') - angular.element('#common').height()));
//                console.log("scrollTop : "+(angular.element('#common').scrollTop() ));

                if (angular.element('#common').scrollTop() + 100 >= angular.element('#common').prop('scrollHeight') - angular.element('#common').height()) {
                    if (!$scope.busy) {
                        $scope.PAGE_NO++;
                        //$scope.getContentList();
                        //$scope.getPeopleBoardList();
                        $scope.getPeopleBoardList();
                    }
//                    var scope = angular.element($("#listr")).scope();
//                    scope.$apply(function(){
//                        scope.PAGE_NO++;
//                        $scope.getContentList();
//                    });
                }
            });
        });

        $scope.search = {};
//        $scope.$parent.reload = false;
//        $scope.busy = false;
//        $scope.end = false;
        $scope.$parent.reload = false;
        $scope.busy = false;
        $scope.end = false;
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 15;
        //$scope.list = {};

        // 초기화
        $scope.init = function() {
            $scope.option_r1 = {title: '롤링 배너', api:'ad/banner', size: 99, id: 'main', type: 'banner', gb: CONSTANT.AD_CODE_BN05, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.search.EVENT_GB = "exp";
                //$scope.search.ADA_STATE = 1;
                $scope.search.PROCESS = "process";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.search.EVENT_GB = "exp";
                //$scope.search.ADA_STATE = 0;
                $scope.search.PAST = "past";
                $scope.menu = "experiencepast"
            }

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
        };

        /********** 이벤트 **********/
            // 게시판 목록 조회
        $scope.$parent.getPeopleBoardList = function () {

            $scope.busy = true;
            if ($scope.$parent.reload) {
                $scope.end = false;
                $scope.list = [];
                $scope.PAGE_NO = 0;
            }

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.search.NOT_SAMPLE = "Y";

            $scope.search.SORT = 'a.ada_date_open';
            $scope.search.ORDER = 'DESC';
            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;


                    for(var i in data) {
                        var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                        data[i].ada_preview_img = img;
                        $scope.list.push(data[i]);
                    }

                    //$scope.list = data;

                    $scope.$parent.reload = false;
                    $scope.busy = false;

                })
                ['catch'](function(error){ $scope.end = true; }); // $scope.TOTAL_COUNT = 0; $scope.list = "";
//                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.comp_momsexperience = function (item){

//            if (item.ada_state == 0) {
//                dialogs.notify('알림', "체험단 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }
//
//            if ($scope.todayDate < item.ada_date_open || $scope.todayDate > item.ada_date_close) {
//                dialogs.notify('알림', "체험단 참여 기간이 아닙니다.", {size: 'md'});
//                return;
//            }

            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/view/'+item.ada_idx);
            } else if ($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/view/'+item.ada_idx);
            }

        }
        $scope.init();
        $scope.getPeopleBoardList();
    }]);

    controllers.controller('momsexperience-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$window', '$location', '$timeout', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope,$rootScope, $sce, $stateParams, $window, $location, $timeout, dialogs, CONSTANT, UPLOAD) {

        $scope.imageMap = function(id) {
            if (angular.element('img[usemap=#'+id+']').attr('usemap') == undefined) {
                return;
            }

            var w = angular.element('img[usemap=#'+id+']').attr('width'),
                h = angular.element('img[usemap=#'+id+']').attr('height');

            function resize(){
                if (!w || !h) {
                    var temp = new Image();
                    temp.src = angular.element('img[usemap=#'+id+']').attr('src');
                    if(temp.src == undefined)
                        temp.src = angular.element('img[usemap=#'+id+']').attr('ng-src');

                    if (!w)
                        w = temp.width;
                    if (!h)
                        h = temp.height;
                }

                var wPercent = angular.element('img[usemap=#'+id+']').width()/100,
                    hPercent = angular.element('img[usemap=#'+id+']').height()/100,
                    map = angular.element('img[usemap=#'+id+']').attr('usemap').replace('#', ''),
                    c = 'coords';

                angular.element('map[name="' + map + '"]').find('area').each(function(){
                    var $this = $(this);

                    if (!$this.data(c)){
                        $this.data(c, $this.attr(c));
                    }

                    var coords = $this.data(c).split(','),
                        coordsPercent = new Array(coords.length);

                    for (var i = 0; i<coordsPercent.length; ++i){
                        if (i % 2 === 0){
                            coordsPercent[i] = parseInt(((coords[i]/w)*100)*wPercent);
                        } else {
                            coordsPercent[i] = parseInt(((coords[i]/h)*100)*hPercent);
                        };
                    };
                    $this.attr(c, coordsPercent.toString());
                });
            }
            angular.element($window).resize(resize).trigger('resize');
        };

        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            console.log(data);
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
            }
        });

        $scope.queue = [];
        $scope.search = {};

        $scope.item = {};
        $scope.item.BLOG = [];

        // 리뷰리스트
        $scope.reviewList = [];

        // 날짜 셀렉트 박스셋팅
        var year = [];
        var babyYear = [];
        var babyBirthYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];


        for (var i = nowYear; i >= nowYear-10; i--) {
            babyYear.push(i+'');
        }

        for (var i = nowYear+1; i >= nowYear; i--) {
            babyBirthYear.push(i+'');
        }

        for (var i = 1; i <= 12; i++) {

            if(i < 10){
                i = '0'+i;
            }
            month.push(i+'');
        }

        for (var i = 1; i <= 31; i++) {

            if(i < 10){
                i = '0'+i;
            }
            day.push(i+'');
        }

        $scope.babyBirthYear = babyBirthYear;
        $scope.babyYear = babyYear;
        $scope.month = month;
        $scope.day = day;

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'MOMS';

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10) {
            mm = '0'+mm;
        }

        if(dd < 10) {
            dd = '0'+dd;
        }

        // 기준 날짜 (오늘 날짜)
        $scope.nowTime = new Date();



        var today = year+mm+dd;
        var today2 = year+'-'+mm+'-'+dd;
        $scope.todayDate = today;
        $scope.todayDate2 = today2;

        if($rootScope.focus == 'comp'){
            //$('#moms_state').get(0).scrollIntoView(true);

            $('html,body').animate({scrollTop:$('#moms_state').offset().top}, 300);
            $('#preg_fl').focus();

        }else if($rootScope.focus == 'view'){
            $('html,body').animate({scrollTop:$('#view_state').offset().top}, 100);
            $('#experience_view').focus();
        }

        // 사용자 정보수정 버튼 클릭
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        /********** 콘텐츠 랜더링 **********/
//        $scope.renderHtml = function(html_code) {
//            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
////            return html_code;
//        };


            // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item = {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){
                                $scope.item = data;
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $(document).ready(function(){
                        $('#birth_dt').css('display', 'none');

                        $("#preg_Y").click(function(){
                            if(!$("#preg_Y").is(":checked")){
                                $scope.item.PREGNENT_FL = "Y";
                                $('#birth_dt').css('display', 'block');
                            }
                        });

                        $("#preg_N").click(function(){
                            if(!$("#preg_N").is(":checked")){
                                $scope.item.PREGNENT_FL = "N";
                                $('#birth_dt').css('display', 'none');
                            }
                        });
                    });

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';
                        $scope.item.USER_NM = $scope.name;
                        $scope.item.NICK_NM = $scope.nick;

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            }).catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                    $scope.user_info();
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                    .then(function(data){

                        $rootScope.user_info.USER_ID = data.USER_ID;
                        $rootScope.user_info.USER_NM = data.USER_NM;
                        $rootScope.user_info.NICK_NM = data.NICK_NM;
                        $rootScope.user_info.ADDR = data.ADDR;
                        $rootScope.user_info.ADDR_DETAIL = data.ADDR_DETAIL;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.REG_DT = data.REG_DT;
                        $rootScope.user_info.PHONE_1 = data.PHONE_1;
                        $rootScope.user_info.PHONE_2 = data.PHONE_2;
                        $rootScope.user_info.BLOG_URL = data.BLOG_URL;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 초기화
        $scope.init = function() {

            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.menu = "experiencepast"
            }

            // 리뷰 리스트 페이징 처리
            $scope.PAGE_NO = 1;
            $scope.TOTAL_COUNT = 0;

            $scope.search.ada_idx = $stateParams.id;
            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){

                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 1){
                        $scope.comp_yn = 'Y';
                    }else{
                        $scope.comp_yn = 'N';
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.click_clipCopy = function() {
            dialogs.notify('알림', '클립보드에 복사되었습니다. Ctrl + V로 붙여넣기 하세요.', {size: 'md'});
        };

        $scope.click_focus = function(){
            //$('html,body').animate({scrollTop:$('#item').offset().top}, 150);
            $("#preg_fl").focus();
            //$("#moms_state").attr("tabindex", -1).focus(); div로 포커스를 줄때 사용

        }

        $scope.click_viewfocus = function(){
            //$('html,body').animate({scrollTop:$('#item').offset().top}, 150);
            $("#view_state").focus();

            //$("#moms_state").attr("tabindex", -1).focus(); div로 포커스를 줄때 사용

        }

        // 조회수
//        $scope.addHitCnt = function () {
//            $scope.updateItem('ange/event', 'hit', $stateParams.id, {}, false)
//                .then(function(){
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        }

        // 게시판 조회
        $scope.getMomsExperience = function () {

            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.open_date2 = data.ada_date_open.replace(/-/gi, "");
                        $scope.end_date2 = data.ada_date_close.replace(/-/gi, "");
                        $scope.open_date = data.ada_date_review_open.replace(/-/gi, "");
                        $scope.end_date = data.ada_date_review_close.replace(/-/gi, "");
                        $scope.ada_detail = data.ada_detail != null ? data.ada_detail.replace(/&quot;/gi, '\"') : data.ada_detail;

                        if (data.ada_text != null) {
                            $scope.ada_text = data.ada_text.replace(/&quot;/gi, '\"');
                            $scope.ada_text = $scope.ada_text.replace(/src="(?!http)/gi, 'src="'+CONSTANT.AD_SERVER_URL);
                            $scope.ada_text = $scope.ada_text.replace(/background="(?!http)/gi, 'background="'+CONSTANT.AD_SERVER_URL);
                        }

                        if (data.ada_imagemap != null) {
                            $scope.ada_imagemap = data.ada_imagemap.replace(/&quot;/gi, '\"');
                            $scope.ada_imagemap = $scope.ada_imagemap.replace(/%name%/gi, 'adimage');
                        }

                        $scope.renderHtml = $sce.trustAsHtml($scope.ada_text+$scope.ada_imagemap);

                        $timeout(function() {
                            $scope.imageMap('adimage');
                        }, 500);

                        if ($scope.ada_text == '') {
                            var img = '<img src=""'+data.ada_content_img+'" title="'+data.ada_title+'" usemap="#adimage" ng-style="{\'max-width\':\'100%\'}" style="float:none; margin:0px auto;">';
                            $scope.clip = img+data.ada_imagemap;
                        } else {
                            $scope.clip = $scope.ada_text;
                        }

                        //$scope.D_DAY = parseInt($scope.end_date) - parseInt($scope.todayDate);

                        var arrDate1 = $scope.todayDate2.split("-");
                        var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
                        var arrDate2 = data.ada_date_review_close.split("-");
                        var getDate2 = new Date(parseInt(arrDate2[0]),parseInt(arrDate2[1])-1,parseInt(arrDate2[2]));

                        console.log(getDate2);
                        var getDiffTime = getDate2.getTime() - getDate1.getTime();

                        $scope.D_DAY = Math.floor(getDiffTime / (1000 * 60 * 60 * 24));

                        //$scope.D_DAY = parseInt($scope.D_DAY/day);

                        $scope.item = data;
                        $scope.item.BOARD_NO = data.ada_idx;

                        data.ada_preview_img = CONSTANT.AD_FILE_URL + data.ada_preview;
                        data.ada_content_img = CONSTANT.AD_FILE_URL + data.ada_image;

                        console.log('a'+data.ada_image);
                        console.log('a'+data.ada_text);

                        if($scope.todayDate <= $scope.end_date2|| $scope.open_date == '00000000'){ //  <= $scope.open_date
                            $scope.showForm = "compForm";
                        }else{
                            $scope.showForm = "reviewForm";
                        }

                        $scope.item.ada_option_delivery = data.ada_option_delivery.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        // 질문일 때
                        if($scope.item.ada_que_type == 'question'){
                            var que_data = data.ada_que_info;

                            //$scope.item.QUE = [];
                            $scope.item.QUE = new Array();
                            que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                            var parse_que_data = JSON.parse(que_data);

                            console.log(parse_que_data);

                            for(var x in parse_que_data){

                                var choice = [];
                                if(parse_que_data[x].type == 0){ // 객관식일때
                                    var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                    for(var i=0; i < select_answer.length; i++){
                                        choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                //console.log($scope.item.QUE);
                            }
                        }

                        // 질문일 때
                        if($scope.item.ada_que_type == 'upload'){

                            // 파일 업로드 설정
                            $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                            // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
                            $scope.$watch('newFile', function(data){
                                if (typeof data !== 'undefined') {
                                    $scope.file = data[0];
                                }
                            });

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }


                        // 질문일 때
                        if($scope.item.ada_que_type == 'join'){

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        // 댓글일 때
                        if($scope.item.ada_que_type == 'reply'){

                            $scope.search.PAGE_NO = 1;
                            $scope.search.PAGE_SIZE = 10;
                            $scope.search.TOTAL_COUNT = 0;

                            $scope.eventReplyList = [];


                            $scope.replyPageChange = function(){
                                console.log('Page changed to: ' + $scope.search.PAGE_NO);
                                $scope.eventReplyList = [];
                                $rootScope.getEventReplyList();
                            }

                            $scope.search.ada_idx = $stateParams.id;
                            $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                .then(function(data){

                                    $scope.REPLY_TOTAL_COUNT = data[0].TOTAL_COUNT;
                                    console.log('aaaaaaaaa'+$scope.REPLY_TOTAL_COUNT);
                                })
                                .catch(function(error){$scope.eventReplyList = "";});

                            // 댓글 리스트
                            $rootScope.getEventReplyList = function () {

                                $scope.getItem('ange/event', 'replyitem', {}, $scope.search, true)
                                    .then(function(data){

                                        $scope.search.TOTAL_COUNT = data[0].TOTAL_COUNT;
                                        for(var i in data) {

                                            data[i].adhj_answers = data[i].adhj_answers.replace(/{"1":"/gi, '');
                                            data[i].adhj_answers = data[i].adhj_answers.replace(/"}/gi, '');

                                            $scope.eventReplyList.push({'NICK_NM' : data[i].nick_nm, 'COMMENT' : data[i].adhj_answers, 'REG_DT' : data[i].adhj_date_request});
                                        }
                                    })
                                    .catch(function(error){$scope.eventReplyList = "";});
                            };

                            $rootScope.getEventReplyList();

                        }

                        // 날짜선택
                        if($scope.item.ada_que_type == 'reserve'){

                            if(data.ada_que_info != ''){
                                var que_data = data.ada_que_info;

                                //$scope.item.QUE = [];
                                $scope.item.QUE = new Array();
                                que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                                var parse_que_data = JSON.parse(que_data);

                                console.log(parse_que_data);

                                for(var x in parse_que_data){

                                    var choice = [];
                                    if(parse_que_data[x].type == 0){ // 객관식일때
                                        var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                        for(var i=0; i < select_answer.length; i++){
                                            choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                    //console.log($scope.item.QUE);
                                }
                            }
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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


        $scope.click_momsexperiencecomp = function () {

            // 세션만료 되었을 때 리스트로 이동
            if($scope.uid == '' || $scope.uid == null){
                dialogs.notify('알림', '로그인 후 이용 가능합니다', {size: 'md'});
                return;
            }

            // 오늘날짜가 모집시작일이 아닐때
            if($scope.open_date2 > $scope.todayDate){
                dialogs.notify('알림', '모집 시작기간이 아닙니다', {size: 'md'});
                return;
            }

            // 체험단 종료기간이 지났을때
            if($scope.end_date2 < $scope.todayDate){
                dialogs.notify('알림', '종료된 체험단 입니다', {size: 'md'});
                return;
            }

            if(CheckForm(document.getElementById("experiencevalidation")) == false){
                return;
            }

            if($scope.item.ada_que_type == 'question'){ // 문답일때

                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){

                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);


                            // 문항정보
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_question_no').length;
                            console.log(poll_length);


                            for(var i=1; i<=poll_length; i++){

                                if(document.getElementById("answer"+i).type == 'radio'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                    var checkvalue = '';
                                    $("input[name=answer"+i+"]:checked").each(function() {
                                        checkvalue += $(this).val() + ';';
                                        console.log(checkvalue);
                                    });
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                }else if(document.getElementById("answer"+i).type == 'text'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                }else if(document.getElementById("answer"+i).type == 'textarea'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                }
                            }

                            $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+'}';
                            //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                            console.log($scope.item.ANSWER);

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 체험단에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }else if($scope.item.ada_que_type == 'reserve'){ // 날짜예약선택

                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }


                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){

                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);


                            // 문항정보
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_reserve_no').length;
                            console.log(poll_length);


                            for(var i=1; i<=poll_length; i++){

                                if(document.getElementById("answer"+i).type == 'radio'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                    var checkvalue = '';
                                    $("input[name=answer"+i+"]:checked").each(function() {
                                        checkvalue += $(this).val() + ';';
                                        console.log(checkvalue);
                                    });
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                }else if(document.getElementById("answer"+i).type == 'text'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                }else if(document.getElementById("answer"+i).type == 'textarea'){
                                    $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                }
                            }

                            $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+'}';
                            //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                            console.log($scope.item.ANSWER);

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 체험단에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                // 댓글
                if($scope.item.COMMENT == undefined || $scope.item.COMMENT == ''){
                    alert('댓글을 입력하세요');
                    return;
                }

                //console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';
                //$scope.item.ANSWER = answer + ',"5":"'+ $scope.item.COMMENT+'"}';

                console.log($scope.item.ANSWER);

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 체험단에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else if($scope.item.ada_que_type == 'join'){ // 신청이나 응모일때

                // 정보제공 동의체크 확인
                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;

                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);


                            // 문항정보
                            if($scope.item.QUE != undefined ){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);
                            }else{
                                $scope.item.ANSWER = '{'+answer+'}';
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            dialogs.notify('알림', '이미 이 체험단에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            }else if($scope.item.ada_que_type == 'upload'){

                // 문답일때
                var answer = [];
                $rootScope.jsontext3 = "";

                console.log($scope.file);

                if ($scope.file == undefined) {
                    dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                    return;
                }


                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }

                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }


                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){


                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"';
                            console.log(answer);



                            $scope.item.FILE = $scope.file;

                            if($scope.item.QUE != undefined){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_upload_no').length;
                                console.log(poll_length);


                                for(var i=1; i<=poll_length; i++){

                                    if(document.getElementById("answer"+i).type == 'radio'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+$("input[name=answer"+i+"]:checked").val() +'"';
                                    }else if(document.getElementById("answer"+i).type == 'checkbox'){
                                        var checkvalue = '';
                                        $("input[name=answer"+i+"]:checked").each(function() {
                                            checkvalue += $(this).val() + ';';
                                            console.log(checkvalue);
                                        });
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ checkvalue+'"';
                                    }else if(document.getElementById("answer"+i).type == 'text'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }else if(document.getElementById("answer"+i).type == 'textarea'){
                                        $rootScope.jsontext2[i] = '"'+parseInt(i+4)+'":"'+ document.getElementById("answer"+i).value+'"';
                                    }
                                }

                                var last_poll_length = 0;
                                last_poll_length = poll_length+5;
                                //$scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = '{'+answer+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);
                            }else{

                                $rootScope.jsontext3 = '"5":"'+ $scope.file.name+'"';
                                $scope.item.ANSWER = '{'+answer+$rootScope.jsontext3+'}';
                                console.log($scope.item.ANSWER);
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{

                if($("#credit_agreement_Y").is(":checked")){
                    $scope.item.CREDIT_FL = 'Y';
                }else{
                    alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                    return;
                }


                if($scope.item.BABY_YEAR == undefined){
                    alert('아기 생일년도를 선택하세요');
                    return;
                }

                if($scope.item.BABY_MONTH == undefined){
                    alert('아기 생년월을 선택하세요');
                    return;
                }

                if($scope.item.BABY_DAY == undefined){
                    alert('아기 생년일을 선택하세요');
                    return;
                }

                if($scope.item.DELIVERY_YEAR == undefined){
                    $scope.item.DELIVERY_YEAR = '';
                }else{
                    $scope.item.DELIVERY_YEAR = $scope.item.DELIVERY_YEAR;
                }

                if($scope.item.DELIVERY_MONTH == undefined){
                    $scope.item.DELIVERY_MONTH = '';
                }else{
                    $scope.item.DELIVERY_MONTH = $scope.item.DELIVERY_MONTH;
                }

                if($scope.item.DELIVERY_DAY == undefined){
                    $scope.item.DELIVERY_DAY = '';
                }else{
                    $scope.item.DELIVERY_DAY = $scope.item.DELIVERY_DAY;
                }

                if($scope.item.BLOG == undefined){
                    alert('블로그 주소를 입력하세요');
                    return;
                }

                $scope.search.ada_idx = $scope.item.ada_idx;

                $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                    .then(function(data){
                        var comp_cnt = data[0].COMP_CNT;

                        if(comp_cnt == 0){
                            var babybirthday = '';
                            babybirthday = $scope.item.BABY_YEAR + '-' + $scope.item.BABY_MONTH + '-' + $scope.item.BABY_DAY;

                            var deliveryday = '';
                            deliveryday = $scope.item.DELIVERY_YEAR + '-' + $scope.item.DELIVERY_MONTH + '-' + $scope.item.DELIVERY_DAY;

                            console.log(babybirthday);
                            console.log(deliveryday);

                            var cnt = $scope.item.BLOG.length;

                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+';';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            console.log($scope.item.REASON);

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                alert('신청사유를 작성하세요');
                                return;
                            }

                            var answer = '{"1":"'+babybirthday+'","2":"'+deliveryday+'","3":"'+$scope.item.BLOG_URL+'","4":"'+$scope.item.REASON+'"}';
                            console.log(answer);

                            $scope.item.ANSWER = answer;

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '체험단 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('EXPERIENCE', 'EXPERIENCE');

                                    $location.url('/moms/experienceprocess/list');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        }else{
                            dialogs.notify('알림', '이미 이 이벤트에 참여 했으므로 중복 참여는 불가능합니다.', {size: 'md'});
                            return;
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

        }

        $scope.click_momsexperiencelist = function (){
            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/list');
            } else if($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/list');
            }
        }

        // 리뷰 목록 리스트
        $scope.getExperienceReviewList = function() {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;
            $scope.search.TARGET_GB = 'PRODUCT';
            $scope.search.MIG_NO = '';

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO-1, SIZE: 5}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        // thumnail
                        var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        // 본문 html 태그 제거
                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        // data push
                        $scope.reviewList.push(data[i]);
                    }

                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.reviewList = "";});
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            if ($stateParams.menu == 'experienceprocess' || $stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencereview/view/'+key);
            }

        };

        // 블로그 추가
        $scope.click_add_blog = function (){

            // clone 속성을 true 로 지정하면 이벤트도 같이 복사됨
            var new_blog =  $('span.blog:last').clone(true);
            new_blog.find('input').val('');
            $("#blog_url").append(new_blog);

            $(".button").each(function(index){
                $(".button:eq("+index+1+")").removeAttr('disabled');
            })

//            $(":eq(index)")
//            $(".button").removeAttr('disabled');

        }

        // 블로그 삭제
        $scope.delete_blog_url = function (){


            $('span.blog:last').remove();
            $(".button:first").attr('disabled','disabled');
            if($("input[name='blog[]'").length == 1){
                $(".button").attr('disabled','disabled');
            }

        }

        /* 댓글 (삭제예정) */

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


        // 페이지 변경
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.search.PAGE_NO);
            $scope.replyList = [];
            $scope.getPeopleReplyList();
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;
            $scope.search.TARGET_GB = 'exp';

            $scope.getItem('com/reply_event', 'item', {}, $scope.search, true)
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
                .catch(function(error){$scope.replyList = ""; $scope.search.TOTAL_COUNT=0;});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            if ($rootScope.uid == null || $rootScope.uid == '') {
                dialogs.notify('알림', '등록할 수 없는 상태입니다.', {size: 'md'});
                return;
            }

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $stateParams.id;
            $scope.item.TARGET_GB = 'exp';

            $scope.item.REMAIN_POINT = 10;

            if($scope.item.COMMENT.length > 100){
                dialogs.notify('알림', '100자 이내로 입력하세요.', {size: 'md'});
                return;
            }

            $scope.item.REG_UID = $rootScope.uid;
            $scope.item.NICK_NM = $rootScope.nick;

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('com/reply_event', 'check', {}, $scope.search, false)
                .then(function(data){
                    var cnt = data[0].COUNT;

                    if(cnt == 0){
                        $scope.insertItem('com/reply_event', 'item', $scope.item, false)
                            .then(function(){
                                $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                                    .then(function(data){
                                        if(data.COMMENT == null){
                                            $scope.TODAY_TOTAL_COUNT = 0;
                                        }else{
                                            $scope.TODAY_TOTAL_COUNT = data.COMMENT[0].TOTAL_COUNT;
                                        }
                                    })
                                    .catch(function(error){$scope.replyList = ""; $scope.TODAY_TOTAL_COUNT = 0;});

                                $scope.search.TARGET_NO = $stateParams.id;
                                $scope.replyList = [];
                                $scope.getPeopleReplyList();

                                $scope.item.COMMENT = "";

                                $scope.addMileage('EXPERIENCE', 'EXPERIENCE');
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }else{
                        dialogs.notify('알림', '이벤트는 한번만 참여가 가능합니다.', {size: 'md'});
                        return;
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 수정
        $scope.click_updateReply = function (key, comment) {

            console.log(key);

            $scope.replyItem = {};
            $scope.replyItem.COMMENT = comment;

            $scope.replyItem.REG_UID = $rootScope.user_id;
            $scope.replyItem.NICK_NM = $rootScope.user_nick;

            $scope.updateItem('com/reply_event', 'item', key, $scope.replyItem, false)
                .then(function(){

                    $scope.replyItem.COMMENT = "";

                    dialogs.notify('알림', '댓글이 수정 되었습니다.', {size: 'md'});

                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.item.COMMENT = "";
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 댓글 삭제
        $scope.click_deleteReply = function (item) {

            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            console.log(item);
            dialog.result.then(function(btn){
                $scope.deleteItem('com/reply_event', 'item', item, true)

                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});

//                        $scope.item.REMAIN_POINT = 10;
//                        $scope.updateItem('ange/mileage', 'mileageitemminus', {}, $scope.item, false)
//                            .then(function(){
//                            })
//                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        $scope.replyList = [];
                        $scope.getPeopleReplyList();

                        $scope.item.COMMENT = "";
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 주석해제 할 예정
//        $scope.getSession()
//            .then($scope.sessionCheck)
//            .catch($scope.reportProblems);

        if ($location.search()) {
            var param = $location.search();
            if(param.user_id != undefined && param.user_id != '') {
                $scope.item.user_id = param.user_id;
                $scope.item.user_nick = decodeURIComponent(param.user_nick);

                $scope.insertItem('login', 'temp', $scope.item, false)
                    .then(function(data) {
                        console.log(JSON.stringify(data));

                        $rootScope.uid = $scope.item.user_id;
                        $rootScope.nick = $scope.item.user_nick;

                        console.log("임시 세션 생성 성공");
                    }).catch(function(error){});
            }
        };

        $scope.click_review = function(){
            $location.url('/moms/productreview/edit/0');
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMomsExperience)
            .then($scope.getExperienceReviewList)
            .catch($scope.reportProblems);


//        $scope.init();
////         $scope.addHitCnt();
//        $scope.getMomsExperience();
//        $scope.getExperienceReviewList();

        // 댓글리스트(삭제예정)
        $scope.getPeopleReplyList();

    }]);

    controllers.controller('momshome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-banner
            $scope.option_r1_c1 = {title: '롤링 체험단', api:'ad/banner', size: 5, id: 'experience', type: 'experience', gb: CONSTANT.AD_CODE_BN28, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-slide-banner
            $scope.option_r1_c2 = {title: '롤링 이벤트', api:'ad/banner', size: 5, id: 'event', type: 'event', gb: CONSTANT.AD_CODE_BN09, dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-channel-list
            $scope.option_r2_c1 = {title: '앙쥬후기', api:'ange/review', size: 10, channel: "moms", type: 'review', url: '/moms/board', image: false, head: false, date: true, nick: false, defIdx: 3, tab: [{no: 'BOOK', menu: '/moms/bookreview', name: '북카페'}, {no: 'SAMPLE', menu: '/moms/samplereview', name: '샘플팩'}, {no: 'ANGE', menu: '/moms/angereview', name: '앙쥬'}, {no: 'PRODUCT', menu: '/moms/productreview', name: '상품'}]};
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

        $scope.clickyet = function() {
            //dialogs.notify('알림', '점검중입니다.', {size: 'md'});
            $location.url('/moms/eventwinner/list');
        }

    }]);

    controllers.controller('momspostcard-edit', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {


        $scope.search = {};
        $scope.item = {};

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.selectIdx = 1;

        $scope.showSamplepackDetails = false;

        $(document).ready(function(){
        });

        $(function(){
            $("#pregnant_fl").click(function(){
                if($("#pregnant_fl").is(":checked")){
                    $scope.item.PREG_FL = "Y";
                }else{
                    $scope.item.PREG_FL = "N";
                }
            });

            $("#child_fl").click(function(){
                if($("#child_fl").is(":checked")){
                    $scope.item.CHILD_FL = "Y";
                }else{
                    $scope.item.CHILD_FL = "N";
                }
            });
        });

        // 초기화
        $scope.init = function(session) {

            $scope.community = "애독자엽서";
            //$scope.search.EVENT_GB = 'POSTCARD';

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            // 현재달+1
            var next_mm = parseInt(mm)+1;

            if(mm < 10){
                mm = '0'+mm;
            }

            if(next_mm < 10){
                next_mm = '0'+next_mm;
            }

            var next_year = '';

            if(next_mm > 12){
                next_mm = '01';
                next_year = year + 1;
            }else{
                next_year = year
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            $scope.year = year;
            $scope.next_year = next_year;
            $scope.month = mm;
            $scope.next_month = next_mm;// 신규회원 이달말 체크

            $scope.todayDay = dd;

            var dt = new Date(year, mm, 0);
            $scope.Day = dt.getDate();

            // 신청폼에 회원정보를 셋팅
            $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                .then(function(data){
                    $rootScope.user_info = data;
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            $scope.item.PREGNANT_WEEKS = 0;
            $scope.item.CHILD_CNT = 0;

        };

        // 정보수정 팝업
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };


        // 탭
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                        .then(function(data){
                            $scope.item = data;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $scope.getSession();
                                $modalInstance.close();


                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){
                        $scope.user_info = data;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });

            console.log(dlg);
        };

        /********** 이벤트 **********/
            // 구분값과 NO값 셋팅
        $scope.click_postCardList = function () {

            $scope.search.PRODUCT_CODE = 49;

            //$scope.search.ADA_STATE = 1;
            $scope.search.SORT = 'ada_date_regi';
            $scope.search.ORDER = 'DESC'

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var target_gb = data[0].EVENT_GB;
                    var target_no = data[0].NO;

                    $scope.item.ada_date_open = data[0].ada_date_open;
                    $scope.item.ada_date_close = data[0].ada_date_close;
                    $scope.item.ada_date_notice = data[0].ada_date_notice;
                    $scope.item.ada_title = data[0].ada_title;

                    $scope.item.ada_notice_month = parseInt($scope.item.ada_date_notice.substr(5,2));
                    console.log('$scope.item.ada_notice_month  = '+$scope.item.ada_notice_month );

                    $scope.item.TARGET_GB = target_gb;
                    $scope.item.TARGET_NO = target_no;

                    $scope.item.ada_idx = data[0].ada_idx;

                    $scope.item.ada_que_type = data[0].ada_que_type;

                    console.log($scope.item.ada_que_type);

                    // 질문일 때
                    if($scope.item.ada_que_type == 'question'){
                        var que_data = data[0].ada_que_info;

                        //$scope.item.QUE = [];
                        $scope.item.QUE = new Array();
                        que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                        console.log(que_data);
                        var parse_que_data = JSON.parse(que_data);

                        console.log(parse_que_data);

                        for(var x in parse_que_data){

                            var choice = [];
                            if(parse_que_data[x].type == 0){ // 객관식일때
                                var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                for(var i=0; i < select_answer.length; i++){
                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                            }

                            var index = parseInt(x)+parseInt(1);
                            $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                            console.log($scope.item.QUE);
                        }
                    }

                    // 질문일 때
                    if($scope.item.ada_que_type == 'upload'){

                        // 파일 업로드 설정
                        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
                        $scope.$watch('newFile', function(data){
                            if (typeof data !== 'undefined') {
                                $scope.file = data[0];
                            }
                        });

                        console.log(data[0].ada_que_info);
                        //|| data.ada_que_info != ''
                        if(data[0].ada_que_info != undefined ){
                            var que_data = data[0].ada_que_info;

                            //$scope.item.QUE = [];
                            $scope.item.QUE = new Array();
                            que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                            var parse_que_data = JSON.parse(que_data);

                            console.log(parse_que_data);

                            for(var x in parse_que_data){

                                var choice = [];
                                if(parse_que_data[x].type == 0){ // 객관식일때
                                    var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                    for(var i=0; i < select_answer.length; i++){
                                        choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                }

                                var index = parseInt(x)+parseInt(1);
                                $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                                //console.log($scope.item.QUE);
                            }
                        }
                    }

                    // 댓글일 때
                    if($scope.item.ada_que_type == 'reply'){

                        //$scope.item.REPLY_SUBJECT = $scope.item.ada_title;
                    }

                })
                ['catch'](function(error){});
        };

        // 회원가입 화면 이동
        $scope.click_joinon = function (){
            $location.url('/infodesk/signon');
        }

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

        // 샘플팩 신청
        $scope.click_saveSamplepackComp = function (){

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.ada_idx = $scope.item.ada_idx;
            //$scope.search.TARGET_NO = $scope.item.NO;
            //$scope.search.TARGET_GB = $scope.item.TARGET_GB;

            if($("#pregnant_fl").is(":checked")){
                $scope.item.PREG_FL = "Y"
            }else{
                $scope.item.PREG_FL = "N"
            }

            if($("#child_fl").is(":checked")){
                $scope.item.CHILD_FL = "Y"
            }else{
                $scope.item.CHILD_FL = "N"
            }

            if(CheckForm(document.getElementById("postcardvalidation")) == false){
                return;
            }

            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    if(comp_cnt == 0){

                        if($scope.item.ada_que_type == 'question'){ // 문답일때
//                            var answer = [];
//                            $scope.item.QUE_SHORT_ANSWER = ''
//                            $("input[name='answer[]'").each(function(index, element) {
//
//                                $scope.item.QUE_SHORT_ANSWER = $(element).val();
//                                answer.push($scope.item.QUE_SHORT_ANSWER); // 주관식
//                            })
//
//                            $("textarea[name='long_answer[]'").each(function(index, element) { // 장문
//
//                                console.log($(element).val());
//
//                                $scope.item.QUE_LONG_ANSWER = $(element).val();
//                                answer.push($scope.item.QUE_LONG_ANSWER); // 주관식
//                            })
//
//                            var values = {};
//
//                            $('.poll_select_radio:checked').each(function() {
//
//                                if(this.value == undefined){
//                                    values[this.name] = "";
//                                }
//
//                                if(this.value == "기타"){
//                                    console.log($("#etc_answer").val());
//                                    values[this.name] = $("input[name='etc_answer']").val();
//                                }
//
//                                values[this.name] = this.value;
//                                answer.push(values[this.name]); // 객관식
//                                console.log(this.value);
//                            });
//
//                            var check_answer = ''
//                            $('.poll_select_checkbox:checked').each(function() {
//
//                                values[this.name] = ','
//                                if(this.value == undefined){
//                                    values[this.name] = "";
//                                }
//                                values[this.name] += this.value;
//
//                                check_answer += "," + this.value;
//                                //answer.push(check_answer); // 객관식
//
//                                console.log(check_answer);
//                            });
//                            if(check_answer != ''){
//                                answer.push(check_answer);
//                            }
//
//                            $rootScope.jsontext2 = new Array();
//
//                            $("input[name='index[]'").each(function(index, element) {
//                                $rootScope.jsontext2[index] = '"'+index+'":"'+ answer[index]+'"'; //[index] [$(element).val()]
//                            })
//
//                            $scope.item.ANSWER = '{'+$rootScope.jsontext2+'}';
//                            console.log($scope.item.ANSWER);
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_question_no').length;
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

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){

                                    dialogs.notify('알림', '애독자 엽서 신청이 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('POST', 'POST');

                                    $location.url('/moms/home');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        }else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                            console.log('{"댓글":"'+ $scope.item.COMMENT+'"}');
                            $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                            $scope.search.ada_idx = $scope.item.ada_idx;

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){

                                    dialogs.notify('알림', '애독자 엽서 신청이 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('POST', 'POST');

                                    $location.url('/moms/home');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                        } else if($scope.item.ada_que_type == 'join'){ // 신청이나 응모일때

                            // 정보제공 동의체크 확인
                            if($("#credit_agreement_Y").is(":checked")){
                                $scope.item.CREDIT_FL = 'Y';
                            }else{
                                alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                                return;
                            }

                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;


                            // 추가한 블로그 갯수 만큼 반복
                            if($scope.item.BLOG == undefined){
                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            var cnt = $scope.item.BLOG.length;
                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+', ';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.QUE != undefined ){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
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
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){

                                    dialogs.notify('알림', '애독자 엽서 신청이 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('POST', 'POST');

                                    $location.url('/moms/home');
                                })
                                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else if($scope.item.ada_que_type == 'upload'){

                            // 문답일때
                            var answer = [];
                            $rootScope.jsontext3 = "";

                            console.log($scope.file);

                            if ($scope.file == undefined) {
                                dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                                return;
                            }

                            $scope.item.FILE = $scope.file;

                            if($scope.item.QUE != ''){
                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_upload_no').length;
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

                                var last_poll_length = 0;
                                last_poll_length = poll_length+1;
                                $scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);

                            }else{
                                $rootScope.jsontext3 = '"1":"'+ $scope.file.name+'"';
                                $scope.item.ANSWER = '{'+$rootScope.jsontext3+'}';
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){

                                    dialogs.notify('알림', '애독자 엽서 신청이 완료되었습니다.', {size: 'md'});

                                    $scope.addMileage('POST', 'POST');

                                    $location.url('/moms/home');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }

                    }else{
                        dialogs.notify('알림', '이미 애독자 엽서 신청을 했습니다.', {size: 'md'});
                        $location.url('/moms/home');
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        }


        /********** 화면 초기화 **********/
//        $scope.init();
//        $scope.click_postCardList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_postCardList)
            ['catch']($scope.reportProblems);


    }]);

    controllers.controller('momsreview-edit', ['$scope','$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD, $http) {


        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;
        $scope.checkAll = false;

        $scope.checkFile = [];

        $scope.click_selectMainImage = function (file) {

            angular.forEach($scope.queue, function(file) {
                file.kind = '';

                console.log(file);
            });

            if (file.kind == 'MAIN') {
                file.kind = '';
            } else {
                file.kind = 'MAIN';
                console.log(file);
                if (!angular.isUndefined(CKEDITOR)) {
                    var element = CKEDITOR.dom.element.createFromHtml( '<img alt="" src="'+file.url+'" />' );
                    CKEDITOR.instances.editor1.insertElement( element );
                }
            }
        };

        $scope.click_checkAllToggle = function () {
            $scope.checkAll = !$scope.checkAll;

            if ($scope.checkAll) {
                $scope.item.queue = angular.copy($scope.queue);
            } else {
//                angular.forEach($scope.select, function(file) {
//                    $scope.select.pop();
//                });
                $scope.item.queue = [];
//                $scope.item.queue.splice(0, $scope.item.queue.length);
            }
//            console.log(JSON.stringify($scope.item.queue))
        };

        var state;
        $scope.click_checkFileDestroy = function () {
            angular.forEach($scope.item.queue, function(file) {
                state = 'pending';
                return $http({
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function () {
                        $scope.item.queue.splice($scope.checkFile.indexOf(file), 1);

                        state = 'resolved';
                        $scope.clear(file);
                    },
                    function () {
                        state = 'rejected';
                    }
                );
            });
        };

        $scope.click_checkFileEditor = function () {
            angular.forEach($scope.item.queue, function(file) {
                if (!angular.isUndefined(CKEDITOR)) {
                    var element = CKEDITOR.dom.element.createFromHtml( '<img alt="" src="'+file.url+'" />' );
                    CKEDITOR.instances.editor1.insertElement( element );
                }
            });
        };

        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.search = {};

        // 에디터 안 첨부파일 초기화
        $scope.item.queue = [];

        // 초기화
        $scope.init = function(session) {

            $scope.item.MENU = '';
            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "체험단/서평단 후기";
                $scope.search.TARGET_GB = 'EXPERIENCE';
                $scope.menu = 'experiencereview';
                $scope.item.MENU = 'PRODUCT';
                //$scope.item.MENU = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
                $scope.search.TARGET_GB = 'PRODUCT';
                $scope.menu = 'productreview';
                $scope.item.MENU = 'PRODUCT';
                $scope.search.NOT_SAMPLE = "Y";
                //$scope.item.MENU = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
                $scope.search.TARGET_GB = 'ANGE';
                $scope.menu = 'angereview';
                $scope.item.MENU = 'ANGE';
                //$scope.item.MENU = 'PRODUCT';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
                $scope.item.TARGET_GB = 'SAMPLE';
                $scope.menu = 'samplereview';
                $scope.item.MENU = 'SAMPLE';
                $scope.search.NOT_SAMPLE = "N";
                //$scope.item.MENU = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
                $scope.menu = 'experiencereview';
                $scope.item.MENU = 'SAMPLE';
                //$scope.item.MENU = 'SAMPLE';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.search.TARGET_GB = 'EVENT';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'bookreview') {
                $scope.community = "서평단 후기";
                $scope.search['TARGET_GB'] = 'BOOK';
                $scope.menu = 'bookreview';
                $scope.item.MENU = 'BOOK';
            } else if ($stateParams.menu == 'dolreview') {
                $scope.community = "앙쥬돌 후기";
                $scope.search['TARGET_GB'] = 'DOL';
                $scope.menu = 'dolreview';
                $scope.item.MENU = 'DOL';
            } else if ($stateParams.menu == 'storereview') {
                $scope.community = "스토어 후기";
                $scope.search['TARGET_GB'] = 'STORE';
                $scope.menu = 'storereview';
                $scope.item.MENU = 'STORE';
            }

            $scope.search.USER_ID = true;

            $scope.search.EVENT_GB = "exp";
            $scope.search.REVIEW_EVENT_GB = 'Y';

            if ($stateParams.id != 0) {

                $scope.reviewUpdate = 'Y';

                $scope.getList('ange/event', 'selectList', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.total_cnt = total_cnt;
                    })
                    ['catch'](function(error){$scope.event = ""; $scope.total_cnt=0;});
            }else{

                $scope.reviewUpdate = 'N';

                $scope.search.EXIST = true;
                $scope.search.REVIEW_FL = true;
                $scope.getList('ange/event', 'selectList', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.total_cnt = total_cnt;
                    })
                    ['catch'](function(error){$scope.event = ""; $scope.total_cnt=0;});
            }
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>Hello</p>';

//        $scope.ckeditor = '<div><p>\n<p>aaa</div>'+
//        '<div class= "form-group" id="dropzone" name="dropzone" style="width:100%; height:100px; background-color: #f5f5f5; border: 1px solid #ddd transparent; text-align: center; font-weight: bold;">' +
//        '이미지를 여기에 드래그 앤 드롭하여 등록할 수 있습니다.<br />' +
//        '(gif, jpg, png만 등록 가능)' +
//        '</div>';

        /********** 이벤트 **********/
            // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/review', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        console.log('target_gb = '+data.TARGET_GB);
                        $scope.item.MENU = data.TARGET_GB;

                        if(data.TARGET_NO > 0){
                            var idx = 0;
                            for(var i=0; i < $scope.event.length; i ++){

                                if(JSON.stringify(data.TARGET_NO) == JSON.stringify($scope.event[i].ada_idx)){
                                    idx = i;
                                }
                            }
                            $scope.item.TARGET_NO = $scope.event[idx].ada_idx;
                            $("input:radio[name='reveiw_mission']:radio[value='"+$scope.event[idx].ada_idx+"']").attr("checked",true);
                            //$('#menu_select').removeAttr('disabled');

                        } else {

                            $("#general").attr("checked",true);

                        }

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE","kind":files[i].FILE_GB,"type":files[i].FILE_EXT,"isUpdate":true});
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleBoard = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.FILES = $scope.queue;

            var ckMain = false;

            for(var i in $scope.item.FILES) {
                if ($scope.item.FILES[i].kind == 'MAIN') ckMain = true;
            }

            if (!ckMain) {
                dialogs.notify('알림', '메인이미지를 선택하세요.', {size: 'md'});
                return;
            }

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
            }

            if($scope.item.MENU == undefined || $scope.item.MENU == '' || $scope.item.MENU == null){
                if ($stateParams.menu == 'experiencereview') {
                    $scope.item.TARGET_GB = 'EXPERIENCE';
                    $scope.item.MENU = 'EXPERIENCE';
                } else if ($stateParams.menu == 'productreview') {
                    $scope.item.TARGET_GB = 'PRODUCT';
                    $scope.item.MENU = 'PRODUCT';
                } else if ($stateParams.menu == 'angereview') {
                    $scope.item.TARGET_GB = 'ANGE';
                    $scope.item.MENU = 'ANGE';
                } else if ($stateParams.menu == 'samplereview') {
                    $scope.item.TARGET_GB = 'SAMPLE';
                    $scope.item.MENU = 'SAMPLE';
                } else if ($stateParams.menu == 'samplepackreview') {
                    $scope.item.TARGET_GB = 'SAMPLEPACK';
                    $scope.item.MENU = 'SAMPLEPACK';
                }else if ($stateParams.menu == 'bookreview') {
                    $scope.item.TARGET_GB = 'BOOK';
                    $scope.item.MENU = 'BOOK';
                }else if ($stateParams.menu == 'dolreview') {
                    $scope.item.TARGET_GB = 'DOL';
                    $scope.item.MENU = 'DOL';
                }else if ($stateParams.menu == 'storereview') {
                    $scope.item.TARGET_GB = 'STORE';
                    $scope.item.MENU = 'STORE';
                }
            }else{
                $scope.item.TARGET_GB = $scope.item.MENU;
            }

            if ($stateParams.id == 0) {

                $scope.insertItem('ange/review', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        $scope.addMileage('REVIEW', $scope.item.TARGET_GB);

                        if ($stateParams.menu == 'experiencereview') {
                            $location.url('/moms/experiencereview/list');
                        } else if ($stateParams.menu == 'productreview') {
                            $location.url('/moms/productreview/list');
                        } else if ($stateParams.menu == 'angereview') {
                            $location.url('/moms/angereview/list');
                        } else if ($stateParams.menu == 'samplereview') {
                            $location.url('/moms/samplereview/list');
                        } else if ($stateParams.menu == 'samplepackreview') {
                            $location.url('/moms/samplepackreview/list');
                        }else if ($stateParams.menu == 'eventreview') {
                            $location.url('/moms/eventreview/list');
                        }else if ($stateParams.menu == 'bookreview') {
                            $location.url('/moms/bookreview/list');
                        }else if ($stateParams.menu == 'dolreview') {
                            $location.url('/moms/dolreview/list');
                        }else if ($stateParams.menu == 'storereview') {
                            $location.url('/moms/storereview/list');
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else {
                $scope.updateItem('ange/review', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'experiencereview') {
                            $location.url('/moms/experiencereview/list');
                        } else if ($stateParams.menu == 'productreview') {
                            $location.url('/moms/productreview/list');
                        } else if ($stateParams.menu == 'angereview') {
                            $location.url('/moms/angereview/list');
                        } else if ($stateParams.menu == 'samplereview') {
                            $location.url('/moms/samplereview/list');
                        } else if ($stateParams.menu == 'samplepackreview') {
                            $location.url('/moms/samplepackreview/list');
                        }else if ($stateParams.menu == 'eventreview') {
                            $location.url('/moms/eventreview/list');
                        }else if ($stateParams.menu == 'bookreview') {
                            $location.url('/moms/bookreview/list');
                        }else if ($stateParams.menu == 'dolreview') {
                            $location.url('/moms/dolreview/list');
                        }else if ($stateParams.menu == 'storereview') {
                            $location.url('/moms/storereview/list');
                        }

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            ['catch']($scope.reportProblems);
//        $scope.init();
//        $scope.getPeopleBoard();

    }]);

    controllers.controller('momsreview-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD','CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        $scope.isLoding = true;
        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        $scope.pageChanged = function() {
            $scope.isLoding = true;
            console.log('Page changed to: ' + $scope.PAGE_NO);

            // 페이징
//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 10;
//            $scope.TOTAL_COUNT = 0;

            $scope.list = [];
            $scope.getMomsReviewList();

            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);

        };

        // 초기화
        $scope.init = function(session) {
            $scope.isLoding = true;
            $scope.search.BOARD_ST = 'D';

            if ($stateParams.menu == 'experiencereview') {
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            } else if ($stateParams.menu == 'eventreview') {
                $scope.search['TARGET_GB'] = 'EVENT';
            } else if ($stateParams.menu == 'bookreview') {
                $scope.search['TARGET_GB'] = 'BOOK';
            } else if ($stateParams.menu == 'dolreview') {
                $scope.search['TARGET_GB'] = 'DOL';
            }else if ($stateParams.menu == 'storereview') {
                $scope.search['TARGET_GB'] = 'STORE';
            }

            console.log($scope.menu.COMM_NO);

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
//            $scope.search.BOARD_GB = 'BOARD';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;
                })
                ['catch'](function(error){});

            //$scope.search.SORT = 'NOTICE_FL'
            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            console.log('getParam("page_no") = '+getParam("page_no"));

            if(getParam("page_no") == undefined){
                $scope.PAGE_NO = 1;
            }else{
                $scope.PAGE_NO = getParam("page_no");
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }
                $scope.search.KEYWORD = getParam("keyword");
            }
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        $scope.isLoding = true;

        // 게시판 목록 조회
        $scope.getMomsReviewList = function () {

            $scope.isLoding = true;

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/
            $scope.search.FILE = true;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        // /storage/review/

                        var img = UPLOAD.BASE_URL + '/storage/review/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.replace(/<!--StartFragment-->/ig, '');
                        source = source.replace(/&#39;/ig, '');
                        source = source.replace(/&quot;/ig, '"');
                        source = source.replace(/&lt;/ig, '<');
                        source = source.replace(/&gt;/ig, '>');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.list.push(data[i]);
                    }

                    $scope.isLoding = false;
                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//            if ($stateParams.menu == 'experiencereview') {
//                $location.url('/moms/experiencereview/view/'+key);
//            } else if ($stateParams.menu == 'productreview') {
//                $location.url('/moms/productreview/view/'+key);
//            } else if ($stateParams.menu == 'angereview') {
//                $location.url('/moms/angereview/view/'+key);
//            } else if ($stateParams.menu == 'samplereview') {
//                $location.url('/moms/samplereview/view/'+key);
//            } else if ($stateParams.menu == 'samplepackreview') {
//                $location.url('/moms/samplepackreview/view/'+key);
//            }else if ($stateParams.menu == 'eventreview') {
//                $location.url('/moms/eventreview/view/'+key);
//            }

        };

        // 등록 버튼 클릭
        $scope.click_showCreateReview = function () {

            if ($scope.uid == '' || $scope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');

//            if ($stateParams.menu == 'experiencereview') {
//                $location.url('/moms/experiencereview/edit/0');
//            } else if ($stateParams.menu == 'productreview') {
//                $location.url('/moms/productreview/edit/0');
//            } else if ($stateParams.menu == 'angereview') {
//                $location.url('/moms/angereview/edit/0');
//            } else if ($stateParams.menu == 'samplereview') {
//                $location.url('/moms/samplereview/edit/0');
//            } else if ($stateParams.menu == 'samplepackreview') {
//                $location.url('/moms/samplepackreview/edit/0');
//            }else if ($stateParams.menu == 'eventreview') {
//                $location.url('/moms/eventreview/edit/0');
//            }

        };

        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
            $scope.getMomsReviewList();
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMomsReviewList)
            ['catch']($scope.reportProblems);


    }]);

    controllers.controller('momsreview-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', '$modal', function ($scope, $rootScope, $sce, $stateParams, $location, dialogs, ngTableParams, UPLOAD, $modal) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'REVIEW';

        $scope.replyList = [];

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
//            return html_code;
        };

        $(document).ready(function(){

            $("#reply_sort_date").addClass("selected");
            $scope.search.SORT = 'ada_date_regi';
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
                $scope.search.SORT = 'ada_date_regi';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_date").addClass("selected");
                $("#reply_sort_idx").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });
        });

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "체험단/서평단 후기";
                $scope.item.TARGET_GB = 'EXPERIENCE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
                $scope.item.TARGET_GB = 'PRODUCT';
                $scope.menu = 'productreview';
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
                $scope.item.TARGET_GB = 'ANGE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
                $scope.item.TARGET_GB = 'SAMPLE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
                $scope.menu = 'experiencereview';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.item.TARGET_GB = 'EVENT';
                $scope.menu = 'experiencereview';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.community = "서평단 후기";
                $scope.item.TARGET_GB = 'BOOK';
                $scope.menu = 'bookreview';
            } else if ($stateParams.menu == 'dolreview') {
                $scope.community = "앙쥬돌 후기";
                $scope.item.TARGET_GB = 'DOL';
                $scope.menu = 'dolreview';
            }else if ($stateParams.menu == 'storereview') {
                $scope.community = "스토어 후기";
                $scope.item.TARGET_GB = 'STORE';
                $scope.menu = 'storereview';
            }

            if ($stateParams.menu == 'experiencereview') {

                $scope.search.EVENT_GB = 'exp';
                // 이벤트 및 서평단 / 체험단 셀렉트 박스 셋팅
                $scope.getList('ange/event', 'list', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        $scope.item.TARGET_NO = data[0].SUBJECT;
                    })
                    ['catch'](function(error){alert(error)});
            } else if ($stateParams.menu == 'eventreview') {

                $scope.search.EVENT_GB = 'event';
                // 이벤트 및 서평단 / 체험단 셀렉트 박스 셋팅
                $scope.getList('ange/event', 'list', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        $scope.item.TARGET_NO = data[0].SUBJECT;
                    })
                    ['catch'](function(error){alert(error)});
            }
        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            if ($stateParams.menu == 'experiencereview') {
                $location.url('/moms/experiencereview/edit/'+item.NO);
            } else if ($stateParams.menu == 'productreview') {
                $location.url('/moms/productreview/edit/'+item.NO);
            } else if ($stateParams.menu == 'angereview') {
                $location.url('/moms/angereview/edit/'+item.NO);
            } else if ($stateParams.menu == 'samplereview') {
                $location.url('/moms/samplereview/edit/'+item.NO);
            } else if ($stateParams.menu == 'samplepackreview') {
                $location.url('/moms/samplepackreview/edit/'+item.NO);
            }else if ($stateParams.menu == 'eventreview') {
                $location.url('/moms/eventreview/edit/'+item.NO);
            }else if ($stateParams.menu == 'storereview') {
                $location.url('/moms/storereview/edit/'+item.NO);
            }else if ($stateParams.menu == 'dolreview') {
                $location.url('/moms/dolreview/edit/'+item.NO);
            }else if ($stateParams.menu == 'bookreview') {
                $location.url('/moms/bookreview/edit/'+item.NO);
            }
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }

            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT+BODY';
            }

            if ($stateParams.menu == 'experiencereview') {
                //$location.url('/moms/experiencereview/list');
                $location.url('/moms/experiencereview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if ($stateParams.menu == 'productreview') {
                //$location.url('/moms/productreview/list');
                $location.url('/moms/productreview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if ($stateParams.menu == 'angereview') {
                //$location.url('/moms/angereview/list');
                $location.url('/moms/angereview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if ($stateParams.menu == 'samplereview') {
                //$location.url('/moms/samplereview/list');
                $location.url('/moms/samplereview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if ($stateParams.menu == 'samplepackreview') {
                //$location.url('/moms/samplepackreview/list');
                $location.url('/moms/samplepackreview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }else if ($stateParams.menu == 'eventreview') {
                //$location.url('/moms/eventreview/list');
                $location.url('/moms/eventreview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }else if ($stateParams.menu == 'bookreview') {
                //$location.url('/moms/bookreview/list');
                $location.url('/moms/bookreview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }else if ($stateParams.menu == 'dolreview') {
                //$location.url('/moms/dolreview/list');
                $location.url('/moms/dolreview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }else if ($stateParams.menu == 'storereview') {
                //$location.url('/moms/dolreview/list');
                $location.url('/moms/storereview/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('ange/review', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/review', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        var files = data.FILES;
                        //console.log(JSON.stringify(data));
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;

                                console.log(img);
                            }
                        }

                        $scope.item = data;

                        $scope.item.BODY = $sce.trustAsHtml(data.BODY);

                        //$scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/view/'+key);
//            } else if($stateParams.menu == 'momstalk') {
//                $location.url('/people/momstalk/view/'+key);
//            } else if($stateParams.menu == 'babycare') {
//                $location.url('/people/babycare/view/'+key);
//            } else if($stateParams.menu == 'firstbirthtalk') {
//                $location.url('/people/firstbirthtalk/view/'+key);
//            } else if($stateParams.menu == 'booktalk') {
//                $location.url('/people/booktalk/view/'+key);
//            }

        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                .then(function(data){

                    var reply = data.COMMENT;

                    console.log('reply =' +reply);
                    console.log('end');

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT});
                    }

                    console.log('RE = '+data.COMMENT);
                    console.log('end');
                })
                ['catch'](function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $scope.item.NO;
            if ($stateParams.menu == 'experiencereview') {
                $scope.item.TARGET_GB = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.item.TARGET_GB = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.item.TARGET_GB = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.item.TARGET_GB = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.item.TARGET_GB = 'EVENT';
            }else if ($stateParams.menu == 'storereview') {
                $scope.item.TARGET_GB = 'STORE';
            }


            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.getPeopleBoard();

                    //$scope.replyList.push({"NO":0,"PARENT_NO":$scope.item.PARENT_NO,"COMMENT":$scope.item.COMMENT,"RE_COUNT":0,"REPLY_COMMENT":'',"LEVEL":$scope.item.LEVEL,"REPLY_NO":$scope.item.REPLY_NO});

                    $scope.item.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_savePeopleBoardReComment = function (item) {

            $scope.reply.PARENT_NO = item.NO;
            $scope.reply.LEVEL = parseInt(item.LEVEL)+1;
            $scope.reply.REPLY_NO = parseInt(item.REPLY_NO)+1;
            $scope.reply.TARGET_NO = $stateParams.id;
            if ($stateParams.menu == 'experiencereview') {
                $scope.item.TARGET_GB = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.item.TARGET_GB = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.item.TARGET_GB = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.item.TARGET_GB = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.item.TARGET_GB = 'EVENT';
            }else if ($stateParams.menu == 'storereview') {
                $scope.item.TARGET_GB = 'STORE';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.item.TARGET_GB = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.item.TARGET_GB = 'DOL';
            }

            $scope.REPLY_COMMENT = $scope.reply;

            $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){
                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();
                    $scope.reply.COMMENT = "";

                    $scope.getPeopleBoard();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'experiencereview') {
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.search['TARGET_GB'] = 'EVENT';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.search['TARGET_GB'] = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.search['TARGET_GB'] = 'DOL';
            }else if ($stateParams.menu == 'storereview') {
                $scope.search['TARGET_GB'] = 'STORE';
            }

            $scope.search.KEY = $stateParams.id;
            //$scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/review', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            if ($stateParams.menu == 'experiencereview') {
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.search['TARGET_GB'] = 'EVENT';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.search['TARGET_GB'] = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.search['TARGET_GB'] = 'DOL';
            }else if ($stateParams.menu == 'storereview') {
                $scope.search['TARGET_GB'] = 'STORE';
            }

            $scope.search.KEY = $stateParams.id;
            //$scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/review', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/review', 'item', item.NO, true)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
//                        if ($stateParams.menu == 'experiencereview') {
//                            $location.url('/moms/experiencereview/list');
//                        } else if ($stateParams.menu == 'productreview') {
//                            $location.url('/moms/productreview/list');
//                        } else if ($stateParams.menu == 'angereview') {
//                            $location.url('/moms/angereview/list');
//                        } else if ($stateParams.menu == 'samplereview') {
//                            $location.url('/moms/samplereview/list');
//                        } else if ($stateParams.menu == 'samplepackreview') {
//                            $location.url('/moms/samplepackreview/list');
//                        }else if ($stateParams.menu == 'eventreview') {
//                            $location.url('/moms/eventreview/list');
//                        }
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        $scope.likeFl = function (){
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.search.NO = $stateParams.id;

                /*if ($stateParams.menu == 'experiencereview') {
                 $scope.search['TARGET_GB'] = 'EXPERIENCE';
                 } else if ($stateParams.menu == 'productreview') {
                 $scope.search['TARGET_GB'] = 'PRODUCT';
                 } else if ($stateParams.menu == 'angereview') {
                 $scope.search['TARGET_GB'] = 'ANGE';
                 } else if ($stateParams.menu == 'samplereview') {
                 $scope.search['TARGET_GB'] = 'SAMPLE';
                 } else if ($stateParams.menu == 'samplepackreview') {
                 $scope.search['TARGET_GB'] = 'SAMPLEPACK';
                 }else if ($stateParams.menu == 'eventreview') {
                 $scope.search['TARGET_GB'] = 'EVENT';
                 }*/

                $scope.search['TARGET_GB'] = 'REVIEW';

                $scope.getItem('ange/review', 'like', $stateParams.id, $scope.search, false)
                    .then(function(data){

                        if(data.TOTAL_COUNT == 0){
                            $scope.LIKE_FL = 'N';
                        }else{
                            $scope.LIKE_FL = data.LIKE_FL;
                            console.log($scope.LIKE_FL);
                        }

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.LIKE_FL = 'N';
            }

        }

        // 공감
        $scope.click_likeCntAdd = function(item, like_fl){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = like_fl;
            $scope.likeItem.TARGET_NO = item.NO;
            $scope.likeItem.TARGET_GB = 'REVIEW';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.likeItem.LIKE_FL == 'Y' ? 'N' : 'Y';
                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleBoard();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleBoard();
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            /*            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
             .then(function(){

             dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
             $scope.getPeopleBoard();
             })
             ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});*/
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 스크랩이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.search['TARGET_NO'] = item.NO;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            //$scope.search['REG_UID'] = 'hong'; // 테스트

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {

                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = item.NO;
                        $scope.scrap.TARGET_GB = item.BOARD_GB;

                        // [테스트] 등록자아이디, 등록자명, 닉네임 은 세션처리 되면 삭제할예정
                        /* $scope.scrap.REG_UID = 'hong';
                         $scope.scrap.NICK_NM = '므에에롱';
                         $scope.scrap.REG_NM = '홍길동';*/

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        // 등록 버튼 클릭
        $scope.click_showCreateReview = function () {

            if ($scope.uid == '' || $scope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

//            if ($stateParams.menu == 'experiencereview') {
//                $location.url('/moms/experiencereview/edit/0');
//            } else if ($stateParams.menu == 'productreview') {
//                $location.url('/moms/productreview/edit/0');
//            } else if ($stateParams.menu == 'angereview') {
//                $location.url('/moms/angereview/edit/0');
//            } else if ($stateParams.menu == 'samplereview') {
//                $location.url('/moms/samplereview/edit/0');
//            } else if ($stateParams.menu == 'samplepackreview') {
//                $location.url('/moms/samplepackreview/edit/0');
//            }else if ($stateParams.menu == 'eventreview') {
//                $location.url('/moms/eventreview/edit/0');
//            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');

        };

        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'REVIEW';
            item.DETAIL_GB = 'BOARD';
            $scope.openModal(item, 'lg');
        };

        // 콘텐츠보기 모달창
        $scope.openModal = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/ange/com/board-report.html',
                controller: 'board-report',
                size: size,
                scope: $scope,
                resolve: {
                    data: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
//                alert(JSON.stringify(approval))
            }, function () {
                console.log("결재 오류");
            });
        }

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.likeFl();
//        $scope.addHitCnt();
//        $scope.getPeopleBoard();
//        $scope.getPreBoard();
//        $scope.getNextBoard();
        //$scope.getPeopleReplyList();

    }]);

    controllers.controller('samplepack-edit', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'CONSTANT', '$http',function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT, $http) {

        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                //console.log(data[0].name);
                var filename = data[0].name;
                var extend = filename.slice(filename.indexOf(".") + 1).toLowerCase(); //파일 확장자를 잘라내고, 비교를 위해 소문자로 변경.

                //console.log(extend);

                if(extend != "jpg" && extend != "png" &&  extend != "gif" &&  extend != "bmp"){ //확장자를 확인.
                    //$scope.file = "";
                    //$scope.file = {};
                    //$scope.queue = [];

                    console.log(data[0]);

                    $scope.file1 = {};

                    alert('이미지 파일(jpg, png, gif, bmp)만 등록 가능합니다.');
                    return;
                }else{
                    $scope.file1 = data[0];

                    console.log($scope.file);
                }
            }
        });

        $scope.search = {};
        $scope.item = {};

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.selectIdx = 1;

        $scope.showSamplepackDetails = false;

        // 초기화
        $scope.init = function(session) {
//            if ($stateParams.menu == 'angeroom') {
            $scope.community = "샘플팩 신청";
//            }
            if($stateParams.id == 'season1'){
                $scope.season_gb = 'SAMPLE1';
            }else if($stateParams.id == 'season2'){
                $scope.season_gb = 'SAMPLE2';
            }

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            // 현재달+1
            var next_mm = parseInt(mm)+1;

            if(mm < 10){
                mm = '0'+mm;
            }

            if(next_mm < 10){
                next_mm = '0'+next_mm;
            }

            var next_year = '';

            if(next_mm > 12){
                next_mm = '01';
                next_year = year + 1;
            }else{
                next_year = year
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            var now = new Date();
            var babyBirthYear = [];
            var nowYear = now.getFullYear();

            for (var i = nowYear+1; i >= nowYear; i--) {
                babyBirthYear.push(i+'');
            }


            $scope.babyBirthYear = babyBirthYear;
            $scope.year = year;
            $scope.next_year = next_year;
            $scope.month = mm;
            $scope.next_month = next_mm;// 신규회원 이달말 체크

            $scope.todayDay = dd;

            var dt = new Date(year, mm, 0);
            $scope.Day = dt.getDate();

            // 기존회원 신청자격 여부
            $scope.checked = 'N';

            // 회원정보 신청폼에 셋팅
            $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                .then(function(data){

                    $rootScope.user_info = data;
//                    $scope.item.USER_ID = data.USER_ID;
//                    $scope.item.USER_NM = data.USER_NM;
//                    $scope.item.NICK_NM = data.NICK_NM;
//                    $scope.item.ADDR = data.ADDR;
//                    $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
//                    $scope.item.REG_DT = data.REG_DT;
//                    $scope.item.REG_DT = data.REG_DT;
//                    $scope.item.PHONE_1 = data.PHONE_1;
//                    $scope.item.PHONE_2 = data.PHONE_2;

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            $scope.item.PREGNANT_WEEKS = 0;
            $scope.item.CHILD_CNT = 0;

        };

        // 정보수정 팝업
        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };


        // 탭
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                        .then(function(data){
                            $scope.item = data;
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $scope.getSession();
                                $modalInstance.close();


                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $scope.user_info = data;
                        console.log($scope.item);

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });

            console.log(dlg);
        };

        /********** 이벤트 **********/
            // 게시판 목록 이동
        $scope.click_sampleSeasonList = function () {

            if($stateParams.id == 'season1'){
                $scope.search.PRODUCT_CODE = 45;
                $scope.season_gb = 'SAMPLE1';
            }else{
                $scope.search.PRODUCT_CODE = 46;
                $scope.season_gb = 'SAMPLE2';
            }

            $scope.search.SORT = 'ada_date_regi';
            $scope.search.ORDER = 'DESC'

            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var target_gb = data[0].ada_type;
                    var target_no = data[0].ada_idx;

                    $scope.item.ada_date_open = data[0].ada_date_open;
                    $scope.item.ada_date_close = data[0].ada_date_close;
                    $scope.item.ada_date_notice = data[0].ada_date_notice;
                    $scope.item.ada_title = data[0].ada_title;
                    $scope.item.ada_count_request = data[0].ada_count_request;


                    $scope.item.TARGET_GB = target_gb;
                    $scope.item.TARGET_NO = target_no;

                    $scope.item.ada_idx = data[0].ada_idx;

                    $scope.item.ada_que_type = data[0].ada_que_type;

                    console.log($scope.item.ada_que_type);

                    //console.log(data[0].ada_que_type);

                    // 질문일 때
                    if($scope.item.ada_que_type == 'question'){
                        var que_data = data.ada_que_info;

                        //$scope.item.QUE = [];
                        $scope.item.QUE = new Array();
                        que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                        console.log(que_data);
                        var parse_que_data = JSON.parse(que_data);

                        console.log(parse_que_data);

                        for(var x in parse_que_data){

                            var choice = [];
                            if(parse_que_data[x].type == 0){ // 객관식일때
                                var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                for(var i=0; i < select_answer.length; i++){
                                    choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                            }

                            var index = parseInt(x)+parseInt(1);
                            $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                            console.log($scope.item.QUE);
                        }
                    }

                    // 질문일 때
                    if($scope.item.ada_que_type == 'upload'){

                        // 파일 업로드 설정
                        $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                        // 파일 업로드 후 파일 정보가 변경되면 화면에 로딩
                        $scope.$watch('newFile', function(data){
                            if (typeof data !== 'undefined') {
                                $scope.file = data[0];
                            }
                        });

                        console.log(data.ada_que_info);
                        //|| data.ada_que_info != ''
                        if(data.ada_que_info != undefined ){
                            var que_data = data.ada_que_info;

                            //$scope.item.QUE = [];
                            $scope.item.QUE = new Array();
                            que_data = que_data.replace(/&quot;/gi, '"'); // replace all 효과
                            var parse_que_data = JSON.parse(que_data);

                            console.log(parse_que_data);

                            for(var x in parse_que_data){

                                var choice = [];
                                if(parse_que_data[x].type == 0){ // 객관식일때
                                    var select_answer = parse_que_data[x].choice.split(';'); // ;를 기준으로 문자열을 잘라 배열로 변환

                                    for(var i=0; i < select_answer.length; i++){
                                        choice.push(select_answer[i]); // 선택문항 값 push 하여 배열에 저장
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
                                }

                                var index = parseInt(x)+parseInt(1);
                                $scope.item.QUE.push({"index" : index,"title" : parse_que_data[x].title, "type" : parse_que_data[x].type, "choice" :choice});
                                //console.log($scope.item.QUE);
                            }
                        }
                    }

                    // 댓글일 때
                    if($scope.item.ada_que_type == 'reply'){

                        //$scope.item.REPLY_SUBJECT = $scope.item.ada_title;
                    }

//                   var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;
//
//                   $scope.item.YEAR = babyBirthDt.substr(0,4);
//                   $scope.item.MONTH = babyBirthDt.substr(4,2);
//                   $scope.item.DAY = babyBirthDt.substr(6,2);

                })
                ['catch'](function(error){});
//            var babyBirthDt = $rootScope.user_info.BABY_BIRTH_DT;
//
//            $scope.item.YEAR = babyBirthDt.substr(0,4);
//            $scope.item.MONTH = babyBirthDt.substr(4,2);
//            $scope.item.DAY = babyBirthDt.substr(6,2);
        };

        // 회원가입 화면 이동
        $scope.click_joinon = function (){
            $location.url('/infodesk/signon');
        }

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

        var isSave = false;

        // 샘플팩 신청
        $scope.click_saveSamplepackComp = function (){

            if (!isSave) return;

            isSave = true;

            $scope.search.REG_UID = $rootScope.uid;
            $scope.search.ada_idx = $scope.item.TARGET_NO;
            //$scope.search.TARGET_GB = $scope.item.target_gb;

            if(CheckForm(document.getElementById("samplepackvalidation")) == false){
                isSave = false;
                return;
            }

            if($scope.season_gb == 'SAMPLE2'){

                if($scope.item.ada_count_request > 200){
                    isSave = false;

                    dialogs.notify('알림', '샘플팩 신청이 마감되었습니다.', {size: 'md'});
                    $location.url('/moms/samplepack/intro');
                    return;
                }

                if($scope.checked == 'N'){
                    isSave = false;

                    dialogs.notify('알림', '신청 자격을 확인해주세요.', {size: 'md'});
                    return;
                }

                var mileage_point = $rootScope.mileage;

                if(mileage_point < 2000){
                    isSave = false;

                    alert('보유 마일리지가 부족하여 신청이 불가능 합니다');
                    return;
                }
                $scope.item.MILEAGE = true;
            }


            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    console.log('comp_cnt = '+comp_cnt);

                    if(comp_cnt == 0){

                        console.log('$scope.item.ada_que_type == '+$scope.item.ada_que_type);

                        // 문답일때
                        if($scope.item.ada_que_type == 'question'){
                            $rootScope.jsontext2 = new Array();

                            var poll_length = $('.poll_question_no').length;
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

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 참여가 정상적으로 완료되었습니다.', {size: 'md'});

                                    if ($stateParams.menu == 'eventprocess') {
                                        $location.url('/moms/eventprocess/list');
                                    } else if($stateParams.menu == 'eventperformance') {
                                        $location.url('/moms/eventperformance/list');
                                    }

                                    isSave = false;
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); isSave = false;});

                        }else if($scope.item.ada_que_type == 'reply'){ // 댓글일때

                            console.log('{"'+$scope.item.REPLY_SUBJECT+'":"'+ $scope.item.COMMENT+'"}');
                            $scope.item.ANSWER = '{"1":"'+ $scope.item.COMMENT+'"}';

                            $scope.search.ada_idx = $scope.item.ada_idx;

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');

                                    isSave = false;
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); isSave = false;});

                        } else if($scope.item.ada_que_type == 'join'){ // 신청이나 응모일때

                            // 정보제공 동의체크 확인
                            if($("#credit_agreement_Y").is(":checked")){
                                $scope.item.CREDIT_FL = 'Y';
                            }else{
                                isSave = false;

                                alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                                return;
                            }

                            $scope.search.REG_UID = $scope.uid;
                            $scope.search.TARGET_NO = $scope.item.ada_idx;
                            $scope.search.TARGET_GB = 'EVENT';

                            $scope.item.BABY_BIRTH = $scope.item.BABY_YEAR + $scope.item.BABY_MONTH + $scope.item.BABY_DAY;

                            // 임신주차는 0으로 셋팅(int 형이라 null로 넣으면 쿼리에러 발생)
                            $scope.item.PREGNANT_WEEKS = 0;

                            if($scope.item.BLOG == undefined){
                                isSave = false;

                                alert('블로그 주소를 입력하세요');
                                return;
                            }

                            // 추가한 블로그 갯수 만큼 반복
                            var cnt = $scope.item.BLOG.length;
                            $scope.item.BLOG_URL = '';
                            $("input[name='blog[]'").each(function(index, element) {
                                if(index != (cnt -1)){
                                    $scope.item.BLOG_URL += $(element).val()+', ';
                                }else{
                                    $scope.item.BLOG_URL += $(element).val();
                                }

                            });

                            if($scope.item.QUE != undefined){

                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_join_no').length;
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
                            }

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');

                                    isSave = false;
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); isSave = false;});

                        }else if($scope.item.ada_que_type == 'upload'){

                            if($scope.item.YEAR == undefined){
                                isSave = false;

                                alert('출산예정일 연도를 선택하세요');
                                return;
                            }

                            if($scope.item.MONTH == undefined){
                                isSave = false;

                                alert('출산예정일 월을 선택하세요');
                                return;
                            }

                            if($scope.item.DAY == undefined){
                                isSave = false;

                                alert('출산예정일 일을 선택하세요');
                                return;
                            }

                            var deliveryday = '';
                            deliveryday = $scope.item.YEAR + '-' + $scope.item.MONTH + '-' + $scope.item.DAY;


                            console.log($scope.item.REASON);

                            if($scope.item.REASON != undefined){
                                $scope.item.REASON = $scope.item.REASON.replace(/^\s+|\s+$/g,'');
                            }

                            if($scope.item.REASON == undefined || $scope.item.REASON == ""){
                                isSave = false;

                                alert('태동느낌을 작성하세요');
                                return;
                            }

                            console.log(deliveryday);

                            var answer2 = '"1":"'+deliveryday+'","2":"'+$scope.item.REASON+'"';
                            console.log(answer2);

                            // 문답일때
                            var answer = [];
                            $rootScope.jsontext3 = "";

                            console.log($scope.file1);

                            if ($scope.file1 == undefined) {
                                isSave = false;

                                dialogs.notify('알림', '이미지를 등록해야합니다.', {size: 'md'});
                                return;
                            }


                            $scope.item.FILE = $scope.file1;

                            if($scope.item.QUE != undefined){

                                $rootScope.jsontext2 = new Array();

                                var poll_length = $('.poll_upload_no').length;
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

                                var last_poll_length = 0;
                                last_poll_length = poll_length+2;
                                //$scope.item.ANSWER = '{'+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                $scope.item.ANSWER = '{'+answer2+$rootScope.jsontext2+',"'+last_poll_length+'":"'+ $scope.file.name+'"'+'}';
                                //$scope.item.ANSWER = $scope.item.ANSWER.replace(/{,/ig, '{');
                                console.log($scope.item.ANSWER);

                            }else{

                                $rootScope.jsontext3 = '"3":"'+ $scope.file1.name+'"';
                                $scope.item.ANSWER = '{'+answer2+$rootScope.jsontext3+'}';
                            }

                            console.log($scope.item.ANSWER);
                            console.log($scope.item.ada_count_request);

                            $scope.insertItem('ange/comp', 'item', $scope.item, false)
                                .then(function(data){

                                    $rootScope.mileage = data.mileage;
                                    dialogs.notify('알림', '샘플팩 신청이 완료되었습니다.', {size: 'md'});

                                    $location.url('/moms/samplepack/intro');

                                    isSave = false;
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); isSave = false;});
                        }

                    }else{
                        isSave = false;

                        dialogs.notify('알림', '이미 샘플팩 신청을 했습니다.', {size: 'md'});
                        $location.url('/moms/samplepack/intro');
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'}); isSave = false;});


        }
        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        // 신청자격 여부 체크
        $scope.click_samplepackCheck = function (){

            if($scope.season_gb == 'SAMPLE2' && $scope.item.ada_count_request > 199){

                dialogs.notify('알림', '샘플팩 신청이 마감되었습니다.', {size: 'md'});
                $location.url('/moms/samplepack/intro');
            }else{

                $scope.search.ada_idx = $scope.item.ada_idx;
                $scope.search.TARGET_GB = $scope.item.target_gb;

                $scope.getList('ange/comp', 'samplepackCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                    .then(function(data){

                        var checkCnt = data[0].COMP_CNT;

                        if(checkCnt ==0){
                            dialogs.notify('알림', '신청이 가능합니다.', {size: 'md'});
                            $scope.checked = 'Y';
                            $scope.showSamplepackDetails = true;
                        }else{
                            dialogs.notify('알림', '임신중이 아니시거나 이전에 당첨되셨기 때문에 신청이 불가능합니다.', {size: 'md'});
                            $scope.checked = 'N';
                            return;
                        }

                    })
                    ['catch'](function(error){});
            }
        }


        $scope.click_compCheck = function (){

            if($scope.season_gb == 'SAMPLE2' && $scope.item.ada_count_request > 199){

                dialogs.notify('알림', '샘플팩 신청이 마감되었습니다.', {size: 'md'});
                $location.url('/moms/samplepack/intro');
            }

            $scope.search.ada_idx = $scope.item.ada_idx;
            $scope.search.TARGET_GB = $scope.item.target_gb;

            $scope.getList('ange/comp', 'samplepackCheck', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var checkCnt = data[0].COMP_CNT;

                    if(checkCnt ==0){
                        $scope.showSamplepackDetails = true;
                    }else{
                        dialogs.notify('알림', '이미 샘플팩 신청을 했습니다.', {size: 'md'});
                        return;
                    }

                })
                ['catch'](function(error){});
        }

        // 하단 배너 이미지 조회
        $scope.getBanner = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN55;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.banner = data[0];
                    $scope.banner.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getBanner();

//        $scope.init();
//        $scope.click_sampleSeasonList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_sampleSeasonList)
            ['catch']($scope.reportProblems);


    }]);

    controllers.controller('samplepack-intro', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {

            $scope.community = "샘플팩 소개";

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            $scope.month = mm; // 현재

            if(mm < 10){
                mm = '0'+mm;
            }

            if(dd < 10){
                dd = '0'+dd;
            }

            $scope.check = year+mm; // 신규회원 이달말 체크


            $scope.todayDay = dd;
            console.log($scope.todayDay);

            var dt = new Date(year, mm, 0);
            $scope.Day = dt;
            console.log(dt.getDate());
        };

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.search = {};
        $scope.item = {};

        /********** 이벤트 **********/
            // 게시판 목록 이동
//        $scope.click_sampleSeason1List = function () {
//
//            $scope.search.EVENT_GB = 'SAMPLE1';
//            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//                    $scope.item.SEASON1 = 'season1';
//
//                })
//                ['catch'](function(error){});
//        };

            // 게시판 목록 이동
//        $scope.click_sampleSeason2List = function () {
//
//            $scope.search.EVENT_GB = 'SAMPLE2';
//            $scope.getList('ange/event', 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//                    var event_gb = data[0].EVENT_GB;
//                    $scope.item.SEASON2 = 'season2';
//
//                })
//                ['catch'](function(error){});
//        };

        $scope.click_samplepackedit = function(season){

            if($rootScope.uid == '' || $rootScope.uid == null){
                dialogs.notify('알림', '로그인 후 신청이 가능 합니다.', {size: 'md'});
                return;
            }

            if(season == 'season1'){ // 신규회원 --> 현재 이달에 회원가입한 신규회원 체크(조건 : 가입일이 현재달 1일 ~ 현재달 말일)

                var reg_dt = $rootScope.user_info.REG_DT;
                reg_dt = reg_dt.replace('-','');
                reg_dt = reg_dt.substring(0,6);

                console.log($scope.check);

                if($scope.check != reg_dt && $rootScope.role != 'ANGE_ADMIN'){
                    dialogs.notify('알림', $scope.month+'월에 가입한 신규회원만 신청이 가능합니다.', {size: 'md'});
                    return;
                }

            }else if(season == 'season2'){
                if($scope.todayDay < 25 && $rootScope.role != 'ANGE_ADMIN'){ // 기존회원 --> 매달 25일 ~ 매달 말일
                    dialogs.notify('알림', '기존회원 샘플팩 신청기간이 아닙니다.', {size: 'md'});
                    return;
                }
            }


            $location.url('/moms/samplepack/edit/'+season);
        }

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();
        //$scope.click_sampleSeason1List();
        //$scope.click_sampleSeason2List();

    }]);

    controllers.controller('supporter-intro', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
//            if ($stateParams.menu == 'angeroom') {
            $scope.community = "앙쥬 서포터즈 소개";
//            }
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

});
