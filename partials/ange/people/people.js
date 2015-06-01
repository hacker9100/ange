/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peopleboard-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleboard-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, $filter, dialogs, UPLOAD, $http) {

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

//            $("#checkall").click(function(){
//                //클릭되었으면
//                if($("#checkall").is(":checked")){
//                    $("input[name='check']").prop("checked",true);
//                    $scope.item.SCRAP_FL = "true";
//                    $scope.item.REPLY_FL = "true";
//                }else{ //클릭이 안되있으면
//                    $("input[name='check']").prop("checked",false);
//                    $scope.checked = false;
//                }
//            })
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
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
                }
            });

            $("#check_reply").click(function(){
                if($("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true";
                }else{
                    $scope.item.REPLY_FL = "false";
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
                }
            });

            $("#notice_fl").click(function(){
                if($("#notice_fl").is(":checked")){
                    $scope.item.NOTICE_FL = "true";
                }else{
                    $scope.item.NOTICE_FL = "false";
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
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

            if($scope.menu.COMM_NO == '31' && ( $rootScope.role == 'SUPPORTERS' || $rootScope.role == 'ANGE_MANAGER' || $scope.role == 'ANGE_ADMIN' )){
                $scope.item.CATEGORY_NO = $rootScope.support_no;
            }

            $scope.item.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});


        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>Hello</p>';

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

    controllers.controller('peopleboard-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;
        $scope.TOTAL_PAGES = 0;


        // 검색어 조건
        if($scope.menu.COMM_NO == 8){
            var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}]; // 앙쥬맘 속풀이방은 익명게시판이므로 작성자 제외
        }else{
            var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}];
        }


        $scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+mm+dd;

        $scope.todayDate = today;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            console.log($rootScope.role);

            if($scope.menu.COMM_NO == 31){

                if($rootScope.role == 'MEMBER' || $rootScope.role == 'CLINIC'){
                    dialogs.notify('알림', '서포터즈 회원만 이용 가능합니다.', {size: 'md'});
                    $location.url('/people/home');
                }
            }

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

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

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        $scope.isLoding = true;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {
            if($stateParams.menu == 'supporter'){

                if($rootScope.role != 'ANGE_ADMIN'){
                    $scope.search.CATEGORY_NO = $rootScope.support_no;
                }
            }

            $scope.search.FILE_EXIST = true;

            $scope.isLoding = true;
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    console.log($scope.TOTAL_COUNT);

                    for(var i in data) {

                        if (data[i].FILE != null) {
                            var file_cnt = data[i].FILE[0].FILE_CNT;
                            data[i].FILE_CNT = file_cnt;

                        }
                    }

                    $scope.list = data;

                    $scope.isLoding = false;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                    //console.log(Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE));
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        $scope.pageChanged = function() {

            $scope.list = "";

            $scope.isLoding = false;

            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
//            $scope.comming_soon();
//            return;

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){

            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.SEARCH_YN = 'Y';
        }

        // 전체검색
        $scope.click_searchAllPeopleBoard = function(){
            $scope.search.KEYWORD = '';
            $scope.getPeopleBoardList();
            $scope.SEARCH_YN = 'N';
        }

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('peopleboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams','$modal', 'UPLOAD', '$sce',function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, $modal,UPLOAD,$sce) {

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
            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'BOARD';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

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

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);


            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }

            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
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
                        $scope.search.TARGET_NO = $stateParams.id;

                        $scope.renderHtml = $sce.trustAsHtml(data.BODY);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){
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

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

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

        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'BOARD';
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

    controllers.controller('peopleclinic-edit', ['$scope', '$rootScope', '$sce', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $sce, $stateParams, $location, dialogs, UPLOAD) {

        $scope.renderHtml = function(html) {
            return html != undefined ? $sce.trustAsHtml(html) : '';
        }

        //<p><input name="버튼" id="btn" onclick="test();" type="button" value="test" /></p>

        $(document).ready(function(){

            $("#check_scrap").click(function(){
                if(!$("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true";
                }else{
                    $scope.item.SCRAP_FL = "false";
                }
            });

        });

        // 게시판 초기화
        $scope.item = {};

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
        $scope.init = function(session) {

            if ($stateParams.menu == 'childdevelop') {
                $scope.item.BODY = "<span style='color: #0000ff'>아이 만나이 :</span> <br/><span style='color: #0000ff'>아이 성별:</span> <br/><br/>";
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.item.BODY = "<span style='color: #0000ff'>아이 만나이 :</span> <br/><span style='color: #0000ff'>아이 성별:</span> <br/><br/>";
            } else if($stateParams.menu == 'obstetrics') {
                $scope.item.BODY = "<span style='color: #0000ff'>문의 대상 : <span style='color: #808080'>예) 아이, 본인</span></span> <br/><span style='color: #0000ff'>문의 나이:</span> <br/><br/>";
            } else if($stateParams.menu == 'momshealth') {
                $scope.item.BODY = "";
            } else if($stateParams.menu == 'financial') {
                $scope.item.BODY = "";
            }


            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'CLINIC';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>Hello</p>';

        /********** 이벤트 **********/
            // 게시판 목록 이동
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

        // 게시판 조회
        $scope.getPeopleClinic = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == 'Y' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;


                        $rootScope.beforepasswrod = $scope.item.PASSWORD;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleClinic = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'CLINIC';
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            $scope.item.COMM_NO = $scope.menu.COMM_NO;

            if ($stateParams.id == 0) {

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                if($scope.item.PASSWORD != undefined){
                    if($scope.item.PASSWORD.length > 4){
                        dialogs.notify('알림', '비밀번호는 4자리를 입력하세요', {size: 'md'});
                        return;
                    }
                }

                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        $scope.addMileage($scope.item.BOARD_GB, $scope.menu.COMM_NO);

                        $location.url('/people/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                if($scope.item.PASSWORD.length > 4){
                    dialogs.notify('알림', '비밀번호는 4자리를 입력하세요', {size: 'md'});
                    return;
                }

                var afterpassword = $scope.item.PASSWORD;

                console.log(afterpassword);

                // 비밀번호
                if(afterpassword == '' || afterpassword == null){
                    $scope.item.PASSWORD = '';
                } else if(afterpassword == $rootScope.beforepasswrod){
                    $scope.item.PASSWORD = $rootScope.beforepasswrod;
                } else {
                    $scope.item.PASSWORD = afterpassword;
                }

                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        $location.url('/people/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleClinic)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('peopleclinic-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        $scope.tmpMenu = $stateParams.menu;
        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;
        $scope.TOTAL_PAGES = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.VIEW_ROLE = 'CLINIC';
            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            console.log($scope.search.COMM_NO);
            $scope.search.COMM_GB = 'CLINIC';
            $scope.search.PARENT_NO = '0';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;

                    var file = data.FILES;

                    console.log(data.FILES);
                    for(var i in file) {

                        console.log(file[i]);
                        if (file[i].FILE_GB == 'MAIN')
                            $scope.main_img = CONSTANT.BASE_URL + file[i].PATH + file[i].FILE_ID;
//                            $scope.main_img = "http://localhost" + file[i].PATH + file[i].FILE_ID;
                    }
                })
                ['catch'](function(error){});

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

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/clinic/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
            //$scope.init();

        $scope.isLoding = true;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.search.FILE_EXIST = true;

            $scope.isLoding = true;
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO- 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    for(var i in data) {

                        //console.log(data[i].FILE);

                        if (data[i].FILE != null) {
                            var file_cnt = data[i].FILE[0].FILE_CNT;
                            data[i].FILE_CNT = file_cnt;

                        }
                        //console.log(data[i].FILE_CNT);
                    }

                    $scope.list = data;

                    $scope.isLoding = false;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = ""; $scope.isLoding = false;});
        };

        // 조회 화면 이동(비밀글)
        $scope.click_showViewPeopleBoard = function (key, regid, password_fl) {

            console.log(regid);
            console.log($scope.role);

            if(password_fl != 0 && $scope.uid == regid){
                $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
                $rootScope.CONDITION = $scope.search.CONDITION.value;
                $rootScope.KEYWORD = $scope.search.KEYWORD;
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else if($scope.role == $scope.VIEW_ROLE){
                $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
                $rootScope.CONDITION = $scope.search.CONDITION.value;
                $rootScope.KEYWORD = $scope.search.KEYWORD;
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else if($scope.role == 'ANGE_ADMIN'){
                $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
                $rootScope.CONDITION = $scope.search.CONDITION.value;
                $rootScope.KEYWORD = $scope.search.KEYWORD;
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }
            else{
                dialogs.notify('알림', '비밀글입니다. 작성자와 해당게시판 상담가만 볼 수 있습니다.', {size: 'md'});
            }

        };

        $scope.click_showViewPeopleBoard2 = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleClinic = function () {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
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

    controllers.controller('peopleclinic-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', '$modal', '$sce', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, CONSTANT, $modal,$sce) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.reply = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        // 초기화
        $scope.init = function(session) {

            $scope.VIEW_ROLE = 'CLINIC';

            if ($stateParams.menu == 'childdevelop') {
                $scope.PROFILE = '아동발달 전문가 약력';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.PROFILE = '한방소아과 전문가 약력';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.PROFILE = '산부인과 전문가 약력';
            } else if($stateParams.menu == 'momshealth') {
                $scope.PROFILE = '엄마건강 전문가 약력';
            } else if($stateParams.menu == 'financial') {
                $scope.PROFILE = '재테크 전문가 약력';
            }

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'CLINIC';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;

                    var file = data.FILES;
                    for(var i in file) {
                        if (file[i].FILE_GB == 'MANAGER'){
                            $scope.main_img = CONSTANT.BASE_URL + file[i].PATH + file[i].FILE_ID;
                        }
                        console.log($scope.main_img);
                    }
                })
                ['catch'](function(error){});
        };

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

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleClinicEdit = function (item) {

            if(item.PASSWORD_FL != 0){
                $scope.openCounselModal(item, 'lg');
            }else{
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
            }

        };

        // 수정클릭시 비밀번호 체크
        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('peopleclinic_password_check.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.checkitem = {};
                    $scope.checkitem.NO = item.NO;
                    $scope.checkitem.BEFORE_PASSWORD = item.PASSWORD;

                    $scope.click_checkpassword = function (){

                        if($scope.checkitem.PASSWORD == ''){
                            dialogs.notify('알림', '비밀번호를 입력하세요', {size: 'md'});
                            return;
                        }

                        if($scope.checkitem.PASSWORD.length > 4){
                            dialogs.notify('알림', '비밀번호는 4자리로 입력하세요', {size: 'md'});
                            return;
                        }

                        $scope.getList('com/webboard', 'checkpassword', {} ,$scope.checkitem, false)
                            .then(function(data){
                                //dialogs.notify('알림', '수정화면으로 이동합니다', {size: 'md'});

                                var check_count = data[0].CHECK_COUNT;

                                if(check_count == 1){
                                    $modalInstance.close();

                                    $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
                                } else {
                                    dialogs.notify('알림', '비밀번호가 일치하지 않습니다', {size: 'md'});
                                    return;
                                }
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'})});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleClinicList = function () {
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/');

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
        };


        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 게시판 조회
        $scope.getPeopleClinic = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":CONSTANT.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":CONSTANT.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        if(data.BOARD_ST == 'D'){
                            $scope.item.BODY = "작성자가 삭제한 글 입니다";
                            if(data.REPLY_YN != 'N'){
                                $scope.item.REPLY_BODY = data.REPLY_BODY;
                            }
                        }else{
                            if(data.BLIND_FL == 'N'){
                                $scope.item.BODY = $sce.trustAsHtml(data.BODY);
                                if(data.REPLY_YN != 'N'){
                                    $scope.item.REPLY_BODY = data.REPLY_BODY;
                                }
                            }else{
                                $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다";
                                if(data.REPLY_YN != 'N'){
                                    $scope.item.REPLY_BODY = data.REPLY_BODY;
                                }
                            }
                        }

                        $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                        $scope.reply.PARENT_NO = $scope.item.NO;

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 답글 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';
            $scope.reply.COMM_NO = $scope.menu.COMM_NO;

            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                    $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 이전글
        $scope.getPreBoard = function (){
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        // 조회 화면 이동
        // 조회 화면 이동(비밀글)
        $scope.click_showViewPeopleBoard = function (key, regid, password_fl) {

            console.log(regid);
            console.log($scope.role);

            if(password_fl != 0 && $scope.uid == regid){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else if($scope.role == $scope.VIEW_ROLE){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else if($scope.role == 'ANGE_ADMIN'){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else if(password_fl == 0 ){
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
            }else{
                dialogs.notify('알림', '비밀글입니다. 작성자와 해당게시판 상담가만 볼 수 있습니다.', {size: 'md'});
            }

        };

        $scope.click_showPeopleClinicDelete = function(item) {
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
                        $scope.getPeopleClinic();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleClinic();
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

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
                                $scope.getPeopleClinic();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'BOARD';
            item.DETAIL_GB = 'CLINIC';
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
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.getPeopleClinic)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);
    }]);

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
            $scope.search.COMM_GB = 'TALK';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});


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
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleBoard = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'TALK';

            if ($stateParams.id == 0) {
                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                        $scope.addMileage('BOARD', $scope.menu.COMM_NO);

                        //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                        $location.url('/'+$stateParams.channel+'/discuss/list/'+$rootScope.PARENT_NO);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else {
                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                        $location.url('/'+$stateParams.channel+'/discuss/list/'+$rootScope.PARENT_NO);
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

    controllers.controller('peoplediscuss-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {


        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};
        $scope.titlesearch = {};

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'TALK';

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $rootScope.PARENT_NO= $stateParams.id;

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} ,{name: "내용", value: "BODY"}, {name: "작성자", value: "NICK_NM"}];

        //$scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

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

        $scope.search.PARENT_NO = $stateParams.id;
        //$scope.titlesearch.PARENT_NO = $stateParams.id;

        // 초기화
        $scope.init = function(session) {
            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.COMM_GB = 'TALK';


            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };


        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            $location.url('/'+$stateParams.channel+'/discusstitle/list');
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
                return $scope.getItem('com/webboard', 'discussitem', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.END_DATE = data.ETC2;

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        $scope.click_showViewPeopleBoard2 = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){

            $scope.titlesearch.COMM_NO = $scope.menu.COMM_NO;
            $scope.titlesearch.COMM_GB = 'TALK';
            $scope.titlesearch.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'pre',{} , $scope.titlesearch, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            $scope.titlesearch.COMM_NO = $scope.menu.COMM_NO;
            $scope.titlesearch.COMM_GB = 'TALK';
            $scope.titlesearch.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'next',{} , $scope.titlesearch, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.FILE_EXIST = true;
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

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

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            if($scope.END_DATE < $scope.todayDate){
                dialogs.notify('알림', '종료된 토론입니다.', {size: 'md'});
                return;
            }

            //$location.url('/'+$stateParams.channel+'/discuss/edit/'+$stateParams.id);
            $location.url('/'+$stateParams.channel+'/discuss/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }


        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('peoplediscuss-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {


        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'TALK';

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} ,{name: "내용", value: "BODY"}, {name: "작성자", value: "NICK_NM"}];

        //$scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

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



        // 초기화
        $scope.init = function(session) {

            console.log($rootScope.PARENT_NO);
            $scope.item.PARENT_NO = $rootScope.PARENT_NO;
            $scope.search.PARENT_NO = $rootScope.PARENT_NO;

            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'TALK';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };


        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$rootScope.PARENT_NO);
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

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){

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

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {


            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$rootScope.PARENT_NO);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };



        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'BOARD';
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

    controllers.controller('peoplediscusstitle-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} ,{name: "내용", value: "BODY"}, {name: "작성자", value: "NICK_NM"}];

        //$scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

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

        //$scope.uid = $rootScope.uid;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            console.log($scope.menu.COMM_NO);

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'TALK';
            $scope.search.SORT = 'BOARD_NO';
            $scope.search.ORDER = 'DESC';
            console.log('온라인토론');
//            $scope.search.BOARD_GB = 'TALK';
            $scope.search.PARENT_NO = '0';
//            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        /********** 이벤트 **********/

            // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    console.log('data[0].TOTAL_COUNT = '+data[0].TOTAL_COUNT);
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            $location.url('/'+$stateParams.channel+'/discuss/list/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('peoplehome', ['$scope', '$stateParams', '$location', '$controller', function ($scope, $stateParams, $location, $controller) {

        /********** 초기화 **********/
            // 메인 화면 모드
        $scope.slide = 'cover';
        $scope.mode = '';

        // 초기화
        $scope.init = function() {
            // ange-portlet-link-poll
            $scope.option_r1_c1 = {title: '앙쥬 설문 링크', api:'ange/poll', size: 1, url: '/people/poll'};

            // ange-portlet-channel-list
            $scope.option_r1_c2 = {title: 'Talk&Talk', api:'com/webboard', size: 10, channel: "people", type: 'board', url: '/people/board', defIdx: 0, tab: [{no: '3', menu: '/people/babycare', name: '육아방'}, {no: '2', menu: '/people/momstalk', name: '예비맘&출산맘'}, {no: '1', menu: '/people/angeroom', name: '수다방'}], image: false, head: false, date: true, nick: false};

            // ange-portlet-link-menu
            $scope.option_r1_c3 = {title: '한줄 톡', api:'ad/banner', gb: 'talk', url: '/people/linetalk/list'};

            // ange-portlet-slide-baby
            $scope.option_r2_c1 = {title: '앙쥬모델 선발대회', api:'com/webboard', size: 6, id: 'baby', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};

            // ange-portlet-link-menu
//            $scope.option_r3_c1 = {title: '책수다방', api:'ad/banner', gb: 'book', url: '/people/booktalk/list'};
            $scope.option_r3_c1 = {title: '돌잔치톡톡톡', api:'ad/banner', gb: 'dolparty', url: '/people/firstbirthtalk/list'};

            // ange-portlet-channel-list
            $scope.option_r3_c2 = {title: '맛!맛!맛!', api:'com/webboard', size: 6, channel: "people", type: 'photo', url: '/people/board', defIdx: 0, tab: [{no: '12', menu: '/people/recipearcade', name: '레시피 아케이드'}, {no: '13', menu: '/people/peopletaste', name: '앙쥬피플 맛집'}], image: true, head: true, date: false, nick: true};

            // ange-portlet-link-menu
//            $scope.option_r3_c3 = {title: '앙쥬그룹', api:'ad/banner', gb: 'group', url: '/people/group/list'};
            $scope.option_r3_c3 = {title: '온라인토론', api:'ad/banner', gb: 'online', url: '/people/discusstitle/list'};
        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showSlide = function(slide, mode) {
            $scope.slide = slide;
            $scope.mode = mode;
        };

        $scope.click_toggleSlide = function(slide) {
            if ($scope.slide != slide && $scope.mode != '') {
                $scope.slide = slide;
            } else if ($scope.slide != slide && $scope.mode == '') {
                $scope.slide = slide;
                $scope.mode = 'pan';
            } else {
                $scope.slide = 'cover';
                $scope.mode = '';
            }
        };

        $scope.click_showClinicList = function (menu) {
            $location.url('/people/'+menu+'/list');
        };

        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        /********** 화면 초기화 **********/
        $scope.init();

    }]);

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

    controllers.controller('peoplephoto-edit', ['$scope','$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD, $http) {

        $scope.checked = true;

        /********** 초기화 **********/

            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        // 에디터 안 첨부파일
        $scope.item.queue = [];

        //<p><input name="버튼" id="btn" onclick="test();" type="button" value="test" /></p>

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

//            $("#checkall").click(function(){
//                //클릭되었으면
//                if($("#checkall").is(":checked")){
//                    $("input[name='check']").prop("checked",true);
//                    $scope.item.SCRAP_FL = "true";
//                    $scope.item.REPLY_FL = "true";
//                }else{ //클릭이 안되있으면
//                    $("input[name='check']").prop("checked",false);
//                    $scope.checked = false;
//                }
//            })
        });

        $(function(){
            $("#check_scrap").click(function(){
                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true";
                }else{
                    $scope.item.SCRAP_FL = "false";
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
                }
            });

            $("#check_reply").click(function(){
                if($("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true";
                }else{
                    $scope.item.REPLY_FL = "false";
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
                }
            });

            $("#notice_fl").click(function(){
                if($("#notice_fl").is(":checked")){
                    $scope.item.NOTICE_FL = "true";
                }else{
                    $scope.item.NOTICE_FL = "false";
                    //$("input[name='check']").prop("checked",false);
                    //$("#checkall").attr("checked",false);
                }
            });
        });

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = false;
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

        // 초기화
        $scope.init = function() {

            $scope.search = {};
            $scope.search.CATEGORY_GB = $scope.community_show = $stateParams.menu;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'PHOTO';
            $scope.search.ALL = true;

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.categorylist = data;
                    $scope.item.CATEGORY_NO = data[0].NO;
                })
                ['catch'](function(error){$scope.categorylist = ""});



            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
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
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');

        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"no":files[i].NO,"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE","kind":files[i].FILE_GB,"type":files[i].FILE_EXT,"isUpdate":true});
                        }

                        $scope.item.NOTICE_FL == '1' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

                        if($scope.item.REPLY_FL == "Y"){
                            $("#check_reply").attr("checked", true);
                        }else{
                            $("#check_reply").attr("checked", false);
                        }

                        if($scope.item.SCRAP_FL== "Y"){
                            $("#check_scrap").attr("checked", true);
                        }else{
                            $("#check_scrap").attr("checked", false);
                        }

                        if($scope.item.NOTICE_FL == "Y"){
                            $("#notice_fl").attr("checked", true);
                        }else{
                            $("#notice_fl").attr("checked", false);
                        }

                        if($scope.item.REPLY_FL == "Y" && $scope.item.SCRAP_FL== "Y"){
                            $("#checkall").attr("checked", true);
                        }else{
                            $("#checkall").attr("checked", false);
                        }

                        var idx = 0;
                        var category_cnt = $scope.categorylist.length;

                        for(var i=0; i < category_cnt; i ++){

                            console.log(data.CATEGORY_NO);
                            if(JSON.stringify(data.CATEGORY_NO) == JSON.stringify($scope.categorylist[i].NO)){
                                idx = i;
                            }
                        }

                        $scope.item.CATEGORY_NO = $scope.categorylist[idx].NO;


                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeoplePhoto = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'PHOTO';
            $scope.item.FILES = $scope.queue;
            $scope.item.COMM_NO = $scope.menu.COMM_NO;

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

    controllers.controller('peoplephoto-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, CONSTANT) {

        $scope.tmpMenu = $stateParams.menu;
        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.SEARCH_TOTAL_COUNT = 0;

        $scope.list = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.list = [];
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"} , {name: "작성자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

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

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            // TODO: CATEGORY에서 조회할것
            //$scope.tabs = $scope.menu.SUB_MENU_INFO;
            //$scope.tabs = null;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
//            $scope.search.COMM_GB = 'PHOTO';
//            $scope.search.BOARD_ST = 'D';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;

                    var file = data.FILES;

                    console.log(data.FILES);
                    for(var i in file) {

                        console.log(file[i]);
                        if (file[i].FILE_GB == 'MAIN')
                            $scope.main_img = CONSTANT.BASE_URL + file[i].PATH + file[i].FILE_ID;
//                            $scope.main_img = "http://localhost" + file[i].PATH + file[i].FILE_ID;
                    }
                })
                ['catch'](function(error){});

            $scope.search.FILE = true;
            // 게시글 전체 건수
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.PHOTO_TOTAL_COUNT = total_cnt;
                })
                ['catch'](function(error){$scope.PHOTO_TOTAL_COUNT = 0;});

