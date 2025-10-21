import { useState, useRef } from 'react';
import { toast } from "react-hot-toast";
import { generate_roadmap } from '@/services/api';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/auth';

export default function RoadmapForm() {

  const router = useRouter();
  const { setLimit, user } = useAuthStore();
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const toastIdRef = useRef(null);

  const funnyMessages = [
    "🤖 Teaching AI the art of procrastination...",
    "🧠 Brain cells are having a meeting...",
    "🔮 Consulting the crystal ball of knowledge...",
    "🐸 Asking wise frogs for career advice...",
    "🎯 Throwing darts at a board of skills...",
    "🦄 Summoning unicorns of productivity...",
    "🍕 Bribing pizza gods for inspiration...",
    "🎪 Training monkeys to write your roadmap...",
    "🚀 Launching rockets to Planet Success...",
    "🎭 Hiring Shakespeare to write your journey...",
    "🦸 Assembling a team of procrastination superheroes...",
    "🎲 Rolling dice to determine your fate...",
    "🧙‍♂️ Mixing potions of motivation and caffeine..."
  ];

  const handleGenerate = async () => {


    if (!goal.trim() || !description.trim() || !time.trim()) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (user.limit <= 0) {
      toast.error("You have reached your generation limit!");
      return;
    }


    const prompt = `Goal: ${goal}
    Timeframe: ${time}
    Description: ${description}
    `;
    console.log("Generated Prompt:", prompt);

    const getRandomMessage = () => funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const refreshLoadingToast = () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
      toastIdRef.current = toast.loading(getRandomMessage());
    };

    setLoading(true);
    refreshLoadingToast();
    const messageInterval = setInterval(refreshLoadingToast, 4000);

    try {
      const response = await generate_roadmap(prompt);

      if (!response?.id) {
        const errorMessage = response?.error || 'Model is overloaded. Please try again later.';
        toast.error(errorMessage);
        return;
      }

      setLimit(response.limit);
      toast.success('Roadmap generated successfully! \n You have ' + response.limit + ' generations left.');


      setTimeout(() => {
        toast.success("Redirecting to your Roadmap...")
      }, 1500);
      setTimeout(() => {
        router.push("/roadmap/" + response.id);
      }, 3000);
    } catch (err) {
      console.error('Generation error:', err);
      toast.error(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      clearInterval(messageInterval);
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      setLoading(false);
    }
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
