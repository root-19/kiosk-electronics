import { dashboard, login, register, home } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const routes = [
    { name: 'Login', href: login().url },
    // { name: 'Register', href: register().url },
    // { name: 'Dashboard', href: dashboard().url },
    // { name: 'Home', href: home().url },
    { name: 'School Calendar', href: '/school/calendar' },
    { name: 'ICT Orientation', href: '/orientation' },
    { name: 'Program Accomplish', href: '/school/accomplish' },
    { name: 'Schedule', href: 'school/view-schedule' },
    { name: 'Grade Viewer', href: 'school/grade' },
    { name: 'Announcement', href: 'school/announcement' },
    { name: 'Learning material', href: '/school/learning' },
    { name: 'Delegates', href: '/school/delegates' },
    { name: 'Syllabus', href: '/school/syllabus' },


    // { name: 'Syllabus', href: '/school/syllabus' },




];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const minSwipeDistance = 50;

    const handleSwipe = (direction: 'left' | 'right') => {
        setActiveIndex((prev) => {
            if (direction === 'left') {
                return prev === routes.length - 1 ? 0 : prev + 1;
            } else {
                return prev === 0 ? routes.length - 1 : prev - 1;
            }
        });
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleSwipe('left');
        } else if (isRightSwipe) {
            handleSwipe('right');
        }
    };

    // Auto-advance slides for kiosk (optional)
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % routes.length);
        }, 10000); // Change slide every 10 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
                <style>{`
                    @keyframes fadeInSlide {
                        from {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    @keyframes fadeOutSlide {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(-100px);
                        }
                    }
                    .slide-enter {
                        animation: fadeInSlide 0.4s ease-out;
                    }
                    .slide-exit {
                        animation: fadeOutSlide 0.4s ease-out;
                    }
                    .swipe-indicator {
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                    }
                `}</style>
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] text-[#1b1b18] lg:justify-center dark:bg-[#0a0a0a]">
            

                {/* Main Welcome Content */}
                <div 
                    ref={containerRef}
                    className="flex grow items-center justify-center w-full relative"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Swipe Indicators */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="text-4xl text-gray-400 dark:text-gray-600 swipe-indicator">
                            ←
                        </div>
                    </div>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                        <div className="text-4xl text-gray-400 dark:text-gray-600 swipe-indicator">
                            →
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center text-center px-8"
                        >
                            <h1 className="text-4xl lg:text-6xl font-bold mb-8 dark:text-white">
                                {routes[activeIndex].name}
                            </h1>
                            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                                Tap the button below to access {routes[activeIndex].name.toLowerCase()} or swipe left/right to explore other options.
                            </p>
                            <Link
                                href={routes[activeIndex].href}
                                className="rounded-xl bg-[#1b1b18] px-12 py-6 text-xl text-white shadow-lg hover:bg-[#333] dark:bg-[#EDEDEC] dark:text-[#0a0a0a] dark:hover:bg-[#d1d1d1] transition-all duration-200 transform hover:scale-105 min-h-[60px] flex items-center justify-center"
                            >
                                Go to {routes[activeIndex].name}
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 w-full bg-white/90 dark:bg-black/90 backdrop-blur border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-around py-6 px-4">
                        {routes.map((route, index) => (
                            <button
                                key={route.name}
                                onClick={() => setActiveIndex(index)}
                                className={`px-4 py-3 text-sm lg:text-base rounded-lg transition-all duration-200 min-h-[50px] flex items-center justify-center ${
                                    activeIndex === index
                                        ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            >
                                {route.name}
                            </button>
                        ))}
                    </div>
                    
                    {/* Progress Indicators */}
                    <div className="flex justify-center pb-4">
                        <div className="flex space-x-2">
                            {routes.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        activeIndex === index
                                            ? 'bg-blue-600 dark:bg-blue-400'
                                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
