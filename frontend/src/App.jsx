import { useState } from 'react'
import Auth from './components/Auth';

import './App.css'
import {Editor} from "@monaco-editor/react"
import {MonacoBinding} from "y-monaco";
import { useRef , useMemo,useEffect} from 'react';
import * as Y from 'yjs';
import {SocketIOProvider} from "y-socket.io";
import {io} from "socket.io-client"

function App() {
  const editorRef =useRef(null);
  const [username, setUsername]= useState(()=>{
    return new URLSearchParams(window.location.search).get("username")||""
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const handleLogin = (username) => {
  setUsername(username)
  window.history.pushState(null, "", `?username=${username}`)
}
const [users,setUsers]= useState([])
const providerRef = useRef(null);

  const ydoc = useMemo(()=> new Y.Doc(),[])
  const yText = useMemo(()=> ydoc.getText("monaco"), [ydoc]);


  
  const COLORS = [
 "#FF6B6B",  // Red
  "#4ECDC4",  // Teal
  "#45B7D1",  // Blue
  "#96CEB4",  // Green
  "#FF8C42",  // Orange
  "#DDA0DD",  // Purple
  "#E74C3C",  // Dark Red
  "#2ECC71",  // Emerald
]

const getRandomColor = () => {
  const index = Math.floor(Math.random() * COLORS.length)
  return COLORS[index]
}


  const [userColor] = useState(() => getRandomColor())

  const [messages, setMessages] = useState([])
const [newMessage, setNewMessage] = useState("")
const socketRef = useRef(null)

  const handleMount=(editor)=>{
    editorRef.current = editor
    new MonacoBinding(
  yText,
  editorRef.current.getModel(),
  new Set([editorRef.current]),
   providerRef.current?.awareness 
  

    
    )
 }
  const handleJoin =(e)=>{
    e.preventDefault();
    setUsername(e.target.username.value)
    window.history.pushState(null,"", `?username=${e.target.username.value}`)
  }
  useEffect(()=>{
     if(username){
       const provider = new SocketIOProvider("http://localhost:3000","monaco",ydoc,{
       autoConnect:true, 
    })
    providerRef.current = provider
    
    provider.awareness.setLocalStateField("user",{username
      ,color:userColor
    })
   

    const states= Array.from(provider.awareness.getStates().values())

    setUsers(states.filter((state)=> state.user && state.user.username).map((state)=>state.user))
    provider.awareness.on("change",()=>{
      const states = Array.from(provider.awareness.getStates().values())
      setUsers(states.filter((state)=> state.user && state.user.username).map((state)=>state.user))
    })
    socketRef.current = io("http://localhost:3000")
    socketRef.current.emit("join-room", "monaco")

    socketRef.current.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data])
    })
    function handlBeforeUnload(){
      provider.awareness.setLocalStateField("user",null)
    }

    window.addEventListener("beforeunload",handlBeforeUnload)
     
    return ()=>{
      
      provider.disconnect()
      socketRef.current.disconnect()
      window.removeEventListener("beforeunload",handlBeforeUnload)
    }
    }
  },[
    
    username
  ])
 if (!token) {
  return <Auth onLogin={(uname) => {
    setToken(localStorage.getItem('token'))
    handleLogin(uname)
  }} />
}

if (!username) {
  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-4 items-center justify-center'>
      <form onSubmit={handleJoin} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='Enter your username'
          className='p-2 rounded-lg bg-gray-800 text-white'
          name='username'
        />
        <button className='p-2 rounded-lg bg-amber-50 text-gray-950 font-bold'>
          Join
        </button>
      </form>
    </main>
  )
}

  const sendMessage = (e) => {
  e.preventDefault()
  if (!newMessage.trim()) return

  socketRef.current.emit("send-message", {
    roomId: "monaco",
    message: newMessage,
    username,
    color: userColor
  })
  setNewMessage("")
}


  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-4'>
     <aside className='h-full w-1/4 bg-amber-50 rounded-lg'>
      <h2 className='text-2xl font-bold p-4 border-b border-gray-300'>Users</h2>
      <ul className='p-4'>
        {users.map((user, index) => (
          <li key={index} className='p-2 bg-gray-800 text-white rounded mb-2 flex items-center gap-2'>
          <span 
            className='w-3 h-3 rounded-full inline-block' 
            style={{ backgroundColor: user.color || "#fff" }}
           />
            {user.username}
          </li>
        ))}
      </ul>
      {/* Chat Section */}
<div className="flex flex-col h-1/2 border-t border-gray-300">
  <h2 className="text-xl font-bold p-4 border-b border-gray-300">Chat 💬</h2>
  
  {/* Messages */}
  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
    {messages.map((msg, index) => (
      <div key={index} className="text-sm">
        <span 
          className="font-bold" 
          style={{ color: msg.color }}
        >
          {msg.username}:
        </span>
        <span className="text-gray-800 ml-1">{msg.message}</span>
      </div>
    ))}
  </div>

  {/* Input */}
  <form onSubmit={sendMessage} className="p-2 border-t border-gray-300 flex gap-2">
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-1 p-2 rounded-lg bg-gray-800 text-white text-sm focus:outline-none"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
    />
    <button 
      type="submit"
      className="p-2 bg-amber-50 rounded-lg text-gray-950 font-bold text-sm"
    >
      Send
    </button>
  </form>
</div>
     </aside>
     <section className='w-3/4 bg-neutral-800 rounded-lg overflow-hidden' >
     <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        
        defaultValue="// Write your code here"
        onMount={handleMount}
      />
     </section>
    </main>
  )
}

export default App
