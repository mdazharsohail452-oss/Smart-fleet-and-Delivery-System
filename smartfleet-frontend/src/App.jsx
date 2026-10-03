import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import Tracking from "./pages/Tracking";

function App() {

    return (

        <BrowserRouter>

            <div className="flex min-h-screen">

                <Sidebar />

                <div className="flex-1">

                    <Navbar />

                    <main className="p-6">

                        <Routes>

                            <Route
                                path="/"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/orders"
                                element={<Orders />}
                            />

                            <Route
                                path="/customers"
                                element={<Customers />}
                            />

                            <Route
                                path="/drivers"
                                element={<Drivers />}
                            />

                            <Route
                                path="/vehicles"
                                element={<Vehicles />}
                            />
                            <Route
                                path="/tracking"
                                element={<Tracking />}
/>

                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>

    );
}

export default App;