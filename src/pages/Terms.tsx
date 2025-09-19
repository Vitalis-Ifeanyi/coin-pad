import React, { useState, useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import TermsHero from "../components/terms/TermsHero";
import { AccordionTerms } from "../components/terms/AccordionTerms";

const CryptoTermsPage: React.FC = () => {
  interface Term {
    term: string;
    definition: string;
  }
  const { isDark } = useContext(DarkModeContext);
  const [searchTerm, setSearchTerm] = useState("");

  const cryptoTerms: Term[] = [
    {
      term: "Blockchain",
      definition:
        "A distributed ledger technology that records transactions in a secure, transparent, and immutable way.",
    },
    {
      term: "Bitcoin (BTC)",
      definition:
        "The first and most popular cryptocurrency, created by Satoshi Nakamoto.",
    },
    {
      term: "Ethereum (ETH)",
      definition: "A decentralized platform for smart contracts and dApps.",
    },
    {
      term: "NFT",
      definition:
        "Non-Fungible Token – a unique digital asset representing ownership of digital content.",
    },
    {
      term: "Stablecoin",
      definition:
        "A cryptocurrency pegged to a stable asset like USD to reduce volatility.",
    },
    {
      term: "Wallet",
      definition:
        "A digital tool to store, send, and receive cryptocurrencies.",
    },
    {
      term: "Private Key",
      definition:
        "A secret key that gives access to your crypto funds; must be kept secure.",
    },
    {
      term: "Public Key",
      definition:
        "A cryptographic key that can be shared to receive cryptocurrency.",
    },
    {
      term: "DeFi",
      definition:
        "Decentralized Finance – financial services built on blockchain.",
    },
    {
      term: "DAO",
      definition:
        "Decentralized Autonomous Organization – community-governed blockchain organization.",
    },
    {
      term: "Smart Contract",
      definition: "Self-executing contract with terms written into code.",
    },
    {
      term: "Mining",
      definition: "Validating transactions and adding them to the blockchain.",
    },
    {
      term: "Gas Fee",
      definition:
        "Transaction fee required to perform operations on blockchain networks.",
    },
    {
      term: "Tokenomics",
      definition:
        "Economic model behind a cryptocurrency including supply, distribution, incentives.",
    },
    {
      term: "Fork",
      definition:
        "A split in the blockchain that creates a new version of the network.",
    },
    {
      term: "Halving",
      definition:
        "Event where the block reward is reduced by half, reducing supply rate.",
    },
    {
      term: "Ledger",
      definition: "A record of all transactions in the blockchain.",
    },
    {
      term: "Validator",
      definition: "Entity that validates transactions and creates new blocks.",
    },
    {
      term: "Node",
      definition: "A computer connected to the blockchain network.",
    },
    {
      term: "Hash Rate",
      definition: "Computational power used to mine and process transactions.",
    },
    {
      term: "Airdrop",
      definition: "Distribution of free tokens to crypto holders.",
    },
    {
      term: "Staking",
      definition: "Locking crypto assets in a blockchain to earn rewards.",
    },
    {
      term: "Yield Farming",
      definition: "Staking crypto assets to earn interest or rewards.",
    },
    {
      term: "Sidechain",
      definition:
        "Secondary blockchain connected to a main chain for scalability.",
    },
    {
      term: "Layer 2",
      definition:
        "Protocol built on top of a blockchain to improve scalability.",
    },
  ];

  // Trading Terms
  const tradingTerms: Term[] = [
    {
      term: "Long Position",
      definition: "Buying an asset expecting its price to increase.",
    },
    {
      term: "Short Position",
      definition:
        "Selling an asset you do not own, expecting the price to drop.",
    },
    {
      term: "Stop-Loss",
      definition:
        "Order to automatically sell an asset when it reaches a specified price.",
    },
    {
      term: "Take-Profit",
      definition:
        "Order to automatically sell an asset when it reaches a target price.",
    },
    {
      term: "Leverage",
      definition:
        "Borrowing funds to increase position size and potential gains/losses.",
    },
    {
      term: "Margin",
      definition: "Collateral required to open a leveraged position.",
    },
    {
      term: "Order Book",
      definition: "List of buy and sell orders for an asset on an exchange.",
    },
    {
      term: "Spread",
      definition: "Difference between highest bid and lowest ask price.",
    },
    {
      term: "Volatility",
      definition:
        "Measure of how much the price of an asset fluctuates over time.",
    },
    {
      term: "Liquidity",
      definition:
        "Ease with which an asset can be bought or sold without affecting price.",
    },
    {
      term: "Market Cap",
      definition:
        "Total value of a cryptocurrency, calculated as price × circulating supply.",
    },
    {
      term: "Candle",
      definition:
        "Graphical representation of price movements in a specific timeframe.",
    },
    { term: "Bullish", definition: "Expecting the price to rise." },
    { term: "Bearish", definition: "Expecting the price to fall." },
    {
      term: "Pump & Dump",
      definition:
        "Scheme where price is artificially inflated and then sold off.",
    },
    {
      term: "Swing Trading",
      definition:
        "Short to medium-term trading strategy to capture price swings.",
    },
    {
      term: "Day Trading",
      definition: "Buying and selling within the same day.",
    },
    {
      term: "Scalping",
      definition:
        "Making small trades repeatedly to profit from small price movements.",
    },
    {
      term: "Futures",
      definition: "Derivative contract to buy/sell an asset at a future date.",
    },
    {
      term: "Options",
      definition: "Derivative giving the right but not obligation to buy/sell.",
    },
    {
      term: "Perpetual Contract",
      definition: "Derivative contract with no expiry date.",
    },
    {
      term: "Arbitrage",
      definition: "Profit from price differences across exchanges.",
    },
    {
      term: "Slippage",
      definition: "Difference between expected and executed price.",
    },
    {
      term: "Funding Rate",
      definition:
        "Payment between traders to maintain perpetual contract price parity.",
    },
  ];

  const filteredCryptoTerms = cryptoTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTradingTerms = tradingTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } min-h-screen`}
    >
      <TermsHero />

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search for a term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full max-w-lg px-4 py-3 rounded-xl border focus:outline-none shadow ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <h2 className="text-3xl font-semibold mb-4">Crypto Terms</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredCryptoTerms.length > 0 ? (
            filteredCryptoTerms.map((term, idx) => (
              <AccordionTerms key={idx} term={term} />
            ))
          ) : (
            <p className="col-span-2 text-gray-400">No terms found.</p>
          )}
        </div>

        <h2 className="text-3xl font-semibold mt-12 mb-4">Trading Terms</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTradingTerms.length > 0 ? (
            filteredTradingTerms.map((term, idx) => (
              <AccordionTerms key={idx} term={term} />
            ))
          ) : (
            <p className="col-span-2 text-gray-400">No terms found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoTermsPage;
