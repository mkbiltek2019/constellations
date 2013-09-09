/*jslint indent: 2 */
/*globals angular: false */
'use strict';

var PER_PAGE = 100;

angular.module('constellationsApp.services', ['ngResource'])
  .factory('Constellation', ['GitHub', function (GitHub) {
    var getStarred;

    getStarred = function (starred) {
      if (starred.length < PER_PAGE) {
        // Must be last page
        console.log("NUF");
      } else {
        console.log("MOAR");
      }
    };

    return {
      getAllStarred: function (username, successCallback, errorCallback) {
        var allStarred = [],
          page = 1, // GitHub API paging is 1-based.
          success,
          error;

        error = function (data) {
          console.error(username + ": Problem with starred");
          errorCallback(data);
        };

        success = function (starred) {
          console.log(username + ": Got starred page " + page);
          allStarred = allStarred.concat(starred);
          if (starred.length === PER_PAGE) {
            page += 1;
            console.log(username + ": Getting starred page " + page);
            GitHub.starred.get({username: username, page: page}, success, error);
          } else {
            console.log(username + "Got all starred");
            successCallback(allStarred);
          }
        };

        // Start getting starred.
        GitHub.starred.get({username: username, page: page}, success, error);
      }
    };
  }])
  .factory('GitHub', function ($resource) {
    return {
      user: $resource('https://api.github.com/users/:username'),
      following: $resource('https://api.github.com/users/:username/following',
        {per_page: PER_PAGE}, { 'get': { method: 'GET', isArray: true } }),
      starred: $resource('https://api.github.com/users/:username/starred',
        {per_page: PER_PAGE}, { 'get': { method: 'GET', isArray: true } })
    };
  });
