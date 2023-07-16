import React from 'react';

interface ICheckboxProps {
  field: {
    name: string;
    onChange: () => void;
  };
  id: string;
  label: string;
  className: string;
  value: string;
  defaultChecked: boolean;
}

const Checkbox = ({ field: { name, onChange }, id, label, className, ...props }: ICheckboxProps) => {
  return (
    <div className={className}>
      <input
        name={name}
        id={id}
        type="checkbox"
        value={props.value}
        onChange={onChange}
        defaultChecked={props.defaultChecked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default Checkbox;
