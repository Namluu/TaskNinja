'use strict';

app.controller('TaskController', function($scope, FURL, $firebase, $location, $routeParams, toaster, FileUploader) {

	var ref = new Firebase(FURL);
	var fbTasks = $firebase(ref.child('tasks')).$asArray();
	var taskId = $routeParams.taskId;

	var uploader = $scope.uploader = new FileUploader({
        url: 'upload.php'
    });
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 1;
        }
    });
    uploader.onSuccessItem = function(fileItem) {
        $scope.imgThumb = fileItem.file.name;
        //console.info('onAfterAddingFile', fileItem);
    };

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

		if (uploader.queue.length)
			task.image = uploader.queue[0].file.name;

		fbTasks.$add(task);
		toaster.pop('success', 'Task is created');
		$location.path('/browse');
	}
	
	$scope.updateTask = function(task) {

		if (uploader.queue.length && uploader.queue[0].file.name != $scope.selectedTask.image)
			task.image = uploader.queue[0].file.name;

		$scope.selectedTask.$save(task);
		toaster.pop('success', 'Task is updated');
		$location.path('/browse');
	}
});