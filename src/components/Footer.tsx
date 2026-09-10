import { Github, Linkedin, Twitter } from "lucide-react";

const socials = [
  { label: "GitHub", href: "https://github.com/Vitalis-Ifeanyi", Icon: Github },
  { label: "X / Twitter", href: "https://twitter.com/delegends", Icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com/in/ifeanyi-vitalis-nwokolo", Icon: Linkedin },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p>
            Market data from{" "}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline decoration-line-strong underline-offset-2 hover:decoration-fg"
            >
              CoinGecko
            </a>
            . Prices can lag by a minute or two.
          </p>
          <p className="text-faint">
            © {new Date().getFullYear()} Coinpad · Built by Ifeanyi Vitalis. Nothing here is financial advice.
          </p>
        </div>

        <ul className="flex gap-1">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="grid size-8 place-items-center rounded-md text-muted hover:bg-sunken hover:text-fg"
              >
                <Icon size={16} strokeWidth={1.75} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
