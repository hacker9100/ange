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

                // 검색 조건 추가
//                $scope.search.SYSTEM_GB = 'ANGE';
//                $scope.search.NOTICE_FL = '0';

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
                        $scope.search.NOTICE_FL = '1';
                    } else if ($scope.option.type == 'photo') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_PHOTO;
                    } else if ($scope.option.type == 'clinic') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_CLINIC;
                        $scope.search.PARENT_NO = '0';
                    } else if ($scope.option.type == 'notice') {
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_NOTICE;
                    }
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined && $scope.option.image == true) {
                    $scope.search.FILE = true;
                }

                // 검색 조건에 게시판 종류 추가
                if ($scope.option.type != undefined) {
                    if ($scope.option.type == 'review') {
//                        $scope.search.TARGET_GB = angular.uppercase($scope.option.type);
                    } else {
//                        $scope.search.BOARD_GB = angular.uppercase($scope.option.type);
                    }
                }

                if ($scope.option.type == 'board') {
//                    $scope.search.COMM_NO_NOT = '91';
//                    $scope.search.NOTICE_FL = '0';
                }


//                if ($scope.option.type != 'board') {
//                    $scope.search.COMM_NO
//                }

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
            templateUrl: function(element, attr) {
                return '/partials/ange/main/mini-story-list.html';
            },
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
                }

                $scope.click_nextCategory = function () {
                    angular.element('#category').slickNext();
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

                // 리스트 조회
                $scope.getFoodList = function () {
                    $scope.getList($scope.option.api, 'food', {NO:$scope.PAGE_NO, SIZE:12}, {CATEGORY_NO: '18, 19, 20, 21', FILE: true}, true)
                        .then(function(data){
                            for (var i in data) {
                                var img = '';

                                if (data[i].FILE != null) {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                    data[i].MAIN_FILE = img;
                                }

                                var time = '';

                                switch(data[i].CATEGORY_NO) {
                                    case '18' :
                                        time = '0~11주';
                                        break;
                                    case '19' :
                                        time = '12~27주';
                                        break;
                                    case '20' :
                                        time = '28~40주';
                                        break;
                                    case '21' :
                                        time = '출산';
                                        break;
                                }

                                // 슬라이드를 추가해 줌
                                angular.element('#'+$scope.option.id).slickAdd('<div class="mini_story_contentboxlist" style="width: 100px"><a href="/story/content/list/'+data[i].NO+'"><div class="mini_story_contentbox_img"><span class="mini_story_contentbox_cate">'+time+'</span><img src="/imgs/ange/_blank_4by3.gif" style="background-image: url('+img+');"/></div><div class="mini_story_contentbox_title">'+data[i].SUBJECT+'</div></a></div>');
                                //angular.element('#'+$scope.option.id).slickAdd('<div class="mini_story_contentboxlist" style="width:74px;"><div class="mini_story_contentbox_img"><span class="mini_story_contentbox_cate">초기(4-6)</span><img src="imgs/ange/temp/story_food_01.jpg" /></div><span class="mini_story_contentbox_title">단호박 미음</span></div>');

                            }

                            // 광고의 슬라이드을 실행
                            angular.element('#'+$scope.option.id).slickPlay();
                        })
                  ['catch'](function(error){});
                };

                $scope.getMiniList();
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
            controller: ['$scope', '$attrs', '$location', 'CONSTANT', function($scope, $attrs, $location, CONSTANT) {

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
                        $scope.search.COMM_NO_IN = CONSTANT.COMM_NO_NOTICE;
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
                        $location.url($scope.option.url+'/list');
                    }
                };

                // 리스트 선택
                $scope.click_showView = function (key) {
                    $location.url($scope.option.tab[$scope.tabIdx].menu+'/view/'+key);
                };

                // 이미지 클릭
                $scope.click_firstImage = function (img) {
                    $location.url($scope.option.tab[$scope.tabIdx].menu+'/view/'+img.NO);
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
//                $scope.search.PROCESS = "process";
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

                // 슬라이드 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for (var i in data) {
                                var img = '';

//                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
//                                    data[i].MAIN_FILE = img;
                                var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                data[i].file = img;

                                var menu = 'experienceprocess';

                                switch(data[i].ada_type) {
                                    case 'exp' :
                                        menu = 'experienceprocess';
                                        break;
                                    case 'event' :
                                        menu = 'eventprocess';
                                        break;
                                }

                                // 슬라이드를 추가해 줌
                                angular.element('#'+$scope.option.id).slickAdd(
                                    '<div class="col-xs-4 mini_event_contentcol">' +
                                        '<a href="/moms/'+menu+'/view/'+data[i].ada_idx+'">' +
                                        '<div class="mini_event_content">' +
//                                                '<div class="mini_event_closed"></div>' +
                                        ( data[i].ada_state == 0 ? '<div class="mini_event_closed"></div>' : '' ) +
                                        '<img class="mini_event_txt_img" src="/imgs/ange/_blank_4by3.gif" style="background-image:url(\''+img+'\');"/>' +
                                        '<div class="mini_event_txt_title">' +
                                        ( data[i].ada_type == "event" ? '<span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' : data[i].ada_type == "exp" ? '<span class="mini_event_txt_emblem coloremblem_blue">체험단</span>' : '<span class="mini_event_txt_emblem coloremblem_brown">서평단</span>') +
                                        data[i].ada_title +'' +
                                        '</div>' +
                                        '<div class="mini_event_txt_duration">'+data[i].ada_date_open+' ~ '+data[i].ada_date_close+'</div>' +
                                        '</div>' +
                                        '</a>' +
                                        '</div>');
                            }
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단1</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단2</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단3</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단4</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단5</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단6</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');

                            // 광고의 슬라이드을 실행
                            angular.element('#'+$scope.option.id).slickPlay();
                        })
                        ['catch'](function(error){});
                };

                $scope.getPortletList();
            }],
            link: function (scope, element, attr) {
//                scope.url = attr.url;
//                scope.api = attr.api;
//                scope.portletTitle = attr.title;
//                scope.portletCss = attr.css;
//                scope.getPortletList(attr.api);
            }
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
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                    var url = "people/angemodel/view/"+data[i].NO;
                                    //angular.element('#'+$scope.option.id).slickAdd('<div><a href="/'+url+'" ><img src="'+img+'" width="99" height="119" alt="" style="background-size: cover;"/></a></div>');
                                    angular.element('#'+$scope.option.id).slickAdd('<div class="mini_peoplebabymodel_imgwrap"><a href="/'+url+'"><img src="/imgs/ange/_blank.gif" width="99" height="119" alt="" class="mini_peoplebabymodel_img" style="background-image:url(' + img + ');" /></a></div>');
                                }
                            }

