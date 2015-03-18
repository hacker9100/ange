/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangealbum-list.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangealbum-list', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'CONSTANT', function ($scope, $rootScope, $stateParams, $location, dialogs, CONSTANT) {

        $scope.search = {};

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.SEARCH_TOTAL_COUNT = 0;

        $scope.list = [];

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} , {name: "내용", value: "SUMMARY"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];

        $scope.pageChanged = function() {
            $scope.list = [];
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getPeopleBoardList();
        };

        /********** 초기화 **********/
        // 초기화
        $scope.init = function(session) {

            // 검색조건유지
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
        $scope.click_showViewAlbum = function(item) {
            $location.url('myange/album/view/1');
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getMyAlbumList = function () {

            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.isLoding = true;

            $scope.getList('ange/album', 'list', {NO: $scope.PAGE_NO-1, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                .then(function(data){
                    for(var i in data) {
                        data[i].FILE = CONSTANT.BASE_URL + data[i].PATH + 'thumbnail/' + data[i].FILE_ID;

                        $scope.list.push(data[i]);
                    }

                    $scope.isLoding = false;

                    $scope.TOTAL_COUNT = data[0].TOTAL_COUNT;
                })
                ['catch'](function(error){$scope.list = ""; $scope.TOTAL_COUNT = 0; $scope.isLoding = false;});
        };

        // 등록 버튼 클릭
        $scope.click_showCreateMyAlbum = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.openViewMyAlbumRegModal(null, null, 'lg');
        };

        // 검색
        $scope.click_searchMyAlbum = function(){
            $scope.list = [];
            $scope.PAGE_NO = 1;
            $scope.getPeopleBoardList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);

        }

        $scope.openViewMyAlbumRegModal = function (content, item,  size) {
            var dlg = dialogs.create('myangealbum-edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', '$filter', '$http', 'CONSTANT', 'data', function($scope, $rootScope, $modalInstance, $controller, $filter, $http, CONSTANT, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    // 파일 업로드 설정
                    $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                    $scope.content = data;

                    $scope.queue = [];
                    $scope.item = {};
                    $scope.item.queue = [];

                    // 파일 업로드 완료 후 에디터에 중간 사이즈 이미지 추가
                    $scope.checkAll = false;

                    $scope.checkFile = [];

                    // ui bootstrap 달력
                    $scope.format = 'yyyy-MM-dd';

                    $scope.today = function() {
                        $scope.item.SHOOTING_YMD = new Date();
                    };
                    $scope.today();

                    $scope.clear = function () {
                        $scope.item.SHOOTING_YMD = null;
                    };

                    $scope.open = function($event, opened) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        $scope[opened] = true;
                    };

                    $scope.click_checkAllToggle = function () {
                        $scope.checkAll = !$scope.checkAll;

                        if ($scope.checkAll) {
                            $scope.item.queue = angular.copy($scope.queue);
                        } else {
                            $scope.item.queue = [];
                        }
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

                    $scope.click_reg = function () {

                        $scope.item.SHOOTING_YMD = $filter('date')($scope.item.SHOOTING_YMD, 'yyyy-MM-dd');
                        $scope.item.FILES = $scope.queue;

                        for(var i in $scope.item.FILES) {
                            $scope.item.FILES[i].$destroy = '';
                            $scope.item.FILES[i].$editor = '';
                        }

                        $scope.insertItem('ange/album', 'item', $scope.item, true)
                            .then(function(data){
                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                $modalInstance.close();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], content, item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){
                $scope.list = [];
                $scope.getMyAlbumList();
            },function(){

            });
        };

        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.getMyAlbumList)
            ['catch']($scope.reportProblems);

    }]);
});
