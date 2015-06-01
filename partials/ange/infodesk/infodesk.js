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
    controllers.controller('infodeskboard-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

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

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.search = {};

        // 초기화
        $scope.init = function(session) {

            if ($stateParams.menu == 'notice') {
                $scope.community = "공지사항";
                $scope.menu = "notice";
                $scope.search.CATEGORY_GB = 'notice';
                $scope.search.COMM_NO = 51;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.menu = "system";
                $scope.search.CATEGORY_GB = 'system';
                $scope.search.COMM_NO = 52;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.menu = "faq";
                $scope.search.CATEGORY_GB = 'faq';
                $scope.search.COMM_NO = 53;
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.menu = "qna";
                $scope.search.CATEGORY_GB = 'qna';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community_request = "내 질문과 답변";
                $scope.menu = "myqna";
                $scope.search.CATEGORY_GB = 'myqna';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.categoryfaqlist = data;
                    $scope.item.CATEGORY_NO = data[0].NO;
                })
                ['catch'](function(error){$scope.categoryfaqlist = ""});
            //$scope.item.BODY = "<span style='color: #0000ff'>아이 만나이 :</span> <br/><span style='color: #0000ff'>아이 성별:</span> <br/>---------------------------------------------------------------------------------------------------------------------------------------------";
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
        $scope.click_showPeopleClinicList = function () {
            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/list');
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/list');
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/list');
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/list');
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/list');
            }
        };

        // 게시판 조회
        $scope.getPeopleClinic = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == 'Y' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }

                        if($stateParams.menu == 'faq'){
                            var idx = 0;
                            for(var i=0; i < $scope.categoryfaqlist.length; i ++){

                                //console.log(data.FAQ_TYPE);
                                if(JSON.stringify(data.CATEGORY_NO) == JSON.stringify($scope.categoryfaqlist[i].NO)){
                                    idx = i;
                                    //console.log($scope.categoryfaqlist[i].TYPE);
                                }
                            }

                            console.log($scope.categoryfaqlist[idx].NO);

                            $scope.item.CATEGORY_NO = $scope.categoryfaqlist[idx].NO;
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeopleClinic = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            if ($stateParams.menu == 'notice') {
                $scope.item.COMM_NO = '51';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.item.COMM_NO = '52';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.item.COMM_NO = '53';
                $scope.item.FAQ_GB = 'faq';
            }else if($stateParams.menu == 'qna') {
                $scope.item.COMM_NO = '54';
            } else if($stateParams.menu == 'myqna') {
                $scope.item.COMM_NO = '54';
                $scope.item['REG_UID'] = $scope.uid;
            }

            if ($stateParams.id == 0) {

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'notice') {
                            $location.url('/infodesk/notice/list');
                        } else if($stateParams.menu == 'system') {
                            $location.url('/infodesk/system/list');
                        } else if($stateParams.menu == 'faq') {
                            $location.url('/infodesk/faq/list');
                        } else if($stateParams.menu == 'qna') {
                            $location.url('/infodesk/qna/list');
                        } else if($stateParams.menu == 'myqna') {
                            $location.url('/infodesk/myqna/list');
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'notice') {
                            $location.url('/infodesk/notice/list');
                        } else if($stateParams.menu == 'system') {
                            $location.url('/infodesk/system/list');
                        } else if($stateParams.menu == 'faq') {
                            $location.url('/infodesk/faq/list');
                        } else if($stateParams.menu == 'qna') {
                            $location.url('/infodesk/qna/list');
                        } else if($stateParams.menu == 'myqna') {
                            $location.url('/infodesk/myqna/list');
                        }
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
//        $scope.init();
//        $scope.getPeopleClinic();
    }]);

    controllers.controller('infodeskboard-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD','CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD,CONSTANT) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        //$scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

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

        $scope.selectIdx = 0;
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


            //console.log($scope.menu.COMM_NO);

            if ($stateParams.menu == 'notice') {
                $scope.community = "공지사항";
                $scope.infomenu = "notice";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 51;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.infomenu = "system";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 52;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.infomenu = "faq";
                $scope.search.COMM_NO = 53;
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.infomenu = "qna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community = "내 질문과 답변";
                $scope.infomenu = "myqna";
                $scope.search.MY_QNA = "Y";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});

            if($stateParams.menu == 'faq'){
                $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                    .then(function(data){
                        $scope.tabs = data;

                    })
                    ['catch'](function(error){ $scope.tabs = "";});
            }

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
            $location.url('infodesk/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
            // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;

            if(idx == 0){
                $scope.search.CATEGORY_NO = '';
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;
                $scope.getPeopleBoardList();
            }

        };

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    console.log(data[0].TOTAL_COUNT);

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);

            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/view/'+key);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/view/'+key);
            }else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/view/'+key);
            }  else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/view/'+key);
            }

        };

        // 조회 화면 이동
        $scope.click_showViewQnaPeopleBoard = function (password, key, regid) {


            if(password == 0){
                $location.url('/infodesk/qna/view/'+key);
            }else{

                if($scope.uid == regid || $scope.role == $scope.VIEW_ROLE){
                    if($stateParams.menu == 'qna') {
                        $location.url('/infodesk/qna/view/'+key);
                    }
                }else{
                    dialogs.notify('알림', '비밀글입니다. 작성자와 관리자만 볼 수 있습니다.', {size: 'md'});
                }
            }

        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            if ($stateParams.menu == 'notice') {

                if ($rootScope.uid == '' || $rootScope.uid == null || $rootScope.role != $scope.VIEW_ROLE) {
                    dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                    return;
                }
                $location.url('/infodesk/notice/edit/0');
            } else if($stateParams.menu == 'system') {
                if ($rootScope.uid == '' || $rootScope.uid == null|| $rootScope.role != $scope.VIEW_ROLE) {
                    dialogs.notify('알림', '관리자만 게시물을 등록 할 수 있습니다.', {size: 'md'});
                    return;
                }
                $location.url('/infodesk/system/edit/0');
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/edit/0');
            }  else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/edit/0');
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/edit/0');
            }
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
        }

        // 페이징
        $scope.pageChanged = function() {
//            console.log('Page changed to: ' + $scope.PAGE_NO);
//            $scope.getPeopleBoardList();
            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/infodesk/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);


