import { css } from '@emotion/react';
import clsx from 'clsx';
import { srOnly, formControl, formGroup } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

// TODO: create ITextInput interface instead of using any
const TextInput = ({ type, id, label, error, value, onChange, ...props }: any) => {
  return (
    <div css={formGroup}>
      <Label css={srOnly} htmlFor={id} error={error}>
        {label}
      </Label>
      <input id={id} css={formControl} type={type} value={value} onChange={onChange} placeholder={label} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextInput;
