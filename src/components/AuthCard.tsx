import type { ComponentProps } from "react";
import { Link } from "react-router";

type AuthCardProps = ComponentProps<"div"> & {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLink: string;
  children: React.ReactNode;
};

function AuthCard({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLink,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="w-full max-w-lg border border-s border-gray-300 p-6 rounded-sm shadow-sm">
        <h1 className="text-xl text-gray-950 font-semibold">{title}</h1>
        <p className="text-base text-gray-600">{subtitle}</p>

        {/* Aqui o children será renderizado, formulário vai ser colocado aqui */}
        {children}

        {footerText && footerLink && (
          <p className="text-xs text-gray-600 flex gap-1 items-center justify-center">
            {footerText}
            <Link
              to={footerLink}
              className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer transition-colors"
            >
              {footerLinkText}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}

export default AuthCard;
