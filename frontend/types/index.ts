export type AuthFormType = {
  [key: string]: string;
};

export type ResetPasswordFormType = {
  otp: string;
  password: string;
  confirmPassword: string;
};
