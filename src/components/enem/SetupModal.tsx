import { useState, FormEvent } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CoordinatorData } from "@/hooks/use-enem-2025";

interface SetupModalProps {
  open: boolean;
  onSubmit: (data: CoordinatorData) => void;
}

export const SetupModal = ({ open, onSubmit }: SetupModalProps) => {
  const [form, setForm] = useState({
    name: "Maria Cristina",
    city: "Santos Dumont",
    state: "MG",
    location: "Centro de Ensino Paulo Freire",
    classrooms: "30",
    participants: "748",
    examDay: "1",
    simulationMode: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.state || !form.location) return;
    onSubmit({
      name: form.name,
      city: form.city,
      state: form.state,
      location: form.location,
      classrooms: Number(form.classrooms) || 0,
      participants: Number(form.participants) || 0,
      examDay: (Number(form.examDay) || 1) as 1 | 2,
      simulationMode: form.simulationMode,
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-background">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              ⚙️ Configuração Inicial - Sistema ENEM 2025
            </h2>
            <p className="text-sm text-muted-foreground">
              Preencha os dados do local para iniciar o painel de coordenação.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>Nome do(a) Coordenador(a)</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Cidade</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Input
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Local de Aplicação</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Número de Salas</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.classrooms}
                  onChange={(e) => setForm((f) => ({ ...f, classrooms: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Número de Participantes</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.participants}
                  onChange={(e) => setForm((f) => ({ ...f, participants: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Dia do Exame</Label>
              <Select
                value={form.examDay}
                onValueChange={(value) => setForm((f) => ({ ...f, examDay: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Dia (09/11/2025)</SelectItem>
                  <SelectItem value="2">2º Dia (16/11/2025)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="simulationMode"
                checked={form.simulationMode}
                onCheckedChange={(checked) =>
                  setForm((f) => ({
                    ...f,
                    simulationMode: Boolean(checked),
                  }))
                }
              />
              <Label htmlFor="simulationMode" className="text-sm">
                Modo simulação (para treinamento)
              </Label>
            </div>
            <div className="pt-3 flex justify-end">
              <Button type="submit" className="px-5">
                Iniciar Sistema
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};