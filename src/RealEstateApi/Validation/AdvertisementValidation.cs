using FluentValidation;
using RealEstateApi.Model;

namespace RealEstateApi.Validation
{
    public class AdvertisementValidation : AbstractValidator<Advertisement>
    {
        public AdvertisementValidation()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Tilte can't be empty")
                .Matches("^[a-zA-Z ]*$");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description can't be empty")
                .Matches("^[a-zA-Z ]*$");
        }
    }
}
