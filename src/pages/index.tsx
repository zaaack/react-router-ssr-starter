import { useLoaderData, type LoaderFunction } from "react-router"

export const Loader:LoaderFunction = () => 'Route loader'
export const Action = () => 'Route action'
export const Catch = () => <div>Route errorrrrrr</div>

export default function Home() {
  return <h1>Home - Basic</h1>
}
