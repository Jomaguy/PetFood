import styled from 'styled-components';

interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
}

export const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.components.card.bg};
  border: ${({ theme }) => theme.borders.thin} ${({ theme }) => theme.components.card.borderColor};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme, padding = 'md' }) => theme.space[padding]};
  box-shadow: ${({ theme, elevated }) => elevated ? theme.shadows.md : theme.components.card.shadow};
  transition: box-shadow 0.2s ease-in-out;
  
  &:hover {
    ${({ elevated }) => elevated && `
      box-shadow: ${({ theme }) => theme.shadows.lg};
    `}
  }
`; 