import { ViewBoardCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { getBoards } from "@/lib/requests";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { PanelsTopLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/boards/")({
  component: BoardComponent,
});

function BoardComponent() {
  const { data: boards, isLoading } = getBoards();
  const router = useRouter();

  const deleteBoard = useMutation({
    mutationKey: ["delete-board"],
    mutationFn: async (id: string) => {
      await api.delete(`/boards/${id}`);
    },

    onSuccess: () => {
      toast.success("Quadro eliminado com sucesso!");
    },

    onError: (error) => {
      console.error("Erro ao eliminar o quadro", error);
      toast.error("Erro ao eliminar o quadro");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <h1 className="text-3xl font-semibold">Quadros</h1>
        )}

        {isLoading ? (
          <Skeleton className="h-8 w-32 rounded-md" />
        ) : (
          <Button
            onClick={() => router.navigate({ to: "/dashboard/boards/create" })}
            className="h-8 rounded-md bg-produ-secondary hover:bg-produ-secondary"
          >
            <Plus />
            Criar quadro
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : boards && boards?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {boards?.map((board) => (
            <ViewBoardCard
              key={board.id}
              onClick={() =>
                router.navigate({ to: `/dashboard/boards/${board.id}` })
              }
              background={board.background}
              title={board.title}
             onDelete={() => deleteBoard.mutate(board.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-gray-200 border dark:bg-transparent w-10 h-10 rounded-md place-items-center place-content-center">
              <PanelsTopLeft className="text-gray-400" />
            </div>
            <div className="w-[35%] text-center">
              <span className="text-sm leading-5 text-gray-400">
                Você ainda não criou nenhum quadro. Dê o primeiro passo e monte
                o seu espaço de produtividade!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
