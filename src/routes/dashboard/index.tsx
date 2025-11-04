import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NotepadText, PanelsTopLeft, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const router = useRouter();
  return (
    <main className="space-y-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Bem-vindo de volta, User</h1>
        <span>Aqui está um resumo da sua atividade recente.</span>
      </div>

      <section className="grid md:grid-cols-2 gap-4">
        {[
          {
            title: "Quadros",
            icon: PanelsTopLeft,
            text:
              " Você ainda não criou nenhum quadro. Dê o primeiro passo e " +
              "monte o seu espaço de produtividade!",
            btnText: "Criar quadro",
            btnOnclick: () => router.navigate({ to: "/dashboard/boards/create" }),
          },
          {
            title: "Notas",
            icon: NotepadText,
            text: "Suas ideias merecem um lugar. Crie sua primeira nota e comece a organizá-las!",
            btnText: "Criar nota",
            btnOnclick: () => router.navigate({ to: "/dashboard/notes/create" }),
          },
        ].map((item) => (
          <Card>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 place-items-center place-content-center">
              <div className="bg-gray-200 border dark:bg-transparent  w-10 h-10 rounded-md place-items-center place-content-center">
                <item.icon className="text-gray-400" />
              </div>

              <div className="w-[80%] text-center">
                <span className="text-sm leading-5 text-gray-400">
                  {item.text}
                </span>
              </div>

              <div>
                <Button onClick={item.btnOnclick} className="h-8 rounded-md bg-produ-secondary hover:bg-produ-secondary">
                  <Plus />
                  {item.btnText}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
