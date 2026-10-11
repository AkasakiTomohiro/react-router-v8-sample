import { redirect } from "react-router";

export async function isLoggedIn() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
        throw redirect("/login");
    }
}

export async function isLoggedOut() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
        throw redirect("/");
    }
}
