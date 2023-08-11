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
import Footer from "./components/Footer"

import RequireAuth from "./components/RequireAuth"
import PersistLogin from "./components/PersistLogin"

import User from "./dummyData/dummy-user.json"
import Artworks from "./dummyData/dummy-artworks.json"

import { Route, Routes} from "react-router-dom"
import Artwork from "./pages/Artwork"


const hasAuth = false;

export default function App() {
    return (<>
    <Navbar user={User[0]} hasAuth={hasAuth} />

    <Routes>

        <Route element={<PersistLogin/>}>
            {/* public routes */}
            <Route path="/" element={<Home hasAuth={hasAuth} user={User[0]} artworks={Artworks} />}/>
            <Route path="/about" element={<About hasAuth={hasAuth} user={User[0]}/>} />
            <Route path="/rules" element={<Rules hasAuth={hasAuth} user={User[0]}/>} />

            <Route path="/login" element={<Login hasAuth={hasAuth} user={User[0]}/>} />

            <Route path="/signup" element={<Signup hasAuth={hasAuth} user={User[0]}/>} />
            <Route path="/feed" element={<Feed hasAuth={hasAuth} user={User[0]} artworks={Artworks} />}/>

            {/* routes that look differently to authenticated users */}
            <Route path="/artwork/:id" element={<Artwork hasAuth={hasAuth} user={User[0]} />}/>
            <Route path="/user/:id" element={<Profile hasAuth={false} user={User[0]}/>} />

            {/* routes that require authentication */}
                <Route element={<RequireAuth />}>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/create" element={<Create hasAuth={hasAuth} user={User[0]}/>} />
                    <Route path="/feedback" element={<Feedback hasAuth={hasAuth} user={User[0]}/>} />
                </Route>
            </Route>
        
    </Routes>
    <Footer/>
        </>
    )
}