angular.module("matches", ["app", "client", "nickname", "ui.bootstrap", "dialogs.main"])

.controller("MatchesCtrl", function($scope, $location, AppService, ClientService, dialogs) {
	$scope.matches = [];
	$scope.loading = true;
	
	ClientService.getMatches();
	
	var listener = {
		onMatches: function(matches) {
			$scope.matches = matches;
			$scope.loading = false;
			$scope.$apply();
		},
		
		onJoined: function(matchId, players) {
			AppService.resetMatch();
			AppService.setPlayers(players);
			$location.path("/match/" + matchId);
		}
	};
	
	ClientService.addListener(listener);
	
	$scope.$on("$destroy", function() {
		ClientService.removeListener(listener);
	});
	
	$scope.join = function(id) {
		var dlg = dialogs.create('/nickname.html', 'NicknameDialogCtrl', {
			nickname: AppService.getNickname()
		});
		dlg.result.then(function(nickname) {
			if (nickname == null || nickname == "") {
				return;
			}
			
			AppService.setNickname(nickname);
			
			if (id < 0) {
				ClientService.create(nickname);
			} else {
				ClientService.join(id, nickname);
			}
		});
	};
	
	$scope.create = function() {
		$scope.join(-1);
	};
});
