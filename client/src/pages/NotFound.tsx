import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-center items-center mt-13 gap-4 '>
      <h2 className='text-2xl font-semibold'>PAGE NOT FOUND</h2>
      <Button size={'lg'} className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/')}>Back Home <ArrowLeft></ArrowLeft></Button>
    </div>
  )
}

export default NotFound
