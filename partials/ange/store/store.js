/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storemall-intro.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storeauction-intro', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {

        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('storeauction-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD','CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD,CONSTANT) {

        $scope.selectIdx = 0;

        $scope.search = {};
        $scope.item= {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.productsList = [];


        $scope.list = [];
        $scope.prevlist = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.click_showPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "상품명", value: "PRODUCT_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        var d = new Date();

        // 현재 시간
        var hour = d.getHours();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        $scope.search.PRODUCT_GB = 'AUCTION';
        $scope.search.SOLD_OUT = 'N';
        $scope.menu = 'auction';

        // 초기화
        $scope.init = function(session) {

            $scope.selectIdx = 'ALL';
            /*         if($rootScope.uid == '' || $rootScope.uid == null){
             dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
             $location.url('/store/home');
             }*/


            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    //$scope.list = data;
                })
                ['catch'](function(error){
                //$scope.list = "";
                $scope.TOTAL_COUNT = 0;
            });
        };

        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        /********** 이벤트 **********/
        $scope.click_showStoreAuctionList = function(){
            $scope.search.FILE = true;
            //$scope.search.ORDER_YN = 'N';
            $scope.search.PROCESS = 'Y';
            $scope.search.PAST = '';


            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){

                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    if(data[0].DIRECT_PRICE == null){
                        $scope.item.DIRECT_PRICE = 0;
                    }

                    if(data[0].AUCTION_AMOUNT == null){
                        $scope.item.AUCTION_AMOUNT = 0;
                    }

                    $scope.item = data[0];

                    for(var i in data) {

                        if (data[i].FILE != null) {
                            var img = CONSTANT.BASE_URL + '/storage/product/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                            data[i].MAIN_FILE = img;

                            $scope.item.MAIN_FILE = img;

                        }
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT=0;});
        }


        // 지난 공구 게시판 목록
        $scope.click_showStorePastBoardList = function () {

            $scope.search.FILE = true;
            $scope.search.PAST = 'Y';
            $scope.search.PROCESS = '';

            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {

                        data[i].PRICE  = data[i].PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        console.log(data[i].PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));

//                        if (data[i].FILE != null) {
//
//
//                        }

                        var img = CONSTANT.BASE_URL + '/storage/product/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].MAIN_FILE = img;

                        $scope.prevlist.push(data[i]);
                    }

                    /*$scope.total(total_cnt);*/
                    //$scope.prevlist = data;
                })
                ['catch'](function(error){$scope.prevlist = ""; $scope.SEARCH_TOTAL_COUNT = 0;});

        };

        /********** 이벤트 **********/
            // 탭 클릭 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            if ($stateParams.menu == 'auction') {
                $scope.search.PRODUCT_GB = 'AUCTION';
            }

            if(idx == 0){
                $scope.search.PRODUCT_TYPE = 'ALL';
                $scope.selectPhoto = 'ALL';
            }else{
                $scope.search.PRODUCT_TYPE = $scope.selectIdx;
            }

            $scope.click_showPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 지난 공구 게시판 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.click_showPeopleBoardList();
        }


        // 경매 참여
        $scope.click_auction = function (item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }


            console.log(hour);
            if(hour < 10 || 15 <= hour){
                dialogs.notify('알림', '경매 참여 시간이 아닙니다.', {size: 'md'});
                return;
            }

            $scope.item.NO = item;
            $scope.insertItem('ange/auction', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 참여했습니다.', {size: 'md'});

                    $scope.click_showStoreAuctionList();
                    $scope.click_showPeopleBoardList();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //즉시 구매
        $scope.click_addcart = function (list){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if(hour < 10 || 15 < hour){
                dialogs.notify('알림', '구매 시간이 아닙니다.', {size: 'md'});
                return;
            }

            $scope.search.NO = list[0].NO;

            $scope.getList('ange/auction', 'ordercheck', {}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;


                    if(total_cnt > 0){
                        alert('이미 즉시구매가 완료되었습니다');
                    } else {
                        console.log(list[0].DIRECT_PRICE);

                        $scope.productsList.push({"MAIN_FILE": list[0].MAIN_FILE, "PRODUCT_NO" : list[0].NO, "PRODUCT_NM" : list[0].PRODUCT_NM , "PRICE" : list[0].DIRECT_PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : list[0].DIRECT_PRICE, "DELIVERY_PRICE" : list[0].DELIVERY_PRICE, "DELIVERY_ST" : list[0].DELIVERY_ST, "PRODUCT_GB" : list[0].PRODUCT_GB});

                        $scope.item.CART = $scope.productsList;

                        $scope.insertItem('ange/cart', 'item', $scope.item, false)
                            .then(function(){
                                //dialogs.notify('알림', '장바구니에 등록되었습니다. 계속 쇼핑 하시겠습니까?', {size: 'md'});
                                //$scope.openViewScrapModal($scope.item.CART, 'lg');

                                alert('장바구니로 이동합니다.');

                                $location.url('store/cart/list/'+$stateParams.menu);
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});


        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_showStoreAuctionList)
            .then($scope.click_showStorePastBoardList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//        $scope.click_showStoreAuctionList();
//        $scope.click_showPeopleBoardList();

    }]);

    controllers.controller('storeauction-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD','CONSTANT', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        $scope.productsList = [];
        $scope.product = {};

        $scope.selectIdx = 1;

        var d = new Date();

        // 현재 시간
        var hour = d.getHours();
//        console.log(d.getHours());
//        console.log(d.getMinutes());
//        console.log(d.getSeconds());

        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            $("#tabs-"+idx)[0].scrollIntoView();  // O, jQuery  이용시
        };

        // 초기화
        $scope.init = function(session) {

            $scope.community = "마일리지 경매소";
            $scope.menu = 'auction';
            $scope.TOTAL_MILEAGE = 0;
            $scope.TOTAL_PRICE = 0;


            $scope.tabs =  [{title: '상품안내'},{title: '상품후기'},{title: '관련상품'},{title: '주의사항'}];

        };

        // 상품 추가
        $scope.addProductList = function (products, item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                return;
            }

            if(products.NO == null){
                $scope.productsList = [];
            }else{
                $scope.product.CNT = 1;

                // TOTAL_PRICE 경매 가격으로 으로 데이터 넣음
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : item.AUCTION_AMOUNT, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
                // , "RECEIPTOR_NM" : $rootScope.user_info.USER_NM, "RECEIPT_ADDR" :$rootScope.user_info.ADDR, "RECEIPT_ADDR_DETAIL" : $rootScope.user_info.ADDR_DETAIL, "RECEIPT_PHONE" : $rootScope.user_info.PHONE_2
            }
        }

        // 체크박스일때 상품 추가
        $scope.addcheckboxProductList = function (products, item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
                $("#checkProduct").attr("checked",false);
                return;
            }

//            if($("#checkProduct").is(":checked")){
//                $scope.product.CNT = 1;
//                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB, "SUM_IN_OUT" : item.SUM_IN_OUT});
//            }else{
//                $scope.productsList = [];
//            }
            $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
        }

