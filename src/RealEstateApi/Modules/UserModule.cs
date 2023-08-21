using Carter;
using MediatR;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Features.UserFeatures;
using RealEstateApi.Model;

namespace RealEstateApi.Modules
{
    public class UserModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {

            app.MapGet("/api/v1/user/allUsers", async (IMediator mediator) =>
            {
                return Results.Ok(await mediator.Send(new GetAllUsers.Request()));
            });

            app.MapGet("/api/v1/user/user/{id}", async (IMediator mediator, string id) =>
            {
                return Results.Ok(await mediator.Send(new GetUserById.Request(id)));
            });

            app.MapDelete("/api/v1/user/delete/{id}", async (string id, CoreContext db) =>
            {
                if (await db.Users.FindAsync(id) is User u)
                {
                    db.Users.Remove(u);
                    await db.SaveChangesAsync();
                    return Results.Ok(u);
                }
                return Results.NotFound();
            });

            app.MapPost("/api/v1/user/registration", async (IMediator mediator, UserRegistration user) =>
            {
                return Results.Ok(await mediator.Send(new Register.Request(user)));
            });

            app.MapPost("/api/v1/token", async (IMediator mediator, UserLoginDto user) =>
            {
                return Results.Ok(await mediator.Send(new Login.Request(user)));
            });

            app.MapPut("/api/v1/user/editUser/{id}", async (string id, EditUserDto user, CoreContext db) =>
            {
                var todo = await db.Users.FindAsync(id);

                if (todo is null) return Results.NotFound();

                todo.FirstName = user.FirstName;
                todo.LastName = user.LastName;
                todo.Address = user.Address;
                todo.PhoneNumber = user.PhoneNumber;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
