/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peoplephoto-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangeorderlist', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징(마일리지 & 경매소)
        $scope.MILEAGE_PAGE_NO = 1;
        $scope.MILEAGE_PAGE_SIZE = 5;
        $scope.MILEAGE_TOTAL_COUNT = 0;

        // 페이징(커머스)
        $scope.CUMMERCE_PAGE_NO = 1;
        $scope.CUMMERCE_PAGE_SIZE = 5;
        $scope.CUMMERCE_TOTAL_COUNT = 0;

        // 네이밍
        $scope.NAMING_PAGE_NO = 1;
        $scope.NAMING_PAGE_SIZE = 5;
        $scope.NAMING_TOTAL_COUNT = 0;

        $scope.search = {};

        $scope.item = {};

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "작성자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        // 제이쿼리
        $(function () {
            //$("#start_dt").datepicker();
            //$("#start_dt").datepicker({ dateFormat: 'yy-mm-dd' });
        });

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.community = '주문/구매 현황';

        };

        /********** 화면 초기화 **********/
            //$scope.init();

            // 게시판 목록 조회
        $scope.getMileageList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'MILEAGE';

            $scope.getList('ange/order', 'list', {NO: $scope.MILEAGE_PAGE_NO-1, SIZE: $scope.MILEAGE_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.MILEAGE_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.MILEAGE_TOTAL_COUNT = '+$scope.MILEAGE_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.mileagelist = data;
                })
                ['catch'](function(error){$scope.mileagelist = ""; $scope.MILEAGE_TOTAL_COUNT = 0});
        };

        // 게시판 목록 조회
        $scope.getCummerceList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'CUMMERCE';

            $scope.getList('ange/order', 'list', {NO: $scope.CUMMERCE_PAGE_NO-1, SIZE: $scope.CUMMERCE_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.CUMMERCE_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.CUMMERCE_TOTAL_COUNT = '+$scope.CUMMERCE_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.cummercelist = data;
                })
                ['catch'](function(error){$scope.cummercelist = ""; $scope.CUMMERCE_TOTAL_COUNT = 0});
        };

        // 게시판 목록 조회
        $scope.getNamingList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.search.ORDER_GB = 'NAMING';

            $scope.getList('ange/order', 'list', {NO: $scope.NAMING_PAGE_NO-1, SIZE: $scope.NAMING_PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.NAMING_TOTAL_COUNT = search_total_cnt;

                    //alert('$scope.NAMING_TOTAL_COUNT = '+$scope.NAMING_TOTAL_COUNT);

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.naminglist = data;
                })
                ['catch'](function(error){$scope.naminglist = ""; $scope.NAMING_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동(마일리지 & 경매소)
        $scope.click_showStoreView = function (product_gb, key) {

            if(product_gb == 'MILEAGE'){
                $location.url('/store/mileagemall/view/'+key);
            }else if(product_gb == 'AUCTION'){
                $location.url('/store/auction/view/'+key);
            }else if(product_gb == 'CUMMERCE'){
                $location.url('/store/cummerce/view/'+key);
            }
        };

        // 네이밍 상세 화면 이동
        $scope.click_showNamingView = function (key){
            $location.url('/store/naming/request/'+key);
        }

        // 상태변경
        $scope.click_counsel = function (item){
            $scope.openCounselModal(item, 'lg');
        }

        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('order_counsel.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = item;
                    $scope.search = {};

                    $scope.showDetails = false;

                    // 파일 업로드 설정
                    $scope.options = { url: UPLOAD.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                    // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
                    $scope.addEditor = false;
                    $scope.checkAll = false;

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

                    $(document).ready(function() {

                        /*// radio change 이벤트
                        $("input[name='counsel']").change(function() {

                            var radioValue = $(this).val();

                            console.log('radioValue = '+radioValue);


                        });*/
                        $("#product_notice").hide();

                    });

                    $scope.productnoList = function(){
                        $scope.getList('ange/order', 'productnolist', {}, {}, true)
                            .then(function(data){
                                $scope.productnolist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnolist.length; i++){

                                    if(JSON.stringify(item.PRODUCT_CODE) == JSON.stringify($scope.productnolist[i].PRODUCT_CODE)){
                                        idx = i;
                                    }
                                }
                                item.PRODUCT_CODE = $scope.productnolist[idx];

                                $scope.searchProductNm(item.PRODUCT_CODE);


                            })
                            ['catch'](function(error){$scope.productnolist = "";});
                    }


                    $scope.searchProductNm = function(productno){

                        $scope.search.PRODUCT_CODE = productno;
                        $scope.getList('ange/order', 'productnmlist', {}, $scope.search, true)
                            .then(function(data){
                                $scope.productnmlist = data;

                                var idx = 0;
                                for(var i =0; i<$scope.productnmlist.length; i++){

                                    if(JSON.stringify(item.PRODUCT_NO) == JSON.stringify($scope.productnmlist[i].PRODUCT_NO)){
                                        idx = i;
                                    }
                                }

                                console.log($scope.productnmlist[idx].PRODUCT_NO);

                                $scope.item.PRODUCT = $scope.productnmlist[idx];

                            })
                            ['catch'](function(error){$scope.productnmlist = "";});
                    }

                    $scope.namingnoList = function(){
                        $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                            .then(function(data){
                                $scope.namingnolist = data;
                            })
                            ['catch'](function(error){$scope.namingnolist = "";});
                    }

                    $scope.radio_change = function (value){
                        if (value == "9" || value == "10" || value == "11" || value == "12" || value == "13") {
                            $("#product_info").hide();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "1" || value == "2" || value == "3" || value == "4" || value == "6" || value == "8") {
                            $("#product_info").show();
                            $("#product_change").hide();
                            $("#product_notice").hide();
                            $(".product_note").show();
                        } else if (value == "7") {
                            $("#product_info").show();
                            $("#product_change").show();
                            $(".product_note").hide();
                            $("#product_notice").show();
                        }
                    }

                    $scope.item.FILES = $scope.queue;

                    $scope.click_savecounsel = function (){

                        for(var i in $scope.item.FILES) {
                            $scope.item.FILES[i].$destroy = '';
                            $scope.item.FILES[i].$editor = '';
//                $scope.item.FILES[i].$submit();
                        }

                        console.log($scope.item);

                        if($scope.item.ORDER_GB == 'NAMING'){
                            $scope.insertItem('ange/counsel', 'item', $scope.item, false)
                                .then(function(){
                                    alert('해당 상품 신청화면으로 이동합니다');
                                    $modalInstance.close();
                                    $location.url('/store/naming/request/'+$scope.item.CHANGE_PRODUCT.NO);

                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }else{
                            $scope.insertItem('ange/counsel', 'item', $scope.item, false)
                                .then(function(){
                                    dialogs.notify('알림', '신청이 완료되었습니다. 나의 변경신청에서 확인하실 수 있습니다', {size: 'md'});
                                    $modalInstance.close();
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.productnoList();
                    $scope.namingnoList();

                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.getPeopleBoardList();
        }

        // 주문취소
        $scope.click_cancel = function (item){

            var dialog = dialogs.confirm('알림', '주문취소를 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.item.ORDER_ST = 1;
                $scope.item.PRODUCT_NO = item.PRODUCT_NO;
                $scope.item.PRODUCT_NM = item.PRODUCT_NM;
                $scope.item.PRICE = item.SUM_PRICE;
                $scope.item.PRODUCT_CNT = item.PRODUCT_CNT;
                $scope.item.PRODUCT_CODE = item.PRODUCT_CODE;

                $scope.updateItem('ange/order', 'item', item.NO, $scope.item, false)
                    .then(function(data){
                        dialogs.notify('알림', '주문취소 되었습니다.', {size: 'md'});
                        //$scope.getPeopleBoardList();

                        $scope.getMileageList();
                        $scope.getCummerceList();
                        $scope.getNamingList();

                        //$rootScope.mileage = data.mileage;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        $scope.pageMileageChanged = function() {
            console.log('Page changed to: ' + $scope.MILEAGE_PAGE_NO);
            $scope.getMileageList();
        };

        $scope.pageCummerceChanged = function() {
            console.log('Page changed to: ' + $scope.PHOTO_PAGE_NO);
            $scope.getCummerceList();
        };

        $scope.pageNamingChanged = function() {
            console.log('Page changed to: ' + $scope.CLINIC_PAGE_NO);
            $scope.getNamingList();
        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMileageList)
            .then($scope.getCummerceList)
            .then($scope.getNamingList)
            ['catch']($scope.reportProblems);


//        $scope.init();
//        $scope.getMileageList();
//        $scope.getCummerceList();
//        $scope.getNamingList();

    }]);
});
