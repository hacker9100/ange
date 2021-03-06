/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsreivew-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsreview-view', ['$scope', '$rootScope', '$sce', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', '$modal', function ($scope, $rootScope, $sce, $stateParams, $location, dialogs, ngTableParams, UPLOAD, $modal) {

        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.comment = {};
        $scope.reply = {};
        $scope.showDetails = false;
        $scope.search = {SYSTEM_GB: 'ANGE'};

        $scope.TARGET_NO = $stateParams.id;
        $scope.TARGET_GB = 'REVIEW';

        $scope.replyList = [];

        /********** 콘텐츠 랜더링 **********/
        $scope.renderHtml = function(html_code) {
            return html_code != undefined ? $sce.trustAsHtml(html_code) : '';
//            return html_code;
        };

        $(document).ready(function(){

            $("#reply_sort_date").addClass("selected");
            $scope.search.SORT = 'ada_date_regi';
            $scope.search.ORDER = 'DESC';

            $("#reply_sort_idx").click(function(){
                $scope.search.SORT = 'NO';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_idx").addClass("selected");
                $("#reply_sort_date").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });

            $("#reply_sort_date").click(function(){
                $scope.search.SORT = 'ada_date_regi';
                $scope.search.ORDER = 'DESC';
                $("#reply_sort_date").addClass("selected");
                $("#reply_sort_idx").removeClass("selected");

                $scope.replyList = [];
                $scope.getPeopleReplyList();
            });
        });

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experiencereview') {
                $scope.community = "체험단/서평단 후기";
                $scope.item.TARGET_GB = 'EXPERIENCE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'productreview') {
                $scope.community = "상품 후기";
                $scope.item.TARGET_GB = 'PRODUCT';
                $scope.menu = 'productreview';
            } else if ($stateParams.menu == 'angereview') {
                $scope.community = "앙쥬 후기";
                $scope.item.TARGET_GB = 'ANGE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.community = "샘플팩 후기";
                $scope.item.TARGET_GB = 'SAMPLE';
                $scope.menu = 'experiencereview';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.community = "앙쥬 샘플팩 후기";
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
                $scope.menu = 'experiencereview';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.community = "이벤트 후기";
                $scope.item.TARGET_GB = 'EVENT';
                $scope.menu = 'experiencereview';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.community = "서평단 후기";
                $scope.item.TARGET_GB = 'BOOK';
                $scope.menu = 'bookreview';
            } else if ($stateParams.menu == 'dolreview') {
                $scope.community = "앙쥬돌 후기";
                $scope.item.TARGET_GB = 'DOL';
                $scope.menu = 'dolreview';
            }else if ($stateParams.menu == 'storereview') {
                $scope.community = "스토어 후기";
                $scope.item.TARGET_GB = 'STORE';
                $scope.menu = 'storereview';
            }

            if ($stateParams.menu == 'experiencereview') {

                $scope.search.EVENT_GB = 'exp';
                // 이벤트 및 서평단 / 체험단 셀렉트 박스 셋팅
                $scope.getList('ange/event', 'list', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        $scope.item.TARGET_NO = data[0].SUBJECT;
                    })
                    ['catch'](function(error){alert(error)});
            } else if ($stateParams.menu == 'eventreview') {

                $scope.search.EVENT_GB = 'event';
                // 이벤트 및 서평단 / 체험단 셀렉트 박스 셋팅
                $scope.getList('ange/event', 'list', {}, $scope.search, false)
                    .then(function(data){
                        $scope.event = data;
                        $scope.item.TARGET_NO = data[0].SUBJECT;
                    })
                    ['catch'](function(error){alert(error)});
            }
        };

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleBoardEdit = function (item) {
            $location.url('/moms/'+$stateParams.menu+'/edit/'+item.NO);
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleBoardList = function () {

            console.log('$stateParams.menu = '+$stateParams.menu);

            if($rootScope.KEYWORD == undefined){
                $rootScope.KEYWORD = '';
            }

            if($rootScope.NOW_PAGE_NO == undefined){
                $rootScope.NOW_PAGE_NO = 1;
            }

            if($rootScope.CONDITION == undefined){
                $rootScope.CONDITION = 'SUBJECT+BODY';
            }

            $location.url('/moms/'+$stateParams.menu+'/list?page_no='+$rootScope.NOW_PAGE_NO+'&condition='+$rootScope.CONDITION+'&keyword='+$rootScope.KEYWORD);
        };

        $scope.addHitCnt = function () {
            $scope.updateItem('ange/review', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getPeopleBoard = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/review', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        var files = data.FILES;
                        //console.log(JSON.stringify(data));
                        for(var i in files) {
                            if (files[i].FILE_GB == 'MAIN') {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":UPLOAD.BASE_URL+"/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;

                                console.log(img);
                            }
                        }

                        $scope.item = data;

                        $scope.item.BODY = $sce.trustAsHtml(data.BODY);

                        //$scope.search.TARGET_NO = $stateParams.id;
                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {
            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/view/'+key);
        };

        // 댓글 리스트
        $scope.getPeopleReplyList = function () {

            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getItem('com/reply', 'item', {}, $scope.search, true)
                .then(function(data){

                    var reply = data.COMMENT;

                    console.log('reply =' +reply);
                    console.log('end');

                    for(var i in reply) {
                        $scope.replyList.push({"NO":reply[i].NO,"PARENT_NO":reply[i].PARENT_NO,"COMMENT":reply[i].COMMENT,"RE_COUNT":reply[i].RE_COUNT,"REPLY_COMMENT":reply[i].REPLY_COMMENT,"LEVEL":reply[i].LEVEL,"REPLY_NO":reply[i].REPLY_NO,"NICK_NM":reply[i].NICK_NM,"REG_DT":reply[i].REG_DT});
                    }

                    console.log('RE = '+data.COMMENT);
                    console.log('end');
                })
                ['catch'](function(error){$scope.replyList = "";});
        };

        // 의견 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.item.PARENT_NO = 0;
            $scope.item.LEVEL = 1;
            $scope.item.REPLY_NO = 1;
            $scope.item.TARGET_NO = $scope.item.NO;
            if ($stateParams.menu == 'experiencereview') {
                $scope.item.TARGET_GB = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.item.TARGET_GB = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.item.TARGET_GB = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.item.TARGET_GB = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.item.TARGET_GB = 'EVENT';
            }else if ($stateParams.menu == 'storereview') {
                $scope.item.TARGET_GB = 'STORE';
            }


            $scope.insertItem('com/reply', 'item', $scope.item, false)
                .then(function(){

                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();

                    $scope.getPeopleBoard();

                    //$scope.replyList.push({"NO":0,"PARENT_NO":$scope.item.PARENT_NO,"COMMENT":$scope.item.COMMENT,"RE_COUNT":0,"REPLY_COMMENT":'',"LEVEL":$scope.item.LEVEL,"REPLY_NO":$scope.item.REPLY_NO});

                    $scope.item.COMMENT = "";
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 답글 등록
        $scope.click_savePeopleBoardReComment = function (item) {

            $scope.reply.PARENT_NO = item.NO;
            $scope.reply.LEVEL = parseInt(item.LEVEL)+1;
            $scope.reply.REPLY_NO = parseInt(item.REPLY_NO)+1;
            $scope.reply.TARGET_NO = $stateParams.id;
            if ($stateParams.menu == 'experiencereview') {
                $scope.item.TARGET_GB = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.item.TARGET_GB = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.item.TARGET_GB = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.item.TARGET_GB = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.item.TARGET_GB = 'EVENT';
            }else if ($stateParams.menu == 'storereview') {
                $scope.item.TARGET_GB = 'STORE';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.item.TARGET_GB = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.item.TARGET_GB = 'DOL';
            }

            $scope.REPLY_COMMENT = $scope.reply;

            $scope.insertItem('com/reply', 'item', $scope.reply, false)
                .then(function(){
                    $scope.search.TARGET_NO = $stateParams.id;
                    $scope.replyList = [];
                    $scope.getPeopleReplyList();
                    $scope.reply.COMMENT = "";

                    $scope.getPeopleBoard();
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 이전글
        $scope.getPreBoard = function (){

            if ($stateParams.menu == 'experiencereview') {
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.search['TARGET_GB'] = 'EVENT';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.search['TARGET_GB'] = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.search['TARGET_GB'] = 'DOL';
            }else if ($stateParams.menu == 'storereview') {
                $scope.search['TARGET_GB'] = 'STORE';
            }

            $scope.search.KEY = $stateParams.id;
            //$scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/review', 'pre',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    ['catch'](function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            if ($stateParams.menu == 'experiencereview') {
                $scope.search['TARGET_GB'] = 'EXPERIENCE';
            } else if ($stateParams.menu == 'productreview') {
                $scope.search['TARGET_GB'] = 'PRODUCT';
            } else if ($stateParams.menu == 'angereview') {
                $scope.search['TARGET_GB'] = 'ANGE';
            } else if ($stateParams.menu == 'samplereview') {
                $scope.search['TARGET_GB'] = 'SAMPLE';
            } else if ($stateParams.menu == 'samplepackreview') {
                $scope.search['TARGET_GB'] = 'SAMPLEPACK';
            }else if ($stateParams.menu == 'eventreview') {
                $scope.search['TARGET_GB'] = 'EVENT';
            }else if ($stateParams.menu == 'bookreview') {
                $scope.search['TARGET_GB'] = 'BOOK';
            }else if ($stateParams.menu == 'dolreview') {
                $scope.search['TARGET_GB'] = 'DOL';
            }else if ($stateParams.menu == 'storereview') {
                $scope.search['TARGET_GB'] = 'STORE';
            }

            $scope.search.KEY = $stateParams.id;
            //$scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getList('ange/review', 'next',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    ['catch'](function(error){$scope.nextBoardView = "";})
            }
        }

        $scope.click_showPeopleBoardDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('ange/review', 'item', item.NO, true)
                    .then(function(){

                        dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/list');

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
        }

        $scope.likeFl = function (){
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.search.NO = $stateParams.id;

                $scope.search['TARGET_GB'] = 'REVIEW';

                $scope.getItem('ange/review', 'like', $stateParams.id, $scope.search, false)
                    .then(function(data){

                        if(data.TOTAL_COUNT == 0){
                            $scope.LIKE_FL = 'N';
                        }else{
                            $scope.LIKE_FL = data.LIKE_FL;
                            console.log($scope.LIKE_FL);
                        }

                    })
                    ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.LIKE_FL = 'N';
            }

        }

        // 공감
        $scope.click_likeCntAdd = function(item, like_fl){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 공감이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.likeItem = {};
            $scope.likeItem.LIKE_FL = like_fl;
            $scope.likeItem.TARGET_NO = item.NO;
            $scope.likeItem.TARGET_GB = 'REVIEW';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.likeItem.LIKE_FL == 'Y' ? 'N' : 'Y';
                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleBoard();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleBoard();
                    }
                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

            if ($rootScope.uid == '' || $rootScope.uid == null) {
                dialogs.notify('알림', '로그인 후 스크랩이 가능합니다.', {size: 'md'});
                return;
            }

            $scope.search['TARGET_NO'] = item.NO;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            //$scope.search['REG_UID'] = 'hong'; // 테스트

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {

                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = item.NO;
                        $scope.scrap.TARGET_GB = item.BOARD_GB;

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleBoard();
                            })
                            ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                ['catch'](function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        // 등록 버튼 클릭
        $scope.click_showCreateReview = function () {

            if ($scope.uid == '' || $scope.uid == null) {
//                dialogs.notify('알림', '로그인 후 게시물을 등록 할 수 있습니다.', {size: 'md'});
                $scope.openLogin(null, 'md');
                return;
            }

            $location.url('/'+$stateParams.channel+'/'+$stateParams.menu+'/edit/0');

        };

        // 콘텐츠 클릭 조회
        $scope.click_boardReport2 = function (item) {
            item.TARGET_GB = 'REVIEW';
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
