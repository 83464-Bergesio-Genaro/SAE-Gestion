import { useEffect } from "react";
import { useMatches } from "react-router-dom";

const APP_NAME = "SAE Gestión";

export default function DocumentTitle() {
  const matches = useMatches();
  const pageTitle = [...matches]
    .reverse()
    .find((match) => match.handle?.title)?.handle.title;

  useEffect(() => {
    document.title =
      pageTitle && pageTitle !== APP_NAME
        ? `${pageTitle} | ${APP_NAME}`
        : APP_NAME;
  }, [pageTitle]);

  return null;
}
