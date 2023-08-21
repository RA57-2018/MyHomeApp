using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Contracts.Repositories;
using RealEstateApi.Contracts.Services;
using RealEstateApi.Model;
using Stripe;

namespace RealEstateApi.Infrastructure.Services
{
    public class AdvertisementService : IAdvertisementService
    {

        private readonly IAdvertisementRepository _advertisementRepository;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AdvertisementService(IAdvertisementRepository advertisementRepository, IUserService userService, IMapper mapper)
        {
            _advertisementRepository = advertisementRepository;
            _userService = userService;
            _mapper = mapper;
        }
        private async Task<Advertisement> AddAdvertisementAsync(Advertisement advertisement)
        {
            advertisement.ImageId = new List<int>();
            advertisement.CreatedBy = "";
            advertisement.UpdatedBy = "";
            Advertisement newAdvertisement = await _advertisementRepository.AddAdvertisementAsync(advertisement);
            return newAdvertisement;
        }

        public async Task BuyPointsAsync(int points, string id)
        {
            await _advertisementRepository.BuyPointsAsync(points, id);
        }

        public async Task<IResult> ChooseAdvertisementAsync(IdDto ids)
        {
            return await _advertisementRepository.ChooseAdvertisementAsync(ids);
        }

        public async Task<Advertisement> GetAdvertisementByIdAsync(int id)
        {
            return await _advertisementRepository.GetAdvertisementByIdAsync(id);
        }

        public async Task<IEnumerable<Advertisement>> GetAllAdvertisementBySearchAsync(AdvertisementDto search)
        {
            return await _advertisementRepository.GetAllAdvertisementBySearchAsync(search);
        }

        public async Task<IEnumerable<Advertisement>> GetAllAdvertisementsAsync()
        {
            return await _advertisementRepository.GetAllAdvertisementsAsync();
        }

        public async Task<Advertisement> GetLast()
        {
            return await _advertisementRepository.GetLast();
        }

        public async Task<Advertisement> GetIdAdvertisementAsync(int idAdvertisement)
        {
            return await _advertisementRepository.GetIdAdvertisementAsync(idAdvertisement);
        }

        public async Task<IEnumerable<Advertisement>> GetChosenAdvertisementsAsync(string id)
        {
            return await _advertisementRepository.GetChosenAdvertisementsAsync(id);
        }

        public async Task<IEnumerable<Advertisement>> GetMyAdvertisementsAsync(string id)
        {
            return await _advertisementRepository.GetMyAdvertisementsAsync(id);
        }

        public async Task<IEnumerable<Advertisement>> Searching(AdvertisementDto advertisementDto)
        {
            return await _advertisementRepository.Searching(advertisementDto);
        }

        public async Task<Advertisement> PublishAdvertisementAsync(PublishAdvertisementDto publishAdvertisementDto)
        {
            Advertisement advertisement = SetAdvertisement(publishAdvertisementDto);
            return await AddAdvertisementAsync(advertisement);
        }

        private Advertisement SetAdvertisement(PublishAdvertisementDto publishAdvertisementDto)
        {
            Advertisement advertisement = _mapper.Map<Advertisement>(publishAdvertisementDto);
            return advertisement;
        }

        public async Task<IEnumerable<Advertisement>> FastSearch(FastSearchDto fastSearchDto)
        {
            return await _advertisementRepository.FastSearch(fastSearchDto);
        }

        public async Task<IEnumerable<Advertisement>> LocationSearch(LocationSearchDto locationSearchDto)
        {
            return await _advertisementRepository.LocationSearch(locationSearchDto);
        }

        public async Task<PaymentIntent> CreateCharge(PaymentDto paymentDto)
        {
            StripeConfiguration.ApiKey = "sk_test_51NMcj5EAasHKTiDVDe6n0imvhGQm2C7GfbE7X2zGTuCY6SGUUzzIa0mykIEcI4b25JhDce04lbfiVlUMMdu79rnM00htngB7pP";

            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(paymentDto.Amount * 100), // Amount in dinars
                Currency = "usd",   // USD
                PaymentMethodTypes = new List<string> { "card" },
                Description = "Payment description",
                StatementDescriptor = "Payment descriptor",
                CaptureMethod = "automatic" // Set to "manual" if you want to authorize only
            };

            var service = new PaymentIntentService();
            PaymentIntent paymentIntent;

            try
            {
                paymentIntent = await service.CreateAsync(options);

                User user = await _userService.GetUserByIdAsync(paymentDto.IdUser);
                user.Points += paymentDto.Amount;
                await _userService.EditUserAsync(user);

                return paymentIntent;
            }
            catch (StripeException stripeEx)
            {
                Console.WriteLine(stripeEx.Message);
            }

            return null;
        }

        public async Task<IEnumerable<Advertisement>> GetSearchedAdvertisementsAsync(SearchDto s)
        {
            return await _advertisementRepository.GetSearchedAdvertisementsAsync(s);
        }

        public async Task<IEnumerable<Image>> GetImageByAdvertisement(int idAdv)
        {
            return await _advertisementRepository.GetImageByAdvertisement(idAdv); 
        }

        public async Task<IResult> UploadImage(int realEstateId, [FromForm] IFormFile file)
        {
            return await _advertisementRepository.UploadImage(realEstateId, file);
        }
    }
}
