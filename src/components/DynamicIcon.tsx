import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';
import * as HiIcons from 'react-icons/hi';
import * as IoIcons from 'react-icons/io5';
import type { IconBaseProps } from 'react-icons';

interface DynamicIconProps extends IconBaseProps {
  iconName: string;
}

type IconLibrary = Record<string, React.ComponentType<IconBaseProps>>;

export const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, ...props }) => {
  let IconComponent: React.ComponentType<IconBaseProps> | null = null;

  // Determine which icon library to use based on prefix
  if (iconName.startsWith('Fa')) {
    IconComponent = (FaIcons as IconLibrary)[iconName];
  } else if (iconName.startsWith('Md')) {
    IconComponent = (MdIcons as IconLibrary)[iconName];
  } else if (iconName.startsWith('Ai')) {
    IconComponent = (AiIcons as IconLibrary)[iconName];
  } else if (iconName.startsWith('Bs')) {
    IconComponent = (BsIcons as IconLibrary)[iconName];
  } else if (iconName.startsWith('Hi')) {
    IconComponent = (HiIcons as IconLibrary)[iconName];
  } else if (iconName.startsWith('Io')) {
    IconComponent = (IoIcons as IconLibrary)[iconName];
  }

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};
