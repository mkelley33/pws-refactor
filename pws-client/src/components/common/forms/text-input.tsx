import React from 'react';
import clsx from 'clsx';

import Label from './label';
import InputFeedback from './input-feedback';

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
      <Label className="sr-only" htmlFor={id} error={error}>
        {label}
      </Label>
      <input
        id={id}
        className="form-control"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        {...props}
      />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextInput;
