using RealEstateApi.Contracts.Mappers;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Infrastructure.Repositories;
using RealEstateApi.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using RealEstateApi;
using Carter;
using FluentValidation.AspNetCore;
using Stripe;
using RealEstateApi.Model;
using Quartz;
using Quartz.Impl;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "CorsPolicy",
        builder => builder.SetIsOriginAllowed(origin => true)
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.ToString());
});

StripeConfiguration.ApiKey = "sk_test_51NMcj5EAasHKTiDVDe6n0imvhGQm2C7GfbE7X2zGTuCY6SGUUzzIa0mykIEcI4b25JhDce04lbfiVlUMMdu79rnM00htngB7pP";

var connectionString = builder.Configuration.GetValue<string>("ConnectionString");
connectionString += ";Include Error Detail=true";

builder.Services.AddDbContext<CoreContext>(options => options.UseNpgsql(connectionString));

//repositories
builder.Services.AddTransient<IAdvertisementRepository, AdvertisementRepository>();
builder.Services.AddTransient<IMessageRepository, MessageRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();

builder.Services.Configure<SMTPConfigModel>(builder.Configuration.GetSection("SMTPConfig"));

//services
builder.Services.AddTransient<IAdvertisementService, AdvertisementService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IMessageService, MessageService>();
builder.Services.AddTransient<IUserService, UserService>();

builder.Services.AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<IAdvertisementService>());
builder.Services.AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<IMessageService>());
builder.Services.AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<IUserService>());

builder.Services.AddMediatR(x => x.RegisterServicesFromAssemblyContaining<IMessageService>());

builder.Services.AddCarter();

var mapper = new AutoMapper.MapperConfiguration(cfg =>
{
    cfg.AddProfile(new AdvertisementProfile());
    cfg.AddProfile(new LocationProfile());
    cfg.AddProfile(new MessageProfile());
    cfg.AddProfile(new UserProfile());
}).CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddHttpClient("ServiceOneNotify");

var app = builder.Build();

var schedulerFactory = new StdSchedulerFactory();
var scheduler = await schedulerFactory.GetScheduler();
await scheduler.Start();

var jobDetail = JobBuilder.Create<CheckAdvertisementsJob>()
    .WithIdentity("checkAdvertisementsJob", "advertisementGroup")
    .Build();

var trigger = TriggerBuilder.Create()
    .WithIdentity("checkAdvertisementsTrigger", "advertisementGroup")
    .WithCronSchedule("0 0 * * * ?") // Runs every day at 00:00
    .Build();

await scheduler.ScheduleJob(jobDetail, trigger);

//Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("CorsPolicy");

app.MapCarter();

app.UseRouting();

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.Run();
