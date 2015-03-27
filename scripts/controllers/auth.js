'use strict';

app.controller('AuthController', function($scope, $location, Auth, toaster) {
	$scope.register = function(user) {
		Auth.register(user)
			.then(function() {
				toaster.pop('success', 'Register successfully');
				$location.path('/');
			}, function(err) {
				toaster.pop('error', err.message);
			});
	};

	$scope.login = function(user) {
		Auth.login(user)
			.then(function() {
				toaster.pop('success', 'Loggin successfully');
				$location.path('/');
			}, function(err) {
				toaster.pop('error', err.message);
			});
	};

	$scope.changePassword = function(user) {
		Auth.changePassword(user)
			.then(function() {
				$scope.user.email = '';
				$scope.user.oldPass = '';
				$scope.user.newPass = '';

				toaster.pop('success', 'Password changed successfully');
				$location.path('/');
			}, function(err) {
				toaster.pop('error', err.message);
			});
	};
});
