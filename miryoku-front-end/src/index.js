import React from "react"
import ReactDOM from "react-dom"
import { HashRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/authProvider"
import { UserProvider } from "./context/UserContext"

import App from "./App"

ReactDOM.render(<React.StrictMode>
                    <HashRouter>
                        <AuthProvider>
                            <UserProvider>
                                <Routes>
                                    <Route path="/*" element={<App />} />
                                </Routes>
                            </UserProvider>
                        </AuthProvider>
                    </HashRouter>
                </React.StrictMode>, document.getElementById("root"))