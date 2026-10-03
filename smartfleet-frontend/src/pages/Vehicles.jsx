import { useEffect, useState } from "react";
import api from "../services/api";

function Vehicles() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingVehicle, setUpdatingVehicle] = useState(null);

    const loadVehicles = async () => {

        try {

            setLoading(true);

            const response = await api.get("/vehicles");

            setVehicles(response.data);

        } catch (error) {

            console.error(
                "Error loading vehicles:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadVehicles();
    }, []);

 
    const handleStatusChange = async (
        vehicleId,
        newStatus
    ) => {

        try {

            setUpdatingVehicle(vehicleId);

            const vehicle =
                vehicles.find(
                    (item) => item.id === vehicleId
                );

            await api.put(
                `/vehicles/${vehicleId}`,
                {
                    vehicleNumber:
                        vehicle.vehicleNumber,

                    vehicleType:
                        vehicle.vehicleType,

                    capacity:
                        vehicle.capacity,

                    status:
                        newStatus,

                    driverId:
                        vehicle.driverId
                }
            );

            await loadVehicles();

        } catch (error) {

            console.error(
                "Vehicle status update error:",
                error
            );

            alert(
                "Failed to update vehicle status."
            );

        } finally {

            setUpdatingVehicle(null);
        }
    };


    const handleDelete = async (vehicleId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this vehicle?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/vehicles/${vehicleId}`
            );

            await loadVehicles();

        } catch (error) {

            console.error(
                "Delete vehicle error:",
                error
            );

            alert(
                "Failed to delete vehicle."
            );
        }
    };

    const getStatusStyle = (status) => {

        switch (status) {

            case "AVAILABLE":
                return "bg-green-100 text-green-700";

            case "IN_USE":
                return "bg-orange-100 text-orange-700";

            case "MAINTENANCE":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {

        return (
            <div className="text-lg">
                Loading vehicles...
            </div>
        );
    }


    return (
        <div>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Vehicles
                </h1>

                <div className="text-sm text-gray-500">
                    Total Vehicles: {vehicles.length}
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
                                    Vehicle Number
                                </th>

                                <th className="text-left p-4">
                                    Type
                                </th>

                                <th className="text-left p-4">
                                    Capacity
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Driver ID
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {vehicles.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center p-8 text-gray-500"
                                    >
                                        No vehicles found.
                                    </td>

                                </tr>

                            ) : (

                                vehicles.map((vehicle) => (

                                    <tr
                                        key={vehicle.id}
                                        className="border-t"
                                    >

                                        {/* ID */}

                                        <td className="p-4">
                                            {vehicle.id}
                                        </td>

                                        {/* VEHICLE NUMBER */}

                                        <td className="p-4 font-semibold">
                                            {vehicle.vehicleNumber}
                                        </td>

                                        {/* TYPE */}

                                        <td className="p-4">
                                            {vehicle.vehicleType}
                                        </td>

                                        {/* CAPACITY */}

                                        <td className="p-4">
                                            {vehicle.capacity}
                                        </td>

                                        {/* STATUS */}

                                        <td className="p-4">

                                            <select
                                                value={
                                                    vehicle.status ||
                                                    "AVAILABLE"
                                                }
                                                disabled={
                                                    updatingVehicle ===
                                                    vehicle.id
                                                }
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        vehicle.id,
                                                        e.target.value
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg font-semibold border-0 ${getStatusStyle(
                                                    vehicle.status
                                                )}`}
                                            >

                                                <option value="AVAILABLE">
                                                    AVAILABLE
                                                </option>

                                                <option value="IN_USE">
                                                    IN_USE
                                                </option>

                                                <option value="MAINTENANCE">
                                                    MAINTENANCE
                                                </option>

                                            </select>

                                        </td>

                                        {/* DRIVER */}

                                        <td className="p-4">
                                            {vehicle.driverId ??
                                                "Not Assigned"}
                                        </td>

                                        {/* DELETE */}

                                        <td className="p-4">

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        vehicle.id
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

export default Vehicles;