angular.module("client", ["dialogs.main"])

        .factory("ClientService", function(dialogs) {
            console.debug("Created client service");
            //an array of listeners that should be called on every event
            var listeners = [];
            var connect = false;

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
                action: "connect",
                payload: ""
            };
            var getMatchesMSG = {
                action: "getMatches",
                payload: ""
            };

            var joinMSG = {
                action: "join",
                payload: [{matchId: "",
                        nickname: ""}]
            };

            var createMSG = {
                action: "create",
                payload: {nickname: ""}
            };

            var leaveMSG = {
                action: "leave",
                payload: ""
            };

            var updatePlayersMSG = {
                response: "playersUpdated",
                payload: ""
            };

            var readyMSG = {
                action: "ready",
                payload: ""
            };

            var timerStartMSG = {
                response: "timerStarted",
                payload: ""
            };

            var timerAbortMSG = {
                response: "timertimerAborted",
                payload: ""
            };

            var matchUpdateMSG = {
                response: "matchUpdated",
                payload: ""
            };

            var rollDiceMSG = {
                action: "rollDice",
                payload: ""
            };

            var rolledDiceMSG = {
                response: "diceRolled",
                payload: ""
            };

            var moveMSG = {
                action: "move",
                payload: [{fromX: "", fromY: "", toX: "", toY: ""}]
            };

            var playerDoneMSG = {
                action: "playerDone",
                payload: ""
            };

            var matchDoneMSG = {
                response: "matchDone",
                payload: ""
            };

            var matchStartMSG = {
                response: "matchStarted",
                payload: ""
            };


            //  var ws = new WebSocket('ws://html5rocks.websocket.org/echo');
            var websocket = new WebSocket('ws://localhost:8181');



            websocket.onmessage = function(event) {
                console.debug('Receive Message');
                var msg = JSON.parse(event.data);
                if (msg.action) {
                    handleAction(msg.text, msg.payload);
                    console.log("Action: " + msg.text);
                }

                if (msg.response) {
                    handleResponse(msg.response, msg.payload);
                    console.log("Response: " + msg.response);
                }
            };

            /* ws.onopen = function(event) {
             console.debug('Connection opened');
             ws.send(JSON.stringify(connectMSG));
             };
             */
            websocket.onopen = function(evt) {
                console.debug('Connection opened');
                websocket.send(JSON.stringify(connectMSG));
            };

            websocket.onclose = function() {
                console.debug('Close connection');
                websocket.close();
            };
            // Log errors
            websocket.onerror = function(error) {
                console.log('WebSocket Error ' + error);
            };

            var sendRequest = function(MSG) {
                if (websocket.readyState == 1)
                    websocket.send(JSON.stringify(MSG));
                else {
                    /* ws.onopen = function(e) {
                     ws.send(JSON.stringify(MSG));
                     }*/
                }
            };

            var sendResponse = function(MSG) {
                if (ws.readyState == 1)
                    ws.send(JSON.stringify(MSG));
                else {
                    /*   ws.onopen = function(e) {
                     ws.send(JSON.stringify(MSG));
                     }*/
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
                    createMSG.payload.nickname = nickname;
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
