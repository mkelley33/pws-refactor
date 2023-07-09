import { srOnly, formControl, formGroup } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';

const TextInput = ({ type, register, id, label, error, onChange, ...props }: any) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id} error={error}>
      {label}
    </Label>
    <input id={id} css={formControl} {...register(id)} type={type} placeholder={label} {...props} />
    <InputFeedback error={error} />
  </div>
);

export default TextInput;
