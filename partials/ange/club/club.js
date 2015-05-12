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
    controllers.controller('clubboard-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', '$q', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, $filter, $q, dialogs, UPLOAD, $http) {

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
            var deferred = $q.defer();

            $scope.item.COMM_NO = 71;

            $scope.search.COMM_NO = 71;
            $scope.search.COMM_GB = 'CLUB';
            $scope.search.ALL = true;

            $q.all([

                    $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                        .then(function(data){
                            $scope.categorylist = data;
                            $scope.item.CATEGORY_NO = data[0].NO;
                        }),
                    $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                        .then(function(data){
                            var comm_mg_nm = data[0].COMM_MG_NM;
                            $scope.COMM_MG_NM = comm_mg_nm;

                        })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    $scope.categorylist = "";
                    deferred.reject(error);
                });

            return deferred.promise;
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
            $location.url('/club/home?tab=3&type=board');

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

                        var idx = 0;
                        var category_cnt = $scope.categorylist.length;

                        for(var i=0; i < category_cnt; i ++){

                            console.log(data.CATEGORY_NO);
                            if(JSON.stringify(data.CATEGORY_NO) == JSON.stringify($scope.categorylist[i].NO)){
                                idx = i;
                            }
                        }

                        $scope.item.CATEGORY_NO = $scope.categorylist[idx].NO;

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
            $scope.item.BOARD_GB = 'CLUB';
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

                        $scope.addMileage($scope.item.BOARD_GB, 71);

                        $location.url('/club/home?tab=3&type=board');
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

                        $location.url('/club/home?tab=3&type=board');
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

    controllers.controller('clubboard-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        //$scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}, {name: "말머리", value: "HEAD"}];

        $scope.selectIdx = 0;
        $scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        $scope.search.CONDITION.value = condition[0].value;
        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+mm+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;


        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            //console.log($scope.menu.COMM_NO);


//            $scope.search.BOARD_GB = 'BOARD';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            // 카테고리 탭 셋팅
            $scope.search.COMM_NO = 71;
            $scope.search.TOTAL_COUNT = true;

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

            $scope.getItem('ange/community', 'item', $scope.search.COMM_NO, $scope.search, true)
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
                }else{
                    $scope.search.CONDITION.value = "";
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

        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

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
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        $scope.pageChanged = function() {

            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            //$location.url('/club/board/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $location.url('/club/home?tab=3&type=board&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
//            $scope.comming_soon();
//            return;

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($scope.search.CONDITION);
            $location.url('/club/board/view/'+key);
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
            $location.url('/club/board/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){

            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/club/home?tab=3&type=board&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
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

    controllers.controller('clubboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams','$modal', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, $modal,UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};

        var COMM_NO = 71;

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'CLUB';

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
            $scope.search.COMM_NO = COMM_NO;
            $scope.search.COMM_GB = 'CLUB';

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
                $scope.search.TARGET_GB = 'CLUB';

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
            $location.url('/club/board/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            $location.url('/club/home?tab=3&type=board&page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);

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
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/club/board/view/'+key);

        };

        // 이전글
        $scope.getPreBoard = function (){
            $scope.search.COMM_NO = COMM_NO;
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

            $scope.search.COMM_NO = COMM_NO;
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
                        $location.url('/club/home?tab=3&type=board');

//                        if ($stateParams.menu == 'angeroom') {
//                            $location.url('/people/angeroom/list');
//                        } else if($stateParams.menu == 'momstalk') {
//                            $location.url('/people/momstalk/list');
//                        } else if($stateParams.menu == 'babycare') {
//                            $location.url('/people/babycare/list');
//                        } else if($stateParams.menu == 'firstbirthtalk') {
//                            $location.url('/people/firstbirthtalk/list');
//                        } else if($stateParams.menu == 'booktalk') {
//                            $location.url('/people/booktalk/list');
//                        }
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
            $location.url('/club/board/edit/0');
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
            item.TARGET_GB = 'CLUB';
            item.TARGET_GB = 'CLUB';
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

//        $scope.init();
//        $scope.likeFl();
//        $scope.addHitCnt();
//        $scope.getPeopleBoard();
//        $scope.getPreBoard();
//        $scope.getNextBoard();

    }]);

    controllers.controller('clubclinic-edit', ['$scope', '$rootScope', '$stateParams', '$location', '$filter', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, $filter, dialogs, UPLOAD, $http) {

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

            $scope.item.COMM_NO = 72;

            $scope.search.COMM_NO = 72;
            $scope.search.COMM_GB = 'CLUB';
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
        $scope.click_showPeopleBoardList = function () {
            $location.url('/club/home?tab=3&type=clinic');

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

                        var idx = 0;
                        var category_cnt = $scope.categorylist.length;

                        for(var i=0; i < category_cnt; i ++){

                            console.log(data.CATEGORY_NO);
                            if(JSON.stringify(data.CATEGORY_NO) == JSON.stringify($scope.categorylist[i].NO)){
                                idx = i;
                            }
                        }

                        $scope.item.CATEGORY_NO = $scope.categorylist[idx].NO;

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
            $scope.item.BOARD_GB = 'CLUB';
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
                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        $scope.addMileage($scope.item.BOARD_GB, 72);

                        $location.url('/club/home?tab=3&type=clinic');
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

                        $location.url('/club/home?tab=3&type=clinic');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
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
            .then($scope.getPeopleBoard)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.getPeopleBoard();


    }]);

    controllers.controller('clubclinic-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.selectIdx = 0;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}, {name: "말머리", value: "HEAD"}];


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

//            $scope.search.BOARD_GB = 'BOARD';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            $scope.search.COMM_NO = 72;
            $scope.search.COMM_GB = 'CLUB';
            //$scope.uid = $rootScope.uid;
            $scope.search.PARENT_NO = '0';
            $scope.search.TOTAL_COUNT = true;

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

            $scope.getItem('ange/community', 'item', $scope.search.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;
                })
                ['catch'](function(error){});

            //$scope.search.SORT = 'NOTICE_FL'

            // 카테고리 탭 셋팅


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

        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

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
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        $scope.pageChanged = function() {

            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/club/home?tab=3&type=clinic&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
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
            $location.url('/club/clinic/view/'+key);
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
            $location.url('/club/clinic/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){

            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/club/home?tab=3&type=clinic&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
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

    controllers.controller('clubclinic-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams','$modal', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, $modal,UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};


        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'CLUB';

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

            $scope.VIEW_ROLE = 'CLINIC';

            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            $scope.search.COMM_NO = 71;
            $scope.search.COMM_GB = 'CLUB';

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
                $scope.search.TARGET_GB = 'CLUB';

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
            $location.url('/club/clinic/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('view $rootScope.NOW_PAGE_NO = '+$rootScope.NOW_PAGE_NO);

            console.log('$stateParams.menu = '+$stateParams.menu);
            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            $location.url('/club/home?tab=3&type=clinic&page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);

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
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":CONSTANT.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":CONSTANT.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }


                        if(data.BOARD_ST == 'D'){
                            if(data.REPLY_YN == 'N'){
                                $scope.item.BODY = "작성자가 삭제한 글 입니다";
                            } else {
                                $scope.item.BODY = "작성자가 삭제한 글 입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                            }
                        }else{
                            if(data.BLIND_FL == 'N'){
                                if(data.REPLY_YN == 'N'){
                                    $scope.item.BODY;
                                } else {
                                    $scope.item.BODY = data.BODY+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                }
                            }else{
                                if(data.REPLY_YN == 'N'){
                                    $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다";
                                } else {
                                    $scope.item.BODY = "관리자에 의해 블라인드 처리가 된 글입니다"+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                                }
                            }
                        }

                        $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                        $scope.reply.PARENT_NO = $scope.item.NO;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/club/board/view/'+key);

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
                        $location.url('/club/home?tab=3&type=clinic');

//                        if ($stateParams.menu == 'angeroom') {
//                            $location.url('/people/angeroom/list');
//                        } else if($stateParams.menu == 'momstalk') {
//                            $location.url('/people/momstalk/list');
//                        } else if($stateParams.menu == 'babycare') {
//                            $location.url('/people/babycare/list');
//                        } else if($stateParams.menu == 'firstbirthtalk') {
//                            $location.url('/people/firstbirthtalk/list');
//                        } else if($stateParams.menu == 'booktalk') {
//                            $location.url('/people/booktalk/list');
//                        }
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
            $location.url('/club/clinic/edit/0');
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
            item.TARGET_GB = 'CLUB';
            item.TARGET_GB = 'CLUB';
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


        // 답글 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';
            $scope.reply.COMM_NO = 72;
            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                    $location.url('/club/home?tab=3&type=clinic');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

//        $scope.init();
//        $scope.likeFl();
//        $scope.addHitCnt();
//        $scope.getPeopleBoard();
//        $scope.getPreBoard();
//        $scope.getNextBoard();

    }]);

    controllers.controller('clubhome', ['$rootScope', '$scope', '$window', '$location', 'dialogs', 'CONSTANT', function ($rootScope, $scope, $window, $location, dialogs, CONSTANT) {

        console.log($rootScope.role);
        console.log($rootScope.user_gb);

//        if($rootScope.role != 'ANGE_ADMIN'){
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            $location.url('/main');
//        }
//
//        if($rootScope.user_gb != 'CLUB' || $rootScope.role != 'ANGE_ADMIN'){
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            $location.url('/main');
//        }

//        if($rootScope.role != 'ANGE_ADMIN' ){ //|| $rootScope.user_gb != 'CLUB'
//            dialogs.notify('알림', '앙쥬클럽 회원만 사용가능 합니다.', {size: 'md'});
//            return;
//        }


        $scope.search = {};

        $scope.selectIdx = 1;

        $scope.selectSubIdx = 1;
        //$scope.selectBoard = 'board';
        $scope.selectBoard = '';

        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}, {name: "말머리", value: "HEAD"}];
        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        //$scope.search.CONDITION.value = condition[0].value;



        /********** 초기화 **********/

        $scope.init = function () {
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

            console.log('getParam("tab") = '+getParam("tab"));

            if(getParam("tab") == undefined){
                $scope.selectIdx = 1;
            }else{
                $scope.selectIdx = getParam("tab");
                $scope.selectBoard = getParam("type");

                if(getParam("page_no") != undefined){
                    $scope.PAGE_NO = 1
                }else{
                    $scope.PAGE_NO = getParam("page_no")
                }
//
                if(getParam("condition") != undefined){
//                    //$scope.search.CONDITION.value = getParam("condition");
//                    console.log('getParam("condition") = '+getParam("condition"));
//                    //$scope.search.CONDITION.value = getParam("condition");
//                    condition[0].value = getParam("condition");
//                    $scope.search.CONDITION.value = condition[0].value;
                }else{
                    $scope.search.CONDITION.value = condition[0].value;
                }

                $scope.search.KEYWORD = getParam("keyword");
            }

        };

        /********** 이벤트 **********/
        $scope.click_selectTab = function (idx){
            $scope.selectIdx = idx;

            if (idx == 1){
                $scope.selectSubIdx = 1;
            } else if (idx == 2) {
                $scope.selectSubIdx = 5;
            } else {
                $scope.selectSubIdx = 7;
            }
        }

        /********** 이벤트 **********/
        $scope.click_selectSubTab = function (idx){
            $scope.selectSubIdx = idx;
        }

        $scope.click_board = function(board_gb){
            $scope.selectBoard = board_gb;

        }


        // 하단 배너 이미지 조회
        $scope.getBanner1 = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN57;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.banner1 = data[0];
                    $scope.banner1.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getBanner1();

        // 하단 배너 이미지 조회
        $scope.getBanner2 = function () {
            $scope.search = {};
            $scope.search.ADP_IDX = CONSTANT.AD_CODE_BN57;
            $scope.search.ADA_STATE = 1;
            $scope.search.ADA_TYPE = 'banner';
            $scope.search.MENU = $scope.path[1];
            $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);

            $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, $scope.search, false)
                .then(function(data){
                    $scope.banner2 = data[0];
                    $scope.banner2.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                })
                ['catch'](function(error){});
        };

        $scope.getBanner2();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            ['catch']($scope.reportProblems);

    }]);
});
