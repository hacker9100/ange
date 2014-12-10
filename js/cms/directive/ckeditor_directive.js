/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : youtube Directive 선언
 */
define(['./directives'], function (directives) {
    'use strict';
/*
    directives.directive('ckedit1', function() {
        CKEDITOR.disableAutoInline = true;
        return {
            require: '?ngModel',
            link: function ($scope, elm, attr, ngModel) {

                var ck = CKEDITOR.replace(elm[0]);

                ck.on('pasteState', function () {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(ck.getData());
                    });
                });

                ngModel.$render = function (value) {
                    ck.setData(ngModel.$modelValue);
                };
            }
        };
    });

    directives.directive('ckeditor', function ($parse) {
        CKEDITOR.disableAutoInline = true;
        var counter = 0,
            prefix = '__ckd_';

        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                var getter = $parse(attrs.ckedit),
                    setter = getter.assign;

                attrs.$set('contenteditable', true); // inline ckeditor needs this
                if (!attrs.id) {
                    attrs.$set('id', prefix + (++counter));
                }

                // CKEditor stuff
                // Override the normal CKEditor save plugin

                CKEDITOR.plugins.registered['save'] =
                {
                    init: function (editor) {
                        editor.addCommand('save',
                            {
                                modes: { wysiwyg: 1, source: 1 },
                                exec: function (editor) {
                                    if (editor.checkDirty()) {
                                        var ckValue = editor.getData();
                                        scope.$apply(function () {
                                            setter(scope, ckValue);
                                        });
                                        ckValue = null;
                                        editor.resetDirty();
                                    }
                                }
                            }
                        );
                        editor.ui.addButton('Save', { label: 'Save', command: 'save', toolbar: 'document' });
                    }
                };
                var options = {};
                options.on = {
                    blur: function (e) {
                        if (e.editor.checkDirty()) {
                            var ckValue = e.editor.getData();
                            scope.$apply(function () {
                                setter(scope, ckValue);
                            });
                            ckValue = null;
                            e.editor.resetDirty();
                        }
                    }
                };
//                options.extraPlugins = 'sourcedialog';
//                options.removePlugins = 'sourcearea';
                var editorangular = CKEDITOR.inline(element[0], options); //invoke

                scope.$watch(attrs.ckedit, function (value) {
                    editorangular.setData(value);
                });
            }
        }

    });
*/
    var $defer, loaded = false;

    directives.run(['$q', '$timeout', function($q, $timeout) {
        $defer = $q.defer();

        if (angular.isUndefined(CKEDITOR)) {
            throw new Error('CKEDITOR not found');
        }
        CKEDITOR.disableAutoInline = true;
        function checkLoaded() {
            if (CKEDITOR.status == 'loaded') {
                loaded = true;
                $defer.resolve();
            } else {
                checkLoaded();
            }
        }
        CKEDITOR.on('loaded', checkLoaded);
        $timeout(checkLoaded, 100);
    }])

    directives.directive('ckeditor', ['$timeout', '$q', function ($timeout, $q) {
        'use strict';

        return {
            restrict: 'AC',
            require: ['ngModel', '^?form'],
            scope: false,
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                var form    = ctrls[1] || null;
                var EMPTY_HTML = '<p></p>',
//                                '<img id="dropzone" src="http://localhost/serverscript/upload/../../upload/files/medium/Koala%20%285%29.jpg" />',
                    isTextarea = element[0].tagName.toLowerCase() == 'textarea',
                    data = [],
                    isReady = false;

                if (!isTextarea) {
                    element.attr('contenteditable', true);
                }

                var onLoad = function () {
                    var options = {
                        allowedContent: true,
//                        allowedContent: {div: {style: true, id: true, class:true}},
                        extraAllowedContent: 'img{!width,!height}',
                        toolbar: 'full',
//                        toolbar_full: [
                        toolbar_full: [
                            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                            { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                            { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                            { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
//                            { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
                            '/',
                            { name: 'styles', items: [ 'Font', 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
//                            { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },
                            { name: 'insert', items: [ 'Table', 'SpecialChar' ] },
                            { name: 'forms', items: [ 'Outdent', 'Indent' ] },
                            { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                            { name: 'document', items: [ 'PageBreak', 'Source' ] }
                        ],
                        format_tags: 'p;h2;h3;pre;links;test;test2',
                        format_links: {
                            name: 'Links',
                            element: 'span',
                            styles: {
                                color: 'red',
                                'font-family': 'arial',
                                'font-weight': 'bold'
                            }
                        },
                        format_test: {
                            name: 'Test',
                            element: 'span',
                            styles: {
                                color: 'red',
                                'font-family': 'arial',
                                'font-weight': 'bold'
                            }
                        },
                        format_test2: {
                            name: 'Test2',
                            element: 'span',
                            attributes : {
                                'class' : 'contentTitle2'
                            }
                        },
//                        disableNativeSpellChecker: false,
                        uiColor: '#FAFAFA',
                        height: '400px'
//                        width: '780px'
//                        filebrowserBrowseUrl : 'lib/ckfinder/ckfinder.html',
//                        filebrowserImageBrowseUrl : 'lib/ckfinder/ckfinder.html?type=Images',
//                        filebrowserFlashBrowseUrl : 'lib/ckfinder/ckfinder.html?type=Flash',
//                        filebrowserUploadUrl : 'lib/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
//                        filebrowserImageUploadUrl : 'lib/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
//                        filebrowserFlashUploadUrl : 'lib/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash'
                    };
                    options = angular.extend(options, scope[attrs.ckeditor]);

                    var instance = (isTextarea) ? CKEDITOR.replace(element[0], options) : CKEDITOR.inline(element[0], options),
                        configLoaderDef = $q.defer();

                    element.bind('$destroy', function () {
                        instance.destroy(
                            false //If the instance is replacing a DOM element, this parameter indicates whether or not to update the element with the instance contents.
                        );
                    });

                    /*
                     * Sung-hwan Kim (2014-11-14)
                     *
                     * 이미지를 더블클릭 이벤트를 정의한다.
                     * 파일 업로드 선택 화면을 화면에 출력하고 업로드 후 화면에 이미지를 대체한다.
                     **/
                    var dbClick = function(a, b) {
//                        if (a.data.element.getAttribute("id") == "img") {
//                        }
//
//                        var data = instance.getData();
//                        data = data.replace('thumbnail', 'medium');
////                        ngModel.$setViewValue(data);
//                        instance.setData(data);
                    }
                    var setModelData = function(setPristine) {
                        var data = instance.getData();

                        if (data == '') {
                            data = null;
                        }
                        $timeout(function () { // for key up event
                            (setPristine !== true || data != ngModel.$viewValue) && ngModel.$setViewValue(data);
                            (setPristine === true && form) && form.$setPristine();
                        }, 0);
                    }, onUpdateModelData = function(setPristine) {
                        if (!data.length) { return; }

                        var item = data.pop() || EMPTY_HTML;
                        isReady = false;
                        instance.setData(item, function () {
                            setModelData(setPristine);
                            isReady = true;
                        });

                        instance.setReadOnly( scope.isReadOnly === true );

//                        CKFinder.setupCKEditor( instance, '../lib/ckfinder/' );
                    }
                    //instance.on('pasteState',   setModelData);
                    instance.on('change',       setModelData);
                    instance.on('blur',         setModelData);
                    //instance.on('key',          setModelData); // for source view

                    /*
                     * Sung-hwan Kim (2014-11-14)
                     *
                     * 이미지를 더블클릭 할경우 이변트를 지정한다.
                     **/
                    instance.on('doubleclick',        dbClick);

                    instance.on('instanceReady', function() {
//                        console.log( instance.filter.allowedContent );
                        scope.$broadcast("ckeditor.ready");
                        scope.$apply(function() {
                            onUpdateModelData(true);
                        });

                        instance.document.on("keyup", setModelData);
                    });
                    instance.on('customConfigLoaded', function() {
                        configLoaderDef.resolve();
                    });

                    ngModel.$render = function() {
                        data.push(ngModel.$viewValue);
                        if (isReady) {
                            onUpdateModelData();
                        }
                    };
                };

                if (CKEDITOR.status == 'loaded') {
                    loaded = true;
                }
                if (loaded) {
                    onLoad();
                } else {
                    $defer.promise.then(onLoad);
                }
            }
        };
    }]);
});
