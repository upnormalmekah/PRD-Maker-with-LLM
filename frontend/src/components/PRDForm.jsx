import React, { useState } from 'react';

const PRDForm = () => {
    const [documentVersion, setDocumentVersion] = useState('');
    const [productName, setProductName] = useState('');
    const [documentOwner, setDocumentOwner] = useState('');
    const [developer, setDeveloper] = useState('');
    const [stakeholder, setStakeholder] = useState('');
    const [projectOverview, setProjectOverview] = useState('');
    const [darciRoles, setDarciRoles] = useState({
        decider: '',
        accountable: '',
        responsible: '',
        consulted: '', 
        informed: ''
    });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [generatedPRD, setGeneratedPRD] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const prdData = {
            documentVersion,
            productName,
            documentOwner,
            developer,
            stakeholder,
            projectOverview,
            darciRoles,
            startDate,
            endDate,
        };
    
        try {
            const response = await fetch("http://localhost:5000/process-prd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(prdData),
            });

            const result = await response.json();
            if (result.prd) {
                console.log("Generated PRD:", result.prd);
            } else {
                console.error("Error:", result.error);
            }
        } catch (error) {
            console.error("Error submitting PRD:", error);
        }
    };
    

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Product Requirements Document</h1>
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* PRD Identity */}
                    <fieldset className="border border-gray-300 rounded-lg p-6">
                        <legend className="text-xl font-semibold text-gray-700">PRD Identity</legend>
                        <div className="space-y-4 mt-4">
                            <label className="block">
                                <span className="block font-medium text-gray-700">Document Version:</span>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={documentVersion}
                                    onChange={(e) => setDocumentVersion(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="block font-medium text-gray-700">Product Name:</span>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="block font-medium text-gray-700">Document Owner:</span>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={documentOwner}
                                    onChange={(e) => setDocumentOwner(e.target.value)}
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="owner1">Owner 1</option>
                                    <option value="owner2">Owner 2</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="block font-medium text-gray-700">Developer:</span>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={developer}
                                    onChange={(e) => setDeveloper(e.target.value)}
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="dev1">Developer 1</option>
                                    <option value="dev2">Developer 2</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="block font-medium text-gray-700">Stakeholder:</span>
                                <select
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={stakeholder}
                                    onChange={(e) => setStakeholder(e.target.value)}
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="stakeholder1">Stakeholder 1</option>
                                    <option value="stakeholder2">Stakeholder 2</option>
                                </select>
                            </label>
                        </div>
                    </fieldset>

                    {/* Overview */}
                    <fieldset className="border border-gray-300 rounded-lg p-6">
                        <legend className="text-xl font-semibold text-gray-700">Overview</legend>
                        <label className="block mt-4">
                            <span className="block font-medium text-gray-700">Project Overview:</span>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={projectOverview}
                                onChange={(e) => setProjectOverview(e.target.value)}
                                required
                            ></textarea>
                        </label>
                    </fieldset>

                    {/* DARCI */}
                    <fieldset className="border border-gray-300 rounded-lg p-6">
                        <legend className="text-xl font-semibold text-gray-700">DARCI</legend>
                        <div className="space-y-4 mt-4">
                            {['Decider', 'Accountable', 'Responsible', 'Consulted', 'Informed'].map((role) => (
                                <label className="block" key={role}>
                                    <span className="block font-medium text-gray-700">{role}:</span>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={darciRoles[role.toLowerCase()]}
                                        onChange={(e) => setDarciRoles({ ...darciRoles, [role.toLowerCase()]: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        <option value={`${role.toLowerCase()}1`}>{role} 1</option>
                                        <option value={`${role.toLowerCase()}2`}>{role} 2</option>
                                    </select>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Timeline */}
                    <fieldset className="border border-gray-300 rounded-lg p-6">
                        <legend className="text-xl font-semibold text-gray-700">Timeline</legend>
                        <div className="space-y-4 mt-4">
                            <label className="block">
                                <span className="block font-medium text-gray-700">Start Date:</span>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="block font-medium text-gray-700">End Date:</span>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </fieldset>

                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PRDForm;