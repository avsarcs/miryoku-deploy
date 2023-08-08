import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./context/authProvider"
import { UserProvider } from "./context/UserContext"

import App from "./App"

ReactDOM.render(<React.StrictMode>
                    <BrowserRouter>
                        <AuthProvider>
                            <UserProvider>
                                <Routes>
                                    <Route path="/*" element={<App />} />
                                </Routes>
                            </UserProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </React.StrictMode>, document.getElementById("root"))