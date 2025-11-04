import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getNotes } from "@/lib/requests";
import { parseNoteHTML } from "@/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Edit,
  ImageIcon,
  NotepadText,
  NotepadTextIcon,
  Plus,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import type { NoteType } from "@/lib/types";
import { EditTipTap } from "@/components/edit-tiptap";

export const Route = createFileRoute("/dashboard/notes/")({
  component: NoteComponent,
});

function NoteComponent() {
  const router = useRouter();
  const { data: notes, isLoading: isNoteLoading, refetch } = getNotes();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);

  const openEdit = (note: NoteType) => {
    setSelectedNote(note);
    setOpenEditModal(true);
  };

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notes/${id}`);
    },

    onSuccess: () => {
      refetch();
      toast.success("Nota eliminada com sucesso!");
    },

    onError: (error) => {
      toast.error("Erro ao eliminar nota");
      console.error("Erro ao eliminar nota", error);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isNoteLoading ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <h1 className="text-3xl font-semibold">Notas</h1>
        )}

        {isNoteLoading ? (
          <Skeleton className="h-8 w-32 rounded-md" />
        ) : (
          <Button
            onClick={() => router.navigate({ to: "/dashboard/notes/create" })}
            className="h-8 rounded-md bg-produ-secondary hover:bg-produ-secondary"
          >
            <Plus />
            Criar nota
          </Button>
        )}
      </div>

      {isNoteLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : notes && notes?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notes?.map((note) => {
            const { title, preview, hasImage, hasList } = parseNoteHTML(
              note.htmlText
            );

            return (
              <Card
                key={note.id}
                className="cursor-pointer shadow-none border"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(note);
                }}
              >
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>{title}</CardTitle>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className="p-1 rounded-md hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" sideOffset={4}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(note);
                        }}
                      >
                        <Edit />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote.mutate(note.id);
                        }}
                        className="text-red-500 focus:text-red-600"
                      >
                        <Trash className="text-red-500 focus:text-red-600" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {preview}
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center justify-between mt-2 text-gray-400 text-xs">
                    {hasImage && (
                      <div className="flex items-center gap-2">
                        <ImageIcon />
                        <span>Imagem</span>
                      </div>
                    )}
                    {hasList && (
                      <div className="flex items-center gap-2">
                        <NotepadTextIcon />
                        <span>Lista</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}

          {openEditModal && selectedNote && (
            <EditTipTap
              noteId={selectedNote.id}
              initialContent={selectedNote.htmlText}
              onClose={() => setOpenEditModal(false)}
            />
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-4 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-gray-200 border dark:bg-transparent w-10 h-10 rounded-md place-items-center place-content-center">
              <NotepadText className="text-gray-400" />
            </div>

            <div className="w-[35%] text-center">
              <span className="text-sm leading-5 text-gray-400">
                Suas ideias merecem um lugar. Crie sua primeira nota e comece a
                organizá-las!
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
