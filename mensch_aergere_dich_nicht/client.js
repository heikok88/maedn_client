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
                    fire("onUpdatePlayers", payload.matchId, payload.clients);
                    sendResponse(updatePlayersMSG);
                } else if (action == "timerStart") {
                    fire("onTimerStart", payload.seconds);
                    sendResponse(timerStartMSG);
                } else if (action == "timerAbort") {
                    fire("onTimerAbort");
                    sendResponse(timerAbortMSG);
                } else if (action == "startMatch") {
                    fire("onStartMatch");
                    sendResponse(matchStartMSG);
                } else if (action == "matchUpdate") {
                    fire("onMatchUpdate", payload.currentPlayerNickname, payload.board);
                    sendResponse(matchUpdateMSG);
                } else if (action == "diceRolled") {
                    fire("onDiceRolled", payload.nickname, payload.eyes);
                    sendResponse(rolledDiceMSG);
                } else if (action == "playerDone") {
                    fire("onPlayerDone", payload.nickname);
                    sendResponse(playerDoneMSG);
                } else if (action == "matchDone") {
                    fire("onMatchDone", payload.ranking);
                    sendResponse(matchDoneMSG);
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
                    console.log("New Player connecterd successful");
                    //TODO can be ignored?
                } else if (response == "matches") {
                    //TODO call all listeners
                    fire("onMatches", payload.matches);
                } else if (response == "joined") {
                    //TODO call all listeners
                    fire("onJoined", payload.matchId, payload.clients);
                } else if (response == "left") {
                    //TODO call all listeners
                    fire("onLeft");
                } else if (response == "updatePlayers") {
                    //TODO call all listeners
                    fire("onUpdatePlayers", payload.matchId, payload.clients);
                } else if (response == "matchUpdate") {
                    //TODO call all listeners
                    fire("onMatchUpdate", payload.currentPlayerNickname, payload.board);
                } else if (response == "diceRolled") {
                    //TODO call all listeners
                    fire("onDiceRolled", payload.nickname, payload.eyes);
                } else if (response == "error") {
                    dialogs.error("Fehler", payload.message);
                } else {
                    console.error("Unknown response: " + response);
                }
            };
            var connectMSG = {
                type: "action",
                text: "connect",
                payload: ""
            };
            var getMatchesMSG = {
                type: "action",
                text: "getMatches",
                payload: ""
            };

            var joinMSG = {
                type: "action",
                text: "join",
                payload: [{matchId: "",
                        nickname: ""}]
            };

            var createMSG = {
                type: "action",
                text: "create",
                payload: [{nickname: ""}]
            };

            var leaveMSG = {
                type: "action",
                text: "leave",
                payload: ""
            };

            var updatePlayersMSG = {
                type: "response",
                text: "playersUpdated",
                payload: ""
            };

            var readyMSG = {
                type: "action",
                text: "ready",
                payload: ""
            };

            var timerStartMSG = {
                type: "response",
                text: "timerStarted",
                payload: ""
            };

            var timerAbortMSG = {
                type: "response",
                text: "timertimerAborted",
                payload: ""
            };

            var matchUpdateMSG = {
                type: "response",
                text: "matchUpdated",
                payload: ""
            };

            var rollDiceMSG = {
                type: "action",
                text: "rollDice",
                payload: ""
            };

            var rolledDiceMSG = {
                type: "response",
                text: "diceRolled",
                payload: ""
            };

            var moveMSG = {
                type: "action",
                text: "move",
                payload: [{fromX: "", fromY: "", toX: "", toY: ""}]
            };

            var playerDoneMSG = {
                type: "action",
                text: "playerDone",
                payload: ""
            };

            var matchDoneMSG = {
                type: "response",
                text: "matchDone",
                payload: ""
            };

            var matchStartMSG = {
                type: "response",
                text: "matchStarted",
                payload: ""
            };


          //  var ws = new WebSocket('ws://html5rocks.websocket.org/echo');
             var ws = new WebSocket('ws://localhost:8181');

            ws.onopen = function() {
                console.debug('Connection opened');
                ws.send(JSON.stringify(connectMSG));
            };
            ws.onmessage = function(event) {
                console.debug('Receive Message');
                var msg = JSON.parse(event.data);
                switch (msg.type) {
                    case "action":
                        handleAction(msg.text, msg.payload);
                        console.log("Action: " + msg.text);
                        break;
                    case "response":
                        handleResponse(msg.text, msg.payload);
                        console.log("Response: " + msg.text);
                        break;
                }
            };
            ws.onclose = function() {
                console.debug('Close connection');
                ws.close();
            };
            // Log errors
            ws.onerror = function(error) {
                console.log('WebSocket Error ' + error);
            };

            var sendRequest = function(MSG) {
                if (ws.readyState == 1)
                    ws.send(JSON.stringify(MSG));
                else {
                    ws.onopen = function(e) {
                        ws.send(JSON.stringify(MSG));
                    }
                }
            };

            var sendResponse = function(MSG) {
                if (ws.readyState == 1)
                    ws.send(JSON.stringify(MSG));
                else {
                    ws.onopen = function(e) {
                        ws.send(JSON.stringify(MSG));
                    }
                }
            };
            //return ClientService instance
            return {
                /**
                 * DO NOT CHANGE!!
                 */
                addListener: function(listener) {
                    console.log("Add Listener");
                    listeners.push(listener);
                },
                /**
                 * DO NOT CHANGE!!
                 */
                removeListener: function(listener) {
                    console.log("Remove Listener");
                    var i = listeners.indexOf(listener);
                    if (i >= 0) {
                        listeners.splice(i, 1);
                    }
                },
                getMatches: function() {
                    console.log("getMatches");
                    sendRequest(getMatchesMSG);
                },
                join: function(id, nickname) {
                    console.log("Join Game:")
                    joinMSG.payload[0].matchId = id;
                    joinMSG.payload[0].nickname = nickname;
                    sendRequest(joinMSG);
                },
                create: function(nickname) {
                    console.log("New Player: " + nickname);
                    createMSG.payload[0].nickname = nickname;
                    sendRequest(createMSG);
                },
                ready: function() {
                    console.log("Ready");
                    sendRequest(readyMSG);
                },
                rollDice: function() {
                    console.log("RollDice");
                    sendRequest(rollDiceMSG);
                },
                move: function(fromX, fromY, toX, toY) {
                    console.log("Move");
                    moveMSG.payload[0].fromX = fromX;
                    moveMSG.payload[0].fromY = fromY;
                    moveMSG.payload[0].toX = toX;
                    moveMSG.payload[0].toY = toY;
                    sendRequest(moveMSG);
                },
                leave: function() {
                    console.log("Leave Game");
                    sendRequest(leaveMSG);
                }
            };
        });
