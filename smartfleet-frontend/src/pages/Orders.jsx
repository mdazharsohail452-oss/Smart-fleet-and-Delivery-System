import { useEffect, useState } from "react";
import api from "../services/api";

function Drivers() {

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingDriver, setUpdatingDriver] = useState(null);


    const loadDrivers = async () => {

        try {

            setLoading(true);

            const response = await api.get("/drivers");

            setDrivers(response.data);

        } catch (error) {

            console.error(
                "Error loading drivers:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadDrivers();
    }, []);

    const handleStatusChange = async (
        driverId,
        newStatus
    ) => {

        try {

            setUpdatingDriver(driverId);

            await api.put(
                `/drivers/${driverId}/status`,
                null,
                {
                    params: {
                        status: newStatus
                    }
                }
            );

            await loadDrivers();

        } catch (error) {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Failed to update driver status."
            );

        } finally {

            setUpdatingDriver(null);
        }
    };

  
    const handleDelete = async (driverId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this driver?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/drivers/${driverId}`
            );

            await loadDrivers();

        } catch (error) {

            console.error(
                "Delete driver error:",
                error
            );

            alert(
                "Failed to delete driver."
            );
        }
    };

 
    const getStatusStyle = (status) => {

        switch (status) {

            case "AVAILABLE":
                return "bg-green-100 text-green-700";

            case "ON_DELIVERY":
                return "bg-orange-100 text-orange-700";

            case "OFFLINE":
                return "bg-gray-200 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };


    if (loading) {

        return (
            <div className="text-lg">
                Loading drivers...
            </div>
        );
    }


    return (
        <div>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Drivers
                </h1>

                <div className="text-sm text-gray-500">
                    Total Drivers: {drivers.length}
                </div>

            </div>

            {/* TABLE */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left p-4">
                                    ID
                                </th>

                                <th className="text-left p-4">
                                    Name
                                </th>

                                <th className="text-left p-4">
                                    Phone
                                </th>

                                <th className="text-left p-4">
                                    License Number
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Latitude
                                </th>

                                <th className="text-left p-4">
                                    Longitude
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {drivers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center p-8 text-gray-500"
                                    >
                                        No drivers found.
                                    </td>

                                </tr>

                            ) : (

                                drivers.map((driver) => (

                                    <tr
                                        key={driver.id}
                                        className="border-t"
                                    >

                                        {/* ID */}

                                        <td className="p-4">
                                            {driver.id}
                                        </td>

                                        {/* NAME */}

                                        <td className="p-4 font-semibold">
                                            {driver.name}
                                        </td>

                                        {/* PHONE */}

                                        <td className="p-4">
                                            {driver.phone}
                                        </td>

                                        {/* LICENSE */}

                                        <td className="p-4">
                                            {driver.licenseNumber}
                                        </td>

                                        {/* STATUS */}

                                        <td className="p-4">

                                            <select
                                                value={
                                                    driver.status ||
                                                    "OFFLINE"
                                                }
                                                disabled={
                                                    updatingDriver ===
                                                    driver.id
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        driver.id,
                                                        e.target.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg font-semibold border-0 ${getStatusStyle(
                                                    driver.status
                                                )}`}
                                            >

                                                <option value="AVAILABLE">
                                                    AVAILABLE
                                                </option>

                                                <option value="ON_DELIVERY">
                                                    ON_DELIVERY
                                                </option>

                                                <option value="OFFLINE">
                                                    OFFLINE
                                                </option>

                                            </select>

                                        </td>

                                        {/* LATITUDE */}

                                        <td className="p-4">
                                            {driver.latitude ??
                                                "N/A"}
                                        </td>

                                        {/* LONGITUDE */}

                                        <td className="p-4">
                                            {driver.longitude ??
                                                "N/A"}
                                        </td>

                                        {/* DELETE */}

                                        <td className="p-4">

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        driver.id
                                                    )
                                                }
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Drivers;