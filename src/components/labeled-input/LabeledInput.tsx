import React, { ChangeEvent, useRef, useState } from 'react';
import { StyledInputContainer } from './InputContainer';
import { StyledInputTitle } from './InputTitle';
import { StyledInputElement } from './StyledInputElement';
import { ErrorSpan } from './ErrorSpan';

interface InputWithLabelProps {
  type?: 'password' | 'text';
  title: string;
  placeholder: string;
  required: boolean;
  id: string;
  error?: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput = ({
  title,
  id,
  placeholder,
  required,
  error,
  value,
  onChange,
  type = 'text',
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleClick = () => {
    if (inputRef.current != null) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {error && <ErrorSpan>{error}</ErrorSpan>}
      <StyledInputContainer className={`${error ? 'error' : ''}`} onClick={handleClick}>
        <StyledInputTitle className={`${focus ? 'active-label' : ''} ${error ? 'error' : ''}`}>
          {title}
        </StyledInputTitle>
        <StyledInputElement
          autoComplete="off"
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          className={error ? 'error' : ''}
          ref={inputRef}
          value={value}
        />
      </StyledInputContainer>
    </>
  );
};

export default LabeledInput;
