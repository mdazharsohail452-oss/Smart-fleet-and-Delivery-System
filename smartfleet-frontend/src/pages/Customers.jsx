
import { useEffect, useState } from "react";
import api from "../services/api";

function Customers() {

    const emptyForm = {
        name: "",
        email: "",
        phone: "",
        address: ""
    };

    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(emptyForm);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);

    // ==============================
    // LOAD CUSTOMERS
    // ==============================

    const loadCustomers = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/customers");

            setCustomers(response.data);

        } catch (error) {

            console.error(
                "Error loading customers:",
                error
            );

            alert(
                "Failed to load customers."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // ==============================
    // FORM CHANGE
    // ==============================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };

    // ==============================
    // ADD / UPDATE CUSTOMER
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !form.name ||
            !form.email ||
            !form.phone ||
            !form.address
        ) {

            alert(
                "Please fill all fields."
            );

            return;
        }

        try {

            setSaving(true);

            if (editingId) {

                // UPDATE

                await api.put(
                    `/customers/${editingId}`,
                    form
                );

                alert(
                    "Customer updated successfully."
                );

            } else {

                // CREATE

                await api.post(
                    "/customers",
                    form
                );

                alert(
                    "Customer added successfully."
                );
            }

            setForm(emptyForm);
            setEditingId(null);

            await loadCustomers();

        } catch (error) {

            console.error(
                "Customer save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                "Failed to save customer."
            );

        } finally {

            setSaving(false);
        }
    };

    // ==============================
    // EDIT
    // ==============================

    const handleEdit = (customer) => {

        setEditingId(customer.id);

        setForm({
            name: customer.name || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==============================
    // CANCEL EDIT
    // ==============================

    const handleCancelEdit = () => {

        setEditingId(null);
        setForm(emptyForm);
    };

    // ==============================
    // DELETE
    // ==============================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this customer?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/customers/${id}`
            );

            alert(
                "Customer deleted successfully."
            );

            await loadCustomers();

        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );

            alert(
                "Failed to delete customer."
            );
        }
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="text-lg">
                Loading customers...
            </div>
        );
    }

    // ==============================
    // UI
    // ==============================

    return (
        <div>

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Customers
                </h1>

                <div className="text-sm text-gray-500">
                    Total Customers: {customers.length}
                </div>

            </div>

            {/* CUSTOMER FORM */}

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">

                <h2 className="text-xl font-semibold mb-5">

                    {editingId
                        ? "Edit Customer"
                        : "Add Customer"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >

                    {/* NAME */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter customer name"
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                    </div>

                    {/* EMAIL */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                    </div>

                    {/* PHONE */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                    </div>

                    {/* ADDRESS */}

                    <div>

                        <label className="block text-sm font-medium mb-1">
                            Address
                        </label>

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter address"
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                    </div>

                    {/* BUTTONS */}

                    <div className="col-span-2 flex gap-3 mt-2">

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Customer"
                                    : "Add Customer"}

                        </button>

                        {editingId && (

                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* CUSTOMER TABLE */}

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
                                    Email
                                </th>

                                <th className="text-left p-4">
                                    Phone
                                </th>

                                <th className="text-left p-4">
                                    Address
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {customers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="text-center p-8 text-gray-500"
                                    >
                                        No customers found.
                                    </td>

                                </tr>

                            ) : (

                                customers.map(
                                    (customer) => (

                                        <tr
                                            key={customer.id}
                                            className="border-t"
                                        >

                                            <td className="p-4">
                                                {customer.id}
                                            </td>

                                            <td className="p-4 font-semibold">
                                                {customer.name}
                                            </td>

                                            <td className="p-4">
                                                {customer.email}
                                            </td>

                                            <td className="p-4">
                                                {customer.phone}
                                            </td>

                                            <td className="p-4">
                                                {customer.address}
                                            </td>

                                            <td className="p-4">

                                                <div className="flex gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                customer
                                                            )
                                                        }
                                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                customer.id
                                                            )
                                                        }
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Customers;