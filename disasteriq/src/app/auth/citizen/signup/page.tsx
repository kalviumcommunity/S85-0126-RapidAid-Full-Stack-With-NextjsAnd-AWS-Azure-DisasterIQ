"use client";

export default function CitizenSignup() {
  return (
    <div className="mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Citizen Signup</h1>

      <form className="space-y-4">
        <input placeholder="Full Name" required className="input" />
        <input type="email" placeholder="Email" required className="input" />
        <input type="password" placeholder="Password" required className="input" />

        <button className="w-full rounded bg-primary py-2 text-primary-foreground">
          Sign Up
        </button>
      </form>
    </div>
  );
}
