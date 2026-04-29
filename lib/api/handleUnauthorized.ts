export function clearSessionAndRedirect() {
    localStorage.removeItem("user");
    window.location.href = "/auth/signin";
}