import { useEffect, useRef, useState } from "react";
import api from "../services/api";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from "react-leaflet";

import { Client } from "@stomp/stompjs";

import "leaflet/dist/leaflet.css";
//updating map

function MapUpdater({ location }) {

    const map = useMap();

    useEffect(() => {

        if (location) {

            map.setView(
                [
                    location.latitude,
                    location.longitude
                ],
                map.getZoom()
            );
        }

    }, [location, map]);

    return null;
}

function getStatusStyle(status) {

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
}

function Tracking() {

    const [driverId, setDriverId] = useState("");

    const [location, setLocation] =
        useState(null);

    const [connected, setConnected] =
        useState(false);

    const [driver, setDriver] =
        useState(null);

    const [loadingDriver, setLoadingDriver] =
        useState(false);

    const [simulating, setSimulating] =
        useState(false);

    const driverIdRef =
        useRef("");

    const simulationRef =
        useRef(null);

        //websockect

    useEffect(() => {

        const client = new Client({

            brokerURL:
                "ws://localhost:8080/ws",

            reconnectDelay: 5000,

            onConnect: () => {

                console.log(
                    "WebSocket Connected"
                );

                setConnected(true);

                client.subscribe(
                    "/topic/driver-location",
                    (message) => {

                        try {

                            const data =
                                JSON.parse(
                                    message.body
                                );

                            console.log(
                                "Live Location:",
                                data
                            );

                            // updating only  selected driver
                            if (
                                driverIdRef.current &&
                                Number(data.driverId) ===
                                Number(
                                    driverIdRef.current
                                )
                            ) {

                                setLocation({
                                    latitude:
                                        data.latitude,

                                    longitude:
                                        data.longitude
                                });
                            }

                        } catch (error) {

                            console.error(
                                "WebSocket Message Error:",
                                error
                            );
                        }
                    }
                );
            },

            onDisconnect: () => {

                console.log(
                    "WebSocket Disconnected"
                );

                setConnected(false);
            },

            onStompError: (frame) => {

                console.error(
                    "WebSocket Error:",
                    frame
                );

                setConnected(false);
            }
        });

        client.activate();

        return () => {

            client.deactivate();
        };

    }, []);


    const handleDriverChange = (e) => {

        const value =
            e.target.value;

        setDriverId(value);

        driverIdRef.current =
            value;
    };

   
//driver and location  logic
    const getLocation = async () => {

        if (!driverId) {

            alert(
                "Please enter Driver ID."
            );

            return;
        }

        setLoadingDriver(true);

        try {

            const driverResponse =
                await api.get(
                    `/drivers/${driverId}`
                );

            console.log(
                "DRIVER DATA:",
                driverResponse.data
            );

            setDriver(
                driverResponse.data
            );

        } catch (error) {

            console.error(
                "Driver API Error:",
                error
            );

            setDriver(null);

            alert(
                "Driver not found."
            );
        }

  //getting redis location
        try {

            const locationResponse =
                await api.get(
                    `/driver-state/${driverId}/location`
                );

            console.log(
                "LOCATION DATA:",
                locationResponse.data
            );

            if (
                locationResponse.data
            ) {

                const [
                    latitude,
                    longitude
                ] =
                    locationResponse.data
                        .split(",")
                        .map(Number);

                setLocation({
                    latitude,
                    longitude
                });

            } else {

                setLocation(null);
            }

        } catch (error) {

            console.error(
                "Location API Error:",
                error
            );

            setLocation(null);
        }

        setLoadingDriver(false);
    };

    const startSimulation = () => {

        if (!driverId) {

            alert(
                "Please enter Driver ID first to start."
            );

            return;
        }

        // for Preventingg multiple simulations
        if (simulationRef.current) {

            clearInterval(
                simulationRef.current
            );
        }

        setSimulating(true);

        let step = 0;

        // Sample Bengaluru route for ckecking
        const route = [

            {
                latitude: 12.975,
                longitude: 77.600
            },

            {
                latitude: 12.978,
                longitude: 77.604
            },

            {
                latitude: 12.981,
                longitude: 77.608
            },

            {
                latitude: 12.984,
                longitude: 77.612
            },

            {
                latitude: 12.987,
                longitude: 77.616
            },

            {
                latitude: 12.990,
                longitude: 77.620
            },

            {
                latitude: 12.993,
                longitude: 77.624
            },

            {
                latitude: 12.996,
                longitude: 77.628
            }
        ];

        // Immediately showing  first point so user can see 
        setLocation(route[0]);

        // Sending first location
        sendSimulationLocation(
            route[0]
        );

        step = 1;

        simulationRef.current =
            setInterval(async () => {

                if (
                    step >= route.length
                ) {

                    clearInterval(
                        simulationRef.current
                    );

                    simulationRef.current =
                        null;

                    setSimulating(false);

                    console.log(
                        "Simulation completed"
                    );

                    return;
                }

                const point =
                    route[step];

                try {

                    await sendSimulationLocation(
                        point
                    );

                    console.log(
                        "Simulated location:",
                        point
                    );

                    step++;

                } catch (error) {

                    console.error(
                        "Simulation error:",
                        error
                    );

                    clearInterval(
                        simulationRef.current
                    );

                    simulationRef.current =
                        null;

                    setSimulating(false);
                }

            }, 3000);
    };

    const sendSimulationLocation =
        async (point) => {

            await api.put(
                `/driver-state/${driverId}/location`,
                null,
                {
                    params: {
                        latitude:
                            point.latitude,

                        longitude:
                            point.longitude
                    }
                }
            );
        };

    const stopSimulation = () => {

        if (
            simulationRef.current
        ) {

            clearInterval(
                simulationRef.current
            );

            simulationRef.current =
                null;
        }

        setSimulating(false);

        console.log(
            "Simulation stopped"
        );
    };

    useEffect(() => {

        return () => {

            if (
                simulationRef.current
            ) {

                clearInterval(
                    simulationRef.current
                );
            }
        };

    }, []);

    return (

        <div>


            <div className="flex items-center justify-between mb-6">

                <h1 className="text-3xl font-bold">
                    Driver Tracking
                </h1>

                {connected ? (

                    <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700">
                        ● Live Connected
                    </span>

                ) : (

                    <span className="px-3 py-2 rounded-lg bg-red-100 text-red-700">
                        ● Disconnected
                    </span>
                )}

            </div>

                  //driver selection

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">

                <h2 className="text-xl font-semibold mb-4">
                    Track Driver
                </h2>

                <div className="flex gap-3 flex-wrap">

                    <input
                        type="number"
                        placeholder="Enter Driver ID"
                        value={driverId}
                        onChange={
                            handleDriverChange
                        }
                        className="border border-gray-300 p-3 rounded-lg"
                    />

                    <button
                        onClick={getLocation}
                        disabled={
                            loadingDriver
                        }
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >

                        {loadingDriver
                            ? "Loading..."
                            : "Get Location"}

                    </button>

                    {/* START SIMULATION */}

                    <button
                        onClick={
                            startSimulation
                        }
                        disabled={
                            simulating ||
                            !driverId
                        }
                        className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                    >

                        {simulating
                            ? "Simulating..."
                            : "Start Simulation"}

                    </button>

                    {simulating && (

                        <button
                            onClick={
                                stopSimulation
                            }
                            className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700"
                        >
                            Stop Simulation
                        </button>

                    )}

                </div>

            </div>

        
            {simulating && (

                <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">

                    <p className="font-semibold text-green-700">
                        Driver simulation is running
                    </p>

                    <p className="text-sm text-green-600 mt-1">
                        Location is changing every 3 seconds.
                    </p>

                </div>

            )}

            {/*  DRIVER INFORMATIOn*/}

            {driver && (

                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Driver Information
                    </h2>

                    <div className="grid grid-cols-3 gap-6">

                        <div>

                            <p className="text-gray-500">
                                Driver Name
                            </p>

                            <p className="font-semibold text-lg">
                                {driver.name}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Phone
                            </p>

                            <p className="font-semibold text-lg">
                                {driver.phone}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500 mb-1">
                                Status
                            </p>

                            <span
                                className={`inline-block px-3 py-1 rounded-full font-semibold ${getStatusStyle(
                                    driver.status
                                )}`}
                            >
                                {driver.status}
                            </span>

                        </div>

                    </div>

                </div>
            )}

            {/* CURRENT LOCATION */}

            {location && (

                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Current Location
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <p className="text-gray-500">
                                Latitude
                            </p>

                            <p className="font-semibold">
                                {location.latitude}
                            </p>

                        </div>

                        <div>

                            <p className="text-gray-500">
                                Longitude
                            </p>

                            <p className="font-semibold">
                                {location.longitude}
                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================
                LIVE MAP
            ================================== */}

            {location && (

                <div className="bg-white p-4 rounded-xl shadow-sm">

                    <h2 className="text-xl font-semibold mb-4">
                        Live Driver Location
                    </h2>

                    <MapContainer
                        center={[
                            location.latitude,
                            location.longitude
                        ]}
                        zoom={13}
                        style={{
                            height: "500px",
                            width: "100%"
                        }}
                    >

                        <MapUpdater
                            location={location}
                        />

                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            position={[
                                location.latitude,
                                location.longitude
                            ]}
                        >

                            <Popup>

                                <strong>
                                    Driver {driverId}
                                </strong>

                                <br />

                                Name:{" "}
                                {driver?.name}

                                <br />

                                Phone:{" "}
                                {driver?.phone}

                                <br />

                                Status:{" "}
                                {driver?.status}

                                <br />

                                Latitude:{" "}
                                {location.latitude}

                                <br />

                                Longitude:{" "}
                                {location.longitude}

                            </Popup>

                        </Marker>

                    </MapContainer>

                </div>
            )}

        </div>
    );
}

export default Tracking;