//        $scope.init();
//        $scope.getPeopleBoardList();

        /*        $scope.test = function(session){
         console.log(session);
         }

         $scope.test();*/

        //console.log($scope.$parent.sessionInfo);
    }]);

    controllers.controller('infodeskboard-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', '$sce',function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD,$sce) {

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
            if ($stateParams.menu == 'notice') {
                $scope.community = "공지사항";
                $scope.menu = "notice";
                $scope.search.COMM_NO = 51;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.menu = "system";
                $scope.search.COMM_NO = 52;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.menu = "faq";
                $scope.search.COMM_NO = 53;
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.menu = "qna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 54;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community = "내 질문과 답변";
                $scope.menu = "myqna";
                $scope.VIEW_ROLE = 'ANGE_ADMIN';
                $scope.search.COMM_NO = 55;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
            $scope.search.SYSTEM_GB = 'ANGE';

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
            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/edit/'+item.NO);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/edit/'+item.NO);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/edit/'+item.NO);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/edit/'+item.NO);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/edit/'+item.NO);
            }
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

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

            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
            }
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

                        if(data.REPLY_YN == 'N'){
                            $scope.item.BODY = $sce.trustAsHtml(data.BODY);
                        } else {
                            $scope.item.BODY = $sce.trustAsHtml(data.BODY)+"<br><br><br><br><br><p><font color='blue'>관리자 답변<br>"+data.REPLY_BODY+"</font></p>";
                        }

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
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
            $scope.item.TARGET_GB = "BOARD";


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
            $scope.reply.TARGET_GB = "BOARD";
            $scope.reply.TARGET_NO = $stateParams.id;

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


        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'notice') {
                $location.url('/infodesk/notice/view/'+key);
            } else if($stateParams.menu == 'system') {
                $location.url('/infodesk/system/view/'+key);
            } else if($stateParams.menu == 'faq') {
                $location.url('/infodesk/faq/view/'+key);
            } else if($stateParams.menu == 'qna') {
                $location.url('/infodesk/qna/view/'+key);
            } else if($stateParams.menu == 'myqna') {
                $location.url('/infodesk/myqna/view/'+key);
            }

        };

        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'notice') {
                $scope.search['COMM_NO'] = '51';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.search['COMM_NO'] = '52';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.search['COMM_NO'] = '53';
            }else if($stateParams.menu == 'qna') {
                $scope.search['COMM_NO'] = '54';
            } else if($stateParams.menu == 'myqna') {
                $scope.search['COMM_NO'] = '54';
                $scope.search['REG_UID'] = $scope.uid;
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

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

            if ($stateParams.menu == 'notice') {
                $scope.search['COMM_NO'] = '51';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.search['COMM_NO'] = '52';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.search['COMM_NO'] = '53';
            }else if($stateParams.menu == 'qna') {
                $scope.search['COMM_NO'] = '54';
            } else if($stateParams.menu == 'myqna') {
                $scope.search['COMM_NO'] = '54';
                $scope.search['REG_UID'] = $scope.uid;
            }
            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

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
                        if ($stateParams.menu == 'notice') {
                            $location.url('/infodesk/notice/list');
                        } else if($stateParams.menu == 'system') {
                            $location.url('/infodesk/system/list');
                        } else if($stateParams.menu == 'faq') {
                            $location.url('/infodesk/faq/list');
                        } else if($stateParams.menu == 'qna') {
                            $location.url('/infodesk/qna/list');
                        } else if($stateParams.menu == 'myqna') {
                            $location.url('/infodesk/myqna/list');
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 공감
        $scope.click_likeCntAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
                .then(function(){

                    dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    $scope.getPeopleBoard();
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

        // 전문가답변 등록
        $scope.click_saveInfoDeskQnaComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';

            if ($stateParams.menu == 'qna' || $stateParams.menu == 'myqna') {
                $scope.reply.COMM_NO = '17';
            }

            $scope.reply.PARENT_NO = $scope.item.NO;

            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                    /*                    if ($stateParams.menu == 'childdevelop') {
                     $location.url('/people/childdevelop/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'chlidoriental') {
                     $location.url('/people/chlidoriental/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'obstetrics') {
                     $location.url('/people/obstetrics/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'momshealth') {
                     $location.url('/people/momshealth/view/'+$scope.item.NO);
                     } else if($stateParams.menu == 'financial') {
                     $location.url('/people/financial/view/'+$scope.item.NO);
                     }*/
                    if($stateParams.menu == 'qna') {
                        $location.url('/infodesk/qna/list');
                    } else if($stateParams.menu == 'myqna') {
                        $location.url('/infodesk/myqna/list');
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            .then($scope.getPeopleReplyList)
            ['catch']($scope.reportProblems);

        console.log($scope.uid);

//        $scope.init();
//        $scope.addHitCnt();
//        $scope.getPeopleBoard();
//        $scope.getPreBoard();
//        $scope.getNextBoard();
//        $scope.getPeopleReplyList();

    }]);

    controllers.controller('infodeskdrop-request', ['$rootScope', '$scope', '$window', '$location', 'dialogs', function ($rootScope, $scope, $window, $location, dialogs) {

        /********** 초기화 **********/
        $scope.checkDrop = false;

        $scope.init = function () {

        };

        // 비밀번호 변경
        $scope.click_dropUser = function () {
            if (!$scope.checkDrop) {
                dialogs.notify('알림', '안내를 확인 후 동의해야 합니다.', {size: 'md'});
                return;
            }

            var dialog = dialogs.confirm('알림', '탈퇴 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/user', 'terminate', $rootScope.uid, false)
                    .then(function(){
                        $scope.logout($rootScope.uid).then( function(data) {

                            dialogs.notify('알림', '정상적으로 탈퇴 되었습니다.', {size: 'md'});
                            $location.url('/main');
                        });


                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        };

        $scope.init();
    }]);

    controllers.controller('infodeskforgot-request', ['$rootScope', '$scope', '$window', '$location', 'dialogs', function ($rootScope, $scope, $window, $location, dialogs) {

        /********** 초기화 **********/
            // 진행 단계
        $scope.step = 'id';

        // 사용자 정보
        $scope.user = {};
        $scope.forget = {};

        $scope.checkID = false;
        $scope.checkPW = false;
        $scope.comparePW = false;
        $scope.availablePW = false;
        $scope.checkCert = false;
        $scope.isSMS = false;

        $scope.init = function () {
            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', CERT_GB: 'PHONE', CERT_NO: '', CERT_NO_CP: ''}
        };

        /********** 이벤트 **********/
        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

                $scope.user.PASSWORD = $scope.user.PASSWORD.replace( /(\s*)/g, '');

//                var check = /[^a-zA-Z0-9~!@\#$%<>^&*\()\-=+_\']/gi;
//                var check = /^(?=.+[0-9])(?=.+[a-zA-Z])(?=.+[!@#$%^*+=-]).{6,12}$/;
                var check = /^(?=.+[0-9])(?=.+[a-zA-Z]).{6,12}$/;

                console.log($scope.user.PASSWORD)
                console.log(check.test($scope.user.PASSWORD))
                if (check.test($scope.user.PASSWORD)) {
                    $scope.availablePW = true;
                } else {
                    $scope.availablePW = false;
                }
            } else {
                $scope.checkPW = false;
            }
        });

        $scope.$watch('user.PASSWORD_CP', function() {
            if ($scope.user.PASSWORD_CP != undefined && $scope.user.PASSWORD_CP.length > 5) {
                if ($scope.user.PASSWORD == $scope.user.PASSWORD_CP) {
                    $scope.comparePW = true;
                } else {
                    $scope.comparePW = false;
                }
            }
        });

        $scope.checkValidation = function () {

            /*
             if (!$scope.availableNick) {
             $('#nick_nm').focus();
             dialogs.notify('알림', '닉네임을 확인해주세요.', {size: 'md'});
             return;
             }

             if ($scope.user.YEAR == '' || $scope.user.MONTH == '' || $scope.user.DAY == '') {
             $('#birth').focus();
             dialogs.notify('알림', '생년월일을 확인해주세요.', {size: 'md'});
             return;
             } else {
             $scope.user.BIRTH = $scope.user.YEAR + ($scope.user.MONTH.length == 1 ? '0' + $scope.user.MONTH : $scope.user.MONTH) + ($scope.user.DAY.length == 1 ? '0' + $scope.user.DAY : $scope.user.DAY);
             }
             */

            if ($scope.user.PHONE_2_1 == '' || $scope.user.PHONE_2_2 == '' || $scope.user.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.PHONE_2 = $scope.user.PHONE_2_1 + $scope.user.PHONE_2_2 + $scope.user.PHONE_2_3;
            }

            if ($scope.step == 'id') {
                if ($scope.user.USER_NM == '') {
                    $('#user_nm').focus();
                    dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.getItem('com/user', 'forgotid', null, $scope.user, false)
                    .then(function(data) {
                        $scope.forget = data;
                        $scope.checkID = true;
                        $scope.sendSMS();
                    })
                    ['catch'](function(error){});
            } else {
                if ($scope.user.USER_ID == '') {
                    $('#user_nm').focus();
                    dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.getItem('com/user', 'forgotpw', null, $scope.user, false)
                    .then(function(data) {
                        if ($scope.user.USER_ID == data.USER_ID) {
                            $scope.sendSMS();
                        }
                    })
                    ['catch'](function(error){});
            }

            return true;
        };

        // 사용자 인증
        $scope.click_certUser = function (cert) {
//            if (cert == 'mail') {
//                $scope.user.USER_NM = '김성환';
//                $scope.user.EMAIL = 'hacker9100@gmail.com';
//
//                $scope.insertItem('com/user', 'mail', $scope.user, false)
//                    .then(function(){ dialogs.notify('알림', '인증메일이 재전송되었습니다.', {size: 'md'});})
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            } else {
            if (!$scope.checkValidation()) return;
//            }
        };

        $scope.sendSMS = function() {
            $scope.user.CERT_NO = Math.floor(Math.random() * (999999 - 100000) + 100000);

            $scope.insertItem('com/sms', 'item', $scope.user, false)
                .then(function(){ $scope.isSMS = true; dialogs.notify('알림', '인증번호가 전송되었습니다.', {size: 'md'});})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 사용자 정보 확인
        $scope.click_forgotInfo = function () {
            if ($scope.isSMS) {
                if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                    dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                    $scope.checkCert = true;
                } else {
                    dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
                    $scope.checkCert = false;
                }
            } else {
                dialogs.error('오류', '회원 인증이 되지않았습니다.', {size: 'md'});
            }

        }

        // 인증번호 확인
        $scope.click_checkCertNo = function () {
            if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                $scope.checkCert = true;
            } else {
                dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
            }
        };

        // 이전 단계 클릭
        $scope.click_changeStep = function (step) {
            $scope.checkID = false;
            $scope.checkPW = false;
            $scope.comparePW = false;
            $scope.checkCert = false;
            $scope.isSMS = false;

            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', CERT_GB: 'PHONE', CERT_NO: '', CERT_NO_CP: ''};
            $scope.forget = {};

            $scope.step = step;
        };

        // 비밀번호 변경
        $scope.click_changePassword = function () {
            if ($scope.step == 'pw') {
                if (!$scope.comparePW) {
                    $('#password').focus();
                    dialogs.notify('알림', '비밀번호를 확인해주세요.', {size: 'md'});
                    return false;
                }

                $scope.updateItem('com/user', 'password', $scope.user.USER_ID, $scope.user, false)
                    .then(function(){
                        dialogs.notify('알림', '비밀번호가 변경 되었습니다.', {size: 'md'});
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 홈으로 버튼 클릭
        $scope.click_moveHome = function () {
            $location.url('/main');
        };

        $scope.init();
    }]);

    controllers.controller('infodeskhome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};
        $scope.faq = {};

        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

        $scope.search.CONDITION = {name: "제목", value: "SUBJECT"};

        $scope.selectIdx = 0;
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
        $scope.init = function(session) {
            $scope.search.COMM_NO = 53;
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.tabs = data;

                })
                ['catch'](function(error){ $scope.tabs = "";});
        };

        /********** 이벤트 **********/
            // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;

            if(idx == 0){
                $scope.search.CATEGORY_NO = '';
                $scope.getFaqList();
            }else{
                $scope.search.CATEGORY_NO = category_no;
                $scope.getFaqList();
            }
        };

        // 게시판 목록 조회
        $scope.getFaqList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.FILE_EXIST = true;

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    console.log(data[0].TOTAL_COUNT);

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 조회 화면 이동
        $scope.click_showViewFaq = function (item) {
            $scope.getItem('com/webboard', 'item', item.NO, {}, false)
                .then(function(data){
                    $scope.faq = data;
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 검색
        $scope.click_searchFaq = function(){
            $scope.PAGE_NO = 1;
            $scope.getFaqList();
        };

        // 더보기 버튼 클릭
        $scope.click_showList = function (menu) {
            $location.url('/infodesk/'+menu+'/list');
        };

        // 리스트 선택
        $scope.click_showView = function (item) {
            if (item.COMM_NO == CONSTANT.COMM_NO_QNA && $scope.uid != item.REG_UID && item.PASSWORD_FL != '0') {
                dialogs.notify('알림', '비밀글입니다. 작성자와 관리자만 볼 수 있습니다.', {size: 'md'});
                return;
            }

            var menu = '';

            switch(item.COMM_NO) {
                case '51' :
                    menu = 'notice';
                    break;
                case '52' :
                    menu = 'system';
                    break;
                case CONSTANT.COMM_NO_QNA :
                    menu = 'qna';
                    break;
            }

            $location.url("infodesk/"+menu+'/view/'+item.NO);
        };

        // 리스트 조회
        $scope.getNoticeList = function () {
            $scope.getList('com/webboard', 'main', {NO: 0, SIZE: 10}, {COMM_NO_IN: CONSTANT.COMM_NO_NOTICE}, true)
                .then(function(data){
                    $scope.noticeList = data;
                })
                ['catch'](function(error){$scope.list = [];});
        };

        // 리스트 조회
        $scope.getQnaList = function () {
            $scope.getList('com/webboard', 'main', {NO: 0, SIZE: 10}, {COMM_NO_IN: CONSTANT.COMM_NO_QNA}, true)
                .then(function(data){
                    $scope.qnaList = data;
                })
                ['catch'](function(error){$scope.list = [];});
        };

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getFaqList();
        $scope.getNoticeList();
        $scope.getQnaList();

    }]);

    controllers.controller('infodesksignon', ['$rootScope', '$scope', '$window', '$location', '$timeout', 'dialogs', 'UPLOAD', function ($rootScope, $scope, $window, $location, $timeout, dialogs, UPLOAD) {

        /********** 초기화 **********/
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 후 파일 정보가 변경되면 화면에 썸네일을 로딩
        $scope.$watch('newFile', function(data){
            if (typeof data !== 'undefined') {
                $scope.file = data[0];
                $scope.isUpload = true;
            }
        });

        // 날짜 콤보박스
        var year = [];
        var babyYear = [];
        var month = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        $scope.isSave = false;
        $scope.isUpload = false;

        $scope.checkSave = false;
        $scope.checkCert = false;

        // 진행 단계
        $scope.step = '01';

        // 이용약관 체크
        $scope.checkAll = false;
        $scope.checkTerms = false;
        $scope.checkInfo = false;
        $scope.checkOffer = false;

        // 사용자 정보
        $scope.user = {};
        $scope.checkID = false;
        $scope.checkPW = false;
        $scope.checkNick = false;
        $scope.availableID = false;
        $scope.availablePW = false;
        $scope.availableNick = false;
        $scope.comparePW = false;
        $scope.checkAllAgree = false;

        // 아기 정보
        $scope.babies = [];

        // 블로그 정보
        $scope.blog = {};

        $scope.init = function () {
//            for (var i = 1950; i <= nowYear; i++) {
            for (var i = 2000; i >= 1950; i--) {
                year.push(i+'');
            }

            for (var i = nowYear + 1; i >= 1995; i--) {
                babyYear.push(i+'');
            }

            for (var i = 1; i <= 12; i++) {
                month.push(i+'');
            }

            for (var i = 1; i <= 31; i++) {
                day.push(i+'');
            }

            $scope.year = year;
            $scope.babyYear = babyYear;
            $scope.month = month;
            $scope.day = day;

            $scope.click_checkAllAgree();

            $scope.babies = [{}, {}, {}];

            $scope.user = {USER_ID: '', USER_NM: '', NICK_NM: '', PASSWORD: '', LUNAR_FL: '0', BIRTH: '', ZIP_CODE: '', ADDR: '', ADDR_DETAIL: '', PHONE_1: '', PHONE_2: '', USER_GB: 'MEMBER', USER_ST: '', EMAIL: '', SEX_GB: 'F',
                INTRO: '', NOTE: '', MARRIED_FL: 'Y', PREGNENT_FL: 'N', EN_ANGE_EMAIL_FL: true, EN_ANGE_SMS_FL: true, EN_ALARM_EMAIL_FL: true, EN_ALARM_SMS_FL: true, EN_STORE_EMAIL_FL: true, EN_STORE_SMS_FL: true, CERT_GB: 'PHONE'}
            $scope.user.YEAR = '';
            $scope.user.MONTH = '';
            $scope.user.DAY = '';
            $scope.user.POST_1 = '';
            $scope.user.POST_2 = '';
            $scope.user.PHONE_1_1 = '';
            $scope.user.PHONE_1_2 = '';
            $scope.user.PHONE_1_3 = '';
            $scope.user.PHONE_2_1 = '';
            $scope.user.PHONE_2_2 = '';
            $scope.user.PHONE_2_3 = '';
            $scope.user.EMAIL_ID = '';
            $scope.user.EMAIL_TYPE = '';

            $scope.blog = {BLOG_GB: '', BLOG_URL: ''};
            $scope.blog.BLOG_GB = 'NAVER';
        };

        /********** 이벤트 **********/
            // 우편번호 검색
        $scope.click_openDaumPostcode = function () {

            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');

                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                    $scope.user.POST_1 = document.getElementById('post_1').value = data.postcode1;
                    $scope.user.POST_2 = document.getElementById('post_2').value = data.postcode2;
                    $scope.user.ADDR = document.getElementById('addr').value = addr;
//                        $scope.user.ADDR = document.getElementById('addr').value = data.address;

                    //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                    //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                    //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                    //document.getElementById('addr').value = addr;

                    document.getElementById('addr_detail').focus();
                }
            }).open();
        };

        // 이용약관 체크
        $scope.click_checkItem = function (item) {
            if (item == 'checkTerms')
                $scope.checkTerms = !$scope.checkTerms;
            else if (item == 'checkInfo')
                $scope.checkInfo = !$scope.checkInfo;
            else if (item == 'checkOffer')
                $scope.checkOffer = !$scope.checkOffer;
        }

        // 이용약관 전체체크
        $scope.click_checkAll = function () {
            $scope.checkAll = !$scope.checkAll;

            $scope.checkTerms = $scope.checkAll;
            $scope.checkInfo = $scope.checkAll;
            $scope.checkOffer = $scope.checkAll;
        }

        $scope.$watch('user.USER_ID', function() {
            if ($scope.user.USER_ID != undefined && $scope.user.USER_ID.length > 5) {
                var check = /[^a-zA-Z0-9]/;
//                var check = /^(?=.*[0-9a-zA-Z]).{6,12}$/;

//                console.log($scope.user.USER_ID)
//                console.log(check.test($scope.user.USER_ID))

                if ($scope.user.USER_ID.length < 13 && !check.test($scope.user.USER_ID)) {
                    $scope.click_checkUserId();
                } else {
                    $scope.availableID = false;
                }
            } else {
                $scope.checkID = false;
                $scope.availableID = false;
            }
        });

        $scope.$watch('user.PASSWORD', function() {
            if ($scope.user.PASSWORD != undefined && $scope.user.PASSWORD.length > 5) {
                $scope.checkPW = true;

                $scope.user.PASSWORD = $scope.user.PASSWORD.replace( /(\s*)/g, '');

//                var check = /[^a-zA-Z0-9~!@\#$%<>^&*\()\-=+_\']/gi;
//                var check = /^(?=.+[0-9])(?=.+[a-zA-Z])(?=.+[!@#$%^*+=-]).{6,12}$/;
                var check = /^(?=.+[0-9])(?=.+[a-zA-Z]).{6,12}$/;

//                console.log($scope.user.PASSWORD)
//                console.log(check.test($scope.user.PASSWORD))
                if (check.test($scope.user.PASSWORD)) {
                    $scope.availablePW = true;
                } else {
                    $scope.availablePW = false;
                }
            } else {
                $scope.checkPW = false;
            }
        });

        $scope.$watch('user.PASSWORD_CP', function() {
            if ($scope.user.PASSWORD_CP != undefined && $scope.user.PASSWORD_CP.length > 5) {
                if ($scope.user.PASSWORD == $scope.user.PASSWORD_CP) {
                    $scope.comparePW = true;
                } else {
                    $scope.comparePW = false;
                }
            }
        });

        $scope.$watch('user.NICK_NM', function() {
            $scope.user.NICK_NM = $scope.user.NICK_NM.replace( /(\s*)/g, '');
//            console.log('NICK : '+$scope.user.NICK_NM);
            if ($scope.user.NICK_NM != undefined && $scope.user.NICK_NM.length > 1) {
                var addLen = (escape($scope.user.NICK_NM)+"%u").match(/%u/g).length-1;
                var totalLen = $scope.user.NICK_NM.length + addLen;

//                console.log($scope.user.NICK_NM.length + addLen);

                if (totalLen > 3 && totalLen < 13) {
//                    console.log("check");
                    $scope.click_checkUserNick();
                } else {
                    $scope.availableNick = false;
                }
            } else {
                $scope.checkNick = false;
            }
        });

        $scope.$watch('user.EMAIL_SELECT', function() {
//            console.log($scope.user.EMAIL_SELECT);
            if ($scope.user.EMAIL_SELECT != undefined) {
                if ($scope.user.EMAIL_SELECT == '') {
                    $scope.user.EMAIL_TYPE = '';
                    $scope.disabledEmail = false;
                } else {
                    $scope.disabledEmail = true;
                    $scope.user.EMAIL_TYPE = $scope.user.EMAIL_SELECT;
                }
            }
        });

        $scope.$watch('user.PREGNENT_FL', function() {
//            console.log($scope.user.PREGNENT_FL);
            if ($scope.user.PREGNENT_FL != undefined) {
                if ($scope.user.PREGNENT_FL == 'N') {
                    $scope.disabledPregnent = true;

                    $scope.user.YEAR1 = '';
                    $scope.user.MONTH1 = '';
                    $scope.user.DAY1 = '';
                } else {
                    $scope.disabledPregnent = false;
                }
            }
        });

        /*
         $scope.$watch('blog.BLOG_GB', function() {
         console.log($scope.blog.BLOG_GB);
         if ($scope.blog.BLOG_GB != undefined) {
         if ($scope.blog.BLOG_GB == 'NAVER') {
         $scope.blog.BLOG_URL = 'http://blog.naver.com/';
         } else if ($scope.blog.BLOG_GB == 'DAUM') {
         $scope.blog.BLOG_URL = 'http://blog.daum.net/';
         } else if ($scope.blog.BLOG_GB == 'TSTORY') {
         $scope.blog.BLOG_URL = 'http://blog.tstory.com/';
         } else {
         $scope.blog.BLOG_URL = '';
         }
         }
         });
         */

        // 정보수신동의 전체체크
        $scope.click_checkAllAgree = function () {
            $scope.checkAllAgree = !$scope.checkAllAgree;

            $scope.user.EN_ANGE_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_ANGE_SMS_FL = $scope.checkAllAgree;
            $scope.user.EN_ALARM_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_ALARM_SMS_FL = $scope.checkAllAgree;
            $scope.user.EN_STORE_EMAIL_FL = $scope.checkAllAgree;
            $scope.user.EN_STORE_SMS_FL = $scope.checkAllAgree;
        }

        // 아이디 중복확인
        $scope.click_checkUserId = function () {
            $scope.checkID = true;

            $scope.getItem('com/user', 'check', $scope.user.USER_ID, {}, false)
                .then(function(data) {
                    if (data.COUNT < 1) {
                        $scope.availableID = true;
//                        dialogs.notify('알림', '사용 가능한 아이디입니다.', {size: 'md'});
                    } else {
                        $scope.availableID = false;
//                        dialogs.notify('알림', '이미 존재하는 아이디입니다.', {size: 'md'});
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 닉네임 중복확인
        $scope.click_checkUserNick = function () {
            $scope.checkNick = true;

            $scope.getItem('com/user', 'nick', $scope.user.NICK_NM, {SYSTEM_GB: 'ANGE'}, false)
                .then(function(data) {
                    if (data.COUNT < 1) {
                        $scope.availableNick = true;
//                        dialogs.notify('알림', '사용 가능한 아이디입니다.', {size: 'md'});
                    } else {
                        $scope.availableNick = false;
//                        dialogs.notify('알림', '이미 존재하는 아이디입니다.', {size: 'md'});
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 아기 추가
        $scope.click_addBaby = function () {
            $scope.babies.push({});
        };

        // 아기 삭제
        $scope.click_removeBaby = function (idx) {
            $scope.babies.splice(idx, 1);
        };

        // 사용자 정보 저장
        $scope.checkValidation = function () {

            if ($scope.user.USER_ID == '' || !$scope.availableID) {
                $('#user_id').focus();
                dialogs.notify('알림', '아이디를 확인해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.PASSWORD == '' || !$scope.availablePW) {
                $('#password').focus();
                dialogs.notify('알림', '패스워드를 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.USER_NM == '') {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 확인해주세요.', {size: 'md'});
                return false;
            } else if ($scope.user.USER_NM.length < 2) {
                $('#user_nm').focus();
                dialogs.notify('알림', '이름을 2자리 이상 입력해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.NICK_NM == '' || !$scope.availableNick) {
                $('#nick_nm').focus();
                dialogs.notify('알림', '닉네임을 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.YEAR == '' || $scope.user.MONTH == '' || $scope.user.DAY == '') {
                $('#birth').focus();
                dialogs.notify('알림', '생년월일을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.BIRTH = $scope.user.YEAR + ($scope.user.MONTH.length == 1 ? '0' + $scope.user.MONTH : $scope.user.MONTH) + ($scope.user.DAY.length == 1 ? '0' + $scope.user.DAY : $scope.user.DAY);
            }

            if ($scope.user.SEX_GB == '') {
                $('#sex_gb').focus();
                dialogs.notify('알림', '성별을 확인해주세요.', {size: 'md'});
                return false;
            }

            if ($scope.user.PHONE_1_1 != '' && $scope.user.PHONE_1_2 != '' && $scope.user.PHONE_1_3 != '') {
                $scope.user.PHONE_1 = $scope.user.PHONE_1_1 + $scope.user.PHONE_1_2 + $scope.user.PHONE_1_3;
            }

            if ($scope.user.POST_1 == '' || $scope.user.POST_2 == '') {
                $('#post_1').focus();
                dialogs.notify('알림', '주소를 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.ZIP_CODE = $scope.user.POST_1 + $scope.user.POST_2;
            }

            if ($scope.user.PHONE_2_1 == '' || $scope.user.PHONE_2_2 == '' || $scope.user.PHONE_2_3 == '') {
                $('#phone_2').focus();
                dialogs.notify('알림', '휴대폰을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.PHONE_2 = $scope.user.PHONE_2_1 + $scope.user.PHONE_2_2 + $scope.user.PHONE_2_3;
            }

            if ($scope.user.EMAIL_ID == '' || $scope.user.EMAIL_TYPE == '') {
                $('#email').focus();
                dialogs.notify('알림', '이메일을 확인해주세요.', {size: 'md'});
                return false;
            } else {
                $scope.user.EMAIL = $scope.user.EMAIL_ID + '@' + $scope.user.EMAIL_TYPE;
            }

            if ($scope.user.PREGNENT_FL == '') {
                $('#pregment').focus();
                dialogs.notify('알림', '임신여부를 선택해주세요.', {size: 'md'});
                return;
            }

            if ($scope.user.MARRIED_FL == '') {
                $('#married').focus();
                dialogs.notify('알림', '결혼여부를 선택해주세요.', {size: 'md'});
                return;
            }

            if ( ($scope.user.YEAR1 == undefined || $scope.user.YEAR1 == '') || ($scope.user.MONTH1 == undefined || $scope.user.MONTH1 == '') || ($scope.user.DAY1 == undefined || $scope.user.DAY1 == '') ) {
            } else {
                $scope.user.BABY_BIRTH_DT = $scope.user.YEAR1 + ($scope.user.MONTH1.length == 1 ? '0' + $scope.user.MONTH1 : $scope.user.MONTH1) + ($scope.user.DAY1.length == 1 ? '0' + $scope.user.DAY1 : $scope.user.DAY1);
            }

//            if ($scope.blog.BLOG_URL != '' && $scope.blog.BLOG_DETAIL != '') {
//                $scope.blog.BLOG_URL = $scope.blog.BLOG_DETAIL;
//            }

            if ($scope.blog.THEME_CK != undefined && $scope.blog.THEME_CK.length != 0) {
                var strTheme = '';
                for(var i = 0; i < $scope.blog.THEME_CK.length; i++) {
                    strTheme += $scope.blog.THEME_CK[i];

                    if (i != $scope.blog.THEME_CK.length - 1) strTheme += ',';
                    if ($scope.blog.THEME_CK[i] == 10) strTheme += ',' + $scope.blog.THEME_ETC;
                }

                $scope.blog.THEME = strTheme;
            }

            return true;
        };


        // 사용자 정보 저장
        $scope.saveUser = function () {

            if (!$scope.checkValidation()) {
                return;
            }

            if ($scope.user.CERT_GB == 'PHONE' && !$scope.checkCert) {
                dialogs.notify('알림', '인증을 해주세요.', {size: 'md'});
                return;
            }

            $scope.user.SYSTEM_GB = 'ANGE';
            $scope.user.USER_GB = 'MEMBER';
            $scope.user.BABY = $scope.babies;
            $scope.user.BLOG = $scope.blog;

            if ($scope.file && $scope.isUpload) {
                $scope.user.FILE = $scope.file;
                $scope.user.FILE.$destroy = '';
                $scope.isUpload = false;
            }

            if (!$scope.isSave) {
                $scope.isSave = true;
                if (!$scope.checkSave) {
                    $scope.insertItem('com/user', 'item', $scope.user, false)
                        .then(function(){
                            $scope.addMileageSignon('CONGRATULATION', '1', $scope.user);
                            $scope.addMileageSignon('CONGRATULATION', '2', $scope.user);

                            $scope.checkSave = true;
                            $scope.isSave = false;
                            $scope.user.FILE = {};
                            if ($scope.user.CERT_GB == 'PHONE' && $scope.checkCert) {
                                $scope.step = '04';
                                $scope.finishUser();
                            } else {
                                $scope.step = '03';
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                } else {
                    $scope.updateItem('com/user', 'item', $scope.user.USER_ID, $scope.user, false)
                        .then(function(){
                            $scope.isSave = false;
                            $scope.user.FILE = {};

                            if ($scope.user.CERT_GB == 'PHONE' && $scope.checkCert) {
                                $scope.step = '04';
                                $scope.finishUser();
                            } else {
                                $scope.step = '03';
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }
            }
        };

        // 사용자 인증
        $scope.click_certUser = function (cert) {
            if (cert == 'mail') {
                $scope.insertItem('com/user', 'mail', $scope.user, false)
                    .then(function(){ dialogs.notify('알림', '인증메일이 재전송되었습니다.', {size: 'md'});})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                if (!$scope.checkValidation()) {
                    return;
                }

                $scope.user.CERT_NO = Math.floor(Math.random() * (999999 - 100000) + 100000);

                $scope.insertItem('com/sms', 'item', $scope.user, false)
                    .then(function(){ $scope.isSMS = true; dialogs.notify('알림', '인증번호가 전송되었습니다.', {size: 'md'});})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 인증번호 확인
        $scope.click_checkCertNo = function () {
            if ($scope.user.CERT_NO == $scope.user.CERT_NO_CP) {
                dialogs.notify('알림', '인증 되었습니다.', {size: 'md'});
                $scope.checkCert = true;
                $scope.isSMS = false;
            } else {
                dialogs.error('오류', '인증번호가 일치하지 않습니다.', {size: 'md'});
            }
        };

        // 다음 버튼 클릭 시 등록하는 영역으로 focus 이동
        $scope.click_focus = function (id) {
            $('html,body').animate({scrollTop:$('#'+id).offset().top}, 100);
            $('#'+id).focus();
        }

        // 가입 완료
        $scope.finishUser = function () {
            if ($scope.checkCert) {
                $scope.insertItem('com/mail', 'congratulation', $scope.user, false)
                    .then(function(data){})
                    ['catch'](function(error){});
            }
        };

        // 이전 단계 클릭
        $scope.click_prevStep = function () {
            if ($scope.step == '02') {
                $scope.step = '01'
            } else if ($scope.step == '03') {
                $scope.step = '02'
                $timeout(function() { $scope.click_focus('user_id')}, 100);
            }
        };

        // 다음 단계 클릭
        $scope.click_nextStep = function () {
            if ($scope.step == '01') {
                if (!$scope.checkTerms) {
                    dialogs.notify('알림', '이용약관에 동의해야 합니다.', {size: 'md'});
                    return;
                }

                if (!$scope.checkInfo) {
                    dialogs.notify('알림', '개인정보 취급방침에 동의해야 합니다.', {size: 'md'});
                    return;
                }

                $scope.step = '02';
                $timeout(function() { $scope.click_focus('user_id')}, 100);
            } else if ($scope.step == '02') {
                $scope.saveUser();
                $scope.finishUser();
//                if (!$scope.checkSave) {
//                    dialogs.notify('알림', '입력 정보를 다시 확인해 주세요.', {size: 'md'});
//                    return;
//                }
//
//                $scope.step = '03';
            } else if ($scope.step == '03') {
                if (!$scope.checkCert) {
                    $scope.getItem('com/user', 'cert', $scope.user.USER_ID, {}, false)
                        .then(function(data) {
                            if (data.CERT_GB != null && data.CERT_GB != '') {
                                $scope.step = '04';
                            } else {
                                dialogs.notify('알림', '회원 인증이 되지않았습니다.', {size: 'md'});
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                } else {
                    $scope.step = '04';
                }
            } else if ($scope.step == '04') {

            }
        };

        // 취소 버튼 클릭
        $scope.click_cancel = function () {
            $location.url('/main');
        };

        // 홈으로 버튼 클릭
        $scope.click_moveHome = function () {
            $location.url('/main');
        };

        // 로그인 레이어 팝업
        $scope.click_viewLogin = function () {
            $scope.openModal(null, 'md');
        };

        // 로그인 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('login_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'ANGE';

                        $scope.login($scope.item.id, $scope.item)
                            .then(function(data){
                                $rootScope.authenticated = true;
                                $rootScope.user_info = data;
                                $rootScope.uid = data.USER_ID;
                                $rootScope.name = data.USER_NM;
                                $rootScope.role = data.ROLE_ID;
                                $rootScope.system = data.SYSTEM_GB;
                                $rootScope.menu_role = data.MENU_ROLE;
                                $rootScope.email = data.EMAIL;

                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.dismiss('Canceled');
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $location.url('/main');
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.init();
    }]);
});
