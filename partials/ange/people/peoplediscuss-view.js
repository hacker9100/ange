/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-12-31
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peoplediscuss-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {


        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'TALK';

        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 10;
        $scope.TOTAL_COUNT = 0;

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} ,{name: "내용", value: "BODY"}, {name: "작성자", value: "NICK_NM"}];

        //$scope.SEARCH_YN = 'N';

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        if(mm < 10){
            mm = '0'+mm;
        }

        if(dd < 10){
            dd = '0'+dd;
        }

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;



        // 초기화
        $scope.init = function(session) {

            console.log($rootScope.PARENT_NO);
            $scope.item.PARENT_NO = $rootScope.PARENT_NO;
            $scope.search.PARENT_NO = $rootScope.PARENT_NO;

            // TODO: 수정 버튼은 권한 체크후 수정 권한이 있을 경우만 보임
            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.COMM_GB = 'TALK';

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
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$rootScope.PARENT_NO);
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;

                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 이전글
        $scope.getPreBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            $scope.search.COMM_NO = $scope.menu.COMM_NO;
            $scope.search.KEY = $stateParams.id;

            if ($stateParams.id != 0) {
                return $scope.getList('com/webboard', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        // 게시판 목록 조회
        $scope.getPeopleBoardList = function () {


            $scope.getList('com/webboard', 'list', {NO: $scope.PAGE_NO - 1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;
                    $scope.list = data;

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$rootScope.PARENT_NO);
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        // 등록 버튼 클릭
        $scope.click_showCreatePeopleBoard = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');
        };



        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'BOARD';
            item.DETAIL_GB = 'BOARD';
            $scope.openModal(item, 'lg');
        };

        // 콘텐츠보기 모달창
        $scope.openModal = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/ange/com/board-report.html',
                controller: 'board-report',
                size: size,
                scope: $scope,
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

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.likeFl)
            .then($scope.addHitCnt)
            .then($scope.getPeopleBoard)
            .then($scope.getPreBoard)
            .then($scope.getNextBoard)
            ['catch']($scope.reportProblems);
    }]);
});
