import type { Dispatch, SetStateAction, ComponentType } from 'react';
import type { ChipProps } from '@mui/material/Chip';

export type NavItemType = MenuItem | MenuGroup | MenuCollapse;

export interface BaseItem {
  id: string;
  title?: string;
  caption?: string;
  icon?: ComponentType<any>;
  type: 'item' | 'group' | 'collapse';
  url?: string;
  link?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  disabled?: boolean;
  chip?: {
    label: string;
    color?: ChipProps['color'];
    variant?: ChipProps['variant'];
    size?: ChipProps['size'];
    avatar?: string;
  };
}

export interface MenuItem extends BaseItem {
  type: 'item';
}

export interface MenuGroup extends BaseItem {
  type: 'group';
  children?: NavItemType[];
}

export interface MenuCollapse extends BaseItem {
  type: 'collapse';
  children?: NavItemType[];
}

export type SetString = Dispatch<SetStateAction<string | null>>;
export type SetBoolean = Dispatch<SetStateAction<boolean>>;
export type SetHTMLElement = Dispatch<SetStateAction<HTMLElement | null>>;

export interface RemainingMenuItem extends Partial<Omit<BaseItem, 'id'>> {
  id: string;
  elements?: NavItemType[];
}
