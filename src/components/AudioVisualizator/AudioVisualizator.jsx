import { Canvas } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import SphereVisualizer from "../SphereVisualizer.jsx";
import tracks from "../../mock/mockTracks.js";
import styles from './AudioVisualizator.module.css';

import leftBtn from '../../assets/img/leftBtn.svg';
import rigthBtn from '../../assets/img/rightBtn.svg';
import pauseBtn from '../../assets/img/pause.svg';
import startBtn from '../../assets/img/play.svg';
import formatTime from "../../utils/formatTime.js";
import useMousePosition from "../../hook/useMouse.js";

export default function AudioVisualizer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const position = useMousePosition();

    useEffect(() => {
        audioRef.current = new Audio(tracks[currentTrackIndex].src);
        audioRef.current.preload = "auto";
        audioRef.current.addEventListener("timeupdate", () => {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        });

        audioRef.current.addEventListener("ended", nextTrack);

        return () => {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current.load();
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = tracks[currentTrackIndex].src;
            audioRef.current.load();
            if (isPlaying) {
                audioRef.current.play().catch(err => console.error("Ошибка воспроизведения:", err));
            }
        }
    }, [currentTrackIndex]);

    const playPause = async () => {
        if (!isPlaying) {
            await audioRef.current.play();
        } else {
            await audioRef.current.pause();
        }
        setIsPlaying(!isPlaying);
    };

    const nextTrack = async () => {
        setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    };

    const prevTrack = async () => {
        setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    };

return (
        <>
            <div className={styles.player}>
                <div
                    style={{transform: `translate(${position.x}px, ${position.y}px) rotateY(30deg) rotateX(-30deg)`}}
                    className={styles.player__left}
                >
                    <h5 className={styles.player__descr_subheader}>// PLAYING SONG</h5>
                    <span className={styles.player__current_song}>{tracks[currentTrackIndex].author} - {tracks[currentTrackIndex].title}</span>
                </div>
                <div className="">
                    <div className={styles.canvas__container}>
                        <Canvas style={{ width: '500px', height: '500px' }} camera={{ position: [0, 0, 5] }}>
                            <SphereVisualizer audioRef={audioRef.current} startAudio={isPlaying} />
                        </Canvas>
                        <div className={styles.canvas__smile}></div>
                    </div>

                    <div className={styles.player__nav}>
                        <button className={styles.prev__btn} onClick={prevTrack}>
                            <img className={styles.player__navBtn__img} src={leftBtn} alt="Previous"/>
                        </button>
                        <button className={styles.center__btn} onClick={playPause}>
                            <img className={styles.player__navBtn__img} src={isPlaying ? pauseBtn : startBtn} alt="Play/Pause"/>
                        </button>
                        <button className={styles.next__btn} onClick={nextTrack}>
                            <img className={styles.player__navBtn__img} src={rigthBtn} alt="Next"/>
                        </button>
                    </div>
                </div
                >
                <div
                    style={{transform: `translate(${position.x}px, ${position.y}px) rotateY(30deg) rotateX(-30deg)`}}
                    className={styles.player__right}
                >
                    <span className={styles.player__timer}>PLAY TIME: {formatTime(currentTime)} / {formatTime(duration)}<br/></span>
                    <span className="center__time-visualizer">VISUALIZER</span>
                </div>
            </div>
        </>
    );
}
