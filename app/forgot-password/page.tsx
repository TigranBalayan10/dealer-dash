// app/forgot-password/page.tsx
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-5">Forgot Password</h1>
            <ForgotPasswordForm />
        </div>
    )
}