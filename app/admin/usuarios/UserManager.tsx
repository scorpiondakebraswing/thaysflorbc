"use client";

import { useState, useTransition } from "react";
import { KeyRound, UserPlus, Check, X } from "lucide-react";
import {
  criarUsuario,
  alternarAtivacao,
  redefinirSenhaUsuario,
} from "./actions";

export type AdminUser = {
  id: string;
  username: string | null;
  full_name: string | null;
  is_active: boolean;
};

export default function UserManager({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // Novo usuário
  const [criando, setCriando] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  // Redefinição de senha
  const [redefinindo, setRedefinindo] = useState<string | null>(null);
  const [novaSenha, setNovaSenha] = useState("");

  function limparMensagens() {
    setErro(null);
    setAviso(null);
  }

  function handleCriar() {
    limparMensagens();
    startTransition(async () => {
      const r = await criarUsuario({ username, fullName, password });
      if (r.error) {
        setErro(r.error);
      } else {
        setAviso(`Acesso criado para "${username}".`);
        setUsername("");
        setFullName("");
        setPassword("");
        setCriando(false);
      }
    });
  }

  function handleAlternar(id: string, ativar: boolean) {
    limparMensagens();
    startTransition(async () => {
      const r = await alternarAtivacao(id, ativar);
      if (r.error) setErro(r.error);
      else setAviso(ativar ? "Acesso reativado." : "Acesso desativado.");
    });
  }

  function handleRedefinir(id: string) {
    limparMensagens();
    startTransition(async () => {
      const r = await redefinirSenhaUsuario(id, novaSenha);
      if (r.error) {
        setErro(r.error);
      } else {
        setAviso("Senha redefinida. Informe a nova senha à pessoa.");
        setRedefinindo(null);
        setNovaSenha("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {erro}
        </p>
      )}
      {aviso && (
        <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-700">
          {aviso}
        </p>
      )}

      {/* Criar novo acesso */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg text-wine-900">Novo acesso</h2>
            <p className="mt-1 font-sans text-sm text-ink-soft">
              Todo acesso criado aqui tem permissão de administrador.
            </p>
          </div>
          {!criando && (
            <button
              type="button"
              onClick={() => {
                setCriando(true);
                limparMensagens();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-wine-700 px-5 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800"
            >
              <UserPlus size={16} />
              Criar acesso
            </button>
          )}
        </div>

        {criando && (
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: thays"
                autoCapitalize="none"
                spellCheck={false}
                className="w-40 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>
            <div className="min-w-[180px] flex-1">
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Nome completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome da pessoa"
                className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>
            <div>
              <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                Senha provisória
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mínimo 8 caracteres"
                className="w-48 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              />
            </div>
            <button
              type="button"
              onClick={handleCriar}
              disabled={isPending}
              className="rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => {
                setCriando(false);
                limparMensagens();
              }}
              className="rounded-full border border-stone-200 px-5 py-2.5 font-sans text-sm font-medium text-ink-soft hover:bg-stone-100"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Lista de acessos */}
      <div className="rounded-[1.5rem] border border-stone-200 bg-white/60 p-6">
        <h2 className="font-display text-lg text-wine-900">
          Acessos cadastrados
        </h2>

        <div className="mt-5 flex flex-col gap-3">
          {users.length === 0 && (
            <p className="font-sans text-sm text-ink-soft">
              Nenhum acesso cadastrado ainda.
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-2xl border border-stone-200 px-5 py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="flex flex-wrap items-center gap-2.5 font-sans text-[15px] font-semibold text-ink">
                    {u.username || "sem usuário"}
                    {u.id === currentUserId && (
                      <span className="rounded-full bg-wine-100 px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide text-wine-700">
                        Você
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-wide ${
                        u.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-stone-200 text-ink-soft"
                      }`}
                    >
                      {u.is_active ? <Check size={11} /> : <X size={11} />}
                      {u.is_active ? "Ativo" : "Desativado"}
                    </span>
                  </p>
                  <p className="mt-1 font-sans text-sm text-ink-soft">
                    {u.full_name || "Nome não informado"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRedefinindo(redefinindo === u.id ? null : u.id);
                      setNovaSenha("");
                      limparMensagens();
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-wine-700/25 px-4 py-2 font-sans text-xs font-semibold text-wine-800 hover:bg-wine-100"
                  >
                    <KeyRound size={13} />
                    Redefinir senha
                  </button>

                  {u.id !== currentUserId && (
                    <button
                      type="button"
                      onClick={() => handleAlternar(u.id, !u.is_active)}
                      disabled={isPending}
                      className={`rounded-full px-4 py-2 font-sans text-xs font-semibold disabled:opacity-60 ${
                        u.is_active
                          ? "border border-stone-200 text-ink-soft hover:bg-stone-100"
                          : "bg-wine-700 text-cream hover:bg-wine-800"
                      }`}
                    >
                      {u.is_active ? "Desativar" : "Reativar"}
                    </button>
                  )}
                </div>
              </div>

              {redefinindo === u.id && (
                <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-stone-200 pt-4">
                  <div>
                    <label className="mb-1.5 block font-sans text-xs font-medium text-ink">
                      Nova senha
                    </label>
                    <input
                      type="text"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                      placeholder="mínimo 8 caracteres"
                      className="w-56 rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRedefinir(u.id)}
                    disabled={isPending}
                    className="rounded-full bg-wine-700 px-6 py-2.5 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
                  >
                    Confirmar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
