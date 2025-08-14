import React from 'react';

// Import your actual SVG files
import SunIcon from '../../assets/icons/sun.svg';
import MoonIcon from '../../assets/icons/moon.svg';
import AddIcon from '../../assets/icons/add.svg';
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg';
import TrashIcon from '../../assets/icons/trash.svg';
import SearchIcon from '../../assets/icons/search.svg';
import BoldIcon from '../../assets/icons/bold.svg';
import ItalicIcon from '../../assets/icons/italic.svg';
import UnderlineIcon from '../../assets/icons/underline.svg';
import StrikethroughIcon from '../../assets/icons/strikethrough.svg';
import CodeIcon from '../../assets/icons/code.svg';
import LinkIcon from '../../assets/icons/link.svg';
import ListIcon from '../../assets/icons/list.svg';
import NumberedListIcon from '../../assets/icons/numbered-list.svg';
import QuoteIcon from '../../assets/icons/quote.svg';
import ColorIcon from '../../assets/icons/color.svg';
import HighlighterIcon from '../../assets/icons/highlighter.svg';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = '#697180' }: IconProps) {
  const iconComponents: Record<string, React.ComponentType<any>> = {
    sun: SunIcon,
    moon: MoonIcon,
    add: AddIcon,
    'arrow-left': ArrowLeftIcon,
    trash: TrashIcon,
    search: SearchIcon,
    bold: BoldIcon,
    italic: ItalicIcon,
    underline: UnderlineIcon,
    strikethrough: StrikethroughIcon,
    code: CodeIcon,
    link: LinkIcon,
    list: ListIcon,
    'numbered-list': NumberedListIcon,
    quote: QuoteIcon,
    color: ColorIcon,
    highlighter: HighlighterIcon,
  };

  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={size} height={size} fill={color} style={{ color }} />;
}
