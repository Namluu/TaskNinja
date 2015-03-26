'use strict';

app.controller('NavController', function($scope, $location, Auth, toaster) {
	$scope.signedIn = Auth.signedIn;
	$scope.currentUser = Auth.user;

	$scope.logout = function() {
		Auth.logout();
		toaster.pop('success', 'Logged out successfully');
		$location.path('/');
	};
});