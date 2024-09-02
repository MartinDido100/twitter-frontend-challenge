import React, { useState } from 'react';
import { StyledToastContainer } from './ToastContainer';
import { AlertIcon, SucsessIcon } from '../icon/Icon';

export enum ToastType {
  ALERT = 'ALERT',
  SUCCESS = 'SUCCESS',
}

export interface ToastProps {
  message: string;
  type: ToastType;
  show?: boolean;
}

export const Toast = ({ message, type, show }: ToastProps) => {
  const [isShown, setIsShown] = useState<boolean>(show ?? true);

  const iconMap = {
    [ToastType.ALERT]: <AlertIcon />,
    [ToastType.SUCCESS]: <SucsessIcon />,
  };

  const toastIcon = iconMap[type] || null;

  return (
    <>
      {isShown && (
        <StyledToastContainer type={type} onClick={() => setIsShown(false)}>
          {toastIcon}
          <p>{message}</p>
        </StyledToastContainer>
      )}
    </>
  );
};
