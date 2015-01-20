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
    controllers.controller('myangeorderlist', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {

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

        $scope.item = {};

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

            $scope.getList('ange/order', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
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
        $scope.click_counsel = function (item){
            $scope.openCounselModal(item, 'lg');
        }

        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('order_counsel.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.item = item;


                    $scope.click_savecounsel = function (){
                        $scope.insertItem('ange/counsel', 'item', $scope.item, false)
                            .then(function(){
                                dialogs.notify('알림', '신청이 완료되었습니다. 나의 변경신청에서 확인하실 수 있습니다', {size: 'md'});
                                $modalInstance.close();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };

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
                $scope.updateItem('ange/order', 'item', item.NO, $scope.item, false)
                    .then(function(){
                        dialogs.notify('알림', '주문취소 되었습니다.', {size: 'md'});
                        $scope.getPeopleBoardList();
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        $scope.init();
        $scope.getPeopleBoardList();

    }]);
});
