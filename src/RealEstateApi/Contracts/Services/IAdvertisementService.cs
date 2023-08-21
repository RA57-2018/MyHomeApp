using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;
using Stripe;

namespace RealEstateApi.Contracts.Services
{
    public interface IAdvertisementService
    {
        Task<IEnumerable<Advertisement>> GetAllAdvertisementsAsync();
        Task<Advertisement> GetIdAdvertisementAsync(int idAdvertisement);
        Task<IEnumerable<Advertisement>> GetSearchedAdvertisementsAsync(SearchDto s);
        Task<IEnumerable<Advertisement>> GetAllAdvertisementBySearchAsync(AdvertisementDto search);
        Task<Advertisement> GetAdvertisementByIdAsync(int id);
        Task<Advertisement> GetLast();
        Task<IEnumerable<Advertisement>> GetChosenAdvertisementsAsync(string id);
        Task<IEnumerable<Advertisement>> GetMyAdvertisementsAsync(string id);
        Task BuyPointsAsync(int points, string id);
        Task<IResult> ChooseAdvertisementAsync(IdDto ids);
        Task<IEnumerable<Advertisement>> Searching(AdvertisementDto advertisementDto);
        Task<Advertisement> PublishAdvertisementAsync(PublishAdvertisementDto publishAdvertisementDto);
        Task<IEnumerable<Advertisement>> FastSearch(FastSearchDto fastSearchDto);
        Task<IEnumerable<Advertisement>> LocationSearch(LocationSearchDto locationSearchDto);
        Task<PaymentIntent> CreateCharge(PaymentDto paymentDto);
        Task<IEnumerable<Image>> GetImageByAdvertisement(int idAdv);
        Task<IResult> UploadImage(int realEstateId, [FromForm] IFormFile file);
    }
}
