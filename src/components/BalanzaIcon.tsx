import React from 'react';
import Svg, { Circle, Path, Line } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function BalanzaIcon({ size = 24, color = '#000000' }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Base */}
      <Line x1="4" y1="22" x2="20" y2="22" />
      {/* Stem */}
      <Line x1="12" y1="22" x2="12" y2="6" />
      {/* Beam */}
      <Line x1="3" y1="6" x2="21" y2="6" />
      {/* Pivot */}
      <Circle cx="12" cy="6" r="1.5" />
      {/* Left string */}
      <Line x1="4" y1="6" x2="4" y2="14" />
      {/* Right string */}
      <Line x1="20" y1="6" x2="20" y2="14" />
      {/* Left pan */}
      <Path d="M2 14 Q4 17 6 14" />
      {/* Right pan */}
      <Path d="M18 14 Q20 17 22 14" />
    </Svg>
  );
}
