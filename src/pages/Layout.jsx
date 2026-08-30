import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'

const Layout = () => {
    const { user, loading } = useSelector(state => state.auth)

    if (loading) {
        return <Loader />
    }

    return (
        <div style={{ minHeight: '100vh', background: '#070b14' }}>
            {user ? (
                <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #070b14 0%, #0d1526 50%, #070b14 100%)' }}>
                    <Navbar />
                    <Outlet />
                </div>
            ) : (
                <Login />
            )}
        </div>
    )
}

export default Layout