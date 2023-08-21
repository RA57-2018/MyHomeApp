using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Features.AdvertisementFeatures;
using RealEstateApi.Model;

namespace RealEstateApi.Modules
{
    public class AdvertisementModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapGet("/api/v1/advertisement", async (IMediator mediator) =>
            {
                return Results.Ok(await mediator.Send(new GetAdvertisement.Request()));
            });

            app.MapPost("/api/v1/advertisement/chooseAdvertisement", async (IMediator mediator, [FromBody]IdDto id) =>
            {
                return Results.Ok(await mediator.Send(new ChooseAdvertisement.Request(id)));
            });

            app.MapPost("/api/v1/advertisement/payment-intent", async (IMediator mediator, [FromBody]PaymentDto paymentDto) =>
            {
                return Results.Ok(await mediator.Send(new BuyPoints.Request(paymentDto)));
            });

            app.MapGet("/api/v1/advertisement/getAdvertisement/{idAdvertisement}", async (IMediator mediator, int idAdvertisement) =>
            {
                return Results.Ok(await mediator.Send(new GetIdAdvertisement.Request(idAdvertisement)));
            });

            app.MapGet("/api/v1/advertisement/getAllAdvertisements", async (IMediator mediator) =>
            {
                return Results.Ok(await mediator.Send(new GetAllAdvertisements.Request()));
            });

            app.MapGet("/api/v1/advertisement/getLastElement", async (IMediator mediator) =>
            {
                return Results.Ok(await mediator.Send(new GetLast.Request()));
            });

            app.MapPost("/api/v1/advertisement/getSearchedAdvertisements",
                async (IMediator mediator, SearchDto s) =>
            {
                return Results.Ok(await mediator.Send(new GetSearchedAdvertisements.Request(s)));
            });

            app.MapGet("/api/v1/advertisement/getChosenAdvertisement/{id}", async (IMediator mediator, string id) =>
            {
                return Results.Ok(await mediator.Send(new GetChosenAdvertisement.Request(id)));
            });

            app.MapGet("/api/v1/advertisement/getMyAdvertisements/{id}", async (IMediator mediator, [FromRoute]string id) =>
            {
                return Results.Ok(await mediator.Send(new GetMyAdvertisements.Request(id)));
            });

            app.MapGet("/api/v1/advertisement/images/{idAdv}", async (int idAdv, CoreContext db) =>
            {
                var images = db.Images.Where(image => image.AdvertisementId == idAdv).ToList();
                return Results.Ok(images);
            });

            app.MapPost("/api/v1/advertisement/publishAdvertisement", async (IMediator mediator, PublishAdvertisementDto publishAdvertisementDto) =>
            {
                return Results.Ok(await mediator.Send(new PublishAdvertisement.Request(publishAdvertisementDto)));
            });

            app.MapPost("/api/v1/advertisement/uploadImage", async (IMediator mediator, [FromQuery] int idAdv, [FromForm] IFormFile file, CoreContext db) =>
            {
                byte[] imageData;
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    imageData = memoryStream.ToArray();
                }

                int latestImageId = db.Images.OrderByDescending(image => image.Id).Select(image => image.Id).FirstOrDefault();
                int newImageId = latestImageId + 1;

                var image = new Image
                {
                    Id = newImageId,
                    AdvertisementId = idAdv,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    Content = imageData
                };

                var advertisement = await db.Advertisements.FindAsync(idAdv);
                if (advertisement is null) return Results.NotFound();

                if (advertisement.Images == null)
                    advertisement.Images = new List<Image>();

                advertisement.Images.Add(image);
                advertisement.ImageId.Add(newImageId);

                db.Images.Add(image);
                await db.SaveChangesAsync();

                return Results.Ok(image.Id);
            });

            app.MapPost("/api/v1/advertisement/fastSearch", async (IMediator mediator, [FromBody]FastSearchDto fastSearchDto) =>
            {
                return Results.Ok(await mediator.Send(new FastSearch.Request(fastSearchDto)));
            });

            app.MapPost("/api/v1/advertisement/locationSearch", async (IMediator mediator, [FromBody] LocationSearchDto locationSearchDto) =>
            {
                return Results.Ok(await mediator.Send(new LocationSearch.Request(locationSearchDto)));
            });

            app.MapPut("/api/v1/advertisement/publishPay/{idAdvertisement}", async (IMediator mediator, int idAdvertisement, PublishPayDto dto, CoreContext db) =>
            {
                var todo = await db.Advertisements.FindAsync(idAdvertisement);
                var usr = await db.Users.FindAsync(dto.UserId);


                if (todo is null) return Results.NotFound();
                var premium = 4;
                var top = 6;
                var standard = 0;

                todo.IsPublished = dto.IsPublished;
                todo.Status = (Model.Enum.StatusType)dto.Values;
                if (dto.Values == 2)
                {
                    usr.Points -= premium;
                } else if (dto.Values == 3)
                {
                    usr.Points -= top;
                }
                else
                {
                    usr.Points += standard;
                }

                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapPut("/api/v1/advertisement/editAdvertisement/{idAdvertisement}", async (IMediator mediator, int idAdvertisement, PublishAdvertisementDto dto, CoreContext db) =>
            {
                var todo = await db.Advertisements.FindAsync(idAdvertisement);

                if (todo is null) return Results.NotFound();

                todo.Title = dto.Title;
                todo.Description = dto.Description;
                todo.RealiseDate = dto.RealiseDate;
                todo.Quadrature = dto.Quadrature;
                todo.AdvertisementType = dto.AdvertisementType;
                todo.Type = dto.Type;
                todo.Status = dto.Status;
                todo.Price = dto.Price;

                await db.SaveChangesAsync();

                return Results.NoContent();
            });

            app.MapDelete("/api/v1/advertisement/delete/{idAdvertisement}", async (int idAdvertisement, CoreContext db) =>
            {
                if (await db.Advertisements.FindAsync(idAdvertisement) is Advertisement a)
                {
                    db.Advertisements.Remove(a);
                    await db.SaveChangesAsync();
                    return Results.Ok(a);
                }
                return Results.NotFound();
            });
        }
    }
}
