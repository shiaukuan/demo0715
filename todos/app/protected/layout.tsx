import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center" style={{
      background: 'linear-gradient(135deg, #C41E3A 0%, #8B1538 50%, #FF4444 100%)',
      backgroundAttachment: 'fixed',
    }}>
      <div className="flex-1 w-full flex flex-col gap-8 items-center">
        <nav className="w-full flex justify-center border-b-4 border-black h-20" style={{
          background: 'linear-gradient(45deg, #000 0%, #1a1a1a 100%)',
        }}>
          <div className="w-full max-w-5xl flex justify-between items-center p-4 px-8 text-sm">
            <div className="flex gap-5 items-center font-bold">
              <Link href={"/"} className="text-white font-bold text-xl uppercase tracking-wide hover:text-red-400 transition-colors" style={{fontFamily: "'Nosifer', cursive"}}>
                PUNK TODO
              </Link>
              <div className="flex items-center gap-2">
                <DeployButton />
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
              <ThemeSwitcher />
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col gap-8 max-w-5xl p-5 w-full">
          {children}
        </div>

        <footer className="w-full flex items-center justify-center border-t-4 border-black mx-auto text-center text-xs gap-8 py-8" style={{
          background: 'linear-gradient(45deg, #000 0%, #1a1a1a 100%)',
        }}>
          <p className="text-white font-bold uppercase tracking-wide" style={{fontFamily: "'Barrio', cursive"}}>
            POWERED BY{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold text-red-400 hover:text-red-300 transition-colors"
              rel="noreferrer"
            >
              SUPABASE
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
