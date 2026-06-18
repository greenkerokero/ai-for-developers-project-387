import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { usePublicEventType, usePublicSlots } from "@/api/event-types.queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function EventTypeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const selectedDateStr = date ? format(date, "yyyy-MM-dd") : undefined;
  
  const { data: eventType, isLoading: typeLoading, error: typeError } = usePublicEventType(slug!);
  const { data: slots, isLoading: slotsLoading } = usePublicSlots(slug!, selectedDateStr);

  if (typeLoading) return <div className="p-8 text-center text-muted-foreground">Загрузка...</div>;
  if (typeError || !eventType) return <div className="p-8 text-center text-destructive">Событие не найдено</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-[1fr_auto_minmax(300px,1fr)]">
          <div className="p-8 md:border-r border-border">
            <h1 className="text-3xl font-bold mb-4">{eventType.name}</h1>
            <p className="text-muted-foreground flex items-center mb-6">
              <span className="mr-2">⏱</span> {eventType.durationMinutes} минут
            </p>
            <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
              {eventType.description}
            </p>
          </div>
          
          <div className="p-6 md:p-8 flex flex-col items-center bg-muted/20">
            <h2 className="text-lg font-semibold mb-4 self-start">Выберите дату</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ru}
              className="rounded-md border bg-background shadow-sm"
              disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
            />
          </div>

          <div className="p-6 md:p-8 md:border-l border-border bg-muted/10 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">
              {date ? format(date, "d MMMM", { locale: ru }) : "Выберите дату"}
            </h2>
            
            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar flex-1">
              {!date ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Выберите дату слева, чтобы увидеть доступное время.
                </div>
              ) : slotsLoading ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Загрузка слотов...</div>
              ) : slots?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Нет доступного времени в этот день.
                </div>
              ) : (
                slots?.map((slot, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="w-full justify-center font-medium h-12 hover:border-primary hover:text-primary transition-all"
                    disabled={!slot.isAvailable}
                    asChild={slot.isAvailable}
                  >
                    {slot.isAvailable ? (
                      <Link to={`/${slug}/book?startTime=${encodeURIComponent(slot.startTime)}`}>
                        {format(parseISO(slot.startTime), "HH:mm")}
                      </Link>
                    ) : (
                      <span>{format(parseISO(slot.startTime), "HH:mm")} (Занято)</span>
                    )}
                  </Button>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
