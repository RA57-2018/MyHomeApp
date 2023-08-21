using FluentValidation;
using RealEstateApi.Model;

namespace RealEstateApi.Validation
{
    public class UserValidation : AbstractValidator<User>
    {
        public UserValidation()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name can't be empty")
                .Matches("^[a-zA-Z ]*$");
            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name can't be empty")
                .Matches("^[a-zA-Z ]*$");
        }
    }
}
