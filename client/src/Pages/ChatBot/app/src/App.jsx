import { useEffect, useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"
import PhoneVerify from './PhoneVerify';
import firebase from 'firebase/compat/app';
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'

const API_KEY = "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"

const App = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyDHZCujtDCTpIfvk0PnQOlXuF71iXnZZmk",
    authDomain: "opt-login-app.firebaseapp.com",
    projectId: "opt-login-app",
    storageBucket: "opt-login-app.appspot.com",
    messagingSenderId: "363607549453",
    appId: "1:363607549453:web:c36f034abaa707ddc01744",
    measurementId: "G-G7J05SSPL9"
  }

  firebase.initializeApp(firebaseConfig);

  
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);

  useEffect(() => {
  
    const unSubscriber = onAuthStateChanged(firebase.auth(), (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });

    return() => unSubscriber();
  },[])

  const [typing, setTyping] = useState(false)

  const [messages, setMessages] = useState([
    {
      message:"Hello, I am ChatBot!",
      sender:"ChatBot"
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    setTyping(true);

    try{
      const response = await processMessageToChatBot([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;

      if(content){
        const chatBotResponse = {
          message: content,
          sender: "ChatBot",
        };
        setMessages((prevMessages) => [...prevMessages, chatBotResponse]);
      }
    } catch (error) {
      console.error("Error processing message...", error);
    } finally {
      setTyping(false);
    }
  };

  async function processMessageToChatBot(chatMessages){
    // chatMessages { sender: "user" or "ChatBot", message: "The message content here"}
    // apiMessages { role: "user" or "ChatBot", message: "The message content here"}

    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatBot" ? "assistant" : "user";
      return { role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [ 
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages ]
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ API_KEY }`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <div className="App">
      <div style={{position: "relative", height:"700px", width:"600px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList scrollBehavior='smooth' typingIndicator={ typing ? <TypingIndicator content="ChatBot is typing" /> : null } >
              { messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <div className='App'>
              <h1>Verify Phone Number with OTP...</h1>
              <PhoneVerify auth={firebase.auth()} >
                <MessageInput placeholder='Type message here' onSend={handleSend} />
              </PhoneVerify>
            </div>
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