//                            for (var i in data) {
//                                var img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
//                                // 슬라이드를 추가해 줌
////                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title">'+( data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' : data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_blue">체험단</span>' : '<span class="mini_event_txt_emblem coloremblem_brown">서평단</span>') + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
//                            }

//                            angular.element('#'+$scope.option.id).slickAdd('<div><a href="http://www.naver.com" ><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt=""/></a>></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');

                            // 광고의 슬라이드을 실행
                            angular.element('#'+$scope.option.id).slickPlay();
                        })
                        ['catch'](function(error){});
                };

                $scope.getPortletList();
            }],
            link: function (scope, element, attr) {
//                scope.url = attr.url;
//                scope.api = attr.api;
//                scope.portletTitle = attr.title;
//                scope.portletCss = attr.css;
//                scope.getPortletList(attr.api);
            }
        }
    }]);

    // 좌측 배너를 동적으로 생성
    directives.directive('angePortletSlideAds', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { option: '=ngModel' },
//            replace: true,
            template: '<slick id="{{ option.id }}" current-index="0" dots="false" autoplay="true" center-mode="true" slides-to-show="1" slides-to-scroll="1" autoplay-speed="3000" fade="true" pause-on-hover="false" style="padding:0px 6px; cursor:pointer;"></slick>'+
                        '<div class="ads_indicators_wrap">' +
                        '   <div ng-repeat="item in list" ng-click="click_slickGoTo($index)" ng-class=" $index == curIdx && option.id == curId ? \'ads_indicators now\' : \'ads_indicators\'"></div>' +
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
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.BANNER_ST = 1;
//                } else if ($scope.option.type == 'experience') {
//                    $scope.search.EVENT_GB = "exp";
//                } else if ($scope.option.type == 'event') {
//                    $scope.search.EVENT_GB = "event";
                }

                /********** 이벤트 **********/

                // 롤링 이미지 조회
                $scope.getPortletList = function () {

                    $scope.getList($scope.option.api, type, {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.list = data;

                            for (var i in data) {
                                if ($scope.option.type == 'ange') {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                } else if ($scope.option.type == 'banner') {
                                    var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                }

                                angular.element('#'+$scope.option.id).slickAdd('<div><img src="'+img+'"/></div>');
                            }
/*
                            var data = [];

                            if ($scope.option.gb == 1) {
                                data.push({img: '/imgs/temp/ads_i1_001.png'});
                                data.push({img: '/imgs/temp/ads_i1_002.png'});

                                $scope.list = data;

                                for (var i in data) {
                                    // 슬라이드를 추가해 줌
                                    angular.element('#'+$scope.option.id).slickAdd('<div><img src="'+data[i].img+'"/></div>');
                                }
                            } else if ($scope.option.gb == 2) {
                                data.push({img: '/imgs/temp/ads_i2_001.png'});
                                data.push({img: '/imgs/temp/ads_i2_002.png'});
                                data.push({img: '/imgs/temp/ads_i2_003.png'});
                                data.push({img: '/imgs/temp/ads_i2_004.png'});
                                data.push({img: '/imgs/temp/ads_i2_005.png'});

                                $scope.list = data;

                                for (var i in data) {
                                    // 슬라이드를 추가해 줌
                                    angular.element('#'+$scope.option.id).slickAdd('<div><img src="'+data[i].img+'"/></div>');
                                }
                            } else if ($scope.option.gb == 3) {
                                data.push({img: '/imgs/temp/ads_i3_001.png'});
                                data.push({img: '/imgs/temp/ads_i3_002.png'});

                                $scope.list = data;

                                for (var i in data) {
                                    // 슬라이드를 추가해 줌
                                    angular.element('#'+$scope.option.id).slickAdd('<div><img src="'+data[i].img+'"/></div>');
                                }
                            }
*/

                            // 롤링을 실행
                            angular.element('#'+$scope.option.id).slickPlay();

                            // 이미지가 변경될 때 하단에 변경해 줌
                            $scope.$watch(function() {
                                // 현재 슬라이드를 반환
                                return angular.element('#'+$scope.option.id).slickCurrentSlide();
                            }, function(newVal, oldVal) {
                                $scope.curIdx = newVal;
                            });

                            $scope.curId = $scope.option.id;
                            angular.element('#'+$scope.option.id).click(function() {
                                var idx = angular.element('#'+$scope.option.id).slickCurrentSlide();

                                if ($scope.option.type == 'banner') {
                                    $scope.click_linkBanner(data[idx]);
                                } else if ($scope.option.type == 'ange') {
                                    $location.url(data[idx].URL);
                                }
                            });

                            $scope.click_slickGoTo = function(idx) {
                                $scope.curIdx = idx;

                                // 클릭 슬라이드로 변경
                                angular.element('#'+$scope.option.id).slickGoTo(idx);
                            }

//                            $scope.list = data;
//
//                            for (var i in data) {
//                                var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
//
//                                // 슬라이드를 추가해 줌
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="carousel-inner" role="listbox"><div class="item active"><img data-lazy="'+img+'" style="width:100%;"/></div></div>');
//                            }
//
//                            //
//                            angular.element('#'+$scope.option.id).click(function() {
////                                var idx = angular.element('#'+$scope.option.id).slickCurrentSlide();
////
////                                if ($scope.option.type == 'banner') {
////                                    $window.open(data[idx].ada_url);
////                                } else if ($scope.option.type == 'experience') {
////                                    $location.url('/moms/experienceprocess/view/'+data[idx].ada_idx);
////                                } else if ($scope.option.type == 'event') {
////                                    $location.url('/moms/eventprocess/view/'+data[idx].ada_idx)
////                                }
//                            });
//
//                            // 광고의 롤링을 실행
//                            angular.element('#'+$scope.option.id).slickPlay();
//
//                            // 이미지가 변경될 때 우측 하단에 현재 광고 설명을 변경해 줌
//                            $scope.$watch(function() {
//                                // 현재 슬라이드를 반환
//                                return angular.element('#'+$scope.option.id).slickCurrentSlide();
//                            }, function(newVal, oldVal) {
//                                $scope.coverTitle = data[newVal].ada_title;
//                            });
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
            templateUrl: function(element, attrs) {
                return '/partials/ange/main/portlet-slide-banner.html';
            },
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

                // 롤링 이미지 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.list = data;

                            for (var i in data) {
                                var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;

//                                var link = '';
//
//                                if ($scope.option.type == 'banner') {
//                                    link = '<a id="'+data[i].ada_idx+'" name="'+data[i].ada_idx+'" href="'+data[i].ada_url+'" target="_blank">';
//                                } else if ($scope.option.type == 'experience') {
//                                    link = '<a href="/moms/experienceprocess/view/'+data[i].ada_idx+'">';
//                                } else if ($scope.option.type == 'event') {
//                                    link = '<a href="/moms/eventprocess/view/'+data[i].ada_idx+'">';
//                                }

                                // 슬라이드를 추가해 줌
                                angular.element('#'+$scope.option.id).slickAdd('<div class="carousel-inner" role="listbox"><div class="item active"><img data-lazy="'+img+'" style="width:100%;"/></div></div>');
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="carousel-inner" role="listbox"><div class="item active" style="border:1px solid red;">'+link+'<img class="moms_nowing" src="/imgs/ange/_blank_4by3.gif" style="background-image: url('+ img + '); border:1px solid blue;"/></a></div></div>');
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="carousel-inner" role="listbox"><div class="item active">'+url+'<img src="imgs/ange/temp/moms_jb_01.jpg" alt="First Label"></a></div></div>');
                            }

                            //
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

                            // 광고의 롤링을 실행
                            angular.element('#'+$scope.option.id).slickPlay();

                            // 이미지가 변경될 때 우측 하단에 현재 광고 설명을 변경해 줌
                            $scope.$watch(function() {
                                // 현재 슬라이드를 반환
                                return angular.element('#'+$scope.option.id).slickCurrentSlide();
                            }, function(newVal, oldVal) {
                                $scope.coverTitle = data[newVal].ada_title;
                            });
                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getPortletList();
            }]
        }
    }]);

    directives.directive('angePortletSlideImage', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { data: '=', ngModel: '=', dots: '=', autoplay: '=', centerMode: '=' },
//            replace: true,
            template: function(element, attrs) {
//                var scope = element.scope();
//                scope.option = scope.$eval(attrs.ngModel);
                return '<slick id="'+attrs.sid+'" dots="'+attrs.dots+'" autoplay="'+attrs.autoplay+'" center-mode="'+attrs.centerMode+'" slides-to-show="'+attrs.slidesToShow+'" fade="'+attrs.fade+'" touch-move="true" slides-to-scroll="1">' +
//                            '<div ng-repeat="item in items">' +
//                                '<img ng-src="{{item.src}}" ng-click="click_image(item.NO)">' +
//                            '</div>' +
                    '</slick>'
            },
            controller: ['$scope', '$attrs', '$location', '$window', 'CONSTANT', function($scope, $attrs, $location, $window, CONSTANT) {

                /********** 공통 콘트롤러 호출 **********/
//                angular.extend(this, $controller('ange-common', {$scope: $scope}));

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                $scope.toggle = true;
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = 5;

                var sid = $attrs.sid;

//                $scope.dots = $scope.option.dots;
//                $scope.autoplay = $scope.option.autoplay;
//                $scope.centerMode = $scope.option.centerMode;
//                $scope.showNo = $scope.option.showNo;
//                $scope.fade = $scope.option.fade;

                /********** 이벤트 **********/
                $scope.click_slickPause = function() {
                    angular.element('#'+sid).slickPause();
                    $scope.toggle = false;
                };

                $scope.click_slickPlay = function() {
                    angular.element('#'+sid).slickPlay();
                    $scope.toggle = true;
                };

                // 배너 클릭
                var click_image = function (url) {
//                    $window.open(url, '', 'width=400,height=500');
                };

                // 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){
//                            angular.element('#main').slickAdd('<div>test1<img src="../../../storage/cms/thumbnail/5488f0d97f8f5"/></div>').on('click', function() {
//                                alert("1")
//                            });

//                            $scope.list = data;
                            angular.element('#'+sid).slickAdd('<div><a href="http://www.google.co.kr" target="_blank"><img src="imgs/ange/temp/events_bg_001_pic.jpg"/></a></div>');
                            for(var i in data) {
                                var img = CONSTANT.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
                                data[i].FILE = img;

//                                var element = angular.element('<div><a href="'+data[i].URL+'" target="_blank"><img src="'+img+'"/></a></div>').on('click', function(e) {
//                                    alert(i);
//                                });

                                angular.element('#'+sid).slickAdd('<div><a href="'+data[i].URL+'" target="_blank"><img src="'+img+'"/></a></div>');
                            }

                            angular.element('#'+sid).slickPlay();

//                            $scope.items = [
//                                {src: '../../../storage/cms/thumbnail/548fe2e3ce16c', description: 'Image 00'},
//                                {src: '../../../storage/cms/thumbnail/5488f0d97f8f5', description: 'Image 01'},
//                                {src: '../../../storage/cms/thumbnail/54811d6d061c9', description: 'Image 02'},
//                                {src: '../../../storage/cms/thumbnail/54880cc4705d5', description: 'Image 03'},
//                                {src: '../../../storage/cms/thumbnail/548124ae6f650', description: 'Image 04'},
//                                {src: '../../../storage/cms/thumbnail/548124ae636e5', description: 'Image 00'},
//                                {src: '../../../storage/cms/thumbnail/548124ae7773a', description: 'Image 01'}
//                            ];

                        })
                        ['catch'](function(error){$scope.list = [];});
                };

                $scope.getPortletList();
            }],
            link: function (scope, element, attr) {
//                scope.url = attr.url;
//                scope.api = attr.api;
//                scope.portletTitle = attr.title;
//                scope.portletCss = attr.css;
//                scope.getPortletList(attr.api);
            }
        }
    }]);

    // 링크 이미지를 동적으로 생성
    directives.directive('angePortletLinkImage', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { images:'=' },
//            replace: true,
            template:
                //'<div class="inven_Highlight"><img ng-src="/imgs/ange/_blank_262by158.gif" ng-click="click_linkImage()" title="{{title}}" style="background-image:url({{img}}); width:100%;"/></div>',
                    '<div class="inven_subsideRoll">'+
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
                    $scope.search.ADP_IDX = $scope.option.gb;
                    $scope.search.ADA_STATE = 1;
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                // 이미지 클릭
                $scope.click_linkImage = function () {
                    if ($scope.option.open) {
                        $scope.click_linkBanner($scope.item);
//                        $window.open($scope.item.ada_url);
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
//                '<div class="inven_Highlight"><img ng-src="/imgs/ange/_blank_163by128.gif" ng-click="click_linkImage()" title="{{title}}" style="background-image:url({{img}}); width:100%;"/></div>',
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
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_linkImage = function () {
                    if ($scope.option.open) {
                        $scope.click_linkBanner($scope.item);
//                        $window.open($scope.item.ada_url);
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
            template:'<div ng-class="$index == 0 ? \'subside_inven_basic top\' : $index == 1 ? \'subside_inven_basic mid\' : \'subside_inven_basic btm\'" ng-repeat="item in list">' +
                     '   <div ng-show="isLoading" style="top: 40%;left: 40%; z-index: 1000;" class="ai-circled ai-indicator ai-grey-spin"></div>' +
                     '   <img ng-src="{{item.img}}" ng-click="click_linkImage(item)" title="{{item.title}}"/>' +
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
                    $scope.search.MENU = $scope.path[1];
                    $scope.search.CATEGORY = ($scope.path[2] == undefined ? '' : $scope.path[2]);
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_linkImage = function (item) {
                    if ($scope.option.open) {
                        $scope.click_linkBanner(item);
//                        $window.open(item.ada_url);
                    } else {
                        $location.url(item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            for(var i in data) {
                                console.log(JSON.stringify(data))
                                if ($scope.option.api == 'ad/banner') {
                                    var img = CONSTANT.AD_FILE_URL + data[i].ada_preview;
                                } else {
                                    var img = CONSTANT.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                }
                                var title = data[i].ada_title;

                                data[i].img = img;
                                data[i].title = title;
                            }

                            $scope.list = data;
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

                /********** 이벤트 **********/
                    // 투표 클릭
                $scope.click_showPoll = function (key) {
                    $location.url($scope.option.url + '/edit/' + key)
                };

                // 설문 조회
                $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, {POLL_ST: '1', SORT: 'RAND()', ORDER: ''}, false)
                    .then(function(data){$scope.item = data[0]})
                    ['catch'](function(error){$scope.item = [];});
            }]
        }
    }]);

    // 앙쥬 설문을 동적으로 생성
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
//                $scope.PAGE_NO = 0;
//                $scope.PAGE_SIZE = 1;
//
                /********** 이벤트 **********/
                    // 메뉴 이동
                $scope.click_moveMenu = function () {
                    $location.url($scope.option.url);
                };
//                    // 투표 클릭
//                $scope.click_showPoll = function (key) {
//                    alert($scope.option.url + '/view/' + key)
////                    $location.url($scope.option.url + '/view/' + key)
//                };
//
//                // 설문 조회
//                $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, {SORT:'REG_DT', ORDER: 'DESC', POLL_ST: '0'}, false)
//                    .then(function(data){$sco['catch']m = data[0]})
//                    .catch(function(error){$scope.item = [];});
            }]
        }
    }]);

//    angular.module('ange.portlet.tpls', ['test.html']);
//
//    angular.module('test.html', []).run(['$templateCache', function($templateCache) {
//        $templateCache.put('test.html',
//            '<div>test입니다.</div>'
//        );
//    }]);

});