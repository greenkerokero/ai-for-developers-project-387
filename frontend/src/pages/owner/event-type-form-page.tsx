import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEventType } from "@/api/event-types.mutations";
import { eventTypeSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type FormData = z.infer<typeof eventTypeSchema>;

export function EventTypeFormPage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateEventType();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      slug: "",
      name: "",
      description: "",
      durationMinutes: 15,
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Событие создано");
        navigate("/owner/event-types");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Новое событие</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" {...register("name")} placeholder="Например: Вводный звонок 15 мин" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL ссылка</Label>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">/</span>
                <Input id="slug" {...register("slug")} placeholder="15-min-call" />
              </div>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Длительность (в минутах)</Label>
              <Input id="durationMinutes" type="number" {...register("durationMinutes", { valueAsNumber: true })} />
              {errors.durationMinutes && <p className="text-sm text-destructive">{errors.durationMinutes.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <textarea 
                id="description" 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("description")} 
                placeholder="Расскажите, о чем будет встреча..."
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/owner/event-types")}>
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Создание..." : "Создать"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
