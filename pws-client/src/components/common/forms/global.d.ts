declare global {
  interface ITextField {
    // Only inputs have types
    autoComplete: string;
    error: string;
    id: string;
    label: string;
    onChange: ChangeEventHandler<HTMLInputElement> | ChangeEventHandler<HTMLTextAreaElement>;
    onBlur: BlurEventHandler<HTMLInputElement> | BlurEventHandler<HTMLTextAreaElement>;
    type?: string;
    value: string;
    props: any;
  }
}
