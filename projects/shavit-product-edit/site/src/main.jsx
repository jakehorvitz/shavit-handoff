import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './design-tokens.css'
import './site.css'

export const createRoot = ViteReactSSG({ routes, basename: import.meta.env.BASE_URL })
