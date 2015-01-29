/**
 * Author : Yiseul.Choi
 * Email  : cys1128@marveltree.com
 * Date   : 2014-12-29
 * Description : peopleboard-view.html 화면 콘트롤러
 */

define([
    '../../../js/ange/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('peopleclinic-view', ['$scope', '$rootScope', '$stateParams', '$location', 'dialogs', 'ngTableParams', 'UPLOAD', function ($scope, $rootScope, $stateParams, $location, dialogs, ngTableParams, UPLOAD) {
        /********** 초기화 **********/
            // 첨부파일 초기화
        $scope.queue = [];
        // 게시판 초기화
        $scope.item = {};
        $scope.reply = {};
        $scope.search = {SYSTEM_GB: 'ANGE'};

        var date = new Date();

        // GET YYYY, MM AND DD FROM THE DATE OBJECT
        var year = date.getFullYear().toString();
        var mm = (date.getMonth()+1).toString();
        var dd  = date.getDate().toString();

        var today = year+'-'+mm+'-'+dd;

        $scope.todayDate = today;

        // 초기화
        $scope.init = function(session) {

            if ($stateParams.menu == 'childdevelop') {
                $scope.community = "아동발달 전문가";
                $scope.VIEW_ROLE = 'CLINIC';
                $scope.PROFILE = '아동발달 전문가 약력';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.community = "한방소아과 전문가";
                $scope.VIEW_ROLE = 'CLINIC';
                $scope.PROFILE = '한방소아과 전문가 약력';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.community = "산부인과 전문가";
                $scope.VIEW_ROLE = 'CLINIC';
                $scope.PROFILE = '산부인과 전문가 약력';
            } else if($stateParams.menu == 'momshealth') {
                $scope.community = "엄마건강 전문가";
                $scope.VIEW_ROLE = 'CLINIC';
                $scope.PROFILE = '엄마건강 전문가 약력';
            } else if($stateParams.menu == 'financial') {
                $scope.community = "재테크 상담";
                $scope.VIEW_ROLE = 'CLINIC';
                $scope.PROFILE = '재테크 전문가 약력';
            }
        };

        $scope.likeFl = function (){
            if($rootScope.uid != '' && $rootScope.uid != null){

                $scope.search.NO = $stateParams.id;
                $scope.search.TARGET_GB = 'BOARD';

                $scope.getItem('com/webboard', 'like', $stateParams.id, $scope.search, false)
                    .then(function(data){

                        if(data.TOTAL_COUNT == 0){
                            $scope.LIKE_FL = 'N';
                        }else{
                            $scope.LIKE_FL = data.LIKE_FL;
                            console.log($scope.LIKE_FL);
                        }

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }else{
                $scope.LIKE_FL = 'N';
            }

        }

        /********** 이벤트 **********/
            // 수정 버튼 클릭
        $scope.click_showPeopleClinicEdit = function (item) {

            if(item.PASSWORD_FL != 0){
                $scope.openCounselModal(item, 'lg');
            }else{
                if ($stateParams.menu == 'childdevelop') {
                    $location.url('/people/childdevelop/edit/'+item.NO);
                } else if($stateParams.menu == 'chlidoriental') {
                    $location.url('/people/chlidoriental/edit/'+item.NO);
                } else if($stateParams.menu == 'obstetrics') {
                    $location.url('/people/obstetrics/edit/'+item.NO);
                } else if($stateParams.menu == 'momshealth') {
                    $location.url('/people/momshealth/edit/'+item.NO);
                } else if($stateParams.menu == 'financial') {
                    $location.url('/people/financial/edit/'+item.NO);
                }
            }

        };

        // 수정클릭시 비밀번호 체크
        $scope.openCounselModal = function (item, size){

            var dlg = dialogs.create('peopleclinic_password_check.html',
                ['$scope', '$modalInstance', '$controller', 'data', function($scope, $modalInstance, $controller,data) {
                    /********** 공통 controller 호출 **********/
                    angular.extend(this, $controller('ange-common', {$scope: $scope}));

                    $scope.checkitem = {};
                    $scope.checkitem.NO = item.NO;
                    $scope.checkitem.BEFORE_PASSWORD = item.PASSWORD;

                    $scope.click_checkpassword = function (){

                        if($scope.checkitem.PASSWORD == ''){
                            dialogs.notify('알림', '비밀번호를 입력하세요', {size: 'md'});
                            return;
                        }

                        if($scope.checkitem.PASSWORD.length > 4){
                            dialogs.notify('알림', '비밀번호는 4자리로 입력하세요', {size: 'md'});
                            return;
                        }

                        $scope.getList('com/webboard', 'checkpassword', {} ,$scope.checkitem, false)
                            .then(function(data){
                                //dialogs.notify('알림', '수정화면으로 이동합니다', {size: 'md'});

                                var check_count = data[0].CHECK_COUNT;

                                if(check_count == 1){
                                    $modalInstance.close();

                                    if ($stateParams.menu == 'childdevelop') {
                                        $location.url('/people/childdevelop/edit/'+item.NO);
                                    } else if($stateParams.menu == 'chlidoriental') {
                                        $location.url('/people/chlidoriental/edit/'+item.NO);
                                    } else if($stateParams.menu == 'obstetrics') {
                                        $location.url('/people/obstetrics/edit/'+item.NO);
                                    } else if($stateParams.menu == 'momshealth') {
                                        $location.url('/people/momshealth/edit/'+item.NO);
                                    } else if($stateParams.menu == 'financial') {
                                        $location.url('/people/financial/edit/'+item.NO);
                                    }
                                } else {
                                    dialogs.notify('알림', '비밀번호가 일치하지 않습니다', {size: 'md'});
                                    return;
                                }
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'})});
                    }

                    $scope.click_cancel = function () {
                        $modalInstance.close();
                    };


                }], item, {size:size,keyboard: true}, $scope);
            dlg.result.then(function(){

            },function(){

            });
        };

        // 목록 버튼 클릭
        $scope.click_showPeopleClinicList = function () {
            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/list');
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/list');
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/list');
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/list');
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/list');
            }
        };


        $scope.addHitCnt = function () {
            $scope.updateItem('com/webboard', 'hit', $stateParams.id, {}, false)
                .then(function(){
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }


        // 게시판 조회
        $scope.getPeopleClinic = function () {
            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'item', $stateParams.id, {}, false)
                    .then(function(data){
                        $scope.item = data;


                        if(data.REPLY_YN == 'N'){
                            $scope.item.BODY;
                        } else {
                            $scope.item.BODY = data.BODY+"<br><br><br><br><br><p>전문가 답변<br>"+data.REPLY_BODY+"</p>";
                        }

                        $scope.reply.SUBJECT = "[답변]"+$scope.item.SUBJECT;
                        $scope.reply.PARENT_NO = $scope.item.NO;

                    })
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }
        };

        // 답글 등록
        $scope.click_savePeopleBoardComment = function () {

            $scope.reply.SYSTEM_GB = 'ANGE';

            if ($stateParams.menu == 'childdevelop') {
                $scope.reply.COMM_NO = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.reply.COMM_NO = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.reply.COMM_NO = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.reply.COMM_NO = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.reply.COMM_NO = '13';
            }

            $scope.insertItem('com/webboard', 'item', $scope.reply, false)
                .then(function(){

                    dialogs.notify('알림', '정상적으로 등록되었습니다.', {size: 'md'});

/*                    if ($stateParams.menu == 'childdevelop') {
                        $location.url('/people/childdevelop/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'chlidoriental') {
                        $location.url('/people/chlidoriental/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'obstetrics') {
                        $location.url('/people/obstetrics/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'momshealth') {
                        $location.url('/people/momshealth/view/'+$scope.item.NO);
                    } else if($stateParams.menu == 'financial') {
                        $location.url('/people/financial/view/'+$scope.item.NO);
                    }*/
                    if ($stateParams.menu == 'childdevelop') {
                        $location.url('/people/childdevelop/list');
                    } else if($stateParams.menu == 'chlidoriental') {
                        $location.url('/people/chlidoriental/list');
                    } else if($stateParams.menu == 'obstetrics') {
                        $location.url('/people/obstetrics/list');
                    } else if($stateParams.menu == 'momshealth') {
                        $location.url('/people/momshealth/list');
                    } else if($stateParams.menu == 'financial') {
                        $location.url('/people/financial/list');
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
        }

        // 이전글
        $scope.getPreBoard = function (){


            if ($stateParams.menu == 'childdevelop') {
                $scope.search['COMM_NO'] = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.search['COMM_NO'] = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.search['COMM_NO'] = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.search['COMM_NO'] = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.search['COMM_NO'] = '13';
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_PRE = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.preBoardView = data;
                    })
                    .catch(function(error){$scope.preBoardView = "";})
            }
        }

        // 다음글
        $scope.getNextBoard = function (){

            if ($stateParams.menu == 'childdevelop') {
                $scope.search['COMM_NO'] = '09';
            } else if($stateParams.menu == 'chlidoriental') {
                $scope.search['COMM_NO'] = '10';
            } else if($stateParams.menu == 'obstetrics') {
                $scope.search['COMM_NO'] = '11';
            } else if($stateParams.menu == 'momshealth') {
                $scope.search['COMM_NO'] = '12';
            } else if($stateParams.menu == 'financial') {
                $scope.search['COMM_NO'] = '13';
            }

            $scope.search.KEY = $stateParams.id;
            $scope.search.BOARD_NEXT = true;

            if ($stateParams.id != 0) {
                return $scope.getItem('com/webboard', 'list',{} , $scope.search, false)
                    .then(function(data){
                        $scope.nextBoardView = data;
                    })
                    .catch(function(error){$scope.nextBoardView = "";})
            }
        }

        // 조회 화면 이동
        $scope.click_showViewPeopleBoard = function (key) {

            if ($stateParams.menu == 'childdevelop') {
                $location.url('/people/childdevelop/view/'+key);
            } else if($stateParams.menu == 'chlidoriental') {
                $location.url('/people/chlidoriental/view/'+key);
            } else if($stateParams.menu == 'obstetrics') {
                $location.url('/people/obstetrics/view/'+key);
            } else if($stateParams.menu == 'momshealth') {
                $location.url('/people/momshealth/view/'+key);
            } else if($stateParams.menu == 'financial') {
                $location.url('/people/financial/view/'+key);
            }

        };

        $scope.click_showPeopleClinicDelete = function(item) {
            var dialog = dialogs.confirm('알림', '삭제 하시겠습니까.', {size: 'md'});

            dialog.result.then(function(btn){
                $scope.deleteItem('com/webboard', 'item', item.NO, true)
                    .then(function(){dialogs.notify('알림', '정상적으로 삭제되었습니다.', {size: 'md'});
                        if ($stateParams.menu == 'childdevelop') {
                            $location.url('/people/childdevelop/list');
                        } else if($stateParams.menu == 'chlidoriental') {
                            $location.url('/people/chlidoriental/list');
                        } else if($stateParams.menu == 'obstetrics') {
                            $location.url('/people/obstetrics/list');
                        } else if($stateParams.menu == 'momshealth') {
                            $location.url('/people/momshealth/list');
                        } else if($stateParams.menu == 'financial') {
                            $location.url('/people/financial/list');
                        }
                        ;})
                    .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
            }, function(btn) {
                return;
            });
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
            $scope.likeItem.TARGET_GB = 'BOARD';

            $scope.insertItem('com/like', 'item', $scope.likeItem, false)
                .then(function(){
                    var afterLike = $scope.likeItem.LIKE_FL == 'Y' ? 'N' : 'Y';
                    if (afterLike == 'Y') {
                        dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleClinic();
                    } else {
                        dialogs.notify('알림', '공감 취소되었습니다.', {size: 'md'});

                        $scope.likeFl();
                        $scope.getPeopleClinic();
                    }
                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

            /*            $scope.updateItem('com/webboard', 'likeCntitem', item.NO, {}, false)
             .then(function(){

             dialogs.notify('알림', '공감 되었습니다.', {size: 'md'});
             $scope.getPeopleBoard();
             })
             .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});*/
        };

        // 스크랩
        $scope.click_scrapAdd = function(item){

            $scope.search['TARGET_NO'] = item.NO;

            // $scope.search['USER_UID'] = 'test'; 세션 uid를 저장해야함
            $scope.search['REG_UID'] = 'hong'; // 테스트

            $scope.getList('com/scrap', 'check', {}, $scope.search, false)
                .then(function(data){
                    var scrap_cnt = data[0].SCRAP_CNT;

                    if (scrap_cnt == 1) {
                        dialogs.notify('알림', '이미 스크랩 된 게시물 입니다.', {size: 'md'});
                    } else {

                        $scope.scrap = {};

                        $scope.scrap.TARGET_NO = item.NO;
                        $scope.scrap.TARGET_GB = item.BOARD_GB;

                        // [테스트] 등록자아이디, 등록자명, 닉네임 은 세션처리 되면 삭제할예정
                        $scope.scrap.REG_UID = 'hong';
                        $scope.scrap.NICK_NM = '므에에롱';
                        $scope.scrap.REG_NM = '홍길동';

                        $scope.insertItem('com/scrap', 'item', $scope.scrap, false)
                            .then(function(){

                                dialogs.notify('알림', '스크랩 되었습니다.', {size: 'md'});
                                $scope.getPeopleClinic();
                            })
                            .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});
                    }

                })
                .catch(function(error){dialogs.error('오류', error+'', {size: 'md'});});

        };

        /********** 화면 초기화 **********/
        /*        $scope.getSession()
         .then($scope.sessionCheck)
         .then($scope.init)
         .then($scope.getCmsBoard)
         .catch($scope.reportProblems);*/
        //$scope.addHitCnt();
        $scope.init();
        $scope.likeFl();
        $scope.getPeopleClinic();
        $scope.getPreBoard();
        $scope.getNextBoard();


    }]);
});
