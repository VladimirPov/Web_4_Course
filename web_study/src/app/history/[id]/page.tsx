export default async function HistoryItem({params}: {
  params: Promise<{ id: string }>
}) {
    const { id } = await params
    return <div>History item {id}</div>
}