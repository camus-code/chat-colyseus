import React from 'react';
import * as Colyseus from "colyseus.js";

var client = new Colyseus.Client('ws://localhost:2567');
var room;

function addListeners (room) {
  room.onJoin.add(function() {
    console.log(room.id);
    console.log('joined!');
  })

  room.onLeave.add(function() {
     console.log("LEFT ROOM", arguments);
  });

	room.onStateChange.add(function(data) {
		console.log("chat update: ", data)
	});

	room.onMessage.add(function(message) {
		var p = document.createElement("p");
		p.innerHTML = message;
		document.querySelector("#messages").appendChild(p);
	});
}

function join() {
  room = client.join('create_or_join');
  addListeners(room);
}

function create() {
  room = client.join('create_or_join', { create: true });
  addListeners(room);
}

function getAvailableRooms() {
  client.getAvailableRooms('create_or_join', function(rooms, err) {
    console.log('Available rooms:', rooms);
  });
}

class Chat extends React.Component {
	componentDidMount(){
		getAvailableRooms();
		client.onOpen.add(() => console.log("onOpen"));
	}

 render(){
 	const onSubmit = (e, data) => {
		e.preventDefault();
		var input = document.querySelector("#input-chat");
		room.send({ message: input.value });
		input.value = "";
	}
   return (
   	<div className="App">
      <header className="App-header">
      	<p>
		      On this example, the room has its `maxClients` set to 64, and its
		      `requestJoin` method is configured to allow explicitly creating new
		      rooms, or joining an existing one.
		    </p>
		    <p>Open Developer Tools for log messages.</p>
		    <button onClick={join}>Join</button>
		    <button onClick={create}>Create</button>
		    <button onClick={getAvailableRooms}>List available rooms</button>
		    <h1>Chat</h1>
		  	<form id="form">
		      <input type="text" id="input-chat"/>
		      <button onClick={onSubmit} type="submit" value="send">Send</button>
		    </form>
		  </header>
		  <div id="messages"></div>
    </div>
   )
   }
 }

export default Chat;
