angular.module("nickname", ["dialogs.main"])

.controller('NicknameDialogCtrl', function($scope, $modalInstance, data) {
	$scope.player = {
		nickname: data.nickname
	};

	$scope.cancel = function(){
		$modalInstance.dismiss();
	};

	$scope.save = function(){
		$modalInstance.close($scope.player.nickname);
	};

	$scope.hitEnter = function(evt){
		if (angular.equals(evt.keyCode, 13) && !angular.equals($scope.player.nickname, null) &&
				!angular.equals($scope.player.nickname, '') &&
				!(typeof $scope.player.nickname === 'undefined')) {
			$scope.save();
		}
	};
});
