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
        $scope.isAlbum = true;

        if ($stateParams.id == undefined) {
            $scope.search.PARENT_NO = '0';
            $scope.isAlbum = true;
        } else {
            $scope.search.PARENT_NO = $stateParams.id;
            $scope.isAlbum = false;
        }

        // 페이징
        //$scope.PAGE_NO = 1;
        $scope.PAGE_SIZE = 9;
        $scope.SEARCH_TOTAL_COUNT = 0;

        $scope.list = [];

        // 검색어 조건
        var condition = [{name: "제목", value: "SUBJECT"} , {name: "내용", value: "SUMMARY"}];
        var mode = [{name: "모아보기", value: "COLLECTION"} , {name: "크게보기", value: "ALBUM"}];

        $scope.conditions = condition;
        $scope.search.CONDITION = condition[0];
        $scope.search.PARENT_NO = $stateParams.id == undefined ? 0 : $stateParams.id;

        $scope.modes = mode;
        $scope.m_view_mode = mode[0];

        $scope.pageChanged = function() {
            $scope.list = [];
            if($scope.search.KEYWORD == undefined){
                $scope.search.KEYWORD = '';
            }
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);
            $scope.getMyAlbumList();
        };

        /********** 초기화 **********/
        // 초기화
        $scope.init = function(session) {
            $scope.getMyAlbumTotalCnt();

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
        // 보기모드 변경
//        $scope.change_mode = function(mode) {
//            alert(mode)
//            $scope.m_view_mode = mode;
//        }

        function firstImage() {
            $scope.current = _.first($scope.list);
        }

        $scope.click_currentImage = function (item) {
            $scope.current = item;
        };

        // 앨범 리스트 클릭
        $scope.click_showMyAlbum = function() {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
        };

        // 앨범 삭제 클릭
        $scope.click_deleteMyAlbum = function(item, idx) {

            if (item == undefined || item.ALBUM_GB == 'ALBUM') {
                var dialog = dialogs.confirm('알림', '앨범을 삭제 하시겠습니까? 앨범에 속한 모든 사진이 함께 삭제 됩니다.', {size: 'md'});

                dialog.result.then(function(btn){
                    $scope.deleteItem('ange/album', 'album', item != undefined ? item.NO : $stateParams.id, true)
                        .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                            if (item != undefined) {
                                $scope.list.splice(idx, 1);
                            } else {
                                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');
                            }
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }, function(btn) {
                    return;
                });
            } else {
                var dialog = dialogs.confirm('알림', '사진을 삭제 하시겠습니까?', {size: 'md'});

                dialog.result.then(function(btn){
                    $scope.deleteItem('ange/album', 'picture', item.NO, true)
                        .then(function(data){
                            dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                            $scope.list.splice(idx, 1);
                        })
                        ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                }, function(btn) {
                    return;
                });
            }
        };

        $scope.getMyAlbumTotalCnt = function () {
            $scope.getItem('ange/album', 'total', null, $scope.search, true)
                .then(function(data){
                    $scope.TOTAL_COUNT = data.TOTAL_COUNT;
                })
                ['catch'](function(error){});
        };

        $scope.getAddAlbum = function () {
            if ($scope.isAlbum) {
                var add = {};
                add.ALBUM_GB = 'ADD';
                add.ALBUM_FILE = CONSTANT.BASE_URL + '/imgs/ange/newalbum_add.png';
                add.NEW_ALBUM = false;

                $scope.list.push(add);
            }
        };

        $scope.isLoding = false;

        // 게시판 목록 조회
        $scope.getMyAlbumList = function () {

            $scope.search.SORT = 'REG_DT';
            $scope.search.ORDER = 'DESC';

            $scope.isLoding = true;

            $scope.getList('ange/album', 'list', {}, $scope.search, true)
                .then(function(data){
                    for(var i in data) {
//                        if (data[i].FILE_ID == null)
                        data[i].ALBUM_FILE = CONSTANT.BASE_URL + data[i].PATH + 'thumbnail/' + data[i].FILE_ID;
                        data[i].NEW_ALBUM = (data[i].ALBUM_GB == 'ALBUM' && data[i].PATH == null) ? true : false;

                        $scope.list.push(data[i]);
                    }

                    firstImage();

                    $scope.isLoding = false;

                    $scope.SEARCH_COUNT = data[0].TOTAL_COUNT;

                    $scope.getAddAlbum();
                })
                ['catch'](function(error){ $scope.list = []; $scope.SEARCH_COUNT = 0; $scope.getAddAlbum(); $scope.isLoding = false; });
        };

        // 검색
        $scope.click_searchMyAlbum = function(){
            $scope.list = [];
            $scope.PAGE_NO = 1;
            $scope.getMyAlbumList();
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+$stateParams.id+'?page_no='+$scope.PAGE_NO+'&condition='+$scope.search.CONDITION.value+'&keyword='+$scope.search.KEYWORD);

        }

        // 조회 버튼 클릭
        $scope.click_showViewMyAlbum = function (item) {
            if (item.ALBUM_GB == 'ADD') {
                $scope.openViewMyAlbumRegModal(null, null, 'lg');
            } else if (item.ALBUM_GB == 'ALBUM') {
                $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list/'+item.NO);
            } else {
                $scope.openViewMyAlbumModal(item, 'lg');
            }
        };

        $scope.openViewMyAlbumModal = function (item, size) {
            var dlg = dialogs.create('partials/ange/myange/myangealbum-view-popup.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', 'data', function($scope, $rootScope, $modalInstance, $controller, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.isHome = false;
                    $scope.item = data;

                    $scope.click_delete = function () {

                        var dialog = dialogs.confirm('알림', '사진을 삭제 하시겠습니까?', {size: 'md'});

                        dialog.result.then(function(btn){
                            $scope.deleteItem('ange/album', 'picture', item.NO, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                                    $modalInstance.close('DELETE');
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }, function(btn) {
                            return;
                        });
                    };

                    $scope.click_update = function () {
                        $modalInstance.close('UPDATE');
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(action){
                if (action == 'DELETE') {
                    $scope.list = [];
                    $scope.PAGE_NO = 1;
                    $scope.getMyAlbumList();
                } else if (action == 'UPDATE') {
                    $scope.openViewMyPictureRegModal(item, 'lg');
                }
            },function(){

            });
        };

        // 앨범/사진 수정 버튼 클릭
        $scope.click_showEditMyAlbum = function (item, idx) {

            if (item.ALBUM_GB == 'ALBUM') {
                $scope.openViewMyAlbumRegModal(item, idx, 'lg');
            } else {
                $scope.openViewMyPictureRegModal(item, idx, 'lg');
            }
        };

        // 앨범 등록 버튼 클릭
        $scope.click_showCreateMyAlbum = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 앨범을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.openViewMyAlbumRegModal(null, null, 'lg');
        };

        $scope.openViewMyAlbumRegModal = function (item, idx, size) {
            var dlg = dialogs.create('myangealbum-edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', '$filter', '$http', 'CONSTANT', 'data', function($scope, $rootScope, $modalInstance, $controller, $filter, $http, CONSTANT, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    $scope.item = {};

                    if (data != null) {
                        $scope.item = data;
                    }

                    $scope.click_reg = function () {

                        if (data == null) {
                            $scope.insertItem('ange/album', 'album', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                    $scope.item.ACTION = 'CREATE';
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        } else {
                            $scope.updateItem('ange/album', 'album', $scope.item.NO, $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                    $scope.item.ACTION = 'UPDATE';
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(data){
                if (data.ACTION == 'CREATE') {
                    $scope.list = [];
                    $scope.getMyAlbumList();
                } else if (data.ACTION == 'UPDATE') {
                    $scope.list[idx] = data;
                }
            },function(){

            });
        };

        // 사진 등록 버튼 클릭
        $scope.click_showCreateMyPicture = function () {

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 사진을 등록 할 수 있습니다.', {size: 'md'});
                return;
            }

            $scope.openViewMyPictureRegModal(null, 'lg');
        };

        $scope.openViewMyPictureRegModal = function (item, idx, size) {
            var dlg = dialogs.create('myangepicture-edit.html',
                ['$scope', '$rootScope', '$modalInstance', '$controller', '$filter', '$http', 'CONSTANT', 'data', function($scope, $rootScope, $modalInstance, $controller, $filter, $http, CONSTANT, data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope, $rootScope : $rootScope}));

                    // 파일 업로드 설정
                    $scope.options = { url: CONSTANT.UPLOAD_INDEX, autoUpload: true, dropZone: angular.element('#dropzone') };

                    $scope.queue = [];
                    $scope.item = {};
                    $scope.item.queue = [];

                    if (data != null) {
                        $scope.item = data;
                        $scope.queue.push({"no":data.NO, "name":data.FILE_NM,"size":data.FILE_SIZE,"url":CONSTANT.BASE_URL+data.PATH+data.FILE_ID,"thumbnailUrl":CONSTANT.BASE_URL+data.PATH+"thumbnail/"+data.FILE_ID,"mediumUrl":CONSTANT.BASE_URL+data.PATH+"medium/"+data.FILE_ID,"deleteUrl":CONSTANT.BASE_URL+"/serverscript/upload/?file="+data.FILE_NM,"deleteType":"DELETE","kind":data.FILE_GB,"type":data.FILE_EXT,"isUpdate":true});
                    }

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
                        $scope.item.PARENT_NO = $stateParams.id;
                        $scope.item.SHOOTING_YMD = $filter('date')($scope.item.SHOOTING_YMD, 'yyyy-MM-dd');
                        $scope.item.FILES = $scope.queue;

                        for(var i in $scope.item.FILES) {
                            $scope.item.FILES[i].$destroy = '';
                            $scope.item.FILES[i].$editor = '';
                        }

                        if (data == null) {
                            $scope.insertItem('ange/album', 'picture', $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        } else {
                            $scope.updateItem('ange/album', 'picture', $scope.item.NO, $scope.item, true)
                                .then(function(data){
                                    dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});
                                    $modalInstance.close($scope.item);
                                })
                                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                        }
                    };

                    // 닫기
                    $scope.click_close = function(){
                        $modalInstance.close();
                    }
                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(data){
                if (data) {
                    $scope.list = [];
                    $scope.getMyAlbumList();
                }
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
