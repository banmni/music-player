import { useCallback, useEffect, useRef, useState } from 'react'

export function activateAudio(tracks, AudioPath){
    const audioRef = useRef(new Audio())
    const audio = audioRef.current
    const [trackIndex, setTrackIndex] = useState (0)
    const [currentTrack,setCurrentTrack] = useState(tracks[0])
    const [currentTime, setCurrentTime] = useState(0)
    const [currentProgress, setCurrentProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    const [arrayPrevious,setarrayPrevious] = useState([])
    
    // play mode have it normal or shuffle mode
    const [playMode, setPlayMode] = useState('normal')
    const [shuffleOn, setShuffleOn] = useState(false)

    const [isPlaying, setIsPlaying] = useState(false)
    
    const playingReference = useRef(false)
    playingReference.current = isPlaying 
    // Load track or change when trackIndex changes
    useEffect(()=>{
        const newTrack = tracks[trackIndex]

        let cancel = false;
        (async () =>{
            let src
            if(AudioPath){
                console.log(`${AudioPath} ${newTrack.file}`)
                src =   AudioPath+`${newTrack.file}`
                console.log(src)
            }else{
                src = `./${newTrack.file}`
                console.log('ee')
            }
            if (cancel || !src){ return }
            audio.src = src
            audio.load()
            setCurrentTime(0)
            setCurrentProgress(0)
            setDuration(0)
            setCurrentTrack(newTrack)
            console.log(audio.volume)
            if (playingReference.current){
                audio.play().catch(()=>{})
            }
        })()

        return ()=>{cancel = true}
    
    },[trackIndex])

    // updates what time the song is at
    useEffect(()=>{
        function updateTime(){
            setCurrentTime(audio.currentTime)

            if(audio.duration){
                setCurrentProgress(audio.currentTime/audio.duration)
            }
        }

        function loadDuration(){
            setDuration(audio.duration)
        }

        audio.addEventListener('timeupdate', updateTime)
         audio.addEventListener('loadedmetadata', loadDuration)

         return()=>{
            audio.removeEventListener('timeupdate',updateTime)
            audio.removeEventListener('loadedmetadata',loadDuration)
         }
    },[])

    const play = useCallback(()=>{
        audio.play().catch(()=>{})
        setIsPlaying(true)
    },[])
    const pause = useCallback(()=>{
        audio.pause()
        setIsPlaying(false)
    },[])
    
    const seek = useCallback((fraction)=>{
        if(audio.duration){
            const clamped = Math.max(0, Math.min(1,fraction))
            const newTime = clamped * audio.duration

            audio.currentTime = newTime
            setCurrentTime(newTime)
            setCurrentProgress(clamped)
        }
    },[])

    //  sets the trackindex -1 or at end 0
    const previous = useCallback(()=>{
        console.log('current array songs  ' , arrayPrevious)
        if(arrayPrevious.length !== 0){
            let previousNumber = arrayPrevious.splice(-1)[0]
            if (typeof(previousNumber)!== 'number'){
                console.warn("THIS IS NOT NUMBER");
                return
            }
            setTrackIndex(previousNumber)
            console.log('spliced')
        }else{ 
            return setTrackIndex(0) } // assume its at start index 0
    }, [tracks,trackIndex,arrayPrevious])

     const next = useCallback(()=>{
        
        setarrayPrevious([...arrayPrevious, trackIndex])
        console.log(`arrayPrevious : ${[...arrayPrevious]} Trackindex :${trackIndex}`)

        if (shuffleOn){
            // check if the arrayprevious is empty
            let randomIndex 
            if (arrayPrevious.length !== 0){
                // if(arrayPrevious.length >0){

                // }
                randomIndex = trackIndex
                console.log("Trackindex ", trackIndex, " randomIndex ", randomIndex)
                console.log(arrayPrevious)
                while(randomIndex == trackIndex){
                    randomIndex = Math.floor(Math.random() * (tracks.length))
                    if(randomIndex == arrayPrevious[arrayPrevious.length-1]){
                        randomIndex = trackIndex
                    }
                }
            }else{
                randomIndex = Math.floor(Math.random() * (tracks.length))
            }

            // console.log('THIS IS RANDOMINDEX ',randomIndex)
            return setTrackIndex(randomIndex)
        }

       if (trackIndex === tracks.length-1){
        return setTrackIndex(0)
       }else{
        console.log(trackIndex)
        return setTrackIndex(trackIndex+1)}

    }, [tracks,trackIndex,shuffleOn, arrayPrevious])

    // Plays the next song when it has ended
    // const playNextSong = ()=>{
    //     if(shf)
    // }
    audio.onended =function(){
        next()
    }
    // checks if isplaying and turns off or on
    const playButton = useCallback(()=>{
        if (isPlaying){
            pause()
        }else{
            play()
        }
    },[isPlaying,play,pause])

    // play list turns shuffle or normal
     const shuffle = useCallback(()=>{
        console.log('shuffle')
        setShuffleOn(true)
        setPlayMode('shuffle')
    },[])
    const normal = useCallback(()=>{
        console.log('normal')
        setShuffleOn(false)
        setPlayMode('normal')
    },[])

    const togglePlayMode = useCallback(()=>{
        if (shuffleOn){normal()
        }else {shuffle()}
    },[playMode,shuffleOn])

    return {
    currentTrack,
    playButton,
    previous,
    next, 
    togglePlayMode,

    currentTime,
    seek,
    duration,
    progress: currentProgress,
    }
}