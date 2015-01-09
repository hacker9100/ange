/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storycontent-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storycontent-list", ['$scope', '$rootScope', '$location', '$modal', 'dialogs', 'UPLOAD', function($scope, $rootScope, $location, $modal, dialogs, UPLOAD) {

        /********** 초기화 **********/
        $scope.$parent.reload = false;
        $scope.busy = false;
        $scope.list = [];
        $scope.search = {PHASE: '30, 31', CONETNT: true};

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 12;

        // 초기화
        $scope.init = function () {
            if ($scope.menu && $scope.menu.ETC != null) {
                $scope.search.CATEGORY_NO = $scope.menu.ETC;
            }
        };

        /********** 이벤트 **********/
//        $scope.fetchNext = function() {
//            if(!$scope.busy) {
//                $scope.busy = true;
//
//                $scope.getContentList();
//            }
//        };

        // 이미지 조회
        $scope.$parent.getContentList = function () {

            if ($scope.$parent.reload) $scope.list = [];

            if ($scope.category != '') {
                for (var i in $scope.category) {
                    if ($scope.category[i] == null) $scope.category.splice(i, 1)
                }

                $scope.search.CATEGORY = $scope.category;
//                console.log(JSON.stringify($scope.search.CATEGORY)); // console_log
            }

            $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
//                    console.log(JSON.stringify(data));

                    for (var i in data) {
                        if (data[i].FILE.PATH != undefined) {
                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                            data[i].TYPE = 'CONTENT';
                            data[i].FILE = img;
                            $scope.list.push(data[i]);
                        }
                    }

//                    $scope.list = data;
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//
//
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_01.jpg', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_01.jpg', LIKE_FL: 0});
//                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_02.jpg', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
//                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_03.jpg', LIKE_FL: 1});
//                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_04.jpg', LIKE_FL: 0});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
//                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});

//                    $scope.PAGE_NO++;
                    $scope.$parent.reload = false;
                    $scope.busy = false;
                })
                .catch(function(error){});
        };

        // 광고 조회
        $scope.$parent.getAdvertList = function () {
            $scope.getList('ad/banner', 'list', {NO:$scope.PAGE_NO, SIZE:1}, $scope.search, true)
                .then(function(data){
//                    console.log(JSON.stringify(data));

                    for (var i in data) {
                        if (data[i].FILE.PATH != undefined) {
                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                            data[i].TYPE = 'ADVERT';
                            data[i].FILE = img;
                            $scope.list.push(data[i]);
                        }
                    }
                })
                .catch(function(error){});
        };

        // 콘텐츠 클릭 조회
        $scope.click_showContentDetail = function (item) {
            $scope.openModal(item, 'lg');
        };

        // 콘텐츠보기 모달창
        // 결재 모달창
        $scope.openModal = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/ange/story/storycontent-view-popup.html',
                controller: 'storycontent-view-popup',
                size: size,
                resolve: {
                    data: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
//                alert(JSON.stringify(approval))
            }, function () {
                console.log("결재 오류");
            });
        }

        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('partials/ange/story/storycontent-view-popup.html', 'storycontent-view-popup',
                content, {size:size, keyboard: true, backdrop: true});
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        $scope.init();
        $scope.getContentList();
        $scope.getAdvertList();
    }]);
});

