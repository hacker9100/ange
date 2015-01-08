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
    controllers.controller('board-edit', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $(document).ready(function(){
            $("#checkall").click(function(){
                //클릭되었으면
                if($("#checkall").is(":checked")){
                    $("input[name=check]").attr("checked",true);
                    $scope.item.SCRAP_FL = "true";
                    $scope.item.REPLY_FL = "true";
                    //클릭이 안되있으면
                }else{
                    $("input[name=check]").prop("checked",false);
                }
            })
            $("#check_scrap").click(function(){
                if(!$("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true";
                }else{
                    $scope.item.SCRAP_FL = "false";
                }
            });

            $("#check_reply").click(function(){
                if(!$("#check_reply").is(":checked")){
                    $scope.item.REPLY_FL = "true";
                }else{
                    $scope.item.REPLY_FL = "false";
                }
            });
        });

/*        $(function(){
            $("#check_scrap").click(function(){
                if(!$("#check_scrap").is(":checked")){
                    $("#check_scrap").val("Y");
                }else{
                    $("#check_scrap").val("N");
                }
            });

            $("#check_reply").click(function(){
                if(!$("#check_reply").is(":checked")){
                    $("#check_reply").val("Y");
                }else{
                    $("#check_reply").val("N");
                }
            });
        });*/
        //<p><input name="버튼" id="btn" onclick="test();" type="button" value="test" /></p>

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'angeroom') {
                $scope.community = "앙쥬맘 수다방";
            } else if($stateParams.menu == 'momstalk') {
                $scope.community = "예비맘 출산맘";
            } else if($stateParams.menu == 'babycare') {
                $scope.community = "육아방";
            } else if($stateParams.menu == 'firshbirthtalk') {
                $scope.community = "돌잔치 톡톡톡";
            } else if($stateParams.menu == 'booktalk') {
                $scope.community = "책수다";
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
            if ($stateParams.menu == 'angeroom') {
                $location.url('/people/angeroom/list');
            } else if($stateParams.menu == 'momstalk') {
                $location.url('/people/momstalk/list');
            } else if($stateParams.menu == 'babycare') {
                $location.url('/people/babycare/list');
            } else if($stateParams.menu == 'firstbirthtalk') {
                $location.url('/people/firstbirthtalk/list');
            } else if($stateParams.menu == 'booktalk') {
                $location.url('/people/booktalk/list');
            }
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == 'Y' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

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

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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

            if ($stateParams.menu == 'angeroom') {
                $scope.item.COMM_NO = '1';
            } else if($stateParams.menu == 'momstalk') {
                $scope.item.COMM_NO = '2';
            } else if($stateParams.menu == 'babycare') {
                $scope.item.COMM_NO = '3';
            } else if($stateParams.menu == 'firstbirthtalk') {
                $scope.item.COMM_NO = '4';
            } else if($stateParams.menu == 'booktalk') {
                $scope.item.COMM_NO = '5';
            }

            if ($stateParams.id == 0) {

                if($("#check_scrap").is(":checked")){
                    $scope.item.REPLY_FL = "true"
                }else{
                    $scope.item.REPLY_FL = "false"
                }

                if($("#check_scrap").is(":checked")){
                    $scope.item.SCRAP_FL = "true"
                }else{
                    $scope.item.SCRAP_FL = "false"
                }

               $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'angeroom') {
                            $location.url('/people/angeroom/list');
                        } else if($stateParams.menu == 'momstalk') {
                            $location.url('/people/momstalk/list');
                        } else if($stateParams.menu == 'babycare') {
                            $location.url('/people/babycare/list');
                        } else if($stateParams.menu == 'firstbirthtalk') {
                            $location.url('/people/firstbirthtalk/list');
                        } else if($stateParams.menu == 'booktalk') {
                            $location.url('/people/booktalk/list');
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            } else {

                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        if ($stateParams.menu == 'angeroom') {
                            $location.url('/people/angeroom/list');
                        } else if($stateParams.menu == 'momstalk') {
                            $location.url('/people/momstalk/list');
                        } else if($stateParams.menu == 'babycare') {
                            $location.url('/people/babycare/list');
                        } else if($stateParams.menu == 'firstbirthtalk') {
                            $location.url('/people/firstbirthtalk/list');
                        } else if($stateParams.menu == 'booktalk') {
                            $location.url('/people/booktalk/list');
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };



        /********** 화면 초기화 **********/
/*        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getCmsBoard)
            .catch($scope.reportProblems);*/
        $scope.init();
        $scope.getPeopleBoard();


    }]);
});
