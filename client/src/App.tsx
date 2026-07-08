import { RouterProvider } from 'react-router'
import '@/App.css'
import routes from '@/routes/routes'
import { CourseProvider } from '@/context/CourseContext'
import { QuizProvider } from '@/context/QuizContext'
import { ProgressProvider } from '@/context/ProgressContext'
import { AdminProvider } from '@/context/AdminContext'

function App() {
  return (
    <ProgressProvider>
      <CourseProvider>
        <QuizProvider>
          <AdminProvider>
            <RouterProvider router={routes} />
          </AdminProvider>
        </QuizProvider>
      </CourseProvider>
    </ProgressProvider>
  )
}

export default App

