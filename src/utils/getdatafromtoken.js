import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const token = request.cookies.get("refreshToken")?.value;
        if (!token) {
            throw new Error("No refresh token found");
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return decoded?._id || null;
    } catch (error) {
        console.error("Error in getDataFromToken:", error.message || error);
        return null;
    }
};
