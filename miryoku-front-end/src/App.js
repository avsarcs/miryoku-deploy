import React from "react"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Create from "./pages/Create"
import Navbar from "./components/Navbar"
import Feedback from "./pages/Feedback"
import About from "./pages/About"
import Rules from "./pages/Rules"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Feed from "./pages/Feed"
import Logout from "./pages/Logout"

import RequireAuth from "./components/RequireAuth"
import PersistLogin from "./components/PersistLogin"

import { Route, Routes} from "react-router-dom"
import Artwork from "./pages/Artwork"


const hasAuth = false;

export default function App() {
    return (<>
    <Navbar hasAuth={hasAuth} />

    <Routes>

        <Route element={<PersistLogin/>}>
            {/* public routes */}
            <Route path="/" element={<Home hasAuth={hasAuth} />}/>
            <Route path="/about" element={<About hasAuth={hasAuth} />} />
            <Route path="/rules" element={<Rules hasAuth={hasAuth} />} />

            <Route path="/login" element={<Login hasAuth={hasAuth} />} />

            <Route path="/signup" element={<Signup hasAuth={hasAuth} />} />
            <Route path="/feed" element={<Feed hasAuth={hasAuth} />}/>

            {/* routes that look differently to authenticated users */}
            <Route path="/artwork/:id" element={<Artwork hasAuth={hasAuth}  />}/>
            <Route path="/user/:id" element={<Profile hasAuth={false} />} />

            {/* routes that require authentication */}
                <Route element={<RequireAuth />}>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/create" element={<Create hasAuth={hasAuth} />} />
                    <Route path="/feedback" element={<Feedback hasAuth={hasAuth} />} />
                </Route>
            </Route>
        
    </Routes>
        </>
    )
}