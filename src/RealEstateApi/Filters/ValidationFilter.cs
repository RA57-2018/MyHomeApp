using FluentValidation;

namespace RealEstateApi.Filters
{
    public class ValidationFilter<T> : IEndpointFilter where T : class
    {
        private IValidator<T> validator;
        public ValidationFilter(IValidator<T> validator)
        {
            this.validator = validator;
        }
        public async ValueTask<object?> InvokeAsync(
            EndpointFilterInvocationContext context, EndpointFilterDelegate next)
        {
            var validatableObject = context.Arguments.
                FirstOrDefault(x => x.GetType() == typeof(T)) as T;
            if (validatableObject == null)
            {
                return Results.BadRequest();
            }

            var validationResults = await validator.ValidateAsync(validatableObject);

            if (!validationResults.IsValid)
            {
                return Results.BadRequest(validationResults.Errors);
            }
            return await next(context);
        }
    }
}
