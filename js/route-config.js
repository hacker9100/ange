//requireJS 모듈 선언
define([
		//디펜던시가 걸려있으므로, 아래의 디펜던시가 먼저 로드된 뒤에 아래 콜백이 수행된다.
		'registers/lazy-directives',
		'registers/lazy-services', 
		'registers/lazy-filters'
	],

	//디펜던시 로드뒤 콜백함수
	function (lazyDirectives, lazyServices, lazyFilters) {

		
		var $controllerProvider; //컨트롤러 프로바이더를 받을 변수

		//컨트롤러 프로바이더 설정 함수
		function setControllerProvider(value) {
			$controllerProvider = value;
		}

		//컴파일 프로바이더 설정 함수
		function setCompileProvider(value) {
			lazyDirectives.setCompileProvider(value);
		}

		//프로바이드 설정 함수
		function setProvide(value) {
			lazyServices.setProvide(value);
		}

		//필터 프로바이더 설정 함수
		function setFilterProvider(value) {
			lazyFilters.setFilterProvider(value);
		}
		
		
/*
		현재 시점에서 services는 오직 value 값을 정할때만 사용할 수 있다.
		Services는 반드시 factory를 사용해야 한다.
		
		$provide.value('a', 123);
		$provide.factory('a', function() { return 123; });
		$compileProvider.directive('directiveName', ...);
		$filterProvider.register('filterName', ...);
*/		
		function config(templatePath, controllerPath, lazyResources) {
		
			//컨트롤러 프로바이더가 존재하지 않으면 오류!
			if (!$controllerProvider) {
				throw new Error("$controllerProvider is not set!");
			}

			//변수 선언
			var defer,
				html,
				routeDefinition = {};

			//경로 템플릿 설정
			routeDefinition.template = function () {
				return html;
			};
			
			//경로 컨트롤러 설정
			routeDefinition.controller = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);
			
			//경로 
			routeDefinition.resolve = {
			
				delay: function ($q, $rootScope) {
				
					//defer 가져오기
					defer = $q.defer();
					
					//html에 아무런 값이 없는 경우
					if (!html) {
					
						//템플릿 및 컨트롤러 디펜던시 설정
						var dependencies = ["text!" + templatePath, controllerPath];
						
						//리소스들 추가
						if (lazyResources) {
							dependencies = dependencies.concat(lazyResources.directives);
							dependencies = dependencies.concat(lazyResources.services);
							dependencies = dependencies.concat(lazyResources.filters);
						}
						
						//디펜던시들 가져오기
						require(dependencies, function () {

							//인디케이터
							var indicator = 0;
					
							//템플릿
							var template = arguments[indicator++];
							
							//컨트롤러
							if( angular.isDefined( controllerPath ) ) {
								$controllerProvider.register(controllerPath.substring(controllerPath.lastIndexOf("/") + 1), arguments[indicator]);
								indicator++;
							}
							
							if( angular.isDefined( lazyResources ) ) {
								
								//다이렉티브
								if( angular.isDefined(lazyResources.directives) ) {
									for(var i=0; i<lazyResources.directives.length; i++) {
										lazyDirectives.register(arguments[indicator]);
										indicator++;
									}
								}
								
								//서비스(value)
								if( angular.isDefined(lazyResources.services) ) {
									for(var i=0; i<lazyResources.services.length; i++) {
										lazyServices.register(arguments[indicator]);
										indicator++;
									}
								}
								
								//필터
								if( angular.isDefined(lazyResources.filters) ) {
									for(var i=0; i<lazyResources.filters.length; i++) {
										lazyFilters.register(arguments[indicator]);
										indicator++;
									}
								}
							}
							
							//딜레이 걸어놓기
							html = template;
							defer.resolve();
							$rootScope.$apply();
						})
					}
					
					else {
						defer.resolve();
					}
					
					return defer.promise;
				}
			}

			return routeDefinition;
		}

		return {
			setControllerProvider: setControllerProvider,
			setCompileProvider: setCompileProvider,
			setProvide: setProvide,
			setFilterProvider: setFilterProvider,
			config: config
		};
	}
);

/**
 * Directly from fnakstad
 * https://github.com/fnakstad/angular-client-side-auth/blob/master/client/js/routingConfig.js
 */

(function (exports) {

    var config = {

        /* List all the roles you wish to use in the app
         * You have a max of 31 before the bit shift pushes the accompanying integer out of
         * the memory footprint for an integer
         */
        roles: [
            'public',
            'user',
            'admin'
        ],

        /*
         Build out all the access levels you want referencing the roles listed above
         You can use the "*" symbol to represent access to all roles
         */
        accessLevels: {
            'public' : '*',
            'anon': ['public'],
            'user' : ['user', 'admin'],
            'admin': ['admin']
        }

    };

    /*
     Method to build a distinct bit mask for each role
     It starts off with "1" and shifts the bit to the left for each element in the
     roles array parameter
     */
    function buildRoles(roles) {

        var bitMask = "01";
        var userRoles = {};

        for (var role in roles) {
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = {
                bitMask: intCode,
                title: roles[role]
            };
            bitMask = (intCode << 1).toString(2);
        }

        return userRoles;
    }

    /*
     This method builds access level bit masks based on the accessLevelDeclaration parameter which must
     contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles) {

        var accessLevels = {},
            resultBitMask,
            role;
        for (var level in accessLevelDeclarations) {

            if (typeof accessLevelDeclarations[level] === 'string') {
                if (accessLevelDeclarations[level] === '*') {

                    resultBitMask = '';

                    for (role in userRoles) {
                        resultBitMask += "1";
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMask, 2),
                        title: accessLevelDeclarations[level]
                    };
                }
                else {
                    console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'");
                }
            }
            else {

                resultBitMask = 0;
                for (role in accessLevelDeclarations[level]) {
                    if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role])) {
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask;
                    }
                    else {
                        console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'");
                    }
                }
                accessLevels[level] = {
                    bitMask: resultBitMask,
                    title: accessLevelDeclarations[level][role]
                };
            }
        }

        return accessLevels;
    }

    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

})(typeof exports === 'undefined' ? this : exports);

