/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peoplephoto-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplephoto-edit', ['$scope','$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD, $http) {

        //<p><input name="버튼" id="btn" onclick="test();" type="button" value="test" /></p>

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

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = false;
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

        $scope.item.queue = [];

        // 초기화
        $scope.init = function(session) {

            $scope.search = {};
            $scope.search.CATEGORY_GB = $scope.community_show = $stateParams.menu;

//            if ($stateParams.menu == 'angemodel') {
//                $scope.community = "앙쥬모델 선발대회";
//                $scope.community_show = "angemodel";
//                $scope.search.CATEGORY_GB = 'angemodel';
//            } else if($stateParams.menu == 'recipearcade') {
//                $scope.community = "레시피 아케이드";
//                $scope.community_show = "recipearcade";
//                $scope.search.CATEGORY_GB = 'recipearcade';
//            } else if($stateParams.menu == 'peopletaste') {
//                $scope.community = "피플 맛집";
//                $scope.community_show = "peopletaste";
//                $scope.search.CATEGORY_GB = 'peopletaste';
//            }

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.categorylist = data;
                    $scope.item.PHOTO_TYPE = data[0].TYPE;
                })
                .catch(function(error){$scope.categorylist = ""});
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

//            if ($stateParams.menu == 'peopletaste') {
//                $location.url('/people/peopletaste/list');
//            } else if($stateParams.menu == 'angemodel') {
//                $location.url('/people/angemodel/list');
//            } else if($stateParams.menu == 'recipearcade') {
//                $location.url('/people/recipearcade/list');
//            }
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        $scope.item.NOTICE_FL == 'Y' ? $scope.item.NOTICE_FL = true : $scope.item.NOTICE_FL = false;

                        if($scope.item.SCRAP_FL == 'Y'){
                            $("#check_scrap").attr("checked",true);
                        }else{
                            $("#check_scrap").attr("checked",false);
                        }

                        if($scope.item.REPLY_FL == 'Y'){
                            $("#check_reply").attr("checked",true);
                        }else{
                            $("#check_reply").attr("checked",false);
                        }

                       var idx = 0;
                        for(var i=0; i < $scope.categorylist.length; i ++){

                            console.log(data.PHOTO_TYPE);
                            if(JSON.stringify(data.PHOTO_TYPE) == JSON.stringify($scope.categorylist[i].TYPE)){
                                idx = i;
                            }
                        }
                        $scope.item.PHOTO_TYPE = $scope.categorylist[idx].TYPE;


/*                        // 프로젝트
                        angular.forEach($scope.categorylist,function(value, idx){
                            if(value.TYPE == data.PHOTO_TYPE){
                                $scope.item.PHOTO_TYPE = $scope.categorylist[idx];
                                return;
                            }
                        });*/

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 게사판 저장 버튼 클릭
        $scope.click_savePeoplePhoto = function () {
            $scope.item.SYSTEM_GB = 'ANGE';
            $scope.item.BOARD_GB = 'PHOTO';
            $scope.item.FILES = $scope.queue;
            $scope.item.PHOTO_GB = $stateParams.menu;
            $scope.item.COMM_NO = $scope.menu.COMM_NO;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

            if($scope.item.PHOTO_TYPE == 'ALL'){
                dialogs.notify('알림', '사진게시판 유형을 선택해주세요.', {size: 'md'});
                return;
            }

            if ($stateParams.id == 0) {
                $scope.insertItem('com/webboard', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('com/webboard', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
         .then($scope.sessionCheck)
         .catch($scope.reportProblems);
        $scope.init();
        $scope.getPeopleBoard();


    }]);
});
