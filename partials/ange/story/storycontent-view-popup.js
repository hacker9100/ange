/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storycontent-view-popup.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storycontent-view-popup", ['$scope', '$sce', '$controller', '$rootScope', '$location', '$modalInstance', '$q', 'dialogs', 'UPLOAD', 'data', function($scope, $sce, $controller, $rootScope, $location, $modalInstance, $q, dialogs, UPLOAD, data) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        /********** 초기화 **********/

        $scope.TARGET_NO = data.NO;
        $scope.TARGET_GB = 'CONTENT';

        $scope.plusList = [];
        $scope.currentPage = 1;
        $scope.totalPage = 1;

        // 초기화
        $scope.init = function () {

        };

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
//            return html_code;
        };

        /********** 이벤트 **********/
        $scope.click_ok = function () {
            $modalInstance.close();
        };

        // 콘텐츠 조회
        $scope.getContent = function () {
            var deferred = $q.defer();
            $q.all([
                    $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:9}, {CATEGORY: data.CATEGORY, FILE: true, PHASE: '30, 31'}, false).then(function(data){
                        console.log(JSON.stringify(data))
                        $scope.totalPage = Math.round(data[0].TOTAL_COUNT / 2);

                        for (var i in data) {
                            if (data[i].FILE.PATH != undefined) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;
                                $scope.plusList.push(data[i]);
                            }
                        }
                    }),
                    $scope.getItem('cms/task', 'item', data.NO, {}, false).then(function(data){ $scope.task = data; }),
                    $scope.getItem('cms/content', 'item', data.NO, {}, false).then(function(data){ $scope.content = data; }),
                    $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:5}, {EDITOR_ID: data.EDITOR_ID, PHASE: '30, 31'}, false).then(function(data){
                        $scope.editorList = data;
                    }),
                    $scope.getList('ad/banner', 'list', {NO:$scope.PAGE_NO, SIZE:1}, $scope.search, false).then(function(data){
                        for (var i in data) {
                            if (data[i].FILE.PATH != undefined) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;
                                $scope.ad = data[i];
                            }
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

        // 기사 프린트 버튼 클릭
        $scope.click_printDiv = function (divName) {
//            $( ".articlewrap" ).print();
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var popupWin = window.open('', '_blank', 'width=1000,height=900');
            popupWin.document.open()
            popupWin.document.write('<html><head>' +
                                        '<link rel="stylesheet" type="text/css" href="css/ange/normalize.css" >' +
                                        '<link rel="stylesheet" type="text/css" href="css/ange_bootstrap.css" />' +
                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_style.css" />' +
                                        '<link rel="stylesheet" type="text/css" href="lib/jquery/css/base/jquery-ui-1.10.2.min.css" />' +
                                        '<link rel="stylesheet" type="text/css" href="css/article.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_storylist.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_people_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_peoplepoll.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_peopleboard.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_moms_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_myange_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_store_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_infodesk_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_join.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_moms.css" />' +
                                    '</head><body onload="window.print()"><div class="modal-body"><div class="story-row previewwrap"><div class="story-col-xs-12 article_previewwrap">' + printContents + '</div></div></div></html>');
            popupWin.document.close();
        };

        // 공유 버튼 클릭
        $scope.click_shareContent = function () {
            dialogs.notify('알림', '준비중 입니다.', {size: 'md'});
        };

        $scope.click_addScrap = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.search['TARGET_NO'] = $scope.task.NO;

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {
                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = $scope.task.NO;
                        $scope.scrap.TARGET_GB = 'CONTENT';

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 플러스 기사 이전 클릭
        $scope.click_prevPlus = function(){
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };

        // 플러스 기사 다음 클릭
        $scope.click_nextPlus = function(){
            if ($scope.currentPage < $scope.totalPage) {
                $scope.currentPage++;
            }
        };

        // 공감 클릭
        $scope.click_addLike = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사용할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = $scope.task.LIKE_FL;
            $scope.likeItem.TARGET_NO = $scope.task.NO;
            $scope.likeItem.TARGET_GB = 'CONTENT';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.task.LIKE_FL == 'Y' ? 'N' : 'Y';
                    $scope.task.LIKE_FL = afterLike;
                    $scope.task.LIKE_CNT = afterLike == 'Y' ? parseInt($scope.task.LIKE_CNT) + 1 : parseInt($scope.task.LIKE_CNT) - 1;

                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.init();
        $scope.getContent();
    }]);
});

