import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const listSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  cards: z.array(
    z.object({
      title: z.string().min(1, "Digite o nome da tarefa"),
    })
  ),
});

type ListSchema = z.infer<typeof listSchema>;

export function AddListDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<ListSchema>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      title: "",
      description: "",
      cards: [{ title: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards",
  });

  const queryClient = useQueryClient();

  const addList = useMutation({
    mutationKey: ["addList", id],
    mutationFn: async (data: ListSchema) => {
      const column = await api.post("/columns", {
        boardId: id,
        title: data.title,
        description: data.description,
      });

      const columnId = column.data.id;

      if (data.cards && data.cards.length > 0) {
        await Promise.all(
          data.cards.map((card) =>
            api.post("/cards", {
              columnId,
              title: card.title,
              completed: false,
            })
          )
        );
      }
    },
    onSuccess: async () => {
       queryClient.invalidateQueries({ queryKey: ["columns", id] });
      reset();
      setOpen(false);
      toast.success("Lista adicionada com sucesso!");
    },

    onError: (error) => {
      toast.error("Erro ao adicionar lista!");
      console.error("Erro ao adicionar lista:", error);
    },
  });

  const onSubmit = (data: ListSchema) => {
    addList.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="min-w-[300px]"  asChild>
        <Button className="bg-background text-produ-text dark:text-white">
          <Plus className="mr-2 h-4 w-4" /> Adicionar lista
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Lista</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1"
        >
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Título</label>
                <Input {...register("title")} placeholder="Nome da lista" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  {...register("description")}
                  placeholder="Breve descrição da lista"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cartões</label>
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      {...register(`cards.${index}.title` as const)}
                      placeholder={`Tarefa ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ title: "" })}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Tarefa
                </Button>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-produ-secondary text-white">
              Salvar Lista
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
