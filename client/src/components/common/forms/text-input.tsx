import { formControl, formGroup, formErrorControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';
import React, { ForwardedRef, forwardRef } from 'react';

interface ITextInput {
  autoComplete?: string;
  id: string;
  errors: IErrors;
  label: string;
  type?: string;
}

function InnerTextInput(
  { id, label, autoComplete, errors, type, ...rest }: ITextInput,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <div css={formGroup}>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        autoComplete={autoComplete}
        css={[formControl, errors[id]?.message ? formErrorControl : null]}
        type={type}
        placeholder={label}
        ref={ref}
        {...rest}
      />
      <InputFeedback error={errors[id]?.message} />
    </div>
  );
}

const TextInput = forwardRef(InnerTextInput);

export default TextInput;
