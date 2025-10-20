"use client"

import RegisterForm from "@/Component/Register"



export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="w-full max-w-md  p-8">
                <RegisterForm />
            </div>
        </div>
    );

}
