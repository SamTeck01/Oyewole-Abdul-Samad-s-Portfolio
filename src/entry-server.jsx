import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppShell } from './App.jsx';

/* Build-time only: renders the home page to static HTML so crawlers and AI
   answer engines that don't run JavaScript still see the full content.
   The browser then mounts the live app over it (see main.jsx). */
export function render(url = '/') {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  );
}
