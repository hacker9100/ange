/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2015-01-23
 * Description : product-list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('product-list', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, CONSTANT, UPLOAD) {

        /********** 초기화 **********/
        $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

        // 탭 초기화
        $scope.tab = 0;

        // 메뉴 모델 초기화
        $scope.item = {};

        // 검색조건 초기화
        $scope.search = {PRODUCT_GB: 'MILEAGE'};

        // 카테고리 데이터
        $scope.category = [];

        // 초기화
        $scope.init = function() {
            $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'ANGE', CATEGORY_GB: '1'}, false)
                .then(function(data){
                    $scope.category = data;
                })
        };

        /********** 이벤트 **********/
        $scope.click_createProduct = function() {
            $location.url('/product/edit/0');
        };

        $scope.click_showStockProduct = function(item) {
            $scope.openStockModal(item, 'md')
        };

        $scope.click_selectTab = function (tabIdx) {
            $scope.tab = tabIdx;

            if ($scope.tab == '0') {
                $scope.search = {PRODUCT_GB: 'MILEAGE'};
            } else if ($scope.tab == '1') {
                $scope.search = {PRODUCT_GB: 'AUCTION'};
            } else if ($scope.tab == '2') {
                $scope.search = {PRODUCT_GB: 'CUMMERCE'};
            }

            $scope.getProductList();
        };

        // 조회 화면 이동
        $scope.click_showViewUser = function (key) {
            $location.url('/user/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditProduct = function (item) {
            $location.url('/product/edit/'+item.NO);
        };

        // 메뉴 수정
        $scope.click_updateMenu = function () {
            $scope.item.CATEGORY = $scope.CATEGORY;

            $scope.updateItem('admin/menu', 'menu', $scope.item.MENU_URL, $scope.item, false)
                .then(function(data){
                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                    $scope.getMenuList();
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 상품 목록 조회
        $scope.getProductList = function () {
            $scope.search.FILE = true;
            $scope.getList('ange/product', 'list', {}, $scope.search, true)
                .then(function(data){
                    $scope.list = data;

                    for (var i=0; i<data.length; i++) {
                        console.log(JSON.stringify(data[i].FILE))
                        var file = data[i].FILE;
                        for(var j in file) {
                            data[i].MAIN_FILE = UPLOAD.BASE_URL+file[j].PATH+file[j].FILE_ID;
                        }
                    }

//                    $scope.TOTAL_CNT = data[0].TOTAL_COUNT;
                })
                .catch(function(error){alert(error)});
        };


        // 재고 관리 모달창
        $scope.openStockModal = function (item, size) {
            var dlg = dialogs.create('product_stock_modal.html',
                ['$scope', '$modalInstance', '$controller', 'dialogs', 'data', function($scope, $modalInstance, $controller, dialogs, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('content', {$scope: $scope}));

                    $scope.product = data;

                    $scope.getStockList = function () {
                        $scope.getList('ange/product', 'stock', {}, {PRODUCT_NO: data.NO}, true)
                            .then(function(data){
                                $scope.list = data;
                            })
                            .catch(function(error){alert(error)});
                    };

//                    $scope.click_ok = function () {
//                        $scope.item.PRODUCT_NO = data.NO;
//
//                        $scope.insertItem('ange/product', 'stock', $scope.item, false)
//                            .then(function(){$modalInstance.close();})
//                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
//                    };

                    // 재고 관리 모달창
                    $scope.openInoutModal = function (item, size) {
                        var dlg = dialogs.create('stock_edit_modal.html',
                            ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                                /********** 공통 controller 호출 **********/
                                angular.extend(this, $controller('content', {$scope: $scope}));

//                    $scope.product = data;
//
//                    $scope.getStockList = function () {
//                        $scope.getList('ange/product', 'stock', {}, {PRODUCT_NO: data.NO}, true)
//                            .then(function(data){
//                                $scope.list = data;
//                            })
//                            .catch(function(error){alert(error)});
//                    };

                                $scope.item = data;

                                $scope.click_ok = function () {
                                    $scope.item.PRODUCT_NO = data.NO;

                                    $scope.insertItem('ange/product', 'stock', $scope.item, false)
                                        .then(function(){$modalInstance.close();})
                                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                                };

                                $scope.click_cancel = function () {
                                    $modalInstance.close();
                                };

//                    $scope.getStockList();
                            }], item, {size:size,keyboard: true,backdrop: true}, $scope);
                        dlg.result.then(function(){

                        },function(){
                            if(angular.equals($scope.name,''))
                                $scope.name = 'You did not enter in your name!';
                        });
                    };

                    $scope.click_editStock = function(item) {
                        $scope.openInoutModal(item, 'md')
                    };

                    $scope.click_deleteStock = function(item) {
                        $scope.deleteItem('ange/product', 'stock', item.NO, false)
                            .then(function(){$scope.getStockList();})
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.getStockList();
                }], item, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };



        /********** 화면 초기화 **********/
//        $scope.getSession()
//            .then($scope.sessionCheck)
////            .then($scope.permissionCheck)
//            .catch($scope.reportProblems);

        $scope.init();
        $scope.getProductList();
    }]);
});
