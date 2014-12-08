/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : user_list.html 화면 콘트롤러
 */

define([
    '../../js/admin/controller/controllers'
], function (controllers) {
    'use strict';

    // 사용할 서비스를 주입
    controllers.controller('user_list', ['$scope', '$stateParams', '$location', 'dialogs', function ($scope, $stateParams, $location, dialogs) {

        /********** 초기화 **********/
        // 검색 조건
        $scope.search = {SYSTEM_GB: 'ANGE'};
        $scope.action = {};

        // 목록 데이터
        $scope.listData = [];

        // 초기화
        $scope.init = function() {
            // 검색조건
            var condition = [{name: "이름", value: "USER_NM"}, {name: "아이디", value: "USER_ID"}, {name: "닉네임", value: "NICK_NM"}, {name: "전화번호", value: "PHONE"}, {name: "주소", value: "ADDR"}, {name: "이메일", value: "EMAIL"}, {name: "생일", value: "BIRTH"}, {name: "가입기간", value: "REG_DT"}];
            var type = [{name: "일반회원", value: "M"}, {name: "앙쥬클럽", value: "C"}, {name: "서포터즈", value: "S"}];
            var status = [{name: "전체", value: "A"}, {name: "정상", value: "N"}, {name: "불량", value: "F"}, {name: "휴면", value: "D"}, {name: "탈퇴", value: "S"}];
            var act = [{name: "일반정보", value: "A"}, {name: "커뮤니티활동", value: "C"}, {name: "참여활동", value: "P"}, {name: "블로거활동", value: "B"}];
            var sort = [{name: "가입일", value: "REG_DT"}, {name: "이름", value: "USER_NM"}, {name: "포인트", value: "POINT"}, {name: "스코어", value: "SCORE"}];
            var order = [{name: "내림차순", value: "DESC"}, {name: "오름차순", value: "ASC"}];

            var range = [{name: "선택한 회원", value: "C"}, {name: "리스트 전체", value: "A"}];
            var func = [{name: "엑셀저장", value: "excel"}, {name: "목록저장", value: "save"}, {name: "불량회원", value: ""}, {name: "블랙리스트", value: "blacklist"}, {name: "메일발송", value: "mail"}, {name: "문자발송", value: "sms"}, {name: "쪽지발송", value: "message"}, {name: "송장출력", value: "print"}, {name: "마일리지", value: "mileage"}];

            $scope.condition = condition;
            $scope.type = type;
            $scope.status = status;
            $scope.act = act;
            $scope.sort = sort;
            $scope.order = order;
            $scope.search.CONDITION = condition[0];
            $scope.search.STATUS = status[0].value;
            $scope.search.ACT = status[0].value;
            $scope.search.SORT = sort[0];
            $scope.search.ORDER = order[0];

            $scope.range = range;
            $scope.function = func;
            $scope.action.CHECKED = range[0].value;
            $scope.action.FUNCTION = func[0];
        };

        $scope.test = function() {
            console.log($scope.search.ACT);
            dialogs.notify('알림','test');
        }

        /********** 이벤트 **********/
        $scope.check_user = [];
        $scope.check_cnt = 0;
        $scope.$watch('check_user.selected', function(newArr, oldArr) {
            $scope.check_cnt = newArr.length;

//            if (newArr != undefined && newArr != '') $scope.check_cnt++;
//            if (oldArr != undefined && oldArr != '') $scope.check_cnt--;

//            var cnt = 0;
//            angular.forEach(list, function(item){
//                console.log(item)
//                cnt += item.CHECKED ? 1 : 0;
//            })
//            $scope.selected_cnt = cnt;
        }, true);

        var saveAs = saveAs
            // IE 10+ (native saveAs)
            || (typeof navigator !== "undefined" &&
            navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
            // Everyone else
            || (function(view) {
            "use strict";
            // IE <10 is explicitly unsupported
            if (typeof navigator !== "undefined" &&
                /MSIE [1-9]\./.test(navigator.userAgent)) {
                return;
            }
            var
                doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
                , get_URL = function() {
                    return view.URL || view.webkitURL || view;
                }
                , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
                , can_use_save_link = "download" in save_link
                , click = function(node) {
                    var event = doc.createEvent("MouseEvents");
                    event.initMouseEvent(
                        "click", true, false, view, 0, 0, 0, 0, 0
                        , false, false, false, false, 0, null
                    );
                    node.dispatchEvent(event);
                }
                , webkit_req_fs = view.webkitRequestFileSystem
                , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
                , throw_outside = function(ex) {
                    (view.setImmediate || view.setTimeout)(function() {
                        throw ex;
                    }, 0);
                }
                , force_saveable_type = "application/octet-stream; "
                , fs_min_size = 0
            // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
            // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
            // for the reasoning behind the timeout and revocation flow
                , arbitrary_revoke_timeout = 500 // in ms
                , revoke = function(file) {
                    var revoker = function() {
                        if (typeof file === "string") { // file is an object URL
                            get_URL().revokeObjectURL(file);
                        } else { // file is a File
                            file.remove();
                        }
                    };
                    if (view.chrome) {
                        revoker();
                    } else {
                        setTimeout(revoker, arbitrary_revoke_timeout);
                    }
                }
                , dispatch = function(filesaver, event_types, event) {
                    event_types = [].concat(event_types);
                    var i = event_types.length;
                    while (i--) {
                        var listener = filesaver["on" + event_types[i]];
                        if (typeof listener === "function") {
                            try {
                                listener.call(filesaver, event || filesaver);
                            } catch (ex) {
                                throw_outside(ex);
                            }
                        }
                    }
                }
                , FileSaver = function(blob, name) {
                    // First try a.download, then web filesystem, then object URLs
                    var
                        filesaver = this
                        , type = blob.type
                        , blob_changed = false
                        , object_url
                        , target_view
                        , dispatch_all = function() {
                            dispatch(filesaver, "writestart progress write writeend".split(" "));
                        }
                    // on any filesys errors revert to saving with object URLs
                        , fs_error = function() {
                            // don't create more object URLs than needed
                            if (blob_changed || !object_url) {
                                object_url = get_URL().createObjectURL(blob);
                            }
                            if (target_view) {
                                target_view.location.href = object_url;
                            } else {
                                var new_tab = view.open(object_url, "_blank");
                                if (new_tab == undefined && typeof safari !== "undefined") {
                                    //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                    view.location.href = object_url
                                }
                            }
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                            revoke(object_url);
                        }
                        , abortable = function(func) {
                            return function() {
                                if (filesaver.readyState !== filesaver.DONE) {
                                    return func.apply(this, arguments);
                                }
                            };
                        }
                        , create_if_not_found = {create: true, exclusive: false}
                        , slice
                        ;
                    filesaver.readyState = filesaver.INIT;
                    if (!name) {
                        name = "download";
                    }
                    if (can_use_save_link) {
                        object_url = get_URL().createObjectURL(blob);
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                        return;
                    }
                    // Object and web filesystem URLs have a problem saving in Google Chrome when
                    // viewed in a tab, so I force save with application/octet-stream
                    // http://code.google.com/p/chromium/issues/detail?id=91158
                    // Update: Google errantly closed 91158, I submitted it again:
                    // https://code.google.com/p/chromium/issues/detail?id=389642
                    if (view.chrome && type && type !== force_saveable_type) {
                        slice = blob.slice || blob.webkitSlice;
                        blob = slice.call(blob, 0, blob.size, force_saveable_type);
                        blob_changed = true;
                    }
                    // Since I can't be sure that the guessed media type will trigger a download
                    // in WebKit, I append .download to the filename.
                    // https://bugs.webkit.org/show_bug.cgi?id=65440
                    if (webkit_req_fs && name !== "download") {
                        name += ".download";
                    }
                    if (type === force_saveable_type || webkit_req_fs) {
                        target_view = view;
                    }
                    if (!req_fs) {
                        fs_error();
                        return;
                    }
                    fs_min_size += blob.size;
                    req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
                        fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                            var save = function() {
                                dir.getFile(name, create_if_not_found, abortable(function(file) {
                                    file.createWriter(abortable(function(writer) {
                                        writer.onwriteend = function(event) {
                                            target_view.location.href = file.toURL();
                                            filesaver.readyState = filesaver.DONE;
                                            dispatch(filesaver, "writeend", event);
                                            revoke(file);
                                        };
                                        writer.onerror = function() {
                                            var error = writer.error;
                                            if (error.code !== error.ABORT_ERR) {
                                                fs_error();
                                            }
                                        };
                                        "writestart progress write abort".split(" ").forEach(function(event) {
                                            writer["on" + event] = filesaver["on" + event];
                                        });
                                        writer.write(blob);
                                        filesaver.abort = function() {
                                            writer.abort();
                                            filesaver.readyState = filesaver.DONE;
                                        };
                                        filesaver.readyState = filesaver.WRITING;
                                    }), fs_error);
                                }), fs_error);
                            };
                            dir.getFile(name, {create: false}, abortable(function(file) {
                                // delete file if it already exists
                                file.remove();
                                save();
                            }), abortable(function(ex) {
                                if (ex.code === ex.NOT_FOUND_ERR) {
                                    save();
                                } else {
                                    fs_error();
                                }
                            }));
                        }), fs_error);
                    }), fs_error);
                }
                , FS_proto = FileSaver.prototype
                , saveAs = function(blob, name) {
                    return new FileSaver(blob, name);
                }
                ;
            FS_proto.abort = function() {
                var filesaver = this;
                filesaver.readyState = filesaver.DONE;
                dispatch(filesaver, "abort");
            };
            FS_proto.readyState = FS_proto.INIT = 0;
            FS_proto.WRITING = 1;
            FS_proto.DONE = 2;

            FS_proto.error =
                FS_proto.onwritestart =
                    FS_proto.onprogress =
                        FS_proto.onwrite =
                            FS_proto.onabort =
                                FS_proto.onerror =
                                    FS_proto.onwriteend =
                                        null;

            return saveAs;
        }(
            typeof self !== "undefined" && self
                || typeof window !== "undefined" && window
                || this.content
        ));

        // 실행 버튼 클릭
        $scope.click_function = function () {

            switch($scope.action.FUNCTION.value) {
                case 'excel' :
//                    $scope.getList('com/user', {NO:0, SIZE:5}, $scope.search, true)
//                        .then(function(data){
//                            var tbl = "<table border='1'>"+
//                                        "<thead>" +
//                                            "<tr>" +
//                                                "<th>이름</th>" +
//                                                "<th>Email</th>" +
//                                                "<th>DoB</th>" +
//                                            "</tr>" +
//                                        "</thead>" +
//                                        "<tbody>" +
//                                            "<tr>"+
//                                                "<td>사용자 ID</td>"+
//                                                "<td>사용자명</td>"+
//                                                "<td>별명</td>"+
//                                            "</tr>" +
//                                        "</tbody>" +
//                                        "</table>";
//                            var blob = new Blob([tbl], {
////                                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=euc-kr'
//                                type: 'application/vnd.ms-excel; charset=utf-8'
//                            });
//
//                            saveAs(blob, 'test' + '.xls');
//                        })
//                        .catch(function(error){alert(error)});

                    var data = "<table border='1'>"+
                                "<thead>" +
                                    "<tr>" +
                                        "<th>이름</th>" +
                                        "<th>Email</th>" +
                                        "<th>DoB</th>" +
                                    "</tr>" +
                                "</thead>" +
                                "<tbody>" +
                                    "<tr>"+
                                        "<td>사용자 ID</td>"+
                                        "<td>사용자명</td>"+
                                        "<td>별명</td>"+
                                    "</tr>" +
                                "</tbody>" +
                                "</table>";

                    $scope.excelDownload('com/excel', data, true)
                        .then(function(data){alert("-->>");})
                        .catch(function(error){alert(error)});

/*
                    var dataUrl = 'http://localhost/serverscript/services/com/excel.php';

//                    var data = "<table border='1'>"+
//                                "<tr>"+
//                                    "<td>사용자 ID</td>"+
//                                    "<td>사용자명</td>"+
//                                    "<td>별명</td>"+
//                                "</tr>" +
//                                "</table>";
//
//                    var dataUrl = 'data:application/octet-stream;' + data
                    var link = document.createElement('a');
                    angular.element(link)
                        .attr('href', dataUrl)
                        .attr('download', "bl.xlsx")
                        .attr('target', '_blank')
                    link.click();
*/

//                    $scope.getList('com/excel', {NO:0, SIZE:5}, $scope.search, true)
//                        .then(function(data){$scope.list = data; $scope.total_cnt = $scope.list.length;})
//                        .catch(function(error){alert(error)});
                    break;
                case 'save' :
                    alert('save')
                    break;

            };
        };

        // 목록갱신 버튼 클릭
        $scope.click_refreshList = function () {
            alert($scope.check_user.selected);
//            $scope.click_searchUser();
        };
                
        // 등록 버튼 클릭
        $scope.click_createNewUser = function () {
            $location.path('/user/edit/0');
        };
        
        // 자주쓰는 목록 버튼 클릭
        $scope.click_saveSearch = function () {
            var dlg = dialogs.create('save_list_modal.html',
                function($scope, $modalInstance, data) {
                    alert(data);
                    $scope.search = data;

                    $scope.click_ok = function () {
                        $modalInstance.close();
                    };
                },$scope.search,{size:'lg',keyboard: true,backdrop: false});
            dlg.result.then(function(){

            },function(){
                if(angular.equals($scope.name,''))
                    $scope.name = 'You did not enter in your name!';
            });
        };

        // 조회 화면 이동
        $scope.click_showViewUser = function (key) {
            $location.url('/user/view/'+key);
        };

        // 수정 화면 이동
        $scope.click_showEditUser = function (item) {
            $location.path('/user/edit/'+item.NO);
        };

        // 삭제 버튼 클릭
        $scope.click_deleteUser = function (item) {
            if (item.PROJECT_ST == '2') {
                alert("완료 상태의 프로젝트는 삭제할 수 없습니다.")
            }

            if ($rootScope.role != 'ADMIN' && $rootScope.role != 'MANAGER' && $rootScope.uid != item.REG_UID) {
                alert("삭제 권한이 없습니다.");
                return;
            }

            $scope.deleteItem('project', item.NO, false)
                .then(function(){$scope.getUserList($scope.search)})
                .catch(function(error){alert(error)});
        };

        // 검색 버튼 클릭
        $scope.click_searchUser = function () {
            $scope.getUserList();
        }

        // 사용자 목록 조회
        $scope.getUserList = function () {
            $scope.getList('com/user', {NO:0, SIZE:5}, $scope.search, true)
//            $scope.getList('project', {NO:0, SIZE:5}, search, true)
                .then(function(data){$scope.list = data; $scope.total_cnt = $scope.list.length;})
                .catch(function(error){alert(error)});
        };

        // 페이징 처리
        $scope.selectItems = 200; // 한번에 조회하는 아이템 수
        $scope.selectCount = 1; // 현재 조회한 카운트 수
        $scope.itemsPerPage = 10; // 화면에 보이는 아이템 수(default 10)
        $scope.maxSize = 5; // 총 페이지 제한

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };
/*
        $scope.pageChanged = function() {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        // 페이지 이동 시 이벤트
        $scope.$watch('isLoading', function() {
            if ($scope.listData == 'null') {
                $scope.projects = null;
            } else {
                $scope.projects = projectsData;
            }
        });

        // 페이지 이동 시 이벤트
        $scope.$watch('currentPage + itemsPerPage', function() {
            var start = $scope.currentPage % ( $scope.selectItems / $scope.itemsPerPage);

            var begin = ((start - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            if ($scope.listData != null) {
                $scope.projects = projectsData.slice(begin, end);
            }
        });

        $scope.$watch('selectItems * selectCount < itemsPerPage * currentPage', function() {
            $scope.selectCount = $scope.selectCount + 1;
        });
*/
        /********** 화면 초기화 **********/
        $scope.getSession()
            .then($scope.sessionCheck)
//            .then($scope.permissionCheck)
            .catch($scope.reportProblems);

        $scope.init();
        $scope.getUserList();

    }]);
});
