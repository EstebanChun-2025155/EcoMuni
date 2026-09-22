import session from "express-session";

declare module "express-session" {
    interface SessionData {
        idUsuario?: number;
    }
}

const secreto = process.env.SESSION_SECRET;

if (!secreto || !/^[a-f0-9]{64}$/i.test(secreto)) {
    throw new Error("SESSION_SECRET debe contener la clave hexadecimal de 64 caracteres.");
}

if (process.env.NODE_ENV === "production") {
    throw new Error("Configura sesiones persistentes y HTTPS antes de publicar.");
}

export const nombreCookie = "ecomuni.sid";

export const opcionesCookie = {
    httpOnly: true,
    secure: false,
    sameSite: "strict" as const,
    path: "/api"
};

export const middlewareSesion = session({
    name: nombreCookie,
    secret: secreto,
    resave: false,
    saveUninitialized: false,
    cookie: {
        ...opcionesCookie,
        maxAge: 60 * 60 * 1000
    }
});