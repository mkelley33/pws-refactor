import { srOnly, formControl, formGroup } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const TextInput = ({ type, id, label, error, value, onChange, ...props }: ITextField) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id} error={error}>
      {label}
    </Label>
    <input
      id={id}
      css={formControl}
      type={type}
      value={value}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      placeholder={label}
      {...props}
    />
    <InputFeedback error={error} />
  </div>
);

export default TextInput;
