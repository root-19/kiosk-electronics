import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Keyboard, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import KioskKeyboard from '@/components/kiosk-keyboard';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [activeInput, setActiveInput] = useState<'email' | 'password' | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleInputFocus = (inputType: 'email' | 'password') => {
        setActiveInput(inputType);
        setIsKeyboardVisible(true);
    };

    const handleKeyPress = (key: string) => {
        if (activeInput === 'email') {
            if (key === 'Backspace') {
                setEmail(prev => prev.slice(0, -1));
            } else if (key === 'Enter') {
                passwordRef.current?.focus();
                setActiveInput('password');
            } else if (key === ' ') {
                setEmail(prev => prev + ' ');
            } else if (key.length === 1) {
                setEmail(prev => prev + key);
            }
        } else if (activeInput === 'password') {
            if (key === 'Backspace') {
                setPassword(prev => prev.slice(0, -1));
            } else if (key === 'Enter') {
                // Submit form
                const form = passwordRef.current?.closest('form');
                if (form) {
                    form.requestSubmit();
                }
                setIsKeyboardVisible(false);
                setActiveInput(null);
            } else if (key === ' ') {
                setPassword(prev => prev + ' ');
            } else if (key.length === 1) {
                setPassword(prev => prev + key);
            }
        }
    };

    const handleKeyboardClose = () => {
        setIsKeyboardVisible(false);
        setActiveInput(null);
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Don't close keyboard if user clicked on keyboard buttons
        setTimeout(() => {
            if (!document.activeElement?.closest('.kiosk-keyboard')) {
                setIsKeyboardVisible(false);
                setActiveInput(null);
            }
        }, 100);
    };

    // Update form data when state changes
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.value = email;
            emailRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [email]);

    useEffect(() => {
        if (passwordRef.current) {
            passwordRef.current.value = password;
            passwordRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }, [password]);

    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            <div className="relative">
                <Form
                    {...AuthenticatedSessionController.store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="email">Email address</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleInputFocus('email')}
                                            className="flex items-center gap-2 text-xs"
                                        >
                                            <Keyboard className="h-3 w-3" />
                                            Keyboard
                                        </Button>
                                    </div>
                                    <Input
                                        ref={emailRef}
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => handleInputFocus('email')}
                                        onBlur={handleInputBlur}
                                        className={`${activeInput === 'email' ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleInputFocus('password')}
                                                className="flex items-center gap-2 text-xs"
                                            >
                                                <Keyboard className="h-3 w-3" />
                                                Keyboard
                                            </Button>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                    </div>
                                    <Input
                                        ref={passwordRef}
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => handleInputFocus('password')}
                                        onBlur={handleInputBlur}
                                        className={`${activeInput === 'password' ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-4 w-full"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Log in
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink href={register()} tabIndex={5}>
                                    Sign up
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                {/* Keyboard Overlay */}
                {isKeyboardVisible && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
                        <div className="w-full bg-white rounded-t-lg shadow-lg kiosk-keyboard">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-2">
                                    <Keyboard className="h-5 w-5" />
                                    <span className="font-medium">
                                        Kiosk Keyboard - {activeInput === 'email' ? 'Email' : 'Password'}
                                    </span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleKeyboardClose}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Close
                                </Button>
                            </div>
                            
                            {/* Current input display */}
                            <div className="p-4 border-b bg-gray-50">
                                <Label className="text-sm text-gray-600">
                                    {activeInput === 'email' ? 'Email' : 'Password'}:
                                </Label>
                                <div className="mt-1 p-2 bg-white border rounded text-sm font-mono">
                                    {activeInput === 'email' 
                                        ? email || 'Type your email...'
                                        : password ? '•'.repeat(password.length) : 'Type your password...'
                                    }
                                </div>
                            </div>

                            <KioskKeyboard
                                isVisible={true}
                                value={activeInput === 'email' ? email : password}
                                onChange={activeInput === 'email' ? setEmail : setPassword}
                                onClose={handleKeyboardClose}
                                onKeyPress={handleKeyPress}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}
