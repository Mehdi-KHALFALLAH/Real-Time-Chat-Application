import React , { useState,useEffect } from 'react';

 import io from 'socket.io-client' ;
import queryString from 'query-string';
import InfoBar from "./../infoBar/InfoBar.js";
import Messages from '../Messages/Messages.js';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer.js';
import './Chat.css' ;


let socket;



  const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
    const ENDPOINT ='https://react-app-chat-by-kh.herokuapp.com/' ;
    useEffect (()=> {
const {name,room} = queryString.parse(location.search);
  var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
            "timeout" : 10000,                  
            "transports" : ["websocket"]
        };
    socket = io.connect(ENDPOINT, connectionOptions);


setRoom(room) ;
setName(name) ;
socket.emit('join', {name,room}, (error) => {

 if(error) {
        alert(error);
      }
}) ;

return () => {
socket.emit ('disconnect');
socket.off() ;


}

    }, [ENDPOINT,location.search])

     useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages,message ]);
    });
 return () => {
      socket.off()}
    }, [messages])

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }
console.log(message,messages)
    return (
 <div className="outerContainer">
   <div className= "fixedElement">Developed by Mehdi Khalfallah</div>
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}
export default Chat ;