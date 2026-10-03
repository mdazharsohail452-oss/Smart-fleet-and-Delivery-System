import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

    const [customers, setCustomers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    // ==============================
    // LOAD DASHBOARD DATA
    // ==============================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [
                customersResponse,
                driversResponse,
                vehiclesResponse,
                ordersResponse
            ] = await Promise.all([
                api.get("/customers"),
                api.get("/drivers"),
                api.get("/vehicles"),
                api.get("/orders")
            ]);

            setCustomers(customersResponse.data);
            setDrivers(driversResponse.data);
            setVehicles(vehiclesResponse.data);
            setOrders(ordersResponse.data);

        } catch (error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    // ==============================
    // STATISTICS
    // ==============================

    const availableDrivers =
        drivers.filter(
            driver =>
                driver.status === "AVAILABLE"
        ).length;

    const onDeliveryDrivers =
        drivers.filter(
            driver =>
                driver.status === "ON_DELIVERY"
        ).length;

    const availableVehicles =
        vehicles.filter(
            vehicle =>
                vehicle.status === "AVAILABLE"
        ).length;

    const inUseVehicles =
        vehicles.filter(
            vehicle =>
                vehicle.status === "IN_USE"
        ).length;

    const activeOrders =
        orders.filter(
            order =>
                order.status !== "DELIVERED" &&
                order.status !== "CANCELLED"
        ).length;

    const deliveredOrders =
        orders.filter(
            order =>
                order.status === "DELIVERED"
        ).length;

    const createdOrders =
        orders.filter(
            order =>
                order.status === "CREATED"
        ).length;

    const assignedOrders =
        orders.filter(
            order =>
                order.status === "ASSIGNED"
        ).length;

    const inTransitOrders =
        orders.filter(
            order =>
                order.status === "IN_TRANSIT"
        ).length;

    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="text-lg">
                Loading dashboard...
            </div>
        );
    }

    // ==============================
    // UI
    // ==============================

    return (
        <div>

            {/* HEADER */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold">
                    SmartFleet Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Real-time fleet and delivery overview
                </p>

            </div>

            {/* MAIN STATISTICS */}

            <div className="grid grid-cols-4 gap-6 mb-6">

                {/* CUSTOMERS */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <p className="text-gray-500">
                        Total Customers
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {customers.length}
                    </p>

                </div>

                {/* DRIVERS */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <p className="text-gray-500">
                        Total Drivers
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {drivers.length}
                    </p>

                </div>

                {/* VEHICLES */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <p className="text-gray-500">
                        Total Vehicles
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {vehicles.length}
                    </p>

                </div>

                {/* ORDERS */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <p className="text-gray-500">
                        Total Orders
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {orders.length}
                    </p>

                </div>

            </div>

            {/* DRIVER + VEHICLE STATUS */}

            <div className="grid grid-cols-2 gap-6 mb-6">

                {/* DRIVER STATUS */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <h2 className="text-xl font-semibold mb-5">
                        Driver Status
                    </h2>

                    <div className="grid grid-cols-3 gap-4">

                        <div className="bg-green-50 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                Available
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                {availableDrivers}
                            </p>

                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                On Delivery
                            </p>

                            <p className="text-2xl font-bold text-orange-600">
                                {onDeliveryDrivers}
                            </p>

                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                Offline
                            </p>

                            <p className="text-2xl font-bold">
                                {
                                    drivers.filter(
                                        driver =>
                                            driver.status ===
                                            "OFFLINE"
                                    ).length
                                }
                            </p>

                        </div>

                    </div>

                </div>

                {/* VEHICLE STATUS */}

                <div className="bg-white p-6 rounded-xl shadow-sm">

                    <h2 className="text-xl font-semibold mb-5">
                        Vehicle Status
                    </h2>

                    <div className="grid grid-cols-3 gap-4">

                        <div className="bg-green-50 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                Available
                            </p>

                            <p className="text-2xl font-bold text-green-600">
                                {availableVehicles}
                            </p>

                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                In Use
                            </p>

                            <p className="text-2xl font-bold text-orange-600">
                                {inUseVehicles}
                            </p>

                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">

                            <p className="text-sm text-gray-500">
                                Maintenance
                            </p>

                            <p className="text-2xl font-bold text-red-600">
                                {
                                    vehicles.filter(
                                        vehicle =>
                                            vehicle.status ===
                                            "MAINTENANCE"
                                    ).length
                                }
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ORDER OVERVIEW */}

            <div className="bg-white p-6 rounded-xl shadow-sm">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-semibold">
                        Order Overview
                    </h2>

                    <span className="text-gray-500">
                        Active Orders: {activeOrders}
                    </span>

                </div>

                <div className="grid grid-cols-5 gap-4">

                    <div className="bg-blue-50 p-4 rounded-lg">

                        <p className="text-sm text-gray-500">
                            Created
                        </p>

                        <p className="text-2xl font-bold text-blue-600">
                            {createdOrders}
                        </p>

                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">

                        <p className="text-sm text-gray-500">
                            Assigned
                        </p>

                        <p className="text-2xl font-bold text-purple-600">
                            {assignedOrders}
                        </p>

                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">

                        <p className="text-sm text-gray-500">
                            In Transit
                        </p>

                        <p className="text-2xl font-bold text-orange-600">
                            {inTransitOrders}
                        </p>

                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">

                        <p className="text-sm text-gray-500">
                            Delivered
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {deliveredOrders}
                        </p>

                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">

                        <p className="text-sm text-gray-500">
                            Cancelled
                        </p>

                        <p className="text-2xl font-bold">
                            {
                                orders.filter(
                                    order =>
                                        order.status ===
                                        "CANCELLED"
                                ).length
                            }
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;