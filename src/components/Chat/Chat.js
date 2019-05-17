import React from 'react';
import * as Colyseus from "colyseus.js";
import { withAuthorization } from '../Session';

class Chat extends React.Component {
	constructor(props){
		super(props);

		this.client = new Colyseus.Client('ws://localhost:2567');

    this.state = {
      currentText: "",
      disabled: true
    };
	}

	addListeners = (room) => {
		console.log(room)
	  room.onJoin.add(() => {
	    console.log('joined room:', room.id);
	  })

	  room.onLeave.add(() => {
	    console.log("LEFT ROOM");
	  });

		room.onStateChange.add((data) => {
			console.log("chat update: ", data)
		});

		room.onMessage.add((message) => {
			const user = message.message ? message.message['userEmail'] : null
			const text = message.message ? message.message['text'] : null
			if (user && text) {
				var p = document.createElement("p");
				p.innerHTML = `${user}: ${text}`;
				document.querySelector("#messages").appendChild(p);
			}
		});
	}

	joinRoom = () => {
  	this.addListeners(this.chatRoom = this.client.join('chat', { channel: window.location.hash.substring(1) || 'default' }));
  	this.setState({disabled: false})
	}

  onInputChange = (e) => {
    e.preventDefault()
    this.setState({ currentText: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.chatRoom.send({message: {userEmail: this.props.firebase.auth.currentUser.email, text: this.state.currentText}})
    this.setState({currentText: ""})
  }

	getAvailableRooms = () => {
  this.client.getAvailableRooms('chat', function(rooms, err) {
    console.log('Available rooms:', rooms);
  	});
	}

	componentDidMount(){
		this.getAvailableRooms();
	}

 render() {
    return (
    	<div>
    		<h1>Chat</h1>
    		<button onClick={this.joinRoom}>Join</button>
    		<button onClick={this.getAvailableRooms}>Available Room</button>
	      <div id="messages" ref="messages">
	      	<h2>Message</h2>
	      </div>
	      <form id="form" onSubmit={this.onSubmit.bind(this)}>
	        <input id="input" type="text" onChange={this.onInputChange.bind(this)} value={this.state.currentText} />
	        <button disabled={this.state.disabled} type="submit">send</button>
	      </form>
    </div>
    )
  }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Chat);
