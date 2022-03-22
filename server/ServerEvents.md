# Server Events 

This document outlines the events that the server accepts and emits, as well as the event lifecycle

<br>

## Initialization Events
***
### Conncetion (recieved)

The `connection` event is recieved from the client when a clinet connects to the server. This event will emit a UUID event containing the uuid of the user connected
***

### Init (emitted)
The `init` event is emitted to the client after it has connected, the client should respond with a `getUUID` event after it has recived the `init` event.

***
### Get UUID (recieved)
The `getUUID` event is recieved from the client when the client is requesting a UUID. The client will be sent a random uuid consisting of 16 bytes encoded as a hex string by the `uuid` event, which the client should then store.

***
### UUID (emmited)
The `uuid` event is emmited to the client with a 16 byte hex string which the client should store and pass along with the related gameplaye events. 

***
### Join (recieved)
The `join` event is recieved from the server along with a `{player: Player, roomCode?: string}` object which contains information about the player and an optional room code. If the room code is provided the user will attempt to join that room.  


***
### Joined Room (emitted)
The `joinedRoom` event is emitted from the server when the player has been placed in a room. The event is passed a string containing the room code. 

***
### Start (emitted)
The `start` event is emitted from the server when two players are in the same room and are ready to start the game. The `start` event is passed an array of `Players` that are in the room. 

<br>

## Gameplay Events

***
### Guess (recieved)
The `guess` event is recieved from the client along with a string that contains the players guess. 


***
### Final Guesses (emitted)
The `finalGuesses` event is emitted from the server when both players have finalized their guesses. This event is passed an array of `Players` with their current guesses set. 

<br>

## Game Over Events

***
### Disconnect (recieved)

The `disconnect` event is recieved from the client when a user disconnects. If the player was the only one in their room, that room is deleted, if there was another player in the room, that room becomes available to join again

***
### Player Disconnect (emitted)

The `playerdisconnect` event is emitted to the client when a player in their room disconnects from the game. 

<br>

## Error Events

***
### Error (emitted)
An `error` event is emitted when the client attempts to do something that is not allowed by the server

***
### Room Error (emitted)
A `roomerror` event is emitted when the client attempts to join a room it is not permitted to join.



