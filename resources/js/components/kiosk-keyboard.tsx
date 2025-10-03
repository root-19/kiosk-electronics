import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete, ArrowUp, ArrowRight } from 'lucide-react';

interface KioskKeyboardProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const QWERTY_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.']
];

const QWERTY_LAYOUT_SHIFT = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '@']
];

export default function KioskKeyboard({ value, onChange, onClose }: KioskKeyboardProps) {
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const keyboardRef = useRef<HTMLDivElement>(null);

  const currentLayout = isShiftPressed || isCapsLock ? QWERTY_LAYOUT_SHIFT : QWERTY_LAYOUT;

  const handleKeyClick = (key: string) => {
    if (key === 'Backspace') {
      onChange(value.slice(0, -1));
    } else if (key === ' ') {
      onChange(value + ' ');
    } else {
      onChange(value + key);
    }
    
    // Auto-release shift after typing
    if (isShiftPressed && !isCapsLock) {
      setIsShiftPressed(false);
    }
  };

  const handleSpecialKey = (action: string) => {
    switch (action) {
      case 'backspace':
        onChange(value.slice(0, -1));
        break;
      case 'shift':
        setIsShiftPressed(!isShiftPressed);
        break;
      case 'caps':
        setIsCapsLock(!isCapsLock);
        setIsShiftPressed(false);
        break;
      case 'space':
        onChange(value + ' ');
        break;
      case 'enter':
        onChange(value + '\n');
        break;
      case 'close':
        onClose();
        break;
    }
  };

  // Handle keyboard focus when visible
  useEffect(() => {
    if (keyboardRef.current) {
      const firstButton = keyboardRef.current.querySelector('button') as HTMLButtonElement;
      if (firstButton) {
        firstButton.focus();
      }
    }
  }, []);

  // Handle escape key to close keyboard
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div 
        ref={keyboardRef}
        className="bg-white rounded-t-2xl shadow-2xl p-6 w-full max-w-4xl mx-4 mb-4 animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Kiosk Keyboard</h3>
         <Button
  variant="ghost"
  size="sm"
  onClick={(e) => {
    e.stopPropagation(); // prevent bubbling
    onClose();           // directly call parent close handler
  }}
  className="text-gray-500 hover:text-gray-700"
>
  ✕
</Button>

        </div>

        {/* Keyboard Layout */}
        <div className="space-y-2">
          {/* Number Row */}
          <div className="flex justify-center gap-1">
            {currentLayout[0].map((key) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => handleKeyClick(key)}
                className="w-12 h-12 text-lg font-medium hover:bg-blue-100 hover:border-blue-300"
              >
                {key}
              </Button>
            ))}
          </div>

          {/* QWERTY Rows */}
          {currentLayout.slice(1).map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleKeyClick(key)}
                  className="w-12 h-12 text-lg font-medium hover:bg-blue-100 hover:border-blue-300"
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}

          {/* Special Keys Row */}
          <div className="flex justify-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpecialKey('shift')}
              className={cn(
                "px-4 h-12 text-sm font-medium hover:bg-blue-100 hover:border-blue-300",
                isShiftPressed && "bg-blue-100 border-blue-300"
              )}
            >
              <ArrowUp className="w-4 h-4 mr-1" />
              Shift
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpecialKey('caps')}
              className={cn(
                "px-4 h-12 text-sm font-medium hover:bg-blue-100 hover:border-blue-300",
                isCapsLock && "bg-blue-100 border-blue-300"
              )}
            >
              Caps
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpecialKey('space')}
              className="flex-1 max-w-xs h-12 text-sm font-medium hover:bg-blue-100 hover:border-blue-300"
            >
              Space
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpecialKey('backspace')}
              className="px-4 h-12 text-sm font-medium hover:bg-blue-100 hover:border-blue-300"
            >
              <Delete className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSpecialKey('enter')}
              className="px-4 h-12 text-sm font-medium hover:bg-blue-100 hover:border-blue-300"
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Enter
            </Button>
          </div>
        </div>
        

        {/* Instructions */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Tap keys to type • Press ESC to close
        </div>
      </div>
    </div>
  );
}
