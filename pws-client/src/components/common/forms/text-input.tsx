/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import clsx from 'clsx';
import Label from './label';
import InputFeedback from './input-feedback';

const srOnly = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
});

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
