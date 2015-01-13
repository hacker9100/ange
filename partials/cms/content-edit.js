/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : content-edit.html 화면 콘트롤러
 */

define([
    'controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('content-edit', ['$scope', '$sce', '$stateParams', '$location', '$modal', '$q', 'dialogs', 'UPLOAD', function ($scope, $sce, $stateParams, $location, $modal, $q, dialogs, UPLOAD) {

        // 텔플릿 선택 클릭
        $scope.click_selectTemplet = function (item) {

            var blankSpace = '<p><img class="template_handle" src="' + UPLOAD.BASE_URL + '/imgs/template_handler.jpg" style="width:260px; height:14px;"/></p>';

            switch (item) {

                case 'handler_template' :
                    if (!angular.isUndefined(CKEDITOR)) {
                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }

                    break;

                case 'basic_template' :
                    var temp =
                        '<div class="story-row previewwrap">' +
                            '<div id="inBodyForm" class="story-col-xs-12 article_previewwrap">' +
                                blankSpace +
                            '</div>' +
                            '<div class="hiddenline">' +
                                $scope.item.BODY;
                            '</div>' +
                        '</div>';

//                    if (!angular.isUndefined(CKEDITOR)) {
//                        var element = CKEDITOR.dom.element.createFromHtml(temp);
//                        CKEDITOR.instances.editor1.insertElement( element );
//                    }
                    $scope.item.BODY = temp;
                    break;

                case 'plantitle_template' :
                    var temp =
                        '<plantitle>' + '<strong>섹션명</strong> | 제목' + '</plantitle>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'byline_template' :
                    var temp =
                        '<byline>' +
                            '<div id="basic_information" class="basic_information">' + '<strong>프로젝트 [호제]</strong> 2014-12-25' + '</div>' +
                            '<strong>에디터</strong> 이름 / <strong>포토그래퍼</strong> 이름 / <strong>참고한 책</strong> &lt;제목&gt; &lt;제목&gt; / <strong>의상 협찬</strong> 업체(02-1234-5678, www.homepage.co.kr) / <strong>모델</strong> 이름' +
                        '</byline>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'headline_template' :
                    var temp1 =
                        '<subtitle>' + "소제목을 입력하세요" + '</subtitle>';

                    var temp2 =
                        '<maintitle>' + "대제목을 입력하세요" + '</maintitle>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp1);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(temp2);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'preface_basic_template' :
                    var temp1 =
                        '<div class="imagebox"><img class="template_handle" src="' + UPLOAD.BASE_URL + '/imgs/image_handler.jpg" style="float:none; width:260px; height:14px; margin:0px auto;"/></div>';

                    var temp2 =
                        '<preface>' + '전문 내용을 입력하세요' + '</preface>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp1);
                        CKEDITOR.instances.editor1.insertElement( element );

                        var element = CKEDITOR.dom.element.createFromHtml(temp2);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'sectionmain_template' :
                    var temp =
                        '<sectionmain>' + '주제를 입력하세요' + '</sectionmain>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'sectionsub_template' :
                    var temp =
                        '<sectionsub>' + '소주제를 입력하세요' + '</sectionsub>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'bodyscript_template' :
                    var temp =
                        '<bodyscript>' + '본문 내용을 입력하세요' + '</bodyscript>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'bodyscript_p2b_template' :
                    var temp =
                        '<div class="story-row">' +
                            '<div class="story-col-sm-6">' +
                                '<div class="imagebox"><img class="template_handle" src="' + UPLOAD.BASE_URL + '/imgs/image_handler.jpg" style="float:none; width:260px; height:14px; margin:0px auto;"/></div>' +
                                '<mediacaption>이미지 설명을 입력하세요</mediacaption>' +
                            '</div>' +

                            '<div class="story-col-sm-6">' +
                                '<bodyscript>본문 내용을 입력하세요</bodyscript>' +
                            '</div>' +
                        '</div>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'bodyscript_b2p_template' :
                    var temp =
                        '<div class="story-row">' +
                            '<div class="story-col-sm-6">' +
                                '<bodyscript>본문 내용을 입력하세요</bodyscript>' +
                            '</div>' +

                            '<div class="story-col-sm-6">' +
                            '<div class="imagebox"><img class="template_handle" src="' + UPLOAD.BASE_URL + '/imgs/image_handler.jpg" style="float:none; width:260px; height:14px; margin:0px auto;"/></div>' +
                                '<mediacaption>이미지 설명을 입력하세요</mediacaption>' +
                            '</div>' +
                        '</div>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case 'tips_template' :
                    var temp =
                        '<tips>' + '<div class="tip_title">' + 'TIP 제목을 입력하세요' + '</div>' + '내용을 입력하세요.' + '</tips>';

                    if (!angular.isUndefined(CKEDITOR)) {
                        var element = CKEDITOR.dom.element.createFromHtml(temp);
                        CKEDITOR.instances.editor1.insertElement( element );

                        element = CKEDITOR.dom.element.createFromHtml(blankSpace);
                        CKEDITOR.instances.editor1.insertElement( element );
                    }
//                    $scope.item.BODY = temp + $scope.item.BODY;
                    break;

                case '2E' :
                    var temp =
                        '<div class="story-row"> ' +
                            '<div class="story-col-sm-2" style="width:700px; height:500px; border:1px dashed; "></div>' +
                            '<div class= "story-col-sm-2" style="width:700px; height:300px; border:1px dashed; ">' +
                            $scope.item.BODY;
                            '</div>' +
                        '</div>';

                    $scope.item.BODY = temp;

//                    if (!angular.isUndefined(CKEDITOR)) {
//                        var element = CKEDITOR.dom.element.createFromHtml( temp );
//                        CKEDITOR.instances.editor1.insertElement( element );
//                    }

//                    CKEDITOR.instances.editor1.insertHtml(temp);

                    break;
                case '2F' :

                    break;
            }
        };

        /********** 미리보기 랜더링 **********/
        $scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };

        /********** 초기화 **********/
        // 첨부 파일
        $scope.queue = [];

        // 초기화
        $scope.init = function() {

        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });
        $scope.ckeditor = '<p>\n<p>';
