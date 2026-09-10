export type TermCategory = "crypto" | "trading";

export interface Term {
  term: string;
  definition: string;
  category: TermCategory;
}

const crypto: [string, string][] = [
  ["Blockchain", "A shared ledger, copied across many computers, where transactions are grouped into blocks that can't be quietly altered later."],
  ["Bitcoin (BTC)", "The first cryptocurrency, launched in 2009 by the pseudonymous Satoshi Nakamoto. Supply is capped at 21 million coins."],
  ["Ethereum (ETH)", "A blockchain that runs programs (smart contracts), which is what most DeFi apps, NFTs and tokens are built on."],
  ["NFT", "Non-fungible token: a token that is unique rather than interchangeable, typically used to record ownership of digital art, collectibles or tickets."],
  ["Stablecoin", "A token designed to hold a steady price, usually $1, backed by cash reserves, other crypto, or an algorithm. USDT and USDC are the largest."],
  ["Wallet", "Software or hardware that holds your keys and lets you send, receive and sign transactions. The coins themselves stay on the blockchain."],
  ["Private Key", "The secret that proves you own a wallet. Anyone who has it controls the funds, so never share it or type it into a website."],
  ["Seed Phrase", "12 or 24 words that can regenerate every private key in a wallet. Treat it exactly like the private key."],
  ["Public Key", "The shareable counterpart of a private key. Your wallet address is derived from it."],
  ["DeFi", "Decentralized finance: lending, trading and borrowing run by smart contracts instead of banks or brokers."],
  ["DAO", "Decentralized autonomous organization: a group that makes decisions by token-holder votes, with the results carried out on-chain."],
  ["Smart Contract", "A program stored on a blockchain that runs exactly as written when its conditions are met."],
  ["Mining", "Securing a proof-of-work blockchain like Bitcoin by spending computing power to add new blocks, in exchange for newly minted coins and fees."],
  ["Gas Fee", "The fee paid to a network's validators to process a transaction. It rises when the network is busy."],
  ["Tokenomics", "The economics of a token: total supply, how it's distributed, unlock schedules, and what (if anything) creates demand for it."],
  ["Fork", "A change to a blockchain's rules. A soft fork stays compatible with old software; a hard fork can split the chain into two networks."],
  ["Halving", "A scheduled cut in Bitcoin's block reward, roughly every four years, which halves the rate new coins are created."],
  ["Ledger", "A record of every transaction. On a blockchain, everyone keeps a copy of the same ledger."],
  ["Validator", "A participant in a proof-of-stake network who locks up coins to propose and confirm blocks, and can lose them for misbehaving."],
  ["Node", "A computer running a blockchain's software that keeps a copy of the ledger and checks new blocks against the rules."],
  ["Hash Rate", "The total computing power securing a proof-of-work network. Higher hash rate makes an attack more expensive."],
  ["Airdrop", "Free tokens sent to wallets, usually to reward early users or to spread ownership of a new project."],
  ["Staking", "Locking coins with a proof-of-stake network (directly or through a service) to help secure it, in return for rewards."],
  ["Yield Farming", "Moving funds between DeFi protocols, often by supplying liquidity, to collect the highest available rewards. Returns are variable and risky."],
  ["Sidechain", "A separate blockchain linked to a main chain by a bridge, with its own security and rules."],
  ["Layer 2", "A network that processes transactions off the main chain and settles the results back to it, making them faster and cheaper. Examples: Arbitrum, Base, Lightning."],
  ["Market Cap", "Price multiplied by circulating supply. The standard way to rank cryptocurrencies by size."],
  ["Circulating Supply", "The number of coins currently available to trade, excluding locked or not-yet-issued tokens."],
  ["Fully Diluted Valuation", "What the market cap would be if every token that will ever exist were already in circulation, at today's price."],
];

const trading: [string, string][] = [
  ["Long Position", "Buying an asset because you expect its price to rise."],
  ["Short Position", "Borrowing and selling an asset you expect to fall, planning to buy it back cheaper later."],
  ["Stop-Loss", "An order that sells automatically if the price falls to a level you set, to cap your loss."],
  ["Take-Profit", "An order that sells automatically once the price reaches your target."],
  ["Leverage", "Trading with borrowed money to control a larger position. Gains and losses are multiplied by the same factor."],
  ["Margin", "The collateral you post to open a leveraged position."],
  ["Liquidation", "When an exchange force-closes a leveraged position because losses have eaten through the margin."],
  ["Order Book", "The live list of buy (bid) and sell (ask) orders for an asset, sorted by price."],
  ["Spread", "The gap between the highest bid and the lowest ask. Tight spreads usually mean a liquid market."],
  ["Volatility", "How much and how quickly an asset's price moves."],
  ["Liquidity", "How easily an asset can be bought or sold without moving its price."],
  ["Volume", "The total value traded over a period, typically the last 24 hours."],
  ["Candle", "A chart bar showing one period's open, high, low and close. Green if it closed above the open, red if below."],
  ["Bullish", "Expecting prices to rise."],
  ["Bearish", "Expecting prices to fall."],
  ["Pump & Dump", "A scheme where insiders hype a thinly traded coin to push its price up, then sell to the buyers they attracted."],
  ["Swing Trading", "Holding positions for days or weeks to catch a single price move."],
  ["Day Trading", "Opening and closing positions within the same day."],
  ["Scalping", "Making many very short trades to collect small price differences."],
  ["Futures", "A contract to buy or sell an asset at a set price on a future date."],
  ["Options", "A contract giving the right, but not the obligation, to buy (call) or sell (put) at a set price before it expires."],
  ["Perpetual Contract", "A futures contract with no expiry. A funding rate keeps its price close to the spot price."],
  ["Funding Rate", "Periodic payments between long and short traders on perpetual contracts, which pull the contract price back towards spot."],
  ["Arbitrage", "Buying on one market and selling on another to profit from a price difference."],
  ["Slippage", "The difference between the price you expected and the price your order actually filled at."],
  ["All-Time High (ATH)", "The highest price an asset has ever traded at."],
];

export const TERMS: Term[] = [
  ...crypto.map(([term, definition]) => ({ term, definition, category: "crypto" as const })),
  ...trading.map(([term, definition]) => ({ term, definition, category: "trading" as const })),
].sort((a, b) => a.term.localeCompare(b.term));

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
