export function clearSessionAndRedirect() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("accessToken");
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath && currentPath !== "/auth/signin" && currentPath !== "/") {
            window.location.href = `/auth/signin?redirect=${encodeURIComponent(currentPath)}`;
        } else {
            window.location.href = "/auth/signin";
        }
    }
}