/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsexperience-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsexperience-view', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        $scope.queue = [];
        $scope.search = {};

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'experienceprocess') {
                $scope.community = "진행중인 체험단";
                $scope.menu = "experienceprocess"
            } else if ($stateParams.menu == 'experiencepast') {
                $scope.community = "지난 체험단";
                $scope.menu = "experiencepast"
            }

            var date = new Date();

            // GET YYYY, MM AND DD FROM THE DATE OBJECT
            var year = date.getFullYear().toString();
            var mm = (date.getMonth()+1).toString();
            var dd  = date.getDate().toString();

            var today = year+'-'+mm+'-'+dd;

            $scope.todayDate = today;
        };

        $scope.click_focus = function(){
            //$('html,body').animate({scrollTop:$('#item').offset().top}, 150);
            $("#preg_fl").focus();

            //$("#moms_state").attr("tabindex", -1).focus(); div로 포커스를 줄때 사용

        }

        $scope.addHitCnt = function () {
            $scope.updateItem('ange/event', 'item', $stateParams.id, {ROLE: true}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 게시판 조회
        $scope.getMomsExperience = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;
                        $scope.products = data.PRODUCT.split(',');

                        var files = data.FILES;

                        //console.log(JSON.stringify(data));
                        for(var i in files) {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                            var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                            data.MAIN_FILE = img;
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_momseventcomp = function () {

            if($("#credit_agreement_Y").is(":checked")){
                $scope.item.CREDIT_FL = 'Y';
            }else{
                alert('제 3자 정보제공에 동의 하셔야 상품 발송이 가능합니다.');
                return;
            }

            $scope.search.REG_UID = $scope.uid;
            $scope.search.BOARD_NO = $scope.item.NO;

            $scope.getList('ange/comp', 'check', {}, $scope.search, false)
                .then(function(data){
                    var comp_cnt = data[0].COMP_CNT;

                    if (comp_cnt == 1) {

                        $scope.item.NO = data[0].NO;

                        $scope.updateItem('ange/comp', 'item', $scope.item.NO, $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '정상적으로 수정되었습니다.', {size: 'md'});

                                if ($stateParams.menu == 'eventprocess') {
                                    $location.url('/moms/eventprocess/list');
                                } else if($stateParams.menu == 'eventperformance') {
                                    $location.url('/moms/eventperformance/list');
                                }
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    } else {

                        $scope.insertItem('ange/comp', 'item', $scope.item, false)
                            .then(function(){

                                dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

                                if ($stateParams.menu == 'eventprocess') {
                                    $location.url('/moms/eventprocess/list');
                                } else if($stateParams.menu == 'eventperformance') {
                                    $location.url('/moms/eventperformance/list');
                                }
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        $scope.click_momsexperiencelist = function (){
            if ($stateParams.menu == 'experienceprocess') {
                $location.url('/moms/experienceprocess/list');
            } else if($stateParams.menu == 'experiencepast') {
                $location.url('/moms/experiencepast/list');
            }
        }

        $scope.getExperienceReviewList = function() {

            $scope.search.SYSTEM_GB = 'ANGE';
            /*            $scope.search.SORT = 'NOTICE_FL';
             $scope.search.ORDER = 'DESC'*/
            $scope.search.FILE = true;
            $scope.search.TARGET_NO = $stateParams.id;

            $scope.getList('ange/review', 'list', {NO: $scope.PAGE_NO, SIZE: 5}, $scope.search, true)
                .then(function(data){
                    var total_cnt = data[0].TOTAL_COUNT;
                    $scope.TOTAL_COUNT = total_cnt;

                    for(var i in data) {
                        if (data[i].FILE != null) {
                            var img = UPLOAD.BASE_URL + data[i].FILE[0].PATH + 'thumbnail/' + data[i].FILE[0].FILE_ID;
                            data[i].MAIN_FILE = img;

                        }
                    }


                    $scope.reviewList = data;



                })
                .catch(function(error){$scope.TOTAL_COUNT = 0; $scope.reviewList = "";});
        }

        // 조회 화면 이동
        $scope.click_showViewReview = function (key) {

            if ($stateParams.menu == 'experiencereview') {
                $location.url('/moms/experiencereview/view/'+key);
            } else if ($stateParams.menu == 'productreview') {
                $location.url('/moms/productreview/view/'+key);
            } else if ($stateParams.menu == 'angereview') {
                $location.url('/moms/angereview/view/'+key);
            } else if ($stateParams.menu == 'samplereview') {
                $$location.url('/moms/samplereview/view/'+key);
            } else if ($stateParams.menu == 'samplepackreview') {
                $location.url('/moms/samplepackreview/view/'+key);
            }else if ($stateParams.menu == 'eventreview') {
                $location.url('/moms/eventreview/view/'+key);
            }

        };

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.addHitCnt)
            .then($scope.getMomsExperience)
            .then($scope.getExperienceReviewList)
            .catch($scope.reportProblems);

        /*        $scope.init();
         $scope.addHitCnt();
         $scope.getMomsEvent();*/

    }]);
});
