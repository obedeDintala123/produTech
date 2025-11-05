import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { parseNoteHTML } from "@/lib/utils";
import { useRecentActivityStore } from "@/store/dash-states";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NotepadText, PanelsTopLeft, Plus } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const router = useRouter();
  const {
    recentNotes,
    recentBoards,
    isLoading,
    setLoading,

  } = useRecentActivityStore();

  useEffect(() => {
    let timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  });

  const sections = [
    {
      title: "Quadros",
      icon: PanelsTopLeft,
      data: recentBoards,
      emptyText:
        "Você ainda não criou nenhum quadro. Dê o primeiro passo e monte o seu espaço de produtividade!",
      btnText: "Criar quadro",
      btnOnclick: () => router.navigate({ to: "/dashboard/boards/create" }),
      viewOnclick: () =>
        router.navigate({ to: `/dashboard/boards` }),
    },
    {
      title: "Notas",
      icon: NotepadText,
      data: recentNotes,
      emptyText:
        "Suas ideias merecem um lugar. Crie sua primeira nota e comece a organizá-las!",
      btnText: "Criar nota",
      btnOnclick: () => router.navigate({ to: "/dashboard/notes/create" }),
      viewOnclick: () =>
        router.navigate({ to: `/dashboard/notes` }),
    },
  ];

  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Bem-vindo de volta, User</h1>
        <p className="text-gray-500">
          Aqui está um resumo da sua atividade recente.
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="h-48">
              <CardHeader>
                <Skeleton className="h-6 w-32 rounded-md" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-[90%] rounded-md" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <section className="grid md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <section.icon className="text-gray-400" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {section.data.length === 0 ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-gray-200 border dark:bg-transparent w-10 h-10 rounded-md grid place-items-center">
                      <section.icon className="text-gray-400" />
                    </div>

                    <p className="text-sm text-gray-400 w-[80%]">
                      {section.emptyText}
                    </p>

                    <Button
                      onClick={section.btnOnclick}
                      className="h-8 rounded-md bg-produ-secondary hover:bg-produ-secondary"
                    >
                      <Plus className="mr-1" />
                      {section.btnText}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {section.data.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => section.viewOnclick()}
                        className="p-3 rounded-md border hover:bg-muted cursor-pointer transition"
                      >
                        {item.title && (
                          <h3 className="font-medium truncate">{item.title}</h3>
                        )}

                        {item.htmlText && (
                          <h3 className="font-medium truncate">
                            {parseNoteHTML(item.htmlText).title}
                          </h3>
                        )}

                        {item.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
