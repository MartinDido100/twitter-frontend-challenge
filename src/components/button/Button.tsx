import React, { MouseEventHandler } from 'react';
import { ButtonType, StyledButton } from './StyledButton';

interface ButtonProps {
  text: string;
  size: string;
  buttonType: ButtonType;
  submit?: boolean;
  onClick?: MouseEventHandler;
  disabled?: boolean;
}
const Button = ({ text, size, buttonType, onClick, disabled, submit }: ButtonProps) => {
  return (
    <StyledButton
      size={size}
      buttonType={disabled ? ButtonType.DISABLED : buttonType}
      disabled={buttonType === 'DISABLED' || (disabled ? disabled : false)}
      onClick={onClick}
      type={submit ? 'submit' : 'button'}
    >
      {text}
    </StyledButton>
  );
};

export default Button;
