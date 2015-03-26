'use strict';

app.controller('TaskController', function($scope, FURL, $firebase, $location, $routeParams) {

	var ref = new Firebase(FURL);
	var fbTasks = $firebase(ref.child('tasks')).$asArray();
	var taskId = $routeParams.taskId;

	// edit post
	if (taskId) {
		$scope.selectedTask = $firebase(ref.child('tasks').child(taskId)).$asObject();
	}

	// browse post
	$scope.tasks = fbTasks;

	$scope.postTask = function(task) {
		fbTasks.$add(task);
		$location.path('/browse');
	}
	
	$scope.updateTask = function(task) {
		$scope.selectedTask.$save(task);
		$location.path('/browse');
	}
});