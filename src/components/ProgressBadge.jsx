import { currentWeek, curriculum } from '../data/content'

export default function ProgressBadge() {
  const total = curriculum.length

  if (currentWeek === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium border border-white/20">
        <span>📋</span>
        준비중
      </span>
    )
  }

  const percent = Math.round((currentWeek / total) * 100)

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
        🎯 진행중 {currentWeek}/{total}단계
      </span>
      <div className="flex items-center gap-2">
        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-white/50">{percent}%</span>
      </div>
    </div>
  )
}
