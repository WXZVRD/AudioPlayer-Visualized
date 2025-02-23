import "./app.css";
import "./assets/normalize.css";
import AudioPlayer from "./components/AudioPlayer.jsx";

function App() {


    return (
        <div className="wrapper">
            <div className="container">
                <AudioPlayer/>
            </div>
        </div>
    );
}

export default App;
