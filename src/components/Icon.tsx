import React from 'react';

// Import your actual SVG files from rounded folder
import SunIcon from '../../assets/icons/rounded/Frame-4.svg';
import MoonIcon from '../../assets/icons/rounded/Frame-3.svg';
import AddIcon from '../../assets/icons/rounded/Frame.svg';
import ArrowLeftIcon from '../../assets/icons/rounded/arrow-left.svg';
import TrashIcon from '../../assets/icons/rounded/Frame-1.svg';
import CloseIcon from '../../assets/icons/rounded/Frame-2.svg';
import SearchIcon from '../../assets/icons/rounded/search.svg';
import BoldIcon from '../../assets/icons/rounded/bold.svg';
import ItalicIcon from '../../assets/icons/rounded/italic.svg';
import UnderlineIcon from '../../assets/icons/rounded/underline.svg';
import StrikethroughIcon from '../../assets/icons/rounded/strikethrough.svg';
import CodeIcon from '../../assets/icons/rounded/code.svg';
import LinkIcon from '../../assets/icons/rounded/link.svg';
import ListIcon from '../../assets/icons/rounded/list.svg';
import NumberedListIcon from '../../assets/icons/rounded/numbered-list.svg';
import QuoteIcon from '../../assets/icons/rounded/quote.svg';
import ColorIcon from '../../assets/icons/rounded/Frame-5.svg';
import HighlighterIcon from '../../assets/icons/rounded/highlighter.svg';
import EditIcon from '../../assets/icons/rounded/edit.svg';
import IndentLeftIcon from '../../assets/icons/rounded/indent-left.svg';
import IndentRightIcon from '../../assets/icons/rounded/indent-right.svg';
import PandaIcon from '../../assets/icons/rounded/panda.svg';
import IconDarkSvg from '../../assets/app-icons/in-app/icon-dark.svg';
import IconLightSvg from '../../assets/app-icons/in-app/icon-light.svg';

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
    close: CloseIcon,
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
    edit: EditIcon,
    'indent-left': IndentLeftIcon,
    'indent-right': IndentRightIcon,
    panda: PandaIcon,
    cat: PandaIcon, // Legacy support - map cat to panda
    'icon-dark': IconDarkSvg,
    'icon-light': IconLightSvg,
  };

  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={size} height={size} style={{ color }} />;
}
