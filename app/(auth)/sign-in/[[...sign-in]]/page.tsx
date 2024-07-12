import { BackgroundBeams } from '@/components/ui/background-beams';
import { SignIn } from '@clerk/nextjs';

export default function Page() {
    return (
        <>
            <div className='z-20'>
                <SignIn />
            </div>
            <div className="z-0">
                <BackgroundBeams />
            </div>
        </>
    );
}