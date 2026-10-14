function RustLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 106 106" className={className} aria-hidden="true">
      <g transform="translate(53, 53)">
        <path
          transform="translate(0.5, 0.5)"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
          fill="none"
          d="M -9,-15 H 4 C 12,-15 12,-7 4,-7 H -9 Z
             M -40,22 H 0 V 11 H -9 V 3 H 1 C 12,3 6,22 15,22 H 40
             V 3 H 34 V 5 C 34,13 25,12 24,7 C 23,2 19,-2 18,-2 C 33,-10 24,-26 12,-26 H -35
             V -15 H -25 V 11 H -40 Z"
        />
        <circle r="43" fill="none" stroke="currentColor" strokeWidth="9" />
        <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none">
          <polygon points="46,3 51,0 46,-3" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(22.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(45)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(67.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(90)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(112.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(135)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(157.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(180)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(202.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(225)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(247.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(270)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(292.5)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(315)" />
          <polygon points="46,3 51,0 46,-3" transform="rotate(337.5)" />
          <polygon points="-7,-42 0,-35 7,-42" transform="translate(0.5, 0.5)" strokeWidth="6" />
          <polygon points="-7,-42 0,-35 7,-42" transform="translate(0.5, 0.5) rotate(72)" strokeWidth="6" />
          <polygon points="-7,-42 0,-35 7,-42" transform="translate(0.5, 0.5) rotate(144)" strokeWidth="6" />
          <polygon points="-7,-42 0,-35 7,-42" transform="translate(0.5, 0.5) rotate(216)" strokeWidth="6" />
          <polygon points="-7,-42 0,-35 7,-42" transform="translate(0.5, 0.5) rotate(288)" strokeWidth="6" />
        </g>
      </g>
    </svg>
  )
}

function EthLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 417" className={className} aria-hidden="true">
      <polygon fill="currentColor" fillOpacity="0.95" points="127.9611 0 125.1661 9.5 125.1661 285.168 127.9611 287.958 255.9231 212.32" />
      <polygon fill="currentColor" fillOpacity="0.55" points="127.962 0 0 212.32 127.962 287.959 127.962 154.158" />
      <polygon fill="currentColor" fillOpacity="0.35" points="127.9611 312.1866 126.3861 314.1066 126.3861 412.3056 127.9611 416.9066 255.9991 236.5866" />
      <polygon fill="currentColor" fillOpacity="0.6" points="127.962 416.9052 127.962 312.1852 0 236.5852" />
      <polygon fill="currentColor" fillOpacity="0.25" points="127.9611 287.9577 255.9211 212.3207 127.9611 154.1587" />
      <polygon fill="currentColor" fillOpacity="0.45" points="0.0009 212.3208 127.9609 287.9578 127.9609 154.1588" />
    </svg>
  )
}

type LogoKind = 'rust' | 'eth'

interface Drifter {
  kind: LogoKind
  size: number
  top: string
  left: string
  opacity: number
  color: string
  floatDur: number
  floatDelay: number
  spin?: number
  spinReverse?: boolean
  blur?: number
}

const DRIFTERS: Drifter[] = [
  { kind: 'rust', size: 170, top: '7%', left: '5%', opacity: 0.1, color: 'text-orange-500', floatDur: 9, floatDelay: 0, spin: 70 },
  { kind: 'eth', size: 110, top: '14%', left: '84%', opacity: 0.12, color: 'text-violet-400', floatDur: 11, floatDelay: 1.2 },
  { kind: 'rust', size: 95, top: '64%', left: '88%', opacity: 0.08, color: 'text-fuchsia-400', floatDur: 12, floatDelay: 0.6, spin: 90, spinReverse: true },
  { kind: 'eth', size: 190, top: '72%', left: '7%', opacity: 0.07, color: 'text-cyan-400', floatDur: 14, floatDelay: 2, blur: 1.5 },
  { kind: 'rust', size: 64, top: '28%', left: '72%', opacity: 0.12, color: 'text-amber-400', floatDur: 8, floatDelay: 0.3, spin: 55 },
  { kind: 'eth', size: 70, top: '4%', left: '48%', opacity: 0.1, color: 'text-indigo-400', floatDur: 10, floatDelay: 1.8 },
  { kind: 'rust', size: 120, top: '82%', left: '58%', opacity: 0.07, color: 'text-orange-400', floatDur: 13, floatDelay: 0.9, spin: 100, spinReverse: true },
  { kind: 'eth', size: 88, top: '38%', left: '12%', opacity: 0.09, color: 'text-violet-300', floatDur: 9.5, floatDelay: 0.5 },
  { kind: 'rust', size: 52, top: '46%', left: '94%', opacity: 0.13, color: 'text-rose-400', floatDur: 7.5, floatDelay: 1.4, spin: 45, blur: 1 },
  { kind: 'eth', size: 130, top: '90%', left: '28%', opacity: 0.06, color: 'text-sky-400', floatDur: 15, floatDelay: 2.4, blur: 2 },
  { kind: 'rust', size: 78, top: '18%', left: '34%', opacity: 0.07, color: 'text-purple-400', floatDur: 11.5, floatDelay: 0.2, spin: 80, blur: 1.5 },
  { kind: 'eth', size: 60, top: '56%', left: '68%', opacity: 0.11, color: 'text-fuchsia-300', floatDur: 8.5, floatDelay: 1 },
  { kind: 'rust', size: 100, top: '2%', left: '18%', opacity: 0.06, color: 'text-cyan-300', floatDur: 16, floatDelay: 3, spin: 120, blur: 2 },
  { kind: 'eth', size: 96, top: '58%', left: '44%', opacity: 0.05, color: 'text-violet-400', floatDur: 12.5, floatDelay: 0.7, blur: 2.5 },
]

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[#07070d]" />

      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="orb orb-c" />

      <div className="bg-grid" />

      {DRIFTERS.map((d, i) => (
        <div
          key={i}
          className="drifter"
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDuration: `${d.floatDur}s`,
            animationDelay: `${d.floatDelay}s`,
            filter: d.blur ? `blur(${d.blur}px)` : undefined,
          }}
        >
          <div
            className={d.color}
            style={
              d.spin
                ? {
                    animation: `spin-gear ${d.spin}s linear infinite${d.spinReverse ? ' reverse' : ''}`,
                  }
                : undefined
            }
          >
            {d.kind === 'rust' ? (
              <RustLogo className="h-full w-full" />
            ) : (
              <EthLogo className="h-full w-full" />
            )}
          </div>
        </div>
      ))}

      <div className="vignette" />
    </div>
  )
}
