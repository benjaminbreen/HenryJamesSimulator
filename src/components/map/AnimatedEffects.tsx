/**
 * Animated visual effects for Belle Époque atmosphere
 * Adds life to static tile renders with period-appropriate animations
 */

interface CandelightFlickerProps {
  x: number;
  y: number;
  intensity?: number;
}

// Flickering candlelight effect for salons and indoor spaces
export const CandelightFlicker = ({ x, y, intensity = 0.7 }: CandelightFlickerProps) => {
  const id = `candle-${x}-${y}`;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Glowing light */}
      <circle cx="0" cy="0" r="12" fill="url(#candle-glow)" opacity={intensity}>
        <animate
          attributeName="opacity"
          values={`${intensity};${intensity * 0.6};${intensity * 0.8};${intensity};${intensity * 0.7};${intensity}`}
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Flame shimmer */}
      <circle cx="0" cy="0" r="6" fill="#F4CF57" opacity="0.5">
        <animate
          attributeName="r"
          values="6;7;5.5;6.5;6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#F4CF57" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  );
};

interface ElectricLightProps {
  x: number;
  y: number;
  isOn?: boolean;
}

// Electric arc lamp effect for exhibition halls
export const ElectricLight = ({ x, y, isOn = true }: ElectricLightProps) => {
  if (!isOn) return null;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Bright white-blue electric glow */}
      <circle cx="0" cy="0" r="20" fill="url(#electric-glow)" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.5;0.65;0.55;0.6"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Core light */}
      <circle cx="0" cy="0" r="8" fill="#E0F0FF" opacity="0.9" />

      <defs>
        <radialGradient id="electric-glow">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E0F0FF" />
          <stop offset="70%" stopColor="#C8E0F8" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  );
};

interface SteamPuffProps {
  x: number;
  y: number;
  delay?: number;
}

// Rising steam from machinery
export const SteamPuff = ({ x, y, delay = 0 }: SteamPuffProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx="0" cy="0" rx="8" ry="6" fill="#E8E8E8" opacity="0.4">
        <animate
          attributeName="cy"
          values="0;-15;-30"
          dur="3s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0.3;0.1;0"
          dur="3s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="rx"
          values="8;10;12"
          dur="3s"
          begin={`${delay}s`}
          repeatCount="indefinite"
        />
      </ellipse>
    </g>
  );
};

interface WaterFountainProps {
  x: number;
  y: number;
}

// Fountain water spray animation
export const WaterFountain = ({ x, y }: WaterFountainProps) => {
  const droplets = [0, 1, 2, 3, 4];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {droplets.map((i) => (
        <circle
          key={i}
          cx={Math.cos((i * Math.PI * 2) / 5) * 3}
          cy="0"
          r="1.5"
          fill="#A8C8E8"
          opacity="0.7"
        >
          <animate
            attributeName="cy"
            values="0;-12;-8;0"
            dur="2s"
            begin={`${i * 0.2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;0.9;0.7;0.3"
            dur="2s"
            begin={`${i * 0.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>
  );
};

interface FloatingParticlesProps {
  width: number;
  height: number;
  count?: number;
  color?: string;
  type?: 'dust' | 'smoke' | 'sparkle';
}

// Floating atmospheric particles
export const FloatingParticles = ({
  width,
  height,
  count = 8,
  color = '#E8DCC8',
  type = 'dust',
}: FloatingParticlesProps) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * width) / count + (Math.random() * width) / count,
    y: Math.random() * height,
    delay: Math.random() * 10,
  }));

  const getAnimationValues = () => {
    switch (type) {
      case 'smoke':
        return {
          opacity: '0.2;0.4;0.2;0.1',
          r: '2;3;4',
        };
      case 'sparkle':
        return {
          opacity: '0.8;1;0.3;0.8',
          r: '1;2;1',
        };
      default:
        return {
          opacity: '0.1;0.3;0.15;0.1',
          r: '1.5',
        };
    }
  };

  const animation = getAnimationValues();

  return (
    <g>
      {particles.map((p) => (
        <circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r="1.5"
          fill={color}
          opacity="0.1"
        >
          <animate
            attributeName="cy"
            values={`${p.y};${p.y - height / 3};${p.y - (2 * height) / 3};0`}
            dur="15s"
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values={animation.opacity}
            dur="4s"
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          {type !== 'dust' && (
            <animate
              attributeName="r"
              values={animation.r}
              dur="3s"
              begin={`${p.delay}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </g>
  );
};

interface GaslightFlickerProps {
  x: number;
  y: number;
}

// Gaslight flicker for promenades and streets
export const GaslightFlicker = ({ x, y }: GaslightFlickerProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Yellow-orange gas flame */}
      <circle cx="0" cy="0" r="10" fill="#FFB84D" opacity="0.5">
        <animate
          attributeName="opacity"
          values="0.4;0.6;0.5;0.55;0.45;0.5"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Flame core */}
      <circle cx="0" cy="-2" r="4" fill="#FFD700" opacity="0.8">
        <animate
          attributeName="cy"
          values="-2;-3;-2;-2.5;-2"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Glow halo */}
      <circle cx="0" cy="0" r="16" fill="url(#gas-glow)" opacity="0.3">
        <animate
          attributeName="opacity"
          values="0.2;0.4;0.3;0.35;0.25;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <defs>
        <radialGradient id="gas-glow">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFB84D" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </g>
  );
};

interface SunbeamProps {
  x: number;
  y: number;
  width: number;
  angle?: number;
}

// Garden sunbeams through foliage
export const Sunbeam = ({ x, y, width, angle = -30 }: SunbeamProps) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <rect
        x="0"
        y="0"
        width={width}
        height="2"
        fill="url(#sunbeam-gradient)"
        opacity="0.15"
      >
        <animate
          attributeName="opacity"
          values="0.1;0.2;0.15;0.18;0.1"
          dur="8s"
          repeatCount="indefinite"
        />
      </rect>

      <defs>
        <linearGradient id="sunbeam-gradient" x1="0%" x2="100%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="30%" stopColor="#F4CF57" />
          <stop offset="70%" stopColor="#F4CF57" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </g>
  );
};

interface MarketplaceActivityProps {
  x: number;
  y: number;
}

// Subtle movement indicators for marketplace bustle
export const MarketplaceBustle = ({ x, y }: MarketplaceActivityProps) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rising dust/activity indicator */}
      <ellipse cx="0" cy="0" rx="15" ry="8" fill="#8B7355" opacity="0.1">
        <animate
          attributeName="opacity"
          values="0.05;0.15;0.1;0.12;0.05"
          dur="5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="ry"
          values="8;10;9;8"
          dur="4s"
          repeatCount="indefinite"
        />
      </ellipse>
    </g>
  );
};

export default {
  CandelightFlicker,
  ElectricLight,
  SteamPuff,
  WaterFountain,
  FloatingParticles,
  GaslightFlicker,
  Sunbeam,
  MarketplaceBustle,
};
