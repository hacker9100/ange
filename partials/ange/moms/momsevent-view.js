/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : momsevent-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('momsevent-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope,$rootScope, $stateParams, $location, dialogs, UPLOAD) {


        $scope.queue = [];
        $scope.search = {};

        // 초기화
        $scope.init = function(session) {
            if ($stateParams.menu == 'eventprocess') {
                $scope.community = "진행중인 이벤트";
            } else if ($stateParams.menu == 'eventperformance') {
                $scope.community = "공연/체험 이벤트";
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
        $scope.getMomsEvent = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('ange/event', 'item', $stateParams.id, {}, false)
                    .then(function(data){

                        $scope.item = data;
                        var files = data.FILES;

                        //console.log(JSON.stringify(data));
                        for(var i in files) {
//                            $scope.queue.push({"name":files[i].FILE_NM,"size":files[i].FILE_SIZE,"url":UPLOAD.BASE_URL+files[i].PATH+files[i].FILE_ID,"thumbnailUrl":UPLOAD.BASE_URL+files[i].PATH+"thumbnail/"+files[i].FILE_ID,"mediumUrl":UPLOAD.BASE_URL+files[i].PATH+"medium/"+files[i].FILE_ID,"deleteUrl":"http://localhost/serverscript/upload/?file="+files[i].FILE_NM,"deleteType":"DELETE"});
                                var img = UPLOAD.BASE_URL + files[i].PATH + 'thumbnail/' + files[i].FILE_ID;
                                data.MAIN_FILE = img;
                        }


                        $scope.search.TARGET_NO = $stateParams.id;
                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        $scope.click_momseventcomp = function () {

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

        $scope.click_momseventlist = function (){
            if ($stateParams.menu == 'eventprocess') {
                $location.url('/moms/eventprocess/list');
            } else if($stateParams.menu == 'eventperformance') {
                $location.url('/moms/eventperformance/list');
            }
        }

        $scope.getSession()
            .then($scope.sessionCheck)
            .then($scope.init)
            .then($scope.addHitCnt)
            .then($scope.getMomsEvent)
            .catch($scope.reportProblems);

        /*        $scope.init();
         $scope.addHitCnt();
         $scope.getMomsEvent();*/



    }]);
});
