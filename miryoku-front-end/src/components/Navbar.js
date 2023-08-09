import useAuth from '../hooks/useAuth'
import { useUser } from '../context/UserContext'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Hamburger } from '../img/burger-menu.svg'
import { ReactComponent as Brand } from '../img/logo.svg'

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false)

  const { auth } = useAuth()
  const { user } = useUser()

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      let scrolled = window.scrollY;

      console.log(scrolled);

      if (scrolled >= 200) {
        setShowNavbar(false);
      }
    });

    return () => {
      window.removeEventListener("scroll", () => {
        let scrolled = window.scrollY;

        console.log(scrolled);

        if (scrolled >= 200) {
          setShowNavbar(false);
        }
      });
    };
  }, [showNavbar]);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <NavLink to={auth?.accessToken ? "/feed" : "/"} onClick={() => { setShowNavbar(false) }}><Brand style={{"width": "100px", "height": "100px"}} /></NavLink>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger style={{"width": "50px", "height": "50px"}} />
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/feed" onClick={handleShowNavbar}>Feed</NavLink>
            </li>
            <li>
              <NavLink to="/rules" onClick={handleShowNavbar}>Rules</NavLink>
            </li>
            <li>
              <NavLink to="/feedback" onClick={handleShowNavbar}>Opinion Box</NavLink>
            </li>
            <li>
                <NavLink to="/about" onClick={handleShowNavbar}>About</NavLink>
            </li>
            { auth?.accessToken ?
                <li>
                    <NavLink to="/logout" onClick={handleShowNavbar}>Sign Out</NavLink>
                </li>
                :
                <li>
                    <NavLink to="/signup" onClick={handleShowNavbar}>Sign Up</NavLink>
                </li>
            }
            { auth?.accessToken ?
                <li>
                    <NavLink to={`/user/${user?._id}`} onClick={handleShowNavbar}>Your Profile</NavLink>
                </li>
                :
                <li>
                    <NavLink to="/login" onClick={handleShowNavbar}>Login</NavLink>
                </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar