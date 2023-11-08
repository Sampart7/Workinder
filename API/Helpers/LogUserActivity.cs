using System.Security.Claims;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            if (!resultContext.HttpContext.User.Identity!.IsAuthenticated) return;
            
            var userEmail = resultContext.HttpContext.User.GetEmail();

            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();

            var user = await repo.UserRepository.GetUserByEmailAsync(userEmail);
            user.LastActive = DateTime.UtcNow;

            await repo.Complete();
        }
    }
}