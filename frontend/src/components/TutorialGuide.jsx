import { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

const tutorialSteps = [
    {
        id: 1,
        target: '.stats-cards',
        title: '📊 Welcome to DoDeck!',
        description: 'Track your tasks at a glance with these quick statistics cards showing Total, Completed, Pending, and Overdue tasks.',
        position: 'bottom'
    },
    {
        id: 2,
        target: '.mini-calendar',
        title: '📅 Mini Calendar',
        description: 'View tasks by date! Click any date to filter tasks, or double-click to expand for a detailed view. You can also create tasks directly from the calendar.',
        position: 'bottom'
    },
    {
        id: 3,
        target: '.detailed-stats',
        title: '📈 Detailed Analytics',
        description: 'Get deeper insights with category breakdowns, priority distributions, and overall progress tracking with visual charts.',
        position: 'top'
    },
    {
        id: 4,
        target: '.filter-section',
        title: '🔍 Smart Filters',
        description: 'Filter your tasks by category, priority, or status. Use the search bar to quickly find specific tasks.',
        position: 'bottom'
    },
    {
        id: 5,
        target: '.task-list',
        title: '✅ Task Management',
        description: 'Create, edit, complete, or delete tasks right here. Click the checkbox to mark tasks complete, or use the action buttons for more options.',
        position: 'top'
    },
    {
        id: 6,
        target: '.sidebar-features',
        title: '🎯 Navigation & Features',
        description: 'Access Task Management for advanced views, Analytics for detailed insights, and Quick Access for filtered task lists.',
        position: 'right'
    }
];

export default function TutorialGuide({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightPosition, setHighlightPosition] = useState(null);
    const [dialogAnimation, setDialogAnimation] = useState('slideIn');

    useEffect(() => {
        if (isOpen && currentStep < tutorialSteps.length) {
            updateHighlight();
        }
    }, [currentStep, isOpen]);

    const updateHighlight = () => {
        const step = tutorialSteps[currentStep];
        const element = document.querySelector(step.target);

        if (element) {
            const rect = element.getBoundingClientRect();
            setHighlightPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height,
                position: step.position
            });

            // Scroll element into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setDialogAnimation('slideOut');
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setDialogAnimation('slideIn');
            }, 300);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setDialogAnimation('slideOut');
            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setDialogAnimation('slideIn');
            }, 300);
        }
    };

    const handleComplete = () => {
        localStorage.setItem('tutorialCompleted', 'true');
        onClose();
    };

    const handleSkip = () => {
        localStorage.setItem('tutorialCompleted', 'true');
        onClose();
    };

    if (!isOpen) return null;

    const step = tutorialSteps[currentStep];
    const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

    // Calculate dialog position
    const getDialogPosition = () => {
        if (!highlightPosition) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

        const { top, left, width, height, position } = highlightPosition;
        const dialogWidth = 400;
        const dialogHeight = 250;
        const spacing = 20;

        switch (position) {
            case 'bottom':
                return {
                    top: `${top + height + spacing}px`,
                    left: `${Math.max(20, Math.min(window.innerWidth - dialogWidth - 20, left + width / 2 - dialogWidth / 2))}px`
                };
            case 'top':
                return {
                    top: `${Math.max(20, top - dialogHeight - spacing)}px`,
                    left: `${Math.max(20, Math.min(window.innerWidth - dialogWidth - 20, left + width / 2 - dialogWidth / 2))}px`
                };
            case 'right':
                return {
                    top: `${Math.max(20, top + height / 2 - dialogHeight / 2)}px`,
                    left: `${left + width + spacing}px`
                };
            case 'left':
                return {
                    top: `${Math.max(20, top + height / 2 - dialogHeight / 2)}px`,
                    left: `${Math.max(20, left - dialogWidth - spacing)}px`
                };
            default:
                return {
                    top: `${top + height + spacing}px`,
                    left: `${Math.max(20, left + width / 2 - dialogWidth / 2)}px`
                };
        }
    };

    return (
        <>
            {/* Dark Overlay with Clear Cutout for Highlighted Area */}
            {highlightPosition ? (
                <svg
                    className="fixed inset-0 z-[9998]"
                    style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                >
                    <defs>
                        <mask id="spotlight-mask">
                            {/* White = shows overlay, Black = transparent cutout (fully visible content) */}
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            <rect
                                x={highlightPosition.left - 10}
                                y={highlightPosition.top - 10}
                                width={highlightPosition.width + 20}
                                height={highlightPosition.height + 20}
                                rx="16"
                                fill="black"
                            />
                        </mask>
                    </defs>
                    {/* Dark overlay with cutout - highlighted area is completely clear */}
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.85)"
                        mask="url(#spotlight-mask)"
                    />
                </svg>
            ) : (
                <div className="fixed inset-0 bg-black bg-opacity-85 z-[9998]" />
            )}

            {/* Pulsing Yellow Ring Around Highlighted Area */}
            {highlightPosition && (
                <div
                    className="fixed z-[9999] pointer-events-none spotlight-ring"
                    style={{
                        top: `${highlightPosition.top - 10}px`,
                        left: `${highlightPosition.left - 10}px`,
                        width: `${highlightPosition.width + 20}px`,
                        height: `${highlightPosition.height + 20}px`,
                    }}
                />
            )}

            {/* Tutorial Dialog */}
            <div
                className={`fixed z-[10000] bg-white rounded-2xl shadow-2xl p-6 max-w-md tutorial-dialog ${dialogAnimation}`}
                style={getDialogPosition()}
            >
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-500">
                            Step {currentStep + 1} of {tutorialSteps.length}
                        </span>
                        <button
                            onClick={handleSkip}
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Skip Tour
                        </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${currentStep === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <FaArrowLeft size={14} />
                        Previous
                    </button>

                    {currentStep === tutorialSteps.length - 1 ? (
                        <button
                            onClick={handleComplete}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
                        >
                            <FaCheck size={14} />
                            Got It!
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
                        >
                            Next
                            <FaArrowRight size={14} />
                        </button>
                    )}
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                    {tutorialSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep
                                ? 'bg-yellow-500 w-6'
                                : index < currentStep
                                    ? 'bg-green-500'
                                    : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
