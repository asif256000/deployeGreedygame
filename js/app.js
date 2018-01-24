(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("web/static/js/app.js", function(exports, require, module) {
"use strict";

require("./app_module");

require("./controllers/main_controller");

require("./services/mainService.js");
});

;require.register("web/static/js/app_module.js", function(exports, require, module) {
'use strict';

angular.module("GreedyGame", ['ui.router', 'satellizer']).run(['$rootScope', '$state', '$stateParams', '$timeout', '$window', function ($rootScope, $state, $stateParams, $timeout, $window) {}]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $urlRouterProvider.otherwise("/");
    $stateProvider.state("main", {
        url: "/",
        templateUrl: "https://d-arnab.github.io/deployeGreedygame/partials/main.html",
        controller: "mainController"
    });
});
});

;require.register("web/static/js/controllers/main_controller.js", function(exports, require, module) {
'use strict';

angular.module("GreedyGame").controller('mainController', ['$scope', '$state', '$rootScope', 'MainService', function ($scope, $state, $rootScope, MainService) {

    $scope.MainService = MainService;
    $scope.frmDate = '';
    $scope.toDate = '';
    $('.datepicker').pickadate({
        format: "yyyy,mmmm d",
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        max: true
    });
}]);
});

;require.register("web/static/js/services/mainService.js", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by arnab on 22/11/17.
 */
var MainService = function () {
    function MainService($http) {
        _classCallCheck(this, MainService);

        this.$http = $http;
        this.errorResult = '';
        this.emptyResult = false;
        this.addResult = [];
    }

    _createClass(MainService, [{
        key: 'getAdd',
        value: function getAdd(frmDate, todate) {
            var _this = this;

            if (!Date.prototype.toISODate) {
                Date.prototype.toISODate = function () {
                    return this.getFullYear() + '-' + ('0' + (this.getMonth() + 1)).slice(-2) + '-' + ('0' + this.getDate()).slice(-2);
                };
            }
            var d = new Date(frmDate);
            var t = new Date(todate);
            var isofrmDate = d.toISODate();
            var isotoDate = t.toISODate();
            console.log("frmDate,todate:", isofrmDate, isotoDate);
            this.$http({
                url: 'http://104.197.128.152/data/adrequests?from=' + isofrmDate + '&to=' + isotoDate,
                method: 'GET'
            }).then(function (response) {
                console.log("response.data:", response);
                var status = response.status.toString();
                if (status.charAt(0) === '2') {
                    console.log(response.data);
                    _this.addResult = response.data.data;
                }
                if (_this.addResult.length === 0) {
                    _this.emptyResult = true;
                }
            }, function (error) {
                var status = error.status.toString();
                if (status.charAt(0) === '4') {
                    console.log("Error:", error.statusText);
                    _this.errorResult = error.statusText;
                }
                if (status.charAt(0) === '5') {
                    console.log("Error:", error.statusText);
                    _this.errorResult = error.statusText;
                }
            });
        }
    }]);

    return MainService;
}();

MainService.$inject = ['$http'];
angular.module('GreedyGame').service('MainService', MainService);
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('web/static/js/app');
//# sourceMappingURL=app.js.map
