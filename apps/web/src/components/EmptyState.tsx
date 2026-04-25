interface Props {
  illustration: string
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ illustration, title, description, action }: Props) {
  return (
    <div className="text-center py-14 px-6">
      <img
        src={illustration}
        alt=""
        aria-hidden
        className="mx-auto h-44 w-auto object-contain mb-6"
      />
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  )
}
