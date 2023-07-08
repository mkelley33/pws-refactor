import { css } from '@emotion/react';
import clsx from 'clsx';
import { srOnly } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const textInput = css({
  border: '1px solid #ccc',
  borderRadius: '5px',
  color: '#222',
});

// TODO: create ITextInput interface instead of using any
const TextInput = ({ type, id, label, error, value, onChange, className, ...props }: any) => {
  const classes = clsx(
    'form-group',
    {
      'animated shake error': !!error,
    },
    className,
  );
  return (
    <div className={classes}>
      <Label css={srOnly} htmlFor={id} error={error}>
        {label}
      </Label>
      <input id={id} css={textInput} type={type} value={value} onChange={onChange} placeholder={label} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextInput;
