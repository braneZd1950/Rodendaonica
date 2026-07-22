import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="landing-page">
      <section className="not-found">
        <div className="landing-container not-found__inner">
          <p className="not-found__code">404</p>
          <h1>Stranica nije pronađena</h1>
          <p>Link koji ste otvorili više ne postoji ili je pogrešno upisan.</p>
          <div className="not-found__actions">
            <Link to="/" className="landing-btn landing-btn--primary">
              Početna
            </Link>
            <Link to="/igraonice" className="landing-btn landing-btn--outline">
              Pregledaj igraonice
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
