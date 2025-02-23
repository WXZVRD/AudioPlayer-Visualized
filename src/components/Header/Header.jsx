import useMousePosition from "../../hook/useMouse.js";
import styles from './Header.module.css'


const Header = () => {
    const position = useMousePosition();

    return (
        <header className={styles.header}>
            <div
                style={{transform: `translate(${position.x}px, ${position.y}px) rotateY(30deg) rotateX(-30deg)`}}
                className={styles.align__left}>
                PET-PROJECT <br/> REACT.JS, THREE.JS
            </div>
            <div
                style={{transform: `translate(${position.x}px, ${position.y}px) rotateX(-30deg)`}}
                className={styles.align__center}>
                NICK PERSII <br/> AUDIO PLAYER
            </div>
            <div
                className={styles.align__right}
                style={{transform: `translate(${position.x}px, ${position.y}px) rotateY(-30deg) rotateX(-30deg)`}}
            >
                <a href="https://t.me/s/Tyraellis">TELEGRAM</a>
                <a href="https://github.com/WXZVRD">GITHUB</a>
            </div>
        </header>
    )
}

export default Header;