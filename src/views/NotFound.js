import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTE } from '../helpers/Dictionary'

function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <h1>404</h1>
        <p>Page Not Found</p>
        <Link className="def" to={ROUTE.Home}><div className="button static">BACK TO HOME</div></Link>
      </div>
    </section>
  )
}

export default NotFound
