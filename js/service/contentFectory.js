/**
 * Author : Sung-hwan Kim
 * Email  : hacker9100@marveltree.com
 * Date   : 2014-09-23
 * Description : service factory 선언
 */
define(['./services'], function (services) {
    'use strict';

    services.factory('contentsFactory', ['$resource', '$location', function($resource, $location) {
        return $resource('services/api.php', { category: $location.path() }, {
//        return $resource('../../ange/ange/cms/cms.php', {_method : 'list'}, {
            query: { method: 'GET', isArray: true },
            create: { method: 'POST' },
            delete: { method: 'DELETE', params: {id: '@id'} }
        })
    }]);

    services.factory('contentFactory', ['$resource', '$location', function ($resource, $location) {
        return $resource('services/api.php', { category: $location.path(), id: '@id' }, {
//        return $resource('services/api.php/:id', {}, {
            show: { method: 'GET' },
            update: { method: 'PUT' },
            delete: { method: 'DELETE' }
        })
    }]);
});
