/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : product-edit.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('product-edit', ['$scope', '$stateParams', '$location', '$timeout', '$filter', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, $timeout, $filter, dialogs, UPLOAD) {

        // 파일 업로드 설정
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
        $scope.addEditor = true;

        /********** 초기화 **********/
        // 첨부파일 초기화
        $scope.queue = [];

        // 상품 초기화
        $scope.item = {};

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {}, false)
                .then(function(data){
                    $scope.category = data;

                    var category_a = [];
                    var category_b = [];

                    for (var i in data) {
                        var item = data[i];

                        if (item.CATEGORY_GB == 'STORE' && item.PARENT_NO == '1' && item.CATEGORY_ST == '0') {
                            category_a.push(item);
                        } else if (item.CATEGORY_GB == '2' && item.PARENT_NO == '73' && item.CATEGORY_ST == '0') {
                            category_b.push(item);
                        }
                    }

                    $scope.category_a = category_a;
                    $scope.category_b = category_b;
                })

            $scope.product_gb = [{value: "MILEAGE", name: "마일리지몰"}, {value: "AUCTION", name: "경매소"}, {value: "CUMMERCE", name: "커머스"}];

            $scope.item.PRODUCT_GB = $scope.product_gb[0];

            // ui bootstrap 달력
            $scope.format = 'yyyy-MM-dd';

            $scope.today = function() {
                $scope.item.START_YMD = new Date();
                $scope.item.CLOSE_YMD = new Date();
            };
            $scope.today();

//            $scope.clear = function () {
//                $scope.item.CLOSE_YMD = null;
//            };

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope[opened] = true;
            };
        };

        // CK Editor
        $scope.$on("ckeditor.ready", function( event ) {
            $scope.isReady = true;
        });

        /********** 이벤트 **********/
        // 게시판 목록 이동
        $scope.click_showProductList = function () {
            history.back();
//            $location.url('/product/list');
        };

        // 상품 조회
        $scope.getProduct = function () {
            if ($stateParams.id != 0) {
                $scope.getItem('ange/product', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $timeout(function() {
                            $scope.item = data;
                            $scope.item.STOCK_FL == 'Y' ? $scope.item.STOCK_FL = true : $scope.item.STOCK_FL = false;

                            for (var i in $scope.product_gb) {
                                if ($scope.product_gb[i].value == $scope.item.PRODUCT_GB) {
                                    $scope.item.PRODUCT_GB = $scope.product_gb[i];
                                    break;
                                }
                            }

                            for (var i in data.CATEGORY) {
                                if (data.CATEGORY[i].PARENT_NO == 1) {
                                    for (var j in $scope.category_a) {
                                        if ($scope.category_a[j].NO == data.CATEGORY[i].NO) {
                                            $scope.category_1 = $scope.category_a[j];
                                            break;
                                        }
                                    }
                                } else if (data.CATEGORY[i].PARENT_NO == 73) {
                                    for (var j in $scope.category_b) {
                                        if ($scope.category_b[j].NO == data.CATEGORY[i].NO) {
                                            $scope.category_2 = $scope.category_b[j];
                                            break;
                                        }
                                    }
                                }
                            }

                            var files = data.FILES;
                            for (var i in files) {
                                $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE","vsersion":6,"kind":files[i].FILE_GB});
                            }
                        }, 500);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 상품 저장 버튼 클릭
        $scope.click_saveProduct = function () {
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

            $scope.item.CATEGORY = [];
            if ($scope.category_1 != '') {
                $scope.item.CATEGORY.push($scope.category_1);
            }
            if ($scope.category_2 != '') {
                $scope.item.CATEGORY.push($scope.category_2);
            }

            $scope.item.START_YMD = $filter('date')($scope.item.START_YMD, 'yyyy-MM-dd');
            $scope.item.CLOSE_YMD = $filter('date')($scope.item.CLOSE_YMD, 'yyyy-MM-dd');

            if ($stateParams.id == 0) {
                $scope.insertItem('ange/product', 'item', $scope.item, false)
                    .then(function(){$location.url('/product/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            } else {
                $scope.updateItem('ange/product', 'item', $stateParams.id, $scope.item, false)
                    .then(function(){$location.url('/product/list');})
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_deleteFile = function (file) {
            $scope.updateItem('com/file', 'item', file.NO, false)
                .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});})
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

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

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getProduct)
            ['catch']($scope.reportProblems);

    }]);
});
