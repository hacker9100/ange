/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleboard-list', ['$scope', '$rootScope','$stateParams','$q', '$location', 'dialogs', 'ngTableParams', 'CONSTANT', function ($scope, $rootScope, $stateParams, $q, $location, dialogs, ngTableParams, CONSTANT) {

        /********** 공통 controller 호출 **********/
        //angular.extend(this, $controller('ange-common', {$scope: $rootScope}));

        $scope.search = {};

        // 페이징
        $scope.PAGE_SIZE = CONSTANT.PAGE_SIZE;
        $scope.TOTAL_COUNT = 0;

       // 검색어 조건
        if($scope.menu.COMM_NO == 8){
            var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}]; // 앙쥬맘 속풀이방은 익명게시판이므로 작성자 제외
        }else{
            var condition = [{name: "제목+내용", value: "SUBJECT+BODY"}, {name: "작성자", value: "NICK_NM"}];
        }


        $scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+mm+dd;

        $scope.todayDate = today;

        //$scope.uid = $rootScope.uid;

        // 서포터즈 게시판 권한 체크


        /********** 초기화 **********/
            // 초기화
        $scope.init = function() {

            console.log($rootScope.role);

            if($scope.menu.COMM_NO == 31){

                if($rootScope.role == 'MEMBER' || $rootScope.role == 'CLINIC'){
                    dialogs.notify('알림', '서포터즈 회원만 이용 가능합니다.', {size: 'md'});
                    $location.url('/people/home');
                }
            }

            console.log($scope.menu.COMM_NO);

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
//            $scope.search.BOARD_GB = 'BOARD';
//            $scope.search.SYSTEM_GB = 'ANGE';
//            $scope.search.BOARD_ST = 'D';

            $scope.getItem('ange/community', 'item', $scope.menu.COMM_NO, $scope.search, true)
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

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {
/*            $scope.search.SORT = 'NOTICE_FL';
            $scope.search.ORDER = 'DESC'*/

            if($stateParams.menu == 'supporter'){
                $scope.search.CATEGORY_NO = $rootScope.support_no;
            }

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
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
//            $scope.comming_soon();
//            return;

            $rootScope.NOW_PAGE_NO = $scope.PAGE_NO;
            $rootScope.CONDITION = $scope.search.CONDITION.value;
            $rootScope.KEYWORD = $scope.search.KEYWORD;

            console.log($rootScope.CONDITION);
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {
//            $scope.comming_soon();
//            return;

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };

        // 검색
        $scope.click_searchPeopleBoard = function(){

            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
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


//        $scope.init();
//        $scope.getPeopleBoardList();

/*        $scope.test = function(session){
            console.log(session);
        }

        $scope.test();*/

        //console.log($scope.$parent.sessionInfo);
    }]);
});