//        $(document).ready(function(){
//
//            $("#checkProduct").click(function(){
//                if(!$("#checkProduct").is(":checked")){
//                    $scope.addProductList($scope.item, $scope.item);
//                }else{
//                    $scope.productsList = [];
//                    //$("#checkProduct").attr("checked", false);
//                }
//
//            });
//        });

        // 상품 삭제
        $scope.click_removeProduct = function (idx) {
            $scope.productsList.splice(idx, 1);
            $("#checkProduct").attr("checked", false);
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/product', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        var files = data.FILES;
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.products = data.PRODUCTS;

                        $scope.item = data;

                        $scope.PRICE = data.PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        $scope.DELIVERY_PRICE = data.DELIVERY_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        $scope.DIRECT_PRICE = data.DIRECT_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");


                        if($scope.products == null){
                            $scope.checkboxproduct = 'Y';
                            $scope.addcheckboxProductList($scope.item, $scope.item);
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 경매 참여
        $scope.click_auction = function (item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if(hour < 10 || 15 < hour){
                dialogs.notify('알림', '경매 참여 시간이 아닙니다.', {size: 'md'});
                return;
            }

            $scope.item.NO = item;
            $scope.insertItem('ange/auction', 'item', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 참여했습니다.', {size: 'md'});
                    $scope.getPeopleBoard();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //찜
        $scope.click_addcart = function (){

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){
//                    alert('찜목록으로 이동합니다');
//                    $location.url('store/cart/list/'+$stateParams.menu);
                    if (confirm("장바구니에 등록되었습니다. 장바구니로 이동하시겠습니까?") == true){    //확인
                        $location.url('store/cart/list');
                    }else{   //취소
                        return;
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        //즉시 구매
        $scope.click_adddirectcart = function (list){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 경매 참여가 가능합니다.', {size: 'md'});
                return;
            }

            if(hour < 10 || 15 < hour){
                dialogs.notify('알림', '구매 시간이 아닙니다.', {size: 'md'});
                return;
            }

            // TOTAL_PRICE 즉시 구매 가격으로 데이터 넣음
            $scope.productsList.push({"MAIN_FILE": list.MAIN_FILE, "PRODUCT_NO" : list.NO, "PRODUCT_NM" : list.PRODUCT_NM , "PRICE" : list.DIRECT_PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : list.DIRECT_PRICE, "DELIVERY_PRICE" : list.DELIVERY_PRICE, "DELIVERY_ST" : list.DELIVERY_ST, "PRODUCT_GB" : list.PRODUCT_GB});

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){
//                    alert('찜목록으로 이동합니다');
//                    $location.url('store/cart/list/'+$stateParams.menu);
                    if (confirm("장바구니에 등록되었습니다. 장바구니로 이동하시겠습니까?") == true){    //확인
                        $location.url('store/cart/list');
                    }else{   //취소
                        return;
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 전체 금액 계산
        $scope.addSumPrice = function(price, cnt, index){
            $scope.productsList[index].TOTAL_PRICE += price * cnt;

        }

        // 전체 합계
        $scope.total = function() {

            var total = 0;
            angular.forEach($scope.productsList, function(item) {
                total += item.PRODUCT_CNT * item.PRICE;
            })

            return total;
        }

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        }


        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            ['catch']($scope.reportProblems);
//        $scope.init();
//        $scope.getPeopleBoard();

    }]);

    controllers.controller('storecart-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD,CONSTANT) {

        $scope.returnPayment = function (ret, val) {
//            $scope.frameName = 'pay';
            $scope.frameUrl = 'about:blank';

            if (ret) {
                alert(ret);
                $scope.ORDER_NO = $scope.item.ORDER_NO = val;
//                $scope.saveOrder();
            }
        }

        $scope.search = {};
        $scope.item = {};
        $scope.sumitem = {};

//        $scope.mileage = true;
//        $scope.cummerce = false;

        $scope.product_gb = 'cummerce';
//        $scope.product_gb = 'mileagemall';
        /*
         $(document).ready(function() {

         $("input:radio:first").prop("checked", true).trigger("click");
         $(".product_gb").click(function() {

         if($(this).val() == "mileage"){
         $scope.mileage = true;
         $scope.cummerce = false;
         } else if ($(this).val() == "cummerce"){
         $scope.mileage = false;
         $scope.cummerce = true;
         }
         });
         });

         $(function(){
         $scope.click_cartlist = function(){
         //alert('');

         $('input[name="cartlist"]').change(function(){
         if($(this).val() == "mileage"){
         $scope.mileage = true;
         $scope.cummerce = false;
         } else if ($(this).val() == "cummerce"){
         $scope.mileage = false;
         $scope.cummerce = true;
         }
         });
         }

         $(':radio[name="cartlist"]').click(function(){
         //alert('aaaaa');
         var gubun = $(':radio[name="cartlist"]:checked').val();
         if(gubun == 'mileage'){
         $scope.mileage = true;
         $scope.cummerce = false;
         }else{
         $scope.mileage = false;
         $scope.cummerce = true;
         }
         });
         });
         */
        /*
         $scope.click_cartlist = function(){
         //alert('aaaaa');

         $('input[name="cartlist"]').change(function(){
         if($(this).val() == "mileage"){
         $scope.mileage = true;
         $scope.cummerce = false;
         } else if ($(this).val() == "cummerce"){
         $scope.mileage = false;
         $scope.cummerce = true;
         }
         });
         }
         */

        /*
         $scope.click_mileageall = function(){
         //클릭되었으면
         if($("#checkmileageall").is(":checked")){
         //alert();
         $(".checkmileage").prop("checked",true);
         }else{ //클릭이 안되있으면
         $(".checkmileage").prop("checked",true);
         }
         }
         */

        // 초기화
        $scope.init = function() {

            $scope.item.CART = $scope.productsList;

            $scope.step = '01';
            $scope.community = "장바구니";

            $rootScope.info = {};

            // 마일리지몰 수량수정
//            if($rootScope.mileagecartlist != ''){
//
//                $scope.sumitem.CART = $rootScope.mileagecartlist;
//
//                $scope.insertItem('ange/order', 'sumitem', $scope.sumitem, false)
//                    .then(function(){
//                    })
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            }
//
//            // 커머스 수량수정
//            if($rootScope.cummercecartlist != ''){
//
//                $scope.sumitem.CART = $rootScope.cummercecartlist;
//
//                $scope.insertItem('ange/order', 'sumitem', $scope.sumitem, false)
//                    .then(function(){
//                    })
//                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
//            }

        };

        // 우편번호 검색
        $scope.click_openDaumPostcode = function () {

            new daum.Postcode({
                oncomplete: function(data) {
                    var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');

                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 우편번호와 주소 정보를 해당 필드에 넣고, 커서를 상세주소 필드로 이동한다.
                    $scope.item.RECEIPT_ZIP_CODE1 = document.getElementById('receipt_post_1').value = data.postcode1;
                    $scope.item.RECEIPT_ZIP_CODE2 = document.getElementById('receipt_post_2').value = data.postcode2;
                    $scope.item.RECEIPT_ADDR = document.getElementById('receipt_addr').value = addr;
//                        $scope.user.ADDR = document.getElementById('addr').value = data.address;

                    //전체 주소에서 연결 번지 및 ()로 묶여 있는 부가정보를 제거하고자 할 경우,
                    //아래와 같은 정규식을 사용해도 된다. 정규식은 개발자의 목적에 맞게 수정해서 사용 가능하다.
                    //var addr = data.address.replace(/(\s|^)\(.+\)$|\S+~\S+/g, '');
                    //document.getElementById('addr').value = addr;

                    document.getElementById('receipt_addr_detail').focus();
                }
            }).open();
        };

        // 마일리지 장바구니 리스트
        $scope.cartList = function (){

            $scope.getList('ange/cart', 'list', {}, {FILE: true, PRODUCT_GB: 'mileage'}, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    $scope.sum_price = 0;
                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                        $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                    }
                    //$scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);
                    $scope.total_mileage2 = parseInt($rootScope.mileage - $scope.sum_price);
                    console.log('$scope.total_mileage2 = '+$scope.total_mileage2);

                    $scope.mileagelist = data;
                })
                ['catch'](function(error){$scope.mileagelist = ""; $scope.TOTAL_COUNT = 0;});
        }

        // 커머스 장바구니 리스트
        $scope.cartCummerceList = function (){

            $scope.getList('ange/cart', 'list', {}, {FILE: true, PRODUCT_GB: 'cummerce'}, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    $scope.sum_price = 0;
                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                        $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                    }
                    //$scope.total_mileage = parseInt($rootScope.mileage - $scope.sum_price);

                    $scope.cummercelist = data;
                })
                ['catch'](function(error){$scope.cummercelist = ""; $scope.TOTAL_COUNT = 0;});

        }

        $scope.click_sumprice = function(product_gb, idx){

            $scope.sum_price = 0;
            $scope.total_mileage = 0;

            $scope.mileage_gb = product_gb;

            $("input[name='name[]']:checked").each(function(index) {
                $scope.mileage_open = 'Y';
                $scope.sum_price += parseInt($scope.mileagelist[index].TOTAL_PRICE);
            });

            if($scope.sum_price == 0){
                $scope.mileage_open = 'N';
            }

            console.log($scope.sum_price);
            $scope.total_mileage = parseInt($rootScope.mileage - $scope.sum_price);

        }

        // 선택 상품 삭제
        $scope.click_removeCartProduct = function (product_gb, list, idx){

            var no = list[idx].NO;
            $scope.CART_NO = no;

            var no = list[idx].NO;
            $scope.CART_NO = no;

            var dialog = dialogs.confirm('알림', '선택 상품을 삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                    .then(function(){
                        if(product_gb == 'mileagemall'){
                            $scope.mileagelist.splice(idx, 1);
                        }else if(product_gb == 'cummerce'){
                            $scope.cummercelist.splice(idx, 1);
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 커머스 상품 선택해서 주문
        $scope.click_cummerce_reg = function (list , idx){

            $rootScope.orderlist = [];
            $rootScope.orderlist.push(list[idx]);

            $scope.item.PAY_GB = 'CREDIT';
            $scope.step = '02';
            $scope.orderlist();
        }

        // 선택 상품 주문
        $scope.click_select_reg = function(list, mileage_gb){

            var idx = 0;
            var count = $("input:checkbox[name='name[]']:checked").length;

            if(count == 0){
                dialogs.notify('알림', '상품을 선택해 주세요', {size: 'md'});
                return;
            }

            if(mileage_gb == 'MILEAGE'){
                if($scope.total_mileage < 0){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $rootScope.orderlist = [];
            for(var i =0; i<list.length; i++){

                if($("input:checkbox[id='name"+i+"']").is(":checked")){
                    idx = i;
                    $rootScope.orderlist.push(list[idx]);
                }
            }


            $scope.step = '02';
            $scope.createProductCode();
            $scope.orderlist();
        }

        // 전체 상품 주문
        $scope.click_reg = function (list,mileage_gb){

            $rootScope.orderlist = list;

            console.log('mileage_gb = '+mileage_gb);
            if(mileage_gb == 'MILEAGE'){
                if($scope.total_mileage2 < 0){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $scope.step = '02';
            $scope.createProductCode();
            $scope.orderlist();
        }

        // 주문코드 생성
        $scope.createProductCode = function (){

            // 상품 코드 생성
            $scope.getItem('ange/order', 'productcode', {}, {}, false)
                .then(function(data) {
                    $scope.item.PRODUCT_CODE = data.PRODUCT_CODE;
                    $rootScope.PRODUCT_CODE = data.PRODUCT_CODE;
                })
                ['catch'](function(error){alert(error)});
        }

        // 주문리스트
        $scope.orderlist = function (){

            $scope.list = $rootScope.orderlist;

            console.log($rootScope.orderlist);
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                    .then(function(data){

                        $rootScope.info = data;

                        $scope.item.ZIP_CODE1 = data.ZIP_CODE.substr(0,3);
                        $scope.item.ZIP_CODE2 = data.ZIP_CODE.substr(3,3);

                        $scope.item.RECEIPTOR_NM1 = data.USER_NM;
                        $scope.item.RECEIPT_PHONE1 = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR1 = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL1 = data.ADDR_DETAIL;

                        $scope.item.RECEIPT_ZIP_CODE1 = $scope.item.ZIP_CODE1;
                        $scope.item.RECEIPT_ZIP_CODE2 = $scope.item.ZIP_CODE2;

                        $scope.item.USER_ID = data.USER_ID;
                        $scope.item.RECEIPTOR_NM = data.USER_NM;
                        $scope.item.RECEIPT_PHONE = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL = data.ADDR_DETAIL;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }

            $scope.TOTAL_SUM_PRICE = 0;
            $scope.TOTAL_DELIVERY_PRICE = 0;
            $rootScope.TOTAL_PRICE = 0;
            for(var i=0; i<$scope.list.length; i++){

                console.log($scope.list[i].TOTAL_PRICE);
                if($scope.list[i].PRODUCT_GB == 'MILEAGE' || $scope.list[i].PRODUCT_GB == 'CUMMERCE' ){
                    $scope.TOTAL_SUM_PRICE += parseInt($scope.list[i].TOTAL_PRICE);

                    console.log('aaa = '+$scope.TOTAL_SUM_PRICE);
                }else if($scope.list[i].PRODUCT_GB == 'AUCTION'){
                    $scope.TOTAL_SUM_PRICE += parseInt($scope.list[i].DIRECT_PRICE);
                }
                $scope.TOTAL_DELIVERY_PRICE = parseInt($scope.list[i].DELIVERY_PRICE);
                $scope.DELIVERY_ST = $scope.list[i].DELIVERY_ST;
            }

            if($scope.DELIVERY_ST == 2){
                $rootScope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE) + parseInt($scope.TOTAL_DELIVERY_PRICE);
            } else {
                $rootScope.TOTAL_PRICE = parseInt($scope.TOTAL_SUM_PRICE);
            }
        }

        // 이전페이지
        $scope.prev_step = function (){
            $scope.step = 1;
        }

        // 사용자 기존 정보 or 새주소
        $scope.click_basic = function(val){
            if(val == 'Y'){
                $scope.item.USER_ID = $rootScope.info.USER_ID;
                $scope.item.RECEIPTOR_NM = $rootScope.info.USER_NM;
                $scope.item.RECEIPT_PHONE = $rootScope.info.PHONE_2;
                $scope.item.RECEIPT_ADDR = $rootScope.info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.info.ADDR_DETAIL;

                $scope.item.RECEIPTOR_NM1 = $rootScope.info.USER_NM;
                $scope.item.RECEIPT_PHONE1 = $rootScope.info.PHONE_2;
                $scope.item.RECEIPT_ZIP_CODE1 = $rootScope.info.ZIP_CODE.substr(0,3);
                $scope.item.RECEIPT_ZIP_CODE2 = $rootScope.info.ZIP_CODE.substr(3,3);
                $scope.item.RECEIPT_ADDR1 = $rootScope.info.ADDR;
                $scope.item.RECEIPT_ADDR_DETAIL1 = $rootScope.info.ADDR_DETAIL;
            }else if(val == 'N'){
                $scope.item.USER_ID = '';
                $scope.item.RECEIPTOR_NM = '';
                $scope.item.RECEIPT_PHONE = '';
                $scope.item.RECEIPT_ZIP_CODE1 = '';
                $scope.item.RECEIPT_ZIP_CODE2 = '';
                $scope.item.RECEIPT_ADDR = '';
                $scope.item.RECEIPT_ADDR_DETAIL = '';
            }
        }

        $scope.click_mileagehome = function(){
            $location.url('/store/mileagemall/list');
        }

        $scope.click_cummercehome = function (){
            $location.url('/store/cummerce/list');
        }

        // 주문하기
        $scope.click_order = function (){
            $scope.item.ORDER = $scope.list;
            console.log($scope.item);

            var total_price = 0;
            if($scope.item.ORDER[0].DELIVERY_ST == 2){
                total_price = parseInt($scope.item.ORDER[0].DELIVERY_PRICE) + parseInt($scope.item.ORDER[0].TOTAL_PRICE);
                $scope.item.ORDER[0].TOTAL_PRICE = total_price;
            }else{
                total_price = parseInt($scope.item.ORDER[0].TOTAL_PRICE);
            }

            if ($scope.product_gb == 'mileagemall') {
                $scope.saveOrder();
            } else if ($scope.product_gb == 'cummerce') {
                var pay_gb = '';

                if($scope.item.PAY_GB == "CREDIT"){
                    pay_gb = 11;
                }else if($scope.item.PAY_GB == "NOBANKBOOK"){
                    pay_gb = 22;
                }

                $scope.frameName = 'pay';
                $scope.frameUrl = '/easypay70_plugin_php_window/web/normal/order.php?EP_tr_cd?=00101000&EP_user_id='+$scope.item.USER_ID+'&EP_user_nm='+$scope.item.RECEIPTOR_NM+'&EP_order_no='+$scope.item.ORDER[0].NO+'&EP_product_nm='+$scope.item.ORDER[0].PRODUCT_NM+
                    '&EP_product_amt='+total_price+'&EP_user_mail='+$rootScope.user_info.EMAIL+'&EP_user_phone1='+$rootScope.user_info.PHONE_1+'&EP_user_phone2='+$scope.item.RECEIPT_PHONE+'&EP_user_addr='+$scope.item.RECEIPT_ADDR+' '+$scope.item.RECEIPT_ADDR_DETAIL+'&EP_pay_type='+pay_gb;
            }

//            var pay_gb = '';
//
//            if($scope.item.PAY_GB == "CREDIT"){
//                pay_gb = 11;
//            }else if($scope.item.PAY_GB == "NOBANKBOOK"){
//                pay_gb = 22;
//            }
//            // /easypay70_plugin_php_window/web/normal/order.php
//            // /easypay70_plugin_php_window/web/easypay_request.php
//            var popUrl = CONSTANT.BASE_URL+"/easypay70_plugin_php/web/normal/order.php?EP_tr_cd?=00101000&EP_user_id="+$scope.item.USER_ID+"&EP_user_nm="+$scope.item.RECEIPTOR_NM+"&EP_order_no="+$scope.item.ORDER[0].PRODUCT_NO+"&EP_product_nm="+$scope.item.ORDER[0].PRODUCT_NM+
//                           "&EP_product_amt="+total_price+"&EP_user_mail="+$rootScope.user_info.EMAIL+"&EP_user_phone1="+$rootScope.user_info.PHONE_1+"&EP_user_phone2="+$scope.item.RECEIPT_PHONE+"&EP_user_addr="+$scope.item.RECEIPT_ADDR+"&EP_pay_type="+pay_gb;
//                	//팝업창에 출력될 페이지 URL
////
//////            var popUrl = "http://localhost/easypay70_plugin_php_window/web/easypay_request.php?EP_user_id="+$scope.item.USER_ID+"&EP_user_nm="+$scope.item.RECEIPTOR_NM+"&EP_order_no="+$scope.item.ORDER[0].PRODUCT_NO+"&EP_product_nm="+$scope.item.ORDER[0].PRODUCT_NM+
//////                "&EP_product_amt="+total_price+"&EP_user_mail="+$rootScope.user_info.EMAIL+"&EP_user_phone1="+$rootScope.user_info.PHONE_1+"&EP_user_phone2="+$scope.item.RECEIPT_PHONE+"&EP_user_addr="+$scope.item.RECEIPT_ADDR+"&EP_pay_type="+pay_gb;
////
//            var popOption = "width=950, height=900, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
//            window.open(popUrl+"","",popOption);
        }

        // 상품 주문 등록
        $scope.saveOrder = function() {
            $scope.insertItem('ange/order', 'item', $scope.item, false)
                .then(function(data){
                    $scope.step = '03';
                    $rootScope.REQUEST_NOTE = $scope.item.REQUEST_NOTE;

//                    if($scope.item.PAY_GB == 'CREDIT'){
//                        $("#pay_info_gb1").attr("checked",true);
//                        $("#pay_info_gb2").attr("checked",false);
//                    } else if($scope.item.pay_gb == 'NOBANKBOOK'){
//                        $("#pay_info_gb1").attr("checked",false);
//                        $("#pay_info_gb2").attr("checked",true);
//                    }
//
//                    $scope.PAY_INFO = $scope.item.PAY_GB;

                    $rootScope.mileage = data.mileage;
                    $scope.orderlist();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_update_user_info = function () {
            $scope.openModal(null, 'md');
        };

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    $scope.item = {};

                    $scope.user_info = function () {
                        $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                            .then(function(data){

//                                $scope.item.USER_ID = data.USER_ID;
//                                $scope.item.USER_NM = data.USER_NM;
//                                $scope.item.NICK_NM = data.NICK_NM;
//                                $scope.item.ADDR = data.ADDR;
//                                $scope.item.ADDR_DETAIL = data.ADDR_DETAIL;
//                                $scope.item.REG_DT = data.REG_DT;
//                                $scope.item.REG_DT = data.REG_DT;
//                                $scope.item.PHONE_1 = data.PHONE_1;
//                                $scope.item.PHONE_2 = data.PHONE_2;
//                                $scope.item.BLOG_URL = data.BLOG_URL;

                                $scope.item = data;

                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $(document).ready(function(){
                        $('#birth_dt').css('display', 'none');

                        $("#preg_Y").click(function(){
                            if(!$("#preg_Y").is(":checked")){
                                $scope.item.PREGNENT_FL = "Y";
                                $('#birth_dt').css('display', 'block');
                            }
                        });

                        $("#preg_N").click(function(){
                            if(!$("#preg_N").is(":checked")){
                                $scope.item.PREGNENT_FL = "N";
                                $('#birth_dt').css('display', 'none');
                            }
                        });
                    });

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';
                        $scope.item.USER_NM = $scope.name;
                        $scope.item.NICK_NM = $scope.nick;

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

                    $scope.user_info();

                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $rootScope.info = data;

                        $scope.item.USER_ID = data.USER_ID;
                        $scope.item.RECEIPTOR_NM = data.USER_NM;
                        $scope.item.RECEIPT_PHONE = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL = data.ADDR_DETAIL;

                        $scope.item.RECEIPTOR_NM1 = data.USER_NM;
                        $scope.item.RECEIPT_PHONE1 = data.PHONE_2;
                        $scope.item.RECEIPT_ADDR1 = data.ADDR;
                        $scope.item.RECEIPT_ADDR_DETAIL1 = data.ADDR_DETAIL;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 나의 주문현황으로 이동
        $scope.click_myorder = function () {
            $location.url('/myange/orderlist');
        }

        // 계속 쇼핑하기 이동
        $scope.click_storeMall = function (menu) {

            if (menu == undefined) menu = $scope.product_gb;
            $location.url('/'+$stateParams.channel+'/'+menu+'/list');
        }

        // 스토어 메인으로 이동
        $scope.click_storemain = function () {
            $location.url('/'+$stateParams.channel+'/home');
        }

        /********** 이벤트 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.cartList)
            .then($scope.cartCummerceList)
            ['catch']($scope.reportProblems);
    }]);

    controllers.controller('storedream', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "꿈해몽";
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('storehome', ['$scope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $stateParams, $location, dialogs, CONSTANT) {

        // 초기화
        $scope.init = function(session) {
            // ange-portlet-slide-banner
            $scope.option_r1_c2 = {title: '롤링 스토어', api:'ange/product', size: 5, id: 'store', type: 'cummerce', url: '/store/cummerce', dots: true, autoplay: true, centerMode: true, showNo: 1, fade: 'true'};

            // ange-portlet-slide-page
            $scope.option_r2_c1 = {title: '마일리지몰', api:'ange/product', size: 9, id: 'mileage', type: 'mileage', url: '/store/mileagemall', dots: false, autoplay: true, centerMode: true, showNo: 3, fade: 'false'};
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);

    controllers.controller('storemall-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD, CONSTANT) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.TOTAL_COUNT = 0;

        $scope.list = [];

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        };

        // 검색어 조건
        var condition = [{name: "상품명", value: "PRODUCT_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        if ($stateParams.menu == 'mileagemall') {
            $scope.search.PRODUCT_GB = 'MILEAGE';
            $scope.search.SOLD_OUT = 'N';
            $scope.menu = 'mileagemall';
        } else {
            $scope.search.PRODUCT_GB = 'CUMMERCE';
            $scope.search.SOLD_OUT = 'N';
            $scope.search.PROCESS = 'Y';
            $scope.menu = 'cummerce';
        }


        // 초기화
        $scope.init = function(session) {

            //$scope.selectIdx = 'ALL';
            $scope.SEARCH_NOW_CATEGORY = '전체';

            $scope.getList('ange/product', 'list', {}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;

                    $scope.TOTAL_COUNT = total_cnt;
                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0;});

            $scope.search.COMM_NO = 'STORE';

            if($stateParams.menu == 'mileagemall'){
                $scope.search.PARENT_NO = 1;
            }else{
                $scope.search.PARENT_NO = 2;
            }

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){
                    $scope.category_list = data;
                })
                ['catch'](function(error){$scope.category_list = ""; });
        };

        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                // 페이징
                $scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.click_showPeopleBoardList();

                $scope.SEARCH_NOW_CATEGORY = '전체';

            }else{
                $scope.search.CATEGORY_NO = category_no;

                // 페이징
                $scope.PAGE_NO = 1;
                $scope.PAGE_SIZE = 9;
                $scope.SEARCH_TOTAL_COUNT = 0;

                // 초기화 후 조회
                $scope.list = [];
                $scope.click_showPeopleBoardList();

                $scope.SEARCH_NOW_CATEGORY = category.CATEGORY_NM;
            }
        };

        $scope.click_selectCategory = function(idx, category) {
            $scope.category[idx] = category;
            console.log($scope.category[idx]);
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        };

        /********** 이벤트 **********/
            // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {

            $scope.search.CATEGORY = [];

            if ($scope.category != '') {
                console.log($scope.category)
                for (var i in $scope.category) {
                    if ($scope.category[i] != null) $scope.search.CATEGORY.push($scope.category[i]);
                }
            }

            $scope.search.FILE = true;
            $scope.getList('ange/product', 'list', {}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {

                        data[i].PRICE  = data[i].PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        var img = CONSTANT.BASE_URL + '/storage/product/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'PRODUCT';
                        data[i].FILE = img;

                        $scope.list.push(data[i]);
                    }
                })
                ['catch'](function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0;});

        };

        /********** 이벤트 **********/
            // 탭 클릭 이동
//        $scope.click_selectTab = function (idx) {
//            $scope.selectIdx = idx;
//
//            if ($stateParams.menu == 'mileagemall') {
//                $scope.search.PRODUCT_GB = 'MILEAGE';
//            } else if ($stateParams.menu == 'cummerce') {
//                $scope.search.PRODUCT_GB = 'CUMMERCE';
//            }
//
//            if(idx == 0){
//                $scope.search.PRODUCT_TYPE = 'ALL';
//                $scope.selectPhoto = 'ALL';
//            }else{
//                $scope.search.PRODUCT_TYPE = $scope.selectIdx;
//            }
//
//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 9;
//            $scope.SEARCH_TOTAL_COUNT = 0;
//
//            $scope.list = [];
//            $scope.click_showPeopleBoardList();
//        };

            // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (item) {
//            if (item.SUM_IN_CNT <= item.SUM_OUT_CNT) {
//                dialogs.notify('알림', '품절된 상품입니다.', {size: 'md'});
//                return;
//            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+item.NO);
        };
        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.list = [];
            $scope.click_showPeopleBoardList();
        }

        // 후기 작성 화면이동
        $scope.click_review = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/moms/storereview/edit/0');
        }

//        $scope.init();
//        $scope.click_showPeopleBoardList();

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.click_showPeopleBoardList)
            ['catch']($scope.reportProblems);


    }]);

    controllers.controller('storemall-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', 'CONSTANT', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD,CONSTANT) {

        // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};

        $scope.productsList = [];
        $scope.product = {};

        $scope.selectIdx = 1;

        // 페이징
        $scope.reviewList = [];
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 5;
        $scope.TOTAL_COUNT = 0;

        $scope.search = {};

        //$("#checkProduct").attr("checked", false);
        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

//            $("ul.nav-tabs li").click(function () {
//
//                $("ul.tabs li").removeClass("active");
//                $(this).addClass("active");
//                $(".tab_content").hide();
//                var activeTab = $(this).attr("rel");
//                $("#" + activeTab).fadeIn();
//            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            $scope.selectIdx = idx;

            $("#tabs-"+idx)[0].scrollIntoView();  // O, jQuery  이용시
        };

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'mileagemall') {
                $scope.community = "마일리지몰";
                $scope.menu = 'mileage';
                $scope.TOTAL_MILEAGE = 0;
                $scope.TOTAL_PRICE = 0;
            } else if ($stateParams.menu == 'cummerce') {
                $scope.community = "앙쥬커머스";
                $scope.menu = 'cummerce';
                $scope.TOTAL_MILEAGE = 0;
                $scope.TOTAL_PRICE = 0;
            }

            // 리뷰 리스트
            $scope.search.TARGET_GB = 'STORE';
            $scope.search.TARGET_NO = $stateParams.id;

        };

        // 리뷰 리스트
        $scope.getReviewList = function (){
            $scope.search.FILE = true;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, false)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        // /storage/review/

                        var img = UPLOAD.BASE_URL + '/storage/review/' + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].TYPE = 'REVIEW';
                        data[i].FILE = img;

                        var source = data[i].BODY;
                        var pattern = /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig;

                        source = source.replace(pattern, '');
                        source = source.replace(/&nbsp;/ig, '');
                        source = source.trim();

                        data[i].BODY = source;

                        $scope.reviewList.push(data[i]);
                    }
                })
                ['catch'](function(error){$scope.reviewList = ""; $scope.TOTAL_COUNT=0;});
        }

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);

            // 페이징
