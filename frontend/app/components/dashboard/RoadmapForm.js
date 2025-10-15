

import { useState } from 'react';
import { toast } from "react-hot-toast";
import { generate_roadmap } from '@/services/api';

export default function RoadmapForm() {
  const [goal, setGoal] = useState('Web Development');
  const [description, setDescription] = useState('MERN stack with React, Node.js, Express, MongoDB');
  const [time, setTime] = useState('3 months');
  const [loading, setLoading] = useState(false);


  const handleGenerate = async () => {

    const prompt = `${description}. The goal is to ${goal} in ${time}. Provide a detailed roadmap with milestones and technologies to learn.`;
    console.log("Generated Prompt:", prompt);

    if (!goal || !description || !time) {
      throw new Error('Please fill all required fields');
    }

    setLoading(true);

    try {

      const response = await generate_roadmap(prompt);
      console.log('Roadmap generated successfully:', response);
      toast.success('Roadmap generated successfully!');


      if (response.ok) {
        setGoal('');
        setDescription('');
        setTime('');
      } else {
        setLoading(false);
        throw new Error('Error response from server: ' + (data.error || 'Unknown error') );
      }
    } catch (err) {
      setLoading(false);
      throw new Error('Failed to generate roadmap');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Generate New Roadmap</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Goal Name :</label>
        <input
          type="text"
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter your project goal: (e.g., Learn Web Development)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Prompt / Description *</label>
        <textarea
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter what you want the roadmap to cover... (e.g., technologies, milestones, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Time Estimate</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Enter time estimate (e.g., 3 months, 1 year, etc.)"
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className={`w-full mt-2 px-4 py-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Generating...' : 'Generate Roadmap'}
      </button>
    </div>
  );
}
