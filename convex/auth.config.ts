const convexAuthConfig = {
    providers: [
        {
            domain: process.env.CLERK_APP_DOMAIN,
            applicationID: "convex",
        },
    ],
};

export default convexAuthConfig;
