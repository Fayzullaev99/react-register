import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import useLocalStorage from '../hooks/useLocalStorage'
import useInput from '../hooks/useInput'
import useToggle from '../hooks/useToggle'

const LOGIN_URL = '/auth'

function SignIn() {

    const { setAuth } = useAuth()
    // const { setAuth,persist, setPersist } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    console.log(from);
    const userRef = useRef()
    const errRef = useRef()

    const [user, resetUser, userAttributes] = useInput('user','')
    // const [user, setUser] = useLocalStorage('user','')
    // const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [check, toggleCheck] = useToggle('persist',false)

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [pwd, user])


    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles
            setAuth({ user, pwd, roles, accessToken })
            resetUser('')
            // setUser("")
            setPwd("")
            navigate(from, { replace: true })
        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response')
            } else if (error.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
            errRef.current.focus()
        }
    }

    // const togglePersist = ()=>{
    //     setPersist(prev => !prev)
    // }

    // useEffect(()=>{
    //     localStorage.setItem("persist",persist)
    // },[persist])
    return (
        <>
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live='polite'
                >{errMsg}</p >
                <h1>Sign in</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id='username'
                        ref={userRef}
                        autoComplete='off'
                        {...userAttributes}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id='password'
                        autoComplete='off'
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <button>Sign In</button>
                    <div className="persistCheck">
                        <input 
                            type="checkbox" 
                            id='persist'
                            onChange={toggleCheck}
                            checked={check}
                        />
                        <label htmlFor="persist">Trust This Device</label>
                    </div>
                    <p>
                        Need an Account?<br />
                        <span className='line'>
                            <Link to="/signup">Sign Up</Link>
                        </span>
                    </p>
                </form>
            </section >
        </>
    )
}

export default SignIn