import { Outlet } from "react-router-dom";

export default function Layout (props) {
    return (
        <main className="App">
            <Outlet />
        </main>
    )
}