"use client";

export default function NgoSignup() {
  return (
    <div className="mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">NGO Signup</h1>

      <form className="space-y-4">
        <input placeholder="Admin Name" required className="input" />
        <input type="email" placeholder="Admin Email" required className="input" />
        <input type="password" placeholder="Password" required className="input" />

        <input placeholder="NGO Name" required className="input" />
        <input placeholder="Registration Number" required className="input" />
        <input placeholder="Contact Phone" required className="input" />

        <button className="w-full rounded bg-primary py-2 text-primary-foreground">
          Register NGO
        </button>
      </form>
    </div>
  );
}
