import { redirect } from "next/navigation";

// Landing on /admin sends you straight to the change-password screen, which
// mirrors the wireframe's default active-tab.
export default function AdminIndex() {
  redirect("/admin/redefinir-senha");
}
