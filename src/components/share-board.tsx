import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ShareBoardDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar quadro</DialogTitle>
          <DialogDescription>
            Convide pessoas para colaborar neste quadro. Você pode copiar o
            link ou adicionar e-mails específicos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex gap-2">
            <Input placeholder="Digite o e-mail do colaborador" />
            <Button>Adicionar</Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Ou copie o link de convite:
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://app.exemplo.com/board/1234"
                className="text-muted-foreground"
              />
              <Button variant="secondary">Copiar</Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default">Concluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
