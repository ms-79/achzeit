import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Aufgerufene Seite existiert nicht:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6">
      <Seo
        title="Seite nicht gefunden – ACHZEIT"
        path={location.pathname}
        noindex
      />
      <div className="text-center">
        <p className="font-display text-6xl text-primary mb-2">404</p>
        <h1 className="font-display text-2xl md:text-3xl text-foreground mb-4">
          Diese Seite gibt es leider nicht
        </h1>
        <p className="mb-6 text-muted-foreground">
          Die aufgerufene Adresse existiert nicht oder wurde verschoben.
        </p>
        <Link
          to="/"
          className="text-primary underline underline-offset-4 hover:opacity-80"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
