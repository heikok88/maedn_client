angular.module("app", ["client"])

.factory("AppService", function(ClientService) {
	var players = [];
	var nickname = "";
	var ready = false;
	
	window.onbeforeunload = function() {
		ClientService.leave();
	};
	
	return {
		resetMatch: function() {
			players = [];
			tokens = [];
			ready = false;
		},
		
		getPlayers: function() {
			return players;
		},
		
		setPlayers: function(ps) {
			for (var i in ps) {
				var p = ps[i];
				if (p.nickname == nickname) {
					ready = p.ready;
				}
			}
			players = ps;
		},
		
		getNickname: function() {
			return nickname;
		},
		
		setNickname: function(nick) {
			nickname = nick;
		},
		
		isReady: function() {
			return ready;
		}
	};
});
