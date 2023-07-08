import React from 'react';

// TODO: replace any with a better interface
const Label = ({ className, children, ...props }: any) => {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
};

export default Label;
