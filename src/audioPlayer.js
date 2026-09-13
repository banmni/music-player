import { useCallback, useEffect, useRef, useState } from 'react'

export {useRef, useState,useEffect} from 'react'

export function activateAudio(tracks, AudioPath){
    const audioRef = useRef(new Audio())
    const audio = audioRef.current
    const [trackIndex, setTrackIndex] = useState (0)
    const [currentTrack,setCurrentTrack] = useState(tracks[0])
    const [currentTime, setCurrentTime] = useState(0)
    const [currentProgress, setCurrentProgress] = useState(0)
    const [duration, setDuration] = useState(0)

    const [previousIndex,setPreviousIndex] = useState(null)
    
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

    const play = useCallback(()=>{
        audio.play().catch(()=>{})
        setIsPlaying(true)
    },[])
    const pause = useCallback(()=>{
        audio.pause()
        setIsPlaying(false)
    },[])

    //  sets the trackindex -1 or at end 0
    const previous = useCallback(()=>{
        console.log('activated prev ' , previousIndex)
        if(previousIndex !==null){
            setTrackIndex(previousIndex)
        }else{ setTrackIndex(tracks.length-1) } // assume its at start index 0
    }, [tracks,trackIndex,previousIndex])

     const next = useCallback(()=>{
    
        setPreviousIndex(trackIndex)
        console.log('previous track ', previousIndex)
        if (shuffleOn){
            let randomIndex = trackIndex
            while(randomIndex === trackIndex){
                randomIndex = Math.floor(Math.random() * (tracks.length))
            }
            console.log('THIS IS RANDOMINDEX ',randomIndex)
            return setTrackIndex(randomIndex)
        }
       if (trackIndex === tracks.length-1){
        return setTrackIndex(0)
       }else{ return setTrackIndex(trackIndex+1)}
    }, [tracks,trackIndex,shuffleOn])



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

    return {currentTrack,playButton,previous,next, togglePlayMode}
}