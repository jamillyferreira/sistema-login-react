import z from "zod";

// Campos reutilizáveis
const nameField = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório.")
  .min(3, "O nome deve ter pelo menos 3 caracteres.");

const emailField = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório.")
  .pipe(z.email("Informe um e-mail válido."));

// senha do campo de criar conta/resetar senha
const newPasswordField = z
  .string()
  .min(1, "Senha é obrigatória.")
  .min(6, "A senha deve ter no mínimo 6 caracteres.");

export const registerSchema = z.object({
  name: nameField,
  email: emailField,
  password: newPasswordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Senha é obrigatória."),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Informe o código recebido no e-mail")
    .length(6, "O código deve ter 6 caracteres"),
  new_password: newPasswordField,
});

export type RegisterForm = z.infer<typeof registerSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
