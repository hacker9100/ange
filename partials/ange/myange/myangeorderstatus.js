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
    controllers.controller('myangeorderstatus', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getPeopleBoardList();
        };

        $scope.search = {};

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

        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            $scope.community = '상태변경신청 내역';
        };


        // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        /********** 화면 초기화 **********/
            //$scope.init();

            // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC';
            $scope.search.FILE = true;

            $scope.getList('ange/counsel', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0});
        };

        // 조회 화면 이동
        $scope.click_showViewPeoplePhoto = function (key) {

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 상태변경
        $scope.click_counsel_view = function (key){
            $scope.openCounselModal(key, 'lg');
        }

        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('order_counsel_view.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.search = {};

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

                    console.log(item);

                    $scope.getItem('ange/counsel', 'item', item.NO, {}, false)
                        .then(function(data){
                            $scope.item = data;

                            $("input:radio[name='counsel']:radio[value='"+data.COUNSEL_ST+"']").attr("checked",true);
                            $scope.radio_change(data.COUNSEL_ST);
                        })
                        .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

                    // 상품코드 selectbox
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
                                $scope.item.PRODUCT_CODE = $scope.productnolist[idx];

                                // 상품명 조회
                                $scope.searchProductNm($scope.item.PRODUCT_CODE);


                            })
                            .catch(function(error){$scope.productnolist = "";});
                    }

                    // 상품명 selectbox
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

                                $scope.item.PRODUCT = $scope.productnmlist[idx];
                            })
                            .catch(function(error){$scope.productnmlist = "";});
                    }

                    $scope.namingnoList = function(){
                        $scope.getList('ange/order', 'namingnoList', {}, {}, true)
                            .then(function(data){
                                $scope.namingnolist = data;
                            })
                            .catch(function(error){$scope.namingnolist = "";});
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

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
