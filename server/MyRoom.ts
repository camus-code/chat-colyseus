import { Room } from "colyseus";
import * as admin from 'firebase-admin';

export class ChatRoom extends Room<any> {
    maxClients = 64;

    onInit (options: any) {
        console.log("CREATING NEW ROOM");
    }

    onJoin (client: any) {
      this.broadcast(`${ client.sessionId } joined.`);
    }

  	onAuth (options: any) {
	    return new Promise((resolve, reject) => {
	        admin.auth().verifyIdToken(options.idToken)
	            .then(function(decodedToken) {
	                var uid = decodedToken.uid;
	                // ...
	                resolve(); // onAuth is successful!
	        }).catch(function(error) {
	      // Handle error
	            reject(); // onAuth has failed!
	        });
	    });
 		}
    
    onMessage (client: any, data: any) {
        console.log("BasicRoom received message from", data.message.userEmail, ":", data.message.text);
        this.broadcast(data);
    }

    onLeave (client: any) {
        console.log("ChatRoom:", client.sessionId, "left!");
    }
}

/*
code to prevent users from samen browser tab
requestJoin (options: any) {
    // Prevent the client from joining the same room from another browser tab
    	return this.clients.filter(c => c.id === options.clientId).length === 0;
  	}
*/