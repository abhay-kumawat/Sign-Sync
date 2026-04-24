import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import AvatarShowcase from './pages/AvatarShowcase'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
        <Route path="/avatar" element={<AvatarShowcase />} />
      </Routes>
    </BrowserRouter>
  )
}
