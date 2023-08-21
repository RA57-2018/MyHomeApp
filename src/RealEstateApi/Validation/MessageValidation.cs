using FluentValidation;
using RealEstateApi.Contracts.Data;
using RealEstateApi.Model;

namespace RealEstateApi.Validation
{
    public class MessageValidation : AbstractValidator<Messages>  //or MessageDto???
    {
        public MessageValidation()
        {
            RuleFor(x => x.RequestMessage)
                .Matches("^[a-zA-Z0-9 ]*$");
            RuleFor(x => x.ResponseMessage)
                .Matches("^[a-zA-Z0-9 ]*$");
        }
    }
}