//            $scope.PAGE_NO = 1;
//            $scope.PAGE_SIZE = 10;
//            $scope.TOTAL_COUNT = 0;

            $scope.reviewList = [];
            $scope.getReviewList();

        };

        $scope.$watch('product.CNT', function() {
            if ($scope.product.CNT != undefined) {
                if ($stateParams.menu == 'mileagemall') {

                    $scope.TOTAL_MILEAGE = 0;
                    $scope.TOTAL_PRICE = 0;
                } else if ($stateParams.menu == 'cummerce') {
                    $scope.TOTAL_PRICE = 0;
                    $scope.TOTAL_MILEAGE = 0;
                }
            } else {
                if ($stateParams.menu == 'mileagemall') {
                    $scope.TOTAL_MILEAGE = 0;
                } else if ($stateParams.menu == 'cummerce') {
                    $scope.TOTAL_PRICE = 0;
                }
            }
        });

        // 상품 추가
        $scope.addProductList = function (products, item){

//            if ($scope.uid == '' || $scope.uid == null) {
//                dialogs.notify('알림', '로그인 후 상품선택이 가능합니다.', {size: 'md'});
//                //$("#checkProduct").attr("checked",false);
//                return;
//            }

            if(products.NO == null){
                $scope.productsList = [];
            }else{
                $scope.product.CNT = 1;
                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 1, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
                //, "SUM_IN_OUT" : item.SUM_IN_OUT}


                // , "RECEIPTOR_NM" : $rootScope.user_info.USER_NM, "RECEIPT_ADDR" :$rootScope.user_info.ADDR, "RECEIPT_ADDR_DETAIL" : $rootScope.user_info.ADDR_DETAIL, "RECEIPT_PHONE" : $rootScope.user_info.PHONE_2
            }
        }

        // 체크박스 상품 추가
        $scope.addcheckboxProductList = function (products, item){

            //alert('');
//            if ($scope.uid == '' || $scope.uid == null) {
//                dialogs.notify('알림', '로그인 후 장바구니에 상품 담기가 가능합니다.', {size: 'md'});
//                $("#checkProduct").attr("checked",false);
//                return;
//            }

            $scope.product.CNT = 1;
            $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});

