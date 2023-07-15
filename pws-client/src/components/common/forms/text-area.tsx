import { formControl, formGroup, formErrorControl } from '@components/common-css';
import Label from './label';
import InputFeedback from './input-feedback';
import { UseFormRegister } from 'react-hook-form';

interface ITextArea {
  id: string;
  errors: IErrors;
  label: string;
  register: UseFormRegister<object>;
}

const TextArea = ({ id, errors, label, register }: ITextArea) => (
  <div css={formGroup}>
    <Label htmlFor={id}>{label}</Label>
    <textarea
      id={id}
      css={[formControl, errors[id]?.message ? formErrorControl : null]}
      {...register(id)}
      style={{ height: 168 }}
      placeholder={label}
    />
    <InputFeedback error={errors[id]?.message} />
  </div>
);

export default TextArea;
