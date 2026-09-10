# Coinpad

Live prices for the top 100 cryptocurrencies, candlestick charts, and a glossary of crypto and trading terms. Data comes from the free [CoinGecko API](https://www.coingecko.com/en/api), so there are no keys to set up.

- **Markets** (`/`): global market stats, trending coins, the biggest 24h gainers and losers, and a sortable, filterable table with 7-day sparklines. Click a row for details. Prices refresh every two minutes while the tab is open.
- **Charts** (`/analytics?coin=bitcoin&range=30&vs=usd`): OHLC candlesticks for any coin CoinGecko lists, from 24 hours to 1 year, in USD, EUR, NGN or BTC, with CSV and PNG export. All state lives in the URL, so a chart can be shared as a link.
- **Glossary** (`/terms`): 55 terms, searchable and filterable. Each term has its own anchor, e.g. `/terms#staking`.

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

## Rate limits

Without a key, CoinGecko's public API is shared and throttled per IP. When busy, it returns 429 or simply resets the connection, which the browser reports as a network error. The app handles this:

- Responses are cached in memory and in `localStorage`. A reload shows the last good data straight away, and makes no request if that data is under two minutes old.
- If a refresh fails, the old numbers stay on screen with a "Couldn't refresh" note, and the request retries on its own after 10s, 20s, 40s, then every minute.

For a steadier experience, get a free **Demo** key at [coingecko.com/en/api/pricing](https://www.coingecko.com/en/api/pricing) and put it in `.env.local` (see `.env.example`):

```sh
VITE_COINGECKO_DEMO_KEY=CG-xxxxxxxxxxxxxxxx
```

On Vercel, add the same variable in the project's environment settings. The key is visible in the browser bundle. That's acceptable for a free Demo key, but don't do it with a paid one.

## Notes

- Theme colours are CSS variables in `src/index.css`, exposed to Tailwind as `bg-surface`, `text-muted`, `text-up`, and so on. Dark mode is a `.dark` class on `<html>`. It follows the OS setting until the user picks a theme, and that choice is saved.
- ApexCharts is imported from `apexcharts/core` with only the candlestick, toolbar and export modules. The chart page is lazy-loaded, so the Markets page never downloads it.
- `vercel.json` rewrites every path to `index.html` so client-side routes survive a refresh.

Built with React 19, TypeScript, Vite and Tailwind CSS v4.
