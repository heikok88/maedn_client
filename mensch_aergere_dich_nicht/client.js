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
                    sendMessage(updatePlayersMSG);
                } else if (action == "timerStart") {
                    fire("onTimerStart", payload.seconds);
                    sendMessage(timerStartMSG);
                } else if (action == "timerAbort") {
                    fire("onTimerAbort");
                    sendMessage(timerAbortMSG);
                } else if (action == "matchStart") {
                    fire("onStartMatch");
                    sendMessage(matchStartMSG);
                } else if (action == "matchUpdate") {
                    fire("onMatchUpdate", payload.currentPlayerNickname, payload.board);
                    sendMessage(matchUpdateMSG);
                } else if (action == "diceRolled") {
                    fire("onDiceRolled", payload.nickname, payload.eyes);
                    sendMessage(rolledDiceMSG);
                } else if (action == "playerDone") {
                    fire("onPlayerDone", payload.nickname);
                    sendMessage(playerDoneMSG);
                } else if (action == "matchDone") {
                    fire("onMatchDone", payload.ranking);
                    sendMessage(matchDoneMSG);
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
                action: "connect"
            };

            var getMatchesMSG = {
                action: "getMatches"
            };

            var joinMSG = {
                action: "join",
                payload: {matchId: "",
                    nickname: ""}
            };

            var createMSG = {
                action: "create",
                payload: {nickname: ""}
            };

            var leaveMSG = {
                action: "leave"
            };

            var updatePlayersMSG = {
                response: "playersUpdated"
            };

            var readyMSG = {
                action: "ready"
            };

            var timerStartMSG = {
                response: "timerStarted"
            };

            var timerAbortMSG = {
                response: "timertimerAborted"
            };

            var matchUpdateMSG = {
                response: "matchUpdated"
            };

            var rollDiceMSG = {
                action: "rollDice"
            };

            var rolledDiceMSG = {
                response: "diceRolled"
            };

            var moveMSG = {
                action: "move",
                payload: {fromX: "", fromY: "", toX: "", toY: ""}
            };

            var playerDoneMSG = {
                action: "playerDone"
            };

            var matchDoneMSG = {
                response: "matchDone"
            };

            var matchStartMSG = {
                response: "matchStarted"
            };


            //  var ws = new WebSocket('ws://html5rocks.websocket.org/echo');
            var websocket = new WebSocket('ws://localhost:8181');

            function sendMessage(msg) {
                  waitForSocketConnection(websocket, function() {
                    console.log("message sent!!!");
                    websocket.send(JSON.stringify(msg));
                });
            }

            function waitForSocketConnection(socket, callback) {
                setTimeout(
                        function() {
                            if (socket.readyState === 1) {
                                console.log("Connection is made")
                                if (callback != null) {
                                    callback();
                                }
                                return;

                            } else {
                                console.log("wait for connection...")
                                waitForSocketConnection(socket, callback);
                            }

                        }, 5); // wait 5 milisecond for the connection...
            }
            websocket.onopen = function(event) {
                console.log("openWebsocket");
                websocket.send(JSON.stringify(connectMSG));
            };

            websocket.onmessage = function(event) {
                console.debug('Receive Message');
                var msg = JSON.parse(event.data);
                if (msg.action) {
                    handleAction(msg.action, msg.payload);
                    console.log("Action: " + msg.action);
                }

                if (msg.response) {
                    handleResponse(msg.response, msg.payload);
                    console.log("Response: " + msg.response);
                }
            };

            websocket.onclose = function() {
                console.debug('Close connection');
                websocket.close();
            };
            // Log errors
            websocket.onerror = function(error) {
                console.log('WebSocket Error ' + error);
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
                    sendMessage(getMatchesMSG);
                },
                join: function(id, nickname) {
                    console.log("Join Game:");
                    joinMSG.payload.matchId = id;
                    joinMSG.payload.nickname = nickname;
                    sendMessage(joinMSG);
                },
                create: function(nickname) {
                    console.log("New Player: " + nickname);
                    createMSG.payload.nickname = nickname;
                    sendMessage(createMSG);
                },
                ready: function() {
                    console.log("Ready");
                    sendMessage(readyMSG);
                },
                rollDice: function() {
                    console.log("RollDice");
                    sendMessage(rollDiceMSG);
                },
                move: function(fromX, fromY, toX, toY) {
                    console.log("Move");
                    moveMSG.payload.fromX = fromX;
                    moveMSG.payload.fromY = fromY;
                    moveMSG.payload.toX = toX;
                    moveMSG.payload.toY = toY;
                    sendMessage(moveMSG);
                },
                leave: function() {
                    console.log("Leave Game");
                    sendMessage(leaveMSG);
                }
            };
        });
