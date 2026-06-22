import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function CowIcon({ size = 24, color = '#000000' }: Props) {
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
      {/* Head */}
      <Circle cx="12" cy="12" r="7" />
      {/* Left ear */}
      <Ellipse cx="4" cy="9.5" rx="2" ry="2.5" transform="rotate(-20 4 9.5)" />
      {/* Right ear */}
      <Ellipse cx="20" cy="9.5" rx="2" ry="2.5" transform="rotate(20 20 9.5)" />
      {/* Left horn */}
      <Path d="M8 6 Q6.5 3 4.5 4" />
      {/* Right horn */}
      <Path d="M16 6 Q17.5 3 19.5 4" />
      {/* Muzzle */}
      <Ellipse cx="12" cy="15" rx="3.5" ry="2.2" />
      {/* Nostrils */}
      <Circle cx="10.5" cy="15" r="0.6" fill={color} stroke="none" />
      <Circle cx="13.5" cy="15" r="0.6" fill={color} stroke="none" />
    </Svg>
  );
}
