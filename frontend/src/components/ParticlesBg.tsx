import { useCallback } from "react";
import Particles from "react-particles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim"; // 更輕量的粒子庫

const ParticlesBg = () => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true },
                background: { color: "#0d0d0d" },
                particles: {
                    number: {
                        value: 100,
                        density: { enable: true, area: 800 },
                    },
                    color: { value: ["#00bcd4", "#ffffff"] }, // Sui 的藍色+白色
                    shape: { type: "circle" },
                    opacity: {
                        value: 0.8,
                        random: true,
                    },
                    size: {
                        value: { min: 1, max: 4 },
                        random: true,
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        outModes: { default: "out" },
                    },
                },
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "repulse" },
                        onClick: { enable: true, mode: "push" },
                    },
                    modes: {
                        repulse: { distance: 100, duration: 0.4 },
                        push: { quantity: 4 },
                    },
                },
            }}
        />
    );
};

export default ParticlesBg;
