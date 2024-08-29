import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

interface ButtonSubmitProps {
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
    buttonText: string;
    className?: string;
    onClick?: () => void;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ submitStatus, buttonText, className, onClick }) => {
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

    const getButtonClass = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-500 hover:bg-green-600';
            case 'error':
                return 'bg-red-500 hover:bg-red-600';
            default:
                return '';
        }
    };

    return (
        <Button
            type="submit"
            onClick={onClick}
            disabled={submitStatus === 'loading'}
            className={`${className} ${getButtonClass()}`}
        >
            {getButtonContent()}
        </Button>
    );
};

export default ButtonSubmit;
