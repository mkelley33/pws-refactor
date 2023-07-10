import { srOnly, formControl, formGroup, formErrorControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';
import { UseFormRegister } from 'react-hook-form';

interface ITextInput {
  autoComplete?: string;
  id: string;
  errors: IErrors;
  label: string;
  register: UseFormRegister<object>;
  type?: string;
}

const TextInput = ({ autoComplete, id, errors, label, register, type = 'text' }: ITextInput) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id}>
      {label}
    </Label>
    <input
      id={id}
      autoComplete={autoComplete}
      css={[formControl, errors[id]?.message ? formErrorControl : null]}
      {...register(id)}
      type={type}
      placeholder={label}
    />
    <InputFeedback error={errors[id]?.message} />
  </div>
);

export default TextInput;
