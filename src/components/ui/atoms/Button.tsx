import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
        font-size: ${({ theme }) => theme.fontSizes.lg};
      `;
    default:
      return css`
        padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
        font-size: ${({ theme }) => theme.fontSizes.md};
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${({ variant = 'primary', theme }) => {
    const styles = theme.components.button[variant];
    return css`
      background-color: ${styles.bg};
      color: ${styles.color};
      border: ${variant === 'outline' ? `2px solid ${styles.borderColor}` : 'none'};
      
      &:hover {
        background-color: ${styles.hoverBg};
      }
      
      &:active {
        background-color: ${styles.activeBg || styles.hoverBg};
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
  }}
  
  ${({ size = 'md' }) => getSizeStyles(size)}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
`;

export default Button; 