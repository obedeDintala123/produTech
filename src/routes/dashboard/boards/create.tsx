import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useImages } from "@/lib/requests";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/boards/create")({
  component: CreateBoardComponent,
});

const boardSchema = z.object({
  title: z.string().min(4, "Digite no minimo 4 caracteres"),
  visibility: z.string().min(1, "Selecione umas das opçoes"),
  background: z.string().optional(),
});

type BoardSchema = z.infer<typeof boardSchema>;

function CreateBoardComponent() {
  const { data: images, isLoading } = useImages();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<BoardSchema>({
    resolver: zodResolver(boardSchema),
    mode: "onSubmit",
    defaultValues: {
      background: "#ead4a8",
    },
  });

  const background = watch("background");

  const backColours = [
    "#ead4a8",
    "#352d3b",
    "#d83163",
    "#efe1e5",
    "#333c4b",
    "#dbd5ca",
  ];

  const createBoard = useMutation({
    mutationKey: ["createBoard"],
    mutationFn: async (data: BoardSchema) => {
      await api.post("/boards", { ...data, createdAt: new Date(), column: [] });
    },

    onSuccess: () => {
      toast.success("Quadro criado com sucesso!");
      router.navigate({ to: "/dashboard/boards" });
    },

    onError: () => {
      toast.error("Erro ao criar quadro!");
    },
  });

  const onSubmit = (data: BoardSchema) => {
    createBoard.mutate(data);
  };

  return (
    <div>
      <header className="fixed top-0 w-full flex items-center justify-between p-4 bg-white dark:bg-background">
        <Button
          onClick={() => router.navigate({ to: "/dashboard/boards" })}
          className="w-10 h-10 rounded-md bg-gray-100 hover:bg-gray-100 dark:bg-[#1F1F21]"
        >
          <ArrowLeft className="text-produ-text" />
        </Button>

        <h1 className="font-semibold">Criar Quadro</h1>

        <Button
          className="bg-produ-secondary hover:bg-produ-secondary"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Salvar
        </Button>
      </header>

      <main className=" min-h-screen grid grid-cols-5 p-4 pt-24 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="col-span-2" />
            <Skeleton className="col-span-3" />
          </>
        ) : (
          <>
            <Card className="shadow-none col-span-2 p-4">
              <CardHeader>
                <CardTitle className="font-none">Tela de Fundo</CardTitle>
                <div className="grid grid-cols-6 gap-2">
                  {images?.map((img: any) => (
                    <img
                      key={img.id}
                      src={img.download_url}
                      alt={img.author}
                      className={`rounded-lg cursor-pointer hover:opacity-80 ${
                        background === img.download_url
                          ? "ring-2 ring-produ-secondary"
                          : ""
                      }`}
                      onClick={() => setValue("background", img.download_url)}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-6 gap-2 mt-4">
                  {backColours.map((colour) => (
                    <div
                      key={colour}
                      className={`rounded-lg border cursor-pointer h-14 hover:opacity-80 ${
                        background === colour
                          ? "ring-2 ring-produ-secondary"
                          : ""
                      }`}
                      style={{ backgroundColor: colour }}
                      onClick={() => setValue("background", colour)}
                    ></div>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título do quadro</Label>
                  <Input {...register("title")} />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Visibilidade</Label>

                  <Controller
                    control={control}
                    name="visibility"
                    defaultValue="public"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="data-[size=default]:h-12 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Público</SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.visibility && (
                    <p className="text-red-500 text-sm">
                      {errors.visibility.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card
              className="flex items-center justify-center shadow-none col-span-3 relative overflow-hidden"
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
            >
              <img
                src="/preview.svg"
                alt="preview"
                className="w-[650px] z-10"
              />
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
