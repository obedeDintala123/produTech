import Tiptap from "@/components/tiptap";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { extractTextFromHTML } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/notes/create")({
  component: CreateNoteComponent,
});

const noteSchema = z.object({
  note: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 5;
    },
    {
      message: "Precisa no minimo de 5 caracteres",
    }
  ),
});

type NoteSchema = z.infer<typeof noteSchema>;

function CreateNoteComponent() {
  const router = useRouter();
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
    },
  });

  const createNote = useMutation({
    mutationKey: ["note"],
    mutationFn: async (data: NoteSchema) => {
      await api.post("/notes", { htmlText: data.note, createdAt: new Date() });
    },

    onSuccess: () => {
      toast.success("Nota criada com sucesso!");
      router.navigate({ to: "/dashboard/notes" });
    },

    onError: (error) => {
      console.error("Erro ao criar nota", error);
      toast.error("Erro ao criar nota");
    },
  });

  const onSubmit = (data: NoteSchema) => {
    createNote.mutate(data);
  };

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Tiptap
              
                      formMessage={fieldState.error?.message}
                      content={field.value}
                      onChange={(value: any) => field.onChange(value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
