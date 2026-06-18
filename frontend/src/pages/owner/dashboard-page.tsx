import { useOwnerBookings } from "@/api/bookings.queries";
import { useCancelBooking } from "@/api/bookings.mutations";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function DashboardPage() {
  const { data, isLoading } = useOwnerBookings();
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  const handleCancel = (id: string) => {
    if (confirm("Вы уверены, что хотите отменить это бронирование?")) {
      cancelBooking(id, {
        onSuccess: () => toast.success("Бронирование успешно отменено"),
      });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Загрузка бронирований...</div>;

  const upcomingBookings = data?.items.filter(b => b.status === "confirmed") || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Дашборд</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Предстоящие встречи</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">У вас нет предстоящих встреч.</p>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{booking.eventTypeName} с {booking.guestName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(booking.startTime), "EEEE, d MMMM yyyy 'в' HH:mm", { locale: ru })}
                    </p>
                    <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                    {booking.guestComment && (
                      <p className="text-sm mt-2 p-2 bg-muted rounded-md italic">"{booking.guestComment}"</p>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={isPending}
                    onClick={() => handleCancel(booking.id)}
                  >
                    Отменить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
