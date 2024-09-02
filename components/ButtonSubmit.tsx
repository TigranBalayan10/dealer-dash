// ButtonSubmit.tsx

import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

interface ButtonSubmitProps {
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
    buttonText: string;
    className?: string;
    onClick?: () => void;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
    submitStatus,
    buttonText,
    className,
    onClick,
}) => {
    const getButtonContent = () => {
        switch (submitStatus) {
            case 'loading':
                return (
                    <>
                        <Icon icon="gg:spinner-two-alt" className="h-5 w-5 mr-2 animate-spin" />
                        {buttonText}
                    </>
                );
            case 'success':
                return (
                    <>
                        <Icon icon="gg:check-o" className="h-5 w-5 mr-2 text-secondary" />
                        Success
                    </>
                );
            case 'error':
                return (
                    <>
                        <Icon icon="gg:danger" className="h-5 w-5 mr-2 text-red-500" />
                        Failed
                    </>
                );
            default:
                return buttonText;
        }
    };

    return (
        <Button
            type="submit"
            onClick={onClick}
            disabled={submitStatus === 'loading'}
            className={`${className}`}
        >
            {getButtonContent()}
        </Button>
    );
};

export default ButtonSubmit;
