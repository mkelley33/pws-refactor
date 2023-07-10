import React, { ChangeEvent, ReactElement } from 'react';

interface CheckboxGroup {
  id: string;
  className?: string;
  children: ReactElement;
  onChange: (id: string, valueArray: string[]) => void;
  value: string[];
}

const CheckboxGroup = (props: CheckboxGroup) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget;
    const valueArray = [...props.value] || [];
    if (target.checked) {
      valueArray.push(target.value);
    } else {
      valueArray.splice(valueArray.indexOf(target.value), 1);
    }
    props.onChange(props.id, valueArray);
  };

  const { value, className, children } = props;
  return (
    <div className={className}>
      {React.Children.map(children, (child: ReactElement) => {
        return React.cloneElement(child, {
          field: {
            value: value.includes(child.props.id),
            onChange: handleChange,
          },
        });
      })}
    </div>
  );
};

export default CheckboxGroup;
