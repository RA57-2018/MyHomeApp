using Quartz;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Model.Enum;

namespace RealEstateApi.Model
{
    public class CheckAdvertisementsJob : IJob
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly CoreContext _context;
        private readonly IAdvertisementRepository _advertisementRepository;

        public CheckAdvertisementsJob(IServiceScopeFactory serviceScopeFactory,
            CoreContext context,
            IAdvertisementRepository advertisementRepository)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _context = context;
            _advertisementRepository = advertisementRepository;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var serviceProvider = scope.ServiceProvider;

                DateTime oneWeekAgo = DateTime.Now.AddDays(-7);
                DateTime twoWeeksAgo = DateTime.Now.AddDays(-14);

                var oneWeekOld = await _advertisementRepository
                    .GetAdvertisementsOlderThanDateAsync(oneWeekAgo);
                var twoWeeksOld = await _advertisementRepository
                    .GetAdvertisementsOlderThanDateAsync(twoWeeksAgo);

                foreach (var advertisement in oneWeekOld)
                {
                    if (advertisement.Status == StatusType.Top)
                    {
                        advertisement.Status = StatusType.Standard;
                    }
                }

                foreach (var advertisement in twoWeeksOld)
                {
                    if (advertisement.Status == StatusType.Premium)
                    {
                        advertisement.Status = StatusType.Standard;
                    }
                }

                await _context.SaveChangesAsync();
            }
        }
    }
}
