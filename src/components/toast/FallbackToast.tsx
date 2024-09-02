import React, { createContext } from 'react';
import { Toast, ToastType, ToastProps } from './Toast';

type ToastCtxType = {
  FallbackToast: ({ error }: { error: Error }) => JSX.Element;
  Toast: ({ message, type, show }: ToastProps) => JSX.Element;
};

export const ToastContext = createContext<ToastCtxType | null>(null);

export const FallbackToast = ({ error }: { error: Error }) => {
  return <Toast type={ToastType.ALERT} message={error.message} />;
};
