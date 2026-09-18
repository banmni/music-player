import { useState , useRef, useEffect, use} from 'react'

// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'

import './App.css'

import assets from "./getAssets"
import tracks from "../assets/audio/tracks.json"
import { activateAudio } from './audioPlayer'

function formatTime(seconds){
  if (!seconds || Number.isNaN(seconds)){return "0:00"}
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds%60)
  return `${mins}:${secs.toString().padStart(2,"0")}`
}

function ProgressBar({progress, currentTime,duration,seek}){
  const [dragging, setDragging] = useState(false)
  const [dragProgress,setDragProcess] = useState(progress)
  const displayedProgress = dragging ? dragProgress : progress

  function getSeek(fraction){
    seek(fraction);
  }
  function getFraction(event){
    console.log('ACTIVATEDED')
    const container = event.currentTarget.getBoundingClientRect()
    const clickX =event.clientX - container.left;
    const fraction = clickX / container.width;
    return fraction
  }
  function pointerDown(event){
    console.log('e')
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setDragProcess(getFraction(event))
  }
  function pointerMoving(event){
    if(dragging){
      setDragProcess(getFraction(event))
    }
  }

  function pointerUp(event){
    const finalPosition = getFraction(event)
    setDragging(false)
    setDragProcess(finalPosition)
    getSeek(finalPosition)
  
  }
  return (
    <div className="progress-container">
      <div className='progress-bar-top'>

        <div className='progress-bar'onPointerDown={pointerDown} onPointerMove={pointerMoving} onPointerUp={pointerUp} style={{cursor:'pointer'}}>
          <div className='progress-bar-filler' style={{width:`${displayedProgress*100}%`}}></div>
          <img className="ship-icon" style={{left: `${displayedProgress*100}%`}} src= "/assets/Icons/Boat.png"/>
          <img className="island-icon" src= "/assets/Icons/Island.png"/>
        </div>
      </div>

      <div className='progress-bar-bottom'>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

function SongTitle({title}){
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [shouldBeAnimate, setShouldBeAnimate] = useState(false)

  useEffect(()=>{
    const container = containerRef.current
    const text = textRef.current

    if (!container || !text){ return }

    setShouldBeAnimate(text.scrollWidth > container.clientWidth)
  }, [title])

  return(
    <div className="song_title_container" ref = {containerRef}>
      <div className={`song_title_track ${shouldBeAnimate ? "animate" : ""}`}>
        <span className="song_title" ref = {textRef}>{title}</span>
        {shouldBeAnimate && (<span className="song_title" aria-hidden="true">{title}</span>)}
      </div>
    </div>
  )
}

function HoverButtons({normal, hover, alt = "", className = "", onClick}){
  const [isHovering, setIsHovering] = useState(false)

  return (
    <img 
      onClick={onClick}
      src = {isHovering ? hover : normal}
      onMouseEnter= {()=>setIsHovering(true)}
      onMouseLeave={()=>setIsHovering(false)}
      alt = {alt}
      className={`${className} button`}
    />
  )
}

function TopBar(){
  return (
    <nav>
      <HoverButtons normal={assets.Hamburger} hover={assets.HamburgerHover} alt="Hamburger button" className= "top-nav-right-button"/>
      
      <div className="top-nav-right">
        <HoverButtons normal={assets.Minimize} hover={assets.MinimizeHover} alt="Minimize button"  className= "top-nav-right-button" onClick={()=>window.electronAPI?.minimize()} />
        <HoverButtons normal={assets.MaxMin} hover={assets.MaxMinHover} alt="MaxMin button"  className= "top-nav-right-button" onClick={()=>{window.electronAPI?.minMax()}}
          />
        <HoverButtons normal={assets.Exit} hover={assets.ExitHover} alt="Minimize button"  className= "top-nav-right-button" onClick={()=>window.electronAPI?.exit()}/>
      </div>
    </nav>
  )
}

function VolumeControl({ volume, setVolume }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)
  const sliderRef = useRef(null)
  const percentage = Math.round(volume * 100)

  useEffect(() => {
    if (!open) return
    sliderRef.current?.focus()

    function closeOutside(event) {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div className="volume-container" ref={containerRef}>
      <button
        type="button"
        className="volume-toggle"
        ref={buttonRef}
        aria-label="Volume"
        aria-expanded={open}
        aria-controls={open ? 'volume-popup' : undefined}
        onClick={() => setOpen(value => !value)}
      >
        <img src={assets.volume} alt="" />
      </button>
      {open && (
        <div className="volume-popup" id="volume-popup">
          <input
            ref={sliderRef}
            id="volume-slider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={percentage}
            aria-orientation="vertical"
            onChange={event => setVolume(Number(event.target.value) / 100)}
          />
        </div>
      )}
    </div>
  )
}

function App() {
  
  const audioPath = `/assets/Audio/`

  const audio = activateAudio(tracks,audioPath)
   
  const currentTrack = audio.currentTrack
  
  //  console.log(currentTrack.file)
  const albumPath = `/assets/Album/${currentTrack.album}` 
  

// console.log(audioPath)
  // console.log(tracks)
  return (
    <>
    <TopBar/>
    {/* <img src={assets.hatLogo} className='hat-logo'/> */}
    <SongTitle title = {currentTrack.title}/>
     <p className='song_artist'>{currentTrack.artist}</p>
     <img className='album_image' src={albumPath}/>

     <ProgressBar progress={audio.progress} currentTime={audio.currentTime} duration={audio.duration}
    seek={audio.seek}/>
    
    <div className='middle-buttons-container'>

      <img src={assets.Shuffle} className='shuffle-container iconButton' alt="Shuffle"/>


      <HoverButtons normal={assets.BackwardNormal} hover={assets.BackwardNormalHover} alt="Backwards button" onClick = {audio.previous} className= "control-button side-button"/>
      <HoverButtons normal={assets.PlayNormal} hover={assets.PlayNormalHover} alt="Play button" onClick = {audio.playButton} className ="control-button play-button"/>
      <HoverButtons normal={assets.ForwardNormal} hover={assets.ForwardNormalHover} alt="Forwards Button" onClick = {audio.next}  className="control-button side-button"/>

      <VolumeControl volume={audio.volume} setVolume={audio.setVolume} />
    </div>

    <button onClick={audio.togglePlayMode}>Shuffle</button>
    </>
  )
}



export default App
