import React from 'react';
import clsx from 'clsx';

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
      <Label className="sr-only" htmlFor={id} error={error}>
        {label}
      </Label>
      <textarea id={id} className="form-control" value={value} onChange={onChange} placeholder={label} {...props} />
      <InputFeedback error={error} />
    </div>
  );
};

export default TextArea;
