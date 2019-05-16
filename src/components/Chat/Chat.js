import React from 'react';
import * as Colyseus from "colyseus.js";
import { withAuthorization } from '../Session';

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
  room = client.join('chat');
  addListeners(room);
}

function create() {
  room = client.join('chat', { create: true });
  addListeners(room);
}

function getAvailableRooms() {
  client.getAvailableRooms('chat', function(rooms, err) {
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
	console.log(this.props.firebase.auth)
   return (
   	<div className="App">
		    <button onClick={join}>Join</button>
		    <button onClick={create}>Create</button>
		    <button onClick={getAvailableRooms}>List available rooms</button>
		    <h1>Chat</h1>
		  	<form id="form">
		      <input type="text" id="input-chat"/>
		      <button onClick={onSubmit} type="submit" value="send">Send</button>
		    </form>
		  <div id="messages"></div>
    </div>
   )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Chat);
