/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user_list', ['$scope', '$stateParams', '$location', function ($scope, $stateParams, $location) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {};

        // 목록 데이터
        $scope.listData = [];

        // 초기화
        $scope.init = function() {
            // 검색조건
            var condition = [{name: "이름", value: "USER_NM"}, {name: "아이디", value: "USER_ID"}, {name: "닉네임", value: "NICK_NM"}, {name: "전화번호", value: "PHONE"}, {name: "주소", value: "ADDR"}, {name: "이메일", value: "EMAIL"}, {name: "생일", value: "BIRTH"}, {name: "가입기간", value: "REG_DT"}];
            var type = [{name: "일반회원", value: "PER"}, {name: "앙쥬맘", value: "MOM"}, {name: "앙쥬클럽", value: "CLUB"}, {name: "블로그메이트", value: "MATE"}];
            var state = [{name: "전체", value: "A"}, {name: "정상", value: "N"}, {name: "불량", value: "F"}, {name: "휴면", value: "D"}, {name: "탈퇴", value: "S"}];
            var act = [{name: "일반정보", value: "A"}, {name: "커뮤니티활동", value: "C"}, {name: "참여활동", value: "P"}, {name: "블로거활동", value: "B"}];
            var sort = [{name: "가입일", value: "REG_DT"}, {name: "이름", value: "USER_NM"}, {name: "포인트", value: "POINT"}, {name: "스코어", value: "SCORE"}];
            var order = [{name: "내림차순", value: "DESC"}, {name: "오름차순", value: "ASC"}];

            $scope.condition = condition;
            $scope.type = type;
            $scope.state = state;
            $scope.act = act;
            $scope.sort = sort;
            $scope.order = order;
            $scope.search.CONDITION = condition[0];
            $scope.search.STATE = state[0];
            $scope.search.SORT = sort[0];
            $scope.search.ORDER = order[0];
        };

        /********** 이벤트 **********/
        // 등록 버튼 클릭
        $scope.click_createNewProject = function () {
            $location.path('/project/edit/0');
        };

        // 조회 화면 이동
        $scope.click_showViewProject = function (key) {
            $location.url('/project/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditProject = function (item) {
            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                alert("수정 권한이 없습니다.");
                return;
            }

            $location.path('/project/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteProject = function (item) {
            if (item.PROJECT_ST == '2') {
                alert("완료 상태의 프로젝트는 삭제할 수 없습니다.")
            }

            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                alert("삭제 권한이 없습니다.");
                return;
            }

            $scope.deleteItem('project', item.NO, false)
                .then(function(){$scope.getProjectList($scope.search)})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchProject = function () {
            $scope.getProjectList($scope.search);
        }

        // 프로젝트 목록 조회
        $scope.getProjectList = function (search) {
            $scope.getList('project', {NO:0, SIZE:5}, search, true)
                .then(function(data){$scope.list = data;})
                .catch(function(error){alert(error)});
        };

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('isLoading', function() {
            if ($scope.listData == 'null') {
                $scope.projects = null;
            } else {
                $scope.projects = projectsData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if ($scope.listData != null) {
                $scope.projects = projectsData.slice(begin, end);
/*
                var i = 0;
                for (i = begin; i <= end; i++) {
                    $scope.$watch('projects', function() {
                        alert($scope.projects[i].NO)
                        $scope.projects[i].ST_NM = 'TEST';
                    });
                }
*/
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });

        /********** 화면 초기화 **********/
        $scope.init();
        $scope.getProjectList();

    }]);
});
