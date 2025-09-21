import React, { useState } from 'react';
import { SimpleIcons } from '../common/SimpleIcons';

const MoodEntry = ({ onSubmit, todaysMood, isSubmitting }) => {
  const [currentMood, setCurrentMood] = useState(todaysMood?.mood || 3);
  const [moodNote, setMoodNote] = useState(todaysMood?.note || '');

  const moodOptions = [
    { value: 1, emoji: '😰', label: 'Very Low', color: 'bg-red-500', hoverColor: 'hover:bg-red-600' },
    { value: 2, emoji: '😟', label: 'Low', color: 'bg-orange-500', hoverColor: 'hover:bg-orange-600' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600' },
    { value: 4, emoji: '😊', label: 'Good', color: 'bg-green-500', hoverColor: 'hover:bg-green-600' },
    { value: 5, emoji: '😁', label: 'Great', color: 'bg-green-600', hoverColor: 'hover:bg-green-700' }
  ];

  const handleSubmit = () => {
    onSubmit(currentMood, moodNote.trim());
  };

  const selectedMoodOption = moodOptions.find(option => option.value === currentMood);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Daily Mood Check-in</h2>
        <p className="text-gray-600">How are you feeling today?</p>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                currentMood === option.value
                  ? `${option.color} border-gray-400 text-white shadow-lg scale-105`
                  : `border-gray-200 hover:border-gray-300 ${option.hoverColor} hover:text-white`
              }`}
              onClick={() => setCurrentMood(option.value)}
            >
              <div className="text-2xl mb-2">{option.emoji}</div>
              <div className="text-sm font-medium">{option.label}</div>
              <div className="text-xs opacity-75">{option.value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">{selectedMoodOption.emoji}</div>
        <div className="text-lg font-medium text-gray-900">
          You're feeling <span className="capitalize">{selectedMoodOption.label.toLowerCase()}</span>
        </div>
        <div className="text-sm text-gray-600">Mood Level: {currentMood}/5</div>
      </div>

      {/* Note Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What's contributing to your mood today? (Optional)
        </label>
        <textarea
          value={moodNote}
          onChange={(e) => setMoodNote(e.target.value)}
          placeholder="Share what's on your mind..."
          maxLength={200}
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {moodNote.length}/200 characters
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : `${selectedMoodOption.color} ${selectedMoodOption.hoverColor} hover:shadow-lg`
        }`}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
            Saving...
          </>
        ) : (
          <>
            <SimpleIcons.Check className="w-5 h-5 mr-2" />
            {todaysMood ? 'Update Today\'s Mood' : 'Save Today\'s Mood'}
          </>
        )}
      </button>

      {/* Today's Status */}
      {todaysMood && !isSubmitting && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{moodOptions.find(o => o.value === todaysMood.mood)?.emoji}</div>
            <div>
              <div className="font-medium text-blue-900">
                Today's mood: {moodOptions.find(o => o.value === todaysMood.mood)?.label}
              </div>
              {todaysMood.note && (
                <div className="text-sm text-blue-700">"{todaysMood.note}"</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodEntry;
