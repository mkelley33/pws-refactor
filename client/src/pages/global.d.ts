interface IWindow extends Window {
  onSubmit?: (token: string) => void;
  onExpired?: () => void;
}

interface IRecaptcha {
  error: string;
}

interface IRecaptchaMessage {
  recaptcha: { message: string };
}