//            $scope.search.TOTAL_COUNT = true;
            // 카테고리 탭 셋팅
            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        //console.log(data[i].TOTAL);
                        if (data[i].TOTAL != null) {

                            console.log(data[i].TOTAL.TOTAL_COUNT);
                            var file_cnt = data[i].TOTAL.TOTAL_COUNT;
                            data[i].TOTAL_COUNT = file_cnt;

                        }
                    }

                    $scope.category_list = data;
                })
                ['catch'](function(error){$scope.category_list = ""; });

            // 검색조건유지
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

        /********** 이벤트 **********/
            // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                // 페이징
                //$scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;

                // 페이징
                //$scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.getPeopleBoardList();
            }
        };

        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
        };

        /********** 화면 초기화 **********/
            //$scope.init();

        $scope.isLoding = true;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';
            //$scope.search.FILE = true;
            $scope.search.FILE = true;

            $scope.isLoding = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        var img = CONSTANT.BASE_URL + '/storage/board/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'BOARD';
                        data[i].FILE = img;
                        $scope.list.push(data[i]);

                        console.log($scope.list);
                    }

                    $scope.isLoding = false;

                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    //alert(i + " : " + data[0].CATEGORY_NM + "(" +search_total_cnt + ")");
                    var search_now_category = data[0].CATEGORY_NM;
                    $scope.SEARCH_NOW_CATEGORY = search_now_category;
                    $scope.TOTAL_PAGES = Math.ceil($scope.SEARCH_TOTAL_COUNT/$scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0; $scope.isLoding = false;});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
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

    controllers.controller('peoplephoto-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', '$modal','CONSTANT', '$sce',function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD, $modal,CONSTANT,$sce) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};
        $scope.reply = {};

        $scope.replyList = [];

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'PHOTO';


        // 초기화
        $scope.init = function(session) {

            $scope.community_show = $stateParams.menu;

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'PHOTO';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

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

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeoplePhotoEdit = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
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
                        var files = data.FILES;
                        //console.log(JSON.stringify(data));
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                //var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                var img = CONSTANT.BASE_URL+ files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.item = data;

                        $scope.item.PARENT_NO = 0;
                        $scope.item.LEVEL = 1;
                        $scope.item.REPLY_NO = 1;
                        $scope.item.TARGET_NO = $scope.item.NO;
                        $scope.item.TARGET_GB = "BOARD";
                        $scope.item.RE_COMMENT = "";

                        $scope.renderHtml = $sce.trustAsHtml(data.BODY);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };


        // 이전글
        $scope.getPreBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);

        };

        $scope.click_showPeoplePhotoDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                        ;})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }


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

        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'BOARD';
            item.DETAIL_GB = 'PHOTO';
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
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);
    }]);

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

    controllers.controller("peoplepoll-list", ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams) {

        $(function(){
            $("#poll_st").click(function(){
                // 진행중 체크박스
                if($("#poll_st").is(":checked")){ // 진행중 체크했을때
                    $scope.search['POLL_ST'] = 0;
                    $scope.getAngePollList();
                }else{
                    $scope.search['POLL_ST'] = ''; // 안했을때
                    $scope.getAngePollList();
                }
            });
        });

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.SEARCH_YN = 'N';

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getAngePollList();
        };

        $scope.search = {};

        // 검색어 조건
        var condition = [{name: "제목", value: "ada_title"}];
//        ,{name : "작성자", value : "REG_NM"}

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

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

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showEditPoll = function(item) {
            alert("1");
            $location.url('people/poll/edit/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        // 검색
        $scope.click_searchPoll = function(){
            $scope.getAngePollList();
            $scope.SEARCH_YN = 'Y';
        }

        // 전체검색
        $scope.click_searchAllPeopleBoard = function(){
            $scope.search.KEYWORD = '';
            $scope.getAngePollList();
            $scope.SEARCH_YN = 'N';
        }

        // 게시판 목록 조회
        $scope.getAngePollList = function () {
            $scope.search['SORT'] = 'ada_date_regi';
            $scope.search['ORDER'] = 'DESC';

            $scope.getList('ange/poll', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);
                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewAngePoll = function (item) {
            /*$location.url('/people/poll/edit/'+key);*/

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 설문조사 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if (item.ada_state == 0 && $scope.todayDate < item.ada_date_open) {
                dialogs.notify('알림', '준비중입니다.', {size: 'md'});
                return;
            }


            $location.url('/people/poll/edit/'+item.ada_idx);
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getAngePollList();

    }]);
});
