export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="h-8 w-8"
      >
        <defs>
          <linearGradient
            id="mdps-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
        </defs>
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="6"
          fill="url(#mdps-gradient)"
        />
        <rect
          x="10"
          y="9"
          width="16"
          height="22"
          rx="2"
          fill="#f9fafb"
        />
        <path
          d="M14 15h8M14 19h8M14 23h5"
          stroke="#0f172a"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M24 28c0-3 2-5 4-5s4 2 4 5"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M25 28c0-2.2 1.4-3.8 3-3.8s3 1.6 3 3.8"
          fill="none"
          stroke="#0f172a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight">
          MD Print Studio
        </span>
        <span className="block text-[11px] text-zinc-500 tracking-wide">
          Markdown → A4 PDF
        </span>
      </div>
    </div>
  );
}

