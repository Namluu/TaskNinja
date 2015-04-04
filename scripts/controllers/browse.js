'use strict';

app.controller('BrowseController', function($scope, $routeParams, toaster, Task, Auth, Comment, Offer) {

	$scope.searchTask = '';		
	$scope.tasks = Task.all;
	$scope.signedIn = Auth.signedIn;
	$scope.listMode = true;
	$scope.user = Auth.user;
	
	if($routeParams.taskId) {
		var task = Task.getTask($routeParams.taskId).$asObject();
		$scope.listMode = false;
		setSelectedTask(task);
	}

	function setSelectedTask(task) {
		$scope.selectedTask = task;
		// We check isTaskCreator only if user signedIn 
		// so we don't have to check every time normal guests open the task
		if($scope.signedIn()) {
			// Check if the current login user is the creator of selected task
			$scope.isTaskCreator = Task.isCreator;
			$scope.isOpen = Task.isOpen;

			Offer.isOfferred(task.$id).then(function(data) {
				$scope.alreadyOffered = data;
			});

			// Unblock the Offer button on Offer modal
			$scope.block = false;

			// Check if the current login user is offer maker (to display Cancel Offer button)
			$scope.isOfferMaker = Offer.isMaker;

			$scope.isAssignee = Task.isAssignee;
			$scope.isCompleted = Task.isCompleted;
		}

		$scope.comments = Comment.comments(task.$id);
		$scope.offers = Offer.offers(task.$id);
	};

	// --------------- TASK ---------------	

	$scope.cancelTask = function(taskId) {
		Task.cancelTask(taskId).then(function() {
			toaster.pop('success', "This task is cancelled successfully.");
		});
	};

	// --------------- COMMENT ---------------

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

	// --------------- OFFER ---------------

	$scope.makeOffer = function() {
		var offer = {
			total: $scope.total,
			uid: $scope.user.uid,
			name: $scope.user.profile.name,
			gravatar: $scope.user.profile.gravatar 
		};

		Offer.makeOffer($scope.selectedTask.$id, offer).then(function() {
			toaster.pop('success', "Your offer has been placed.");
			
			// Mark that the current user has offerred for this task.
			$scope.alreadyOffered = true;
			
			// Reset offer form
			$scope.total = '';

			// Disable the "Offer Now" button on the modal
			$scope.block = true;
		});		
	};
	
	$scope.cancelOffer = function(offerId) {
		Offer.cancelOffer($scope.selectedTask.$id, offerId).then(function() {
			toaster.pop('success', "Your offer has been cancelled.");

			// Mark that the current user has cancelled offer for this task.
			$scope.alreadyOffered = false;

			// Unblock the Offer button on Offer modal
			$scope.block = false;
		});
	};

	$scope.acceptOffer = function(offerId, runnerId) {
		Offer.acceptOffer($scope.selectedTask.$id, offerId, runnerId).then(function() {
			toaster.pop('success', "Offer is accepted");
		});
	};

	$scope.completeTask = function(taskId) {
		Task.completeTask(taskId).then(function() {
			toaster.pop('success', "You have completed this task");
		});
	};

});