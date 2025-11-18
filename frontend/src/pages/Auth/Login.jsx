import React, {useState} from 'react'
import { Eye, EyeOff, Loader2, Mail, Lock, FileText, ArrowRight } from 'lucide-react'
import { API_PATHS } from '../../utils/apiPath'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  /* ============ HOOKS ============ */
  const {login}=useAuth()
  const navigate=useNavigate()

  /* ============ STATE MANAGEMENT ============ */
  const [formData, setFormData]=useState({email:"", password:""})
  const [showPassword, setShowPassword]=useState(false)
  const [loading, setIsLoading]=useState(false)
  const [error, setError]=useState("")
  const [success, setSuccess]=useState("")
  const [fieldErrors, setFieldErrors]=useState({email:"", password:""})
  const [touched, setTouched]=useState({email:false, password:false})

  const handleInputChange=(e)=>{}

  const handleBlur=(e)=>{}

  const isFormValid=()=>{}

  const handleSubmit=async()=>{}

  return (
    <div className=''>
      <div className=''>

        {/* header  */}
        <div className=''>
          <div className=''><FileText className=''/></div>
          <h1 className=''>Log to your Account</h1>
          <p className=''>Welcome back to invoice generator</p>
        </div>


         {/* form  */}
         <div className=''>
          {/* email  */}
          <div className=''>
            <label className=''>Email</label>
            <div className=''>
              <Mail className=''/>
              
            </div>
          </div>
         </div>

      </div>
    </div>
  )
}

export default Login
