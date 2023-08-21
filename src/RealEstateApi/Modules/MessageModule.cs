using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Features.MessageFeatures;
using RealEstateApi.Model;

namespace RealEstateApi.Modules
{
    public class MessageModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/v1/messages", async (IMediator mediator) =>
            {
                return Results.Ok(await mediator.Send(new GetMessages.Request()));
            });

            app.MapGet("/api/v1/messages/getMessageById/{id}", async (IMediator mediator, int id) =>
            {
                return Results.Ok(await mediator.Send(new GetMessageById.Request(id)));
            });

            app.MapGet("/api/v1/messages/getMyMessages/{id}", async (IMediator mediator, string id) =>
            {
                return Results.Ok(await mediator.Send(new GetMyMessages.Request(id)));
            });

            app.MapDelete("/api/v1/messages/delete/{id}", async (int id, CoreContext db) =>
            {
                if (await db.Messages.FindAsync(id) is Messages m)
                {
                    db.Messages.Remove(m);
                    await db.SaveChangesAsync();
                    return Results.Ok(m);
                }
                return Results.NotFound();
            });

            app.MapPost("/api/v1/messages/sendMessage", async 
                (IMediator mediator, MessageDto newMessage) =>
            {
                return Results.Ok(await mediator
                    .Send(new AddMessage.Request(newMessage)));
            });

            app.MapPut("/api/v1/messages/response/{id}", async (int id, MessageResponse responseMessage, CoreContext db) =>
            {
                var todo = await db.Messages.FindAsync(id);

                if (todo is null) return Results.NotFound();

                todo.ResponseMessage = responseMessage.ResponseMessage;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapPut("/api/v1/messages/request/{id}", async (int id, MessageRequest requestMessage, CoreContext db) =>
            {
                var todo = await db.Messages.FindAsync(id);

                if (todo is null) return Results.NotFound();

                todo.RequestMessage = requestMessage.RequestMessage;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapPut("/api/v1/messages/editMessage/{id}", async (int id, EditMessage message, CoreContext db) =>
            {
                var todo = await db.Messages.FindAsync(id);

                if (todo is null) return Results.NotFound();

                todo.CreatedBy = message.Sender;
                todo.UpdatedBy = message.Responser;
                todo.RequestMessage = message.RequestMessage;
                todo.ResponseMessage = message.ResponseMessage;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });
        }
    }
}
