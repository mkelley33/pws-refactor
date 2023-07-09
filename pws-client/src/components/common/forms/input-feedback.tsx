import { formErrorText } from '@components/common-css';
const InputFeedback = ({ error }: { error: string }) => (error ? <div css={formErrorText}>{error}</div> : null);

export default InputFeedback;