//            if($scope.checkboxproduct == 'Y'){
//                $scope.product.CNT = 1;
//                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
//            }else{
//                $scope.productsList = [];
//            }

//            if($("#checkProduct").is(":checked")){
//                $scope.product.CNT = 1;
//                $scope.productsList.push({"MAIN_FILE": item.MAIN_FILE, "PRODUCT_NO" : products.NO, "PRODUCT_NM" : products.PRODUCT_NM , "PRICE" : item.PRICE, "PRODUCT_CNT" : 0, "TOTAL_PRICE" : 0, "PARENT_NO" : products.PARENT_NO, "DELIVERY_PRICE" : item.DELIVERY_PRICE, "DELIVERY_ST" : item.DELIVERY_ST, "PRODUCT_GB" : item.PRODUCT_GB});
//                //, "SUM_IN_OUT" : item.SUM_IN_OUT
//            }else{
//                $scope.productsList = [];
//            }

        }

//        $(document).ready(function(){
//
//            $("#checkProduct").click(function(){
//                if(!$("#checkProduct").is(":checked")){
//                    $scope.addProductList($scope.item, $scope.item);
//                }else{
//                    $scope.productsList = [];
//                    //$("#checkProduct").attr("checked", false);
//                }
//
//            });
//
//        });

        // 상품 삭제
        $scope.click_removeProduct = function (idx) {
            $scope.productsList.splice(idx, 1);

            if ($stateParams.menu == 'mileagemall') {
                $scope.TOTAL_MILEAGE -= $scope.item.PRICE;
                $scope.TOTAL_PRICE = 0;
            } else if ($stateParams.menu == 'cummerce') {
                $scope.TOTAL_PRICE -= $scope.item.PRICE;
                $scope.TOTAL_MILEAGE = 0;
            }

            $("#checkProduct").attr("checked", false);
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/product', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        var files = data.FILES;
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {

                                //files[i].PATH
                                var img = UPLOAD.BASE_URL + '/storage/product/' + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                            }
                        }

                        $scope.products = data.PRODUCTS;
                        $scope.item = data;

