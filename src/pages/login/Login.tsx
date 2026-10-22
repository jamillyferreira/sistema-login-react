import { useState, type SubmitEvent } from "react";
import AuthCard from "../../components/AuthCard";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { loginSchema, type LoginForm } from "../../schemas/auth";
import { z } from "zod";
import { ApiError } from "../../service/api";
import { useAuth } from "../../contexts/useAuth";
import { useNavigate, Link } from "react-router";
import { login } from "../../service/authService";

// cria um objeto onde as chaves são os campos do LoginForm (email ou password), cada valor é uma string (mensagem de erro), e todos são opcionais."
// Partial<T> = transforma todas as propriedades de T em opcionais (adiciona ?), vira = { email?: string; password?: string }
// Record<K, V> = é um tipo utilitário do TypeScript que cria um objeto onde, as chaves são do tipo K, os valores são do tipo V
// keyof = é um operador do TypeScript que pega todas as chaves (nomes dos campos) de um tipo ("email" | "password")
type FieldErrors = Partial<Record<keyof LoginForm, string[]>>;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const nagivate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors);
      console.error("Erro de validacoes no form de login");
      return; // invalido, nao chama api
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const data = await login(result.data);
      await signIn(data);
      nagivate("/profile");
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

  return (
    <AuthCard
      title="Login"
      subtitle="Entre com seu e-mail e senha para continuar."
      footerText="Ainda não tem conta?"
      footerLinkText="Cadastre-se"
      footerLink="/register"
    >
      {/* Aqui é children sendo usado */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 my-3.5"
      >
        <InputField
          label="E-mail"
          id="email"
          icon="ph-envelope-simple"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
          placeholder="Digite o seu e-mail"
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
        <Link
          to="/forgot-password"
          className="text-right text-xs text-purple-500 hover:text-purple-700"
        >
          Esqueceu a senha?
        </Link>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default Login;
