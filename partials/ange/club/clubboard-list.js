/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2015-03-11
 * Description : clibboard-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('clubboard-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 공통 controller 호출 **********/
            //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        //$scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;

        // 검색어 조건
        var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}, {name: "말머리", value: "HEAD"}];

        $scope.selectIdx = 0;
        $scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        $scope.search.CONDITION.value = condition[0].value;
        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+mm+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;


        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            //console.log($scope.menu.COMM_NO);


//            $scope.search.BOARD_GB = 'BOARD';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            // 카테고리 탭 셋팅
            $scope.search.COMM_NO = 71;
            $scope.search.TOTAL_COUNT = true;

            $scope.getList('com/webboard', 'category', {}, $scope.search, true)
                .then(function(data){

                    for(var i in data) {

                        //console.log(data[i].TOTAL);
                        if (data[i].TOTAL != null) {

                            console.log(data[i].TOTAL.TOTAL_COUNT);
                            var file_cnt = data[i].TOTAL.TOTAL_COUNT;
                            data[i].TOTAL_COUNT = file_cnt;

                        }
                    }

                    $scope.category_list = data;
                })
                ['catch'](function(error){$scope.category_list = ""; });

            $scope.getItem('ange/community', 'item', $scope.search.COMM_NO, $scope.search, true)
                .then(function(data){
                    $scope.COMM_MG_NM = data.COMM_MG_NM;
                })
                ['catch'](function(error){});

            //$scope.search.SORT = 'NOTICE_FL'



            var getParam = function(key){
                var _parammap = {};
                document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
                    function decode(s) {
                        return decodeURIComponent(s.split("+").join(" "));
                    }

                    _parammap[decode(arguments[1])] = decode(arguments[2]);
                });

                return _parammap[key];
            };

            console.log('getParam("page_no") = '+getParam("page_no"));

            if(getParam("page_no") == undefined){
                $scope.PAGE_NO = 1;
            }else{
                $scope.PAGE_NO = getParam("page_no");
                if(getParam("condition") != undefined){
                    $scope.search.CONDITION.value = getParam("condition");
                }else{
                    $scope.search.CONDITION.value = "";
                }
                $scope.search.KEYWORD = getParam("keyword");
            }

        };

        /********** 이벤트 **********/
            // 우측 메뉴 클릭
        $scope.click_showViewBoard = function(item) {
            $location.url('people/board/view/1');
//            $location.url('people/poll/edit/'+item.NO);
        };

        // 탭 클릭 이동
        $scope.click_selectTab = function (idx, category_no) {

            $scope.selectIdx = idx;
            if(idx == 0){
                $scope.search.CATEGORY_NO = '';

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }else{
                $scope.search.CATEGORY_NO = category_no;

                $scope.PAGE_SIZE = 25;
                $scope.TOTAL_COUNT = 0;
                $scope.getPeopleBoardList();
            }
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {

            $scope.search.FILE_EXIST = true;

            $scope.isLoding = true;
            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    console.log($scope.TOTAL_COUNT);

                    for(var i in data) {

                        if (data[i].FILE != null) {
                            var file_cnt = data[i].FILE[0].FILE_CNT;
                            data[i].FILE_CNT = file_cnt;

                        }
                    }

                    $scope.list = data;

                    $scope.isLoding = false;
                })
                ['catch'](function(error){
                $scope.TOTAL_COUNT = 0; $scope.list = "";
                $scope.isLoding = false;
            });
        };

        $scope.pageChanged = function() {

            console.log('Page changed to: ' + $scope.PAGE_NO);
            //$location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO);
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            //$location.url('/club/board/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $location.url('/club/home?tab=3&type=board&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
//            $scope.comming_soon();
//            return;

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($scope.search.CONDITION);
            $location.url('/club/board/view/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/club/board/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){

            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/club/home?tab=3&type=board&page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.SEARCH_YN = 'Y';
        }

        // 전체검색
        $scope.click_searchAllPeopleBoard = function(){
            $scope.search.KEYWORD = '';
            $scope.getPeopleBoardList();
            $scope.SEARCH_YN = 'N';
        }

        /********** 화면 초기화 **********/

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getPeopleBoardList)
            ['catch']($scope.reportProblems);
    }]);
});
