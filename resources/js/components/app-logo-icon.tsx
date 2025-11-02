import logo from '@/image/kiosk-logo.png';
import { HTMLAttributes } from 'react';

export default function AppLogoIcon(props: HTMLAttributes<HTMLImageElement>) {
    return <img {...props} src={logo} alt="Kiosk Logo" />;
}
