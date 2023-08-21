using RealEstateApi.Interfaces;

namespace RealEstateApi.Model
{
    public class Messages : IIdentifiedObject<int>, ITimestampedObject
    {
        public string RequestMessage { get; set; }
        public string ResponseMessage { get; set; }

        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string Sender { get; set; }
        public string Replier { get; set; }

        public Messages() { }
        public Messages(string requestMessage, string responseMessage, bool isDeleted, string createdBy, string updatedBy, string sender, string replier)
        {
            RequestMessage = requestMessage;
            ResponseMessage = responseMessage;
            IsDeleted = isDeleted;
            CreatedBy = createdBy;
            UpdatedBy = updatedBy;
            Sender = sender;
            Replier = replier;
        }
    }
}
