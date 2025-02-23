import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import SimplexNoise from "simplex-noise";
import * as THREE from "three";

const SphereVisualizer = ({ audioRef, startAudio }) => {
    const meshRef = useRef(null);
    const [audioCtx, setAudioCtx] = useState(null);
    const [analyser, setAnalyser] = useState(null);
    const [dataArray, setDataArray] = useState(null);
    const [originalPositions, setOriginalPositions] = useState(null);

    const noise = useRef(new SimplexNoise());
    const timeRef = useRef(0);
    const audioIntensityRef = useRef(10);

    useEffect(() => {
        if (!audioRef) return;

        if (!audioCtx) {
            const newAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            setAudioCtx(newAudioCtx);

            const analyserNode = newAudioCtx.createAnalyser();
            analyserNode.fftSize = 128;
            setAnalyser(analyserNode);

            if (!audioRef.source) {
                const source = newAudioCtx.createMediaElementSource(audioRef);
                source.connect(analyserNode);
                analyserNode.connect(newAudioCtx.destination);
                audioRef.source = source;
            }

            setDataArray(new Uint8Array(analyserNode.frequencyBinCount));
        }

        return () => {
            if (audioCtx && audioCtx.state !== "closed") {
                audioCtx.close();
                setAudioCtx(null);
            }
        };
    }, [audioRef]);

    useEffect(() => {
        if (startAudio) {
            audioCtx?.resume();
        }
    }, [startAudio]);

    useEffect(() => {
        if (meshRef.current && !originalPositions) {
            const geometry = meshRef.current.geometry;
            const positions = geometry.attributes.position.array;
            setOriginalPositions(new Float32Array(positions));
        }
    }, [meshRef]);

    useFrame(() => {
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.z += 0.001;

        if (analyser && dataArray && meshRef.current && originalPositions && startAudio) {
            timeRef.current += 0.002;
            meshRef.current.scale.set(2, 2, 2);

            analyser.getByteFrequencyData(dataArray);

            const lowFreqRange = dataArray.slice(0, 10);
            const midFreqRange = dataArray.slice(10, 30);
            const highFreqRange = dataArray.slice(30, 60);

            const avgLowFreq = lowFreqRange.reduce((sum, value) => sum + value, 0) / lowFreqRange.length;
            const avgMidFreq = midFreqRange.reduce((sum, value) => sum + value, 0) / midFreqRange.length;
            const avgHighFreq = highFreqRange.reduce((sum, value) => sum + value, 0) / highFreqRange.length;

            const overallIntensity = (avgLowFreq * 0.5 + avgMidFreq * 0.3 + avgHighFreq * 0.2) / 255;

            audioIntensityRef.current = Math.pow(overallIntensity, 1.5);

            const maxDisplacement = 0.4 * audioIntensityRef.current;
            const geometry = meshRef.current.geometry;
            const positions = geometry.attributes.position.array;
            const vertex = new THREE.Vector3();

            for (let i = 0; i < positions.length; i += 3) {
                vertex.set(
                    originalPositions[i],
                    originalPositions[i + 1],
                    originalPositions[i + 2]
                );

                const rf = 0.006;

                const noiseValue = noise.current.noise4D(
                    vertex.x * 0.5 + maxDisplacement * timeRef.current * rf * 7,
                    vertex.y * 0.5 + maxDisplacement * timeRef.current * rf * 8,
                    vertex.z * 0.5 + maxDisplacement * timeRef.current * rf * 9,
                    timeRef.current
                );

                const displacement = maxDisplacement * noiseValue;

                vertex.normalize().multiplyScalar(1 + displacement);

                positions[i] = vertex.x;
                positions[i + 1] = vertex.y;
                positions[i + 2] = vertex.z;
            }

            geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <>
            <pointLight color={"#ffffff"} intensity={1.5} position={[-2, -2, -2]} distance={10} decay={2} />
            <pointLight color={"#ffffff"} intensity={1.5} position={[3, -2, -2]} distance={10} decay={2} />
            <pointLight color={"#ffffff"} intensity={1} position={[-2, 2, 2]} distance={10} decay={2} />
            <pointLight color={"#ffffff"} intensity={1.5} position={[2, 2, 2]} distance={10} decay={2} />

            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial wireframe color="white" />
            </mesh>
        </>
    );
};

export default SphereVisualizer;
