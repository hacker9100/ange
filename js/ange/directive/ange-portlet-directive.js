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
                return '/partials/ange/com/portlet-main-list.html';
            },
            controller: ['$scope', '$attrs', '$location', 'UPLOAD', function($scope, $attrs, $location, UPLOAD) {

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
                $scope.search.SYSTEM_GB = 'ANGE';
                $scope.search.NOTICE_FL = 'N';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.tab != undefined) {
                    if ($scope.option.type == 'board') {
                        $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;
                    } else if ($scope.option.type == 'review') {
                        $scope.search.TARGET_GB = $scope.option.tab[$scope.tabIdx].no;
                    }
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined) {
                    $scope.search.FILE = true;
                }

                // 검색 조건에 게시판 종류 추가
                if ($scope.option.type != undefined) {
                    if ($scope.option.type == 'review') {
//                        $scope.search.TARGET_GB = angular.uppercase($scope.option.type);
                    } else {
                        $scope.search.BOARD_GB = angular.uppercase($scope.option.type);
                    }
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
                    alert($scope.option.url);
                    return;
                    if ($scope.option.tab != undefined) {
                        $location.url('/people'+'/'+$scope.option.tab[$scope.tabIdx].menu+'/list');
                    } else {
                        $location.url($scope.option.url+'/list');
                    }
                };

                // 리스트 선택
                $scope.click_showView = function (key) {
                    alert($scope.option.url + '/view/' + key)
                    return;
                    $location.url($scope.option.url+'/view/'+key);
                };

                // 리스트 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, false)
                        .then(function(data){
                            $scope.list = data;
                            if ($scope.option.image != undefined && $scope.option.image) {
                                $scope.key = data[0].NO;
                                $scope.img = UPLOAD.BASE_URL + data[0].FILE[0].PATH + 'thumbnail/' + data[0].FILE[0].FILE_ID;
                            }
                        })
                        .catch(function(error){$scope.list = [];});
                };

                $scope.getPortletList();
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
                return '/partials/ange/com/portlet-channel-list.html';
            },
            controller: ['$scope', '$attrs', '$location', 'UPLOAD', function($scope, $attrs, $location, UPLOAD) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 상단 타이틀
                $scope.portletTitle = $scope.option.title;

                // 탭 번호
                $scope.tabIdx = 0;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                $scope.search.SYSTEM_GB = 'ANGE';
                $scope.search.NOTICE_FL = 'N';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.tab != undefined) {
                    $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;
                }

                // 검색 조건에 대표 이미지 여부 추가
                if ($scope.option.image != undefined) {
                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                    // 탭 클릭
                $scope.click_tabIndex = function (idx) {
                    $scope.tabIdx = idx;
                    $scope.search.COMM_NO = $scope.option.tab[$scope.tabIdx].no;

                    // 탭 번호로 리스트 조회
                    $scope.getPortletList();
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

                // 리스트 조회
                $scope.getPortletList = function () {
                    $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, $scope.search, false)
                        .then(function(data){
                            $scope.list = data;
//                            if ($scope.option.image != undefined && $scope.option.image) {
//                                $scope.key = data[0].NO;
//                                $scope.img = UPLOAD.BASE_URL + data[0].FILE[0].PATH + 'thumbnail/' + data[0].FILE[0].FILE_ID;
//                            }
                        })
                        .catch(function(error){$scope.list = [];});
                };

                $scope.getPortletList();
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
                return '/partials/ange/com/portlet-slide-page.html';
            },
            controller: ['$scope', '$attrs', '$location', 'UPLOAD', function($scope, $attrs, $location, UPLOAD) {

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
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){
                            for (var i in data) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                // 슬라이드를 추가해 줌
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title">'+( data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' : data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_blue">체험단</span>' : '<span class="mini_event_txt_emblem coloremblem_brown">서평단</span>') + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
                            }

                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단1</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단2</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단3</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단4</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단5</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');
//                            angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="imgs/ange/temp/eventscol_003_pic.jpg"  /><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_brown">서평단6</span>교감여행 서평단</div><div class="mini_event_txt_duration">2014.10.11~2014.11.10</div></div></div>');

                            // 광고의 슬라이드을 실행
                            angular.element('#'+$scope.option.id).slickPlay();
                        })
                        .catch(function(error){});
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
                return '/partials/ange/com/portlet-slide-baby.html';
            },
            controller: ['$scope', '$attrs', '$location', 'UPLOAD', function($scope, $attrs, $location, UPLOAD) {

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
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){
//                            for (var i in data) {
//                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
//                                // 슬라이드를 추가해 줌
////                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title"><span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
//                                angular.element('#'+$scope.option.id).slickAdd('<div class="col-xs-4 mini_event_contentcol"><div class="mini_event_content"><div class="mini_event_closed"></div><img class="mini_event_txt_img" src="'+img+'"/><div class="mini_event_txt_title">'+( data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_purple">이벤트</span>' : data[i].EVENT_GB == "EVENT" ? '<span class="mini_event_txt_emblem coloremblem_blue">체험단</span>' : '<span class="mini_event_txt_emblem coloremblem_brown">서평단</span>') + data[i].SUBJECT +'</div><div class="mini_event_txt_duration">'+data[i].START_YMD+'~'+data[i].END_YMD+'</div></div></div>');
//                            }

                            angular.element('#'+$scope.option.id).slickAdd('<div><a href="http://www.naver.com" ><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt=""/></a>></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');
                            angular.element('#'+$scope.option.id).slickAdd('<div><img src="imgs/ange/mini_peoplebabymodel_01.png" width="99" height="119" alt="" on-click="test(\'1\')"/></div>');

                            // 광고의 슬라이드을 실행
                            angular.element('#'+$scope.option.id).slickPlay();
                        })
                        .catch(function(error){});
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

    // 롤링 배너를 동적으로 생성
    directives.directive('angePortletSlideBanner', ['$controller', function($controller) {
        return {
            restrict: 'EA',
            scope: true,
//            scope: { data: '=', ngModel: '=', dots: '=', autoplay: '=', centerMode: '=' },
//            replace: true,
            templateUrl: function(element, attrs) {
                return '/partials/ange/com/portlet-slide-banner.html';
            },
            controller: ['$scope', '$attrs', '$location', '$window', 'UPLOAD', function($scope, $attrs, $location, $window, UPLOAD) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 일시정지, 동작 상태
                $scope.toggle = true;

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                if ($scope.option.api == 'ad/banner') {
                    $scope.search.LOCATION_GB = $scope.option.gb;
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
                            for (var i in data) {
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + data[i].FILE.FILE_ID;
                                // 슬라이드를 추가해 줌
                                angular.element('#'+$scope.option.id).slickAdd('<div class="carousel-inner" role="listbox"><div class="item active"><a href="'+data[i].URL+'" target="_blank"><img src="'+img+'"/></a></div></div>');
                            }

                            // 광고의 롤링을 실행
                            angular.element('#'+$scope.option.id).slickPlay();

                            // 이미지가 변경될 때 우측 하단에 현재 광고 설명을 변경해 줌
                            $scope.$watch(function() {
                                // 현재 슬라이드를 반환
                                return angular.element('#'+$scope.option.id).slickCurrentSlide();
                            }, function(newVal, oldVal) {
                                $scope.coverTitle = data[newVal].SUBJECT;
                            });
                        })
                        .catch(function(error){$scope.list = [];});
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
            controller: ['$scope', '$attrs', '$location', '$window', 'UPLOAD', function($scope, $attrs, $location, $window, UPLOAD) {

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
                    alert(sid)
                    angular.element('#'+sid).slickPause();
                    $scope.toggle = false;
                };

                $scope.click_slickPlay = function() {
                    alert(sid)
                    angular.element('#'+sid).slickPlay();
                    $scope.toggle = true;
                };

                // 배너 클릭
                var click_image = function (url) {
                    alert(url);
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
                                var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
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
                        .catch(function(error){$scope.list = [];});
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

    directives.directive('angePortletSlide', ['$controller', function($controller) {
        return {
            restrict: 'EA',
//            scope: { images:'=' },
//            replace: true,
            template: '<slider images="images"/>',
            controller: ['$scope', '$location', '$window', function($scope, $location, $window) {

                /********** 공통 콘트롤러 호출 **********/
//                angular.extend(this, $controller('ange-common', {$scope: $scope}));
                /********** 초기화 **********/

                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = 5;

                // 테스트 이미지
                $scope.images = [
                    {src: '../../../imgs/ange/img/img00.jpg', description: 'Image 00'},
                    {src: '../../../imgs/ange/img/img01.jpg', description: 'Image 01'},
                    {src: '../../../imgs/ange/img/img02.jpg', description: 'Image 02'},
                    {src: '../../../imgs/ange/img/img03.jpg', description: 'Image 03'},
                    {src: '../../../imgs/ange/img/img04.jpg', description: 'Image 04'}
                ];

                /********** 이벤트 **********/
                    // 배너 클릭
                $scope.click_linkBanner = function (url) {
                    $window.open(url, '', 'width=400,height=500');
                };

                // 이미지 조회
                $scope.getPortletList = function (api) {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {}, true)
                        .then(function(data){$scope.list = data})
                        .catch(function(error){$scope.list = [];});
                };
            }],
            link: function (scope, element, attr) {
                scope.url = attr.url;
                scope.api = attr.api;
                scope.portletTitle = attr.title;
                scope.portletCss = attr.css;
                scope.getPortletList(attr.api);
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
            template: '<div class="inven_Highlight"><img class="ADbanner_normal" ng-src="{{img}}" ng-click="click_linkImage()"/></div>',
            controller: ['$scope', '$attrs', '$location', '$window', 'UPLOAD', function($scope, $attrs, $location, $window, UPLOAD) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                if ($scope.option.api == 'ad/banner') {
                    $scope.search.LOCATION_GB = $scope.option.gb;
                }

                /********** 이벤트 **********/
                // 이미지 클릭
                $scope.click_linkImage = function () {
                    alert($scope.item.URL);
                    return;

                    if ($scope.option.new) {
                        $window.open($scope.item.URL, '', 'width=400,height=500');
                    } else {
                        $location.url($scope.item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){
                            $scope.item = data[0];
                            $scope.img = UPLOAD.BASE_URL + data[0].FILE.PATH + data[0].FILE.FILE_ID;
                        })
                        .catch(function(error){$scope.list = [];  alert(error)});
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
                return '/partials/ange/com/portlet-piece-image.html';
            },
            controller: ['$scope', '$attrs', '$location', '$window', 'UPLOAD', function($scope, $attrs, $location, $window, UPLOAD) {

                /********** 초기화 **********/
                $scope.option = $scope.$eval($attrs.ngModel);

                // 검색 조건
                $scope.search = {};

                // 페이징
                $scope.PAGE_NO = 0;
                $scope.PAGE_SIZE = $scope.option.size;

                // 검색 조건 추가
                $scope.search.SYSTEM_GB = 'ANGE';
                $scope.search.NOTICE_FL = 'N';

                // 검색 조건에 커뮤니티 번호 추가
                if ($scope.option.type != undefined) {
//                    $scope.search.COMM_NO = $scope.option.comm;
                    $scope.search.BOARD_GB = angular.uppercase($scope.option.type);
                    $scope.search.FILE = true;
                }

                /********** 이벤트 **********/
                    // 이미지 클릭
                $scope.click_linkImage = function () {
                    alert($scope.item.URL);
                    return;

                    if ($scope.option.new) {
                        $window.open($scope.item.URL, '', 'width=400,height=500');
                    } else {
                        $location.url($scope.item.URL);
                    }
                };

                // 이미지 조회
                $scope.getImage = function () {
                    $scope.getList($scope.option.api, 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, $scope.search, true)
                        .then(function(data){

                            for(var i in data) {
                                if (data[i].FILE != null) {
                                    var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                                    data[i].FILE = img;
                                    console.log(i+ " file : " + JSON.stringify(data[i].FILE));
                                }
                            }

                            $scope.list = data;
                        })
                        .catch(function(error){$scope.list = [];  alert(error)});
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
            templateUrl: '/partials/ange/com/portlet-link-poll.html',
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
                $scope.getList($scope.option.api, 'list', {NO: $scope.PAGE_NO, SIZE: $scope.PAGE_SIZE}, {SORT:'REG_DT', ORDER: 'DESC', POLL_ST: '0'}, false)
                    .then(function(data){$scope.item = data[0]})
                    .catch(function(error){$scope.item = [];});
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
            templateUrl: '/partials/ange/com/portlet-link-menu.html',
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
//                    .then(function(data){$scope.item = data[0]})
//                    .catch(function(error){$scope.item = [];});
            }]
        }
    }]);

    angular.module('ange.portlet.tpls', ['test.html']);

    angular.module('test.html', []).run(['$templateCache', function($templateCache) {
        $templateCache.put('test.html',
            '<div>test입니다.</div>'
        );
    }]);

});