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
});
