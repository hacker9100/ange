/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2014-12-28
 * Description : storycontent-view-popup.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storycontent-view-popup", ['$rootScope', '$scope', '$window', '$sce', '$controller', '$location', '$modalInstance', '$q', 'dialogs', 'CONSTANT', 'UPLOAD', 'data', function($rootScope, $scope, $window, $sce, $controller, $location, $modalInstance, $q, dialogs, CONSTANT, UPLOAD, data) {

        angular.extend(this, $controller('ange-common', {$scope: $scope}));

        /********** 초기화 **********/
        $scope.showProduct = false;

        $scope.S_PAGE_NO = 0;

        $scope.TARGET_NO = data.NO;
        $scope.TARGET_GB = 'CONTENT';

        $scope.plusList = [];
        $scope.currentPage = 1;
        $scope.totalPage = 1;

        $scope.task = {};

        // 초기화
        $scope.init = function () {

        };

        /********** 콘텐츠 랜더링 **********/

        /*
         $scope.renderHtml = function(html_code) {
         return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
         //            return html_code;
         };
         */

        /********** 이벤트 **********/
        $scope.click_ok = function () {
            $modalInstance.close();
        };

        $scope.click_changeContentDetail = function (item) {
            data = item;
            $scope.TARGET_NO = data.NO;
            $scope.getContent();
            $scope.addHitCnt();
            $scope.getReplyList();

            $scope.click_top();
        };

        // 콘텐츠 조회
        $scope.getContent = function () {
            var deferred = $q.defer();

            var category_no = '';

            for (var i in data.CATEGORY) {
                category_no += data.CATEGORY[i].NO + (i != (data.CATEGORY.length - 1) ? ',' : '');
            }

            $q.all([
                    $scope.getList('cms/task', 'list', {NO:$scope.S_PAGE_NO, SIZE:6}, {CATEGORY_NO: category_no, FILE: true, PHASE: '30, 31', SORT: 'RAND()', ORDER: ''}, false).then(function(data){
                        $scope.totalPage = Math.round(data.length / 2);

                        for (var i in data) {
                            if (data[i].FILE.PATH != undefined) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;
                                $scope.plusList.push(data[i]);
                            }
                        }
                    }),
                    $scope.getItem('cms/task', 'item', data.NO, {FILE: true}, false).then(function(data){
                        $scope.task = data;
                        $scope.share_url = UPLOAD.BASE_URL + '/story/content/list/' + $scope.task.NO;
                    }),
                    $scope.getItem('cms/content', 'item', data.NO, {}, false).then(function(data){
                        $scope.content = data;
                        $scope.renderHtml = $sce.trustAsHtml($scope.content.BODY);
                    }),
                    $scope.getList('cms/task', 'list', {NO:0, SIZE:5}, {EDITOR_ID: data.EDITOR_ID, NOT_TASK_NO: data.NO, PHASE: '30, 31'}, false).then(function(data){
                        $scope.editorList = data;
                    }),
                    $scope.getList('ad/banner', 'list', {NO:0, SIZE:1}, {ADP_IDX: CONSTANT.AD_CODE_BN54, ADA_STATE: 1}, false).then(function(data){
                        var img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                        data[0].img = img;
                        $scope.ad = data[0];
                    })
                ])
                .then( function(results) {
                    $scope.task.URL = UPLOAD.BASE_URL + $location.path() + '/' + $scope.task.NO;
                    deferred.resolve();
                },function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };

        // 기사 프린트 버튼 클릭
        $scope.click_printDiv = function (divName) {
//            $( ".articlewrap" ).print();
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            var popupWin = window.open('', '_blank', 'width=1000,height=900');
            popupWin.document.open()
            popupWin.document.write('<html><head>' +
                '<link rel="stylesheet" type="text/css" href="/css/ange/normalize.css" >' +
                '<link rel="stylesheet" type="text/css" href="/css/ange/ange_bootstrap.css" />' +
                '<link rel="stylesheet" type="text/css" href="/css/ange/ange_style.css" />' +
                '<link rel="stylesheet" type="text/css" href="/lib/jquery/css/base/jquery-ui-1.10.2.min.css" />' +
                '<link rel="stylesheet" type="text/css" href="/css/article.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_storylist.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_people_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_peoplepoll.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_peopleboard.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_moms_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_myange_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_store_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_infodesk_main.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_join.css" />' +
//                                        '<link rel="stylesheet" type="text/css" href="css/ange/ange_moms.css" />' +
                '</head><body onload="window.print()"><div class="modal-body"><div class="story-row previewwrap"><div class="story-col-xs-12 article_previewwrap">' + printContents + '</div></div></div></html>');
            popupWin.document.close();
        };

        // 사용할 앱의 Javascript 키를 설정해 주세요.
        $scope.click_loginWithKakao = function () {
//            Kakao.Auth.logout();
            if(Kakao.Auth.getAccessToken()) {
                $scope.share_open();
            } else {
                Kakao.Auth.login({
                    success: function() {
                        $scope.share_open();
                    },
                    fail: function(err) {
                        alert(JSON.stringify(err))
                    }
                });
            }

//            Kakao.Auth.createLoginButton({
//                container: '#kakao-login-btn',
//                success: function() {
//                    alert(0)
//                    share_open();
//                },
//                fail: function(err) {
//                    alert(JSON.stringify(err))
//                }
//            });
        }

        $scope.click_eBookOpen = function (item) {
            var popup = $window.open(item.EBOOK_URL, '_blank', 'width=1100,height=750');

            if ( popup ){
                popup.focus();
            } else {
                dialogs.notify('알림', "팝업차단을 해제해주세요.", {size: 'md'});
            }
        }

        $scope.share_open = function () {
            var popup = $window.open('http://story.kakao.com/share?url=' + UPLOAD.BASE_URL + $location.path() + '/' + $scope.task.NO, '_blank', 'width=500,height=400');

            if ( popup ){
                popup.focus();
            } else {
                dialogs.notify('알림', "팝업차단을 해제해주세요.", {size: 'md'});
            }
        }

        $scope.click_loginWithTwitter = function () {
            var urlString = '//www.twitter.com/intent/tweet?';

            urlString += 'text=' + encodeURI($scope.task.SUBJECT);
            urlString += '&hashtags=' + encodeURI('앙쥬, 유아포털');
            urlString += '&url=' + encodeURI($scope.share_url || $location.absUrl());

            $window.open(urlString, 'sharer', 'toolbar=0,status=0,width=500,height=500'
            );
        }

        $scope.click_loginWithFacebook = function () {
            $window.open(
                '//www.facebook.com/sharer/sharer.php?u=' + encodeURI($scope.share_url)
                ,'sharer', 'toolbar=0,status=0,width=500,height=500');
        }

        // 공유 버튼 클릭
        $scope.click_shareContent = function () {
            dialogs.notify('알림', '준비중 입니다.', {size: 'md'});
        };

        $scope.click_addScrap = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.search['TARGET_NO'] = $scope.task.NO;

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {
                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = $scope.task.NO;
                        $scope.scrap.TARGET_GB = 'CONTENT';

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 플러스 기사 이전 클릭
        $scope.click_prevPlus = function(){
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
            }
        };

        // 플러스 기사 다음 클릭
        $scope.click_nextPlus = function(){
            if ($scope.currentPage < $scope.totalPage) {
                $scope.currentPage++;
            }
        };

        // 공감 클릭
        $scope.click_addLike = function () {
            if ($rootScope.uid == '' || $rootScope.uid == null) {
//                dialogs.notify('알림', '로그인 후 사용 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = $scope.task.LIKE_FL;
            $scope.likeItem.TARGET_NO = $scope.task.NO;
            $scope.likeItem.TARGET_GB = 'CONTENT';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.task.LIKE_FL == 'Y' ? 'N' : 'Y';
                    $scope.task.LIKE_FL = afterLike;
                    $scope.task.LIKE_CNT = afterLike == 'Y' ? parseInt($scope.task.LIKE_CNT) + 1 : parseInt($scope.task.LIKE_CNT) - 1;

                    if (afterLike == 'Y') {
//                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
                    } else {
//                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('cms/task', 'hit', data.NO, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.init();
        $scope.addHitCnt();
        $scope.getContent();
    }]);
});

