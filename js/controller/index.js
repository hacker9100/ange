/**
 * Author : Han-sik Choi
 * Blog   : http://hans.or.kr
 * Date   : 2014-06-07
 * Description : 사용할 모든 controller를 로드
 */

define([
    './contentMainController',
    './contentMenuController',
    './contentListController',
    './contentDetailController',
    './managementMainController',

    '../../partials/cms/locater',

    // CMS Controller
    '../../partials/cms/upload',
    '../../partials/cms/signin',
    '../../partials/cms/dashboard',
    '../../partials/cms/project',
    '../../partials/cms/projectEdit',
    '../../partials/cms/projectView',
    '../../partials/cms/task',
    '../../partials/cms/webboard',
    '../../partials/cms/webboardEdit',
    '../../partials/cms/webboardView'
], function () {});
