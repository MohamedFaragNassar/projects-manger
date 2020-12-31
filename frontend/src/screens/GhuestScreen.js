import React from 'react'
import { Link } from 'react-router-dom'

const GhuestScreen = () => {
    return (
        <div className="ghuest">
            <h3>Project Manger</h3>
            <p>The power to make project management simple</p>
            <Link to="/signup">Sign Up</Link>
            <Link to="/signin">Sign In</Link>
        </div>
    )
}

export default GhuestScreen
