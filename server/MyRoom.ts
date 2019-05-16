import { Room } from "colyseus";

export class CreateOrJoinRoom extends Room<any> {
    maxClients = 64;

    onInit (options: any) {
        console.log("CREATING NEW ROOM");
    }

    onJoin (client: any) {
      this.broadcast(`${ client.sessionId } joined.`);
    }

    requestJoin (options: any) {
    // Prevent the client from joining the same room from another browser tab
    	return this.clients.filter(c => c.id === options.clientId).length === 0;
  	}

    onMessage (client: any, data: any) {
        console.log("BasicRoom received message from", client.sessionId, ":", data);
        this.broadcast(`(${ client.sessionId }) ${ data.message }`);
    }

    onLeave (client: any) {
        console.log("ChatRoom:", client.sessionId, "left!");
    }

}