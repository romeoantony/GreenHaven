using GreenHaven.API.Middleware;

namespace GreenHaven.API.Extensions;

public static class SecurityHeadersExtensions
{
    public static void ConfigureSecurityHeaders(this IApplicationBuilder app)
    {
        app.UseMiddleware<SecurityHeadersMiddleware>();
    }
}
