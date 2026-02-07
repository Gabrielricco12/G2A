import { redirect } from "next/navigation";

export default function Home() {
  // Assim que o usuário entrar em "g2-2jvcpng0p...", ele é jogado para o dashboard
  redirect("/dashboard");
}
