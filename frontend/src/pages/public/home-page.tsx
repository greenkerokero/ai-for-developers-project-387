import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UI } from "@/lib/dictionary";

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 max-w-3xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          {UI.pages.home.title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {UI.pages.home.subtitle}
        </p>
      </div>
      <div className="grid w-full gap-4 sm:grid-cols-2">
        <Link
          to="/events"
          className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="h-full text-left transition-colors hover:border-primary hover:bg-accent/50 group-focus-visible:border-primary">
            <CardHeader>
              <CardTitle className="text-lg">
                {UI.pages.home.guestCardTitle}
              </CardTitle>
              <CardDescription>
                {UI.pages.home.guestCardDescription}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          to="/owner"
          className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="h-full text-left transition-colors hover:border-primary hover:bg-accent/50 group-focus-visible:border-primary">
            <CardHeader>
              <CardTitle className="text-lg">
                {UI.pages.home.ownerCardTitle}
              </CardTitle>
              <CardDescription>
                {UI.pages.home.ownerCardDescription}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
