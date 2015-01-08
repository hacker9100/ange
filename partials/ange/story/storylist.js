define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller("storylist", ['$scope', '$interval', '$timeout', 'UPLOAD', function($scope, $interval, $timeout, UPLOAD) {

        /********** 초기화 **********/
        $scope.busy = false;
        $scope.list = [];

        // 페이징
        $scope.PAGE_NO = 0;
        $scope.PAGE_SIZE = 12;

        /********** 이벤트 **********/
        $scope.fetchNext = function() {
            if(!$scope.busy) {
                $scope.busy = true;

                $scope.getContentList();
            }
        };

        // 이미지 조회
        $scope.getContentList = function () {
            $scope.getList('cms/task', 'list', {NO:$scope.PAGE_NO, SIZE:$scope.PAGE_SIZE}, {PHASE: '30', CONETNT: true}, true)
                .then(function(data){
                    console.log(JSON.stringify(data));

//                    for (var i in data) {
//                        if (data[i].FILE.PATH != undefined) {
//                            var img = UPLOAD.BASE_URL + data[i].FILE.PATH + 'thumbnail/' + data[i].FILE.FILE_ID;
//                            $scope.list.push({FILE: img, LIKE_FL: 0});
//                        }
//                    }

//                    $scope.list = data;
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});


                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_01.jpg', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_01.jpg', LIKE_FL: 0});
                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_02.jpg', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 0});
                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_03.jpg', LIKE_FL: 1});
                    $scope.list.push({FILE: '../../../imgs/ange/temp/comp_album_04.jpg', LIKE_FL: 0});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});
                    $scope.list.push({FILE: 'https://www.ange.co.kr/UserFiles/Upload_Living/1203-002.gif', LIKE_FL: 1});

                    $scope.PAGE_NO++;
                    $scope.busy = false;
                })
                .catch(function(error){$scope.list = [];});
        };
    }]);
});

