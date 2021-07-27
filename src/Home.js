import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

/**
* @author
* @function Home
**/

const Home = (props) => {
  const [nickname, setNickname] = useState("")
  const [roomname, setRoomname] = useState("")
  const enterRoom = () => {
    if(nickname.length < 3) return alert("Nickname too short, must be atleast 3 chracters")
    if(nickname.length < 6) return alert("Roomname too short, must be atleast 6 chracters")
    return <Redirect to="/roomname"/>
  }
  const nicknameInput = (e) => {
    setNickname(e.target.value)
  }
  const roomnameInput = (e) => {
    setRoomname(e.target.value)
  }
  return(
    <div>
      <input type='text' placeholder="nickname" onChange={nicknameInput}/>
      <input type='text' placeholder="roomname" onChange={roomnameInput}/>
      <Link to={`/${roomname}`} params={{nickname, roomname}}><button>Enter</button></Link>
    </div>
   )

 }

export default Home