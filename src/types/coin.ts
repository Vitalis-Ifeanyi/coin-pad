/** A row from /coins/markets. */
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  atl: number | null;
  last_updated: string | null;
  sparkline_in_7d?: { price: number[] };
}

/** The `data` object from /global. */
export interface GlobalMarket {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

/** One entry from /search/trending → coins[].item. */
export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  small: string;
  data?: {
    price?: number;
    price_change_percentage_24h?: Record<string, number>;
  };
}

/** One entry from /search → coins[]. */
export interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

/** [timestamp, open, high, low, close] from /coins/{id}/ohlc. */
export type OhlcRow = [number, number, number, number, number];
