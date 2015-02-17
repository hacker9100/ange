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
                $scope.search.COMM_NO = 14;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'system') {
                $scope.community = "시스템공지";
                $scope.menu = "system";
                $scope.search.CATEGORY_GB = 'system';
                $scope.search.COMM_NO = 15;
                $scope.search.COMM_GB = 'NOTICE';
            } else if($stateParams.menu == 'faq') {
                $scope.community = "자주묻는질문";
                $scope.menu = "faq";
                $scope.search.CATEGORY_GB = 'faq';
                $scope.search.COMM_NO = 16;
                $scope.search.COMM_GB = 'FAQ';
            } else if($stateParams.menu == 'qna') {
                $scope.community = "문의/게시판";
                $scope.menu = "qna";
                $scope.search.CATEGORY_GB = 'qna';
                $scope.search.COMM_NO = 17;
                $scope.search.COMM_GB = 'QNA';
            } else if($stateParams.menu == 'myqna') {
                $scope.community_request = "내 질문과 답변";
                $scope.menu = "myqna";
                $scope.search.CATEGORY_GB = 'myqna';
                $scope.search.COMM_NO = 18;
                $scope.search.COMM_GB = 'QNA';
            }

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                .catch(function(error){});

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.categoryfaqlist = data;
                    $scope.item.CATEGORY_NO = data[0].NO;
                })
                .catch(function(error){$scope.categoryfaqlist = ""});
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
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
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
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
                $scope.item.COMM_NO = '14';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'system') {
                $scope.item.COMM_NO = '15';
                //$scope.search['NOTICE_FL'] = 'Y';
            } else if($stateParams.menu == 'faq') {
                $scope.item.COMM_NO = '16';
                $scope.item.FAQ_GB = 'faq';
            }else if($stateParams.menu == 'qna') {
                $scope.item.COMM_NO = '17';
            } else if($stateParams.menu == 'myqna') {
                $scope.item.COMM_NO = '17';
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
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
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
        $scope.getPeopleClinic();


    }]);
});
