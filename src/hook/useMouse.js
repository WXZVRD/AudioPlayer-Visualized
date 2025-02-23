import { useState, useEffect } from "react";

const useMousePosition = (multiplier = 20) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * multiplier;
            const y = (e.clientY / innerHeight - 0.5) * multiplier;
            setPosition({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [multiplier]);

    return position;
};

export default useMousePosition;
