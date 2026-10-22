import { useState, type SubmitEvent } from "react";
import AuthCard from "../../components/AuthCard";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { register } from "../../service/authService";
import { ApiError } from "../../service/api";
import { registerSchema, type RegisterForm } from "../../schemas/auth";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/useAuth";
import z from "zod";

type FieldErrors = Partial<Record<keyof RegisterForm, string[]>>;

function Register() {
  // Guarda os estados dos inptus, todos começam vazio
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Estado da validacao do zod
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const dataValid = validateForm();
    if (!dataValid) return;
    setLoading(true);

    try {
      const authResponse = await register(dataValid);
      await signIn(authResponse);
      navigate("/profile", { replace: true });
      console.log(dataValid);
      
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.errors.length > 0 ? err.errors.join(". ") : err.message);
      } else {
        setError("Erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  function validateForm() {
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      return null; // invalido, nao chama api
    }
    setFieldErrors({}); // dados validos: limpos os erros antigos
    return result.data; // retorna dados validos
  }

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Preencha os campos abaixo para criar sua conta."
      footerText="Já tem conta?"
      footerLinkText="Entrar"
      footerLink="/login"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 my-3.5"
      >
        <InputField
          label="Nome"
          id="name"
          icon="ph-user"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name?.[0]}
          placeholder="Digite seu nome completo"
        />
        <InputField
          label="Email"
          id="email"
          icon="ph-envelope-simple"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
          placeholder="Digite seu e-mail"
        />
        <InputField
          label="Senha"
          id="password"
          icon="ph-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
          placeholder="Digite sua senha"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default Register;
