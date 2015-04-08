/**
 * Author : Sunghwan Kim
 * Email  : hacker9100@gmail.com
 * Date   : 2015-01-06
 * Description : myangecalendar.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('myangecalendar', ['$scope', '$stateParams', '$location', 'dialogs', 'UPLOAD', function ($scope, $stateParams, $location, dialogs, UPLOAD) {

        // 초기화
        $scope.init = function(session) {

            // $scope.search.year 가 null 일때 당해 입력
            // $scope.search.month 가 null 일때 당월 입력
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


            $scope.getEventList();
        };


        // 일반 게시판 목록 조회
        $scope.getEventList = function () {

            $scope.getList('ange/calendar', 'list', {}, {"year":$scope.search.year,"month":$scope.search.month}, true)
                .then(function(data){
/*
                    var i = 0;
                    var preIdx = 0;
                    for (var idx in data.list) {
                        preIdx = idx;
                        if (i != 0 && data.list[idx].day == data.list[preIdx].day) {
                            data.list[idx].day = '';
                        }

                        i++;
                    }
*/

                    $scope.data = data;
                })
                ['catch'](function(error){
                alert('error');
            });
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

        $scope.init();


    }]);
});
