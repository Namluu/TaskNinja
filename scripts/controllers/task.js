'use strict';

app.controller('TaskController', function($scope, FURL, $firebase, $location, $routeParams, toaster) {

	var ref = new Firebase(FURL);
	var fbTasks = $firebase(ref.child('tasks')).$asArray();
	var taskId = $routeParams.taskId;

	/*fbTasks.$loaded().then(function(data) {
		console.log('step 1: ' + data.length);
	});
	console.log('step 2: ' + fbTasks.length);*/

	// edit post
	if (taskId) {
		$scope.selectedTask = $firebase(ref.child('tasks').child(taskId)).$asObject();
	}

	// browse post
	$scope.tasks = fbTasks;

	$scope.postTask = function(task) {
		fbTasks.$add(task);
		toaster.pop('success', 'Task is created');
		$location.path('/browse');
	}
	
	$scope.updateTask = function(task) {
		$scope.selectedTask.$save(task);
		toaster.pop('success', 'Task is updated');
		$location.path('/browse');
	}
});