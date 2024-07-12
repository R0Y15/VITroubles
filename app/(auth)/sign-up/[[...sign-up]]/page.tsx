import { BackgroundBeams } from '@/components/ui/background-beams';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
    return (
        <>
            <div className='z-20'>
                <SignUp />
            </div>
            <div className="z-0">
                <BackgroundBeams />
            </div>
        </>
    );
}