import { NavLink } from "react-router-dom";

function Sidebar() {

    const menuItems = [
        { name: "Dashboard", path: "/" },
        { name: "Customers", path: "/customers" },
        { name: "Drivers", path: "/drivers" },
        { name: "Vehicles", path: "/vehicles" },
        { name: "Orders", path: "/orders" },
        { name: "Tracking", path: "/tracking" },
        { name: "Analytics", path: "/analytics" }
    ];

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">

            <h1 className="text-2xl font-bold mb-10">
                SmartFleet
            </h1>

            <nav className="space-y-2">

                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block px-4 py-3 rounded-lg ${
                                isActive
                                    ? "bg-blue-600"
                                    : "hover:bg-slate-800"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}

            </nav>

        </aside>
    );
}

export default Sidebar;