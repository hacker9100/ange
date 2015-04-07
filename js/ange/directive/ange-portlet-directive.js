/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-11-15
 * Description : portletList 로드
 */
define([
    'angular',
    './directives'
], function (angular, directives) {
    'use strict';

    // 메인 미니 리스트를 동적으로 생성
    directives.directive('angePortletMainList', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { code:'=' },
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/mini-main-list.html';
            },
            controller: ['$scope', '$attrs', '$location', 'dialogs', 'CONSTANT', function($scope, $attrs, $location, dialogs, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 현재 날짜
                $scope.now = new Date();

                // 검색 조건
                $scope.search = {};

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 탭 번호
                $scope.tabIdx = $scope.option.defIdx;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.tab != undefined) {
                    if ($scope.option.type == 'board') {
                        $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;
                    } else if ($scope.option.type == 'review') {
                        $scope.search.TARGET_GB = $scope.option.tab[$scope.tabIdx].no;
                    }
                } else {
                    if ($scope.option.type == 'board') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_BOARD;
                        $scope.search.NOTICE_FL = '0';
                    } else if ($scope.option.type == 'photo') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_PHOTO;
                    } else if ($scope.option.type == 'clinic') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_CLINIC;
                        $scope.search.PARENT_NO = '0';
                    } else if ($scope.option.type == 'notice') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_REPORT;
                    }
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined && $scope.option.image == true) {
                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                // 탭 클릭
                $scope.click_tabIndex = function (idx) {
                    $scope.tabIdx = idx;

                    if ($scope.option.type == 'board') {
                        $scope.search.COMM_NO = angular.uppercase($scope.option.tab[$scope.tabIdx].no);
                    } else if ($scope.option.type == 'review') {
                        $scope.search.TARGET_GB = angular.uppercase($scope.option.tab[$scope.tabIdx].no);
                    }

                    // 탭 번호로 리스트 조회
                    $scope.getPortletList();
                }

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    if ($scope.option.tab != undefined) {
                        var channel = 'people';
                        if ($scope.option.type == 'review') {
                            channel = 'moms';
                        }

                        $location.url('/'+channel+'/'+$scope.option.tab[$scope.tabIdx].menu+'/list');
                    } else {
                        $location.url($scope.option.url);
                    }
                };

                // 리스트 선택
                $scope.click_showView = function (item) {
                    var channel = $scope.option.url.split('/')[1];
                    var menu = 'angeroom';

                    if (angular.uppercase($scope.option.type) == 'REVIEW') {
                        menu = angular.lowercase(item.TARGET_GB) + $scope.option.type;
                    } else {
                        switch(item.COMM_NO) {
                            case '1' :
                                menu = 'angeroom';
                                break;
                            case '2' :
                                menu = 'momstalk';
                                break;
                            case '3' :
                                menu = 'babycare';
                                break;
                            case '4' :
                                menu = 'firstbirthtalk';
                                break;
                            case '5' :
                                menu = 'booktalk';
                                break;
                            case '6' :
                                menu = 'working';
                                break;
                            case '7' :
                                menu = 'readypreg';
                                break;
                            case '8' :
                                menu = 'anony';
                                break;
                            case '21' :
                                menu = 'childdevelop';
                                break;
                            case '22' :
                                menu = 'chlidoriental';
                                break;
                            case '23' :
                                menu = 'obstetrics';
                                break;
                            case '24' :
                                menu = 'momshealth';
                                break;
                            case '25' :
                                menu = 'financial';
                                break;
                            case '51' :
                                menu = 'notice';
                                break;
                            case '52' :
                                menu = 'system';
                                break;
                            case '32' :
                                channel = 'moms';
                                menu = 'eventwinner';
                                break;
                        }
                    }

                    if (angular.uppercase($scope.option.type) == 'CLINIC' && $scope.uid != item.REG_UID && item.PASSWORD_FL != '0') {
                        dialogs.notify('알림', '비밀글입니다. 작성자와 해당게시판 상담가만 볼 수 있습니다.', {size: 'md'});
                        return;
                    }

                    $location.url(channel+'/'+menu+'/view/'+item.NO);
                };

                // 리스트 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'main', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.list = data;
                            if ($scope.option.image != undefined && $scope.option.image) {
                                $scope.imgItem = data[0];
                                $scope.img = CONSTANT.BASE_URL + data[0].FILE.PATH + 'thumbnail/' + data[0].FILE.FILE_ID;
                            }
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 메인 맘스그라운드 리스트를 동적으로 생성
    directives.directive('angeMiniStoryList', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { code:'=' },
//            replace: true,
//            templateUrl: function(element, attr) {
//                return '/partials/ange/main/mini-story-list.html';
//            },
            template: '<div ng-show="isLoading" style="position: absolute; top: 20%;left: 48%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                '<div class="mini_story">' +
                '   <div class="miniboard_titlebar">' +
                '       <span class="miniboard_title">{{portletTitle}}</span>' +
                '        <a class="miniboard_tab_more" ng-click="click_showList();">더보기</a>' +
                '       <div ng-if="option.tab" ng-repeat="tab in  option.tab" ng-class="tabIdx == $index ? \'miniboard_tab_on\' : \'miniboard_tab\'" ng-click="click_tabIndex($index)">{{tab.name}}</div>' +
                '    </div>' +
                '    <div class="mini_story_rollcate" style="margin-bottom:5px;">' +
                '        <a class="mini_story_rollcate_left" ng-click="click_preCategory()">Pre Category</a>' +
                '        <div class="col-xs-12 no-margin" style="width:100%; padding:0 2%; height:100%; line-height: 34px;">' +
                '           <slick id="category" current-index="0" infinite="true" dots="false" autoplay="false" center-mode="true" slides-to-show="3" slides-to-scroll="1">' +
                '               <div ng-repeat="item in cate" ng-class=" $index == curIdx ? \'foucsing\' : \'\' " ng-click="click_slickGoTo($index)" style="overflow:hidden; white-space:nowrap; width:100%; text-overflow: ellipsis;  margin:0 1.3%; text-align:center; font-size:0.86em;"><a class="rollcate_link" title="item.CATEGORY_NM">{{item.CATEGORY_NM}}</a></div>' +
                '           </slick>' +
                '        </div>' +
                '        <a class="mini_story_rollcate_right" ng-click="click_nextCategory()">Next Category</a>' +
                '    </div>' +
                '    <div class="mini_board_contents" ng-repeat="item in list" ng-click="click_showView(item.NO);">' +
                '        <img ng-src="{{item.MAIN_FILE}}" class="mini_board_contents_img" />' +
                '        <div class="mini_board_contents_txt">' +
                '            <span class="mini_story_txt_head">{{item.PROJECT_NM}}</span>' +
                '            <span class="mini_story_txt_title">| {{item.SUBJECT}}</span>' +
                '            <ul class="mini_board_feeds">' +
                '                <li class="mini_reply" style="float: right;">{{item.REPLY_COUNT}}</li>' +
                '                <li class="mini_like" style="float: right;">{{item.LIKE_CNT}}</li>' +
                '            </ul>' +
                '        </div>' +
                '    </div>' +
                '    <div class="mini_story_contentbox">' +
                '        <div class="row" style="margin:0 auto; position:relative;">' +
                '            <div class="col-xs-2" style="padding:4px;">' +
                '                <span class="mini_story_contentbox_kortitle">임신부<br /><strong>솔루션</strong></span>' +
                '                <div class="mini_story_contentbox_engtitle">Health<br />&nbsp;&nbsp;& Food</div>' +
                '                <a class="miniboard_tab_slideprev" style="margin-top:-12px;" title="이전">이전슬라이드</a>' +
                '                <a class="miniboard_tab_slidenext" style="margin-top:-12px;" title="다음">다음슬라이드</a>' +
                '            </div>' +
                '            <div class="col-xs-10 mini_story_contentboxlist_roll">' +
                '                <div class="mini_story_contentboxlist_wrap">' +
                '                    <slick id="{{option.id}}" init-onload="true" data="list2" dots="false" autoplay="true" center-mode="false" slides-to-show="4" slides-to-scroll="4" autoplay-speed="3000" fade="false" pause-on-hover="false">' +
                '                       <div ng-repeat="item in list2" class="mini_story_contentboxlist" style="width: 100px"><a href="/story/content/list/{{ item.NO }}"><div class="mini_story_contentbox_img"><span class="mini_story_contentbox_cate">{{ item.time }}</span><img src="/imgs/ange/_blank_4by3.gif" ng-style="{ \'background-image\': \'url( {{ item.MAIN_FILE }} )\' }"/></div><div class="mini_story_contentbox_title">{{ item.SUBJECT }}</div></a></div>' +
                '                   </slick>' +
                '                </div>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>',
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {PHASE: '30, 31'};

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 탭 번호
                $scope.tabIdx = $scope.option.defIdx;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                $scope.search.SYSTEM_GB = 'ANGE';
                $scope.search.FILE = true;
                $scope.search.ORDER = 'DESC';

                // 검색 조건에 탭조건 추가
                if ($scope.option.tab != undefined) {
                    if ($scope.tabIdx == 0) {
                        $scope.search.SORT = 'T.LIKE_CNT';
                    } else if ($scope.tabIdx == 1) {
                        $scope.search.SORT = 'P.SUBJECT';
                    } else if ($scope.tabIdx == 2) {
                        $scope.search.SORT = 'T.SUBJECT';
                    }
                }

                /********** 이벤트 **********/
                    // 탭 클릭
                $scope.click_tabIndex = function (idx) {
                    $scope.tabIdx = idx;

                    if ($scope.tabIdx == 0) {
                        $scope.search.SORT = 'T.LIKE_CNT';
                    } else if ($scope.tabIdx == 1) {
                        $scope.search.SORT = 'P.SUBJECT';
                    } else if ($scope.tabIdx == 2) {
                        $scope.search.SORT = 'P.SUBJECT';
                    }

                    // 탭 번호로 리스트 조회
                    $scope.getMiniList();
                }

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    $location.url($scope.option.url);
                };

                $scope.cateIdx = 0;

                $scope.click_preCategory = function () {
                    angular.element('#category').slickPrev();
                    $scope.curIdx--;
                    // 클릭 슬라이드로 변경
                    $scope.click_slickGoTo($scope.curIdx);
                }

                $scope.click_nextCategory = function () {
                    angular.element('#category').slickNext();
                    $scope.curIdx++
                    // 클릭 슬라이드로 변경
                    $scope.click_slickGoTo($scope.curIdx);
                }

                $scope.click_selectCategory = function (category, idx) {
                    $scope.search.CATEGORY = [];

                    $scope.cateIdx = idx;
                    $scope.search.CATEGORY.push(category);

                    $scope.getMiniList();
                }

                // 리스트 선택
                $scope.click_showView = function (key) {
                    $location.url($scope.option.url + '/' + key);
                };

                // 리스트 조회
                $scope.getMiniList = function () {
                    $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, false)
                        .then(function(data){
                            for(var i in data) {
                                if (data[i].FILE != null) {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                    data[i].MAIN_FILE = img;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                // 카테고리 조회
                $scope.getCategoryList = function () {
                    $scope.cate = $scope.category_b;
                    $scope.click_slickGoTo = function(idx) {
                        $scope.curIdx = idx;

                        // 클릭 슬라이드로 변경
                        angular.element('#category').slickGoTo(idx);

                        $scope.search.CATEGORY = [];
                        $scope.search.CATEGORY.push($scope.cate[idx]);

                        $scope.getMiniList();
                    }
                };

                // 리스트 조회
                $scope.getFoodList = function () {
                    $scope.getList($scope.option.api, 'food', {NO:$scope.PAGE_NO, SIZE:12}, {CATEGORY_NO: '18, 19, 20, 21', FILE: true}, true)
                        .then(function(data){
                            for (var i in data) {

                                if (data[i].FILE != null) {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                    data[i].MAIN_FILE = img;
                                }

                                switch(data[i].CATEGORY_NO) {
                                    case '18' :
                                        data[i].time = '0~11주';
                                        break;
                                    case '19' :
                                        data[i].time = '12~27주';
                                        break;
                                    case '20' :
                                        data[i].time = '28~40주';
                                        break;
                                    case '21' :
                                        data[i].time = '출산';
                                        break;
                                }

                                $scope.list2 = data;
                            }
                        })
                        ['catch'](function(error){});
                };

                $scope.getMiniList();
                $scope.getCategoryList();
                $scope.getFoodList();
            }]
        }
    }]);

    // 채널 미니 리스트를 동적으로 생성
    directives.directive('angePortletChannelList', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { code:'=' },
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-channel-list.html';
            },
            controller: ['$scope', '$rootScope', '$attrs', '$location', 'CONSTANT', function($scope, $rootScope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 탭 번호
                $scope.tabIdx = $scope.option.defIdx;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
//                $scope.search.SYSTEM_GB = 'ANGE';
//                $scope.search.NOTICE_FL = '0';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.tab != undefined) {
                    if ($scope.option.type == 'review') {
                        $scope.search.TARGET_GB = $scope.option.tab[$scope.tabIdx].no;
                    } else {
                        $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;
                    }
                } else {
                    if ($scope.option.type == 'board') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_BOARD;
                    } else if ($scope.option.type == 'photo') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_PHOTO;
                    } else if ($scope.option.type == 'clinic') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_CLINIC;
                    } else if ($scope.option.type == 'notice') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_REPORT;
                    } else if ($scope.option.type == 'writing') {
                        $scope.search.REG_UID = $rootScope.uid;
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_BOARD+ ',' +CONSTANT.COMM_NO_FAQ;
                    }
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined) {
                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                // 탭 클릭
                $scope.click_tabIndex = function (idx) {
                    $scope.tabIdx = idx;

                    if ($scope.option.type == 'review') {
                        $scope.search.TARGET_GB = $scope.option.tab[$scope.tabIdx].no;
                    } else {
                        $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;
                    }

                    // 탭 번호로 리스트 조회
                    $scope.getMiniList();
                }

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    if ($scope.option.tab != undefined) {
                        $location.url($scope.option.tab[$scope.tabIdx].menu+'/list');
                    } else {
                        if ($scope.option.type == 'writing') {
                            $location.url($scope.option.url);
                        } else {
                            $location.url($scope.option.url+'/list');
                        }
                    }
                };

                // 리스트 선택
                $scope.click_showView = function (item) {
                    if ($scope.option.type == 'writing') {
                        var menu = '';

                        switch(item.COMM_NO) {
                            case '1' :
                                menu = 'angeroom';
                                break;
                            case '2' :
                                menu = 'momstalk';
                                break;
                            case '3' :
                                menu = 'babycare';
                                break;
                            case '4' :
                                menu = 'firstbirthtalk';
                                break;
                            case '5' :
                                menu = 'booktalk';
                                break;
                            case '6' :
                                menu = 'working';
                                break;
                            case '7' :
                                menu = 'readypreg';
                                break;
                            case '8' :
                                menu = 'anony';
                                break;
                            case '21' :
                                menu = 'childdevelop';
                                break;
                            case '22' :
                                menu = 'chlidoriental';
                                break;
                            case '23' :
                                menu = 'obstetrics';
                                break;
                            case '24' :
                                menu = 'momshealth';
                                break;
                            case '25' :
                                menu = 'financial';
                                break;
                            case '51' :
                                menu = 'notice';
                                break;
                            case '52' :
                                menu = 'system';
                                break;
                        }

                        $location.url("people/"+menu+'/view/'+item.NO);
                    } else {
                        $location.url($scope.option.tab[$scope.tabIdx].menu+'/view/'+item.NO);
                    }
                };

                // 이미지 클릭
                $scope.click_firstImage = function (item) {
                    $location.url($scope.option.tab[$scope.tabIdx].menu+'/view/'+item.NO);
                };

                // 리스트 조회
                $scope.getMiniList = function () {
                    $scope.getList($scope.option.api, 'main', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.list = data;

                            if ($scope.option.image != undefined && $scope.option.image) {
                                $scope.img = {};
                                $scope.img.NO = data[0].NO;
                                $scope.img.URL = CONSTANT.BASE_URL + data[0].FILE.PATH + 'thumbnail/' + data[0].FILE.FILE_ID;
                            }
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getMiniList();
            }]
        }
    }]);

    // 채널 주문/구매내역 리스트를 동적으로 생성
    directives.directive('angePortletOrderList', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { code:'=' },
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-order-list.html';
            },
            controller: ['$scope', '$rootScope', '$attrs', '$location', 'CONSTANT', function($scope, $rootScope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 탭 번호
                $scope.tabIdx = $scope.option.defIdx;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.tab != undefined) {
                    $scope.search.ORDER_GB = $scope.option.tab[$scope.tabIdx].gb;
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined) {
                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                // 탭 클릭
                $scope.click_tabIndex = function (idx) {
                    $scope.tabIdx = idx;

                    $scope.search.ORDER_GB = $scope.option.tab[$scope.tabIdx].gb;

                    // 탭 번호로 리스트 조회
                    $scope.getMiniList();
                }

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    if ($scope.option.tab != undefined) {
                        $location.url($scope.option.tab[$scope.tabIdx].menu);
                    }
                };

                // 리스트 선택
                $scope.click_showView = function (item) {
                    $location.url($scope.option.tab[$scope.tabIdx].menu);
                };

                // 리스트 조회
                $scope.getMiniList = function () {
                    $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){

                            if ($scope.option.image != undefined && $scope.option.image) {
                                for(var i in data) {
                                    data[i].MAIN_FILE = CONSTANT.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getMiniList();
            }]
        }
    }]);

    // 슬라이드를 동적으로 생성
    directives.directive('angePortletSlidePage', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-slide-page.html';
            },
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건에 진행 상태 추가
//                $scope.search.FILE = true;
                $scope.search.PROCESS = true;
                $scope.search.ADA_TYPE_IN = "'event', 'exp'";
                $scope.search.ADP_CODE_NOT_IN = "'samplepack1', 'samplepack2', 'postcard'";
                $scope.search.SORT = 'ada_date_open';
                $scope.search.ORDER = 'DESC';

                /********** 이벤트 **********/
                    // 일시 정지 버튼
                $scope.click_slickPause = function() {
                    // 슬라이드를 일시 정지
                    angular.element('#'+$scope.option.id).slickPause();
                    // 동작 버튼을 활성화
                    $scope.toggle = false;
                };

                // 동작 버튼
                $scope.click_slickPlay = function() {
                    // 슬라이드를 다시 실행
                    angular.element('#'+$scope.option.id).slickPlay();
                    // 일시 정지 버튼을 활성화
                    $scope.toggle = true;
                };

                // 다음 슬라이드
                $scope.click_slickPrev = function() {
                    angular.element('#'+$scope.option.id).slickPrev();
                };

                // 이전 슬라이드
                $scope.click_slickNext = function() {
                    angular.element('#'+$scope.option.id).slickNext();
                };

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    $location.url($scope.option.url);
                };

                // 선택
                $scope.click_showView = function (item) {
                    var menu = 'experienceprocess';

                    switch(item.ada_type) {
                        case 'exp' :
                            menu = 'experienceprocess';
                            break;
                        case 'event' :
                            menu = 'eventprocess';
                            break;
                    }

                    $location.url('moms/'+menu+'/view/'+item.ada_idx);
                };

                var date = new Date();

                // GET YYYY, MM AND DD FROM THE DATE OBJECT
                var year = date.getFullYear().toString();
                var mm = (date.getMonth()+1).toString();
                var dd  = date.getDate().toString();

                if(mm < 10) {
                    mm = '0'+mm;
                }

                if(dd < 10) {
                    dd = '0'+dd;
                }

                var today = year+'-'+mm+'-'+dd;
                $scope.todayDate = today;

                // 슬라이드 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for (var i in data) {
                                var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                data[i].MAIN_FILE = img;
                                data[i].menu = 'experienceprocess';

                                switch(data[i].ada_type) {
                                    case 'exp' :
                                        data[i].menu = 'experienceprocess';
                                        break;
                                    case 'event' :
                                        data[i].menu = 'eventprocess';
                                        break;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 슬라이드를 동적으로 생성
    directives.directive('angePortletSlideBaby', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-slide-baby.html';
            },
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건에 도전 앙쥬 모델 추가
                $scope.search.FILE = true;
                $scope.search.COMM_NO = '11';

                /********** 이벤트 **********/
                    // 일시 정지 버튼
                $scope.click_slickPause = function() {
                    // 슬라이드를 일시 정지
                    angular.element('#'+$scope.option.id).slickPause();
                    // 동작 버튼을 활성화
                    $scope.toggle = false;
                };

                // 동작 버튼
                $scope.click_slickPlay = function() {
                    // 슬라이드를 다시 실행
                    angular.element('#'+$scope.option.id).slickPlay();
                    // 일시 정지 버튼을 활성화
                    $scope.toggle = true;
                };

                // 다음 슬라이드
                $scope.click_slickPrev = function() {
                    angular.element('#'+$scope.option.id).slickPrev();
                };

                // 이전 슬라이드
                $scope.click_slickNext = function() {
                    angular.element('#'+$scope.option.id).slickNext();
                };

                // 목록 이동
                $scope.click_showList = function () {
                    $location.url('/'+$scope.api+'/list');
                };

                // 선택
                $scope.click_showView = function (key) {
                    $location.url('/'+$scope.api+'/view/'+key);
                };

                // 슬라이드 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'main', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for(var i in data) {
                                if (data[i].FILE != null) {
                                    data[i].MAIN_FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                    data[i].URL = "/people/angemodel/view/"+data[i].NO;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 슬라이드를 동적으로 생성
    directives.directive('angePortletSlideAlbum', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-slide-album.html';
            },
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};
                $scope.search.PARENT_NO_NOT = '0';

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                /********** 이벤트 **********/
                // 다음 슬라이드
                $scope.click_slickPrev = function() {
                    angular.element('#'+$scope.option.id).slickPrev();
                };

                // 이전 슬라이드
                $scope.click_slickNext = function() {
                    angular.element('#'+$scope.option.id).slickNext();
                };

                // 목록 이동
                $scope.click_showList = function () {
                    $location.url($scope.option.url+'/list');
                };

                // 선택
                $scope.click_showView = function (key) {
                    $location.url($scope.option.url+'/view/'+key);
                };

                // 슬라이드 이미지 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for(var i in data) {
                                if (data[i].FILE_ID != null) {
                                    data[i].ALBUM_FILE = CONSTANT.BASE_URL + data[i].PATH + 'thumbnail/' + data[i].FILE_ID;
                                    data[i].URL = $scope.option.url+"/view/"+data[i].NO;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 슬라이드를 동적으로 생성
    directives.directive('angePortletSlideStore', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-slide-store.html';
            },
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건에 진행 상태 추가
                $scope.search.FILE = true;
                $scope.search.PRODUCT_GB = angular.uppercase($scope.option.type);
//                $scope.search.ORDER_YN = 'Y';
//                $scope.search.SORT = 'ada_date_open';
//                $scope.search.ORDER = 'DESC';

                if ($scope.option.type == 'mileage') {
                    $scope.getList('cms/category', 'list', {}, {SYSTEM_GB: 'ANGE'}, false)
                        .then(function(data){
                            var category_a = [];

                            category_a.push({CATEGORY_NM: '전체상품보기', CATEGORY_GB: 'STORE', NO: ''});

                            for (var i in data) {
                                var item = data[i];

                                if (item.CATEGORY_GB == 'STORE' && item.PARENT_NO == '1' && item.CATEGORY_ST == '0') {
                                    category_a.push(item);
                                }
                            }

                            $scope.category = category_a;
                        })
                }

                /********** 이벤트 **********/
                $scope.curIdx = 0;

                // 카테고리 선택
                $scope.click_selectCategory = function(idx, item) {
                    $scope.curIdx = idx;

                    $scope.search.CATEGORY_NO = item.NO;
                    angular.element('#'+$scope.option.id).unslick();
//                    angular.element('#'+$scope.option.id).slickFilter(item.NO);
//                    angular.element('#'+$scope.option.id).slickRemoveAll();
//                    angular.element('#'+$scope.option.id).slick();
//                    angular.element('#'+$scope.option.id).slickSetOption({initOnload: 'true', data: $scope.list});
                    $scope.getPortletList();
                };

                // 일시 정지 버튼
                $scope.click_slickPause = function() {
                    // 슬라이드를 일시 정지
                    angular.element('#'+$scope.option.id).slickPause();
                    // 동작 버튼을 활성화
                    $scope.toggle = false;
                };

                // 동작 버튼
                $scope.click_slickPlay = function() {
                    // 슬라이드를 다시 실행
                    angular.element('#'+$scope.option.id).slickPlay();
                    // 일시 정지 버튼을 활성화
                    $scope.toggle = true;
                };

                // 다음 슬라이드
                $scope.click_slickPrev = function() {
                    angular.element('#'+$scope.option.id).slickPrev();
                };

                // 이전 슬라이드
                $scope.click_slickNext = function() {
                    angular.element('#'+$scope.option.id).slickNext();
                };

                // 더보기 버튼 클릭
                $scope.click_showList = function () {
                    $location.url($scope.option.url);
                };

                // 선택
                $scope.click_showView = function (item) {
                    $location.url($scope.option.url+'/view/'+item.NO);
                };

                // 슬라이드 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for (var i in data) {
                                data[i].PRODUCT_FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].URL = $scope.option.url+"/view/"+data[i].NO;
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){$scope.list = []});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 좌측 배너를 동적으로 생성
    directives.directive('angePortletSlideAds', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { option: '=ngModel' },
//            replace: true,
            template: '<slick id="{{ option.id }}" init-onload="true" data="list" current-index="0" dots="false" autoplay="true" center-mode="true" slides-to-show="1" slides-to-scroll="1" autoplay-speed="3000" fade="true" pause-on-hover="false" style="padding:0px 6px; cursor:pointer;">' +
                      '   <div ng-repeat="item in list" ><a ng-click="click_Banner(item)"><img ng-src="{{ item.MAIN_FILE }}"/></a></div>' +
                      '</slick>'+
                      '<div class="ads_indicators_wrap">' +
                      '   <div ng-repeat="item in list" ng-click="click_slickGoTo($index)" ng-class=" $index == curIdx && option.id == curId ? \'ads_indicators now\' : \'ads_indicators\'">' +
                      '   </div>' +
                      '</div>',
            controller: ['$scope', '$attrs', '$location', '$window', '$timeout', 'CONSTANT', function($scope, $attrs, $location, $window, $timeout, CONSTANT) {

                /********** 초기화 **********/
                var type = 'list';

                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                $scope.search.ADA_STATE = 1;

                // 검색 조건 추가
                if ($scope.option.type == 'ange') {
                    $scope.search.BANNER_GB = $scope.option.gb;
                    type = $scope.option.type;
                } else if ($scope.option.type == 'banner') {
                    $scope.search.PROCESS = true;
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.BANNER_ST = 1;
//                } else if ($scope.option.type == 'experience') {
//                    $scope.search.EVENT_GB = "exp";
//                } else if ($scope.option.type == 'event') {
//                    $scope.search.EVENT_GB = "event";
                }

                /********** 이벤트 **********/
                $scope.click_slickGoTo = function(idx) {
                    $scope.curIdx = idx;

                    // 클릭 슬라이드로 변경
                    angular.element('#'+$scope.option.id).slickGoTo(idx);
                }

                $scope.click_Banner = function(item) {
                    if ($scope.option.type == 'banner') {
                        $scope.click_linkBanner(item);
                    } else if ($scope.option.type == 'ange') {
                        $location.url(item.URL);
                    }
                }

                // 롤링 이미지 조회
                $scope.getPortletList = function () {

                    $scope.getList($scope.option.api, type, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for (var i in data) {
                                if ($scope.option.type == 'ange') {
                                    data[i].MAIN_FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                } else if ($scope.option.type == 'banner') {
                                    data[i].MAIN_FILE = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                }
                            }

                            $scope.list = data;

                            $scope.curId = $scope.option.id;
/*
                            angular.element('#'+$scope.option.id).click(function() {
                                var idx = angular.element('#'+$scope.option.id).slickCurrentSlide();

                                if ($scope.option.type == 'banner') {
                                    $scope.click_linkBanner(data[idx]);
                                } else if ($scope.option.type == 'ange') {
                                    $location.url(data[idx].URL);
                                }
                            });
*/

                            $timeout(function() {
                                // 이미지가 변경될 때 하단에 변경해 줌
                                $scope.$watch(function() {
                                    // 현재 슬라이드를 반환
                                    return angular.element('#'+$scope.option.id).slickCurrentSlide();
                                }, function(newVal, oldVal) {
                                    $scope.curIdx = newVal;
                                });
                            }, 500);
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 롤링 배너를 동적으로 생성
    directives.directive('angePortletSlideBanner', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { option: '=ngModel' },
//            replace: true,
//            templateUrl: '/partials/ange/main/portlet-slide-banner.html',
            template: '<div class="jumbotron_cover" style="position:absolute; top:0px; left:0px;">' +
                      '   <div ng-show="isLoading" style="top: 45%;left: 48%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                      '   <div ng-show="option.id == \'experience\'" style="position:absolute; width:100%; z-index:9; text-align:center;"><img src="/imgs/ange/ribon_exper_now.jpg" style="opacity:0.8"/></div>' +
                      '   <div ng-show="option.id == \'event\'" style="position:absolute; width:100%; z-index:9; text-align:center;"><img src="/imgs/ange/ribon_event_now.jpg" style="opacity:0.8"/></div>' +
                      '   <div ng-show="option.id == \'store\'" style="position:absolute; width:100%; z-index:9; text-align:center;"><img src="/imgs/ange/togetherbuy.png" style="opacity:0.8"/></div>' +
                      '   <div class="jumbotron_cover_imgs" style="padding-bottom:45px;">' +
                      '       <div id="jumbotron_cover" class="carousel slide" data-ride="carousel">' +
                      '           <slick id="{{ option.id }}" init-onload="true" data="slideList" current-index="0" dots="false" autoplay="true" center-mode="true" slides-to-show="1" slides-to-scroll="1" autoplay-speed="3000" fade="true" pause-on-hover="false">' +
                      '               <div ng-repeat="item in slideList" class="carousel-inner" role="listbox"><div class="item active"><a ng-click="click_linkBanner(item)"><img ng-src="{{ item.MAIN_FILE }}" style="width:100%; cursor:pointer;"/></a></div></div>' +
                      '           </slick>' +
                      '       </div>' +
                      '   </div>' +
                      '   <div class="jumbotron_cover_controlbar">' +
                      '       <div class="black_shade_nomargin"></div>' +
                      '       <div class="jumbotron_cover_controlset">' +
                      '           <a ng-show="toggle" class="jumbotron_cover_pause" ng-click="click_slickPause()">일시정지</a>' +
                      '           <a ng-show="!toggle" class="jumbotron_cover_play" ng-click="click_slickPlay()">동작</a>' +
                      '           <ol class="carousel-indicators jumbotron_indicators_wrap" style="left:30px;">' +
                      '               <li ng-repeat="item in slideList" ng-class=" $index == curIdx ? \'jumbotron_indicators_actived\' : \'jumbotron_indicators\'" ng-click="click_slickGoTo($index)" ></li>' +
                      '           </ol>' +
                      '       </div>' +
                      '       <div class="jumbotron_cover_controlbar_title">{{ coverTitle }}</div>' +
                      '   </div>' +
                      '</div>',
            controller: ['$scope', '$attrs', '$location', '$window', '$timeout', 'CONSTANT', function($scope, $attrs, $location, $window, $timeout, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                $scope.search.PROCESS = true;
                $scope.search.ADA_STATE = 1;

                // 검색 조건 추가
                if ($scope.option.type == 'banner') {
                    $scope.search.ADP_IDX = $scope.option.gb == undefined ? '' : $scope.option.gb;
                    $scope.search.BANNER_ST = 1;
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                } else if ($scope.option.type == 'experience') {
                    $scope.search.ADP_IDX = $scope.option.gb == undefined ? '' : $scope.option.gb;
                    $scope.search.EVENT_GB = "exp";
//                    $scope.search.PROCESS = "process";
//                    $scope.search.FILE = true;
                } else if ($scope.option.type == 'event') {
                    $scope.search.ADP_IDX = $scope.option.gb == undefined ? '' : $scope.option.gb;
                    $scope.search.EVENT_GB = "event";
//                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                // 일시 정지 버튼
                $scope.click_slickPause = function() {
                    // 슬라이드를 일시 정지
                    angular.element('#'+$scope.option.id).slickPause();
                    // 동작 버튼을 활성화
                    $scope.toggle = false;
                };

                // 동작 버튼
                $scope.click_slickPlay = function() {
                    // 슬라이드를 다시 실행
                    angular.element('#'+$scope.option.id).slickPlay();
                    // 일시 정지 버튼을 활성화
                    $scope.toggle = true;
                };

                $scope.click_slickGoTo = function(idx) {
                    $scope.curIdx = idx;

                    // 클릭 슬라이드로 변경
                    angular.element('#'+$scope.option.id).slickGoTo(idx);
                }

                // 롤링 이미지 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for (var i in data) {
                                data[i].MAIN_FILE = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                            }

                            $scope.slideList = data;

                            $scope.curId = $scope.option.id;
/*
                            angular.element('#'+$scope.option.id).click(function() {
                                var idx = angular.element('#'+$scope.option.id).slickCurrentSlide();

                                if ($scope.option.type == 'banner') {
                                    $scope.click_linkBanner(data[idx]);
                                } else if ($scope.option.type == 'experience') {
                                    $location.url('/moms/experienceprocess/view/'+data[idx].ada_idx);
                                } else if ($scope.option.type == 'event') {
                                    $location.url('/moms/eventprocess/view/'+data[idx].ada_idx)
                                }
                            });
*/
                            $timeout(function() {
                                // 이미지가 변경될 때 우측 하단에 현재 광고 설명을 변경해 줌
                                $scope.$watch(function() {
                                    if (angular.element('#'+$scope.option.id) == undefined) return;
                                    // 현재 슬라이드를 반환
                                    return angular.element('#'+$scope.option.id).slickCurrentSlide();
                                }, function(newVal, oldVal) {
                                    $scope.curIdx = newVal;
                                    $scope.coverTitle = data[newVal].ada_title;
                                });
                            }, 500);
                        })
                        ['catch'](function(error){$scope.slideList = [];});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    // 링크 이미지를 동적으로 생성
    directives.directive('angePortletLinkImage', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            template: '<div class="inven_subsideRoll">'+
                '   <div ng-show="isLoading" style="top: 40%;left: 40%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                '   <img ng-src="/imgs/ange/_blank_163by128.gif" ng-click="click_linkImage()" title="{{title}}" style="background-image:url({{img}}); width:100%;"/>'+
                '</div>',
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                if ($scope.option.api == 'ad/banner') {
//                    $scope.search.PROCESS = true;
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.ADA_STATE = 1;
                    $scope.search.ADA_TYPE = 'banner';
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                // 이미지 클릭
                $scope.click_linkImage = function () {
                    if ($scope.option.open) {
                        $scope.click_linkBanner($scope.item);
                    } else {
                        $location.url($scope.item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.item = data[0];

                            if ($scope.option.api == 'ad/banner') {
                                $scope.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                            } else {
                                $scope.img = CONSTANT.BASE_URL + data[0].FILE.PATH + data[0].FILE.FILE_ID;
                            }

                            $scope.title = data[0].ada_title;
                        })
                        ['catch'](function(error){});
                };

                $scope.getImage();
            }]
        }
    }]);

    // 링크 이미지를 동적으로 생성
    directives.directive('angePortletLinkImageMain', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            template: '<div ng-show="isLoading" style="position: absolute; top: 20%;left: 48%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                '<div class="inven_Highlight"><img ng-src="/imgs/ange/_blank_262by158.gif" ng-click="click_linkImage()" title="{{title}}" style="background-image:url({{img}}); width:100%;"/></div>',
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                if ($scope.option.api == 'ad/banner') {
                    $scope.search.PROCESS = true;
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.ADA_STATE = 1;
                    $scope.search.ADA_TYPE = 'banner';
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_linkImage = function () {
                    if ($scope.option.open) {
                        $scope.click_linkBanner($scope.item);
                    } else {
                        $location.url($scope.item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.item = data[0];

                            if ($scope.option.api == 'ad/banner') {
                                $scope.img = CONSTANT.AD_FILE_URL + data[0].ada_preview;
                            } else {
                                $scope.img = CONSTANT.BASE_URL + data[0].FILE.PATH + data[0].FILE.FILE_ID;
                            }

                            $scope.title = data[0].ada_title;
                        })
                        .catch(function(error){});
                };

                $scope.getImage();
            }]
        }
    }]);

    // 링크 이미지를 동적으로 생성
    directives.directive('angePortletLinkImage2', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            template: '<div ng-class="$index == 0 ? \'subside_inven_basic top\' : $index == 1 ? \'subside_inven_basic mid\' : \'subside_inven_basic btm\'" ng-repeat="item in adList"><span style="color:#555;"></span>' +
                '   <div ng-show="isLoading" style="top: 40%;left: 40%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                '   <img ng-show="{{item.img}}" ng-src="{{item.img}}" ng-click="click_linkImage(item)" title="{{item.title}}"/>' +
                '</div>',
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                if ($scope.option.api == 'ad/banner') {
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.ADA_STATE = 1;
                    $scope.search.ADA_TYPE = 'banner';
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_linkImage = function (item) {
                    if ($scope.option.open) {
                        $scope.click_linkBanner(item);
                    } else {
                        $location.url(item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for(var i in data) {
                                if ($scope.option.api == 'ad/banner') {
                                    var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                } else {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                }
                                var title = data[i].ada_title;

                                data[i].img = img;
                                data[i].title = title;
                            }

                            $scope.adList = data;
                        })
                        ['catch'](function(error){});
                };

                $scope.getImage();
            }]
        }
    }]);

    // 조각 이미지를 동적으로 생성
    directives.directive('angePortletPieceImage', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-piece-image.html';
            },
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
//                $scope.search.SYSTEM_GB = 'ANGE';
//                $scope.search.NOTICE_FL = '0';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.type != undefined) {
//                    $scope.search.COMM_NO = $scope.option.comm;
//                    $scope.search.BOARD_GB = angular.uppercase($scope.option.type);
                    $scope.search.FILE = true;
                    $scope.search.COMM_NO = '11';
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_showImage = function (item) {
                    $location.url($scope.option.url+'/view/'+item.NO);
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'main', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){

                            for(var i in data) {
                                if (data[i].FILE != null) {
                                    data[i].FILE = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                }
                            }

                            $scope.list = data;
                        })
                        ['catch'](function(error){});
                };

                $scope.getImage();
            }]
        }
    }]);

    // 앙쥬 설문을 동적으로 생성
    directives.directive('angePortletLinkPoll', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            templateUrl: '/partials/ange/main/portlet-link-poll.html',
            controller: ['$scope', '$attrs', '$location', '$window', function($scope, $attrs, $location, $window) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = 1;

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

                /********** 이벤트 **********/
                // 투표 클릭
                $scope.click_showPoll = function (key) {
                    $location.url($scope.option.url + '/edit/' + key)
                };

                // 설문 조회
                $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, {POLL_ST: '1', CLOSE_DT: true, SORT: 'RAND()', ORDER: ''}, false)
                    .then(function(data){$scope.item = data[0]})
                    ['catch'](function(error){$scope.item = [];});
            }]
        }
    }]);

    // 앙쥬 링크를 동적으로 생성
    directives.directive('angePortletLinkMenu', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            templateUrl: '/partials/ange/main/portlet-link-menu.html',
            controller: ['$scope', '$attrs', '$location', '$window', function($scope, $attrs, $location, $window) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                $scope.linkGb = $scope.option.gb;

                /********** 이벤트 **********/
                    // 메뉴 이동
                $scope.click_moveMenu = function () {
                    $location.url($scope.option.url);
                };
            }]
        }
    }]);

    // 캘린더를 동적으로 생성
    directives.directive('angePortletCalendar', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            templateUrl: function(element, attr) {
                return '/partials/ange/main/portlet-calendar.html';
            },
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
//                $scope.search.SYSTEM_GB = 'ANGE';
//                $scope.search.NOTICE_FL = '0';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.type != undefined) {
//                    $scope.search.COMM_NO = $scope.option.comm;
//                    $scope.search.BOARD_GB = angular.uppercase($scope.option.type);
                    $scope.search.FILE = true;
                    $scope.search.COMM_NO = '11';
                }

                /********** 이벤트 **********/
                $scope.search = {"year":"2015","month":"4"};

                $scope.community = "캘린더";
                $scope.monthtable = "<b>Hi</b>";

                $scope.data = 	{
                                    "1":{ "day":"1","event":"" },
                                    "2":{ "day":"1","event":"" },
                                    "3":{ "day":"1","event":"" },
                                    "4":{ "day":"1","event":"" },
                                    "5":{ "day":"1","event":"" },
                                    "6":{ "day":"1","event":"" },
                                    "7":{ "day":"1","event":"" },
                                    "8":{ "day":"1","event":"" },
                                    "9":{ "day":"1","event":"" },
                                    "10":{ "day":"1","event":"" },
                                    "11":{ "day":"1","event":"" },
                                    "12":{ "day":"1","event":"" },
                                    "13":{ "day":"2","event":"" }
                                };

                $scope.moveCalendar = function (p_year,p_month,p_add) {

                    p_year = parseInt(p_year);
                    p_month = parseInt(p_month)+p_add;

                    if (p_month>12) {
                        p_month=1;
                        p_year++;
                    }
                    if (p_month<1) {
                        p_month=12;
                        p_year--;
                    }

                    $scope.search.year = p_year;
                    $scope.search.month = p_month;
                    $scope.getEventList();
                };

                // 이미지 조회
                $scope.getEventList = function () {

                    $scope.getList('ange/calendar', 'list', {}, {"year":$scope.search.year,"month":$scope.search.month}, true)
                        .then(function(data){

                            $scope.data = data;

                        })
                        ['catch'](function(error){
                        alert('error');
                    });
                };

                $scope.getEventList();
            }]
        }
    }]);

});