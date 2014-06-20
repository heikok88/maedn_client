angular.module("match", ["ngRoute", "dialogs.main", "app", "client"])

.controller("MatchCtrl", function($scope, $location, $interval, $routeParams, dialogs, AppService, ClientService) {
	$scope.matchId = $routeParams.matchId;
	$scope.players = AppService.getPlayers();
	$scope.ready = AppService.isReady();
	$scope.selectedTokenX = -1;
	$scope.selectedTokenY = -1;
	$scope.timerSeconds = -1;
	$scope.matchStarted = false;
	$scope.matchDone = false;
	$scope.currentPlayerNickname = "";
	$scope.myTurn = false;
	$scope.currentEyesNickname = "";
	$scope.currentEyes = -1;
	$scope.currentEyesMyTurn = false;
	$scope.donePlayers = [];
	var timer = null;
	
	$scope.board = [
		['R', 'R', 'X', 'X', 'P', 'P', 'B', 'X', 'X', 'B', 'B'],
		['R', 'R', 'X', 'X', 'P', 'B', 'P', 'X', 'X', 'B', 'B'],
		['X', 'X', 'X', 'X', 'P', 'B', 'P', 'X', 'X', 'X', 'X'],
		['X', 'X', 'X', 'X', 'P', 'B', 'P', 'X', 'X', 'X', 'X'],
		['R', 'P', 'P', 'P', 'P', 'B', 'P', 'P', 'P', 'P', 'P'],
		['P', 'R', 'R', 'R', 'R', 'X', 'G', 'G', 'G', 'G', 'P'],
		['P', 'P', 'P', 'P', 'P', 'Y', 'P', 'P', 'P', 'P', 'G'],
		['X', 'X', 'X', 'X', 'P', 'Y', 'P', 'X', 'X', 'X', 'X'],
		['X', 'X', 'X', 'X', 'P', 'Y', 'P', 'X', 'X', 'X', 'X'],
		['Y', 'Y', 'X', 'X', 'P', 'Y', 'P', 'X', 'X', 'G', 'G'],
		['Y', 'Y', 'X', 'X', 'Y', 'P', 'P', 'X', 'X', 'G', 'G']
	];
	
	$scope.tokens = [];
	
	var resetTokens = function() {
		$scope.selectedTokenX = -1;
		$scope.selectedTokenY = -1;
		$scope.tokens = new Array(11);
		for (var i = 0; i < 11; ++i) {
			$scope.tokens[i] = new Array(11);
			for (var j = 0; j < 11; ++j) {
				$scope.tokens[i][j] = null;
			}
		}
	};
	resetTokens();
	
	if ($scope.players.length == 0) {
		//error! no players defined. it seems we started the application
		//without selecting a match
		$location.path("/");
		return;
	}
	
	console.debug("Joined match #" + $scope.matchId);
	
	var getColor = function(nick) {
		for (var i in $scope.players) {
			var p = $scope.players[i];
			if (p.nickname == nick) {
				return p.color;
			}
		}
		return null;
	};
	
	var listener = {
		onLeft: function() {
			console.debug("Left match");
			$location.path("/");
		},
		
		onUpdatePlayers: function(matchId, players) {
			if (matchId != $scope.matchId) {
				return;
			}
			AppService.setPlayers(players);
			$scope.players = AppService.getPlayers();
			$scope.ready = AppService.isReady();
			$scope.$apply();
		},
		
		onTimerStart: function(seconds) {
			$scope.timerSeconds = seconds;
			$scope.$apply();
			timer = $interval(function() {
				if ($scope.timerSeconds >= 0) {
					$scope.timerSeconds--;
				} else {
					$interval.cancel(timer);
					timer = null;
				}
			}, 1000);
		},
		
		onTimerAbort: function() {
			if (timer != null) {
				$interval.cancel(timer);
				timer = null;
				$scope.timerSeconds = -1;
				$scope.$apply();
			}
		},
		
		onStartMatch: function() {
			$scope.matchStarted = true;
			$scope.$apply();
		},
		
		onMatchUpdate: function(cpn, board) {
			$scope.currentPlayerNickname = cpn;
			$scope.myTurn = (cpn == AppService.getNickname());
			resetTokens();
			for (var i in board) {
				var t = board[i];
				var tn = t.nickname;
				var tx = t.x;
				var ty = t.y;
				$scope.tokens[tx][ty] = getColor(tn);
			}
			$scope.$apply();
		},
		
		onDiceRolled: function(nick, eyes) {
			$scope.currentEyesNickname = nick;
			$scope.currentEyesMyTurn = (nick == AppService.getNickname());
			$scope.currentEyes = eyes;
			$scope.$apply();
		},
		
		onPlayerDone: function(nick) {
			$scope.donePlayers.push({nickname: nick, color: getColor(nick)});
			$scope.$apply();
		},
		
		onMatchDone: function(ranking) {
			$scope.matchDone = true;
			$scope.donePlayers = [];
			for (var i in ranking) {
				var p = ranking[i];
				$scope.donePlayers.push({nickname: p, color: getColor(p)});
			}
			$scope.$apply();
		}
	};
	
	ClientService.addListener(listener);
	
	$scope.$on("$destroy", function() {
		ClientService.removeListener(listener);
	});
	
	$scope.makeReady = function() {
		ClientService.ready();
	};
	
	$scope.rollDice = function() {
		ClientService.rollDice();
	};
	
	$scope.leave = function() {
		var dlg = dialogs.confirm("Spiel verlassen", "Möchten Sie das Spiel wirklich verlassen?");
		dlg.result.then(function() {
			ClientService.leave();
		});
	};
	
	$scope.clickPlace = function(x, y) {
		var nc = $scope.tokens[x][y];
		if ($scope.selectedTokenX >= 0 && $scope.selectedTokenY >= 0) {
			if (x == $scope.selectedTokenX && y == $scope.selectedTokenY) {
				//same place. unselect.
				$scope.selectedTokenX = -1;
				$scope.selectedTokenY = -1;
				return;
			}
			
			var c = $scope.tokens[$scope.selectedTokenX][$scope.selectedTokenY];
			if (c == nc) {
				//player selected another one of his tokens
				$scope.selectedTokenX = x;
				$scope.selectedTokenY = y;
				return;
			}
			
			ClientService.move($scope.selectedTokenX, $scope.selectedTokenY, x, y);
		} else if (nc != null && typeof nc !== 'undefined') {
			$scope.selectedTokenX = x;
			$scope.selectedTokenY = y;
		}
	};
});
