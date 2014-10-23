/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : requireJS를 사용할 때 최초로 호출되는 파일로 requireJS의 설정을 한다.
 */

/**
 * require 설정
 * RequireJS는 AMD API 명세를 구현한 구현체 중 하나이다. 여기에 조금 더 편리하게 사용할 수 있도록 몇 가지 기능들을 추가했다.
 * RequireJS의 자세한 사용법은 http://requirejs.org/docs/api.html#usage를 참고한다.
 */
require.config({
    // require.js가 로딩되면 이 객체를 자동으로 읽어 들여 반영한다.
    // baseUrl은 JavaScript 파일들이 존재하는 base 위치를 지정한다.
    baseUrl:'js',

    // paths는 baseUrl에서 지정한 경로에 존재하지 않는 모듈을 찾기위해서 경로를 매핑해준다.
    // 보통 맨뒤 js확장자는 별도롤 붙이지 않으며, 맨 뒤에 js를 붙이지 않아도 자동으로 js를 붙여서 찾아준다.
    // 라이브러리 경로 선언을 위해서도 사용된다.
    paths: {
        'text': '../lib/require/text', //HTML 데이터를 가져올때 text! 프리픽스를 붙여준다.
        'jquery': '../lib/jquery/jquery.min', // jquery
        'uiJquery': '../lib/jquery/jquery-ui-1.10.2.min', // bootstrap 사용을 위해 로딩한다.
        'domReady': '../lib/domReady/domReady', // requirejs로 library를 로딩할때 사용된다.

        // bootstrpa 모듈
        'jsBootstrap': '../lib/bootstrap/js/bootstrap.min', // bootstrap을 사용한다.
        'uiBootstrap': '../lib/ui-bootstrap/ui-bootstrap-0.11.2.min', // bootstrap의 ui 컴포넌트를 사용하게한다.

        // angularjs 모듈
        'angular': '../lib/angular/angular', // angularjs를 사용한다.
        'ngCookies': '../lib/angular/angular-cookies.min', //
        'ngResource': '../lib/angular/angular-resource.min', // restful방식으로 http 통신을 통한 서비스를 한다.
        'ngSanitize': '../lib/angular/angular-sanitize.min', // html 코드를 화면에서 html로 동적으로 변환 시켜준다.
        'uiRouter': '../lib/angular-ui/angular-ui-router.min', // index에서 url 라우팅을 동적으로 해준다.

//        'dropdownMultiSelect' : '../lib/dropdown_multiselect/angularjs-dropdown_multiselect.min',
        'lodash' : '../lib/dropdown_multiselect/lodash',

        // ckeditor 모듈
        'ckeditor-core': '../lib/ckeditor/ckeditor', // ckeditor
        'ckeditor-jquery': '../lib/ckeditor/adapters/jquery', // angularjs에서 ckeditor를 사용할 수 있게 해주는 어덥터다.
        'ckfinder': '../lib/ckfinder/ckfinder', // ckeditor에서 업로드를 할 수 있게 해준다.

        // plupload 모듈
        'plupload': '../lib/plupload/plupload.full.min', // plupload
//        'ngPlupload': '../lib/plupload/plupload-angular-directive.min',
        'uiPlupload': '../lib/plupload/jquery.ui.plupload/jquery.ui.plupload',
        'ngActivityIndicator': '../lib/ngActivityIndicator/ngActivityIndicator', // 로딩시 화면에 잠깐 보여주는 역할을 한다.

        // fileupload 모듈
        'uiWidget': '../lib/file-upload/vendor/jquery.ui.widget',
        'loadImage': '../lib/file-upload/load-image/load-image',
        'loadIos': '../lib/file-upload/load-image/load-image-ios',
        'loadOrientation': '../lib/file-upload/load-image/load-image-orientation',
        'loadMeta': '../lib/file-upload/load-image/load-image-meta',
        'loadExif': '../lib/file-upload/load-image/load-image-exif',
        'loadMap': '../lib/file-upload/load-image/load-image-exif-map',
        'canvasToBlob': '../lib/file-upload/gallery/canvas-to-blob.min',
        'biHelper': '../lib/file-upload/gallery/blueimp-helper',
        'biGallery': '../lib/file-upload/gallery/blueimp-gallery',
        'jqGallery': '../lib/file-upload/gallery/jquery.blueimp-gallery',
        'iframeTransport': '../lib/file-upload/jquery.iframe-transport',
        'jqFileupload': '../lib/file-upload/jquery.fileupload',
        'jqProcess': '../lib/file-upload/jquery.fileupload-process',
        'jqImage': '../lib/file-upload/jquery.fileupload-image',
        'jqAudio': '../lib/file-upload/jquery.fileupload-audio',
        'jqVideo': '../lib/file-upload/jquery.fileupload-video',
        'jqValidate': '../lib/file-upload/jquery.fileupload-validate',
        'ngFileupload': '../lib/file-upload/jquery.fileupload-angular',

        // fullcalendar 모듈
        'fullcalendar': '../lib/fullcalendar/fullcalendar',
        'ko': '../lib/fullcalendar/lang/ko',
        'uiCalendar': '../lib/fullcalendar/calendar',
        'moment': '../lib/fullcalendar/lib/moment.min',

//        'ngMock': '../lib/angular/angular-mocks',

        'library': '../lib'
    },

    // shim은 AMD를 지원하지 않는 외부 라이브러리를 모듈로 사용할 수 있게 한다.
    // AMD : JavaScript 표준 API 라이브러리 제작 그룹에는 CommonJS만 있는 것이 아니고, AMD(Asynchronous Module Definition)라는 그룹도 있다.
    // AMD 그룹은 비동기 상황에서도 JavaScript 모듈을 쓰기 위해 CommonJS에서 함께 논의하다 합의점을 이루지 못하고 독립한 그룹이다.
    shim: {
        'jquery': {
            exports: '$'
        },
        'angular': {
            deps: ['jquery'],    // 반드시 먼저 로딩해야될 모듈을 정의한다.
            exports: 'angular'   // 반환되는 변수값이다. angular는 전역변수 "angular"를 사용한다.
        },
        'uiJquery': {
            deps: ['jquery']
        },
        'jsBootstrap':{
            deps:['angular']
        },
        'uiBootstrap':{
            deps:['jquery','angular','jsBootstrap']
        },
        'ngCookies':{
            deps: ['angular']
        },
        'ngResource':{
            deps: ['angular']
        },
        'ngSanitize':{
            deps: ['angular']
        },
        'uiRouter':{
            deps: ['angular']
        },
//        'dropdownMultiSelect':{
//            deps: ['angular', 'uiBootstrap']
//        },
        'ckeditor-jquery':{
            deps:['jquery','ckeditor-core']
        },
        'plupload':{
            deps:['jquery','uiJquery'],
            exports: "plupload"
        },
//        'ngPlupload':{
//            deps:['plupload']
//        },
        'uiPlupload':{
            deps:['plupload']
        },
        'ngActivityIndicator':{
            deps:['angular']
        },
        'fullcalendar':{
            deps:['jquery','moment']
        },
        'ko':{
            deps:['jquery','moment']
        },
        'uiCalendar':{
            deps:['angular','fullcalendar']
        },
//        'loadImage':{
//            deps:['jquery']
//        },
//        'loadIos':{
//            deps:['loadImage']
//        },
//        'loadOrientation':{
//            deps:['loadImage']
//        },
//        'loadMeta':{
//            deps:['loadImage']
//        },
//        'loadExif':{
//            deps:['loadImage','loadMeta']
//        },
//        'loadMap':{
//            deps:['loadImage','loadExif']
//        },

//        'uiWidget':{
//            deps:['jquery']
//        },
//        'loadImage':{
//            deps:['jquery','uiWidget']
//        },
//        'jqFileupload':{
//            deps:['jquery']
//        },
//        'jqProcess':{
//            deps:['jquery','jqFileupload']
//        },
        'jqGallery':{
            deps:['jquery','biGallery']
        },
        'jqImage':{
            deps:['jquery','loadImage','loadMeta','loadExif','loadIos','canvasToBlob','jqProcess']
        },
        'jqAudio':{
            deps:['jquery','loadImage','jqProcess']
        },
        'jqVideo':{
            deps:['jquery','loadImage','jqProcess']
        },
        'jqIframeTransport':{
            deps:['jquery']
        },
        'jqValidate':{
            deps:['jquery','jqProcess']
        },
        'ngFileupload':{
            deps:['jquery','angular','jqGallery','jqFileupload','jqProcess','jqImage','jqAudio','jqVideo','jqValidate']
        }
//        'ngMock':{
//            deps: ['angular']
//        }
    },

    // 부트스트랩 방법1
    // bootstrap.js 파일을 로드한다.
    deps: [
        './bootstrap'
    ]
});
