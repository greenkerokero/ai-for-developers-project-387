import { Link } from "react-router-dom";
import { useOwnerEventTypes } from "@/api/event-types.queries";
import { useDeleteEventType } from "@/api/event-types.mutations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function OwnerEventTypesPage() {
  const { data, isLoading } = useOwnerEventTypes();
  const { mutate: deleteEventType, isPending } = useDeleteEventType();

  const handleDelete = (slug: string) => {
    if (confirm("Вы уверены, что хотите удалить этот тип события?")) {
      deleteEventType(slug, {
        onSuccess: () => toast.success("Тип события удален"),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Типы событий</h1>
        <Button asChild>
          <Link to="/owner/event-types/new">Новое событие</Link>
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.items.map(eventType => (
          <Card key={eventType.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle>{eventType.name}</CardTitle>
              <CardDescription>{eventType.durationMinutes} мин • /{eventType.slug}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {eventType.description}
              </p>
              <div className="flex space-x-2 mt-auto">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/owner/event-types/${eventType.slug}/edit`}>Редактировать</Link>
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(eventType.slug)}
                  disabled={isPending}
                >
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {data?.items.length === 0 && (
          <div className="col-span-full p-8 text-center border border-dashed rounded-lg text-muted-foreground">
            Событий не найдено. Создайте новое, чтобы начать.
          </div>
        )}
      </div>
    </div>
  );
}