//                        $scope.PRICE = data.PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
//                        $scope.DELIVERY_PRICE = data.DELIVERY_PRICE.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                        if($scope.products == null){
                            $scope.checkboxproduct = 'Y';
                            $scope.addcheckboxProductList($scope.item, $scope.item);
                        }

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 장바구니추가
        $scope.click_addcart = function (cnt){

            if(cnt <= 0){
                dialogs.notify('알림', '품절된 상품입니다', {size: 'md'});
                return;
            }

            if($stateParams.menu == 'mileagemall'){
                if($scope.total() > $rootScope.mileage){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $scope.item.CART = $scope.productsList;

            $scope.insertItem('ange/cart', 'item', $scope.item, false)
                .then(function(){

                    if (confirm("장바구니에 등록되었습니다. 장바구니로 이동하시겠습니까?") == true){    //확인
                        $location.url('store/cart/list');
                    }else{   //취소
                        return;
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 전체 금액 계산
        $scope.addSumPrice = function(price, cnt, index, sum_cnt){
            if($scope.menu == 'mileage' && cnt > 2){
                dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다.', {size: 'md'});
                $scope.productsList[index].PRODUCT_CNT = 1;
                return;
            }

            if(sum_cnt < cnt){
                dialogs.notify('알림', '현재 상품 재고수량이 1개 존재합니다.', {size: 'md'});
                $scope.productsList[index].PRODUCT_CNT = 1;
                return;
            }

            $scope.productsList[index].TOTAL_PRICE += price * cnt;
        }

        // 전체 합계
        $scope.total = function() {

            var total = 0;
            angular.forEach($scope.productsList, function(item) {
                total += item.PRODUCT_CNT * item.PRICE;
            })

            return total;
        }


        // 주문
        $scope.click_addOrder = function(){

            $rootScope.orderlist = [];
            $rootScope.orderlist = $scope.productsList;

            var cnt = $scope.productsList.length;


            console.log($rootScope.orderlist)
            if($stateParams.menu == 'mileagemall'){
                if(cnt > 2){
                    dialogs.notify('알림', '마일리지 몰에서는 2개까지 구매가 가능합니다', {size: 'md'});
                    return;
                }

                if($scope.TOTAL_MILEAGE > $rootScope.mileage){
                    dialogs.notify('알림', '잔여 마일리지가 부족합니다', {size: 'md'});
                    return;
                }
            }

            $location.url('store/order/list/'+$rootScope.orderlist);
        }

        // 목록 버튼 클릭
        $scope.click_showPeoplePhotoList = function () {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        }

        // 후기 작성 화면이동
        $scope.click_review = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/moms/storereview/edit/0');
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            $location.url('/moms/storereview/view/'+key);

        };

        // 다음 슬라이드
        $scope.click_slickPrev = function() {
            angular.element('#product').slickPrev();
        };

        // 이전 슬라이드
        $scope.click_slickNext = function() {
            angular.element('#product').slickNext();
        };

        // 선택
        $scope.click_showView = function (item) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+item.NO);
        };

        // 슬라이드 이미지 조회
        $scope.getProductList = function (api) {
            $scope.getList('ange/product', 'list', {NO:0, SIZE:9}, {FILE: true, PRODUCT_GB: 'MILEAGE', NOT_PRODUCT_NO: $stateParams.id, SOLD_OUT: 'N'}, true)
                .then(function(data){
                    for (var i in data) {
                        data[i].PRODUCT_FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                        data[i].URL = $scope.option.url+"/view/"+data[i].NO;
                    }

                    $scope.list = data;
                })
                ['catch'](function(error){$scope.list = []});
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoard)
            .then($scope.getReviewList)
//            .then($scope.getProductList)
            ['catch']($scope.reportProblems);
//        $scope.init();
//        $scope.getPeopleBoard();
//        $scope.getReviewList();
//        $scope.getProductList();
        //s$scope.addSumPrice($scope.item.PRICE, 1 , 0);

    }]);

    controllers.controller('storenaming-request', ['$scope', '$rootScope','$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, UPLOAD) {


        $scope.search = {};
        $scope.item = {};

        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 1;

        $scope.showSamplepackDetails = false;

        $scope.selectIdx = '1';

        $scope.click_update_user_info = function (name) {
            //$scope.openModal(null, 'md');
            alert(name);

            //$location.url("https://www.ange.co.kr/naming/findhanja2.asp?val=sp_fname&inname=최");

            //var popUrl = "https://www.ange.co.kr/naming/findhanja2.asp?val=sp_fname&inname="+name;

            var popUrl = "https://www.ange.co.kr/naming/findhanja2.asp?val=sfname&inname=%C3%D6";
            //팝업창에 출력될 페이지 URL
            var popOption = "width=400, height=450, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
            window.open(popUrl+"","",popOption);
        };

        // 날짜 셀렉트 박스셋팅
        var year = [];
        var babyYear = [];
        var day = [];
        var now = new Date();
        var nowYear = now.getFullYear();

        var month = [];

        var hour = [];
        var minute = [];

        // 초기화
        $scope.init = function() {

            $scope.getItem('com/user', 'item', $scope.uid, {} , false)
                .then(function(data){

                    data

                    $scope.USER_ID = data.USER_ID;
                    $scope.USER_NM = data.USER_NM;
                    $scope.NICK_NM = data.NICK_NM;
                    $scope.ADDR = data.ADDR;
                    $scope.ADDR_DETAIL = data.ADDR_DETAIL;
                    $scope.REG_DT = data.REG_DT;
                    $scope.REG_DT = data.REG_DT;
                    $scope.PHONE_1 = data.PHONE_1;
                    $scope.PHONE_2 = data.PHONE_2;
                    $scope.BLOG_URL = data.BLOG_URL;

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});


            $scope.community = "작명 신청";

            for (var i = 2000; i >= 1950; i--) {
                year.push(i+'');
            }

            for (var i = nowYear + 1; i >= 1995; i--) {
                babyYear.push(i+'');
            }

            for (var i = 1; i <= 12; i++) {

                if(i < 10){
                    i = '0'+i;
                }
                month.push(i+'');
            }

            for (var i = 1; i <= 31; i++) {

                if(i < 10){
                    i = '0'+i;
                }
                day.push(i+'');
            }

            for(var i = 0; i < 24; i++){

                if(i < 10){
                    i = '0'+i;
                }

                hour.push(i+'');
            }

            for(var i = 0; i < 60; i++){

                if(i < 10){
                    i = '0'+i;
                }
                minute.push(i+'');
            }

            $scope.year = year;
            $scope.babyYear = babyYear;
            $scope.month = month;
            $scope.day = day;
            $scope.hour = hour;
            $scope.minute = minute;


            $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                .then(function(data){
                    $rootScope.namingnolist = data;

                    if($stateParams.id != 0){
                        var idx = 0;
                        for(var i =0; i<$rootScope.namingnolist.length; i++){

                            if(JSON.stringify($stateParams.id) == JSON.stringify($rootScope.namingnolist[i].NO)){
                                idx = i;
                            }
                        }
                        $scope.item.PRODUCT = $scope.namingnolist[idx];

                        $scope.addProductList($scope.item.PRODUCT);
                    }

                })
                ['catch'](function(error){$rootScope.namingnolist = "";});


            //console.log($scope.month);
        };


        $(function () {

            $(".tab_content").hide();
            $(".tab_content:first").show();

            $("ul.nav-tabs li").click(function () {

                $("ul.tabs li").removeClass("active");
                $(this).addClass("active");
                $(".tab_content").hide();
                var activeTab = $(this).attr("rel");
                $("#" + activeTab).fadeIn();
            });

        });

        // 탭 선택시 해당 화면으로 포커스 이동
        $scope.click_selectTab = function (idx) {
            if(idx == 2){
                if($rootScope.uid == null || $rootScope.uid == ''){
                    dialogs.notify('알림', '로그인 후 신청 할 수 있습니다.', {size: 'md'});
                    $scope.click_selectTab(1);
                    return;
                }
            }

            $scope.selectIdx = idx;

            //$("#tabs-"+idx).focus();

            $("#tabs-"+idx)[0].scrollIntoView();  // O, jQuery  이용시
        };

        $scope.addProductList = function (product){

            $scope.productsList = [];

            $scope.productsList.push({"PRODUCT_NO": product.NO, "PRODUCT_NM" : product.PRODUCT_NM, "PRICE" : product.PRICE});
            $scope.TOTAL_PRICE = product.PRICE;
            console.log(product);
        }

        // 정보수정 모달창
        $scope.openModal = function (content, size) {
            var dlg = dialogs.create('user_info_modal.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {

                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));
                    $scope.item = {};

                    //console.log($scope.user_info);
                    $scope.item.USER_ID = $scope.user_info.USER_ID;
                    $scope.item.USER_NM = $scope.user_info.USER_NM;
                    $scope.item.NICK_NM = $scope.user_info.NICK_NM;
                    $scope.item.ADDR = $scope.user_info.ADDR;
                    $scope.item.ADDR_DETAIL = $scope.user_info.ADDR_DETAIL;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.REG_DT = $scope.user_info.REG_DT;
                    $scope.item.PHONE_1 = $scope.user_info.PHONE_1;
                    $scope.item.PHONE_2 = $scope.user_info.PHONE_2;
                    $scope.item.PREGNENT_FL = $scope.user_info.PREGNENT_FL;
                    $scope.item.BABY_BIRTH_DT = $scope.user_info.BABY_BIRTH_DT;

                    if($scope.item.PREGNENT_FL == 'Y'){
                        $scope.checked = "Y";
                    }else{
                        $scope.checked = "N";
                    }

                    $scope.content = data;

                    $scope.click_ok = function () {
                        $scope.item.SYSTEM_GB = 'CMS';

                        if($("#preg_Y").is(":checked")){
                            $scope.item.PREGNENT_FL = "Y";
                        }else{
                            $scope.item.PREGNENT_FL = "N";
                        }

                        if($("#preg_N").is(":checked")){
                            $scope.item.PREGNENT_FL = "N";
                        }else{
                            $scope.item.PREGNENT_FL = "Y";
                        }

                        $scope.updateItem('com/user', 'item',$scope.uid, $scope.item, false)
                            .then(function(data){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    };

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };
                }], content, {size:size,keyboard: true,backdrop: true}, $scope);
            dlg.result.then(function(){
                $scope.getItem('com/user', 'item', $scope.uid, $scope.item , false)
                    .then(function(data){

                        $scope.USER_ID = data.USER_ID;
                        $scope.USER_NM = data.USER_NM;
                        $scope.NICK_NM = data.NICK_NM;
                        $scope.ADDR = data.ADDR;
                        $scope.ADDR_DETAIL = data.ADDR_DETAIL;
                        $scope.REG_DT = data.REG_DT;
                        $scope.REG_DT = data.REG_DT;
                        $scope.PHONE_1 = data.PHONE_1;
                        $scope.PHONE_2 = data.PHONE_2;
                        $scope.BLOG_URL = data.BLOG_URL;

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 네이밍 신청
        $scope.click_saveNamingComp = function (){

            $scope.item.RECEIPTOR_NM = $rootScope.user_info.USER_NM;
            $scope.item.RECEIPT_ADDR = $rootScope.user_info.ADDR;
            $scope.item.RECEIPT_ADDR_DETAIL = $rootScope.user_info.ADDR_DETAIL;
            $scope.item.RECEIPT_PHONE = $rootScope.user_info.PHONE_2;

            $scope.item.ORDER_GB = 'NAMING';
            $scope.item.PAY_GB = 'CREDIT';

            $scope.insertItem('ange/order', 'namingitem', $scope.item, false)
                .then(function(){

                    dialogs.notify('알림', '네이밍 신청이 완료되었습니다.', {size: 'md'});

                    $location.url('/store/namingintro');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});


        }

        $scope.click_intro = function(){
            $location.url('store/namingintro');
        }

        // 후기 작성 화면이동
        $scope.click_review = function (){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/moms/productreview/edit/0');
        }

        /*        $scope.getSession()
         .then($scope.sessionCheck)
         ['catch']($scope.reportProblems);*/

        $scope.init();




    }]);

    controllers.controller('storenamingintro', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "네이밍 소개";
        };

        /********** 이벤트 **********/

        $scope.click_naming_request = function(key){
            $scope.comming_soon();
            return;

            $location.url('store/naming/request/'+key);
        }

        $scope.init();

    }]);

    controllers.controller('storenamingstory-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.community = "작명이야기";

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT"} , {name: "등록자", value: "NICK_NM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.search.COMM_NO = 19;
            $scope.search.SYSTEM_GB = 'ANGE';

            $scope.search.COMM_GB = 'BOARD';
            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };

        /********** 이벤트 **********/

            // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SORT = "BOARD_NO";
            $scope.search.ORDER = "DESC";

            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/store/namingstory/view/'+key);
        };

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);


        $scope.init();
        $scope.getPeopleBoardList();
    }]);

    controllers.controller('storenamingstory-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.community = "작명이야기";


        // 댓글
        //$scope.TARGET_NO = $stateParams.id;
        //$scope.TARGET_GB = 'BOARD';

        $(document).ready(function(){

            $("#reply_sort_date").addClass("selected");
            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $("#reply_sort_idx").click(function(){
                $scope.search.SORT = 'NO';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_idx").addClass("selected");
                $("#reply_sort_date").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });

            $("#reply_sort_date").click(function(){
                $scope.search.SORT = 'REG_DT';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_date").addClass("selected");
                $("#reply_sort_idx").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });
        });

        // 초기화
        $scope.init = function(session) {
            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임

            $scope.search.COMM_NO = 19;
            $scope.search.COMM_GB = 'BOARD';

            $scope.getList('com/webboard', 'manager', {}, $scope.search, true)
                .then(function(data){
                    var comm_mg_nm = data[0].COMM_MG_NM;
                    $scope.COMM_MG_NM = comm_mg_nm;

                })
                ['catch'](function(error){});
        };


        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/store/naming/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            $location.url('/store/naming/list');
        };

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;
                        var files = data.FILES;
                        for(var i in files) {
                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                        }
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };


        // 이전글
        $scope.getPreBoard = function (){

            $scope.search.COMM_NO = 19;
            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            $scope.search.COMM_NO = 19;
            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/store/namingstory/view/'+key);
        };


        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/

        $scope.getSession()
            .then($scope.sessionCheck)
            ['catch']($scope.reportProblems);

        $scope.init();
        $scope.getPeopleBoard();
        $scope.getPreBoard();
        $scope.getNextBoard();

    }]);

    controllers.controller('storeorder-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.search = {};
        $scope.item = {};

        /* $('.mileagelist').removeClass('hide');
         $('.cummercelist').addClass('hide');*/

        $scope.mileage = true;
        $scope.cummerce = false;

        $(document).ready(function() {
            $("input:radio:first").prop("checked", true).trigger("click");
            $(".product_gb").click(function() {

                if($(this).val() == "mileage"){
                    $scope.mileage = true;
                    $scope.cummerce = false;
                } else if ($(this).val() == "cummerce"){
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }

                //alert("clicked");
//                $('input[name="cartlist"]').change(function(){
//                    if($(this).val() == "mileage"){
//                        $scope.mileage = true;
//                        $scope.cummerce = false;
//                    } else if ($(this).val() == "cummerce"){
//                        $scope.mileage = false;
//                        $scope.cummerce = true;
//                    }
//                });

            });
        });

        $(function(){
            $scope.click_cartlist = function(){

                $('input[name="cartlist"]').change(function(){
                    if($(this).val() == "mileage"){
                        $scope.mileage = true;
                        $scope.cummerce = false;
                    } else if ($(this).val() == "cummerce"){
                        $scope.mileage = false;
                        $scope.cummerce = true;
                    }
                });
            }

            $(':radio[name="cartlist"]').click(function(){
                //alert('aaaaa');
                var gubun = $(':radio[name="cartlist"]:checked').val();
                if(gubun == 'mileage'){
                    $scope.mileage = true;
                    $scope.cummerce = false;
                }else{
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }
            });
        });

        // 초기화
        $scope.init = function() {

            $scope.community = "찜목록";
            $rootScope.info = {};
        };

        $scope.click_cartlist = function(){

            $('input[name="cartlist"]').change(function(){
                if($(this).val() == "mileage"){
                    /*$('.mileagelist').removeClass('hide');
                     $('.cummercelist').addClass('hide');*/
                    $scope.mileage = true;
                    $scope.cummerce = false;
                } else if ($(this).val() == "cummerce"){
                    /*$('.cummercelist').removeClass('hide');
                     $('.mileagelist').addClass('hide');*/
                    $scope.mileage = false;
                    $scope.cummerce = true;
                }
            });
        }

        // 마일리지 장바구니 리스트
        $scope.cartList = function (){
            $scope.search.FILE = true;

            $scope.search.PRODUCT_GB = "mileage";
            $scope.getList('ange/cart', 'list', {}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    $scope.sum_price = 0;
                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                        $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                    }
                    $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);


                    console.log(data);
                    $scope.mileagelist = data;
                })
                ['catch'](function(error){$scope.mileagelist = ""; $scope.TOTAL_COUNT = 0;});
        }

        // 커머스 장바구니 리스트
        $scope.cartCummerceList = function (){

            $scope.search.FILE = true;
            $scope.search.PRODUCT_GB = "cummerce";

            $scope.getList('ange/cart', 'list', {}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    $scope.sum_price = 0;
                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                        $scope.sum_price += parseInt(data[i].TOTAL_PRICE);
                    }
                    $scope.total_mileage = parseInt($scope.user_info.MILEAGE.REMAIN_POINT - $scope.sum_price);


                    $scope.cummercelist = data;
                })
                ['catch'](function(error){$scope.cummercelist = ""; $scope.TOTAL_COUNT = 0;});
        }

        // 선택 상품 삭제
        $scope.click_removeCartProduct = function (product_gb, list, idx){

            var no = list[idx].NO;
            $scope.CART_NO = no;

            $scope.deleteItem('ange/cart', 'item', $scope.CART_NO, true)
                .then(function(){
                    if(product_gb == 'mileage'){
                        $scope.mileagelist.splice(idx, 1);
                    }else if(product_gb == 'cummerce'){
                        $scope.cummercelist.splice(idx, 1);
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 커머스 상품 장바구니 이동
        $scope.click_cummerce_reg = function (list , idx){

            if(list[idx].SUM_CNT < 0){
                dialogs.notify('알림', '품절된 상품입니다', {size: 'md'});
                return;
            }

            $rootScope.cummercecartlist = [];
            $rootScope.cummercecartlist.push(list[idx]);

            //console.log($rootScope.cummercecartlist);

            $location.url('/store/cart/list?'+$rootScope.cummercecartlist);

        }

        // 마일리지 상품 장바구니 이동
        $scope.click_mileage_reg = function (list , idx){

            console.log(list[idx].SUM_CNT);

            if(list[idx].SUM_CNT < 0){
                dialogs.notify('알림', '품절된 상품입니다', {size: 'md'});
                return;
            }

            $rootScope.mileagecartlist = [];
            $rootScope.mileagecartlist.push(list[idx]);

            //console.log($rootScope.mileagecartlist);

            $location.url('/store/cart/list?'+$rootScope.mileagecartlist);

        }

        // 마일리지 몰 리스트 이동
        $scope.click_mileagehome = function(){
            $location.url('/store/mileagemall/list');
        }

        // 커머스 리스트 이동
        $scope.click_cummercehome = function (){
            $location.url('/store/cummerce/list');
        }

        /********** 이벤트 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.cartList)
            .then($scope.cartCummerceList)
            ['catch']($scope.reportProblems);

//        $scope.init();
//
//        $scope.cartList();
//        $scope.cartCummerceList();
    }]);

    controllers.controller('storephotozone-list', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {
            $scope.community = "포토존";
        };

        /********** 이벤트 **********/
        // 게시판 목록 이동
//        $scope.click_showPeopleBoardList = function () {
//            if ($stateParams.menu == 'angeroom') {
//                $location.url('/people/angeroom/list');
//            }
//        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         ['catch']($scope.reportProblems);*/
        $scope.init();

    }]);


});
