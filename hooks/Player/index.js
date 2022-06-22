import { createContext, useContext, useEffect, useRef, useState } from "react";

export const PlayerContext = createContext();

export function PlayerProvider({ children }) {
    //tracks playlist
    const [musicList, setMusicList] = useState([]);
    //track current playing music
    const [currentSong, setCurrentSong] = useState(null);
    //track if the audio player is mute
    const [mute, setMute] = useState(false);
    //tracks audio player current time
    const [currentTime, setCurrentTime] = useState(0);
    //tracks audio player volume level
    const [volume, setVolume] = useState(1);
    //tracks if the audio player is paused/playing
    const [paused, setPaused] = useState(true);
    //hooks into html audio player
    const playerRef = useRef();

    //plays music.if `src` is a different music uri start the music else keep playing the `currentS
    const play = (music) => {
        if (music && music?.uri != currentSong) {
            playerRef.current.setAttribute("src", music?.uri);
            setCurrentSong(music);
        }

        playerRef.current.play();
        setPaused(false);
    };

    //pause
    const pause = () => {
        playerRef.current.pause();
        setPaused(true);
    };

    //mute and unmute
    const toggleMute = () => {
        playerRef.current.muted = !mute;
        setMute((prev) => !prev);
    };

    //change player volume
    const changeVolume = (value) => {
        if (isNaN(value)) {
            return;
        }
        const volume = value / 100;
        playerRef.current.volume = volume;
        setVolume(volume);
    };

    //seek player time
    const seekTime = (value) => {
        if (!isNaN(value)) {
            return;
        }
        playerRef.current.currentTime = value;
    };

    /**
     * add a a list of music to `musicList`
     * @param {Array} list array of music
     */
    const addToPlaylist = (list = []) => {
        if (!Array.isArray(list)) {
            list = [list];
        }

        setMusiclist(prev => [...list, ...prev]);
    };

    // move to the next music in `musicList` 
    const playnext = () => {
        const indexOfCurrentSong = musicList.indexOf(currentSong);
        if (
            indexOfCurrentSong >= 0 &&
            indexOfCurrentSong < musicList.length - 1
        ) {
            play(musicList[indexOfCurrentSong + 1]);
            return;
        }

        setCurrentSong(null);
        setPaused(false);
    };

    useEffect(() => {
        const player = playerRef.current;
        const eventHandler = (event) => {
            playnext();
        };

        const timeHandler = (event) => {
            setCurrentTime((prev) => player.currentTime);
        };

        player.addEventListener("ended", eventHandler);

        return () => {
            player.removeEventListener("ended", eventHandler);
        };
    }, []);

    return (
        <PlayerContext.Provider
            value={{
                play,
                pause,
                toggleMute,
                changeVolume,
                seekTime,
                addToPlaylist,
                currentTime,
                paused,
                mute,
                volume,
                currentSong,
            }}
        >
            <audio ref={playerRef} />
            {children}
        </PlayerContext.Provider>
    );
}
export function usePlayer({ source }) {
    const playerContext = useContext(PlayerContext);

    //throw an error if this hook is not used in a `PlayerContext`
    if (!playerContext) {
        throw Error("usePlayer must be used in a PlayerContext");
    }

    //see {@ PlayerProvider}
    const {
        currentSong,
        play,
        pause,
        mute,
        paused,
        seekTime,
        currentTime,
        toggleMute,
        changeVolume,
        volume,
    } = playerContext;


    //handle pause and play
    const togglePlay = () => {
        //play for the first time if the current playing song is different
        if (source && currentSong?.uri != source?.uri) {
            play(source);
            return;
        }
        //pause and play subsequently
        if (!paused) {
            pause();
        } else {
            play();
        }
    };

    return {
        togglePlay,
        seekTime,
        changeVolume,
        toggleMute,
        currentTime,
        paused,
        mute,
        volume,
        currentSong
    };
}
