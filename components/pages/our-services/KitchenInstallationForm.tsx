"use client"

import { useState } from 'react';

export default function KitchenInstallationForm() {
  const [services, setServices] = useState([
    { id: 1, title: "Kitchen Design", description: "Custom kitchen design solutions" },
    { id: 2, title: "Installation", description: "Professional installation services" },
    { id: 3, title: "Maintenance", description: "Regular maintenance and support" },
    { id: 4, title: "Consultation", description: "Expert consultation services" }
  ]);

  const updateService = (id: number, field: 'title' | 'description', value: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Section Header */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
          <input
            type="text"
            placeholder="Enter section title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Title *</label>
          <input
            type="text"
            placeholder="Enter section subtitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Kitchen Installation Services</h3>
        
        {services.map((service) => (
          <div key={service.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Title *</label>
                <input
                  type="text"
                  placeholder="Enter service title"
                  value={service.title}
                  onChange={(e) => updateService(service.id, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  placeholder="Enter service description"
                  value={service.description}
                  onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
