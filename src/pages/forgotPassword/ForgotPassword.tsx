import { useState, type SubmitEvent } from "react";
import AuthCard from "../../components/AuthCard";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import {
  forgotPasswordSchema,
  type ForgotPasswordForm,
} from "../../schemas/auth";
import { forgotPassword } from "../../service/authService";
import z from "zod";
import { ApiError } from "../../service/api";
import { Link } from "react-router";

type FieldErrors = Partial<Record<keyof ForgotPasswordForm, string[]>>;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = await forgotPassword(result.data);
      setSuccess(response.message);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(
          error.errors.length > 0 ? error.errors.join(". ") : error.message,
        );
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Esqueceu a senha?"
      subtitle="Informe seu e-mail para receber um código de verificação."
      footerText="Voltar para login?"
      footerLinkText="Retornar"
      footerLink="/login"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-3.5">
        <InputField
          label="Email"
          id="email"
          icon="ph-envelope-simple"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          error={fieldErrors.email?.[0]}
          placeholder="Digite seu e-mail"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-center text-green-700">
            {success}{" "}
            <Link
              to="/reset-password"
              className="font-semibold text-purple-600 hover:text-purple-800 text-center underline"
            >
              <p> Já tenho o código</p>
            </Link>
          </div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar código"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default ForgotPassword;
