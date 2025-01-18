import React, { useState, useEffect } from "react";
import indiaStatesAndCities from './City'; // Make sure this is the correct import path

const zodiacSigns = [
    { name: "Aries", description: "Bold and ambitious, Aries dives headfirst into challenges." },
    { name: "Taurus", description: "Reliable and patient, Taurus enjoys the finer things in life." },
    { name: "Gemini", description: "Curious and adaptable, Gemini loves to learn and share ideas." },
    { name: "Cancer", description: "Nurturing and intuitive, Cancer deeply values home and family." },
    { name: "Leo", description: "Passionate and charismatic, Leo loves the spotlight." },
    { name: "Virgo", description: "Practical and analytical, Virgo thrives on precision and detail." },
    { name: "Libra", description: "Balanced and social, Libra seeks harmony in all aspects of life." },
    { name: "Scorpio", description: "Intense and resourceful, Scorpio has a magnetic personality." },
    { name: "Sagittarius", description: "Adventurous and optimistic, Sagittarius craves freedom." },
    { name: "Capricorn", description: "Disciplined and ambitious, Capricorn is a natural leader." },
    { name: "Aquarius", description: "Innovative and unique, Aquarius loves pushing boundaries." },
    { name: "Pisces", description: "Empathetic and artistic, Pisces lives in a world of dreams." },
];

const SBInput = () => {
    const [userDetails, setUserDetails] = useState({
        name: "",
        dateOfBirth: "",
        timeOfBirth: "",
        gender: "",
        state: "",
        city: "",
    });

    const [showInsights, setShowInsights] = useState(false);
    const [insights, setInsights] = useState(null);
    const [cities, setCities] = useState([]); // To store cities based on selected state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });

        // Update cities when state is changed
        if (name === "state") {
            setCities(indiaStatesAndCities[value] || []);
        }
    };

    const handleSubmit = () => {
        const { name, dateOfBirth, timeOfBirth, gender, state, city } = userDetails;

        if (!name || !dateOfBirth || !timeOfBirth || !gender || !state || !city) {
            alert("Please fill out all fields.");
            return;
        }

        const mockInsights = {
            kundali: "Your birth chart shows strong career potential in creative fields.",
            dailyHoroscope: "Today is a great day to focus on your personal growth.",
            gemstone: "Amethyst is recommended for you.",
            rituals: "Perform evening meditation and light a diya for positive energy.",
            doAndDonts: {
                do: "Meditate daily and focus on self-reflection.",
                dont: "Avoid unnecessary arguments or confrontations.",
            },
            meditation: "Try 10 minutes of mindfulness meditation daily.",
            sleepContent: "Listen to calming ocean waves before bed.",
        };

        setInsights(mockInsights);
        setShowInsights(true);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center relative"
            style={{
                backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCIedpxLfcroapxFCDyil99JXstDk8dHJMjg&s')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="relative max-w-5xl w-full p-8">
                <h1 className="text-5xl font-extrabold text-white text-center mb-8 tracking-wide">
                    Discover Your Personal Horoscope Insights
                </h1>
                <div className="bg-white bg-opacity-50 rounded-xl shadow-2xl border-2 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {["Name", "Date of Birth", "Time of Birth", "Gender", "State", "City"].map(
                            (field, index) => (
                                <div key={index}>
                                    <label className="block text-gray-800 font-bold mb-3 text-lg">
                                        {field}:
                                    </label>
                                    {field === "Gender" ? (
                                        <select
                                            name={field.toLowerCase().replace(/\s/g, "")}
                                            className="w-full p-4 border rounded-lg shadow-md text-gray-900 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select {field}</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    ) : field === "State" ? (
                                        <select
                                            name="state"
                                            className="w-full p-4 border rounded-lg shadow-md text-gray-900 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select State</option>
                                            {Object.keys(indiaStatesAndCities).map((state, index) => (
                                                <option key={index} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field === "City" ? (
                                        <select
                                            name="city"
                                            className="w-full p-4 border rounded-lg shadow-md text-gray-900 font-semibold bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onChange={handleChange}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={
                                                field.includes("Date")
                                                    ? "date"
                                                    : field.includes("Time")
                                                        ? "time"
                                                        : "text"
                                            }
                                            name={field.toLowerCase().replace(/\s/g, "")}
                                            placeholder={`Enter your ${field.toLowerCase()}`}
                                            className="w-full p-4 border rounded-lg shadow-md text-gray-900 font-semibold bg-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            onChange={handleChange}
                                        />
                                    )}
                                </div>
                            )
                        )}
                    </div>

                    <button
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 shadow-lg transition-transform transform hover:scale-105 text-lg"
                        onClick={handleSubmit}
                    >
                        Generate Insights
                    </button>

                    {showInsights && insights && (
                        <div className="mt-8 bg-gradient-to-r from-indigo-100 to-indigo-200 p-6 rounded-lg shadow-inner">
                            <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
                                Your Spiritual Insights
                            </h2>
                            <div className="space-y-4 text-gray-800">
                                {Object.entries(insights).map(([key, value]) => (
                                    <p key={key}>
                                        <strong>{key.replace(/([A-Z])/g, " $1")}:</strong>{" "}
                                        {typeof value === "object" ? (
                                            <ul className="list-disc ml-6">
                                                {Object.entries(value).map(([subKey, subValue]) => (
                                                    <li key={subKey}>{`${subKey}: ${subValue}`}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            value
                                        )}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <h2 className="text-4xl font-bold text-white text-center mt-12 mb-8">
                    Zodiac Signs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {zodiacSigns.map((sign, index) => (
                        <a
                            key={index}
                            href="#"
                            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {sign.name}
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {sign.description}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SBInput;
