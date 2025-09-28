import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, potatoVarieties, onLogout, onLoadVarieties, onCreateVariety }) => {
  const [newVariety, setNewVariety] = useState({ name: '', description: '', origin: '', color: 'Yellow', bestFor: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    onLoadVarieties();
  }, [onLoadVarieties]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVariety(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleCreateVariety = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...newVariety };
    if (imageFile) {
      dataToSubmit.image = imageFile;
    }
    await onCreateVariety(dataToSubmit);
    setNewVariety({ name: '', description: '', origin: '', color: 'Yellow', bestFor: '' });
    setImageFile(null);
    e.target.reset(); // Reset form fields including file input
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">PotatoPedia Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Admin</a>
            <button onClick={onLogout} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Create New Variety Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a New Potato Variety</h2>
          <form onSubmit={handleCreateVariety} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" value={newVariety.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="col-span-1">
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
              <input type="text" name="origin" id="origin" value={newVariety.origin} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" value={newVariety.description} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
            </div>
            <div className="col-span-1">
              <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
              <select name="color" id="color" value={newVariety.color} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>White</option>
                <option>Yellow</option>
                <option>Red</option>
                <option>Purple</option>
                <option>Blue</option>
              </select>
            </div>
             <div className="col-span-1">
              <label htmlFor="bestFor" className="block text-sm font-medium text-gray-700">Best For</label>
              <input type="text" name="bestFor" id="bestFor" value={newVariety.bestFor} onChange={handleInputChange} placeholder="e.g., Frying, Baking" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                <input type="file" name="image" id="image" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
            </div>
            <div className="col-span-2 text-right">
              <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add Variety</button>
            </div>
          </form>
        </div>

        {/* Varieties List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Potato Variety Collection</h2>
          {potatoVarieties.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No potato varieties have been added yet. Be the first!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {potatoVarieties.map(variety => (
                <div key={variety.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {variety.image && variety.image.thumbnail && <img src={variety.image.thumbnail} alt={variety.name} className="w-full h-48 object-cover"/>}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">{variety.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Origin: {variety.origin}</p>
                    <p className="text-sm text-gray-500 mt-2 h-20 overflow-y-auto">{variety.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">{variety.color}</span>
                        <p className="text-xs text-gray-500">By {variety.contributor?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
