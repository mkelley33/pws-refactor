import React, { ReactElement } from 'react';

const CheckboxGroup = (props: any): JSX.Element => {
  const handleChange = (event: any) => {
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
