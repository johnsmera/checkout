import { useEffect, useState } from "react";
import styles from "./ConfettiEffect.module.css";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  emoji: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

interface ConfettiEffectProps {
  trigger: boolean;
  duration?: number;
}

const confettiEmojis = ["🎉"];

export function ConfettiEffect({ trigger, duration = 3000 }: ConfettiEffectProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);
    
    // Criar partículas de confetti
    const newParticles: ConfettiParticle[] = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 3 + Math.random() * 5;
      
      newParticles.push({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: Math.cos(angle) * velocity + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * velocity + (Math.random() - 0.5) * 3,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        size: 24 + Math.random() * 16,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        life: 0,
        maxLife: 300 + Math.random() * 200,
      });
    }

    setParticles(newParticles);

    // Animação das partículas
    const startTime = Date.now();
    let animationId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      if (elapsed > duration) {
        setIsActive(false);
        setParticles([]);
        return;
      }

      setParticles(prevParticles => 
        prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // Gravidade
            rotation: particle.rotation + particle.rotationSpeed,
            life: particle.life + 1,
          }))
          .filter(particle => particle.life < particle.maxLife)
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [trigger, duration]);

  if (!isActive) return null;

  return (
    <div className={styles.confettiContainer}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={styles.confettiParticle}
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: Math.max(0, 1 - particle.life / particle.maxLife),
            fontSize: particle.size,
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
    </div>
  );
}
