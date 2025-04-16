import React from 'react';

type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: GridCols;
  smCols?: GridCols;
  mdCols?: GridCols;
  lgCols?: GridCols;
  xlCols?: GridCols;
  gap?: GridGap;
  rowGap?: GridGap;
  colGap?: GridGap;
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  cols = 1,
  smCols,
  mdCols,
  lgCols,
  xlCols,
  gap = 'md',
  rowGap,
  colGap,
}) => {
  const getColsClass = (size: GridCols, prefix = '') => {
    if (size === 'none') return '';
    return `${prefix}grid-cols-${size}`;
  };

  const getGapClass = (size: GridGap, prefix = '') => {
    if (size === 'none') return '';
    const gapSizes = {
      xs: '1',
      sm: '2',
      md: '4',
      lg: '6',
      xl: '8',
    };
    return `${prefix}gap-${gapSizes[size]}`;
  };

  const colsClasses = [
    getColsClass(cols),
    smCols ? getColsClass(smCols, 'sm:') : '',
    mdCols ? getColsClass(mdCols, 'md:') : '',
    lgCols ? getColsClass(lgCols, 'lg:') : '',
    xlCols ? getColsClass(xlCols, 'xl:') : '',
  ].filter(Boolean).join(' ');

  // Gap classes
  const gapClass = gap !== 'none' ? getGapClass(gap) : '';
  const rowGapClass = rowGap ? getGapClass(rowGap, 'row-') : '';
  const colGapClass = colGap ? getGapClass(colGap, 'col-') : '';

  return (
    <div className={`grid ${colsClasses} ${gapClass} ${rowGapClass} ${colGapClass} ${className}`}>
      {children}
    </div>
  );
};

export default Grid; 