import { srOnly, formControl, formGroup, formErrorText, formErrorControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';
import { UseFormRegister } from 'react-hook-form';

interface ITextArea {
  id: string;
  errors: IErrors;
  label: string;
  register: UseFormRegister<any>;
}

const TextArea = ({ id, errors, label, register }: ITextArea) => (
  <div css={formGroup}>
    <Label css={srOnly} htmlFor={id}>
      {label}
    </Label>
    <textarea
      id={id}
      css={[formControl, Object.entries(errors).length ? formErrorControl : null]}
      {...register(id)}
      style={{ height: 168 }}
      placeholder={label}
    />
    <InputFeedback error={errors[id]?.message} />
  </div>
);

export default TextArea;
