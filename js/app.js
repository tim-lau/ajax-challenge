"use strict";

var responseUrl = 'https://api.parse.com/1/classes/responses';

angular.module('ResponseApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ZqCzpwBC7JrhOrjXYimDe8Xq7Ict6zQo8aNC9KaO';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'hhE8faMyCnmhop21OjJdhJ2V9Zfx3s8YU7xUzNY9';
    })

    .controller('ResponseController', function($scope, $http) {
        $scope.newComment = {
            score: 0,
        };

        // Submits a new comment to Parse
        $scope.addComment = function () {
            $scope.loading = true;
            $http.post(responseUrl, $scope.newComment)
                .success(function (responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.responses.push($scope.newComment);
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function() {
                    $scope.newComment = {
                        score: 0,
                    };
                    $scope.loading = false;
                    $scope.updateComments();
                });
        };

        // Updates comment list via Parse
        $scope.updateComments = function () {
            $scope.loading = true;
            $http.get(responseUrl + "?order=-score")
                .success(function (data) {
                    $scope.comments = data.results;
                })
                .error(function (err) {
                    $scope.errorMessage = err;
                    console.log(err);
                })
                .finally(function () {
                	$scope.form.$setPristine();
                    $scope.loading = false;
                });
        };

        $scope.updateComments();

        // Removes comment from comment list via Parse
        $scope.removeComment = function(comment) {
            $http.delete(responseUrl + '/' + comment.objectId, comment)
                .finally(function() {
                    $scope.updateComments();
                });
        };

    });
