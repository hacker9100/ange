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
});
