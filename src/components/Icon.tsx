import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = '#000' }: IconProps) {
  const iconComponents: Record<string, JSX.Element> = {
    // Theme icons
    sun: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2"/>
        <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="2"/>
        <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="2"/>
        <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="2"/>
        <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="2"/>
        <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="2"/>
        <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="2"/>
        <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="2"/>
        <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="2"/>
      </Svg>
    ),
    
    moon: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    // Navigation icons
    'arrow-left': (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="2"/>
        <Polyline points="12,19 5,12 12,5" stroke={color} strokeWidth="2" fill="none"/>
      </Svg>
    ),

    add: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2"/>
        <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    trash: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Polyline points="3,6 5,6 21,6" stroke={color} strokeWidth="2"/>
        <Path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    search: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
        <Path d="m21 21-4.35-4.35" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    // Editor formatting icons
    bold: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke={color} strokeWidth="2"/>
        <Path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    italic: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line x1="19" y1="4" x2="10" y2="4" stroke={color} strokeWidth="2"/>
        <Line x1="14" y1="20" x2="5" y2="20" stroke={color} strokeWidth="2"/>
        <Line x1="15" y1="4" x2="9" y2="20" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    underline: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" stroke={color} strokeWidth="2"/>
        <Line x1="4" y1="21" x2="20" y2="21" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    strikethrough: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M16 4H9a3 3 0 0 0-2.83 4" stroke={color} strokeWidth="2"/>
        <Path d="M14 12a4 4 0 0 1 0 8H6" stroke={color} strokeWidth="2"/>
        <Line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    code: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Polyline points="16,18 22,12 16,6" stroke={color} strokeWidth="2" fill="none"/>
        <Polyline points="8,6 2,12 8,18" stroke={color} strokeWidth="2" fill="none"/>
      </Svg>
    ),

    link: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke={color} strokeWidth="2"/>
        <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    list: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line x1="8" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2"/>
        <Line x1="8" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2"/>
        <Line x1="8" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2"/>
        <Line x1="3" y1="6" x2="3.01" y2="6" stroke={color} strokeWidth="2"/>
        <Line x1="3" y1="12" x2="3.01" y2="12" stroke={color} strokeWidth="2"/>
        <Line x1="3" y1="18" x2="3.01" y2="18" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    'numbered-list': (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Line x1="10" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2"/>
        <Line x1="10" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2"/>
        <Line x1="10" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2"/>
        <Path d="M4 6h1v4" stroke={color} strokeWidth="2"/>
        <Path d="M4 10h2" stroke={color} strokeWidth="2"/>
        <Path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    quote: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" stroke={color} strokeWidth="2"/>
        <Path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    color: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="13.5" cy="6.5" r=".5" stroke={color} strokeWidth="2"/>
        <Circle cx="17.5" cy="10.5" r=".5" stroke={color} strokeWidth="2"/>
        <Circle cx="8.5" cy="7.5" r=".5" stroke={color} strokeWidth="2"/>
        <Circle cx="6.5" cy="12.5" r=".5" stroke={color} strokeWidth="2"/>
        <Path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke={color} strokeWidth="2"/>
      </Svg>
    ),

    highlighter: (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M9 11H4a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h5m0-7v7m0-7l7-7 3 3-7 7m0 0v4a2 2 0 0 1-2 2H9" stroke={color} strokeWidth="2"/>
      </Svg>
    ),
  };

  return iconComponents[name] || null;
}
