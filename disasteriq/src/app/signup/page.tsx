"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/app/components/AuthInput";


const signupSchema = z.object({
name: z.string().min(3),
email: z.string().email(),
password: z.string().min(6),
});


type SignupData = z.infer<typeof signupSchema>;


export default function SignupPage() {
const router = useRouter();
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupData>({
resolver: zodResolver(signupSchema),
});


const onSubmit = async (data: SignupData) => {
console.log("Signup:", data);
router.push("/dashboard");
};

return (
<main className="min-h-screen flex items-center justify-center bg-gray-100">
<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 w-96 rounded shadow space-y-4">
<h1 className="text-2xl font-bold text-center">Create Account</h1>
<AuthInput label="Name" registration={register("name")} error={errors.name} />
<AuthInput label="Email" type="email" registration={register("email")} error={errors.email} />
<AuthInput label="Password" type="password" registration={register("password")} error={errors.password} />
<button disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded">
{isSubmitting ? "Signing up..." : "Sign Up"}
</button>
</form>
</main>
);
}