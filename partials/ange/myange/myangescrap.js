/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangescrap.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangescrap', ['$scope', '$stateParams', '$sce', '$rootScope', '$location', '$modal', '$timeout', 'dialogs', 'UPLOAD', function($scope, $stateParams, $sce, $rootScope, $location, $modal, $timeout, dialogs, UPLOAD) {

        $scope.search = {};
        // 초기화
        $scope.init = function() {
            $scope.community = "스크랩";
        };

        // 페이징
        $scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 25;
        $scope.TOTAL_COUNT = 0;

        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.PAGE_NO);
            $scope.getScarpList();
        };

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

        /********** 이벤트 **********/
        $scope.getScarpList = function () {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/

            $scope.getList('com/scrap', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    /*$scope.total(total_cnt);*/
                    $scope.list = data;

                    $scope.TOTAL_PAGES = Math.ceil($scope.TOTAL_COUNT / $scope.PAGE_SIZE);

                })
                ['catch'](function(error){$scope.TOTAL_COUNT = 0; $scope.list = "";});
        };

        // 검색
        $scope.click_searchScrap = function(){
            $scope.getScarpList();
        }

        // 상세조회 버튼 클릭
        $scope.click_showViewScrap = function (comm_no, key) {
            //$scope.openViewScrapModal({NO : key}, 'lg');

            console.log(comm_no);
            console.log(key);

            if (comm_no == 1) {
                $location.url('/people/angeroom/view/'+key);
            } else if(comm_no == 2) {
                $location.url('/people/momstalk/view/'+key);
            } else if(comm_no == 3) {
                $location.url('/people/babycare/view/'+key);
            } else if(comm_no == 4) {
                $location.url('/people/firstbirthtalk/view/'+key);
            } else if(comm_no == 5) {
                $location.url('/people/booktalk/view/'+key);
            } else if(comm_no == 6) {
                $location.url('/people/working/view/'+key);
            } else if(comm_no == 7) {
                $location.url('/people/readypreg/view/'+key);
            } else if(comm_no == 8) {
                $location.url('/people/anony/view/'+key);
            }else if(comm_no == 11) {
                $location.url('/people/angemodel/view/'+key);
            }else if(comm_no == 12) {
                $location.url('/people/recipearcade/view/'+key);
            }else if(comm_no == 13) {
                $location.url('/people/peopletaste/view/'+key);
            }else if(comm_no == 21) {
                $location.url('/people/childdevelop/view/'+key);
            }else if(comm_no == 22) {
                $location.url('/people/chlidoriental/view/'+key);
            }else if(comm_no == 23) {
                $location.url('/people/obstetrics/view/'+key);
            }else if(comm_no == 24) {
                $location.url('/people/momshealth/view/'+key);
            }else if(comm_no == 25) {
                $location.url('/people/financial/view/'+key);
            }
        };

        // 콘텐츠 클릭 조회
//        $scope.click_showViewContent = function (item) {
//            $scope.openModal(item, 'lg');
//        };

        $scope.click_showViewContent = function (item) {
            $scope.getItem('cms/task', 'item', item.TARGET_NO, {}, true)
                .then(function(data){
                    $scope.openModal(data, 'lg');
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 콘텐츠보기 모달창
        $scope.openModal = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/ange/story/storycontent-view-popup.html',
                controller: 'storycontent-view-popup',
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

        // 일반게시글 삭제
        $scope.delete_board = function (item){

            var dialog = dialogs.confirm('알림', '선택한 스크랩 게시물을 삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/scrap', 'item', item, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $scope.getScarpList();
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });

        }
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
        $scope.getScarpList();

    }]);
});
