import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'

import './App.css'

import tracks from "../assets/audio/tracks.json"
import { activateAudio } from './audioPlayer'
function App() {
  
  const audioPath = `/assets/Audio/`

  const audio = activateAudio(tracks,audioPath)
   
  const currentTrack = audio.currentTrack
  
   console.log(currentTrack.file)
  const albumPath = `/assets/Album/${currentTrack.album}` 
  

console.log(audioPath)
  console.log(tracks)
  return (
    <>
     <h1 className='song_title'>{currentTrack.title}</h1>
     <p className='song_artist'>{currentTrack.artist}</p>
     <img className='album_image' src={albumPath}/>
      console.log({currentTrack.file})
    <button onClick={audio.togglePlayMode}>Shuffle</button>
    <button onClick={audio.previous}>Previous</button> 
    <button onClick={audio.playButton}>Play Audio</button>
     <button onClick={audio.next}>Next</button>
    </>
  )
}

export default App
