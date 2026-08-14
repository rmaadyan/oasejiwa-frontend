export function clearSessionAndRedirect() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        window.location.href = "/auth/signin";
    }
}