import React from 'react';

type FlexDirection = 'row' | 'row-reverse' | 'col' | 'col-reverse';
type FlexWrap = 'wrap' | 'nowrap' | 'wrap-reverse';
type JustifyContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';
type AlignContent = 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: FlexDirection;
  wrap?: FlexWrap;
  justify?: JustifyContent;
  items?: AlignItems;
  content?: AlignContent;
  gap?: Gap;
  inline?: boolean;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  className = '',
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  items = 'start',
  content,
  gap = 'none',
  inline = false,
}) => {
  const displayClass = inline ? 'inline-flex' : 'flex';
  
  const directionClass = direction ? `flex-${direction}` : '';

  const wrapClasses = {
    wrap: 'flex-wrap',
    nowrap: 'flex-nowrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };
  const wrapClass = wrapClasses[wrap];

  const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };
  const justifyClass = justifyClasses[justify];

  const itemsClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch',
  };
  const itemsClass = itemsClasses[items];

  const contentClasses = content
    ? {
        start: 'content-start',
        end: 'content-end',
        center: 'content-center',
        between: 'content-between',
        around: 'content-around',
        evenly: 'content-evenly',
      }
    : {};
  const contentClass = content ? contentClasses[content] : '';

  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };
  const gapClass = gapClasses[gap];

  return (
    <div
      className={`${displayClass} ${directionClass} ${wrapClass} ${justifyClass} ${itemsClass} ${contentClass} ${gapClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Flex; 