import React from 'react';
import styled from 'styled-components';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
  fullWidth?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Input = styled.input<InputProps>`
  background-color: ${({ theme }) => theme.components.input.bg};
  border: ${({ theme }) => theme.borders.thin} ${({ theme, error }) => 
    error ? theme.colors.error : theme.components.input.borderColor};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.components.input.placeholderColor};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.components.input.focusBorderColor};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryGreenLight}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export default Input; 