//        $scope.content = { "BODY": '<p>Hello</p>\n' };

        /********** 이벤트 **********/
        // 태스크 목록 이동
        $scope.click_showContentList = function () {
            $location.path('/'+$stateParams.menu+'/list');
        };

        // 이력조회 버튼 클릭
        $scope.click_showGetHistory = function (key) {
            $scope.openHistoryModal({TASK_NO : key}, 'lg');
        };

        $scope.openHistoryModal = function (item, size) {
            var dlg = dialogs.create('/partials/cms/popup/history.html',
                ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {
                    $scope.getList('cms/history', 'list', {}, item, true).then(function(data){$scope.list = data;})
                        .catch(function(error){console.log(error);});

                    $scope.list = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 태스크/콘텐츠 조회
        $scope.getTask = function () {
            var deferred = $q.defer();
            $q.all([
                    $scope.getItem('cms/task', 'item', $stateParams.id, {}, false).then(function(data){$scope.task = data;}),
                    $scope.getItem('cms/content', 'item', $stateParams.id, {}, false).then(function(data){
                        $scope.item = data;

                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                ])
                .then( function(results) {
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        // 콘텐츠 저장 버튼 클릭
        $scope.click_saveContent = function () {
            $scope.item.TASK = $scope.task;
            $scope.item.FILES = $scope.queue;

            for(var i in $scope.item.FILES) {
                $scope.item.FILES[i].$destroy = '';
                $scope.item.FILES[i].$editor = '';
            }

            if ( $scope.item.NO == undefined ) {
                $scope.item.PHASE = '10';

                $scope.insertItem('cms/content', 'new', $scope.item, false)
                    .then(function(){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'}); $scope.task.PHASE = '10';})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                if ( $scope.task.PHASE == '20' && $scope.item.PHASE != $scope.task.PHASE ) {
                    $scope.insertItem('cms/content', 'version', $scope.item, false)
                        .then(function(){dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});})
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                } else {
                    $scope.updateItem('cms/content', 'item', $scope.item.NO, $scope.item, false)
                        .then(function(){dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});})
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }
            }
        };

        // 원고 승인 요청 버튼 클릭
        $scope.click_commitContent = function () {
            if ($scope.task.PHASE == '0') {
                alert("원고를 등록해 주세요.");
                return;
            }

            var phase = '';
            if ($scope.task.PHASE == '10' || $scope.task.PHASE == '11' || $scope.task.PHASE == '12') {
                phase = '11';
            } else {
                phase = '21';
            }

            $scope.updateStatus('cms/task', 'status', $scope.task.NO, phase, false)
                .then(function(){$location.url('/'+$stateParams.menu+'/list');})
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 반려 버튼 클릭
        $scope.click_returnContent = function () {
            var status = '';
            if ($scope.task.PHASE == '11') {
                status = '11';
            } else {
                status = '21';
            }

            $scope.openApprovalModal($scope.item, status);
        };

        // 승인 버튼 클릭
        $scope.click_approveContent = function () {
            var status = '';
            if ($scope.task.PHASE == '11') {
                status = '12';
            } else {
                status = '22';
            }

            $scope.openApprovalModal($scope.item, status);
        }

        // 결재 모달창
        $scope.openApprovalModal = function (content, status, size) {
            var modalInstance = $modal.open({
                templateUrl: 'content_approval_modal.html',
                controller: 'content_approval_modal',
                size: size,
                resolve: {
                    content: function () {
                        return content;
                    },
                    status: function() {
                        return status;
                    }
                }
            });

            modalInstance.result.then(function (approval) {
//                alert(JSON.stringify(approval))
            }, function () {
                console.log("결재 오류");
            });
        }

        // 미리보기 버튼 클릭
        $scope.click_showPreview = function() {
            $scope.openModal2($scope.item.BODY, 'lg');
        };

        // 미리보기 모달창
        $scope.openModal2 = function (content, size) {
            var dlg = dialogs.create('preview_modal.html',
                ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {
                    $scope.content = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: false}, $scope);
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.initUpdate = function() {
            if ( $stateParams.id != 0) {
                $scope.getTask();
            }
        }

        /********** 화면 초기화 **********/
        if ($stateParams.menu == 'article' || $stateParams.menu == 'edit') {
            $scope.isCommit = true;
            $scope.isApproval = false;
        } else if ($stateParams.menu == 'article-confirm' || $stateParams.menu == 'edit-confirm') {
            $scope.isCommit = false;
            $scope.isApproval = true;
        }

        if ($stateParams.menu == 'edit' || $stateParams.menu == 'edit-confirm') {
            $scope.isTemplet = true;
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.permissionCheck)
            .then($scope.init)
            .then($scope.initUpdate)
            .catch($scope.reportProblems);

    }]);

    controllers.controller('content_approval_modal', ['$scope', '$stateParams', '$modalInstance', 'dataService', 'content', 'status', '$location', function ($scope, $stateParams, $modalInstance, dataService, content, status, $location) {

        if (status == '12' || status == '22') {
            $scope.title = "승인 처리";
        } else {
            $scope.title = "반려 처리";
        }

        $scope.approval = {};
        $scope.approval.TASK_NO = content.TASK_NO;
        $scope.approval.CONTENT_NO = content.NO;
        $scope.approval.APPROVAL_ST = status;

        $scope.click_ok = function () {
            dataService.db('com/approval').insert('item', $scope.approval, function(data, status){
                if (status != 200) {
                    alert('결재에 실패 했습니다.');
                } else {
                    console.log(JSON.stringify(data))
                    if (!data.err) {
                        $location.url('/'+$stateParams.menu+'/list');
                        $modalInstance.dismiss();
                    } else {
                        alert(data.msg);
                    }
                }
            });

//            approvalService.createApproval($scope.approval).then(function(data){
//                $modalInstance.close($scope.approval);
//            });
        };

        $scope.click_cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
});
