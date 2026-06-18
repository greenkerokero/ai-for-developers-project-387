import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UI } from "@/lib/dictionary";

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 max-w-3xl mx-auto">
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
        {UI.pages.home.title}
      </h1>
      <p className="text-xl text-muted-foreground leading-relaxed">
        {UI.pages.home.subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" asChild>
          <Link to="/events">{UI.buttons.selectTime}</Link>
        </Button>
      </div>
    </div>
  );
}
