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
});
