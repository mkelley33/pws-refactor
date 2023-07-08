import React from 'react';
import clsx from 'clsx';
import { srOnly, formControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const TextArea = ({ label, className, id, error, value, onChange, ...props }: any) => {
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
      <textarea id={id} css={formControl} value={value} onChange={onChange} placeholder={label} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextArea;
