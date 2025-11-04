import { getCardsOfColumn } from "@/lib/requests";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Edit,
  GripHorizontal,
  MoreHorizontalIcon,
  PenBox,
  Plus,
  Trash,
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useMemo, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const cardSchema = z.object({
  title: z.string().min(1, "O título deve ter pelo menos 1 caracter"),
});

type CardSchema = z.infer<typeof cardSchema>;

export const initialCard = ({ title }: { title: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export const ViewBoardCard = ({
  background,
  title,
  onClick,
  onDelete,
}: {
  background: string;
  title: string;
  onClick?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <Card
      onClick={onClick}
      className="p-0 flex rounded-md overflow-hidden hover:shadow-md transition gap-0 shadow-none cursor-pointer relative"
    >
      <div
        className="w-full h-32 shrink-0"
        style={{
          backgroundImage: background?.startsWith("http")
            ? `url(${background})`
            : "none",
          backgroundColor:
            background && !background.startsWith("http")
              ? background
              : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="px-4 py-2 flex-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {title}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <button className="p-1 rounded-md hover:bg-muted">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={4}>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                console.log("Editar quadro:", title);
              }}
            >
              <Edit />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="text-red-500 focus:text-red-600"
            >
              <Trash className="text-red-500 focus:text-red-600" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export function ColumnWithCards({ column }: { column: any }) {
  const { data: cards, isLoading, refetch } = getCardsOfColumn(column.id);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(column.title);
  const { register, handleSubmit, reset } = useForm<CardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: "",
    },
  });

  const addCard = useMutation({
    mutationKey: ["addCard", column.id],
    mutationFn: async (data: CardSchema) => {
      await api.post("/cards", {
        title: data.title,
        columnId: column.id,
        completed: false,
      });
    },

    onSuccess: () => {
      setOpen(false);
      reset();
      refetch();
      toast.success("Cartão adicionado com sucesso!");
    },

    onError: (error) => {
      toast.error("Erro ao adicionar cartão!");
      console.error("Erro ao adicionar cartão:", error);
    },
  });

  const onSubmit = (data: CardSchema) => {
    addCard.mutate(data);
    reset();
    setOpen(false);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const cardsId = useMemo(() => {
    return cards?.map((card) => card.id);
  }, [cards]);

  if (isDragging) {
    return (
      <div
        className={cn(
          "rounded-lg bg-white/40 dark:bg-[#1F1F21]/40 border-2 border-dashed border-produ-text w-[380px] h-full min-h-[200px] opacity-70"
        )}
      />
    );
  }

  async function handleBlur() {
    setIsEditing(false);

    if (title === column.title) return;

    try {
      setIsSaving(true);
      await api.patch(`/columns/${column.id}`, { title });
      toast.success("Título atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar título!");
      setTitle(column.title);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card
      style={style}
      ref={setNodeRef}
      className="rounded-lg bg-white dark:bg-background h-max transition-transform duration-200 ease-in-out relative
"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab absolute top-2 left-0  place-content-center w-full flex items-center justify-center"
      >
        <GripHorizontal />
      </div>
      <CardHeader className="flex items-center justify-between cursor-grab">
        <CardTitle onClick={() => !isEditing && setIsEditing(true)}>
          {isEditing ? (
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              disabled={isSaving}
              className="p-0 border-0 focus:ring-0 bg-transparent text-base font-semibold"
            />
          ) : (
            <span className="font-semibold cursor-text">{title}</span>
          )}
        </CardTitle>
        <Button className="bg-transparent hover:bg-transparent text-produ-text">
          <MoreHorizontalIcon />
        </Button>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : (
          cards && (
            <SortableContext items={cardsId ?? []}>
              {cards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </SortableContext>
          )
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-produ-secondary text-white mt-2 rounded-md p-2 w-full flex items-center justify-center">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar cartão
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Cartão</DialogTitle>
              <DialogDescription>
                Digite o título ou texto do novo cartão abaixo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  {...register("title")}
                  placeholder="Ex: Fazer compras..."
                  className="mt-1"
                />
              </div>

              <DialogFooter>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="bg-produ-secondary text-white w-full"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export function CardItem({ card }: { card: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [taskCompleted, setTaskCompleted] = useState(card.completed);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    <div className="p-2 bg-gray-100 opacity-40 dark:bg-[#2A2A2A] rounded-md flex items-center justify-between border-2 border-dashed"></div>;
  }

  async function handleBlur() {
    setIsEditing(false);

    if (card.title === card.title) return;

    try {
      setIsSaving(true);
      await api.patch(`/cards/${card.id}`, { title });
      toast.success("Cartão atualizado!");
    } catch (error) {
      toast.error("Erro ao atualizar cartão!");
      setTitle(card.title);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCompletedChange() {
    const newState = !taskCompleted;
    setTaskCompleted(newState);

    try {
      await api.patch(`/cards/${card.id}`, { completed: newState });

      if (newState) {
        toast.success("Tarefa marcada como concluída!");
      } else {
        toast.info("Tarefa marcada como pendente!");
      }
    } catch (error) {
      setTaskCompleted(!newState);
      toast.error("Erro ao marcar o tarefa!");
      console.error("Erro ao atualizar o estado da tarefa:", error);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      key={card.id}
      className="p-2 bg-gray-100 dark:bg-[#2A2A2A] rounded-md flex items-center justify-between relative"
    >
      <Checkbox
        checked={taskCompleted}
        onCheckedChange={handleCompletedChange}
        className={`border border-produ-text ${taskCompleted ? "data-[state=checked]:bg-green-400 data-[state=checked]:border-green-400 dark:data-[state=checked]:bg-green-400 data-[state=checked]:text-white" : ""}`}
      />

      <div {...listeners} {...attributes}>
        <div className="cursor-grab absolute top-0 left-0 w-full h-2"></div>
        {isEditing ? (
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            disabled={isSaving}
            className="p-0 ring-0 border-0 bg-transparent text-base font-semibold"
          />
        ) : (
          <span className="cursor-text">{title}</span>
        )}
      </div>

      <Button
        onClick={() => !isEditing && setIsEditing(true)}
        className="p-0 bg-transparent text-produ-text"
      >
        <PenBox />
      </Button>
    </div>
  );
}
