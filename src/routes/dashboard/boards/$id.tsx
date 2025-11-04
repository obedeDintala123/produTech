import { AddListDialog } from "@/components/add-list";
import { CardItem, ColumnWithCards } from "@/components/cards";
import { Loading } from "@/components/loading";
import { ShareBoardDialog } from "@/components/share-board";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getBoardById,
  getCardsOfColumn,
  getColumnsOfBoard,
} from "@/lib/requests";

import { useParams, useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Globe, Lock, Users2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type CardType, type ColumnType } from "@/lib/types";

export const Route = createFileRoute("/dashboard/boards/$id")({
  component: BoardDetailsComponent,
});

function BoardDetailsComponent() {
  const { id } = useParams({ from: Route.id });
  const router = useRouter();
  const { data: board, isLoading: isBoardLoading } = getBoardById(id);
  const { data: columns, isLoading: isColumnsLoading } = getColumnsOfBoard(id);
  const { data: cards } = getCardsOfColumn();

  const [orderedColumns, setOrderedColumns] = useState<any[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [orderedCards, setOrderedCards] = useState<any[]>([]);

  useEffect(() => {
    if (columns) setOrderedColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (cards) setOrderedCards(cards);
  }, [cards]);

  const columnsId = useMemo(
    () => columns?.map((column) => column.id) ?? [],
    [columns]
  );

  if (isBoardLoading) return <Loading />;

  function onDragStart(event: DragStartEvent) {
    const type = event.active.data.current?.type;

    if (type === "Column") {
      setActiveColumn(event.active.data.current?.column);
    } else {
      setActiveColumn(null);
    }

    if (type === "Card") {
      setActiveCard(event.active.data.current?.card);
    } else {
      setActiveCard(null);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveColumn(null);
    setActiveCard(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "Column" && overType === "Column") {
      const activeColumnId = active.id;
      const overColumnId = over.id;
      if (activeColumnId === overColumnId) return;

      setOrderedColumns((columns) => {
        const activeIndex = columns.findIndex((c) => c.id === activeColumnId);
        const overIndex = columns.findIndex((c) => c.id === overColumnId);
        return arrayMove(columns, activeIndex, overIndex);
      });
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === "Card";
    const isOverCard = over.data.current?.type === "Card";

    if (isActiveCard && isOverCard) {
      setOrderedCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === active.id);
        const overIndex = cards.findIndex((t) => t.id === over.id);

        return arrayMove(cards, activeIndex, overIndex);
      });
    }
  }

  function onDragCancel() {
  setActiveColumn(null);
  setActiveCard(null);
  }

  return (
    <div>
      <header className="w-full flex items-center justify-between p-4 border-b">
        <Button
          onClick={() => router.navigate({ to: "/dashboard/boards" })}
          className="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-100 dark:bg-[#1F1F21]"
        >
          <ArrowLeft className="text-produ-text" />
        </Button>

        <h1 className="text-2xl">{board?.title}</h1>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center w-10 h-10 rounded-md dark:bg-[#1F1F21]">
              <Users2 className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Alterar visibilidade</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex flex-col items-start"
                onClick={() =>
                  router.navigate({ to: "/dashboard/boards/create" })
                }
              >
                <div className="flex items-center gap-2">
                  <Lock />
                  Privado
                </div>
                <p>Somente os membros deste quadro podem ve-lo</p>
                <Separator />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <Globe />
                  Público
                </div>
                <p>Qualquer pessoa na internet pode ter acesso</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ShareBoardDialog />
        </div>
      </header>

      <main
        className="flex-1 min-h-[90vh] p-6"
        style={{
          backgroundImage: board?.background?.startsWith("http")
            ? `url(${board?.background})`
            : "none",
          backgroundColor:
            board?.background && !board?.background.startsWith("http")
              ? board?.background
              : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}

        >
          <ScrollArea className="w-full whitespace-nowrap  min-h-[84vh]">
            <div className="flex gap-4 p-2">
              {isColumnsLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-[280px] rounded-lg p-4 bg-white/40 dark:bg-[#1F1F21]/50 space-y-3"
                    >
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ))
                : orderedColumns && (
                    <SortableContext items={columnsId}>
                      {orderedColumns.length > 0 &&
                        orderedColumns.map((column) => (
                          <div key={column.id} className="min-w-[380px]">
                            <ColumnWithCards column={column} />
                          </div>
                        ))}
                    </SortableContext>
                  )}

              <AddListDialog id={id} />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {createPortal(
            <DragOverlay>
              {activeColumn && <ColumnWithCards column={activeColumn} />}
              {activeCard && <CardItem card={activeCard} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </main>
    </div>
  );
}
