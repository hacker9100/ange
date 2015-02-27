/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storymagazine-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storymagazine-list", ['$scope', '$stateParams', '$sce', '$rootScope', '$location', '$modal', '$timeout', 'dialogs', 'UPLOAD', function($scope, $stateParams, $sce, $rootScope, $location, $modal, $timeout, dialogs, UPLOAD) {

//        angular.element(document).ready(function () {
//            angular.element('#common').scroll(function () {
//                $timeout(function(){
//                    //$scope.images;
//                    $scope.isLoading = false;
//                },1000);
//
//                $timeout(function() {
//                    $scope.isLoading = true;
//                });
//
////                console.log("common : "+ (angular.element('#common').prop('scrollHeight') - angular.element('#common').height()));
////                console.log("scrollTop : "+(angular.element('#common').scrollTop() ));
//
//                if (angular.element('#common').scrollTop() + 100 >= angular.element('#common').prop('scrollHeight') - angular.element('#common').height()) {
//                    if (!$scope.busy) {
//                        $scope.PAGE_NO++;
//                        $scope.getContentList();
//                    }
////                    var scope = angular.element($("#listr")).scope();
////                    scope.$apply(function(){
////                        scope.PAGE_NO++;
////                        $scope.getContentList();
////                    });
//                }
//            });
//        });
//
//        /********** 초기화 **********/
//        $scope.$parent.reload = false;
//        $scope.busy = false;
//        $scope.end = false;
//        $scope.list = [];
//        $scope.search = {PHASE: '30, 31', CONETNT: true};
//
//        // 페이징
//        $scope.PAGE_NO = 0;
//        $scope.PAGE_SIZE = 30; // 최초 30, 이후 15
//
//        // 초기화
//        $scope.init = function () {
//
//            if ($scope.menu && $scope.menu.ETC != null) {
//                $scope.search.CATEGORY_NO = $scope.menu.ETC;
//            } else if ($scope.menu && $scope.menu.ETC == null) {
//                $scope.search.CATEGORY_NO = 999;
//            }
//
//            console.log('$stateParams.id : '+$stateParams.id)
//
//            if ($stateParams.id) {
//                $scope.showContent();
//            }
//        };
//
//        /********** 이벤트 **********/
//        // 클릭 시 영역으로 focus 이동
//        $scope.click_top = function () {
//            $('html,body').animate({scrollTop:0}, 100);
//        }
//
////        $scope.fetchNext = function() {
////            if(!$scope.busy) {
////                $scope.busy = true;
////
////                $scope.getContentList();
////            }
////        };
//
//        var isFirst = true;
//
//        // 이미지 조회
//        $scope.$parent.getContentList = function () {
//            $scope.busy = true;
//            if ($scope.$parent.reload) {
//                $scope.end = false;
//                $scope.list = [];
//                $scope.PAGE_NO = 0;
//            }
//
////            if ($scope.category != '') {
////                console.log($scope.category)
////                for (var i in $scope.category) {
////                    if ($scope.category[i] == null) $scope.category.splice(i, 1)
////                }
////                $scope.search.CATEGORY = $scope.category;
////            }
//            $scope.search.CATEGORY = [];
//
//            if ($scope.category != '') {
//                console.log($scope.category)
//                for (var i in $scope.category) {
//                    if ($scope.category[i] != null) $scope.search.CATEGORY.push($scope.category[i]);
//                }
//            }
//
//            $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
//                .then(function(data){
//
//                    for (var i in data) {
//                        if ($scope.path[2] == 'special' && i < data.length - 1 ) {
//                            if (i == 0 || data[i].DEPLOY_YMD.substr(0, 7) != data[i-1].DEPLOY_YMD.substr(0, 7)) {
//                                data[i].TYPE = 'COVER';
//                                data[i].MONTH = data[i].DEPLOY_YMD.substr(5, 2);
//                                $scope.list.push(angular.copy(data[i]));
//                            }
//                        }
//
//                        if (data[i].FILE.PATH != undefined) {
//                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
//                            data[i].TYPE = 'CONTENT';
//                            data[i].FILE = img;
//                            $scope.list.push(data[i]);
//                        }
//                    }
//
//                    $scope.$parent.reload = false;
//                    $scope.busy = false;
//                    if (isFirst) {
//                        $scope.PAGE_NO = $scope.PAGE_NO + 2;
//                        $scope.PAGE_SIZE = 15;
//                        isFirst = false;
//                    }
//
//                })
//                .catch(function(error){$scope.end = true;});
//        };
//
//        // 광고 조회
//        $scope.$parent.getAdvertList = function () {
//            $scope.getList('ad/banner', 'list', {NO:$scope.PAGE_NO, SIZE:1}, $scope.search, true)
//                .then(function(data){
////                    console.log(JSON.stringify(data));
//
//                    for (var i in data) {
//                        if (data[i].FILE.PATH != undefined) {
//                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
//                            data[i].TYPE = 'ADVERT';
//                            data[i].FILE = img;
//                            $scope.list.push(data[i]);
//                        }
//                    }
//                })
//                .catch(function(error){});
//        };
//
//        // 공감 클릭
//        $scope.click_addLike = function (idx, item) {
//            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용할 수 있습니다.', {size: 'md'});
//                return;
//            }
//
//            $scope.likeItem = {};
//            $scope.likeItem.LIKE_FL = item.LIKE_FL;
//            $scope.likeItem.TARGET_NO = item.NO;
//            $scope.likeItem.TARGET_GB = 'CONTENT';
//
//            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
//                .then(function(){
//                    var afterLike = item.LIKE_FL == 'Y' ? 'N' : 'Y';
//                    $scope.list[idx].LIKE_FL = afterLike;
//                    $scope.list[idx].LIKE_CNT = item.LIKE_FL == 'Y' ? parseInt($scope.list[idx].LIKE_CNT) + 1 : parseInt($scope.list[idx].LIKE_CNT) - 1;
//                    if (afterLike == 'Y') {
//                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
//                    } else {
//                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});
//                    }
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        };
//
//        // 콘텐츠 클릭 조회
//        $scope.click_showContentDetail = function (item) {
//            $scope.openModal(item, 'lg');
//        };
//
//        // 콘텐츠보기 모달창
//        $scope.openModal = function (content, size) {
//            var modalInstance = $modal.open({
//                templateUrl: 'partials/ange/story/storycontent-view-popup.html',
//                controller: 'storycontent-view-popup',
//                size: size,
//                scope: $scope,
//                resolve: {
//                    data: function () {
//                        return content;
//                    }
//                }
//            });
//
//            modalInstance.result.then(function () {
////                alert(JSON.stringify(approval))
//            }, function () {
//                console.log("결재 오류");
//            });
//        }
//
//        $scope.showContent = function () {
//            $scope.getItem('cms/task', 'item', $stateParams.id, {}, true)
//                .then(function(data){
//                    $scope.openModal(data, 'lg');
//                })
//                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//        }
//
////        $scope.openModal = function (content, size) {
////            var dlg = dialogs.create('partials/ange/story/storycontent-view-popup.html', 'storycontent-view-popup',
////                content, {size:size, keyboard: true, backdrop: true});
////            dlg.result.then(function(){
////
////            },function(){
////                if(angular.equals($scope.name,''))
////                    $scope.name = 'You did not enter in your name!';
////            });
////        };
//
//        $scope.init();
//        $scope.getContentList();
//        $scope.getAdvertList();
    }]);
});

