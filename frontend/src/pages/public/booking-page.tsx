import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePublicEventType } from "@/api/event-types.queries";
import { useCreateBooking } from "@/api/bookings.mutations";
import { bookingCreateSchema } from "@/lib/validators";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";

type FormData = z.infer<typeof bookingCreateSchema>;

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const startTime = searchParams.get("startTime");
  const navigate = useNavigate();

  const { data: eventType, isLoading, error } = usePublicEventType(slug!);
  const { mutate, isPending } = useCreateBooking(slug!);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      startTime: startTime || "",
      guestName: "",
      guestEmail: "",
      guestComment: "",
    },
  });

  if (!startTime) return <div className="p-8 text-center text-destructive">Не указано время бронирования</div>;
  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Загрузка...</div>;
  if (error || !eventType) return <div className="p-8 text-center text-destructive">Событие не найдено</div>;

  const onSubmit = (data: FormData) => {
    mutate({ ...data, guestComment: data.guestComment || undefined }, {
      onSuccess: () => {
        toast.success("Бронирование успешно подтверждено!");
        navigate("/events");
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Подтверждение бронирования</CardTitle>
          <div className="text-muted-foreground mt-2">
            <p className="font-medium text-foreground">{eventType.name}</p>
            <p>{format(parseISO(startTime), "EEEE, d MMMM yyyy 'в' HH:mm", { locale: ru })}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Ваше Имя</Label>
              <Input id="guestName" {...register("guestName")} placeholder="Иван Иванов" />
              {errors.guestName && <p className="text-sm text-destructive">{errors.guestName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input id="guestEmail" type="email" {...register("guestEmail")} placeholder="ivan@example.com" />
              {errors.guestEmail && <p className="text-sm text-destructive">{errors.guestEmail.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestComment">Дополнительная информация (необязательно)</Label>
              <textarea 
                id="guestComment" 
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("guestComment")} 
                placeholder="Пожалуйста, поделитесь всем, что поможет подготовиться к нашей встрече."
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Назад</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Подтверждение..." : "Подтвердить"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
