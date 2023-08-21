using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Contracts.Repositories
{
    public interface IAdvertisementRepository
    {
        Task<Advertisement> AddAdvertisementAsync(Advertisement advertisement);
        Task<Advertisement> GetIdAdvertisementAsync(int idAdvertisement);
        Task<IEnumerable<Advertisement>> GetSearchedAdvertisementsAsync(SearchDto s);
        Task<IEnumerable<Advertisement>> GetAllAdvertisementsAsync();
        Task<Advertisement> GetLast();
        Task<IEnumerable<Advertisement>> GetAllAdvertisementBySearchAsync(AdvertisementDto search);
        Task<Advertisement> GetAdvertisementByIdAsync(int id);
        Task<IEnumerable<Advertisement>> GetChosenAdvertisementsAsync(string id);
        Task<IEnumerable<Advertisement>> GetMyAdvertisementsAsync(string id);
        Task BuyPointsAsync(int points, string id);
        Task<IResult> ChooseAdvertisementAsync(IdDto ids);
        Task<IEnumerable<Advertisement>> Searching(AdvertisementDto advertisementDto);
        Task<IEnumerable<Advertisement>> FastSearch(FastSearchDto fastSearchDto);
        Task<IEnumerable<Advertisement>> LocationSearch(LocationSearchDto locationSearchDto);
        Task<IEnumerable<Image>> GetImageByAdvertisement(int idAdv);
        Task<IResult> UploadImage(int realEstateId, [FromForm] IFormFile file);
        Task<IEnumerable<Advertisement>> GetAdvertisementsOlderThanDateAsync(DateTime date);
    }
}
