'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment) {

	$scope.searchTask = '';		
	$scope.tasks = Task.all;
	$scope.signedIn = Auth.signedIn;
	$scope.listMode = true;
	$scope.user = Auth.user;
	
	if($routeParams.taskId) {
		var task = Task.getTask($routeParams.taskId).$asObject();
		/*task.$loaded().then(function (data) {
			console.log(Object.keys(data));
			console.log(data.name);
		});*/
		$scope.listMode = false;
		setSelectedTask(task);
	}

	function setSelectedTask(task) {
		$scope.selectedTask = task;
		
		// We check isTaskCreator only if user signedIn 
		// so we don't have to check every time normal guests open the task
		if($scope.signedIn()) {
			// Check if the current login user is the creator of selected task
			task.$loaded().then(function (data) {
				$scope.isTaskCreator = Task.isCreator(data);
				$scope.isOpen = Task.isOpen(data);
			});
		}

		$scope.comments = Comment.comments(task.$id);
	};

	// --------------- TASK ---------------	

	$scope.cancelTask = function(taskId) {
		Task.cancelTask(taskId).then(function() {
			toaster.pop('success', "This task is cancelled successfully.");
		});
	};

	$scope.addComment = function() {
		var comment = {
			content: $scope.content,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar
		};
		Comment.addComment($scope.selectedTask.$id, comment).then(function() {
			$scope.content = '';
		});
	}
});