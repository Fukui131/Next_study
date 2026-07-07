import { redirect } from "next/navigation";

export const metadata = {
  title: 'Next.js研究',
  description: 'Next.js の CSR と SSR の比較を試すホームページです。',
};

export default function Home() {
  redirect("/tasks-ssr");
}