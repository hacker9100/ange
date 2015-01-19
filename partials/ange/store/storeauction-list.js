/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : storemall-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('storeauction-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

        $scope.selectIdx = 0;

        $scope.search = {};

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
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


        $scope.community = "마일리지 경매소";
        $scope.search.PRODUCT_GB = 'AUCTION';
        $scope.menu = 'auction';

        // 초기화
        $scope.init = function(session) {

/*         if($rootScope.uid == '' || $rootScope.uid == null){
             dialogs.notify('알림', '로그인 후 이용 가능합니다.', {size: 'md'});
             $location.url('/store/home');
         }*/


        $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
            .then(function(data){
                var total_cnt = data[0].TOTAL_COUNT;

                $scope.TOTAL_COUNT = total_cnt;

                /*$scope.total(total_cnt);*/
                $scope.list = data;
            })
            .catch(function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0;});
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
            // 게시판 목록 이동
        $scope.click_showPeopleBoardList = function () {

            $scope.search.FILE = true;
            $scope.getList('ange/product', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var search_total_cnt = data[0].TOTAL_COUNT;
                    $scope.SEARCH_TOTAL_COUNT = search_total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;
                })
                .catch(function(error){$scope.list = ""; $scope.SEARCH_TOTAL_COUNT = 0;});

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

//            if ($stateParams.menu == 'angemodel') {
//                $location.url('/people/angemodel/view/'+key);
//            } else if($stateParams.menu == 'recipearcade') {
//                $location.url('/people/recipearcade/view/'+key);
//            } else if($stateParams.menu == 'peopletaste') {
//                $location.url('/people/peopletaste/view/'+key);
//            }
        };
        // 검색
        $scope.click_searchPeopleBoard = function(){
            $scope.click_showPeopleBoardList();
        }


        $scope.init();
        $scope.click_showPeopleBoardList();

    }]);
});
