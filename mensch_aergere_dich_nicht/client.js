angular.module("client", ["dialogs.main"])

.factory("ClientService", function(dialogs) {
	console.debug("Created client service");
	
	//an array of listeners that should be called on every event
	var listeners = [];
	
	/**
	 * Calls all listeners. The following events and parameters are defined:
	 * 
	 * +-----------------+-----------------------+-----------------------+
	 * | Event           | param1                | param2                |
	 * +-----------------+-----------------------+-----------------------+
	 * | onUpdatePlayers | matchId               | clients               |
	 * | onTimerStart    | seconds               |                       |
	 * | onTimerAbort    |                       |                       |
	 * | onStartMatch    |                       |                       |
	 * | onMatchUpdate   | currentPlayerNickname | board                 |
	 * | onDiceRolled    | nickname              | eyes                  |
	 * | onPlayerDone    | nickname              |                       |
	 * | onMatchDone     | ranking               |                       |
	 * | onMatches       | matches               |                       |
	 * | onJoined        | matchId               | clients               |
	 * | onLeft          |                       |                       |
	 * +-----------------+-----------------------+-----------------------+
	 * 
	 * The parameters have the same format as the message payloads described
	 * in the specification. Simply forward each payload sent by the server.
	 * 
	 * @param cb the event
	 * @param param1 the first event parameter (optional)
	 * @param param1 the second event parameter (optional)
	 */
	var fire = function(cb, param1, param2) {
		for (var i in listeners) {
			var l = listeners[i];
			if (l[cb] != null) {
				l[cb](param1, param2);
			}
		}
	};
	
	/**
	 * Call this function in your WebSocket.onmessage() handler to handle actions sent by the server
	 * @param action the action identifier (e.g. updatePlayers, timerStart, diceRolled)
	 * @param payload the action's payload
	 */
	var handleAction = function(action, payload) {
		if (action == "updatePlayers") {
			//TODO notify listeners and send response
			//TODO for example, call 'fire("onUpdatePlayers", payload.matchId, payload.clients)'
			//TODO then send response back to server
		} else if (action == "timerStart") {
			//TODO notify listeners and send response
		} else if (action == "timerAbort") {
			//TODO notify listeners and send response
		} else if (action == "startMatch") {
			//TODO notify listeners and send response
		} else if (action == "matchUpdate") {
			//TODO notify listeners and send response
		} else if (action == "diceRolled") {
			//TODO notify listeners and send response
		} else if (action == "playerDone") {
			//TODO notify listeners and send response
		} else if (action == "matchDone") {
			//TODO notify listeners and send response
		} else {
			console.error("Unknown action: " + action);
		}
	};
	
	/**
	 * Call this function in your WebSocket.onmessage() handler to handle responses from the server
	 * @param response the response identifier (e.g. connected, matches, joined)
	 * @param payload the response's payload
	 */
	var handleResponse = function(response, payload) {
		if (response == "connected") {
			//TODO can be ignored?
		} else if (response == "matches") {
			//TODO call all listeners
		} else if (response == "joined") {
			//TODO call all listeners
		} else if (response == "left") {
			//TODO call all listeners
		} else if (response == "updatePlayers") {
			//TODO call all listeners
		} else if (response == "matchUpdate") {
			//TODO call all listeners
		} else if (response == "diceRolled") {
			//TODO call all listeners
		} else if (response == "error") {
			dialogs.error("Fehler", payload.message);
		} else {
			console.error("Unknown response: " + response);
		}
	};
	
	//TODO establish connection to server
	//TODO var ws = new WebSocket("....");
	//TODO ...
	//TODO register ws.onopen and ws.onmessage handlers
	//TODO call handleAction(...) or handleResponse(...) when a message has been received
	
	
	
		
	//return ClientService instance
	return {
		
		/**
		 * DO NOT CHANGE!!
		 */
		addListener: function(listener) {
			listeners.push(listener);
		},
		
		/**
		 * DO NOT CHANGE!!
		 */
		removeListener: function(listener) {
			var i = listeners.indexOf(listener);
			if (i >= 0) {
				listeners.splice(i, 1);
			}
		},
		
		getMatches: function() {
			//TODO asynchronously send request to server
		},
		
		join: function(id, nickname) {
			//TODO asynchronously send request to server
		},
		
		create: function(nickname) {
			//TODO asynchronously send request to server
		},
		
		ready: function() {
			//TODO asynchronously send request to server
		},
		
		rollDice: function() {
			//TODO asynchronously send request to server
		},
		
		move: function(fromX, fromY, toX, toY) {
			//TODO asynchronously send request to server
		},
		
		leave: function() {
			//TODO asynchronously send request to server
		}
		
	};
});
