/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import api from "../services/api";

function Drivers() {

    const [drivers, setDrivers] = useState([]);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        licenseNumber: "",
        status: "AVAILABLE"
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {

        try {

            const response = await api.get("/drivers");

            setDrivers(response.data);

        } catch (error) {

            console.error(
                "Drivers API Error:",
                error
            );

        }
    };

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const saveDriver = async (e) => {

        e.preventDefault();

        try {

            if (editingId) {

                await api.put(
                    `/drivers/${editingId}`,
                    form
                );

            } else {

                await api.post(
                    "/drivers",
                    form
                );

            }

            resetForm();
            loadDrivers();

        } catch (error) {

            console.error(
                "Driver Save Error:",
                error
            );

        }
    };

    const editDriver = (driver) => {

        setEditingId(driver.id);

        setForm({
            name: driver.name,
            phone: driver.phone,
            licenseNumber: driver.licenseNumber,
            status: driver.status || "AVAILABLE"
        });

    };

    const deleteDriver = async (id) => {

        try {

            await api.delete(
                `/drivers/${id}`
            );

            loadDrivers();

        } catch (error) {

            console.error(
                "Delete Driver Error:",
                error
            );

        }
    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            name: "",
            phone: "",
            licenseNumber: "",
            status: "AVAILABLE"
        });

    };

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Drivers
            </h1>

            {/* Driver Form */}

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">

                <h2 className="text-xl font-semibold mb-4">

                    {editingId
                        ? "Edit Driver"
                        : "Add Driver"}

                </h2>

                <form
                    onSubmit={saveDriver}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Driver Name"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="text"
                        name="licenseNumber"
                        placeholder="License Number"
                        value={form.licenseNumber}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
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

                    <div className="flex gap-3">

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                        >
                            {editingId
                                ? "Update Driver"
                                : "Add Driver"}
                        </button>

                        {editingId && (

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* Drivers Table */}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gray-100">

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
                                License
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {drivers.map((driver) => (

                            <tr
                                key={driver.id}
                                className="border-t"
                            >

                                <td className="p-4">
                                    {driver.id}
                                </td>

                                <td className="p-4 font-medium">
                                    {driver.name}
                                </td>

                                <td className="p-4">
                                    {driver.phone}
                                </td>

                                <td className="p-4">
                                    {driver.licenseNumber}
                                </td>

                                <td className="p-4">

                                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                                        {driver.status}
                                    </span>

                                </td>

                                <td className="p-4">

                                    <div className="flex gap-2">

                                        <button
                                            onClick={() =>
                                                editDriver(driver)
                                            }
                                            className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteDriver(driver.id)
                                            }
                                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Drivers;