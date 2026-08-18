import { redirect } from "next/navigation";

/** O painel administrativo agora começa nas finanças. */
export default function AdminPage() {
  redirect("/financas");
}
