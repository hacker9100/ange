/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsreivew-edit.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsreview-edit', ['$scope','$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', '$http', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD, $http) {


        $(document).ready(function(){
            $("#general").click(function(){
                //클릭되었으면
                if($("#general").is(":checked")){
                    $('#menu_select').removeAttr('disabled');

/*                    for(var i=0; i < $scope.event.length; i++){
                        $('#value_select'+i).attr('disabled', 'disabled');
                    }*/
                    //클릭이 안되있으면
                }else{
                    $('#menu_select').attr('disabled', 'disabled');
                }
            })

            $("#value_select").click(function(){

                if(!$("#value_select").is(":checked")){
                    $('#menu_select').attr('disabled', 'disabled');
                }else{
                    $('#menu_select').removeAttr('disabled');
                }
            });

        });

         $(function(){
             $("#general").click(function(){
                 //클릭되었으면
                 if($("#general").is(":checked")){
                     $('#menu_select').removeAttr('disabled');
                     //클릭이 안되있으면
                 }else{
                     $('#menu_select').attr('disabled', 'true');
                 }
             })

             $("#value_select").click(function(){
                 if(!$("#value_select").is(":checked")){
                     $('#menu_select').attr('disabled', 'disabled');
                 }else{
                     $('#menu_select').removeAttr('disabled');
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
                $scope.checkFile = angular.copy($scope.queue);
            } else {
//                angular.forEach($scope.select, function(file) {
//                    $scope.select.pop();
//                });
                $scope.checkFile = [];
//                $scope.checkFile.splice(0, $scope.checkFile.length);
            }
//            console.log($scope.checkFile)
        };

        var state;
        $scope.click_checkFileDestroy = function () {
            angular.forEach($scope.checkFile, function(file) {
                state = 'pending';
                return $http({
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function () {
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
            angular.forEach($scope.checkFile, function(file) {
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

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "체험단/서평단 후기";
                $scope.search.JOIN_GB = 'EXPERIENCE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
                $scope.search.JOIN_GB = 'PRODUCT';
                $scope.menu = 'productreview';
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
                $scope.search.JOIN_GB = 'ANGE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
                $scope.item.JOIN_GB = 'SAMPLE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
                $scope.search['JOIN_GB'] = 'SAMPLEPACK';
                $scope.menu = 'experiencereview';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.item.JOIN_GB = 'EVENT';
                $scope.menu = 'experiencereview';
            }

            $scope.search.USER_ID = true;

            if ($stateParams.id != 0) {
                $scope.getList('ange/event', 'selectList', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.total_cnt = total_cnt;
                    })
                    .catch(function(error){$scope.event = ""; $scope.total_cnt=0;});
            }else{
                $scope.search.REVIEW_FL = true;
                $scope.getList('ange/event', 'selectList', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        var total_cnt = data[0].TOTAL_COUNT;
                        $scope.total_cnt = total_cnt;
                    })
                    .catch(function(error){$scope.event = ""; $scope.total_cnt=0;});
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
            }
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/review', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        if(data.TARGET_NO > 0){
                            var idx = 0;
                            for(var i=0; i < $scope.event.length; i ++){

                                if(JSON.stringify(data.TARGET_NO) == JSON.stringify($scope.event[i].TARGET_NO)){
                                    idx = i;
                                }
                            }
                            $scope.item.TARGET_NO = $scope.event[idx].TARGET_NO;

                            //$("input:radio[name='reveiw_mission']:radio[value='"+$scope.event[idx].NO+"']").attr("checked",true);

                            $("input:radio[name='reveiw_mission']:radio[value='"+$scope.event[idx].NO+"']").attr("checked",true);
                        } else {

                            $("#general").attr("checked",true);
                            $('#menu_select').removeAttr('disabled');
                            $scope.item.MENU = data.TARGET_GB;
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
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
            }

/*            if($scope.item.MENU != '' || $scope.item.MENU == undefined){
                $scope.item.TARGET_GB = $scope.item.MENU;
            }else{
                if ($stateParams.menu == 'experiencereview') {
                    $scope.item.TARGET_GB = 'EXPERIENCE';
                } else if ($stateParams.menu == 'productreview') {
                    $scope.item.TARGET_GB = 'PRODUCT';
                } else if ($stateParams.menu == 'angereview') {
                    $scope.item.TARGET_GB = 'ANGE';
                } else if ($stateParams.menu == 'samplereview') {
                    $scope.item.TARGET_GB = 'SAMPLE';
                } else if ($stateParams.menu == 'samplepackreview') {
                    $scope.item.TARGET_GB = 'SAMPLEPACK';
                }else if ($stateParams.menu == 'eventreview') {
                    $scope.item.TARGET_GB = 'EVENT';
                }
            }*/

            if($scope.item.MENU == undefined){
                if ($stateParams.menu == 'experiencereview') {
                    $scope.item.TARGET_GB = 'EXPERIENCE';
                } else if ($stateParams.menu == 'productreview') {
                    $scope.item.TARGET_GB = 'PRODUCT';
                } else if ($stateParams.menu == 'angereview') {
                    $scope.item.TARGET_GB = 'ANGE';
                } else if ($stateParams.menu == 'samplereview') {
                    $scope.item.TARGET_GB = 'SAMPLE';
                } else if ($stateParams.menu == 'samplepackreview') {
                    $scope.item.TARGET_GB = 'SAMPLEPACK';
                }else if ($stateParams.menu == 'eventreview') {
                    $scope.item.TARGET_GB = 'EVENT';
                }
            }else{
                $scope.item.TARGET_GB = $scope.item.MENU;
            }

            console.log($scope.item.TARGET_GB);

            if ($stateParams.id == 0) {

                $scope.insertItem('ange/review', 'item', $scope.item, false)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

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
                        }
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

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
                        }
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
