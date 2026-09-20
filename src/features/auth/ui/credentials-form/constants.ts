export const AUTH_FORM_CONTENT = {
  login: {
    submitLabel: "로그인",
    linkPrefix: "계정이 없으신가요? ",
    linkLabel: "회원가입",
    linkTo: "/register",
    passwordAutoComplete: "current-password",
  },
  register: {
    submitLabel: "회원가입",
    linkPrefix: "이미 계정이 있으신가요? ",
    linkLabel: "로그인",
    linkTo: "/login",
    passwordAutoComplete: "new-password",
  },
} as const;

export const EMAIL_AUTO_COMPLETE = "email";
