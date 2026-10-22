import AuthCard from "../../components/AuthCard";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import { useState, type SubmitEvent } from "react";
import {
  resetPasswordSchema,
  type ResetPasswordForm,
} from "../../schemas/auth";
import z from "zod";
import { ApiError } from "../../service/api";
import { resetPassword } from "../../service/authService";
import { useNavigate } from "react-router";

type FieldErrors = Partial<Record<keyof ResetPasswordForm, string[]>>;

function ResetPassword() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const result = resetPasswordSchema.safeParse({
      code,
      new_password: newPassword,
    });
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const response = await resetPassword(result.data);
      setSuccess(response.message);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
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
      title="Criar nova senha"
      subtitle="Digite o código e insira uma nova senha"
      footerText="Não recebeu o código?"
      footerLinkText="Solicitar novamente"
      footerLink="/forgot-password"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 my-3.5"
      >
        <InputField
          label="Código"
          id="code"
          icon="ph-numpad"
          type="text"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          error={fieldErrors.code?.[0]}
          placeholder="Digite o código de verificação"
        />

        <InputField
          label="Nova senha"
          id="password"
          icon="ph-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={fieldErrors.new_password?.[0]}
          placeholder="Digite sua nova senha"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && (
          <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            {success} Redirecionando para o login...
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Redefinindo..." : "Redefinir senha"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default ResetPassword;
